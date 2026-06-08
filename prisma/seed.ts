import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await hash("Admin123!", 12);
  const demoPassword = await hash("Demo123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@relurl.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@relurl.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("Created admin user:", admin.email);

  const demo = await prisma.user.upsert({
    where: { email: "demo@relurl.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@relurl.com",
      password: demoPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });
  console.log("Created demo user:", demo.email);

  const sampleUrls = [
    { url: "https://nextjs.org/docs", slug: "next-docs", title: "Next.js Documentation" },
    { url: "https://react.dev/reference/react", slug: "react-ref", title: "React Reference" },
    { url: "https://github.com/vercel/next.js", slug: "next-github", title: "Next.js GitHub" },
    { url: "https://tailwindcss.com/docs", slug: "tw-docs", title: "Tailwind Docs" },
    { url: "https://prisma.io/docs", slug: "prisma-docs", title: "Prisma Docs" },
    { url: "https://stripe.com/docs/api", slug: "stripe-api", title: "Stripe API" },
    { url: "https://www.typescriptlang.org/docs", slug: "ts-docs", title: "TypeScript Docs" },
    { url: "https://developer.mozilla.org", slug: "mdn", title: "MDN Web Docs" },
  ];

  const now = new Date();

  for (let i = 0; i < sampleUrls.length; i++) {
    const link = await prisma.shortLink.upsert({
      where: { slug: sampleUrls[i].slug },
      update: {},
      create: {
        url: sampleUrls[i].url,
        slug: sampleUrls[i].slug,
        title: sampleUrls[i].title,
        description: `Short link to ${sampleUrls[i].title}`,
        userId: demo.id,
        isActive: true,
        createdAt: new Date(now.getTime() - i * 86400000),
      },
    });

    const clickCount = Math.floor(Math.random() * 500) + 10;
    const clicks: { linkId: string; timestamp: Date; isUnique: boolean; country: string }[] = [];

    for (let j = 0; j < clickCount; j++) {
      const daysAgo = Math.floor(Math.random() * 30);
      clicks.push({
        linkId: link.id,
        timestamp: new Date(now.getTime() - daysAgo * 86400000 - Math.random() * 86400000),
        isUnique: Math.random() > 0.3,
        country: ["US", "GB", "DE", "FR", "CA", "AU", "IN", "BR", "JP", "NL"][Math.floor(Math.random() * 10)],
      });
    }

    await prisma.linkClick.createMany({ data: clicks });
    console.log(`Created ${clicks.length} clicks for /${link.slug}`);
  }

  await prisma.subscription.create({
    data: {
      userId: admin.id,
      plan: "PRO",
      status: "ACTIVE",
      stripeCustomerId: "cus_mock_admin",
      stripeSubscriptionId: "sub_mock_admin",
      currentPeriodStart: new Date(now.getTime() - 30 * 86400000),
      currentPeriodEnd: new Date(now.getTime() + 30 * 86400000),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: demo.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  console.log("Created subscriptions");

  await prisma.payment.create({
    data: {
      userId: admin.id,
      subscriptionId: (await prisma.subscription.findFirst({ where: { userId: admin.id } }))!.id,
      amount: 2900,
      currency: "usd",
      status: "SUCCEEDED",
      createdAt: new Date(now.getTime() - 30 * 86400000),
    },
  });

  console.log("Created sample payment");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
