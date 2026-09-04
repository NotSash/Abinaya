/**
 * EGGINAYA CONTENT
 * ----------------
 * Everything personal lives here. Replace anything in square brackets,
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
    line: "I built you a whole room, because a card felt too small.",
    sub: "It's yours. Come in. Mind the egg.",
    button: "come in",
  },
  world: {
    corner: "somewhere in the blue",
    hint: "Look around. A few things in here have been waiting for you.",
    hintTouch: "Drag to look around. A few things in here have been waiting for you.",
  },
  back: "back to the room",
  scrollCue: "scroll",
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
  /** smaller marker for easter eggs (still bright) */
  quiet?: boolean;
  /** how far the camera pushes in when opened */
  zoom: number;
}

export const hotspots: Hotspot[] = [
  { id: "system", x: 24, y: 63, label: "the laptop", whisper: "it's been running on you for years", marked: true, zoom: 2.4 },
  { id: "archive", x: 19, y: 31, label: "the pinboard", whisper: "evidence that you're unfairly photogenic", marked: true, zoom: 2.2 },
  { id: "window", x: 60, y: 38, label: "the window", whisper: "the night my luck changed", marked: true, zoom: 1.9 },
  { id: "envelope", x: 33, y: 73, label: "a blue envelope", whisper: "not yet", marked: true, zoom: 2.8 },
  { id: "egg", x: 86, y: 40, label: "an egg", whisper: "poke it", marked: true, quiet: true, zoom: 1 },
  { id: "lunch", x: 91, y: 47, label: "a lunch box", whisper: "still warm, somehow", marked: true, quiet: true, zoom: 2.6 },
];

export const envelopeWhisper = {
  locked: "not yet. I'm saving the best for last",
  open: "open me. finally.",
};

/** The envelope opens once these have been seen. */
export const envelopeRequires: HotspotId[] = ["system", "archive", "window"];

/* ---------- The egg ---------- */
/** One line per poke. After the last one it loops the tail. */
export const eggLines = [
  "An egg.",
  "Still an egg.",
  "Okay. You know exactly why it's here.",
  "Egginaya.",
  "Stop poking me, I bruise easily.",
  "You're cute when you're persistent.",
  "I said Egginaya. That's you. Hi.",
  "Fine. I love you. Now go find the envelope.",
];
/** where the loop restarts after the last line */
export const eggLoopFrom = 4;

