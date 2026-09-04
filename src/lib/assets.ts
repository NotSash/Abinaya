/**
 * Scene renders.
 * These point at the images committed to the NotSash/Abinaya repository so the room,
 * the desk and the sky look exactly as designed and the hotspot positions line up.
 *
 * NOTE: the renders live in the repo's first commit (they were dropped from `main`),
 * so we pin that commit rather than the branch.
 *
 * To make the build fully self-contained, copy room.jpg / desk.jpg / sky.jpg into
 * src/assets and swap these for imports:
 *   import roomImg from "../assets/room.jpg";
 */
const base = "https://raw.githubusercontent.com/NotSash/Abinaya/63b74c1105fa00e46d4fe38d730e0ac1b364e475/src/assets";

export const roomImg = `${base}/room.jpg`;
export const deskImg = `${base}/desk.jpg`;
export const skyImg = `${base}/sky.jpg`;
