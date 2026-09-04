# Filling in the real content

Everything personal lives in one file: `src/content/egginaya.ts`. Components only read from it.

## Text
Search the file for anything in square brackets, e.g. `[YEAR]`, `[YOUR NAME]`. Replace the whole bracketed string.
The design shows bracketed text in a soft highlight so nothing is missed.

- `facts.togetherDate.year` – the year for September 25.
- `system.marriage.between[1]` – your name on the certificate.
- `system.marriage.terms` – the real story or your own terms.
- `lunchBox.lines` / `lunchBox.placeholder` – the lunch-break memory (this is different from the pinboard note on purpose).
- `prints[0]` – the note on the pinboard.
- `about.items[*].body` – the things you notice. Already written; make them yours.
- `finalMessage.paragraphs`, `finalMessage.placeholder`, `finalMessage.name` – the birthday letter. Line breaks are kept.
- `eggLines` – what the egg says, one line per poke. It loops from `eggLoopFrom`.

## Photos
1. Put images in `src/assets/photos/`.
2. At the top of `egginaya.ts`: `import p1 from "../assets/photos/01.jpg";`
3. In `prints`, set `src: p1` and an `alt`, and write the `caption`.
Add or remove entries in `prints` freely; positions (`x`, `y`, `tilt`) are percentages of the desk.

## Scene renders
`src/lib/assets.ts` points at `room.jpg`, `desk.jpg` and `sky.jpg` in the GitHub repo.
To make the build self-contained, copy those three files into `src/assets/` and switch the constants to imports.

## The suthiyama screenshot
Import it and set `media.suthiyamaScreenshot`.

## The song
Put the file at `src/assets/audio/until-i-found-you.mp3`, import it, and set `media.song`.
It never autoplays. The play control appears at the very end.

## Hotspot positions
If a mark should sit more exactly on the laptop, pinboard, window, envelope, egg or lunch box,
adjust `x` / `y` in `hotspots` (percent of the room image, from the left and from the top).

## Progress
Which places have been seen is remembered in `localStorage` under `egginaya.visited.v1`.
Clear it to watch the experience from the start again.
