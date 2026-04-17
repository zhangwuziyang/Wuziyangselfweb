import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#000", color: "#f5f5f7" }}>
      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: "#0071e3" }}>
        404
      </p>
      <h1 className="font-semibold leading-[1.04] tracking-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.025em" }}>
        This page drifted out of frame.
      </h1>
      <p className="max-w-md font-light leading-[1.8] mb-10" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#a1a1a6" }}>
        The link may be stale, or the page was never here. Head back to the start.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-7 py-3 transition-colors duration-200 bg-white text-black hover:bg-white/90"
      >
        ← Back home
      </Link>
    </main>
  );
}
