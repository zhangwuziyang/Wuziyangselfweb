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

export const CINDY_BITMAP = 64;
export type CindyPose = "rest" | "walk" | "hello" | "book" | "timeline" | "flag" | "earth" | "music" | "skills" | "think" | "bye";
export type CindyExpression = "neutral" | "happy" | "wink" | "surprise" | "think" | "shy" | "sleep";
export type PixelOffset = { x: number; y: number };

const ink = CINDY_COLORS.k;
const cream = CINDY_COLORS.c;
const brown = CINDY_COLORS.b;

type Rect = (x: number, y: number, width: number, height: number, color: string) => void;
type Performance = { blink?: boolean; mouth?: boolean; tail?: number };

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

function eyes(rect: Rect, expression: CindyExpression, gaze: PixelOffset, blink = false) {
  for (const x of [22, 40]) {
    if (blink || expression === "sleep") {
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

// A striped tail curled around the front of her feet, inside the body's silhouette so it
// never widens the sprite. Frame 0 rests; 1 lifts the tip and 2 curls it in: a small wag.
const tails = [
  ["........", "kk......", "kak.....", "kbk.....", "kaak....", ".kbaakkk", "..kkkkk."],
  ["kk......", "kak.....", "kbk.....", "kak.....", "kbak....", ".kaabkkk", "..kkkkk."],
  ["........", "........", ".kkk....", "kaak....", "kbak....", ".kaabkkk", "..kkkkk."],
] as const;
const paw = ["..kkkk..", ".kcccck.", "kccccsck", "kcccssak", "kccssaak", ".kaaakk.", "..kkk..."];
const globe = [
  "......kkkkkk......", "....kkwwwwwwkk....", "...kwwvvvwwwwwk...", "..kwwwvvvwwwwvwk..",
  ".kwwwwvvvvwwvvwwk.", "kwwwwwwvvwwwvvwwwk", "kwwwwwwvvvwwwvwwwk", "kwwwwwwwvvvvwwwwwk",
  "kwwwwwwwvvvwwwwwwk", "kwwwwwwwvvwwwwwwwk", "kwwwwwwwwvwwwwwwwk", ".kwwwwwwwvvwwwwwk.",
  "..kwwwwwwwwwwwwk..", "...kwwwwwwwwwwk...", "....kkwwwwwwkk....", "......kkkkkk......",
];
const lens = [
  "...kkkk...", "..kkggkk..", ".kggggggk.", "kkghggggkk", "kggggggggk",
  "kggggggggk", "kkggggggkk", ".kggggggk.", "..kkggkk..", "...kkkk...",
];

export function paintCindy(
  canvas: CanvasRenderingContext2D,
  pose: CindyPose,
  expression: CindyExpression,
  gaze: PixelOffset,
  step = 0,
  compact = false,
  performance?: Performance,
) {
  canvas.clearRect(0, 0, CINDY_BITMAP, CINDY_BITMAP);
  drawCindy((x, y, w, h, color) => {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, w, h);
  }, pose, expression, gaze, step, compact, performance);
}

const spriteBounds = new Map<string, { left: number; right: number; top: number; bottom: number }>();

export function cindySpriteBounds(pose: CindyPose, sleeping: boolean, step: number, compact: boolean, facing: number, scale: number) {
  const key = [pose, sleeping, step, compact, scale].join(":");
  let bounds = spriteBounds.get(key);
  if (!bounds) {
    const center = CINDY_BITMAP / 2;
    bounds = { left: 0, right: 0, top: 0, bottom: 0 };
    const box = bounds;
    drawCindy((x, y, w, h) => {
      box.left = Math.max(box.left, (center - x) * scale);
      box.right = Math.max(box.right, (x + w - center) * scale);
      box.top = Math.max(box.top, (center - y) * scale);
      box.bottom = Math.max(box.bottom, (y + h - center) * scale);
    }, pose, sleeping ? "sleep" : "neutral", { x: 0, y: 0 }, step, compact);
    spriteBounds.set(key, bounds);
  }
  return facing === 1 ? bounds : { ...bounds, left: bounds.right, right: bounds.left };
}

function drawCindy(
  rect: Rect, pose: CindyPose, expression: CindyExpression, gaze: PixelOffset,
  step: number, compact: boolean, performance?: Performance,
) {
  const hand = (x: number, y: number, flip = false) => drawRows(rect, x, y, paw, CINDY_COLORS, flip);

  drawRows(rect, 12, 12, rows, CINDY_COLORS);
  eyes(rect, expression, gaze, performance?.blink);
  // Paws and props drawn below sit on top of the tail. Walk frames are compact and tail-less.
  if (!compact && pose !== "walk") drawRows(rect, 12, 44, tails[performance?.tail ?? 0] ?? tails[0], CINDY_COLORS);
  if (performance?.mouth) {
    rect(29, 34, 6, 5, cream);
    rect(30, 35, 4, 3, ink);
    rect(31, 37, 2, 1, CINDY_COLORS.p);
  }

  const seated = () => {
    for (const x of [18, 37]) {
      rect(x, 49, 8, 3, ink);
      rect(x + 1, 49, 6, 2, cream);
    }
  };

  switch (pose) {
    case "walk": {
      const stride = [0, 2, -2][step] ?? 0;
      hand(12, 39 + stride);
      hand(44, 39 - stride, true);
      rect(20 - stride, 50, 8, 3 + Math.max(0, stride), ink);
      rect(36 + stride, 50, 8, 3 + Math.max(0, -stride), ink);
      rect(21 - stride, 50, 6, 2, cream);
      rect(37 + stride, 50, 6, 2, cream);
      break;
    }
    case "book":
      seated();
      rect(20, 40, 24, 10, ink);
      rect(22, 40, 9, 8, "#f5e3bb");
      rect(33, 40, 9, 8, step === 1 ? "#fff1d4" : "#f5e3bb");
      rect(24, 43, 5, 1, "#b89a77");
      rect(35, 43, 5, 1, "#b89a77");
      hand(17, 45);
      hand(40, 45, true);
      break;
    case "hello":
      hand(compact ? 12 : 8, 32 - step * 2);
      break;
    case "timeline":
      rect(43, 25, 2, 20, "#6c4834");
      for (const y of [27, 34, 41]) rect(42, y, 4, 3, y === 27 + step * 7 ? "#b2543b" : cream);
      hand(41, 43, true);
      break;
    case "flag": {
      const x = compact ? 48 : 51;
      const y = 21 - step;
      rect(x, y, 1, 17, brown);
      drawRows(rect, x + 1, y, ["rrrr..", "rddrr.", "rdddrr", "rrrr..", "rrr..."], {
        r: "#ad4236", d: "#dd6554",
      });
      hand(x - 3, y + 12, true);
      break;
    }
    case "earth":
      drawRows(rect, 23, 37, globe, { k: ink, w: "#6586a4", v: "#8cab68" });
      rect(29 + 3 * step, 43, 2, 2, "#f4d697");
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
    case "skills": {
      const y = 35 - step;
      hand(44, y + 11, true);
      drawRows(rect, 41, y, lens, { k: ink, g: "#b7d1d0", h: "#f4faf7" });
      drawRows(rect, 47, y + 8, ["kk...", "kak..", ".kak.", "..kak", "...kk"], {
        k: ink, a: "#ad794c",
      });
      break;
    }
    case "think":
      seated();
      hand(40, 33, true);
      break;
    case "bye":
      hand(compact ? 44 : 48, 27 - step * 2, true);
      rect(compact ? 47 : 53, 21 - step, 2, 3, brown);
      break;
  }
}
