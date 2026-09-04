import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { cine } from "../lib/hooks";
import { copy } from "../content/egginaya";

/** Quiet return control. Sits in the same place in every scene so the visitor never hunts for it. */
export function BackToRoom({
  onClick,
  label = copy.back,
  tone = "light",
}: {
  onClick: () => void;
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: cine }}
      className={cn(
        "absolute left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-50 flex min-h-11 items-center gap-3 pr-3 text-[14px] tracking-wide transition-colors",
        tone === "light" ? "text-ivory/70 hover:text-ivory" : "text-navy/70 hover:text-navy"
      )}
    >
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true" className="ml-1">
        <path d="M8 1 2 7l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </motion.button>
  );
}

/** A soft text button: thin rule, serif, no pill. */
export function QuietButton({
  children,
  onClick,
  className,
  autoFocus,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className={cn(
        "underline-soft inline-flex min-h-11 items-center font-display text-[20px] italic text-ivory/85 transition-colors hover:text-ivory md:text-[22px]",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Editable placeholder treatment: visible, honest, still designed. */
export function Placeholder({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const isPlaceholder = typeof children === "string" && children.trim().startsWith("[");
  if (!isPlaceholder) return <span className={className}>{children}</span>;
  return (
    <span
      className={cn(
        "rounded-[2px] px-1.5 py-0.5 font-sans text-[0.72em] not-italic tracking-normal",
        tone === "light" ? "bg-ice/10 text-ice/70" : "bg-navy/8 text-navy/60",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Small corner note, serif italic. Used sparingly for wayfinding. */
export function CornerNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-display text-[15px] italic text-ivory/60", className)}>{children}</p>;
}

/**
 * A bright, unmissable "there's more below" cue.
 * Sits at the bottom centre and disappears once the visitor has scrolled.
 */
export function ScrollCue({ show, label = copy.scrollCue, tone = "light" }: { show: boolean; label?: string; tone?: "light" | "dark" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6, transition: { duration: 0.5 } }}
          transition={{ duration: 1, delay: 1.2, ease: cine }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2"
        >
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.3em]",
              tone === "light" ? "text-ice/85" : "text-navy/70"
            )}
            style={{ textShadow: "0 0 14px rgba(217,230,255,0.5)" }}
          >
            {label}
          </span>
          <span className="cue-line" />
          <span className="cue-dot" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
