import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then((mod) =>
      mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    );
  }
  return stripePromise;
}
