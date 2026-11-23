import type { Chapter } from "./cindy-scenes";

// On desktop the station sits in its section's Cindy lane, which alternates sides by chapter.
export default function CindyStation({ chapter }: { chapter: Chapter }) {
  return (
    <div className="cindy-station" data-cindy-station={chapter} aria-hidden="true">
      <div className="cindy-station__layout">
        <div className="cindy-station__mark" />
        <div className="cindy-station__hint" />
        <div className="cindy-station__caption" />
      </div>
    </div>
  );
}
