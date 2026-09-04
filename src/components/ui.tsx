import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { copy } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { cn } from "../utils/cn";

/* ---------- Back to the room ---------- */
/**
 * A small, quiet pill in the top-left corner. It fades in a beat after the
 * scene does, the arrow slides on hover, and it never fights the content.
 */
export function BackToRoom({ onClick, dark = false }: { onClick: () => void; dark?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.45, ease: cine }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group fixed left-4 top-4 z-50 inline-flex h-9 items-center gap-2.5 rounded-full border pl-1.5 pr-4 font-mono text-[10.5px] uppercase tracking-[0.26em] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:left-6 md:top-6",
        dark
          ? "border-night/15 bg-white/45 text-night/70 hover:border-night/35 hover:bg-white/70 hover:text-night"
          : "border-ice/15 bg-night/35 text-ivory/75 hover:border-ice/40 hover:bg-night/55 hover:text-ivory hover:shadow-[0_0_28px_rgba(47,107,255,0.28)]"
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-[12px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5",
          dark ? "bg-night/10 group-hover:bg-night/15" : "bg-ice/10 group-hover:bg-blue/30"
        )}
      >
        ←
      </span>
      {copy.back}
    </motion.button>
  );
}

/* ---------- Kicker: tiny mono label above headings ---------- */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[10.5px] uppercase tracking-[0.35em] text-ice/60", className)}>{children}</p>;
}

/* ---------- A quiet pill button (the only button style in the room) ---------- */
/**
 * A little dot sits in front of the label. On hover it stretches into a dash
 * and the pill warms up to blue. Works on the dark room and on paper.
 */
export function QuietButton({
  className,
  dark = false,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { dark?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "sheen group relative inline-flex min-h-11 items-center gap-3 rounded-full border px-6 font-mono text-[12px] uppercase tracking-[0.22em] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:translate-y-0 active:scale-[0.99] focus-visible:outline-none",
        dark
          ? "border-night/25 bg-white/30 text-night/80 hover:border-night/60 hover:bg-night/5 hover:text-night focus-visible:border-night"
          : "border-ice/25 bg-night/40 text-ivory/85 hover:border-ice/60 hover:bg-blue/15 hover:text-ivory hover:shadow-[0_0_30px_rgba(47,107,255,0.25)] focus-visible:border-ice",
        className
      )}
    >
      <span
        className={cn(
          "h-1 w-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-4",
          dark ? "bg-night/60 group-hover:bg-night" : "bg-ivory/70 group-hover:bg-ice"
        )}
      />
      {children}
    </button>
  );
}

/* ---------- Scroll cue ---------- */
/**
 * Sits in the bottom-right corner so it never covers the text.
 * Fades away once the visitor has started scrolling.
 */
export function ScrollCue({ hidden = false, dark = false, className }: { hidden?: boolean; dark?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40 flex flex-col items-center gap-3 transition-opacity duration-700 md:right-9",
        hidden ? "opacity-0" : "opacity-100",
        className
      )}
    >
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.38em] [writing-mode:vertical-rl]",
          dark ? "text-night/55" : "text-ice/75"
        )}
      >
        {copy.scrollCue}
      </span>
      <span className={cn("cue-line", dark && "cue-line-dark")} />
      <span className={cn("cue-dot", dark && "cue-dot-dark")} />
    </div>
  );
}

/* ---------- Evidence (a screenshot), or a placeholder telling you which file to drop in ---------- */
export function Evidence({
  src,
  alt,
  caption,
  missing,
  className,
}: {
  src?: string;
  alt: string;
  caption?: string;
  missing: string;
  className?: string;
}) {
  return (
    <figure className={cn("mt-4", className)}>
      <div className="relative overflow-hidden rounded-[6px] border border-ice/15 bg-deep/60 p-2">
        {src ? (
          <img src={src} alt={alt} className="mx-auto block max-h-[520px] w-auto max-w-full rounded-[3px] object-contain" loading="lazy" />
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[3px] border border-dashed border-ice/20 px-6 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ice/40">evidence pending</span>
            <span className="font-mono text-[11px] text-ice/35">{missing}</span>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-2 font-mono text-[11px] text-ice/50">{caption}</figcaption>}
    </figure>
  );
}
