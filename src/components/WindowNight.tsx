import { useMemo } from "react";
import { motion } from "motion/react";
import { facts, september } from "../content/egginaya";
import { skyImg } from "../lib/assets";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Kicker } from "./ui";

export function WindowNight({ onBack }: { onBack: () => void }) {
  useEscape(onBack);

  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 70,
        s: 1 + Math.random() * 1.6,
        d: 2.5 + Math.random() * 4,
        delay: -Math.random() * 6,
      })),
    []
  );

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, delay, ease: cine },
  });

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden bg-night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
    >
      <motion.img
        src={skyImg}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: cine }}
      />
      <div className="absolute inset-0 bg-night/30" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_50%_50%,transparent_40%,rgba(6,11,28,0.75)_100%)]" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            ["--dur" as string]: `${s.d}s`,
            ["--delay" as string]: `${s.delay}s`,
          }}
        />
      ))}
      <div className="grain" />

      <BackToRoom onClick={onBack} />

      <div className="scroll-area absolute inset-0">
        <div className="mx-auto flex min-h-full max-w-[720px] flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
          <motion.div {...reveal(0.3)}>
            <Kicker className="text-ice/70">{facts.togetherDate.month}</Kicker>
          </motion.div>

          {/* The day. Given its full line height so the tail of the "5" never reaches the year below. */}
          <motion.p
            {...reveal(0.6)}
            className="mt-2 font-display text-[150px] leading-[1] text-ivory [text-shadow:0_0_50px_rgba(217,230,255,0.35)] md:text-[210px]"
          >
            {facts.togetherDate.day}
          </motion.p>

          {/* The year: bigger, brighter and clear of the numerals above. */}
          <motion.p {...reveal(0.9)} className="mt-1 font-mono text-[15px] tracking-[0.5em] text-ice">
            {facts.togetherDate.year}
          </motion.p>

          <motion.p {...reveal(1.3)} className="mt-12 max-w-[600px] font-display text-[26px] italic leading-[1.3] text-ivory md:text-[32px]">
            {september.lead}
          </motion.p>
          <motion.p {...reveal(1.7)} className="mt-6 font-display text-[19px] text-ivory/75 md:text-[21px]">
            {september.after}
          </motion.p>
          <motion.p {...reveal(2.1)} className="mt-10 max-w-[560px] text-[15px] leading-[1.8] text-ivory/70 md:text-[16px]">
            {september.line}
          </motion.p>
          <motion.p {...reveal(2.6)} className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.35em] text-ice/50">
            {september.small}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
