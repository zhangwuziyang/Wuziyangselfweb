import { COMPANY_FRAMES, HEALTH_FRAMES, OFFER_FRAMES } from "./story-media";

export const CHAPTERS = ["hero", "about", "experience", "projects", "global", "music", "skills", "philosophy", "contact"] as const;
export type Chapter = (typeof CHAPTERS)[number];

export type Pose = readonly [x: number, y: number, scale: number, pitch: number, yaw: number, roll: number];
type PoseCue = { at: number; pose: Pose };
export type FrameCue = { id: string; at: number };

export function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

export function smooth(from: number, to: number, value: number) {
  const t = clamp((value - from) / Math.max(0.001, to - from));
  return t * t * (3 - 2 * t);
}

export function samplePose(cues: readonly PoseCue[], scroll: number): Pose {
  const index = Math.max(0, cues.findLastIndex(({ at }) => scroll >= at));
  const from = cues[index];
  const to = cues[index + 1] ?? from;
  const phase = smooth(from.at, to.at, scroll);
  return [
    mix(from.pose[0], to.pose[0], phase),
    mix(from.pose[1], to.pose[1], phase),
    mix(from.pose[2], to.pose[2], phase),
    mix(from.pose[3], to.pose[3], phase),
    mix(from.pose[4], to.pose[4], phase),
    mix(from.pose[5], to.pose[5], phase),
  ];
}

export function frameWeights(cues: readonly FrameCue[], scroll: number, viewportHeight: number) {
  return cues.map((frame, index) => {
    const next = cues[index + 1];
    const previous = cues[index - 1];
    const windowFor = (left: FrameCue, right: FrameCue) =>
      Math.min(viewportHeight * .12, (right.at - left.at) * .30);
    const incoming = previous ? windowFor(previous, frame) : 0;
    const outgoing = next ? windowFor(frame, next) : 0;
    // Sequential out-then-in so outgoing reaches opacity 0 before incoming appears (no text/image ghosting).
    const enter = previous ? smooth(frame.at - incoming * .5, frame.at, scroll) : 1;
    const exit = next ? smooth(next.at - outgoing, next.at - outgoing * .5, scroll) : 0;
    return { id: frame.id, opacity: enter * (1 - exit), offset: (1 - enter - exit) * 18 };
  });
}

