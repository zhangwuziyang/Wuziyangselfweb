import { CINDY_AVATAR_PATHS } from "./cindy-sprite";

export default function CindyAvatar({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 40 39" shapeRendering="crispEdges">
      {CINDY_AVATAR_PATHS.map(([color, path], index) => <path key={index} fill={color} d={path} />)}
    </svg>
  );
}
