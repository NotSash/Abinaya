import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy, eggLines, envelopeRequires, type HotspotId } from "./content/egginaya";
import { cine, useVisited } from "./lib/hooks";
import { World } from "./components/World";
import { SystemOS } from "./components/SystemOS";
import { Archive } from "./components/Archive";
import { WindowNight } from "./components/WindowNight";
import { LunchBox } from "./components/LunchBox";
import { Letter } from "./components/Letter";
import { QuietButton } from "./components/ui";
import { textureVars } from "./lib/textures";

type Scene = "arrival" | "world" | HotspotId;

export default function App() {
  const [scene, setScene] = useState<Scene>("arrival");
  const [lastFocus, setLastFocus] = useState<HotspotId | null>(null);
  const { visited, mark } = useVisited();
  const reduce = useReducedMotion();

  // The egg
  const [eggCount, setEggCount] = useState(0);
  const [eggLine, setEggLine] = useState<string | null>(null);
  const eggTimer = useRef(0);

  const envelopeUnlocked = useMemo(() => envelopeRequires.every((id) => visited.includes(id)), [visited]);

  const open = useCallback(
    (id: HotspotId) => {
      if (id === "egg") {
        const n = eggCount + 1;
        setEggCount(n);
        const line = eggLines[Math.min(n, eggLines.length) - 1];
        setEggLine(line);
        window.clearTimeout(eggTimer.current);
        eggTimer.current = window.setTimeout(() => setEggLine(null), n >= eggLines.length ? 4000 : 2200);
        if (n >= eggLines.length) mark("egg");
        return;
      }
      setLastFocus(id);
      setScene(id);
      mark(id);
    },
    [eggCount, mark]
  );

  const back = useCallback(() => setScene("world"), []);

  useEffect(() => () => window.clearTimeout(eggTimer.current), []);

  const phase = scene === "arrival" ? "arrival" : scene === "world" ? "world" : "focused";
  const focus = phase === "focused" ? (scene as HotspotId) : lastFocus;

  return (
    <main className="relative h-full w-full overflow-hidden bg-night text-ivory" style={textureVars}>
      <World phase={phase} focus={focus} visited={visited} envelopeUnlocked={envelopeUnlocked} eggLine={eggLine} onOpen={open} />
      <span className="sr-only" aria-live="polite">
        {eggLine ?? ""}
      </span>

      {/* Arrival: one line, one door. */}
      <AnimatePresence>
        {scene === "arrival" && (
          <motion.div
            key="arrival"
            className="absolute inset-0 z-30 flex items-center justify-center px-8"
            exit={{ opacity: 0, transition: { duration: 0.9, ease: cine } }}
          >
            <div className="max-w-[560px] text-center">
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 1.6, delay: reduce ? 0 : 0.6, ease: cine }}
                className="text-balance font-display text-[36px] leading-[1.1] text-ivory md:text-[52px]"
              >
                {copy.arrival.line}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 1.9, ease: cine }}
                className="mt-5 text-[14px] tracking-wide text-ivory/50 md:text-[15px]"
              >
                {copy.arrival.sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 2.8, ease: cine }}
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

      {/* Object scenes. Each one grows out of the place the camera pushed into. */}
      <AnimatePresence>
        {scene === "system" && <SystemOS key="system" onBack={back} onGoToEnvelope={() => open("envelope")} />}
        {scene === "archive" && <Archive key="archive" onBack={back} />}
        {scene === "window" && <WindowNight key="window" onBack={back} />}
        {scene === "lunch" && <LunchBox key="lunch" onBack={back} />}
        {scene === "envelope" && (
          <motion.div key="envelope" className="absolute inset-0 z-40" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <Letter unlocked={envelopeUnlocked} visited={visited} onBack={back} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
