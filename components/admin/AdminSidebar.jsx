"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandMark from "@/components/common/BrandMark";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "dash" },
  { href: "/admin/products", label: "Products", icon: "bolt" },
  { href: "/admin/categories", label: "Categories", icon: "grid" },
  { href: "/admin/orders", label: "Orders", icon: "box" },
  { href: "/admin/blogs", label: "Guides", icon: "note" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
];

function NavIcon({ name }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    className: "h-[18px] w-[18px]",
  };
  if (name === "bolt") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h6.5v6.5H4.5zM13 4.5h6.5v6.5H13zM4.5 13h6.5v6.5H4.5zM13 13h6.5v6.5H13z" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25 12 3 3 8.25v7.5L12 21l9-5.25v-7.5zM3 8.25 12 13.5 21 8.25M12 13.5V21" />
      </svg>
    );
  }
  if (name === "note") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5h9.5L19.5 8v11.5H6zM15.5 4.5V8H19.5M8.5 12h7M8.5 15.5h5" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5v10.5H3.75zM4 7l8 6 8-6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h3.2L10 7.5 14 16.5 16.3 12h3.2" />
    </svg>
  );
}

export default function AdminSidebar({ admin, unread = 0, pending = 0, className = "", onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const initials = (admin?.name || admin?.email || "P")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`admin-side ${className}`}>
      <div className="admin-side-brand">
        <BrandMark light />
        <p className="admin-side-kicker">Control room</p>
      </div>

      <nav className="admin-side-nav">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const badge = link.icon === "box" ? pending : link.icon === "mail" ? unread : 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`admin-side-link${active ? " is-active" : ""}`}
            >
              <span className="admin-side-icon">
                <NavIcon name={link.icon} />
              </span>
              <span className="admin-side-label">{link.label}</span>
              {badge > 0 ? <span className="admin-side-badge">{badge > 9 ? "9+" : badge}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="admin-side-foot">
        <div className="admin-side-user">
          <span className="admin-side-avatar">{initials}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{admin?.name || "Admin"}</span>
            <span className="block truncate text-xs text-slate-400">{admin?.email}</span>
          </span>
        </div>
        <button type="button" onClick={handleLogout} className="admin-side-logout">
          Sign out
        </button>
      </div>
    </div>
  );
}
