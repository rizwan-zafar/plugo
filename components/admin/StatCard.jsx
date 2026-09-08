import Link from "next/link";

export default function StatCard({ icon, label, value, href, tone = "cyan" }) {
  const body = (
    <div className={`admin-stat admin-stat-${tone}`}>
      <span className="admin-stat-icon">{icon}</span>
      <p className="admin-stat-value">{value}</p>
      <p className="admin-stat-label">{label}</p>
    </div>
  );

  if (!href) return body;
  return (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  );
}
