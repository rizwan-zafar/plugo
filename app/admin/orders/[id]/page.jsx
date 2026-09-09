"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Select from "@/components/common/Select";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import { useToast } from "@/components/common/ToastContext";
import { formatCurrency, formatDateTime, orderStatusColor, ORDER_STATUSES } from "@/lib/utils";

export default function AdminOrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const loadOrder = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data.order);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Could not update status", "error");
        return;
      }
      setOrder(data.order);
      showToast("Order status updated");
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner />;
  if (error || !order) return <ErrorState title="Order not found" onRetry={loadOrder} />;

  return (
    <div className="admin-desk">
      <div>
        <Link href="/admin/orders" className="admin-back">← Back to orders</Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Cash on delivery</p>
            <h2 className="admin-top-title">{order.orderNumber}</h2>
            <p className="admin-muted mt-1">Placed {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <a href={`/api/orders/${order.id}/receipt`} className="admin-btn-light">
              Download receipt
            </a>
            <span className={`admin-status ${orderStatusColor(order.status)}`}>{order.status}</span>
          </div>
        </div>
      </div>

      <div className="admin-split">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-kicker">Line items</p>
              <h3>Order items</h3>
            </div>
          </div>
          <div className="admin-attention">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="font-semibold text-ink-900">
                    {item.productName}
                    {item.variantName ? ` (${item.variantName})` : ""}
                  </p>
                  <p className="admin-muted">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-ink-900">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-slate-100 font-display text-lg font-extrabold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="admin-kicker">Customer</p>
                <h3>Delivery</h3>
              </div>
            </div>
            <dl className="admin-attention text-sm">
              <div>
                <dt className="admin-attention-label">Name</dt>
                <dd className="font-semibold text-ink-900">{order.customerName}</dd>
              </div>
              <div>
                <dt className="admin-attention-label">Email</dt>
                <dd className="font-medium text-slate-700">{order.email || "—"}</dd>
              </div>
              <div>
                <dt className="admin-attention-label">Phone</dt>
                <dd className="font-medium text-slate-700">{order.phone}</dd>
              </div>
              <div>
                <dt className="admin-attention-label">Address</dt>
                <dd className="text-slate-700">{order.address}</dd>
              </div>
              <div>
                <dt className="admin-attention-label">Payment</dt>
                <dd className="font-semibold text-ink-900">{order.paymentMethod}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="admin-kicker">Workflow</p>
                <h3>Update status</h3>
              </div>
            </div>
            <div className="p-5">
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating || order.status === "CANCELLED"}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              {order.status === "CANCELLED" && (
                <p className="admin-muted mt-2">Cancelled orders cannot be changed further.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
