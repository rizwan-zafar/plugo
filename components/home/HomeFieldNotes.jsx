"use client";

import Link from "next/link";
import TiltCard from "./TiltCard";

function noteDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomeFieldNotes({ blogs }) {
  if (!blogs?.length) return null;

  return (
    <div className="notes-stage">
      <div className="notes-floor" aria-hidden="true" />
      <div className="notes-ring" aria-hidden="true" />
      <span className="notes-beam" aria-hidden="true" />

      <div className="notes-row">
        {blogs.map((blog, index) => (
          <TiltCard key={blog.id} intensity={8} className="notes-tilt">
            <article className="notes-slab">
              <span className="notes-slab-edge notes-slab-top" aria-hidden="true" />
              <span className="notes-slab-edge notes-slab-side" aria-hidden="true" />
              <Link href={`/blogs/${blog.slug}`} className="notes-slab-front">
                <div className="notes-photo">
                  {blog.featuredImage ? (
                    <img src={blog.featuredImage} alt="" />
                  ) : (
                    <span className="notes-photo-fallback">⚡</span>
                  )}
                  <span className="notes-index">0{index + 1}</span>
                </div>
                <div className="notes-copy">
                  <p className="notes-date">{noteDate(blog.publishedAt || blog.createdAt)}</p>
                  <h3>{blog.title}</h3>
                  <span className="notes-cta">
                    Read note
                    <span aria-hidden="true"> →</span>
                  </span>
                </div>
              </Link>
            </article>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
