import type { Chapter } from "./cindy-scenes";

export default function CindyStation({ chapter, reverse }: { chapter: Chapter; reverse?: boolean }) {
  return (
    <div className="cindy-station" data-cindy-station={chapter} data-cindy-reverse={reverse ? "" : undefined} aria-hidden="true">
      <div className="cindy-station__layout">
        <div className="cindy-station__mark" />
        <div className="cindy-station__hint" />
        <div className="cindy-station__caption" />
      </div>
    </div>
  );
}
