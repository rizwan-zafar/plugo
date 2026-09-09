"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { useToast } from "@/components/common/ToastContext";
import { formatCurrency } from "@/lib/utils";
import { cheapestInStockVariant, salePrice } from "@/lib/product";

function listPrice(product) {
  const variant = cheapestInStockVariant(product) || product.variants?.[0] || product;
  return { ...salePrice(variant), hasMultiple: (product.variants?.length || 0) > 1 };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ all: "true", page: String(page), pageSize: "10" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category]);

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (product) => {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Could not delete product", "error");
        return;
      }
      showToast(data.message || "Product deleted");
      loadProducts();
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  };

  const toggleStatus = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          images: product.images,
          status: product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          variants: product.variants,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Product status updated");
      loadProducts();
    } catch {
      showToast("Could not update status", "error");
    }
  };

  return (
    <div className="admin-desk">
      <div className="admin-toolbar">
        <div className="admin-toolbar-fields">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search accessories..."
            className="admin-field"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="admin-field-sm"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
        <Link href="/admin/products/new" className="admin-btn-primary">
          Add product
        </Link>
      </div>

      <section className="admin-panel">
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <EmptyState icon="⚡" title="No products found" description="Try adjusting your search or add a new accessory." action={<Button as={Link} href="/admin/products/new">Add product</Button>} />
          </div>
        ) : (
          <>
            <Table columns={["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"]}>
              {products.map((product) => {
                const pricing = listPrice(product);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-thumb">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <span>⚡</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-ink-900 line-clamp-1">{product.name}</span>
                      {product.variants?.length > 1 && (
                        <span className="block text-xs text-slate-400 mt-0.5">
                          {product.variants.length} variations
                        </span>
                      )}
                    </td>
                    <td>{product.category?.name}</td>
                    <td>
                      <span className="inline-flex flex-col">
                        <span>
                          {pricing.hasMultiple ? "From " : ""}
                          {formatCurrency(pricing.price)}
                        </span>
                        {pricing.onSale && (
                          <span className="text-xs text-slate-400 line-through">{formatCurrency(pricing.compareAt)}</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={product.stock <= 5 ? "font-semibold text-red-600" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`admin-status ${
                          product.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-3">
                        <Link href={`/admin/products/${product.id}/edit`} className="admin-link">Edit</Link>
                        <button onClick={() => handleDelete(product)} className="admin-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