/* ---------- The System ---------- */
export const system = {
  name: "EGGINAYA SYSTEM",
  build: "build 4.0 (almost)",
  status: "running, obviously",
  nav: {
    profile: { dir: "", file: "profile.egg" },
    suthiyama: { dir: "incidents/", file: "suthiyama.log" },
    marriage: { dir: "records/", file: "marriage.cert" },
    media: { dir: "media/", file: "8 files" },
    locked: { dir: "", file: "blue_envelope.enc" },
  },
  profile: {
    rows: [
      ["subject", "Abinaya"],
      ["alias", "Egginaya"],
      ["alias origin", "face shape. said with love. I'd like to survive this birthday."],
      ["first seen", "same school, different section. a tragedy. since corrected."],
      ["known location", "lunch break, in class. also permanently in my head."],
      ["favourite colour", "blue. look around. I was paying attention."],
      ["prefers", "accessories over dresses. and me over everyone (unverified, but I'm confident)."],
      ["current status", "mine. very."],
    ],
    diagnostics: [
      { key: "Kindness", value: "100%", ratio: 1, note: "verified daily. no exceptions found." },
      { key: "Empathy", value: "100%", ratio: 1, note: "feels things for people who don't deserve it. including me, some days." },
      { key: "Intelligence", value: "99.99%", ratio: 0.9999, note: "the missing 0.01% is documented. see incidents." },
      { key: "Patience", value: "0%", ratio: 0, note: "measured repeatedly. result stable. I find it adorable. I'm also scared." },
      { key: "Cuteness", value: "∞", ratio: 1, note: "value exceeds display width. and my chest, some evenings." },
    ],
    footer: "system has never once considered a different subject. no plans to.",
  },
  suthiyama: {
    id: "SUTH-001",
    type: "pronunciation",
    severity: "minor. consequences: permanent. still laughing.",
    status: "unresolved. recurs without warning. no one wants it fixed.",
    summary: ["Intended word: sathiyama.", "Word produced: suthiyama.", "Word was heard. Word was never forgotten."],
    notes: [
      "Has since become a permanent part of our vocabulary.",
      "Original meaning unaffected. My affection for the speaker: increased.",
      "Recommended fix: none. Please keep doing it.",
    ],
    evidenceCaption: "[the screenshot goes here]",
  },
  marriage: {
    title: "OUR SECRET MARRIAGE",
    between: ["Abinaya (Egginaya)", "[YOUR NAME]"],
    fields: [
      ["date", "not disclosed. (I remember it anyway.)"],
      ["venue", "not disclosed. it was perfect."],
      ["witnesses", "none. that is what secret means."],
      ["legal standing", "none whatsoever"],
      ["validity", "ongoing. renewed every morning."],
    ],
    terms: "[INSERT THE ACTUAL STORY OR YOUR OWN TERMS HERE]",
    footnote: "This document is a joke. It is also, in every way that matters to the two people named on it, not.",
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
  mediaHeading: "things she'd get",
  mediaFooter: "no previews available. you know them anyway. that's the point.",
  lockedFile: {
    name: "blue_envelope.enc",
    line: "This one doesn't open here. It's on the desk. Go on, I'll wait.",
    button: "take me there",
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
  /** shown only when the print is picked up */
  more?: string;
  /** resting rotation on the desk, degrees */
  tilt: number;
  /** resting position in percent of the desk */
  x: number;
  y: number;
  w: number; // width in px at desktop scale
}

export const prints: Print[] = [
  {
    id: "note",
    kind: "note",
    caption: "Pinned here so I never lose them.",
    detail: "(I wouldn't have anyway.)",
    more: "Every one of these is a day I got to look at you. Frankly, I'm spoiled.",
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

export const archive = {
  hint: "pick one up",
  putBack: "put it back",
};

/* ---------- The lunch box (school) ---------- */
export const lunchBox = {
  kicker: "found at the back of the shelf",
  heading: "Lunch breaks.",
  lines: [
    "Same school. Different sections. Some genius put a corridor between us.",
    "Then you'd walk into class at lunch, and suddenly I wasn't hungry for anything else.",
    "I'd like to say I played it cool. Everyone who was there knows I did not.",
  ],
  placeholder: "[What you remember about those lunch breaks. Short is fine.]",
  sign: "still the best part of the day. still you.",
};

/* ---------- The window (September 25) ---------- */
export const september = {
  lead: "The day you said yes and quietly ruined every other day for me. Nothing compares now.",
  after: `${facts.yearsTogether[0].toUpperCase()}${facts.yearsTogether.slice(1)}. Feels like four minutes. Also four lifetimes.`,
  placeholder: "[A line about that day, if you want one.]",
  small: "same sky as that night. I checked.",
};

/* ---------- About Abinaya (calm section) ---------- */
export const about = {
  kicker: "for Abinaya",
  intro: "Some things I notice.",
  introSub: "I notice everything about you. This is the short list.",
  items: [
    {
      title: "Your eyes.",
      body: "I've lost arguments to them. I've lost whole afternoons in them. I'd lose again, gladly, any day you like.",
    },
    {
      title: "Your character.",
      body: "You are the most genuinely good person I have ever met, and you have no idea, which is exactly how I know it's real.",
    },
    {
      title: "Kind. Empathetic. Down to earth. Completely yourself.",
      body: "I tried to make these sound more impressive. They don't need it. You don't need it.",
    },
    {
      title: "Intelligent.",
      body: "99.99%. The system was strict about the rounding. I, personally, round up.",
    },
    {
      title: "The way you naturally are.",
      body: "Not trying, not performing, just you: laughing at your own joke before you finish it. That one. I'd choose that one every single time.",
    },
  ],
  continue: "one more thing",
};

/* ---------- The final message ---------- */
export const finalMessage = {
  greeting: "Happy birthday, Egginaya.",
  paragraphs: [
    "I made this whole room, and honestly I could have skipped all of it, because the only thing I actually wanted to say fits in one line: I am so glad it's you.",
    "Every version of my life I can imagine has you in it. Some of them have you across a classroom during lunch break. The good ones have you next to me, stealing the left cushion.",
    "You make ordinary days feel like something I'd want to keep. That's rare. You're rare. I'm not letting go.",
  ],
  placeholder: "[Anything else you want to say to her, in your own words. Line breaks are kept.]",
  closing: "Almost four years in, and I'd still pick you on the first day.",
  signoff: "yours, obviously,",
  name: "[YOUR NAME]",
  songLine: "one more thing, if you want it",
  songMissing: "the song will be here soon",
  end: "that's the room. you can wander back whenever you like.",
};
