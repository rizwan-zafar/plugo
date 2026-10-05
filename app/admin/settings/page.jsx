"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Spinner from "@/components/common/Spinner";
import { useToast } from "@/components/common/ToastContext";
import { formatCurrency } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [deliveryCharge, setDeliveryCharge] = useState("0");
  const [savedCharge, setSavedCharge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load settings");
      const amount = Number(data.deliveryCharge) || 0;
      setDeliveryCharge(String(amount));
      setSavedCharge(amount);
    } catch {
      showToast("Could not load store settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryCharge }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.errors?.deliveryCharge || data.error || "Could not save");
        showToast(data.error || "Could not save delivery charge", "error");
        return;
      }
      const amount = Number(data.deliveryCharge) || 0;
      setDeliveryCharge(String(amount));
      setSavedCharge(amount);
      showToast("Delivery charge updated");
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-desk">
      <div>
        <p className="admin-kicker">Store</p>
        <h2 className="admin-top-title">Settings</h2>
        <p className="admin-muted mt-1">
          This delivery charge is added to every new Cash on Delivery order.
        </p>
      </div>

      <section className="admin-panel max-w-xl">
        <div className="admin-panel-head">
          <div>
            <p className="admin-kicker">Checkout</p>
            <h3>Delivery charges</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <Input
            label="Delivery charge (PKR)"
            name="deliveryCharge"
            type="number"
            min="0"
            step="1"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            error={error}
            required
          />
          <p className="text-sm text-slate-500 -mt-2">
            Current live amount: <strong className="text-ink-900">{formatCurrency(savedCharge)}</strong>
            {savedCharge === 0 ? " — customers will see free delivery." : ""}
          </p>
          <div>
            <Button type="submit" loading={saving}>
              Save delivery charge
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
