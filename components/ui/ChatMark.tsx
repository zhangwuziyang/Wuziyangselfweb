export function ChatMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.15 17.2 4.7 20l3.05-1.18c1.2.62 2.65.98 4.25.98 4.75 0 8.6-3.38 8.6-7.55S16.75 4.7 12 4.7s-8.6 3.38-8.6 7.55c0 1.88.78 3.6 2.08 4.92"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m17.65 3.15.48 1.36 1.37.49-1.37.48-.48 1.37-.49-1.37L15.8 5l1.36-.49.49-1.36Z"
        fill="currentColor"
      />
      <path d="M8.25 12.45h.01M12 12.45h.01M15.75 12.45h.01" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
    </svg>
  );
}
