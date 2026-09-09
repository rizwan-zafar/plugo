"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/components/common/ToastContext";
import { formatDate } from "@/lib/utils";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs?all=true&pageSize=50");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch {
      showToast("Failed to load blog posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePublish = async (blog) => {
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blog.title,
          author: blog.author,
          content: blog.content,
          featuredImage: blog.featuredImage,
          status: blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
        }),
      });
      if (!res.ok) throw new Error();
      showToast(blog.status === "PUBLISHED" ? "Post unpublished" : "Post published");
      loadBlogs();
    } catch {
      showToast("Could not update post", "error");
    }
  };

  const handleDelete = async (blog) => {
    if (!confirm(`Delete "${blog.title}"?`)) return;
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Blog post deleted");
      loadBlogs();
    } catch {
      showToast("Could not delete post", "error");
    }
  };

  return (
    <div className="admin-desk">
      <div className="admin-toolbar">
        <p className="admin-muted">Field notes for cables, watts, and earbuds.</p>
        <Link href="/admin/blogs/new" className="admin-btn-primary">Add guide</Link>
      </div>

      <section className="admin-panel">
        {loading ? (
          <Spinner />
        ) : blogs.length === 0 ? (
          <div className="admin-empty">
            <EmptyState icon="📰" title="No guides yet" description="Write the first field note for the storefront." action={<Button as={Link} href="/admin/blogs/new">Add guide</Button>} />
          </div>
        ) : (
          <Table columns={["Title", "Author", "Status", "Date", "Actions"]}>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <span className="font-semibold text-ink-900 line-clamp-1">{blog.title}</span>
                </td>
                <td>{blog.author}</td>
                <td>
                  <button
                    onClick={() => togglePublish(blog)}
                    className={`admin-status ${
                      blog.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {blog.status}
                  </button>
                </td>
                <td className="admin-muted">{formatDate(blog.createdAt)}</td>
                <td>
                  <div className="flex gap-3">
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="admin-link">Edit</Link>
                    <button onClick={() => handleDelete(blog)} className="admin-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </section>
    </div>
  );
}
