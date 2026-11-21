// Base artwork uses the same 40 × 39 pixel grid as the Cindy prototype.
const rows = [
  ".kkkkkk......kkkkkkkkkkkkkk......kkkkkk.",
  "kaaaaaakk..kkaaaaccccccaaaakk..kkaaaaaak",
  "kscaaaaaakkaaaaaaccccccabbbaakkaaaaaacsk",
  "kscccaaaaaaaaaaaaccccccabbbbbaaaaaacccsk",
  "ksccccsaaaaaaaaaaccccccabbbbbbaaacccccsk",
  "kscccccsaaaaaaaaaccccccabbbbbbaascccccsk",
  "ksscccccssaaaaaaaccccccabbbbaapscccccssk",
  ".kscccccccsaaaaaaccccccabbbaascccccccsk.",
  ".ksscccccccssaaaaccccccabbbapccccccccsk.",
  ".ksscccccccccpaaaccccccabaapscccccccssk.",
  ".kssccccccccccaaapccccsaaascccccccccssk.",
  ".ksscbccccccccsaaaccccaaasccccccccbcssk.",
  ".ksccbcccccccccaaaccccaaacccccccccbccsk.",
  ".ksccbcccccccccaaaaaaaaaacccccccccbccsk.",
  ".ksccbcccccccccaaaaaaaaaacccccccccbccsk.",
  ".ksccbbcccccccaaaakkkkaaaacccccccbbccsk.",
  ".ksccbbbccccccaaakkkkkkaaaccccccbbbccsk.",
  ".ksscsbbbbccccaaakkkkkkaaaccccbbbbscssk.",
  ".kssccbbbbbcccsaaakkkkaaascccbbbbbccssk.",
  ".ksscccbbbbccccaaaakkaaaaccccbbbbcccssk.",
  ".kssscccabbcccccaaaaaaaacccccbbacccsssk.",
  ".ksssscccccccccgccaaaaccgcccccccccssssk.",
  ".kssssccccccccccggccccggccccccccccssssk.",
  ".kssssssccccccccclgggglcccccccccssssssk.",
  ".kssssccsccccccccccllccccccccccsccssssk.",
  ".ksssssscsccccccccccccccccccccscssssssk.",
  ".kdddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrdddk.",
  ".kdddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrdddk.",
  ".ksssccccccccccccccccccccccccccccccsssk.",
  ".kddddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrdddk.",
  ".kdddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrdddk.",
  "kssssccccccccccccccccccccccccccccccssssk",
  "kddddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrddddk",
  "ksssssrrrrrrrrrrrrrrrrrrrrrrrrrrrrsssssk",
  "kssssccccccccccccccccccccccccccccccssssk",
  "kddddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrddddk",
  "kddddrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrddddk",
  "kppppppkk.ppppppppppppppppppppkkgppppppk",
  ".kkkkkkk..kkkkkkkkkkkkkkkkkkkk..kkkkkkk."
];
const CINDY_COLORS: Record<string, string> = { k:"#16110d", a:"#bb723e", b:"#884a1b", c:"#f5eedc", s:"#e0d1bb", r:"#da3628", d:"#b73120", p:"#ed9c80", g:"#858183", l:"#bababf" };

// Author once on a snapped grid, then display at exactly 1× or 2×.
export const CINDY_BITMAP = 96;
const pixel = (value: number) => Math.round(value * CINDY_BITMAP / 64);
export type CindyPose = "rest" | "walk" | "hello" | "perch" | "timeline" | "flag" | "earth" | "music" | "skills" | "think" | "bye";
export type CindyExpression = "neutral" | "happy" | "wink" | "surprise" | "think" | "shy" | "sleep";
export type PixelOffset = { x: number; y: number };

const ink = CINDY_COLORS.k;
const cream = CINDY_COLORS.c;
const brown = CINDY_COLORS.b;
const alternateColors = { ...CINDY_COLORS, r: "#537652", d: "#34563a", p: "#9eaa79" };

type Rect = (x: number, y: number, width: number, height: number, color: string) => void;

