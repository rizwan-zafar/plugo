import nodemailer from "nodemailer";
import { formatCurrency, formatDateTime } from "@/lib/utils";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemRows(order) {
  return (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#0b1220;font-size:14px;">
            ${escapeHtml(item.productName)}${item.variantName ? ` (${escapeHtml(item.variantName)})` : ""}
          </td>
          <td style="padding:12px 10px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:14px;">
            ${item.quantity}
          </td>
          <td style="padding:12px 10px;border-bottom:1px solid #e2e8f0;text-align:right;color:#64748b;font-size:14px;">
            ${formatCurrency(item.price)}
          </td>
          <td style="padding:12px 10px;border-bottom:1px solid #e2e8f0;text-align:right;color:#0b1220;font-size:14px;font-weight:bold;">
            ${formatCurrency(item.subtotal)}
          </td>
        </tr>`
    )
    .join("");
}

export function buildOrderReceiptHtml(order, { variant = "customer" } = {}) {
  const isAdmin = variant === "admin";
  const isReceipt = variant === "receipt";
  const title = isAdmin
    ? `New Order ${order.orderNumber}`
    : isReceipt
    ? `Order Receipt ${order.orderNumber}`
    : `Order Confirmed ${order.orderNumber}`;
  const badge = isAdmin ? "NEW ORDER" : isReceipt ? "ORDER RECEIPT" : "ORDER CONFIRMED";
  const heading = isAdmin
    ? "A customer just placed an order"
    : isReceipt
    ? "Order receipt"
    : "Thank you for your order";
  const intro = isAdmin
    ? `Order ${order.orderNumber} has been placed and is waiting for your review.`
    : isReceipt
    ? "Official order receipt from Plugo."
    : `Hi ${order.customerName}, we have received your order and will deliver it soon. Please keep cash ready for Cash on Delivery.`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#eef4f8;font-family:Arial,Helvetica,sans-serif;color:#0b1220;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#0b1220;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;letter-spacing:3px;color:#22d3ee;font-weight:bold;">PLUGO</p>
              <h1 style="margin:0;font-size:26px;line-height:1.3;color:#ffffff;">${escapeHtml(heading)}</h1>
              <p style="margin:12px 0 0;display:inline-block;background:#06b6d4;color:#0b1220;font-size:12px;font-weight:bold;letter-spacing:1px;padding:6px 12px;border-radius:999px;">${badge}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;color:#64748b;font-size:15px;line-height:1.6;">
              ${escapeHtml(intro)}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:14px 16px;width:50%;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Order Number</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:bold;color:#0891b2;">${escapeHtml(order.orderNumber)}</p>
                  </td>
                  <td style="padding:14px 16px;width:50%;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Order Date</p>
                    <p style="margin:4px 0 0;font-size:14px;font-weight:bold;color:#0b1220;">${escapeHtml(formatDateTime(order.createdAt))}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 16px 14px;width:50%;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Payment</p>
                    <p style="margin:4px 0 0;font-size:14px;font-weight:bold;color:#0b1220;">Cash on Delivery</p>
                  </td>
                  <td style="padding:0 16px 14px;width:50%;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Status</p>
                    <p style="margin:4px 0 0;font-size:14px;font-weight:bold;color:#0b1220;">${escapeHtml(order.status)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0 0 10px;font-size:16px;font-weight:bold;color:#0b1220;">Order Items</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr style="background:#0b1220;color:#ffffff;">
                  <th align="left" style="padding:10px;font-size:12px;letter-spacing:0.5px;">Product</th>
                  <th align="center" style="padding:10px;font-size:12px;letter-spacing:0.5px;">Qty</th>
                  <th align="right" style="padding:10px;font-size:12px;letter-spacing:0.5px;">Price</th>
                  <th align="right" style="padding:10px;font-size:12px;letter-spacing:0.5px;">Total</th>
                </tr>
                ${itemRows(order)}
                <tr>
                  <td colspan="3" style="padding:14px 10px;background:#f8fafc;font-size:15px;font-weight:bold;">Grand Total</td>
                  <td style="padding:14px 10px;background:#f8fafc;text-align:right;font-size:18px;font-weight:bold;color:#0891b2;">${formatCurrency(order.totalAmount)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0 0 10px;font-size:16px;font-weight:bold;color:#0b1220;">Delivery Details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#0b1220;"><strong>Name:</strong> ${escapeHtml(order.customerName)}</p>
                    <p style="margin:0 0 8px;font-size:14px;color:#0b1220;"><strong>Email:</strong> ${escapeHtml(order.email || "—")}</p>
                    <p style="margin:0 0 8px;font-size:14px;color:#0b1220;"><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
                    <p style="margin:0;font-size:14px;color:#0b1220;"><strong>Address:</strong> ${escapeHtml(order.address)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 32px;color:#64748b;font-size:13px;line-height:1.6;">
              ${
                isAdmin
                  ? "Log in to the admin panel to confirm this order and update its status."
                  : "If you have any questions, reply to this email or call us at +92 300 1234567."
              }
            </td>
          </tr>
          <tr>
            <td style="background:#050816;padding:18px 32px;text-align:center;color:#94a3b8;font-size:12px;">
              <p style="margin:0 0 4px;color:#ffffff;font-weight:bold;">Plugo</p>
              <p style="margin:0;">Lahore, Pakistan · support@plugo.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!host || !user || !pass) {
    console.warn("SMTP is not configured. Order emails were skipped.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendOrderEmails(order) {
  const transporter = getTransporter();
  if (!transporter) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_SEED_EMAIL;

  const jobs = [];

  if (order.email) {
    jobs.push(
      transporter.sendMail({
        from,
        to: order.email,
        subject: `Your Plugo order ${order.orderNumber} is confirmed`,
        html: buildOrderReceiptHtml(order, { variant: "customer" }),
      })
    );
  }

  if (adminEmail) {
    jobs.push(
      transporter.sendMail({
        from,
        to: adminEmail,
        subject: `New order ${order.orderNumber} — ${order.customerName}`,
        html: buildOrderReceiptHtml(order, { variant: "admin" }),
      })
    );
  }

  await Promise.all(jobs);
}
