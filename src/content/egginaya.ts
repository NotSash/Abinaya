/**
 * EGGINAYA CONTENT
 * ----------------
 * Everything personal lives here. Replace placeholders in square brackets,
 * drop real photo/audio files into src/assets and import them below.
 * Nothing in this file is styled; components only read from it.
 */

/* ---------- Media (add real files later) ---------- */
// Example: import photo01 from "../assets/photos/01.jpg";
export const media = {
  // The song near the end. Put the file at src/assets/audio/until-i-found-you.mp3
  // and import it here. Leaving it undefined shows a quiet "not added yet" state.
  song: undefined as string | undefined,
  songTitle: "Until I Found You",

  // The suthiyama screenshot. Leaving undefined shows a designed placeholder.
  suthiyamaScreenshot: undefined as string | undefined,
};

/* ---------- Facts ---------- */
export const facts = {
  name: "Abinaya",
  nickname: "Egginaya",
  yearsTogether: "almost four years",
  togetherDate: { day: "25", month: "September", year: "[YEAR]" },
  school: "Same school. Different sections.",
  lunch: "Lunch breaks, in class.",
};

/* ---------- Copy ---------- */
export const copy = {
  arrival: {
    line: "This place was kept for one person.",
    sub: "If that's you, come in.",
    button: "come in",
  },
  world: {
    corner: "somewhere in the blue",
    hint: "Look around. A few things open.",
    hintTouch: "Look around. Drag to turn. A few things open.",
  },
  back: "back to the room",
};

/* ---------- Hotspots ---------- */
/**
 * Positions are percentages of the room image (x from left, y from top).
 * Adjust these if you want a mark to sit more exactly on an object.
 */
export type HotspotId = "system" | "archive" | "window" | "envelope" | "egg" | "lunch";

export interface Hotspot {
  id: HotspotId;
  x: number;
  y: number;
  label: string;
  /** what the visitor is told on hover/focus before opening */
  whisper?: string;
  /** shows a marker */
  marked: boolean;
  /** subtle, low-visibility marker for easter eggs */
  quiet?: boolean;
  /** how far the camera pushes in when opened */
  zoom: number;
}

export const hotspots: Hotspot[] = [
  { id: "system", x: 24, y: 63, label: "the laptop", whisper: "something is running", marked: true, zoom: 2.4 },
  { id: "archive", x: 19, y: 31, label: "the pinboard", whisper: "prints", marked: true, zoom: 2.2 },
  { id: "window", x: 60, y: 38, label: "the window", whisper: "one night in particular", marked: true, zoom: 1.9 },
  { id: "envelope", x: 33, y: 73, label: "a blue envelope", whisper: "not yet", marked: true, zoom: 2.8 },
  { id: "egg", x: 86, y: 40, label: "an egg", marked: true, quiet: true, zoom: 1 },
  { id: "lunch", x: 91, y: 47, label: "a lunch box", whisper: "old", marked: true, quiet: true, zoom: 2.6 },
];

/** The envelope opens once these have been seen. */
export const envelopeRequires: HotspotId[] = ["system", "archive", "window"];

/* ---------- The egg ---------- */
export const eggLines = ["An egg.", "Still an egg.", "Okay. You know why it's here.", "Egginaya."];

