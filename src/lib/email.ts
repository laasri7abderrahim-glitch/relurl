import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = "noreply@relurl.com";

export async function sendMagicLink(email: string, token: string): Promise<void> {
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/email?token=${token}`;

  if (!resend) {
    console.log(`[EMAIL] Magic link for ${email}: ${magicLink}`)
    return
  }

  await resend.emails.send({
    from,
    to: email,
    subject: "Sign in to RelURL",
    html: `
      <h1>Sign in to RelURL</h1>
      <p>Click the link below to sign in to your account:</p>
      <a href="${magicLink}" style="display:inline-block;padding:12px 24px;background:#0068FF;color:white;text-decoration:none;border-radius:6px;">Sign in</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendPasswordReset(email: string, token: string): Promise<void> {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`[EMAIL] Password reset for ${email}: ${resetLink}`)
    return
  }

  await resend.emails.send({
    from,
    to: email,
    subject: "Reset your RelURL password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0068FF;color:white;text-decoration:none;border-radius:6px;">Reset password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  });
}

export async function sendWelcome(email: string, name: string): Promise<void> {
  if (!resend) {
    console.log(`[EMAIL] Welcome email for ${email}`)
    return
  }

  await resend.emails.send({
    from,
    to: email,
    subject: "Welcome to RelURL!",
    html: `
      <h1>Welcome to RelURL, ${name}!</h1>
      <p>We're excited to have you on board. Start shortening your links and tracking their performance.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#0068FF;color:white;text-decoration:none;border-radius:6px;">Go to Dashboard</a>
    `,
  });
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
  if (!resend) {
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}`)
    return
  }

  await resend.emails.send({ from, to, subject, html })
}

export async function sendVerification(email: string, token: string): Promise<void> {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  if (!resend) {
    console.log(`[EMAIL] Verification for ${email}: ${verifyLink}`)
    return
  }

  await resend.emails.send({
    from,
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyLink}" style="display:inline-block;padding:12px 24px;background:#0068FF;color:white;text-decoration:none;border-radius:6px;">Verify email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
