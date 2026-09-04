/**
 * A throbbing favicon.
 * Browsers do not animate SVG favicons, so we redraw the heart at a slightly
 * different size a few times a second. Two quick beats, then a rest: lub-dub.
 */
function heart(scale: number, glow: number) {
  const s = scale.toFixed(3);
  const g = glow.toFixed(2);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
<defs>
<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#6aa4ff'/><stop offset='0.55' stop-color='#2f6bff'/><stop offset='1' stop-color='#1b3fb8'/></linearGradient>
<radialGradient id='s' cx='0.32' cy='0.28' r='0.5'><stop offset='0' stop-color='#ffffff' stop-opacity='0.75'/><stop offset='1' stop-color='#ffffff' stop-opacity='0'/></radialGradient>
<radialGradient id='h' cx='0.5' cy='0.55' r='0.5'><stop offset='0' stop-color='#6aa4ff' stop-opacity='${g}'/><stop offset='1' stop-color='#6aa4ff' stop-opacity='0'/></radialGradient>
</defs>
<circle cx='32' cy='34' r='32' fill='url(#h)'/>
<g transform='translate(32 36) scale(${s}) translate(-32 -36)'>
<path d='M32 58 C20 48 6 38 6 23 A13 13 0 0 1 32 16 A13 13 0 0 1 58 23 C58 38 44 48 32 58 Z' fill='url(#g)'/>
<path d='M32 58 C20 48 6 38 6 23 A13 13 0 0 1 32 16 A13 13 0 0 1 58 23 C58 38 44 48 32 58 Z' fill='url(#s)'/>
</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// scale, glow, hold (ms)
const beat: Array<[number, number, number]> = [
  [0.86, 0.0, 90],
  [1.0, 0.35, 90],
  [0.9, 0.1, 110],
  [1.04, 0.5, 90],
  [0.92, 0.15, 120],
  [0.86, 0.0, 560],
];

const frames = beat.map(([s, g, hold]) => ({ href: heart(s, g), hold }));

export function startFaviconHeartbeat() {
  if (typeof document === "undefined") return () => {};
  const link =
    (document.getElementById("favicon") as HTMLLinkElement | null) ??
    (() => {
      const l = document.createElement("link");
      l.rel = "icon";
      l.type = "image/svg+xml";
      document.head.appendChild(l);
      return l;
    })();

  let i = 0;
  let timer = 0;
  const tick = () => {
    const f = frames[i % frames.length];
    link.href = f.href;
    i += 1;
    timer = window.setTimeout(tick, f.hold);
  };
  tick();
  return () => window.clearTimeout(timer);
}
