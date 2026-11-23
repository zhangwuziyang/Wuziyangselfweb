// Run against a local Next server with puppeteer-core available to Node.
// CHROME_PATH and CINDY_SCROLL_URL can override the Chrome executable and homepage.
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

const { default: puppeteer } = await import(process.env.CINDY_PUPPETEER || "puppeteer-core");

// The Cindy tour lives at /cindy; CINDY_SCROLL_URL is the server origin (a full /cindy URL also works).
const ORIGIN = process.env.CINDY_SCROLL_URL || "http://localhost:3000";
const URL = /\/cindy\/?$/.test(ORIGIN) ? ORIGIN : `${ORIGIN.replace(/\/$/, "")}/cindy`;
// Stress options for the wheel-entrance check: CDP CPU throttling rate and ± wheel interval jitter (ms).
const CPU_THROTTLE = Number(process.env.CINDY_CPU_THROTTLE || 0);
const WHEEL_JITTER = Number(process.env.CINDY_WHEEL_JITTER || 0);
const DELTA = 12;
const STEP_MS = 16;
const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"];

async function checkDialogue(page, mobile, reduced) {
  const result = await page.evaluate(async ({ mobile, reduced }) => {
    const reader = document.querySelector(".story-content");
    const scroller = mobile ? reader : window;
    const dock = document.querySelector(".cindy-dock");
    const note = dock.querySelector(".cindy-note");
    const measure = note.querySelector(".cindy-note__measure");
    const text = note.querySelector(".cindy-note__text");
    const hint = dock.querySelector(".cindy-hint");
    const position = () => mobile ? reader.scrollTop : window.scrollY;
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    const until = async (label, condition) => {
      const deadline = performance.now() + 4_000;
      while (!condition()) {
        if (performance.now() > deadline) throw new Error(label);
        await frame();
      }
    };
    const move = top => {
      scroller.scrollTo({ top, behavior: "instant" });
      scroller.dispatchEvent(new Event("scroll"));
    };
    const visit = chapter => move(position() + document.getElementById(chapter).getBoundingClientRect().top
      - (mobile ? reader.getBoundingClientRect().top : 0));
    const speaking = chapter => dock.dataset.scene === chapter && dock.hasAttribute("data-speaking");
    const opacity = () => Number(getComputedStyle(note).opacity);

    visit("experience");
    await until("Experience bubble never appeared", () => speaking("experience")
      && (reduced || dock.hasAttribute("data-typing")));
    const prefix = text.textContent;
    const full = measure.textContent;
    const hintY = hint.getBoundingClientRect().top;
    let pops = 0;
    const onPop = event => { if (event.animationName === "cindy-note-in") pops++; };
    note.addEventListener("animationstart", onPop);
    // A single wheel-notch-sized step pauses typing but never dims the bubble.
    move(position() + 48);
    const single = { dimmed: false, minOpacity: 1, text: text.textContent };
    for (let index = 0; index < 8; index++) {
      await frame();
      single.dimmed ||= dock.hasAttribute("data-scroll-dim");
      single.minOpacity = Math.min(single.minOpacity, opacity());
    }
    await until("Typing never resumed after a single step", () => text.textContent.length > single.text.length || reduced
      || text.textContent === full);
    // Two or more steps inside the burst window count as fast scrolling and dim it.
    const burstPrefix = text.textContent;
    move(position() + 80);
    await frame();
    move(position() + 80);
    await frame();
    move(position() + 80);
    await until("The same-section bubble never dimmed", () => speaking("experience")
      && dock.hasAttribute("data-scroll-dim") && Math.abs(opacity() - .4) < .03);
    const dim = { text: text.textContent, burstPrefix, hintY: hint.getBoundingClientRect().top,
      ariaHidden: note.getAttribute("aria-hidden") };
    await until("The bubble never returned to full opacity", () => opacity() === 1);
    await until("Typing never resumed", () => text.textContent.length > prefix.length || reduced);
    const resumed = text.textContent;
    await until("The line never completed", () => text.textContent === full);
    note.removeEventListener("animationstart", onPop);

    visit("projects");
    await until("Cindy never switched stations", () => dock.dataset.scene === "projects");
    const jumped = { speaking: dock.hasAttribute("data-speaking"), leaving: dock.hasAttribute("data-note-leaving"),
      opacity: opacity(), text: text.textContent, ariaHidden: note.getAttribute("aria-hidden") };
    // Skip again while the first fade may still run: the same bubble keeps fading, nothing stacks.
    visit("global");
    await frame();
    const stacked = { speaking: dock.hasAttribute("data-speaking"), text: text.textContent };
    if (dock.hasAttribute("data-note-leaving")) {
      await until("The fade never finished", () => !dock.hasAttribute("data-note-leaving"));
    }
    const faded = opacity();
    await until("The final chapter never got a note", () => speaking("global"));
    const opened = { text: text.textContent, pending: dock.hasAttribute("data-note-pending") };
    await until("The final chapter never started typing", () => text.textContent.length > 0);
    const landed = text.textContent;
    visit("experience");
    await until("The revisited chapter never got a note", () => speaking("experience"));
    const revisit = text.textContent;
    const phone = document.querySelector(".project-phone");
    const screen = phone.querySelector(".phone-shell__screen");
    const project = phone.closest(".story-project");
    const next = project.querySelector(".story-project__controls button:last-child");
    const counter = project.querySelector(".story-project__controls [role=status]");
    const geometry = () => [phone, screen, screen.querySelector("img")].map(element => element.getBoundingClientRect().toJSON());
    const before = geometry();
    const index = counter.textContent;
    const color = getComputedStyle(next).backgroundColor;
    next.click();
    await until("The preview did not register the press", () => next.classList.contains("is-pressed")
      && getComputedStyle(next).backgroundColor !== color);
    const press = { before, after: geometry(), changed: counter.textContent !== index, transform: getComputedStyle(next).transform };
    await until("The press feedback did not clear", () => !next.classList.contains("is-pressed"));
    visit("hero");
    await until("Cindy never returned to the start", () => speaking("hero") && opacity() === 1);
    return { prefix, full, hintY, single, dim, resumed, pops, jumped, stacked, faded, opened, landed, revisit, press };
  }, { mobile, reduced });

  assert.equal(result.single.dimmed, false, "A single wheel-notch step never dims the bubble");
  assert.equal(result.single.minOpacity, 1, "A single step keeps the bubble at full opacity");
  assert.equal(result.single.text, result.prefix, "A single step preserves the visible prefix");
  assert.equal(result.dim.text, result.dim.burstPrefix, "Same-section scrolling preserves the visible prefix");
  assert.equal(result.dim.ariaHidden, "false");
  assert.ok(Math.abs(result.dim.hintY - result.hintY) < .5, "The hint stays in place as the bubble dims");
  assert.equal(result.pops, 0, "Dimming and recovering opacity never replay the pop");
  if (!reduced) assert.ok(result.resumed.startsWith(result.prefix) && result.resumed.length > result.prefix.length);
  assert.deepEqual({ speaking: result.jumped.speaking, text: result.jumped.text, ariaHidden: result.jumped.ariaHidden },
    { speaking: false, text: result.full, ariaHidden: "true" },
    "The first frame in the new station never speaks; the old text is leaving and hidden from assistive tech");
  // The single column always fades the old line; desktop may clear it at once when its lane would sit on new copy.
  if (mobile && !reduced) assert.ok(result.jumped.leaving, "A chapter jump fades the old line instead of dropping it");
  if (reduced) assert.equal(result.jumped.opacity, 0, "Reduced motion hides the old line at once");
  assert.deepEqual(result.stacked, { speaking: false, text: result.full }, "A second skip mid-fade never stacks a bubble");
  assert.equal(result.faded, 0, "The fade ends fully hidden before the next note");
  assert.ok(result.landed && !result.full.startsWith(result.landed), "The skip lands on the final chapter's line");
  if (!reduced) assert.deepEqual(result.opened, { text: "", pending: true }, "A new bubble opens empty with the typing cue");
  assert.equal(result.revisit, result.full, "A spoken chapter immediately revisits with the full line");
  assert.ok(result.press.changed, "The preview advances on press");
  assert.deepEqual(result.press.after, result.press.before, "Press feedback leaves the device and screenshot geometry in place");
  assert.equal(result.press.transform === "none", reduced, "Press feedback moves only with motion enabled");
}