function drawRows(rect: Rect, x: number, y: number, pattern: readonly string[], colors: Record<string, string>, flip = false) {
  pattern.forEach((line, row) => {
    for (let column = 0; column < line.length;) {
      const shade = line[column];
      let end = column + 1;
      while (end < line.length && line[end] === shade) end++;
      if (colors[shade]) rect(x + (flip ? line.length - end : column), y + row, end - column, 1, colors[shade]);
      column = end;
    }
  });
}

function eyes(rect: Rect, expression: CindyExpression, gaze: PixelOffset) {
  for (const x of [22, 40]) {
    if (expression === "sleep") {
      rect(x - 1, 25, 5, 1, ink);
    } else if (expression === "happy") {
      rect(x, 23, 3, 1, ink);
      rect(x - 1, 24, 1, 2, ink);
      rect(x + 3, 24, 1, 2, ink);
    } else if (expression === "wink" && x === 40) {
      rect(x - 1, 24, 5, 1, ink);
    } else {
      rect(x + gaze.x, 23 + gaze.y, expression === "surprise" ? 3 : 2, 3, ink);
      if (expression === "think") rect(x - 1, 21, 4, 1, brown);
    }
  }
  if (expression === "surprise") {
    rect(27, 34, 10, 5, cream);
    drawRows(rect, 30, 34, [".kk.", "k..k", "k..k", ".kk."], CINDY_COLORS);
  } else if (expression === "shy") {
    rect(20, 27, 3, 2, "#e39083");
    rect(41, 27, 3, 2, "#e39083");
  } else if (expression === "sleep") {
    rect(27, 35, 10, 4, cream);
    rect(30, 36, 4, 1, CINDY_COLORS.g);
    const glyph = ["zzz", "..z", ".z.", "z..", "zzz"];
    const colors = { z: "#c1cbe0" };
    drawRows(rect, 43, 14, glyph, colors);
    drawRows(rect, 47, 10, glyph, colors);
    drawRows(rect, 49, 6, glyph, colors);
  }
}

export const CINDY_AVATAR_PATHS = (() => {
  const paths: Record<string, string> = {};
  const rect: Rect = (x, y, w, h, color) => {
    paths[color] = (paths[color] ?? "") + `M${x} ${y}h${w}v${h}h-${w}z`;
  };
  drawRows(rect, 0, 0, rows, CINDY_COLORS);
  let face = "";
  eyes((x, y, w, h) => { face += `M${x - 12} ${y - 12}h${w}v${h}h-${w}z`; }, "neutral", { x: 0, y: 0 });
  return [...Object.entries(paths), [ink, face]];
})();

const paw = ["..kkkk..", ".kcccck.", "kccccsck", "kcccssak", "kccssaak", ".kaaakk.", "..kkk..."];
const globe = [
  "......kkkkkk......", "....kkwwwwwwkk....", "...kwwvvvwwwwwk...", "..kwwwvvvwwwwvwk..",
  ".kwwwwvvvvwwvvwwk.", "kwwwwwwvvwwwvvwwwk", "kwwwwwwvvvwwwvwwwk", "kwwwwwwwvvvvwwwwwk",
  "kwwwwwwwvvvwwwwwwk", "kwwwwwwwvvwwwwwwwk", "kwwwwwwwwvwwwwwwwk", ".kwwwwwwwvvwwwwwk.",
  "..kwwwwwwwwwwwwk..", "...kwwwwwwwwwwk...", "....kkwwwwwwkk....", "......kkkkkk......",
];

export function paintCindy(
  canvas: CanvasRenderingContext2D,
  pose: CindyPose,
  expression: CindyExpression,
  gaze: PixelOffset,
  alternate: boolean,
  step = 0,
  compact = false,
) {
  canvas.clearRect(0, 0, CINDY_BITMAP, CINDY_BITMAP);
  drawCindy((x, y, w, h, color) => {
    canvas.fillStyle = color;
    canvas.fillRect(pixel(x), pixel(y), pixel(x + w) - pixel(x), pixel(y + h) - pixel(y));
  }, pose, expression, gaze, alternate, step, compact);
}

