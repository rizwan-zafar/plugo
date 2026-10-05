import { prisma } from "@/lib/db";

export function parseDeliveryCharge(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100) / 100;
}

export async function getDeliveryCharge(db = prisma) {
  const row = await db.storeSetting.findUnique({ where: { id: 1 } });
  return row ? Number(row.deliveryCharge) : 0;
}

export async function setDeliveryCharge(amount, db = prisma) {
  const deliveryCharge = parseDeliveryCharge(amount);
  if (deliveryCharge === null) {
    throw new Error("Delivery charge must be zero or a positive amount.");
  }

  const row = await db.storeSetting.upsert({
    where: { id: 1 },
    create: { id: 1, deliveryCharge },
    update: { deliveryCharge },
  });

  return Number(row.deliveryCharge);
}
