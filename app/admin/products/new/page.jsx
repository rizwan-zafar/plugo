import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="admin-desk">
      <div>
        <Link href="/admin/products" className="admin-back">← Back to products</Link>
        <p className="admin-kicker">Catalog</p>
        <h2 className="admin-top-title">Add product</h2>
      </div>
      <ProductForm />
    </div>
  );
}
