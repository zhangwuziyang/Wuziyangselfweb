// Run after npm run build. This checks the production runtime against conservative
// text/image bounds in a simulated scrollport. check-cindy-scroll.mjs checks actual browser rectangles.
import assert from "node:assert/strict";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import htmlParser from "next/dist/compiled/node-html-parser/index.js";

const directory = await mkdtemp(join(tmpdir(), "cindy-layout-"));
const modules = ["cindy-route", "cindy-scenes", "cindy-motion", "cindy-sprite"];
const box = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
const intersects = (a, b) => Math.min(a.right, b.right) > Math.max(a.left, b.left)
  && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top);

class Element extends EventTarget {
  children = new Map();
  attrs = new Map();
  variables = new Map();
  style = {
    setProperty: (key, value) => this.variables.set(key, value),
    getPropertyValue: key => this.variables.get(key),
  };
  dataset = {};
  scrollTop = 0;
  textContent = "";
  constructor(rect = () => box(0, 0, 0, 0)) { super(); this.rect = rect; }
  getBoundingClientRect() { return this.rect(); }
  querySelector(key) { return this.children.get(key) ?? null; }
  querySelectorAll() { return []; }
  setAttribute(key, value) { this.attrs.set(key, value); }
  removeAttribute(key) { this.attrs.delete(key); }
  hasAttribute(key) { return this.attrs.has(key); }
  toggleAttribute(key, value) { if (value) this.setAttribute(key, ""); else this.removeAttribute(key); }
}

function canvas() {
  const element = new Element();
  const context = {
    canvas: element,
    globalAlpha: 1,
    painted: [],
    facing: 1,
    setTransform(facing) { this.facing = facing; },
    resetTransform() { this.facing = 1; },
    clearRect() { this.painted = []; },
    fillRect(x, y, w, h) {
      this.paintFacing = this.facing;
      this.painted.push(box(this.facing < 0 ? 64 - x - w : x, y, w, h));
    },
    drawImage(source) { if (this.globalAlpha > 0) this.painted.push(...source.getContext().painted); },
  };
  element.getContext = () => context;
  return element;
}