export function buildStageTimeline(
  starts: Record<Chapter, number>,
  runway: { top: number; bottom: number },
  height: number,
  maxScroll: number,
  desktop: boolean,
) {
  const fold = height * .55;
  const landing = Math.min(height * .78, starts.about - height * .2);
  const playbackStart = runway.top - height * .10;
  const playbackEnd = runway.bottom - height * .71;
  const gallery = runway.bottom - height * .37;
  const showProjects = smooth.bind(null, runway.top - fold, playbackStart);
  const phoneArrival = desktop ? playbackStart : mix(playbackStart, playbackEnd, .53);
  const webEnd = desktop ? playbackEnd : mix(playbackStart, playbackEnd, .48);
  const projectSpan = playbackEnd - playbackStart;
  const projectPlayback = (start: number, end: number, media: readonly string[], prefix: string) =>
    media.map((_, i) => ({ id: `${prefix}-${i}`, at: mix(start, end, i / media.length) }));

  const laptopFrames = [
    { id: "intro", at: 0 },
    { id: "campus", at: starts.about },
    { id: "ranking", at: mix(starts.about, starts.experience, .56) },
    ...COMPANY_FRAMES.map(({ id }, i) => ({ id, at: mix(starts.experience, runway.top - height * .33, i / COMPANY_FRAMES.length) })),
    ...projectPlayback(playbackStart, webEnd, OFFER_FRAMES, "offer"),
    { id: "travel", at: starts.global },
    { id: "music", at: starts.music },
    { id: "skills", at: starts.skills },
    { id: "philosophy", at: starts.philosophy },
  ];
  const phoneFrames = projectPlayback(phoneArrival, playbackEnd, HEALTH_FRAMES, "health");
  const laptopLanding: Pose = desktop ? [.255, .025, .96, 0, 0, 0] : [0, .205, 1, 0, 0, 0];
  // Hold the laptop inside its side safe zone while each chapter is read; transition only near the next chapter boundary.
  const holdUntil = (from: number, to: number) =>
    Math.max(from + 1, to - Math.min(height * .26, Math.max(0, to - from) * .20));

  const aboutPose: Pose = [-.262, .004, .90, 4, 15, -2];
  const experiencePose: Pose = [.262, .02, .88, 7, -14, 2];
  const globalPose: Pose = [-.262, -.02, .86, 6, 16, -3];
  const globalMidPose: Pose = [-.270, -.05, .68, 9, 18, -4];
  const musicPose: Pose = [.262, .005, .92, 0, -10, 2];
  const skillsPose: Pose = [-.262, .006, .89, 8, 17, -2];
  const philosophyPose: Pose = [.262, .013, .90, 3, -12, 1];
  const contactPose: Pose = [-.262, .014, .87, 8, 14, -2];

  const desktopPoses: PoseCue[] = [
    { at: 0, pose: [.285, .042, .68, 17, -30, -8] },
    { at: landing, pose: laptopLanding },
    { at: starts.about, pose: aboutPose },
    { at: holdUntil(starts.about, starts.experience), pose: aboutPose },
    { at: starts.experience, pose: experiencePose },
    { at: holdUntil(starts.experience, runway.top - fold), pose: experiencePose },
    { at: runway.top - fold, pose: [.245, .043, .88, 4, -9, 1] },
    { at: playbackStart, pose: [-.123, .105, 1.07, 0, 7, -3] },
    { at: playbackStart + projectSpan * .32, pose: [-.139, .086, 1.13, 2, 0, 0] },
    { at: playbackStart + projectSpan * .68, pose: [-.131, .101, 1.10, 5, -6, 1] },
    { at: playbackEnd, pose: [-.125, .11, 1.045, 4, 4, -2] },
    { at: gallery, pose: [.262, .02, .82, 6, -15, 4] },
    { at: starts.global, pose: globalPose },
    { at: mix(starts.global, starts.music, .62), pose: globalMidPose },
    { at: holdUntil(mix(starts.global, starts.music, .62), starts.music), pose: globalMidPose },
    { at: starts.music, pose: musicPose },
    { at: holdUntil(starts.music, starts.skills), pose: musicPose },
    { at: starts.skills, pose: skillsPose },
    { at: holdUntil(starts.skills, starts.philosophy), pose: skillsPose },
    { at: starts.philosophy, pose: philosophyPose },
    { at: holdUntil(starts.philosophy, starts.contact), pose: philosophyPose },
    { at: starts.contact, pose: contactPose },
    { at: maxScroll, pose: [-.255, .14, .65, 6, 3, 0] },
  ];
  const mobilePoses: PoseCue[] = [
    { at: 0, pose: [0, .213, .76, 14, -16, -4] },
    { at: landing, pose: laptopLanding },
    { at: starts.about, pose: [0, -.21, .81, 3, 5, -2] },
    { at: starts.experience, pose: [0, -.22, .79, 4, -8, 2] },
    { at: runway.top - fold, pose: [0, -.08, .80, 4, -6, 0] },
    { at: playbackStart, pose: [0, .092, 1.055, 3, 0, 0] },
    { at: webEnd, pose: [0, .13, .93, 6, -7, -2] },
    { at: gallery, pose: [0, -.21, .75, 4, 5, 0] },
    { at: starts.global, pose: [0, -.19, .76, 8, 10, -2] },
    { at: starts.music, pose: [0, -.21, .79, 4, -6, 1] },
    { at: starts.contact, pose: [0, -.17, .77, 7, 7, 0] },
    { at: maxScroll, pose: [0, -.11, .62, 6, 2, 0] },
  ];
  const phonePoses: PoseCue[] = desktop ? [
    { at: playbackStart - height * .5, pose: [.51, .19, .81, 11, -25, 12] },
    { at: playbackStart + height * .2, pose: [.29, .108, .97, 3, -5, 5] },
    { at: playbackStart + projectSpan * .48, pose: [.276, .081, 1.04, -4, -8, 0] },
    { at: playbackEnd, pose: [.290, .109, .97, 4, 7, -6] },
    { at: gallery, pose: [.53, .28, .72, 11, 20, 11] },
  ] : [
    { at: webEnd, pose: [0, .23, .80, 8, -8, 5] },
    { at: phoneArrival + height * .2, pose: [0, .092, .98, 1, 0, 0] },
    { at: playbackEnd, pose: [0, .106, 1.03, 3, 6, -2] },
    { at: gallery, pose: [0, .28, .74, 11, 10, 5] },
  ];

  return {
    landing, laptopLanding, playbackStart, webEnd, playbackEnd, gallery, phoneArrival, showProjects,
    laptopFrames, phoneFrames,
    laptopPoses: desktop ? desktopPoses : mobilePoses,
    phonePoses,
  };
}
