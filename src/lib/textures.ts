/**
 * Procedural textures as data URLs, injected as CSS variables at runtime.
 * Kept out of the stylesheet on purpose: inline SVG inside url() is fragile in CSS toolchains.
 */
const svg = (body: string, size: number) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`
  )}")`;

export const textures = {
  grain: svg(
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/></filter><rect width='160' height='160' filter='url(#n)'/>`,
    160
  ),
  paper: svg(
    `<filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0.14 0'/></filter><rect width='200' height='200' filter='url(#p)'/>`,
    200
  ),
};

export const textureVars = {
  ["--tex-grain" as string]: textures.grain,
  ["--tex-paper" as string]: textures.paper,
} as React.CSSProperties;
