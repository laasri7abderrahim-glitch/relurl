import { prisma } from "@/lib/prisma"

export type PlanType = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE"

export interface PlanLimits {
  maxLinks: number
  maxClicks: number
  maxDomains: number
  maxTeamMembers: number
  maxApiRate: number
  features: string[]
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: {
    maxLinks: 1000,
    maxClicks: 1000,
    maxDomains: 1,
    maxTeamMembers: 1,
    maxApiRate: 100,
    features: ["basic_analytics"],
  },
  PRO: {
    maxLinks: -1, // unlimited
    maxClicks: 100000,
    maxDomains: 5,
    maxTeamMembers: 5,
    maxApiRate: 1000,
    features: ["basic_analytics", "custom_domains", "team", "csv_export", "priority_support"],
  },
  BUSINESS: {
    maxLinks: -1,
    maxClicks: 1000000,
    maxDomains: 25,
    maxTeamMembers: 25,
    maxApiRate: 10000,
    features: ["basic_analytics", "custom_domains", "team", "csv_export", "dedicated_support", "advanced_integrations"],
  },
  ENTERPRISE: {
    maxLinks: -1,
    maxClicks: -1,
    maxDomains: -1,
    maxTeamMembers: -1,
    maxApiRate: -1,
    features: ["basic_analytics", "custom_domains", "team", "csv_export", "dedicated_support", "advanced_integrations", "sso", "custom_sla"],
  },
}

export async function getUserPlan(userId: string): Promise<PlanType> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  })

  if (!subscription) return "FREE"

  const plan = subscription.plan?.toUpperCase() as PlanType
  return plan in PLAN_LIMITS ? plan : "FREE"
}

export async function getUserPlanLimits(userId: string) {
  const plan = await getUserPlan(userId)
  return { plan, limits: PLAN_LIMITS[plan] }
}

export async function checkLinkLimit(userId: string): Promise<{ allowed: boolean; current: number; max: number; plan: PlanType }> {
  const { plan, limits } = await getUserPlanLimits(userId)

  if (limits.maxLinks === -1) {
    return { allowed: true, current: 0, max: -1, plan }
  }

  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const count = await prisma.shortLink.count({
    where: {
      userId,
      createdAt: { gte: currentMonth },
    },
  })

  return {
    allowed: count < limits.maxLinks,
    current: count,
    max: limits.maxLinks,
    plan,
  }
}

export async function checkClickLimit(userId: string): Promise<{ allowed: boolean; current: number; max: number; plan: PlanType }> {
  const { plan, limits } = await getUserPlanLimits(userId)

  if (limits.maxClicks === -1) {
    return { allowed: true, current: 0, max: -1, plan }
  }

  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const links = await prisma.shortLink.findMany({
    where: { userId },
    select: { id: true },
  })

  const linkIds = links.map((l) => l.id)

  if (linkIds.length === 0) {
    return { allowed: true, current: 0, max: limits.maxClicks, plan }
  }

  const count = await prisma.linkClick.count({
    where: {
      linkId: { in: linkIds },
      timestamp: { gte: currentMonth },
    },
  })

  return {
    allowed: count < limits.maxClicks,
    current: count,
    max: limits.maxClicks,
    plan,
  }
}

export function getUpgradeMessage(plan: PlanType, feature: string): string {
  const messages: Record<string, string> = {
    links: `You've reached your ${plan} plan limit for links. Upgrade to Pro for unlimited links.`,
    clicks: `You've reached your ${plan} plan limit for clicks. Upgrade to Pro for 100,000 clicks/month.`,
    domains: `You've reached your ${plan} plan limit for custom domains. Upgrade to Pro for more.`,
    team: `You've reached your ${plan} plan limit for team members. Upgrade to Pro for 5 seats.`,
  }
  return messages[feature] || `Upgrade to unlock this feature on your ${plan} plan.`
}
