/**
 * Scene renders.
 * These point at the images in the NotSash/Abinaya repository so the room,
 * the desk and the sky look exactly as before and the hotspot positions line up.
 *
 * To make the build fully self-contained, copy the three files into src/assets
 * and swap these for imports:
 *   import roomImg from "../assets/room.jpg";
 */
const base = "https://raw.githubusercontent.com/NotSash/Abinaya/main/src/assets";

export const roomImg = `${base}/room.jpg`;
export const deskImg = `${base}/desk.jpg`;
export const skyImg = `${base}/sky.jpg`;
