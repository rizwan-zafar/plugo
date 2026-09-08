"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import BrandMark from "@/components/common/BrandMark";

const TITLES = [
  { match: "/admin/products", title: "Products", note: "Catalog and stock" },
  { match: "/admin/categories", title: "Categories", note: "Shop boards" },
  { match: "/admin/orders", title: "Orders", note: "Cash on delivery" },
  { match: "/admin/blogs", title: "Guides", note: "Field notes" },
  { match: "/admin/messages", title: "Messages", note: "Inbox from the site" },
  { match: "/admin", title: "Dashboard", note: "Live store pulse" },
];

function pageMeta(pathname) {
  return TITLES.find((item) => (item.match === "/admin" ? pathname === "/admin" : pathname.startsWith(item.match))) || TITLES.at(-1);
}

export default function AdminShell({ admin, unread = 0, pending = 0, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const meta = pageMeta(pathname);

  return (
    <div className="admin-studio">
      <aside className="hidden lg:block w-[272px] flex-shrink-0">
        <div className="fixed w-[272px] h-screen">
          <AdminSidebar admin={admin} unread={unread} pending={pending} className="h-full" />
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/55" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[272px]">
            <AdminSidebar
              admin={admin}
              unread={unread}
              pending={pending}
              className="h-full"
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="admin-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden admin-icon-btn"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="admin-kicker">{meta.note}</p>
              <h1 className="admin-top-title">{meta.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pending > 0 ? (
              <Link href="/admin/orders" className="admin-chip">
                {pending} pending
              </Link>
            ) : null}
            {unread > 0 ? (
              <Link href="/admin/messages" className="admin-chip admin-chip-soft">
                {unread} unread
              </Link>
            ) : null}
            <Link href="/" className="admin-store-link">
              View store
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
