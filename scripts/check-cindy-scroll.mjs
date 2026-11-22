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
    assert.ok(response?.ok(), "Homepage loads");
    await page.waitForSelector('.cindy-sprite[data-sprite="ready"][aria-hidden="false"]');
    await page.waitForSelector(".story-content > footer");
    await page.evaluate(() => document.fonts.ready);
    const maxScroll = await page.evaluate(() => {
      const root = document.documentElement;
      const dock = document.querySelector(".cindy-dock");
      const sprite = dock.querySelector(".cindy-sprite");
      const canvas = sprite.querySelector("canvas");
      const context = canvas.getContext("2d");
      const obstacles = [...document.querySelectorAll(
        ".story-shell, .story-shell :is(h1,h2,h3,p,li,a,button,img,figure,article,.story-panel), .profile-chat-launcher__button",
      )];
      const samples = [];
      const issues = [];
      const parked = {};
      const chapterSamples = {};
      let previous = -1;
      let frame;

      const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > .5
        && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .5;

      function inkBounds(rect) {
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        let left = canvas.width, top = canvas.height, right = 0, bottom = 0;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (!data[(y * canvas.width + x) * 4 + 3]) continue;
            left = Math.min(left, x); right = Math.max(right, x + 1);
            top = Math.min(top, y); bottom = Math.max(bottom, y + 1);
          }
        }
        const scale = rect.width / canvas.width;
        return {
          left: rect.left + left * scale, right: rect.left + right * scale,
          top: rect.top + top * scale, bottom: rect.top + bottom * scale,
        };
      }

      function sample() {
        const scroll = window.scrollY;
        if (scroll === previous) return;
        previous = scroll;
        const hit = sprite.getBoundingClientRect();
        const ink = inkBounds(canvas.getBoundingClientRect());
        const desktop = root.clientWidth >= 768;
        const edge = desktop ? 80 : 4;
        const minWidth = desktop ? 200 : 140;
        const maxWidth = desktop ? 260 : 170;
        const fail = message => issues.push(`scrollY=${scroll} (${dock.dataset.scene}) ${message}`);
        if (sprite.getAttribute("aria-hidden") !== "false" || getComputedStyle(dock).opacity !== "1" || getComputedStyle(sprite).visibility !== "visible") fail("Cindy is hidden");
        if (hit.width < minWidth || hit.width > maxWidth) fail(`hit width ${hit.width}`);
        if (ink.right - ink.left < minWidth || ink.right - ink.left > maxWidth) fail(`painted width ${ink.right - ink.left}`);
        for (const box of [hit, ink]) {
          if (box.left < edge - .5 || box.right > root.clientWidth - edge + .5 || box.top < -.5 || box.bottom > root.clientHeight + .5) {
            fail(`outside the safe viewport (${JSON.stringify(box)})`);
          }
        }
        for (const element of obstacles) {
          const rect = element.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0 && (overlap(hit, rect) || overlap(ink, rect))) {
            fail(`intersects ${element.tagName}.${element.className}`);
            break;
          }
        }
        const scene = dock.dataset.scene;
        chapterSamples[scene] = (chapterSamples[scene] ?? 0) + 1;
        if (dock.hasAttribute("data-parked")) parked[scene] = (parked[scene] ?? 0) + 1;
        samples.push({
          scroll, width: hit.width, inset: Math.min(hit.left, ink.left, root.clientWidth - Math.max(hit.right, ink.right)),
          x: hit.left + hit.width / 2, y: hit.top + hit.height / 2,
        });
      }

      function collect() {
        sample();
        frame = requestAnimationFrame(collect);
      }
      collect();
      window.finishCindyScroll = () => {
        cancelAnimationFrame(frame);
        sample();
        return { samples, issues, parked, chapterSamples };
      };
      return root.scrollHeight - root.clientHeight;
    });
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
    await page.waitForFunction(end => window.scrollY >= end - 1, {}, maxScroll);
    const { samples, issues, parked, chapterSamples } = await page.evaluate(() => window.finishCindyScroll());
    assert.equal(samples[0].scroll, 0);
    assert.ok(samples.at(-1).scroll >= maxScroll - 1);
    assert.ok(samples.length >= Math.ceil(maxScroll / DELTA) * .75, "Wheel samples cover the page at the requested cadence");
    assert.equal(issues.length, 0, issues.slice(0, 12).join("\n"));
    assert.deepEqual(Object.keys(parked), CHAPTERS);
    for (const chapter of CHAPTERS) {
      assert.ok(parked[chapter] / chapterSamples[chapter] > .65, `Cindy spends most of ${chapter} parked`);
    }
    for (let index = 1; index < samples.length; index++) {
      const a = samples[index - 1], b = samples[index];
      assert.ok(Math.hypot(b.x - a.x, b.y - a.y) <= 3 + Math.max(DELTA, b.scroll - a.scroll) * 1.25, `Continuous movement at scrollY=${b.scroll}`);
    }
    assert.ok(await page.$(".profile-chat-launcher__button"), "Global chat launcher remains available");
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".cindy-hint")).opacity) === 1);
    assert.match(await page.$eval(".cindy-hint", hint => hint.textContent.trim()), chinese ? /可以随时和我聊聊/ : /Tap me to chat anytime/);
    console.log(`${width}×${height}: ${samples.length} wheel samples, width ${Math.min(...samples.map(item => item.width)).toFixed(1)}–${Math.max(...samples.map(item => item.width)).toFixed(1)}px, minimum inset ${Math.min(...samples.map(item => item.inset)).toFixed(1)}px`);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", headless: true });
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
