import Link from "next/link";
import { prisma } from "@/lib/db";
import { toPlain, formatCurrency, formatDateTime, orderStatusColor } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";
import StatCard from "@/components/admin/StatCard";
import EmptyState from "@/components/common/EmptyState";

export const dynamic = "force-dynamic";

function BoltIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

async function getStats() {
  const [totalProducts, totalCategories, totalOrders, pendingOrders, unreadMessages, salesResult, recentOrders, pendingList, unreadList, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.contactMessage.findMany({ where: { isRead: false }, orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.product.findMany({
        where: { status: "ACTIVE", stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        take: 4,
        select: { id: true, name: true, stock: true },
      }),
    ]);

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    unreadMessages,
    totalSales: salesResult._sum.totalAmount ? Number(salesResult._sum.totalAmount) : 0,
    recentOrders: toPlain(recentOrders),
    pendingList: toPlain(pendingList),
    unreadList: toPlain(unreadList),
    lowStock: toPlain(lowStock),
  };
}

export default async function AdminDashboardPage() {
  const [stats, session] = await Promise.all([getStats(), getAdminSession()]);
  const firstName = (session?.name || "there").split(" ")[0];
  const needsAttention = stats.pendingOrders + stats.unreadMessages + stats.lowStock.length;

  return (
    <div className="admin-desk">
      <section className="admin-hero">
        <div>
          <p className="admin-kicker">Live store pulse</p>
          <h2 className="admin-hero-title">Welcome back, {firstName}.</h2>
          <p className="admin-hero-copy">
            {needsAttention > 0
              ? `${stats.pendingOrders} pending COD orders, ${stats.unreadMessages} unread messages, ${stats.lowStock.length} low-stock items.`
              : "Store is clear. No pending orders, unread mail, or low stock right now."}
          </p>
        </div>
        <div className="admin-hero-actions">
          <Link href="/admin/products/new" className="admin-btn-primary">
            Add product
          </Link>
          <Link href="/admin/orders" className="admin-btn-ghost">
            Review orders
          </Link>
        </div>
      </section>

      <div className="admin-stat-grid">
        <StatCard href="/admin/products" tone="cyan" label="Products" value={stats.totalProducts} icon={<BoltIcon />} />
        <StatCard href="/admin/categories" tone="ink" label="Categories" value={stats.totalCategories} icon="▣" />
        <StatCard href="/admin/orders" tone="ink" label="Orders" value={stats.totalOrders} icon="▤" />
        <StatCard href="/admin/orders" tone="warn" label="Pending COD" value={stats.pendingOrders} icon="◉" />
        <StatCard href="/admin/orders" tone="mint" label="Sales" value={formatCurrency(stats.totalSales)} icon="Rs" />
      </div>

      <div className="admin-quick">
        <Link href="/admin/products/new" className="admin-quick-card">
          <span>New accessory</span>
          <strong>Add a product</strong>
        </Link>
        <Link href="/admin/messages" className="admin-quick-card">
          <span>Inbox</span>
          <strong>{stats.unreadMessages ? `${stats.unreadMessages} unread` : "All caught up"}</strong>
        </Link>
        <Link href="/admin/blogs/new" className="admin-quick-card">
          <span>Field notes</span>
          <strong>Write a guide</strong>
        </Link>
        <Link href="/" className="admin-quick-card">
          <span>Storefront</span>
          <strong>See the shop</strong>
        </Link>
      </div>

      <div className="admin-split">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-kicker">Queue</p>
              <h3>Recent orders</h3>
            </div>
            <Link href="/admin/orders">View all →</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <EmptyState icon="🧾" title="No orders yet" description="COD orders will land here as soon as customers check out." />
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                      </td>
                      <td>{order.customerName}</td>
                      <td>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`admin-status ${orderStatusColor(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="admin-muted">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-kicker">Needs you</p>
              <h3>Attention</h3>
            </div>
          </div>
          <div className="admin-attention">
            <div>
              <p className="admin-attention-label">Pending COD</p>
              {stats.pendingList.length === 0 ? (
                <p className="admin-muted">No waiting orders.</p>
              ) : (
                <ul>
                  {stats.pendingList.map((order) => (
                    <li key={order.id}>
                      <Link href={`/admin/orders/${order.id}`}>
                        <span>{order.orderNumber}</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="admin-attention-label">Unread messages</p>
              {stats.unreadList.length === 0 ? (
                <p className="admin-muted">Inbox is clear.</p>
              ) : (
                <ul>
                  {stats.unreadList.map((message) => (
                    <li key={message.id}>
                      <Link href="/admin/messages">
                        <span>{message.name}</span>
                        <span className="truncate max-w-[7rem]">{message.subject || "Message"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="admin-attention-label">Low stock</p>
              {stats.lowStock.length === 0 ? (
                <p className="admin-muted">Stock looks healthy.</p>
              ) : (
                <ul>
                  {stats.lowStock.map((product) => (
                    <li key={product.id}>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <span className="truncate">{product.name}</span>
                        <span>{product.stock} left</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
