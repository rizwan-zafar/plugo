import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | Plugo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  let unread = 0;
  let pending = 0;
  if (session) {
    [unread, pending] = await Promise.all([
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
  }
  return (
    <AdminShell admin={session} unread={unread} pending={pending}>
      {children}
    </AdminShell>
  );
}
