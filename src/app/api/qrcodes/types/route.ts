import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const QR_TYPE_DEFINITIONS = [
  {
    id: "url",
    name: "URL",
    description: "Redirect to a website URL",
    fields: [
      { key: "url", label: "Destination URL", type: "url", required: true },
    ],
  },
  {
    id: "vcard",
    name: "vCard",
    description: "Save contact information",
    fields: [
      { key: "firstName", label: "First Name", type: "text", required: true },
      { key: "lastName", label: "Last Name", type: "text", required: false },
      { key: "organization", label: "Organization", type: "text", required: false },
      { key: "title", label: "Job Title", type: "text", required: false },
      { key: "phone", label: "Phone", type: "tel", required: false },
      { key: "email", label: "Email", type: "email", required: false },
      { key: "website", label: "Website", type: "url", required: false },
      { key: "address", label: "Address", type: "text", required: false },
    ],
  },
  {
    id: "wifi",
    name: "WiFi",
    description: "Connect to a WiFi network",
    fields: [
      { key: "ssid", label: "Network Name (SSID)", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: false },
      { key: "encryption", label: "Encryption", type: "select", required: false, options: ["WPA", "WEP", "WPA2", "WPA3", "none"] },
      { key: "hidden", label: "Hidden Network", type: "boolean", required: false },
    ],
  },
  {
    id: "text",
    name: "Text",
    description: "Display plain text",
    fields: [
      { key: "text", label: "Text Content", type: "textarea", required: true },
    ],
  },
  {
    id: "email",
    name: "Email",
    description: "Send an email",
    fields: [
      { key: "to", label: "To", type: "email", required: true },
      { key: "subject", label: "Subject", type: "text", required: false },
      { key: "body", label: "Body", type: "textarea", required: false },
    ],
  },
  {
    id: "sms",
    name: "SMS",
    description: "Send a text message",
    fields: [
      { key: "phone", label: "Phone Number", type: "tel", required: true },
      { key: "message", label: "Message", type: "textarea", required: false },
    ],
  },
]

export async function GET() {
  return NextResponse.json({ types: QR_TYPE_DEFINITIONS })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { linkId, name, type, content, design, size, format } = body

    if (!linkId || !name || !type) {
      return NextResponse.json({ error: "linkId, name, and type are required" }, { status: 400 })
    }

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const qrCode = await prisma.qrCode.create({
      data: {
        linkId,
        name,
        type,
        content: content ? JSON.stringify(content) : null,
        design: design ? JSON.stringify(design) : null,
        size: size || 300,
        format: format || "png",
      },
    })

    return NextResponse.json({ data: qrCode }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create QR code" }, { status: 500 })
  }
}
