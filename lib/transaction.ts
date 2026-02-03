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
  amount: number | string
): { subject: string; text: string; html: string } {
  // --- validations ---
  if (!/^\d{6}$/.test(String(code).trim())) {
    throw new Error("code must be a 6-digit string (e.g. '123456').");
  }

  const amountNum = Number(amount);
  if (Number.isNaN(amountNum) || !isFinite(amountNum) || amountNum <= 0) {
    throw new Error("amount must be a positive number or numeric string.");
  }

  const fmtGBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountNum);

  const safeName = String(recipientName).trim();
  const fullAccount = String(recipientAccountNumber).trim();

  const subject = `Your verification code & Transfer Details for a ${fmtGBP} transfer`;

  const text = [
    `Hello,`,
    ``,
    `Your 6-digit verification code is: ${code}`,
    ``,
    `Transfer details:`,
    `Recipient: ${safeName}`,
    `Account Number: ${fullAccount}`,
    `Amount: ${fmtGBP}`,
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
        <tr><td style="padding:4px 8px;"><strong>Amount</strong></td><td style="padding:4px 8px;">${escapeHtml(fmtGBP)}</td></tr>
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


export function generateReference() {
  const prefixes = ["WT", "DIV", "RI", "TR", "SS", "TX", "PE", "IP", "AU", "LX", "FD", "CR", "AC"];
  // secure/random integer 0..(max-1)
  function randInt(max: number) {
    // browser crypto
    try {
      if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0] % max;
      }
    } catch (e) { /* fallthrough */ }

    // node crypto
    try {
      // eslint-disable-next-line no-undef
      const nodeCrypto = require && require("crypto");
      if (nodeCrypto && typeof nodeCrypto.randomInt === "function") {
        return nodeCrypto.randomInt(0, max);
      }
    } catch (e) { /* fallthrough */ }

    // fallback
    return Math.floor(Math.random() * max);
  }

  const prefix = prefixes[randInt(prefixes.length)];
  const year = new Date().getFullYear();
  const seq = String(randInt(1_000_000)).padStart(6, "0"); // 000000 - 999999
  return `${prefix}-${year}-${seq}`;
}


export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  time: string;
  type: "deposit" | "transfer";
  status: string;
  reference: string;
  notes: string;
  accountFrom: string;
  accountTo: string;
}

export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  try {
    const res = await fetch(`/api/transactions?userId=${userId}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch transactions (${res.status})`);
    }

    const data: Transaction[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
