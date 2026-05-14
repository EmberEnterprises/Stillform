// ─────────────────────────────────────────────────────────────────────────
// Stillform email delivery — Resend integration
// ─────────────────────────────────────────────────────────────────────────
//
// Lightweight transactional email helper. Used for org invite delivery
// today; can be extended for password reset, billing notifications, etc.
//
// Provider: Resend (https://resend.com). Chosen for modern API, generous
// free tier, and simple DNS verification flow. If RESEND_API_KEY is not
// set in Netlify env, sendEmail is a graceful no-op — the function it's
// called from continues to succeed and the caller receives a result
// indicating the message was not sent. The org invite UI surfaces the
// copyable link regardless, so users can always share the invite by hand.
//
// Required environment variables (set in Netlify when going live):
//   RESEND_API_KEY         — your Resend API key
//   STILLFORM_EMAIL_FROM   — verified sender (e.g. "Stillform <hello@stillformapp.com>")
//
// Optional:
//   STILLFORM_EMAIL_REPLY_TO — reply-to address; defaults to from
//
// Privacy stance: this module never logs message bodies. Email addresses
// are passed through verbatim to Resend (which is the unavoidable
// recipient-data flow) and recorded in audit log entries only where
// the org surface already records target_email (e.g. invite_sent).
// ─────────────────────────────────────────────────────────────────────────

const RESEND_API_BASE = "https://api.resend.com";

const sanitizeAddress = (value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.includes("@")) return null;
  return trimmed.slice(0, 320);
};

/**
 * Send a transactional email via Resend.
 *
 * @param {Object} options
 * @param {string} options.to              - Recipient email address
 * @param {string} options.subject         - Email subject
 * @param {string} options.html            - HTML body
 * @param {string} [options.text]          - Plain-text alternative
 * @param {string} [options.from]          - Override sender (defaults to env)
 * @param {string} [options.replyTo]       - Reply-to address
 * @param {Object} [options.headers]       - Extra headers (e.g. References)
 *
 * @returns {Promise<{ sent: boolean, id?: string, error?: string, skipped?: string }>}
 *   sent=true with id when delivery succeeded.
 *   sent=false with skipped="not_configured" when no API key is set.
 *   sent=false with error="..." for delivery failures.
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text = null,
  from = null,
  replyTo = null,
  headers = null
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, skipped: "not_configured" };
  }

  const recipient = sanitizeAddress(to);
  if (!recipient) {
    return { sent: false, error: "invalid_recipient" };
  }

  const sender = from || process.env.STILLFORM_EMAIL_FROM;
  if (!sender) {
    return { sent: false, skipped: "no_sender_configured" };
  }

  const resolvedReplyTo = replyTo || process.env.STILLFORM_EMAIL_REPLY_TO || null;

  const body = {
    from: sender,
    to: [recipient],
    subject: String(subject || "").slice(0, 200),
    html: String(html || "")
  };
  if (text) body.text = String(text);
  if (resolvedReplyTo) body.reply_to = resolvedReplyTo;
  if (headers && typeof headers === "object") body.headers = headers;

  try {
    const res = await fetch(`${RESEND_API_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // Log delivery failure to stderr only (no body content logged).
      console.error("send-email-failed", {
        status: res.status,
        recipient_domain: recipient.split("@").pop(),
        detail: text.slice(0, 300)
      });
      return { sent: false, error: `delivery_${res.status}` };
    }
    const data = await res.json().catch(() => null);
    return { sent: true, id: data?.id || null };
  } catch (err) {
    console.error("send-email-network-failed", { message: err?.message || "unknown" });
    return { sent: false, error: "network_error" };
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Email templates for B2B org flows
// ─────────────────────────────────────────────────────────────────────────
//
// Templates are kept as plain functions returning { subject, html, text }
// so they're easy to read, easy to test, and don't require a template
// engine. The HTML is deliberately simple — no CSS frameworks, no
// images, no JavaScript. Renders consistently across mail clients.

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Build the org-invite email. Surfaces the privacy guarantee in the body
 * itself — the recipient knows from first touch that the inviting org
 * cannot see their practice content.
 */
export const buildOrgInviteEmail = ({
  orgName,
  inviterEmail,
  role,
  inviteUrl,
  expiresAt
}) => {
  const safeOrgName = escapeHtml(orgName || "Your organization");
  const safeInviterEmail = inviterEmail ? escapeHtml(inviterEmail) : null;
  const safeRole = role === "admin" ? "Admin" : "Member";
  const safeUrl = escapeHtml(inviteUrl || "");
  const expiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const subject = `${orgName || "Your organization"} invited you to Stillform`;

  const text = [
    `${orgName || "Your organization"} has set up a Stillform seat for you${safeInviterEmail ? ` (sent by ${inviterEmail})` : ""}.`,
    ``,
    `Stillform is a metacognition practice — sharper thinking through deliberate self-knowledge.`,
    ``,
    `Accept the invite:`,
    inviteUrl || "",
    ``,
    `Your role: ${safeRole}.`,
    expiry ? `This invite expires on ${expiry}.` : "",
    ``,
    `Privacy: your organization pays for this seat. They cannot see anything you do inside Stillform — not your sessions, journal, reframes, or any other practice content. Ever.`,
    ``,
    `If you weren't expecting this invite, you can ignore the email.`,
    ``,
    `— Stillform`
  ].filter(Boolean).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0f1011;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e8e8e8;line-height:1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0f1011;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#181a1b;border:1px solid #2a2c2e;border-radius:14px;padding:32px;">
          <tr>
            <td style="padding-bottom:8px;">
              <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c89a4a;">Invitation</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;">
              <div style="font-size:22px;color:#e8e8e8;font-weight:500;line-height:1.35;">${safeOrgName} invited you to Stillform.</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;font-size:14px;color:#b8b8b8;">
              ${safeInviterEmail ? `Sent by ${safeInviterEmail}. ` : ""}Your role will be <strong style="color:#e8e8e8;">${safeRole}</strong>.
            </td>
          </tr>
          <tr>
            <td style="padding:18px 0 12px;">
              <a href="${safeUrl}" style="display:inline-block;background:#c89a4a;color:#0f1011;text-decoration:none;padding:14px 24px;border-radius:10px;font-size:15px;font-weight:500;">Accept invite →</a>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:11px;color:#888;word-break:break-all;">
              Or copy this link: ${safeUrl}
            </td>
          </tr>
          ${expiry ? `<tr><td style="padding-top:14px;font-size:12px;color:#888;">This invite expires on ${expiry}.</td></tr>` : ""}
          <tr>
            <td style="padding-top:28px;border-top:1px solid #2a2c2e;margin-top:24px;">
              <div style="padding-top:18px;font-size:12px;color:#a8a8a8;line-height:1.55;">
                <strong style="color:#e8e8e8;">Privacy:</strong> your organization pays for this seat. They cannot see anything you do inside Stillform — not your sessions, journal, reframes, or any other practice content. Ever. The data and the practice are yours.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:18px;font-size:11px;color:#666;">
              If you weren't expecting this invite, ignore the email — no account will be created.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
};
