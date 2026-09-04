import type { CSSProperties } from "react";

/**
 * Procedural textures as data URLs, injected as CSS variables at runtime.
 * Kept out of the stylesheet on purpose: inline SVG inside url() is fragile in CSS toolchains.
 */
const svg = (body: string, size: number) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`
  )}")`;

export const textures = {
  grain: svg(
    `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/>`,
    160
  ),
  paper: svg(
    `<filter id="p"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.12"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#p)"/>`,
    200
  ),
};

export const textureVars = {
  ["--tex-grain" as string]: textures.grain,
  ["--tex-paper" as string]: textures.paper,
} as CSSProperties;
