import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getDeliveryCharge, setDeliveryCharge } from "@/lib/settings";
import { validateStoreSettings, hasErrors } from "@/lib/validation";

export async function GET() {
  const deliveryCharge = await getDeliveryCharge();
  return NextResponse.json({ deliveryCharge });
}

export async function PUT(request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const errors = validateStoreSettings(data);
    if (hasErrors(errors)) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
    }

    const deliveryCharge = await setDeliveryCharge(data.deliveryCharge);
    return NextResponse.json({ deliveryCharge });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Could not save settings." },
      { status: 400 }
    );
  }
}
