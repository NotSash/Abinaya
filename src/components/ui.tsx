import type { ButtonHTMLAttributes, ReactNode } from "react";
import { copy } from "../content/egginaya";
import { cn } from "../utils/cn";

/** Top-left link that closes any scene. */
export function BackToRoom({ onClick, dark = false }: { onClick: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group absolute left-5 top-5 z-50 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] transition-colors md:left-8 md:top-7 md:text-[13px]",
        dark ? "text-night/70 hover:text-night" : "text-ivory/85 hover:text-ivory"
      )}
    >
      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1">←</span>
      {copy.back}
    </button>
  );
}

/** Tiny mono label above headings. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[10.5px] uppercase tracking-[0.35em] text-ice/60", className)}>{children}</p>;
}

/** The only button style in the room. */
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
        "inline-flex items-center justify-center rounded-full border px-7 py-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        dark
          ? "border-night/25 text-night/80 hover:border-night/60 hover:bg-night/5 hover:text-night"
          : "border-ice/30 text-ivory/85 hover:border-ice/70 hover:bg-ice/10 hover:text-ivory",
        className
      )}
    >
      {children}
    </button>
  );
}

/**
 * Scroll cue. Sits in the bottom-right corner so it never covers the text.
 * Fades away once the visitor has started scrolling.
 */
export function ScrollCue({ hidden = false, dark = false }: { hidden?: boolean; dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40 flex flex-col items-center gap-3 transition-opacity duration-700 md:right-9",
        hidden ? "opacity-0" : "opacity-100"
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

/** An image on the laptop screen, or a placeholder telling you which file to drop in. */
export function Evidence({ src, alt, missing }: { src?: string; alt: string; missing: string }) {
  return (
    <div className="relative overflow-hidden rounded-[6px] border border-ice/15 bg-deep/60 p-2">
      {src ? (
        <img src={src} alt={alt} className="mx-auto block max-h-[520px] w-auto max-w-full rounded-[3px] object-contain" loading="lazy" />
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ice/40">evidence pending</span>
          <span className="font-mono text-[11px] text-ice/35">{missing}</span>
        </div>
      )}
    </div>
  );
}
