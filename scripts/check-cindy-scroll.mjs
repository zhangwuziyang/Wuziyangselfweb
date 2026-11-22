// Run against a local Next server with puppeteer-core available to Node.
// CHROME_PATH and CINDY_SCROLL_URL can override the Chrome executable and homepage.
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

const { default: puppeteer } = await import(process.env.CINDY_PUPPETEER || "puppeteer-core");

const URL = process.env.CINDY_SCROLL_URL || "http://localhost:3000";
const DELTA = 12;
const STEP_MS = 16;
const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"];

async function check(browser, width, height, { mobile = false, reduced = false, chinese = false } = {}) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
    await page.evaluateOnNewDocument(lang => localStorage.setItem("wz-lang", lang), chinese ? "zh" : "en");
    const response = await page.goto(URL, { waitUntil: "load" });
    assert.ok(response?.ok() || response?.status() === 304, `Homepage loads (${response?.status()})`);
    await page.waitForSelector('.cindy-sprite[data-sprite="ready"][aria-hidden="false"]');
    await page.waitForSelector(".story-content > footer");
    await page.evaluate(() => document.fonts.ready);
    const maxScroll = await page.evaluate(async mobile => {
      // Let the first rendered pose reach the screen before the opening sample.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const root = document.documentElement;
      const content = document.querySelector(".story-content");
      const scroller = mobile ? content : root;
      const dock = document.querySelector(".cindy-dock");
      const sprite = dock.querySelector(".cindy-sprite");
      const hint = dock.querySelector(".cindy-hint");
      const note = dock.querySelector(".cindy-note");
      const launcher = document.querySelector(".profile-chat-launcher__button");
      const canvas = sprite.querySelector("canvas");
      const context = canvas.getContext("2d");
      const text = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      const ranges = [];
      const images = [...content.querySelectorAll("img, figure, article, .story-panel")];
      while (text.nextNode()) {
        const node = text.currentNode;
        if (!node.textContent.trim() || node.parentElement.closest("script, style, template, .sr-only, [hidden]")) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        ranges.push(range);
      }
      const samples = [];
      const issues = [];
      const parked = {};
      const sides = {};
      const chapterSamples = {};
      let previous = -1;
      let frame;

      const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > .5
        && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .5;

      function inkBounds(rect, pixels) {
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        let left = canvas.width, top = canvas.height, right = 0, bottom = 0;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (!data[(y * canvas.width + x) * 4 + 3]) continue;
            left = Math.min(left, x); right = Math.max(right, x + 1);
            top = Math.min(top, y); bottom = Math.max(bottom, y + 1);
          }
        }
        const scaleY = rect.height / canvas.height;
        const centerX = rect.left + rect.width / 2;
        return {
          left: centerX + (left - canvas.width / 2) * pixels, right: centerX + (right - canvas.width / 2) * pixels,
          top: rect.top + top * scaleY, bottom: rect.top + bottom * scaleY,
        };
      }

      function sample(force = false) {
        const scroll = scroller.scrollTop;
        if (!force && scroll === previous) return;
        const moved = scroll !== previous;
        previous = scroll;
        const hit = sprite.getBoundingClientRect();
        const ink = inkBounds(canvas.getBoundingClientRect(), hit.width / 40);
        const desktop = !mobile;
        const edge = desktop ? 80 : 4;
        const minWidth = desktop ? 200 : 115;
        const maxWidth = desktop ? 260 : 135;
        const fail = message => issues.push(`scrollY=${scroll} (${dock.dataset.scene}) ${message}`);
        if (sprite.getAttribute("aria-hidden") !== "false" || getComputedStyle(dock).opacity !== "1" || getComputedStyle(sprite).visibility !== "visible") fail("Cindy is hidden");
        if (hit.width < minWidth || hit.width > maxWidth) fail(`hit width ${hit.width}`);
        if (ink.right - ink.left < minWidth || ink.right - ink.left > maxWidth) fail(`painted width ${ink.right - ink.left}`);
        for (const box of [hit, ink]) {
          if (box.left < edge - .5 || box.right > root.clientWidth - edge + .5 || box.top < -.5 || box.bottom > root.clientHeight + .5) {
            fail(`outside the safe viewport (${JSON.stringify(box)})`);
          }
        }
        const parts = [["sprite", hit], ["painted sprite", ink]];
        if (Number(getComputedStyle(hint).opacity) > .01) {
          const box = hint.getBoundingClientRect();
          if (Math.abs(box.left + box.width / 2 - hit.left - hit.width / 2) > .5) fail("hint is off center");
          parts.push(["hint", box]);
        }
        if (getComputedStyle(note).visibility === "visible" && Number(getComputedStyle(note).opacity) > .01) {
          const box = note.getBoundingClientRect();
          // The bubble's tail must point at Cindy, on whichever side of the page she stands.
          const tip = box.left + note.clientLeft + Number.parseFloat(getComputedStyle(dock).getPropertyValue("--cindy-note-tip"));
          if (!mobile && Number(getComputedStyle(note).opacity) === 1 && Math.abs(tip - hit.left - hit.width / 2) > 1.5) fail(`bubble tail ${tip.toFixed(1)} is not under Cindy`);
          parts.push(["bubble", box], ["bubble tip", mobile
            ? { left: box.left - 7, right: box.left, top: box.top, bottom: box.bottom }
            : { left: hit.left + hit.width / 2 - 6, right: hit.left + hit.width / 2 + 6, top: box.top - 7, bottom: box.top }]);
        }
        if (mobile) parts.push(["launcher", launcher.getBoundingClientRect()]);
        const clip = mobile ? content.getBoundingClientRect() : { top: 0, bottom: root.clientHeight };
        for (const obstacle of [...ranges, ...images]) {
          const rects = obstacle instanceof Range ? obstacle.getClientRects() : [obstacle.getBoundingClientRect()];
          for (const rect of rects) {
            const visible = { left: rect.left, right: rect.right, top: Math.max(rect.top, clip.top), bottom: Math.min(rect.bottom, clip.bottom) };
            if (visible.bottom <= visible.top) continue;
            for (const [part, box] of parts) {
              if (overlap(box, visible)) fail(`${part} intersects ${obstacle instanceof Range ? "text" : obstacle.tagName}`);
            }
          }
        }
        if (!moved) return;
        const scene = dock.dataset.scene;
        chapterSamples[scene] = (chapterSamples[scene] ?? 0) + 1;
        if (dock.hasAttribute("data-parked")) {
          parked[scene] = (parked[scene] ?? 0) + 1;
          (sides[scene] ??= new Set()).add(hit.left + hit.width / 2 > root.clientWidth / 2 ? "right" : "left");
        }
        samples.push({
          scroll, width: hit.width, inset: Math.min(hit.left, ink.left, root.clientWidth - Math.max(hit.right, ink.right)),
          x: hit.left + hit.width / 2, y: hit.top + hit.height / 2,
        });
      }

      // Cindy schedules her render from her own scroll listener, registered at mount. Queuing
      // the sample from a later listener puts it after her render in the same frame, so each
      // sample pairs a scroll position with the pose drawn for it rather than the previous one.
      const events = new AbortController();
      (mobile ? content : window).addEventListener("scroll", () => {
        if (!frame) frame = requestAnimationFrame(() => { frame = 0; sample(); });
      }, { passive: true, signal: events.signal });
      sample();
      window.finishCindyScroll = () => {
        events.abort();
        cancelAnimationFrame(frame);
        frame = 0;
        sample(true);
        return { samples, issues, parked, chapterSamples, sides: Object.fromEntries(Object.entries(sides).map(([key, set]) => [key, [...set]])) };
      };
      window.sampleCindyAtRest = () => sample(true);
      return scroller.scrollHeight - scroller.clientHeight;
    }, mobile);
    const client = await page.createCDPSession();
    const started = performance.now();
    const wheels = [];
    for (let scroll = 0; scroll < maxScroll; scroll += DELTA) {
      wheels.push(client.send("Input.dispatchMouseEvent", {
        type: "mouseWheel", x: width * .65, y: height / 2, deltaX: 0, deltaY: DELTA,
      }));
      await delay(Math.max(0, started + wheels.length * STEP_MS - performance.now()));
    }
    await Promise.all(wheels);
    await page.waitForFunction((mobile, end) => (mobile ? document.querySelector(".story-content").scrollTop : window.scrollY) >= end - 1, {}, mobile, maxScroll);
    const { samples, issues, parked, chapterSamples, sides } = await page.evaluate(() => window.finishCindyScroll());
    assert.equal(samples[0].scroll, 0);
    assert.ok(samples.at(-1).scroll >= maxScroll - 1);
    assert.ok(samples.length >= Math.ceil(maxScroll / DELTA) * .75, "Wheel samples cover the page at the requested cadence");
    assert.equal(issues.length, 0, issues.slice(0, 12).join("\n"));
    assert.deepEqual(Object.keys(parked), CHAPTERS);
    for (const chapter of CHAPTERS) {
      assert.ok(parked[chapter] / chapterSamples[chapter] > .5, `Cindy spends most of ${chapter} parked`);
    }
    let fastest = 0;
    for (let index = 1; index < samples.length; index++) {
      const a = samples[index - 1], b = samples[index];
      const moved = Math.hypot(b.x - a.x, b.y - a.y);
      const step = Math.max(DELTA, b.scroll - a.scroll);
      fastest = Math.max(fastest, (moved - 5) / step);
      assert.ok(moved <= 5 + step * (mobile ? 1.25 : 4), `Continuous movement at scrollY=${b.scroll} (${moved.toFixed(1)}px over ${step}px)`);
    }
    if (!mobile) {
      for (const chapter of CHAPTERS) assert.equal(sides[chapter]?.length, 1, `${chapter} parks on one side (${sides[chapter]})`);
      for (let index = 1; index < CHAPTERS.length; index++) {
        assert.notEqual(sides[CHAPTERS[index]][0], sides[CHAPTERS[index - 1]][0], `${CHAPTERS[index - 1]} → ${CHAPTERS[index]} switches sides`);
      }
    }
    assert.ok(await page.$(".profile-chat-launcher__button"), "Global chat launcher remains available");
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".cindy-hint")).opacity) === 1);
    assert.equal(await page.$eval(".cindy-hint", hint => hint.textContent.trim()), chinese ? "点击我和我聊聊～" : "Click me to chat～");
    for (const chapter of CHAPTERS) {
      await page.evaluate((chapter, mobile) => {
        const section = document.getElementById(chapter);
        const reader = document.querySelector(".story-content");
        const scroller = mobile ? reader : window;
        const start = (mobile ? reader.scrollTop : window.scrollY) + section.getBoundingClientRect().top;
        const readerTop = mobile ? reader.getBoundingClientRect().top : 0;
        scroller.scrollTo({ top: start - readerTop, behavior: "instant" });
      }, chapter, mobile);
      await page.waitForFunction(chapter => {
        const note = document.querySelector('.cindy-dock[data-scene="' + chapter + '"][data-speaking] .cindy-note');
        return note && getComputedStyle(note).opacity === "1";
      }, {}, chapter);
      await page.evaluate(() => window.sampleCindyAtRest());
    }
    const stopped = await page.evaluate(() => window.finishCindyScroll());
    assert.equal(stopped.issues.length, 0, stopped.issues.slice(0, 12).join("\n"));
    console.log(`${width}×${height}: ${samples.length} wheel samples, width ${Math.min(...samples.map(item => item.width)).toFixed(1)}–${Math.max(...samples.map(item => item.width)).toFixed(1)}px, minimum inset ${Math.min(...samples.map(item => item.inset)).toFixed(1)}px, peak travel ${fastest.toFixed(2)}px per scrolled px${mobile ? "" : `, sides ${CHAPTERS.map(chapter => sides[chapter][0][0].toUpperCase()).join("")}`}`);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", headless: true,
    args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"],
  });
  try {
    await check(browser, 1440, 900);
    await check(browser, 390, 844, { mobile: true, chinese: true });
    await check(browser, 320, 568, { mobile: true, reduced: true });
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
