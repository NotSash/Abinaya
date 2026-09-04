import { useMemo } from "react";
import { motion } from "motion/react";
import { skyImg } from "../lib/assets";
import { facts, september } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Kicker } from "./ui";

export function WindowNight({ onBack }: { onBack: () => void }) {
  useEscape(onBack);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, delay, ease: cine },
  });

  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 70,
        s: 1 + Math.random() * 1.6,
        d: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden bg-night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
    >
      <BackToRoom onClick={onBack} />

      <motion.img
        src={skyImg}
        alt=""
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: cine }}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,28,0.15),rgba(6,11,28,0.55)_60%,rgba(6,11,28,0.9))]" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              "--dur": `${s.d}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="grain" />

      <div className="scroll-area absolute inset-0 flex flex-col items-center justify-center px-6 pb-12 pt-24 text-center">
        <motion.div {...fade(0.4)}>
          <Kicker>{facts.togetherDate.month}</Kicker>
        </motion.div>

        {/* The day. Given its full line height so the tail of the "5" never reaches the year below. */}
        <motion.div
          {...fade(0.7)}
          className="mt-1 font-display text-[132px] leading-[1.05] text-ivory md:text-[200px]"
        >
          {facts.togetherDate.day}
        </motion.div>

        {/* The year: bigger, brighter and clear of the numerals above. */}
        <motion.div
          {...fade(1)}
          className="mt-2 pl-[0.5em] font-mono text-[17px] tracking-[0.5em] text-ice/85 md:mt-3 md:text-[20px]"
        >
          {facts.togetherDate.year}
        </motion.div>

        <motion.p
          {...fade(1.6)}
          className="mt-10 max-w-[560px] text-balance font-display text-[22px] italic leading-[1.35] text-ivory/90 md:text-[27px]"
        >
          {september.lead}
        </motion.p>
        <motion.p {...fade(2.1)} className="mt-4 max-w-[520px] text-balance text-[14px] leading-[1.7] text-ivory/65 md:text-[15px]">
          {september.after}
        </motion.p>
        <motion.p {...fade(2.6)} className="mt-6 max-w-[520px] text-balance text-[15px] leading-[1.7] text-ivory/80 md:text-[16px]">
          {september.line}
        </motion.p>
        <motion.p {...fade(3.2)} className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/40">
          {september.small}
        </motion.p>
      </div>
    </motion.div>
  );
}
