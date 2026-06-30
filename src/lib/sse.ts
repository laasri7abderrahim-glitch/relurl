const clients = new Map<string, Set<ReadableStreamController<any>>>()

export function getClients(): Map<string, Set<ReadableStreamController<any>>> {
  return clients
}

export function addClient(userId: string, controller: ReadableStreamController<any>) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set())
  }
  clients.get(userId)!.add(controller)
}

export function removeClient(userId: string, controller: ReadableStreamController<any>) {
  clients.get(userId)?.delete(controller)
  if (clients.get(userId)?.size === 0) {
    clients.delete(userId)
  }
}

export function broadcastClick(userId: string, data: { linkId: string; timestamp: string; country?: string; device?: string; browser?: string }) {
  const userClients = clients.get(userId)
  if (!userClients) return
  const message = `data: ${JSON.stringify({ type: "click", ...data })}\n\n`
  const encoded = new TextEncoder().encode(message)
  for (const controller of userClients) {
    try {
      controller.enqueue(encoded)
    } catch {
      // Client disconnected
    }
  }
}
