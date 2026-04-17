// ─── ImagePlaceholder ──────────────────────────────────────────
// Replace this component's usage with <Image src="..." /> from next/image
// when you have real photos. The `label` prop marks what photo goes here.

interface ImagePlaceholderProps {
  /** Describes what photo to place here when assets are ready */
  label?: string;
  aspect?: "landscape" | "portrait" | "square" | "wide" | "tall";
  className?: string;
  dark?: boolean;
}

const ASPECT_CLASSES: Record<string, string> = {
  landscape: "aspect-video",
  portrait:  "aspect-[3/4]",
  square:    "aspect-square",
  wide:      "aspect-[21/9]",
  tall:      "aspect-[4/5]",
};

export function ImagePlaceholder({
  label = "Photo placeholder — replace with personal image",
  aspect = "landscape",
  className = "",
  dark = true,
}: ImagePlaceholderProps) {
  const aspectClass = ASPECT_CLASSES[aspect] ?? "aspect-video";
  const bg     = dark ? "bg-zinc-900"   : "bg-zinc-100";
  const border = dark ? "border-zinc-800" : "border-zinc-200";
  const icon   = dark ? "text-zinc-600" : "text-zinc-400";
  const text   = dark ? "text-zinc-600" : "text-zinc-400";
  const grid   = dark ? "#ffffff"       : "#000000";

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${bg} ${className}`}>
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Center marker */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className={`w-11 h-11 rounded-xl border ${border} flex items-center justify-center`}>
          <svg
            className={`w-5 h-5 ${icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className={`text-[11px] font-mono ${text} text-center px-8 leading-relaxed max-w-[240px]`}>
          {label}
        </p>
      </div>
    </div>
  );
}