async function checkWheelEntrance(page, client, width, height) {
  const arriving = chapter => {
    const dock = document.querySelector(".cindy-dock");
    return dock.dataset.scene === chapter && dock.hasAttribute("data-speaking");
  };
  const wheelDelta = 100;
  // Well under the 200ms entrance idle window, and longer than the 100ms burst window, so each
  // notch is a single slow step: no dimming, but no bubble either until the wheel stops.
  const wheelInterval = 110;
  await page.evaluate(() => window.scrollTo({
    top: window.scrollY + document.getElementById("about").getBoundingClientRect().top, behavior: "instant",
  }));
  await page.waitForFunction(arriving, {}, "about");
  const { steps, end } = await page.evaluate(wheelDelta => {
    const dock = document.querySelector(".cindy-dock");
    const parked = new Set();
    const entrances = new Map();
    const events = new AbortController();
    let lastScroll = -Infinity;
    window.addEventListener("scroll", () => { lastScroll = performance.now(); }, { passive: true, signal: events.signal });
    const observer = new MutationObserver(() => {
      const chapter = dock.dataset.scene;
      if (dock.hasAttribute("data-parked")) parked.add(chapter);
      if (chapter !== "about" && dock.hasAttribute("data-speaking") && !entrances.has(chapter)) {
        entrances.set(chapter, performance.now() - lastScroll);
      }
    });
    observer.observe(dock, { attributes: true, attributeFilter: ["data-scene", "data-parked", "data-speaking"] });
    window.finishCindyWheelEntrance = () => {
      observer.disconnect();
      events.abort();
      delete window.finishCindyWheelEntrance;
      return { parked: [...parked], entrances: [...entrances] };
    };
    const steps = Math.ceil(document.getElementById("global").getBoundingClientRect().top / wheelDelta);
    return { steps, end: window.scrollY + steps * wheelDelta };
  }, wheelDelta);
  const started = performance.now();
  for (let index = 0; index < steps; index++) {
    const jitter = WHEEL_JITTER ? Math.round((Math.random() * 2 - 1) * WHEEL_JITTER) : 0;
    if (index > 0) await delay(Math.max(0, started + index * wheelInterval + jitter - performance.now()));
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseWheel", x: width * .65, y: height / 2, deltaX: 0, deltaY: wheelDelta,
    });
  }
  await page.waitForFunction(end => window.scrollY >= end - 1, {}, end);
  await page.waitForFunction(arriving, {}, "global");
  const { parked, entrances } = await page.evaluate(() => window.finishCindyWheelEntrance());
  for (const chapter of ["experience", "projects", "global"]) {
    assert.ok(parked.includes(chapter), `The wheel crossed a parked ${chapter} station`);
  }
  assert.deepEqual(entrances.map(([chapter]) => chapter), ["global"],
    "100px wheel steps every 110ms never open a bubble at an intermediate station");
  assert.ok(entrances[0][1] >= 198, `The final station waited for 200ms of scroll idle (${entrances[0][1]}ms)`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(arriving, {}, "hero");
}

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
    await checkDialogue(page, mobile, reduced);
    const client = await page.createCDPSession();
    if (!mobile) {
      if (CPU_THROTTLE > 1) await client.send("Emulation.setCPUThrottlingRate", { rate: CPU_THROTTLE });
      await checkWheelEntrance(page, client, width, height);
      if (CPU_THROTTLE > 1) await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      console.log(`${width}×${height}: wheel entrance ok (cpu ×${CPU_THROTTLE || 1}, jitter ±${WHEEL_JITTER}ms)`);
    }
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
      const sectionParked = {};
      const sections = new Map([...content.querySelectorAll("main > section")].map(section => [section.id, section]));
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
        if (Number(getComputedStyle(note).opacity) > .01) {
          const box = note.getBoundingClientRect();
          // The bubble's tail must point at Cindy, on whichever side of the page she stands.
          const tip = box.left + note.clientLeft + Number.parseFloat(getComputedStyle(dock).getPropertyValue("--cindy-note-tip"));
          if (!mobile && dock.hasAttribute("data-speaking") && Number(getComputedStyle(note).opacity) === 1
            && Math.abs(tip - hit.left - hit.width / 2) > 1.5) fail(`bubble tail ${tip.toFixed(1)} is not under Cindy`);
          parts.push(["bubble", box], ["bubble tip", mobile
            ? { left: box.left - 7, right: box.left, top: box.top, bottom: box.bottom }
            : { left: tip - 6, right: tip + 6, top: box.top - 7, bottom: box.top }]);
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
        const isParked = dock.hasAttribute("data-parked");
        const section = sections.get(scene).getBoundingClientRect();
        const readingTop = mobile ? clip.top : document.querySelector(".story-nav").getBoundingClientRect().bottom;
        const readingLine = readingTop + (clip.bottom - readingTop) * .46;
        // The desktop route also assigns the empty crossing gutters to its neighboring scenes.
        if (section.top <= readingLine && readingLine < section.bottom) {
          chapterSamples[scene] = (chapterSamples[scene] ?? 0) + 1;
          if (isParked) sectionParked[scene] = (sectionParked[scene] ?? 0) + 1;
        }
        if (isParked) {
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
        return { samples, issues, parked, chapterSamples, sectionParked, sides: Object.fromEntries(Object.entries(sides).map(([key, set]) => [key, [...set]])) };
      };
      window.sampleCindyAtRest = () => sample(true);
      return scroller.scrollHeight - scroller.clientHeight;
    }, mobile);
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
    const { samples, issues, parked, chapterSamples, sectionParked, sides } = await page.evaluate(() => window.finishCindyScroll());
    assert.equal(samples[0].scroll, 0);
    assert.ok(samples.at(-1).scroll >= maxScroll - 1);
    assert.ok(samples.length >= Math.ceil(maxScroll / DELTA) * .75, "Wheel samples cover the page at the requested cadence");
    assert.equal(issues.length, 0, issues.slice(0, 12).join("\n"));
    assert.deepEqual(Object.keys(parked), CHAPTERS);
    for (const chapter of CHAPTERS) {
      assert.ok(sectionParked[chapter] / chapterSamples[chapter] > .5,
        `Cindy spends most of ${chapter} parked (${sectionParked[chapter]}/${chapterSamples[chapter]} frames within the section)`);
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