try {
  for (const name of modules) {
    const source = await readFile(new URL(`../components/home/${name}.ts`, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
    await writeFile(join(directory, name + ".js"), compiled.outputText);
  }
  const { mountCindy, updateCindyDialogue } = (await import(pathToFileURL(join(directory, "cindy-motion.js")))).default;
  const { CHAPTERS, CINDY_SCENES } = (await import(pathToFileURL(join(directory, "cindy-scenes.js")))).default;
  const html = htmlParser.parse(await readFile(new URL("../.next/server/app/index.html", import.meta.url), "utf8"));
  const guideCSS = await readFile(new URL("../components/home/cindy-guide.css", import.meta.url), "utf8");
  const storyCSS = await readFile(new URL("../app/home-story.css", import.meta.url), "utf8");
  assert.match(guideCSS, /\.cindy-hint\s*\{[^}]*transform:\s*translate\(-50%,/);
  assert.match(storyCSS, /@media \(width < 48rem\)\s*\{[\s\S]*?\.story-content\s*\{[^}]*overflow:\s*auto;/);
  assert.match(storyCSS, /section:nth-child\(even\) > \.cindy-station\s*\{ grid-area: 1 \/ 2;/);

  const openLine = { chapter: "hero", since: 0 };
  assert.equal(updateCindyDialogue(openLine, "hero", true, 16), openLine);
  assert.equal(updateCindyDialogue(openLine, "hero", false, 16), undefined);
  assert.deepEqual(updateCindyDialogue(openLine, "about", true, 32), { chapter: "about", since: 32 });

  function simulate(width, height, lang, reduce = false) {
    const mobile = width < 768;
    const pixels = mobile ? 3 : 5.6;
    const nav = 49;
    const stageHeight = 160;
    const readerTop = mobile ? nav + stageHeight : 0;
    const readerBottom = mobile ? height - 69 : height;
    const wing = mobile ? Math.max(16, Math.min(width * .045, 32)) : 112;
    const lane = 360;
    const gap = width * .035;
    const crossingGap = mobile ? 0 : Math.max(192, Math.min(28 * 16 - width * .16, 272));
    const shellLeft = mobile ? wing : wing + lane + gap;
    const shellWidth = width - wing - shellLeft;
    const sectionHeights = mobile
      ? [740, 1180, 1480, 1740, 1520, 980, 825, 720, 740]
      : [900, 1016, 1270, 1190, 1100, 995, 645, 570, 690];
    const clip = box(0, readerTop, width, readerBottom - readerTop);
    const home = new Element();
    const reader = new Element(() => clip);
    const stage = new Element();
    const dock = new Element();
    const button = new Element();
    const note = new Element();
    const noteMeasure = new Element();
    const noteText = new Element();
    const bitmap = canvas();
    const page = new Element();
    page.scrollY = 0;
    const scroll = () => mobile ? reader.scrollTop : page.scrollY;
    let cursor = readerTop;
    const obstacles = [];
    const chapterTops = [];

    // Every SSR text node and image gets its section's entire content column as
    // a conservative envelope. On mobile the reader clips this to its viewport.
    function addContent(node, bounds) {
      if (node.nodeType === 3 && node.textContent.trim()) obstacles.push({ kind: "text", bounds });
      if (node.rawTagName === "img") obstacles.push({ kind: "image", bounds });
      for (const child of node.childNodes ?? []) addContent(child, bounds);
    }

    home.children.set(".story-nav", new Element(() => box(0, 0, width, nav)));
    home.children.set(".story-content", reader);
    home.children.set(".cindy-mobile-stage", stage);
    if (mobile) {
      const stageWing = wing + Math.max(0, (width - 512) / 2);
      stage.children.set(".cindy-mobile-stage__art", new Element(() => box(stageWing, nav, 136, stageHeight)));
      stage.children.set(".cindy-mobile-stage__caption", new Element(() => box(stageWing + 146, nav + 8, width - stageWing * 2 - 146, 144)));
    }
    for (const [index, chapter] of CHAPTERS.entries()) {
      const markup = html.querySelector(`#${chapter}`);
      assert.ok(markup.querySelector(`[data-cindy-station="${chapter}"]`), `${chapter} renders a Cindy station`);
      if (index) cursor += crossingGap;
      const top = cursor;
      const sectionHeight = sectionHeights[index];
      chapterTops.push(top - readerTop);
      cursor += sectionHeight;
      const zone = new Element();
      zone.parentElement = new Element(() => box(0, top - scroll(), width, sectionHeight));
      const right = !mobile && index % 2 === 1;
      const laneLeft = right ? width - wing - lane : wing;
      const copyLeft = right ? wing : shellLeft;
      const padding = mobile ? 0 : 74;
      const copy = box(copyLeft, top + padding, shellWidth, sectionHeight - padding * 2);
      zone.parentElement.children.set(".story-shell", new Element(() => box(copy.left, copy.top - scroll(), copy.width, copy.height)));
      const artHeight = pixels * 50 + 12;
      zone.children.set(".cindy-station__mark", new Element(() => box(laneLeft, top - scroll(), lane, artHeight)));
      zone.children.set(".cindy-station__hint", new Element(() => box(laneLeft, top - scroll() + artHeight + 5.6, lane, 20.8)));
      zone.children.set(".cindy-station__caption", new Element(() => box(laneLeft + 28, top - scroll() + artHeight + 32, 304, 92)));
      home.children.set(`[data-cindy-station="${chapter}"]`, zone);
      // Include room for focus outlines and the content's 10px reveal offset.
      addContent(markup.querySelector(".story-shell"), box(copy.left - 5, copy.top - 5, copy.width + 10, copy.height + 20));
    }
    const footerHeight = 235;
    addContent(html.querySelector("[data-cindy-finish]"), box(shellLeft, cursor, shellWidth, footerHeight));
    const end = cursor + footerHeight - readerBottom;
    assert.ok(obstacles.some(({ kind }) => kind === "image"));
    assert.ok(obstacles.some(({ kind }) => kind === "text"));

    const document = new Element();
    document.documentElement = new Element();
    Object.assign(document.documentElement, { clientHeight: height, lang });
    document.createElement = canvas;
    dock.closest = () => home;
    const reduced = new Element();
    reduced.matches = reduce;
    page.matchMedia = () => reduced;
    let time = 0, id = 0;
    const frames = new Map(), timers = new Map();
    page.setTimeout = (fn, delay) => { timers.set(++id, [time + delay, fn]); return id; };
    page.clearTimeout = timer => timers.delete(timer);
    Object.assign(globalThis, {
      window: page, document, performance: { now: () => time },
      getComputedStyle: () => ({ getPropertyValue: () => String(pixels) }),
      requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
      cancelAnimationFrame: frame => frames.delete(frame),
      ResizeObserver: class { observe() {} disconnect() {} },
      MutationObserver: class { observe() {} disconnect() {} },
    });

    const value = key => Number.parseFloat(dock.variables.get(`--cindy-${key}`));
    const captionHeight = () => {
      const size = mobile ? 14 : 16;
      const usable = value("note-width") - (mobile ? 21.2 : 27.6);
      const letters = [...noteMeasure.textContent].reduce((sum, letter) => sum + (/\p{Script=Han}/u.test(letter) ? 1 : .53), 0);
      return Math.ceil((letters * size) / usable) * size * (mobile ? 1.35 : 1.38) + 20;
    };
    Object.defineProperties(note, {
      offsetHeight: { get: () => Math.min(captionHeight(), value("note-height")) },
      scrollHeight: { get: captionHeight },
      clientHeight: { get: () => note.offsetHeight },
    });

    const unmount = mountCindy({ dock, button, sprite: bitmap, note, noteMeasure, noteText });
    const target = mobile ? reader : page;
    const render = delta => {
      time += delta;
      for (const [timer, [at, callback]] of timers) {
        if (at > time) continue;
        timers.delete(timer);
        callback();
      }
      const pending = [...frames.values()];
      frames.clear();
      for (const fn of pending) fn(time);
    };
    const jump = (top, frameMs = 16) => {
      if (mobile) reader.scrollTop = top;
      else page.scrollY = top;
      target.dispatchEvent(new Event("scroll"));
      render(frameMs);
    };
    const counts = { sprite: 0, hint: 0, bubble: 0 };
    let minWidth = Infinity, maxWidth = 0;
    function check() {
      assert.equal(button.attrs.get("aria-hidden"), "false");
      const [, x, y] = dock.style.transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px/).map(Number);
      const scale = value("pixels");
      const squash = value("squash");
      const hit = box(x - 20 * scale, y - 20 * scale, 40 * scale, 40 * scale);
      const paint = bitmap.getContext().painted;
      const left = Math.min(...paint.map(rect => rect.left)), right = Math.max(...paint.map(rect => rect.right));
      const top = Math.min(...paint.map(rect => rect.top)), bottom = Math.max(...paint.map(rect => rect.bottom));
      const ink = box(x + (left - 32) * scale, y + (top - 32) * scale * squash, (right - left) * scale, (bottom - top) * scale * squash);
      const idlePad = dock.hasAttribute("data-idle") && !reduce ? 6 : 0;
      const spriteBox = box(Math.min(hit.left, ink.left) - idlePad, Math.min(hit.top, ink.top) - idlePad - 2,
        Math.max(hit.right, ink.right) - Math.min(hit.left, ink.left) + idlePad * 2,
        Math.max(hit.bottom, ink.bottom) - Math.min(hit.top, ink.top) + idlePad * 2 + 2);
      assert.ok(hit.width >= (mobile ? 115 : 200) && hit.width <= (mobile ? 120.01 : 224.01));
      assert.ok(ink.width >= (mobile ? 115 : 200) && ink.width <= (mobile ? 135 : 260));
      minWidth = Math.min(minWidth, hit.width);
      maxWidth = Math.max(maxWidth, hit.width);
      const parts = [["sprite", spriteBox]];
      if (dock.hasAttribute("data-hint")) {
        const hintWidth = Math.min(value("hint-width"), lang === "zh" ? 109 : 145);
        parts.push(["hint", box(x - hintWidth / 2, y + value("hint-y") - 8, hintWidth, 16)]);
      }
      if (dock.hasAttribute("data-speaking")) {
        const noteX = x + value("note-x");
        const noteTop = y + value("note-y") - (mobile ? note.offsetHeight / 2 : 0);
        const tip = mobile ? { x: 8, y: 0 } : { x: 0, y: 8 };
        parts.push(["bubble", box(noteX - tip.x, noteTop - tip.y, value("note-width") + tip.x, note.offsetHeight + tip.y)]);
        if (!mobile) assert.ok(Math.abs(noteX + value("note-tip") - x) < .01);
      }
      for (const [part, rect] of parts) {
        counts[part]++;
        assert.ok(rect.left >= 0 && rect.right <= width && rect.top >= 0 && rect.bottom <= height, part + " fits the viewport");
        if (mobile) assert.ok(rect.top >= nav && rect.bottom <= readerTop, part + " fits between the nav and reader");
        for (const { kind, bounds } of obstacles) {
          const top = Math.max(clip.top, bounds.top - scroll());
          const bottom = Math.min(clip.bottom, bounds.bottom - scroll());
          if (bottom <= top) continue;
          assert.ok(!intersects(rect, box(bounds.left, top, bounds.width, bottom - top)), `${width}×${height} ${part} overlaps ${kind} at ${scroll()}`);
        }
      }
      if (mobile) assert.ok(clip.bottom <= height - 62, "launcher is below the reader");
      return { x, y, scale, squash, facing: bitmap.getContext().paintFacing };
    }

    const positions = Array.from({ length: Math.ceil(end / 12) + 1 }, (_, index) => Math.min(index * 12, end));
    const forward = new Map();
    let previous;
    for (const position of positions) {
      jump(position);
      const frame = check();
      if (dock.hasAttribute("data-parked")) assert.ok(dock.hasAttribute("data-speaking"), "slow scrolling shows the bubble as soon as Cindy parks");
      if (previous) assert.ok(Math.hypot(frame.x - previous.x, frame.y - previous.y) < (mobile ? 12 : 90), "adjacent wheel steps stay continuous");
      forward.set(position, frame);
      previous = frame;
    }
    let reversedWalking = 0;
    for (const position of positions.reverse()) {
      jump(position);
      const { facing, ...pose } = check();
      const { facing: other, ...original } = forward.get(position);
      assert.deepEqual(pose, original, "scrolling backward retraces the same route");
      if (!mobile && !reduce && Math.abs(pose.x - width / 2) < 150 && facing === -other) reversedWalking++;
    }
    if (!mobile && !reduce) {
      assert.ok(reversedWalking > 40, "walking sprite mirrors with scroll direction");
      assert.ok([...forward.values()].some(({ squash }) => squash < .95));
      assert.ok([...forward.values()].some(({ squash }) => squash > 1.01));
    }
    jump(12, 8);
    jump(24, 8);
    assert.ok(!dock.hasAttribute("data-speaking"), "speed also suppresses the bubble across smaller, high-frequency steps");
    for (const top of chapterTops.slice(1, 4)) {
      jump(top);
      render(54);
      assert.ok(dock.hasAttribute("data-parked"));
      assert.ok(!dock.hasAttribute("data-speaking"), "fast scrolling through a brief park suppresses the bubble");
    }
    for (const [index, top] of chapterTops.entries()) {
      jump(Math.min(top, end));
      assert.equal(dock.attrs.get("data-scene"), CHAPTERS[index]);
      assert.ok(dock.hasAttribute("data-hint"), `hint is visible at the ${CHAPTERS[index]} anchor (${width}×${height})`);
      render(103);
      assert.ok(!dock.hasAttribute("data-speaking"), "bubble stays hidden during the fast-scroll window");
      render(1);
      assert.ok(dock.hasAttribute("data-speaking"), "bubble appears when the fast-scroll window closes without another scroll event");
      if (!mobile) {
        const parkedFrame = check();
        assert.equal(parkedFrame.x > width / 2, index % 2 === 1, "desktop chapters alternate sides");
        assert.equal(parkedFrame.facing, index % 2 === 1 ? -1 : 1, "parked Cindy faces the copy");
      }
      const line = CINDY_SCENES[CHAPTERS[index]].line[lang === "en" ? "en" : "zh"];
      if (reduce) {
        assert.equal(noteText.textContent, line, "reduced motion reveals the entire line");
      } else {
        const tokens = lang === "en" ? line.match(/\S+\s*/g) : Array.from(line);
        assert.equal(noteText.textContent, tokens[0], "typewriter starts at the first token on arrival, including revisits");
        for (let shown = 1; shown < tokens.length; shown++) {
          render(29);
          check();
          assert.equal(noteText.textContent, tokens.slice(0, shown).join(""));
          render(1);
          assert.equal(noteText.textContent, tokens.slice(0, shown + 1).join(""), "typewriter advances every 30ms without scrolling");
        }
        assert.equal(noteText.textContent, line);
      }
      check();
    }
    unmount();
    console.log(`${width}×${height} ${lang}${reduce ? " reduced motion" : ""}: ${obstacles.length} text/image bounds, ${counts.sprite} sprite / ${counts.hint} hint / ${counts.bubble} bubble frames, ${minWidth.toFixed(1)}–${maxWidth.toFixed(1)}px, 0 intersections`);
  }

  for (const lang of ["en", "zh-CN"]) {
    simulate(1440, 900, lang);
    simulate(390, 844, lang);
  }
  simulate(1440, 900, "en", true);
  simulate(320, 568, "zh-CN", true);
} finally {
  await rm(directory, { recursive: true, force: true });
}
