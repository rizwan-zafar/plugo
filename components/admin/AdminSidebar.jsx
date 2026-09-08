"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandMark from "@/components/common/BrandMark";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/products", label: "Products", icon: "⚡" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/blogs", label: "Blog Posts", icon: "📰" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
];

export default function AdminSidebar({ admin, className = "", onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className={`flex flex-col h-full bg-ink-950 text-slate-300 ${className}`}>
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <BrandMark light />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white text-ink-900" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-xs text-slate-500 mb-2 truncate">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-white/10 hover:bg-white/15 transition-colors px-3.5 py-2.5 text-sm font-medium text-white flex items-center gap-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
