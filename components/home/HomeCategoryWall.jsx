"use client";

import Link from "next/link";
import TiltCard from "./TiltCard";

export default function HomeCategoryWall({ categories }) {
  if (!categories?.length) {
    return <p className="text-slate-400">Categories coming soon.</p>;
  }

  return (
    <div className="kit-bento">
      {categories.map((category, index) => {
        const featured = index === 0;
        return (
          <TiltCard key={category.id} intensity={featured ? 8 : 11} className={featured ? "kit-feature" : ""}>
            <Link href={`/categories/${category.slug}`} className={`kit-board ${featured ? "is-feature" : ""}`}>
              {category.image ? (
                <img src={category.image} alt="" className="kit-board-photo" />
              ) : null}
              <span className="kit-board-shade" />
              <span className="kit-board-glow" />
              <div className="kit-board-copy">
                <p className="kit-board-index">0{index + 1}</p>
                <h3>{category.name}</h3>
                {category.description && <p className="kit-board-desc">{category.description}</p>}
                <span className="kit-board-cta">
                  {typeof category._count?.products === "number"
                    ? `${category._count.products} products`
                    : "Shop"}
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </Link>
          </TiltCard>
        );
      })}
    </div>
  );
}
