import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { copy } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { cn } from "../utils/cn";

/** A small, low-key button. */
export function QuietButton({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={cn(
        "group relative inline-flex min-h-11 items-center gap-3 rounded-full border border-ice/25 bg-night/40 px-6 font-mono text-[12px] uppercase tracking-[0.22em] text-ivory/85 backdrop-blur-sm transition-all duration-500",
        "hover:border-ice/60 hover:bg-blue/15 hover:text-ivory focus-visible:border-ice focus-visible:outline-none",
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-ivory/70 transition-all duration-500 group-hover:w-4 group-hover:bg-ice" />
      {children}
    </button>
  );
}

/** "back to the room" – sits in the top-left of every scene. */
export function BackToRoom({ onClick, tone = "dark" }: { onClick: () => void; tone?: "dark" | "light" }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: cine }}
      className={cn(
        "group fixed left-4 top-4 z-50 inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors md:left-6 md:top-6",
        tone === "dark"
          ? "bg-night/50 text-ivory/70 backdrop-blur-md hover:text-ivory"
          : "bg-white/70 text-night/70 backdrop-blur-md hover:text-night"
      )}
    >
      <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1">←</span>
      {copy.back}
    </motion.button>
  );
}

/** A thread that drops down to say "there is more below". */
export function ScrollCue({ show, className, tone = "dark" }: { show: boolean; className?: string; tone?: "dark" | "light" }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "pointer-events-none flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]",
        tone === "dark" ? "text-ivory/60" : "text-night/50",
        className
      )}
    >
      <span>{copy.scrollCue}</span>
      <span className="cue-line" />
      <span className="cue-dot" />
    </motion.div>
  );
}

/** Reveals bracketed text as a soft highlight so nothing is missed. */
export function Placeholder({ text, className }: { text: string; className?: string }) {
  const isPlaceholder = /^\[.*\]$/.test(text.trim());
  if (!isPlaceholder) return <span className={className}>{text}</span>;
  return <span className={cn("placeholder", className)}>{text}</span>;
}

/** Little section label used across scenes. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("font-mono text-[10px] uppercase tracking-[0.32em] text-ice/55", className)}>{children}</div>
  );
}

/** A framed slot for an image that may not have been dropped in yet. */
export function Evidence({
  src,
  alt,
  caption,
  missing,
  className,
}: {
  src?: string;
  alt: string;
  caption: string;
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
      <figcaption className="mt-2 font-mono text-[11px] text-ice/50">{caption}</figcaption>
    </figure>
  );
}
