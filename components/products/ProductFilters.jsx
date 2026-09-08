"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import FilterSelect from "./FilterSelect";

export default function ProductFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [, startTransition] = useTransition();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", search.trim());
  };

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((category) => ({ value: category.slug, label: category.name })),
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
    { value: "name", label: "Name: A–Z" },
  ];

  return (
    <div className="shop-toolbar">
      <form onSubmit={handleSearchSubmit} className="shop-search">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cables, chargers, earbuds..."
          className="shop-search-input"
        />
        <button type="submit" className="shop-search-btn" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3-3" />
          </svg>
        </button>
      </form>

      <div className="shop-filter-row">
        <FilterSelect
          label="Category"
          value={searchParams.get("category") || ""}
          options={categoryOptions}
          onChange={(value) => updateParam("category", value)}
        />
        <FilterSelect
          label="Sort"
          value={searchParams.get("sort") || "newest"}
          options={sortOptions}
          onChange={(value) => updateParam("sort", value)}
        />
      </div>
    </div>
  );
}
