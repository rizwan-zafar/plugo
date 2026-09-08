import { getAdminSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | Plugo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  return <AdminShell admin={session}>{children}</AdminShell>;
}
