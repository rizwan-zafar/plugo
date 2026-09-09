"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { useToast } from "@/components/common/ToastContext";
import { formatCurrency, formatDateTime, orderStatusColor, ORDER_STATUSES } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "15" });
      if (status !== "ALL") params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="admin-desk">
      <div className="admin-toolbar">
        <div className="admin-toolbar-fields">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search order #, name, or phone..."
            className="admin-field"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="admin-field-sm"
          >
            <option value="ALL">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="admin-panel">
        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <EmptyState icon="🧾" title="No orders found" description="COD orders will appear here once customers check out." />
          </div>
        ) : (
          <>
            <Table columns={["Order #", "Customer", "Phone", "Items", "Total", "Status", "Date", ""]}>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.items?.length ?? 0}</td>
                  <td className="font-semibold">{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <span className={`admin-status ${orderStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="admin-muted whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                  <td>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Link href={`/admin/orders/${order.id}`} className="admin-link">View</Link>
                      <a href={`/api/orders/${order.id}/receipt`} className="admin-link">Receipt</a>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
