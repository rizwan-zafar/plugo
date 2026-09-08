import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-950 text-5xl">⚡</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white">{category.name}</h3>
          {typeof category._count?.products === "number" && (
            <p className="text-xs text-white/80">
              {category._count.products} product{category._count.products === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
