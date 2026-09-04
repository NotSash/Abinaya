/**
 * EGGINAYA CONTENT
 * ----------------
 * Everything personal lives here. Components only read from it.
 *
 * FILES YOU DROP IN (no code changes needed):
 *   src/assets/photos/01.jpg              "Our 1st pic together!!!" (both of you)
 *   src/assets/photos/02.jpg              "Pretty little babyyyyy"
 *   src/assets/photos/03.jpg              "Sleepyheaddddd -_-"
 *   src/assets/photos/04.jpg              "Shawwtyyyyy" (the text where she admits you're taller)
 *   src/assets/photos/05.jpg              "Baddyyyyyyy", the still frame of the Live Photo
 *   src/assets/photos/05.mp4              the moving part of the Live Photo
 *   src/assets/photos/maths-period.png    the "maths mam borrowed my maths period" screenshot
 *   src/assets/photos/marriage.png        the signed Instagram Marriage Association message
 *   src/assets/audio/until-i-found-you.mp3  optional. If present it is used instead of Spotify.
 *
 * Any image extension works (.jpg / .jpeg / .png / .webp). HEIC is NOT supported by browsers, export to jpg.
 * Photos can be ANY size or shape. The frames measure each picture when it loads and shape
 * themselves around it, so there is never any empty space beside a picture.
 */

/* ---------- Media (auto-discovered) ---------- */

