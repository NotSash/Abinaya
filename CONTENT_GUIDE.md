# Filling in the real content

Everything personal lives in one file: `src/content/egginaya.ts`. Components only read from it.

## Text
Search the file for anything in square brackets, e.g. `[YEAR]`, `[YOUR NAME]`,
`[INSERT FINAL BIRTHDAY MESSAGE HERE]`. Replace the whole bracketed string.
The design shows bracketed text in a soft highlight so nothing is missed.

- `facts.togetherDate.year` – the year for September 25.
- `system.marriage.between[1]` – your name on the certificate.
- `system.marriage.terms` – the real story or your own terms.
- `lunchBox.placeholder` and the `lunch` print – what you remember about lunch breaks.
- `about.items[*].body` – your own words. Keep them short; the layout gives them room.
- `finalMessage.placeholder` – the final birthday message. Line breaks are kept.

## Photos
1. Put images in `src/assets/photos/`.
2. At the top of `egginaya.ts`: `import p1 from "../assets/photos/01.jpg";`
3. In `prints`, set `src: p1` and an `alt`, and write the `caption`.
Add or remove entries in `prints` freely; positions (`x`, `y`, `tilt`) are percentages of the desk.

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
