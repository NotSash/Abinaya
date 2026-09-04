# Filling in the last bits

All the words are done. Everything personal lives in one file: `src/content/egginaya.ts`.
The only things left are **files you drop in** — no code changes needed, they're picked up automatically by name.

> First time on a new machine: run `npm install` once, then `npm run dev`.
> Until that's done VS Code will complain about `vite/client`, `import.meta.glob` and `node` types — they all come from `node_modules`.

## 1. Photos → `src/assets/photos/`

| file | shows as | who |
| --- | --- | --- |
| `01.jpg` | "Our 1st pic together!!!" | both of you |
| `02.jpg` | "Pretty little babyyyyy" | her |
| `03.jpg` | "Sleepyheaddddd -_-" | her |
| `04.jpg` | "Shawwtyyyyy" | her |
| `05.jpg` + `05.mp4` | "Baddyyyyyyy" (Live Photo) | her |

`.jpg`, `.jpeg`, `.png` or `.webp` all work. **HEIC does not work in browsers** — export as JPG.
**Any size or shape works.** Each frame on the pinboard measures its picture when it loads and shapes itself to fit — portrait, landscape or square. Until a file is there, the frame shows a "photo goes here" slot.

### The Live Photo (05)
A Live Photo is really two files: a still + a ~3 second video. The site needs both:

1. On your iPhone, open the Live Photo → Share → **Save as Video**. That gives you a `.MOV` in your camera roll.
2. Also export the still: Share → Options → turn **Live Photo off** → save/AirDrop as JPG.
3. Rename them `05.mp4` and `05.jpg` and put both in `src/assets/photos/`.
   - If you only have a `.mov`, rename it `05.mov` — it works on iPhone/Safari. For Chrome/Android too, convert to `.mp4` (iMovie, HandBrake, or any online converter — keep H.264).
4. Done. On the pinboard it shows a little **LIVE** badge; it plays when she hovers (desktop) or picks it up (phone), muted and looping, exactly like a Live Photo.

## 2. Screenshots → `src/assets/photos/`

| file | where it appears |
| --- | --- |
| `maths-period.png` | the laptop → `incidents/maths_period.log` → evidence |
| `marriage.png` | the laptop → `records/marriage.cert` → "the signed agreement" |

## 3. The song

By default the letter uses the **Spotify player** (Stephen Sanchez – *Until I Found You*, original) and presses play by itself the moment the final part of the letter scrolls into view.
Spotify only plays the full track if she's logged in to Spotify in that browser; otherwise it plays the preview.

If you ever get the mp3, drop it at `src/assets/audio/until-i-found-you.mp3` and it'll be used instead of Spotify (full song, from the start, autoplaying — no login needed).

## 4. Scene renders

`src/lib/assets.ts` loads `room.jpg`, `desk.jpg`, `sky.jpg` from the repo's first commit on GitHub (they were removed from `main`).
To make the build self-contained, copy those three files into `src/assets/` and switch the constants to imports.

## 5. Progress

Nothing is saved between visits: a refresh always starts at the door, and the room is fresh.
The counter at the top right counts **five** finds — the laptop, the pinboard, the window, the lunch box and the egg (poke it once).
The envelope only opens after all five.
