import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import BlogForm from "@/components/admin/BlogForm";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
  if (!blog) notFound();

  return (
    <div className="admin-desk">
      <div>
        <Link href="/admin/blogs" className="admin-back">← Back to guides</Link>
        <p className="admin-kicker">Field notes</p>
        <h2 className="admin-top-title">Edit guide</h2>
      </div>
      <BlogForm blog={toPlain(blog)} />
    </div>
  );
}
