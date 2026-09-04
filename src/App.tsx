import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy, envelopeRequires, type HotspotId } from "./content/egginaya";
import { cine, useVisited } from "./lib/hooks";
import { textureVars } from "./lib/textures";
import { World } from "./components/World";
import { SystemOS } from "./components/SystemOS";
import { Archive } from "./components/Archive";
import { WindowNight } from "./components/WindowNight";
import { LunchBox } from "./components/LunchBox";
import { Letter } from "./components/Letter";
import { QuietButton } from "./components/ui";

type Scene = "arrival" | "world";

export default function App() {
  const [scene, setScene] = useState<Scene>("arrival");
  const [open, setOpen] = useState<HotspotId | null>(null);
  const { visited, mark } = useVisited();
  const reduce = useReducedMotion();

  const envelopeUnlocked = useMemo(() => envelopeRequires.every((id) => visited.includes(id)), [visited]);

  const openPlace = useCallback(
    (id: HotspotId) => {
      if (id === "egg") return;
      setOpen(id);
      if (id !== "envelope") mark(id);
    },
    [mark]
  );

  const back = useCallback(() => setOpen(null), []);

  const goEnvelope = useCallback(() => {
    setOpen(null);
    window.setTimeout(() => setOpen("envelope"), 700);
  }, []);

  // Keep the page from ever scrolling itself; scenes manage their own scroll areas.
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-night text-ivory" style={textureVars}>
      {/* The room is always there underneath. */}
      {scene === "world" && <World visited={visited} envelopeUnlocked={envelopeUnlocked} active={open === null} onOpen={openPlace} />}

      {/* Scenes that open on top */}
      <AnimatePresence>
        {open === "system" && <SystemOS key="system" onBack={back} onGoEnvelope={goEnvelope} />}
        {open === "archive" && <Archive key="archive" onBack={back} />}
        {open === "window" && <WindowNight key="window" onBack={back} />}
        {open === "lunch" && <LunchBox key="lunch" onBack={back} />}
        {open === "envelope" && (
          <motion.div
            key="envelope"
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1, ease: cine }}
          >
            <Letter unlocked={envelopeUnlocked} visited={visited} onBack={back} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrival */}
      <AnimatePresence>
        {scene === "arrival" && (
          <motion.div
            key="arrival"
            className="absolute inset-0 z-30 flex items-center justify-center bg-night px-8"
            exit={{ opacity: 0, transition: { duration: 1.4, ease: cine } }}
          >
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_40%_at_50%_60%,rgba(31,60,138,0.35),transparent_70%)]" />
            <div className="grain" />
            <div className="relative max-w-[560px] text-center">
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 1.6, delay: 0.6, ease: cine }}
                className="text-balance font-display text-[36px] leading-[1.1] text-ivory md:text-[52px]"
              >
                {copy.arrival.line}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.4, delay: 1.9, ease: cine }}
                className="mt-5 text-[14px] tracking-wide text-ivory/50 md:text-[15px]"
              >
                {copy.arrival.sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.2, delay: 2.8, ease: cine }}
                className="mt-12"
              >
                <QuietButton onClick={() => setScene("world")} autoFocus>
                  {copy.arrival.button}
                </QuietButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
