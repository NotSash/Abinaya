import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { cine } from "../lib/hooks";

/** Quiet return control. Sits in the same place in every scene so the visitor never hunts for it. */
export function BackToRoom({ onClick, label = "back to the room", tone = "light" }: { onClick: () => void; label?: string; tone?: "light" | "dark" }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: cine }}
      className={cn(
        "fixed left-5 top-5 z-50 flex h-11 items-center gap-3 pr-4 pl-1 text-[13px] font-normal tracking-wide md:left-8 md:top-7",
        tone === "light" ? "text-ivory/80 hover:text-ivory" : "text-navy/70 hover:text-navy"
      )}
      aria-label={label}
    >
      <span className="grid h-9 w-9 place-items-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M11 3 5 9l6 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="hidden sm:inline">{label}</span>
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
        "group inline-flex min-h-11 items-center gap-3 font-display text-[22px] italic text-ivory/90 transition-colors duration-500 hover:text-ivory",
        className
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-ivory/35 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ivory transition-transform delay-150 duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </span>
    </button>
  );
}

/** Editable placeholder treatment: visible, honest, still designed. */
export function Placeholder({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  const isPlaceholder = typeof children === "string" && children.trim().startsWith("[");
  if (!isPlaceholder) return <span className={className}>{children}</span>;
  return (
    <span
      className={cn(
        "rounded-[2px] px-1.5 py-0.5 font-sans text-[0.78em] font-normal tracking-wide",
        tone === "light" ? "bg-ice/10 text-ice/60" : "bg-navy/8 text-navy/55",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Small corner note, serif italic. Used sparingly for wayfinding. */
export function CornerNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-display text-[15px] italic leading-snug text-ivory/55", className)}>{children}</p>;
}