const spriteBounds = new Map<string, { left: number; right: number; top: number; bottom: number }>();

export function cindySpriteBounds(pose: CindyPose, sleeping: boolean, step: number, compact: boolean, facing: number) {
  const key = [pose, sleeping, step, compact].join(":");
  let bounds = spriteBounds.get(key);
  if (!bounds) {
    const center = CINDY_BITMAP / 2;
    const scale = compact ? 1 : 2;
    bounds = { left: 0, right: 0, top: 0, bottom: 0 };
    const box = bounds;
    drawCindy((x, y, w, h) => {
      box.left = Math.max(box.left, (center - pixel(x)) * scale);
      box.right = Math.max(box.right, (pixel(x + w) - center) * scale);
      box.top = Math.max(box.top, (center - pixel(y)) * scale);
      box.bottom = Math.max(box.bottom, (pixel(y + h) - center) * scale);
    }, pose, sleeping ? "sleep" : "neutral", { x: 0, y: 0 }, false, step, compact);
    spriteBounds.set(key, bounds);
  }
  return facing === 1 ? bounds : { ...bounds, left: bounds.right, right: bounds.left };
}

function drawCindy(
  rect: Rect, pose: CindyPose, expression: CindyExpression, gaze: PixelOffset,
  alternate: boolean, step: number, compact: boolean,
) {
  const hand = (x: number, y: number, flip = false) => drawRows(rect, x, y, paw, CINDY_COLORS, flip);

  drawRows(rect, 12, 12, rows, alternate ? alternateColors : CINDY_COLORS);
  eyes(rect, expression, gaze);

  const flag = (x: number, y: number) => {
    rect(x, y, 2, 17, ink);
    rect(x + 2, y, 7, 5, "#ad4236");
    rect(x + 2, y + 3, 4, 2, "#dd6554");
  };

  const seated = () => {
    for (const x of [18, 37]) {
      rect(x, 49, 8, 3, ink);
      rect(x + 1, 49, 6, 2, cream);
    }
  };

  switch (pose) {
    case "walk": {
      const stride = [0, 2, -2][step] ?? 0;
      rect(20 - stride, 50, 8, 3 + Math.max(0, stride), ink);
      rect(36 + stride, 50, 8, 3 + Math.max(0, -stride), ink);
      rect(21 - stride, 50, 6, 2, cream);
      rect(37 + stride, 50, 6, 2, cream);
      flag(compact ? 42 : 46, 30);
      break;
    }
    case "perch":
      seated();
      hand(15, 44);
      hand(41, 44, true);
      break;
    case "hello":
      hand(compact ? 12 : 8, 32);
      flag(42, 27);
      break;
    case "timeline":
      if (!compact) hand(46, 34, true);
      flag(compact ? 40 : 46, 23);
      break;
    case "flag":
      flag(compact ? 40 : 46, 21);
      hand(compact ? 36 : 44, 35, true);
      break;
    case "earth":
      drawRows(rect, 23, 37, globe, { k: ink, w: "#6586a4", v: "#8cab68" });
      hand(19, 44);
      hand(39, 44, true);
      break;
    case "music": {
      seated();
      const band = "#343b49";
      rect(23, 8, 18, 3, band);
      rect(18, 10, 5, 3, band);
      rect(41, 10, 5, 3, band);
      rect(14, 12, 5, 11, band);
      rect(45, 12, 5, 11, band);
      for (const x of [compact ? 12 : 10, compact ? 44 : 46]) {
        rect(x, 20, 8, 13, band);
        rect(x + 1, 22, 4, 9, "#7387a3");
      }
      break;
    }
    case "skills":
      hand(compact ? 12 : 9, 42);
      hand(compact ? 42 : 47, 42, true);
      break;
    case "think":
      seated();
      hand(40, 33, true);
      break;
    case "bye":
      hand(compact ? 44 : 48, 27, true);
      rect(compact ? 47 : 53, 21, 2, 3, brown);
      break;
  }
}