/* ---------- The System ---------- */
export const system = {
  name: "EGGINAYA SYSTEM",
  build: "build 4.0 (almost)",
  profile: {
    rows: [
      ["subject", "Abinaya"],
      ["alias", "Egginaya"],
      ["alias origin", "face shape. we don't need to go into it."],
      ["first seen", "same school, different section"],
      ["known location", "lunch break, in class"],
      ["favourite colour", "blue. look around."],
      ["prefers", "accessories over dresses"],
    ],
    diagnostics: [
      { key: "Kindness", value: "100%", ratio: 1, note: "" },
      { key: "Empathy", value: "100%", ratio: 1, note: "" },
      { key: "Intelligence", value: "99.99%", ratio: 0.9999, note: "the missing 0.01% is documented. see incidents." },
      { key: "Patience", value: "0%", ratio: 0, note: "measured repeatedly. result stable." },
      { key: "Cuteness", value: "∞", ratio: 1, note: "value exceeds display width." },
    ],
  },
  suthiyama: {
    id: "SUTH-001",
    type: "pronunciation",
    severity: "minor. consequences: permanent.",
    status: "unresolved. recurs without warning.",
    summary: ["Intended word: sathiyama.", "Word produced: suthiyama.", "Word was heard."],
    notes: ["Has since become a permanent part of the vocabulary.", "Original meaning unaffected."],
    evidenceCaption: "[the screenshot goes here]",
  },
  marriage: {
    title: "OUR SECRET MARRIAGE",
    between: ["Abinaya (Egginaya)", "[YOUR NAME]"],
    fields: [
      ["date", "not disclosed"],
      ["venue", "not disclosed"],
      ["witnesses", "none. that is what secret means."],
      ["legal standing", "none whatsoever"],
      ["validity", "ongoing"],
    ],
    terms: "[INSERT THE ACTUAL STORY OR YOUR OWN TERMS HERE]",
    footnote: "This document is a joke. It is also, in every way that matters to the two people named, not.",
  },
  // Easter eggs as filenames. Not clickable. Rewards people who read.
  mediaFiles: [
    { name: "eggos.txt", meta: "11 items", note: "she'd understand" },
    { name: "hawkins_1983.map", meta: "upside down: no" },
    { name: "bazinga.wav", meta: "0:03" },
    { name: "soft_kitty.mid", meta: "for when sick" },
    { name: "the_spot.cfg", meta: "left cushion. do not move." },
    { name: "shinchan.gif", meta: "looping" },
    { name: "blue.pal", meta: "1 colour, 400 shades" },
    { name: "accessories.list", meta: "longer than dresses.list" },
  ],
  lockedFile: {
    name: "blue_envelope.enc",
    line: "This one doesn't open here. It's on the desk.",
  },
};

/* ---------- The Archive (memories) ---------- */
export interface Print {
  id: string;
  kind: "photo" | "note";
  /** import a real image and set it here */
  src?: string;
  alt?: string;
  caption: string;
  /** optional second line under the caption */
  detail?: string;
  /** resting rotation on the desk, degrees */
  tilt: number;
  /** resting position in percent of the desk */
  x: number;
  y: number;
  w: number; // width in px at desktop scale
}

export const prints: Print[] = [
  {
    id: "lunch",
    kind: "note",
    caption: facts.school,
    detail: facts.lunch,
    tilt: -4,
    x: 18,
    y: 30,
    w: 250,
  },
  { id: "p1", kind: "photo", caption: "[caption]", detail: "[where / when, if you want]", tilt: 3, x: 44, y: 22, w: 230 },
  { id: "p2", kind: "photo", caption: "[caption]", tilt: -2, x: 68, y: 30, w: 220 },
  { id: "p3", kind: "photo", caption: "[caption]", tilt: 5, x: 30, y: 66, w: 220 },
  { id: "p4", kind: "photo", caption: "[caption]", tilt: -6, x: 56, y: 68, w: 240 },
  { id: "p5", kind: "photo", caption: "[caption]", tilt: 2, x: 80, y: 70, w: 210 },
];

/* ---------- The lunch box (school) ---------- */
export const lunchBox = {
  heading: "Lunch breaks.",
  lines: [facts.school, facts.lunch],
  placeholder: "[What you remember about those lunch breaks. Short is fine.]",
};

/* ---------- The window (September 25) ---------- */
export const september = {
  lead: "The date we got together.",
  after: `${facts.yearsTogether[0].toUpperCase()}${facts.yearsTogether.slice(1)} now.`,
  placeholder: "[A line about that day, if you want one.]",
};

/* ---------- About Abinaya (calm section) ---------- */
export const about = {
  intro: "Some things I notice.",
  items: [
    {
      title: "Your eyes.",
      body: "[Write what you notice about her eyes.]",
    },
    {
      title: "Your character.",
      body: "[Write the thing about her character that you would only say to her.]",
    },
    {
      title: "Kind. Empathetic. Down to earth. Genuinely yourself.",
      body: "I tried to make these sound more impressive. They don't need it.",
    },
    {
      title: "Intelligent.",
      body: "99.99%. The system was strict about the rounding.",
    },
    {
      title: "The way you naturally are.",
      body: "[One more thing, in your own words.]",
    },
  ],
  continue: "one more thing",
};

/* ---------- The final message ---------- */
export const finalMessage = {
  placeholder: "[INSERT FINAL BIRTHDAY MESSAGE HERE]",
  sign: "Happy Birthday, Egginaya.",
  songLine: "This one is ours.",
};
