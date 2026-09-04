import { useEffect } from "react";
import { motion } from "motion/react";
import { lunchBox } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { BackToRoom, Placeholder } from "./ui";

/** A folded note that lived in a lunch box. The room stays behind it. */
export function LunchBox({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onBack();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6" onClick={onBack}>
      <BackToRoom onClick={onBack} />
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
        transition={{ duration: 1.1, delay: 0.5, ease: cine }}
        onClick={(e) => e.stopPropagation()}
        className="paper paper-lined w-full max-w-[420px] px-7 pb-10 pt-8 md:px-10"
      >
        <h2 className="font-display text-[34px] leading-[28px] text-navy md:text-[38px]">{lunchBox.heading}</h2>
        <div className="mt-[28px] space-y-0 font-display text-[20px] leading-[28px] text-navy/85">
          {lunchBox.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <p className="mt-[28px] font-display text-[20px] leading-[28px] text-navy/80">
          <Placeholder tone="dark">{lunchBox.placeholder}</Placeholder>
        </p>
      </motion.div>
    </div>
  );
}
