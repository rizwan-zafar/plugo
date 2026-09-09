import Link from "next/link";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="admin-desk">
      <div>
        <Link href="/admin/blogs" className="admin-back">← Back to guides</Link>
        <p className="admin-kicker">Field notes</p>
        <h2 className="admin-top-title">Add guide</h2>
      </div>
      <BlogForm />
    </div>
  );
}
