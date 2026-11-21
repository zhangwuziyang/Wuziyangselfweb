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

export type CindyPose = "rest" | "hello" | "point" | "timeline" | "laptop" | "earth" | "music" | "skills" | "think" | "bye";
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
    drawRows(rect, 51, 10, glyph, colors);
    drawRows(rect, 56, 6, glyph, colors);
    drawRows(rect, 61, 2, glyph, colors);
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
) {
  canvas.clearRect(0, 0, 64, 64);
  const rect: Rect = (x, y, w, h, color) => {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, w, h);
  };
  const hand = (x: number, y: number, flip = false) => drawRows(rect, x, y, paw, CINDY_COLORS, flip);

  drawRows(rect, 12, 12, rows, alternate ? alternateColors : CINDY_COLORS);
  eyes(rect, expression, gaze);

  switch (pose) {
    case "hello":
      hand(5, 32);
      rect(3, 28, 2, 3, brown);
      rect(7, 25, 3, 1, brown);
      break;
    case "point":
      hand(9, 37);
      rect(5, 37, 5, 4, ink);
      rect(6, 38, 4, 2, cream);
      break;
    case "timeline":
      hand(48, 32, true);
      rect(59, 21, 1, 23, "#8191aa");
      rect(57, 21, 5, 5, "#aac5ea");
      rect(57, 30, 5, 5, "#aac5ea");
      rect(57, 39, 5, 5, "#62748c");
      break;
    case "laptop":
      rect(23, 40, 20, 12, ink);
      rect(24, 41, 18, 10, "#62687b");
      rect(25, 42, 16, 1, "#a4a8b0");
      rect(30, 46, 5, 2, "#d7dadb");
      rect(20, 52, 26, 3, ink);
      rect(21, 52, 24, 1, "#abb0bb");
      hand(17, 46);
      hand(42, 46, true);
      break;
    case "earth":
      drawRows(rect, 23, 37, globe, { k: ink, w: "#6586a4", v: "#8cab68" });
      hand(19, 44);
      hand(39, 44, true);
      break;
    case "music": {
      const band = "#343b49";
      rect(23, 8, 18, 3, band);
      rect(18, 10, 5, 3, band);
      rect(41, 10, 5, 3, band);
      rect(14, 12, 5, 11, band);
      rect(45, 12, 5, 11, band);
      for (const x of [10, 46]) {
        rect(x, 20, 8, 13, band);
        rect(x + 1, 22, 4, 9, "#7387a3");
      }
      rect(56, 9, 2, 7, "#a6b8d3");
      rect(57, 9, 5, 2, "#a6b8d3");
      rect(53, 15, 4, 3, "#a6b8d3");
      break;
    }
    case "skills":
      hand(6, 42);
      hand(50, 42, true);
      rect(2, 15, 8, 5, "#ae6b5c");
      rect(54, 11, 9, 5, "#738166");
      rect(2, 23, 6, 4, "#b59065");
      rect(56, 21, 7, 4, "#6586a4");
      break;
    case "think":
      hand(40, 33, true);
      break;
    case "bye":
      hand(51, 27, true);
      rect(58, 23, 2, 3, brown);
      rect(54, 21, 3, 1, brown);
      break;
  }
}
