/**
 * Build email content for a money-transfer verification email (shows full account number).
 *
 * @param code - 6-digit verification code (e.g. "123456")
 * @param recipientName - recipient full name (e.g. "Jane Doe")
 * @param recipientAccountNumber - recipient account number (string or digits) — will be shown in full
 * @param amountUSD - amount in USD (number or numeric string)
 *
 * @returns an object with subject, text and html properties ready to send
 */
export function buildTransactionEmail(
  code: string,
  recipientName: string,
  recipientAccountNumber: string,
  amountUSD: number | string
): { subject: string; text: string; html: string } {
  // --- validations ---
  if (!/^\d{6}$/.test(String(code).trim())) {
    throw new Error("code must be a 6-digit string (e.g. '123456').");
  }

  const amountNum = Number(amountUSD);
  if (Number.isNaN(amountNum) || !isFinite(amountNum) || amountNum <= 0) {
    throw new Error("amountUSD must be a positive number or numeric string.");
  }

  const fmtUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountNum);

  const safeName = String(recipientName).trim();
  const fullAccount = String(recipientAccountNumber).trim();

  const subject = `Your verification code & Transfer Details for a ${fmtUSD} transfer`;

  const text = [
    `Hello,`,
    ``,
    `Your 6-digit verification code is: ${code}`,
    ``,
    `Transfer details:`,
    `Recipient: ${safeName}`,
    `Account Number: ${fullAccount}`,
    `Amount: ${fmtUSD}`,
    ``,
    `If you did not request this transfer, please contact support immediately.`,
    ``,
    `This code will expire in 10 minutes.`,
    ``,
    `— Your Company Name`
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;">
      <h2 style="margin:0 0 8px 0;">Verification Code</h2>
      <p style="font-size:16px; margin:0 0 12px 0;">
        Your <strong>6-digit verification code</strong> is:
      </p>
      <p style="font-size:20px; letter-spacing:4px; margin:0 0 18px 0;"><strong>${escapeHtml(code)}</strong></p>

      <h3 style="margin:18px 0 6px 0;">Transfer details</h3>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr><td style="padding:4px 8px;"><strong>Recipient</strong></td><td style="padding:4px 8px;">${escapeHtml(safeName)}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Account</strong></td><td style="padding:4px 8px;">${escapeHtml(fullAccount)}</td></tr>
        <tr><td style="padding:4px 8px;"><strong>Amount</strong></td><td style="padding:4px 8px;">${escapeHtml(fmtUSD)}</td></tr>
      </table>

      <p style="margin:12px 0 0 0; color:#666; font-size:13px;">
        If you did not request this transfer, please contact support immediately.<br/>
        This code will expire in 10 minutes.
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;"/>
      <small style="color:#999;">This email was sent by Your Company Name.</small>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