const photoFiles = import.meta.glob("../assets/photos/*.{jpg,jpeg,png,webp,gif,mp4,mov,webm}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const audioFiles = import.meta.glob("../assets/audio/*.{mp3,m4a,ogg,wav}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/** find a dropped-in file by its base name, regardless of extension */
function photo(base: string, kind: "image" | "video" = "image"): string | undefined {
  const imageExt = /\.(jpg|jpeg|png|webp|gif)$/i;
  const videoExt = /\.(mp4|mov|webm)$/i;
  const hit = Object.keys(photoFiles).find((p) => {
    const file = p.split("/").pop() ?? "";
    const name = file.replace(/\.[^.]+$/, "");
    return name === base && (kind === "image" ? imageExt.test(file) : videoExt.test(file));
  });
  return hit ? photoFiles[hit] : undefined;
}

export const media = {
  /** local song file, if you ever add one. Otherwise the Spotify player is used. */
  song: Object.values(audioFiles)[0] as string | undefined,
  songTitle: "Until I Found You",
  songArtist: "Stephen Sanchez",
  /** Stephen Sanchez, Until I Found You (original) */
  spotifyTrackId: "0T5iIrXA4p5GsubkhuBIKV",
  /** the "maths period" screenshot */
  mathsScreenshot: photo("maths-period"),
  /** the signed Instagram Marriage Association message */
  marriageScreenshot: photo("marriage"),
};

/* ---------- Facts ---------- */

export const facts = {
  name: "Abinaya",
  nickname: "Egginaya",
  him: "Sashwath",
  yearsTogether: "almost four years",
  togetherDate: { day: "25", month: "September", year: "2022" },
  birthday: { day: "5", month: "September" },
  age: "21",
  school: "Same school. Different floors.",
  lunch: "Every break, in her class.",
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
 * Positions are percentages of the ROOM IMAGE itself (x from left, y from top),
 * not of the screen. The room is drawn to cover the viewport and the marks travel
 * with the picture, so a mark placed on the pinboard stays on the pinboard at any
 * window size.
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
  /** which side the label sits on */
  side?: "below" | "left" | "right";
}

export const hotspots: Hotspot[] = [
  { id: "system", x: 19.5, y: 69, label: "the laptop", whisper: "it's been running on you for years", marked: true, zoom: 2.4, side: "right" },
  { id: "archive", x: 12.5, y: 50, label: "the pinboard", whisper: "evidence that you're unfairly photogenic", marked: true, zoom: 2.2, side: "right" },
  { id: "window", x: 60, y: 38, label: "the window", whisper: "the night my luck changed", marked: true, zoom: 1.9, side: "below" },
  { id: "envelope", x: 17, y: 84.5, label: "a blue envelope", whisper: "not yet", marked: true, zoom: 2.8, side: "right" },
  { id: "egg", x: 85.5, y: 52.5, label: "an egg", whisper: "don't touch me. I'm an egg.", marked: true, quiet: true, zoom: 1, side: "left" },
  { id: "lunch", x: 91, y: 57, label: "a lunch box", whisper: "still warm, somehow", marked: true, quiet: true, zoom: 2.6, side: "left" },
];

export const envelopeWhisper = {
  locked: "not yet. I'm saving the best for last",
  open: "open me. finally.",
};

/** Everything that counts as "found" in the room (the envelope itself is the reward, not a find). */
export const discoverable: HotspotId[] = ["system", "archive", "window", "lunch", "egg"];

/** The envelope opens once ALL of these have been seen: the laptop, the pinboard, the window, the lunch box and the egg. */
export const envelopeRequires: HotspotId[] = [...discoverable];

/* ---------- The egg ---------- */

/** What the egg says before anyone has touched it. */
export const eggIdle = "don't touch me. I'm an egg.";

/** One line per poke. After the last one it loops the tail. */
export const eggLines = [
  "I said don't touch me.",
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
export const eggLoopFrom = 5;

/* ---------- The System ---------- */

export const system = {
  name: "EGGINAYA SYSTEM",
  build: "build 4.0 (almost)",
  status: "running, obviously",
  nav: {
    profile: { dir: "", file: "profile.egg" },
    incident: { dir: "incidents/", file: "maths_period.log" },
    marriage: { dir: "records/", file: "marriage.cert" },
    media: { dir: "media/", file: "9 files" },
    locked: { dir: "", file: "blue_envelope.enc" },
  },
  profile: {
    rows: [
      ["subject", "Abinaya"],
      ["alias", "Egginaya"],
      ["alias origin", "the softest, roundest, most kissable face I have ever seen. I named it after an egg. she let me live. that's love."],
      ["first seen", "same school. her a floor above me, always. I've been climbing stairs towards her ever since, and I'd do it forever."],
      ["known location", "her classroom, every single break. and in my head, every minute in between."],
      ["favourite colour", "blue. so I painted this whole room in it, and I'd paint the sky too if she asked."],
      ["prefers", "accessories over dresses. a little sparkle at her wrist, a chain at her neck. she never needed the dress; she's what makes everything else look good."],
      ["current status", "mine. entirely, happily, permanently mine."],
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
  incident: {
    id: "MATH-001",
    title: "the maths period.",
    type: "grammar. possibly a confession.",
    severity: "minor. consequences: permanent. still laughing.",
    status: "unresolved. screenshot preserved. no one wants it fixed.",
    summary: [
      'Intended message: "maths mam borrowed the extra period."',
      'Message sent: "maths mam borrowed my maths period."',
      "Message was read. Message was screenshotted. Message was never forgotten.",
    ],
    notes: [
      'Follow-up questions ("borrowed it from where?", "did she give it back?") were not appreciated.',
      "The 0.01% has been located. It lives here.",
      "Original meaning unaffected. My affection for the sender: increased, somehow.",
      "Recommended fix: none. Please keep texting me exactly like this.",
    ],
    evidenceCaption: "exhibit A. screenshot attached. no further comment, your honour.",
    evidenceMissing: "drop the screenshot at src/assets/photos/maths-period.png",
  },
  marriage: {
    title: "OUR SECRET MARRIAGE",
    between: ["Abinaya (Egginaya)", "Sashwath"],
    fields: [
      ["date", "not disclosed. (I remember it anyway.)"],
      ["venue", "wherever you were standing. it was perfect."],
      ["officiated by", "one gold chain. yours."],
      ["witnesses", "none. that is what secret means."],
      ["legal standing", "none whatsoever. approved by the Instagram Marriage Association, though."],
      ["validity", "ongoing. renewed every time the chain comes off and goes back on."],
    ],
    story: [
      "You have a gold chain you've worn for as long as I've known you. One day you took it off, held it out, and asked me to tie it back on for you.",
      "So I did. That was it. That was the whole ceremony. No hall, no crowd, no photographer. Just your neck, my clumsy hands, and a clasp that took me far too long.",
      "Since that day nobody else takes it off and nobody else ties it back. Only me. It's the one job I will never let anyone have.",
      "Then, because I'm a professional, I sent you an official Instagram Marriage Association agreement. You signed it. It's attached below. There is no getting out of it now.",
    ],
    terms: [
      "The chain shall be removed and retied by the husband only. No substitutes. Not even you.",
      "Both parties agree to fight, then agree to make up before the fight is over.",
      "The wife retains the left cushion. The husband retains the right to complain about it.",
      "This marriage renews automatically. There is no cancel button. I checked.",
    ],
    evidenceCaption: "signed, sealed, screenshotted.",
    evidenceMissing: "drop the signed message at src/assets/photos/marriage.png",
    footnote: "This document is a joke. It is also, in every way that matters to the two people named on it, not.",
  },
  /**
   * The media folder. Each "file" is one thing that is completely, unmistakably her.
   *   name  the filename on the left
   *   meta  the short grey tag on the right
   *   note  the actual line, written to her
   */
  mediaFiles: [
    {
      name: "shinchan_every_episode.mp4",
      tag: "shin chan",
      meta: "rewatched: countless",
      note: "You've seen every episode and you still laugh like it's the first time. That same wheezy, head-thrown-back laugh, at the same butt-dance jokes, every single time. I stopped watching the screen a long time ago. I watch you watching it.",
    },
    {
      name: "hawkins_survival_plan.txt",
      tag: "stranger things",
      meta: "upside down: not scared",
      note: "If the Upside Down ever opened up in our street, you'd be the one holding the flashlight and I'd be the one holding your hand. You're my Eleven. Small, stubborn, and easily the strongest person in the room. Eggos are on me.",
    },
    {
      name: "young_sheldon_s1-s7.log",
      tag: "young sheldon",
      meta: "cried at the finale: yes",
      note: "You watch it like it's a comedy but you tear up every time Mary hugs Sheldon. You have Missy's sharp tongue and Meemaw's heart. I'd move to Medford, Texas if you asked. I'd hate it. I'd still go.",
    },
    {
      name: "soft_kitty.mid",
      tag: "the big bang theory",
      meta: "for when you're sick",
      note: "Soft kitty, warm kitty, little ball of fur. When you're sick I'll sing it, out of tune, three times, because that's the rule. And yes, you have a spot on the sofa. Left cushion. It's yours. I don't argue anymore. Bazinga.",
    },
    {
      name: "blue.pal",
      tag: "your colour",
      meta: "1 colour, 400 shades",
      note: "Anything blue and I think of you. A dupatta, a car, the sky at 6pm, this entire website. I've stopped calling it 'blue'. It's just 'the Abinaya colour' now.",
    },
    {
      name: "bags_i_am_saving_for.xlsx",
      tag: "expensive bags",
      meta: "last edited: today",
      note: "You'll walk past ten dresses to stand in front of one bag. I know the exact one you keep going back to. It's on the list. The list has a date on it. I'm not telling you the date.",
    },
    {
      name: "accessories.list",
      tag: "sparkle",
      meta: "longer than dresses.list",
      note: "A little sparkle at your wrist, the gold chain at your neck, the earrings you change your mind about four times. You don't dress up for the outfit. The outfit dresses up because it's on you.",
    },
    {
      name: "krishna.prayer",
      tag: "kanna",
      meta: "04 sept · 05 sept",
      note: "This year Krishna's birthday is on the 4th of September and yours is on the 5th. I don't think that's an accident. The world spent one day celebrating the god you love, and the very next day it gave me you. Jannmashtami on the 4th, my Abinaya on the 5th. I know exactly which lamp I'm lighting on both days.",
    },
    {
      name: "her_laugh.wav",
      tag: "no reference needed",
      meta: "∞ plays",
      note: "The one where you laugh at your own joke before you finish telling it. No show wrote that. That one's just you, and it's my favourite thing this laptop has ever recorded.",
    },
  ],
  mediaHeading: "things that are so you",
  mediaFooter: "no previews needed. I know every one of these by heart. that's the point.",
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
  /** the image */
  src?: string;
  /** for Live Photos: the short video that plays when picked up */
  live?: string;
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
  /** colour of the pushpin holding it */
  pin?: "blue" | "red" | "gold";
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
    w: 220,
    pin: "red",
  },
  {
    id: "p1",
    kind: "photo",
    src: photo("01"),
    alt: "Abinaya and Sashwath, their first photo together",
    caption: "Our 1st pic together!!!",
    detail: "the first of many. the many are all my favourite.",
    more: "Look at us. We had no idea. We still don't, honestly. Best decision I never planned.",
    tilt: 3,
    x: 40,
    y: 22,
    w: 230,
    pin: "blue",
  },
  {
    id: "p2",
    kind: "photo",
    src: photo("02"),
    alt: "Abinaya",
    caption: "Pretty little babyyyyy",
    detail: "no filter needed. never was.",
    more: "I have looked at this one more times than I will admit in writing.",
    tilt: -2,
    x: 66,
    y: 28,
    w: 210,
    pin: "gold",
  },
  {
    id: "p3",
    kind: "photo",
    src: photo("03"),
    alt: "Abinaya, half asleep",
    caption: "Sleepyheaddddd -_-",
    detail: "the calmest you ever are. also the cutest.",
    more: "You'd be annoyed I kept this. That's exactly why I kept it.",
    tilt: 5,
    x: 28,
    y: 66,
    w: 200,
    pin: "blue",
  },
  {
    id: "p4",
    kind: "photo",
    src: photo("04"),
    alt: "A text where Abinaya admits Sashwath is taller",
    caption: "Shawwtyyyyy",
    detail: "exhibit A. your own words, in writing: I'm taller. case closed, shorty.",
    more: "Years of you insisting you're the tall one, and then you go and type this. I've screenshotted it, framed it, and pinned it up. Argue all you like, you can't argue with your own texts. I love you the most. From up here.",
    tilt: -3,
    x: 54,
    y: 70,
    w: 220,
    pin: "red",
  },
  {
    id: "p5",
    kind: "photo",
    src: photo("05"),
    live: photo("05", "video"),
    alt: "Abinaya, a live photo",
    caption: "Baddyyyyyyy",
    detail: "hold it. it moves.",
    more: "Three seconds of you being you. I'd loop it forever. I have, actually.",
    tilt: 2,
    x: 80,
    y: 70,
    w: 210,
    pin: "gold",
  },
];

export const archive = {
  kicker: "the pinboard",
  hint: "pick one up",
  hintTouch: "tap one to pick it up",
  putBack: "put it back",
  missing: "photo goes here",
  liveHint: "live",
};

/* ---------- The lunch box (school) ---------- */

export const lunchBox = {
  kicker: "found at the back of the shelf",
  heading: "Every break.",
  lines: [
    "Same school. 12th grade. Some genius put you on the first floor and me on the ground floor, and then made a rule that nobody changes classrooms during breaks.",
    "So every recess, every lunch, I climbed those stairs anyway. A few minutes at your desk, talking about nothing, was worth more than any rule they could write.",
    "I got caught. I got shouted at in front of everyone. I got humiliated more than once. And I went back up the very next day, because on the other side of that staircase was you, and nothing they said ever made that a bad trade.",
    "I'd still take those stairs two at a time. I'd still get caught. I'd still not care.",
  ],
  sign: "still the best part of the day. still you.",
};

/* ---------- The window (September 25) ---------- */

export const september = {
  lead: "The day you said yes and quietly ruined every other day for me. Nothing compares now.",
  after: `${facts.yearsTogether[0].toUpperCase()}${facts.yearsTogether.slice(1)}. Feels like four minutes. Also four lifetimes.`,
  line: "Late night. Truth or Dare over text. Somewhere between the truths and the dares we both stopped pretending, and confessed. Best game I ever lost.",
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
    "Every version of my life I can imagine has you in it. Some of them have you a floor above me during lunch break. The good ones have you next to me, stealing the left cushion.",
    "You make ordinary days feel like something I'd want to keep. That's rare. You're rare. I'm not letting go.",
  ],
  closing: "Almost four years in, and I'd still pick you on the first day.",
  /** his own words. line breaks are kept. */
  personal: `Happiest Birthday babyyyyyyy, omgggggg u r 21 years old nowwwww ( but you'll always be my kutty papa 🤣 ), here's to us spending mannnnnny more birthdays like thissss, hope u like everything in this, naraiya paasatha kottiruken heeheee, I love you the mossssssst kannama 💖💖💖💖💖

I'll always be your life partner, your well wisher, your besssst friend, your enemy when u feel like fighting, your pillar when u need support, your everyyyything foreverrrrr

Wishing u the bessssssst of days today ( Subtle Foreshadowing: Maybe coz you'll be meeting your fav person ? 😏 )

Can't wait to meet youuuuuuu 😘😘😘😘😘`,
  signoff: "Signing off,",
  signoff2: "Yours lovinglyyyyyy",
  name: "Sashwath <3",
  songLine: "this one's ours. it's playing for you now.",
  songTap: "tap to play our song",
  end: "that's the room. you can wander back whenever you like.",
};
