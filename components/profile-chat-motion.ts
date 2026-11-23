export type ChatOrigin = Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">;

export function collapsedChatFrame(panel: ChatOrigin, origin: ChatOrigin | null, drawer: boolean): Keyframe {
  const { left, top, width, height } = panel;
  const anchor = origin ?? { left: left + width - 50, top: top + height - 50, width: 42, height: 42 };
  const dx = anchor.left + anchor.width / 2 - (left + width / 2);
  const dy = drawer
    ? anchor.top + anchor.height - (top + height)
    : anchor.top + anchor.height / 2 - (top + height / 2);
  const scale = Math.max(.08, Math.min(.32, anchor.width / Math.max(1, width), anchor.height / Math.max(1, height)));
  return {
    transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
    opacity: 0,
    ...(drawer ? { borderRadius: "1.5rem" } : {}),
  };
}
