# Content guide

Everything personal lives in `src/content/egginaya.ts`. Components only read from it.

## Files you drop in (no code changes needed)

| File | Where it shows up |
| --- | --- |
| `src/assets/photos/01.jpg` | pinboard, "Our 1st pic together!!!" |
| `src/assets/photos/02.jpg` | pinboard, "Pretty little babyyyyy" |
| `src/assets/photos/03.jpg` | pinboard, "Sleepyheaddddd -_-" |
| `src/assets/photos/04.jpg` | pinboard, "Shawwtyyyyy" (the text where she admits you're taller) |
| `src/assets/photos/05.jpg` | pinboard, "Baddyyyyyyy" (still frame of the Live Photo) |
| `src/assets/photos/05.mp4` | the moving part of the Live Photo |
| `src/assets/photos/maths-period.png` | laptop > incidents/maths_period.log |
| `src/assets/photos/marriage.png` | laptop > records/marriage.cert |
| `src/assets/audio/until-i-found-you.mp3` | optional. If present it is used instead of Spotify |

- Any image extension works (`.jpg`, `.jpeg`, `.png`, `.webp`). HEIC is not supported by browsers, export to jpg.
- Photos can be any size or shape. The frames measure each picture when it loads and shape themselves
  around it, so there is never any empty space beside a picture.

## The room

The room, desk and sky renders are loaded from the repository (see `src/lib/assets.ts`).
Hotspot positions are percentages of the room image itself, so they stay on the laptop,
the pinboard, the window, the envelope, the egg and the lunch box at any window size.

## How it plays

1. Arrival: "come in".
2. The room. Move the mouse (or drag on a phone) to look around. Five things glow.
3. Each one opens a scene: the laptop, the pinboard, the window, the lunch box, the egg.
4. The blue envelope stays sealed until all five have been found. Then it turns gold.
5. Inside: the letter, the final message, and the song.
