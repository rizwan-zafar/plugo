import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { variants: { orderBy: { id: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div className="admin-desk">
      <div>
        <Link href="/admin/products" className="admin-back">← Back to products</Link>
        <p className="admin-kicker">Catalog</p>
        <h2 className="admin-top-title">Edit product</h2>
      </div>
      <ProductForm product={toPlain(product)} />
    </div>
  );
}
