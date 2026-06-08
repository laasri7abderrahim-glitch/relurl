import { prisma } from "@/lib/prisma"

export async function createAuditLog(params: {
  userId?: string
  teamId?: string
  action: string
  entity: string
  entityId: string
  changes?: Record<string, unknown>
  ip?: string
  userAgent?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        teamId: params.teamId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        changes: params.changes ? JSON.parse(JSON.stringify(params.changes)) : undefined,
        ip: params.ip ?? null,
        userAgent: params.userAgent ?? null,
      },
    })
  } catch {
    // Audit log is non-critical, fail silently
  }
}
