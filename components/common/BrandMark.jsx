export default function BrandMark({ light = false, size = "md" }) {
  const mark = size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const bolt = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const word = size === "lg" ? "text-xl" : "text-lg";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`relative flex ${mark} items-center justify-center rounded-xl bg-brand-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.45)]`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className={bolt}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      </span>
      <span
        className={`font-display ${word} font-extrabold tracking-tight ${
          light ? "text-white" : "text-ink-900"
        }`}
      >
        Plu<span className="text-brand-500">go</span>
      </span>
    </span>
  );
}
