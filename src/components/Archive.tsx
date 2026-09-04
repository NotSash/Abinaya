import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import deskImg from "../assets/desk.jpg";
import { prints, type Print } from "../content/egginaya";
import { cine, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Placeholder } from "./ui";

export function Archive({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const { w } = useViewport();
  const narrow = w < 820;
  const current = prints.find((p) => p.id === open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) setOpen(null);
      else onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onBack]);

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
      transition={{ duration: 1.1, delay: 0.5, ease: cine }}
    >
      {/* The desk. Arrives a touch larger and settles, like leaning in. */}
      <motion.img
        src={deskImg}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, delay: 0.4, ease: cine }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_25%_20%,transparent_30%,rgba(6,11,28,0.55)_100%)]" />
      <div className="grain" />

      <BackToRoom onClick={onBack} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="pointer-events-none absolute right-5 top-7 z-10 text-right font-display text-[15px] italic text-ivory/60 md:right-8"
      >
        pick one up
      </motion.p>

      {narrow ? (
        <div className="scroll-area no-scrollbar absolute inset-0 pt-24 pb-24">
          <div className="relative mx-auto flex w-full max-w-[420px] flex-col gap-10 px-8">
            {prints.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9 + i * 0.1, ease: cine }}
                className={cn("flex", i % 2 ? "justify-end" : "justify-start")}
              >
                <PrintObject p={p} width={Math.min(p.w, w * 0.62)} onOpen={() => setOpen(p.id)} hidden={open === p.id} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          {prints.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30, rotate: p.tilt * 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.9 + i * 0.09, ease: cine }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <PrintObject p={p} width={p.w} onOpen={() => setOpen(p.id)} hidden={open === p.id} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Lifted print */}
      <AnimatePresence>
        {current && (
          <motion.div
            key="lift"
            className="absolute inset-0 z-20 flex items-center justify-center p-6"
            initial={{ backgroundColor: "rgba(6,11,28,0)" }}
            animate={{ backgroundColor: "rgba(6,11,28,0.55)" }}
            exit={{ backgroundColor: "rgba(6,11,28,0)" }}
            transition={{ duration: 0.6 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              layoutId={`print-${current.id}`}
              initial={{ rotate: current.tilt }}
              animate={{ rotate: 0 }}
              transition={{ layout: { duration: 0.75, ease: cine }, rotate: { duration: 0.75, ease: cine } }}
              style={{ width: Math.min(w * 0.82, 460) }}
              onClick={(e) => e.stopPropagation()}
            >
              <PrintFace p={current} large />
            </motion.div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 min-h-11 -translate-x-1/2 font-display text-[17px] italic text-ivory/70 hover:text-ivory"
            >
              put it back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PrintObject({ p, width, onOpen, hidden }: { p: Print; width: number; onOpen: () => void; hidden: boolean }) {
  return (
    <motion.button
      type="button"
      layoutId={`print-${p.id}`}
      onClick={onOpen}
      aria-label={p.kind === "note" ? "A note about school" : `Photo: ${p.caption}`}
      whileHover={{ y: -4, rotate: p.tilt * 0.6 }}
      transition={{ layout: { duration: 0.75, ease: cine }, y: { duration: 0.5, ease: cine }, rotate: { duration: 0.6, ease: cine } }}
      style={{ width, rotate: p.tilt, opacity: hidden ? 0 : 1 }}
      className="block text-left"
    >
      <PrintFace p={p} />
    </motion.button>
  );
}

function PrintFace({ p, large }: { p: Print; large?: boolean }) {
  if (p.kind === "note") {
    return (
      <div className={cn("paper paper-lined px-5 pb-6 pt-7", large ? "px-8 pb-10 pt-9" : "")}>
        <p className={cn("font-display leading-[28px] text-navy", large ? "text-[22px]" : "text-[18px]")}>{p.caption}</p>
        {p.detail && <p className={cn("font-display italic leading-[28px] text-navy/75", large ? "text-[22px]" : "text-[18px]")}>{p.detail}</p>}
        {large && (
          <p className="mt-[28px] font-display text-[20px] leading-[28px] text-navy/80">
            <Placeholder tone="dark">[What you remember about those lunch breaks. Short is fine.]</Placeholder>
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={cn("paper p-3 pb-4", large && "p-4 pb-6")}>
      <div className="photo-slot aspect-[4/5]">
        {p.src ? (
          <img src={p.src} alt={p.alt ?? p.caption} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.12em] text-ice/45">photo</span>
        )}
      </div>
      <div className={cn("mt-3 px-1", large && "mt-4")}>
        <p className={cn("font-display italic leading-tight text-navy", large ? "text-[24px]" : "text-[17px]")}>
          <Placeholder tone="dark">{p.caption}</Placeholder>
        </p>
        {p.detail && large && (
          <p className="mt-1.5 font-display text-[17px] leading-tight text-navy/65">
            <Placeholder tone="dark">{p.detail}</Placeholder>
          </p>
        )}
      </div>
    </div>
  );
}
