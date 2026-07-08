const PADDLE_API_BASE =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com"

export function getPaddleHeaders() {
  return {
    Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
    "Content-Type": "application/json",
  }
}

export async function createPaddleCheckout(params: {
  items: { priceId: string; quantity: number }[]
  customerId?: string
  customerEmail?: string
  customData?: Record<string, string>
  successUrl: string
  cancelUrl: string
}) {
  const res = await fetch(`${PADDLE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: getPaddleHeaders(),
    body: JSON.stringify({
      items: params.items.map((i) => ({ price_id: i.priceId, quantity: i.quantity })),
      customer: params.customerId
        ? { id: params.customerId }
        : params.customerEmail
          ? { email: params.customerEmail }
          : undefined,
      custom_data: params.customData,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Paddle API error (${res.status}): ${body}`)
  }
  return res.json() as Promise<{ data: { id: string; url: string } }>
}

export async function getPaddleSubscription(subscriptionId: string) {
  const res = await fetch(`${PADDLE_API_BASE}/subscriptions/${subscriptionId}`, {
    headers: getPaddleHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to fetch Paddle subscription: ${res.status}`)
  return res.json()
}

export async function cancelPaddleSubscription(subscriptionId: string) {
  const res = await fetch(`${PADDLE_API_BASE}/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: getPaddleHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to cancel Paddle subscription: ${res.status}`)
  return res.json()
}

export async function getPaddleCustomerTransactions(customerId: string) {
  const res = await fetch(
    `${PADDLE_API_BASE}/transactions?customer_id=${customerId}`,
    { headers: getPaddleHeaders() },
  )
  if (!res.ok) throw new Error(`Failed to fetch Paddle transactions: ${res.status}`)
  return res.json()
}

export async function getPaddleCustomerPortalLink(customerId: string) {
  const res = await fetch(`${PADDLE_API_BASE}/customers/${customerId}/portal`, {
    method: "POST",
    headers: getPaddleHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to create Paddle portal link: ${res.status}`)
  return res.json() as Promise<{ data: { url: string } }>
}
