import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  about,
  discoverable,
  envelopeRequires,
  envelopeWhisper,
  facts,
  finalMessage,
  hotspots,
  media,
  type HotspotId,
} from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Kicker, QuietButton, ScrollCue } from "./ui";

type Stage = "envelope" | "letter";

export function Letter({ unlocked, visited, onBack }: { unlocked: boolean; visited: HotspotId[]; onBack: () => void }) {
  const [stage, setStage] = useState<Stage>("envelope");
  const [opening, setOpening] = useState(false);
  useEscape(onBack);

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setStage("letter"), 1500);
  };

  if (!unlocked) return <LockedNotice visited={visited} onBack={onBack} />;

  return (
    <div className="absolute inset-0 overflow-hidden bg-night">
      <AnimatePresence mode="wait">
        {stage === "envelope" ? (
          <motion.div
            key="env"
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            transition={{ duration: 1, ease: cine }}
          >
            <BackToRoom onClick={onBack} />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_40%_at_50%_55%,rgba(47,107,255,0.28),transparent_70%)]" />
            <div className="grain" />
            <Envelope opening={opening} onOpen={open} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 font-display text-[20px] italic text-ivory/70 md:text-[24px]"
            >
              {envelopeWhisper.open}
            </motion.p>
          </motion.div>
        ) : (
          <LetterBody key="body" onBack={onBack} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Not yet ---------- */

function LockedNotice({ visited, onBack }: { visited: HotspotId[]; onBack: () => void }) {
  const total = envelopeRequires.length;
  const found = envelopeRequires.filter((id) => visited.includes(id)).length;
  const missing = envelopeRequires.filter((id) => !visited.includes(id));

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-night/85 px-5 backdrop-blur-[4px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={onBack}
    >
      <BackToRoom onClick={onBack} />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45%_40%_at_50%_50%,rgba(47,107,255,0.22),transparent_70%)]" />
      <div className="grain" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: cine }}
        className="scroll-area relative max-h-[88vh] w-full max-w-[460px] overflow-hidden rounded-[16px] border border-ice/12 bg-[linear-gradient(180deg,rgba(12,22,54,0.96),rgba(6,11,28,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(217,230,255,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* soft light from above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 [background:radial-gradient(60%_70%_at_50%_0%,rgba(47,107,255,0.28),transparent_70%)]" />

        <div className="relative px-7 pb-8 pt-9 text-center md:px-10 md:pb-10 md:pt-11">
          <SealedEnvelope />

          <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.34em] text-ice/45">
            sealed · {found}/{total} found
          </div>

          <p className="mt-3 text-balance font-display text-[28px] italic leading-[1.2] text-ivory md:text-[32px]">
            {envelopeWhisper.locked}.
          </p>
          <p className="mx-auto mt-3 max-w-[320px] text-[13.5px] leading-[1.7] text-ivory/60">
            There are still a few things in the room I want you to see first. The envelope opens once you've found all of them.
          </p>

          {/* progress */}
          <div className="mx-auto mt-6 h-[3px] w-full max-w-[280px] overflow-hidden rounded-full bg-ice/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, (found / total) * 100)}%` }}
              transition={{ duration: 1.2, delay: 0.5, ease: cine }}
              className="h-full rounded-full bg-[linear-gradient(90deg,#2f6bff,#8fb3ff)] shadow-[0_0_12px_rgba(47,107,255,0.7)]"
            />
          </div>

          {/* checklist */}
          <ul className="mx-auto mt-6 w-full max-w-[300px] space-y-1.5 text-left">
            {discoverable.map((id, i) => {
              const h = hotspots.find((x) => x.id === id);
              const done = visited.includes(id);
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.45 + i * 0.08, ease: cine }}
                  className={cn(
                    "flex items-center gap-3 rounded-[8px] border px-3.5 py-2.5 transition-colors",
                    done ? "border-ice/8 bg-ice/[0.03]" : "border-blue/30 bg-blue/[0.08]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      done ? "border-ice/30 bg-ice/20 text-ivory" : "border-ice/70 shadow-[0_0_10px_rgba(217,230,255,0.55)]"
                    )}
                  >
                    {done && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                        <path d="M2 6.2 4.8 9 10 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-[0.22em]",
                      done ? "text-ice/40 line-through decoration-ice/30" : "text-ivory/90"
                    )}
                  >
                    {h?.label ?? id}
                  </span>
                  <span className={cn("ml-auto font-display text-[13px] italic", done ? "text-ice/35" : "text-ice/70")}>
                    {done ? "seen" : "waiting"}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <QuietButton onClick={onBack} className="mt-8">
            {missing.length === 1 ? "one more to find" : "go look"}
          </QuietButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** A small sealed envelope for the locked notice. */
function SealedEnvelope() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: -4 }}
      animate={{ opacity: 1, y: 0, rotate: -4 }}
      transition={{ duration: 1.1, delay: 0.3, ease: cine }}
      className="relative mx-auto h-[96px] w-[148px]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[5px] bg-[linear-gradient(160deg,#2f6bff,#1b3fb8)] shadow-[0_22px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(47,107,255,0.25)]">
        <div className="absolute inset-0 [background:linear-gradient(135deg,transparent_49%,rgba(255,255,255,0.08)_50%,transparent_51%),linear-gradient(225deg,transparent_49%,rgba(255,255,255,0.08)_50%,transparent_51%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] [clip-path:polygon(0_100%,100%_100%,100%_0,50%_55%,0_0)] bg-[linear-gradient(180deg,#3f7bff,#2a5fe6)]" />
        <div className="absolute inset-x-0 top-0 h-[56%] [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[linear-gradient(180deg,#5a8dff,#2f6bff)]" />
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[7px] uppercase tracking-[0.35em] text-white/60">
          for Egginaya
        </div>
      </div>
      {/* wax seal */}
      <div className="seal-glow absolute left-1/2 top-[48%] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff0c2,#e8c98a_45%,#a8843f)] shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#6b4e14]" aria-hidden>
          <path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10Z" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ---------- The envelope ---------- */

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="open the envelope"
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: opening ? 0 : -3, scale: opening ? 1.06 : 1 }}
      transition={{ duration: 1.2, ease: cine }}
      className="relative h-[190px] w-[290px] cursor-pointer md:h-[230px] md:w-[350px]"
      style={{ perspective: 900 }}
    >
      {/* The letter inside */}
      <motion.div
        initial={false}
        animate={{ y: opening ? -120 : 0, opacity: opening ? 1 : 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: cine }}
        className="paper absolute inset-x-5 bottom-3 top-3 z-[1] rounded-[3px] px-5 py-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
      >
        <div className="font-display text-[20px] italic text-night/85">{finalMessage.greeting}</div>
        <div className="mt-3 space-y-1.5">
          <div className="h-[2px] w-[85%] bg-night/15" />
          <div className="h-[2px] w-[70%] bg-night/15" />
          <div className="h-[2px] w-[78%] bg-night/15" />
        </div>
      </motion.div>

      {/* Body */}
      <div className="absolute inset-0 z-[2] overflow-hidden rounded-[6px] bg-[linear-gradient(160deg,#2f6bff,#1b3fb8)] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 [background:linear-gradient(135deg,transparent_49%,rgba(255,255,255,0.08)_50%,transparent_51%),linear-gradient(225deg,transparent_49%,rgba(255,255,255,0.08)_50%,transparent_51%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] [clip-path:polygon(0_100%,100%_100%,100%_0,50%_55%,0_0)] bg-[linear-gradient(180deg,#3f7bff,#2a5fe6)]" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/70">
          for Egginaya
        </div>
      </div>

      {/* Flap */}
      <motion.div
        initial={false}
        animate={{ rotateX: opening ? -175 : 0 }}
        transition={{ duration: 1, ease: cine }}
        style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
        className={cn(
          "absolute inset-x-0 top-0 h-[58%] rounded-t-[6px] [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[linear-gradient(180deg,#5a8dff,#2f6bff)]",
          opening ? "z-[0]" : "z-[3]"
        )}
      >
        <div className="absolute left-1/2 top-[52%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/90 shadow-[0_2px_10px_rgba(0,0,0,0.35)]" />
      </motion.div>
    </motion.button>
  );
}

/* ---------- The letter ---------- */

function LetterBody({ onBack }: { onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const finalRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = finalRef.current;
    if (!el || !revealed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReachedEnd(true);
          io.disconnect();
        }
      },
      { root: scrollRef.current, threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  const reveal = () => {
    setRevealed(true);
    window.setTimeout(() => finalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <motion.div
      className="absolute inset-0 bg-night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: cine }}
    >
      <BackToRoom onClick={onBack} tone="light" />
      <div ref={scrollRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)} className="paper scroll-area absolute inset-0">
        <div className="mx-auto max-w-[640px] px-6 pb-[max(6rem,env(safe-area-inset-bottom))] pt-[max(6rem,env(safe-area-inset-top))] md:px-8 md:pt-28">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: cine }}>
            <Kicker className="text-night/50">{about.kicker}</Kicker>
            <h1 className="mt-3 font-display text-[44px] leading-[1] text-night md:text-[64px]">{about.intro}</h1>
            <p className="mt-4 text-[15px] italic text-night/60">{about.introSub}</p>
          </motion.div>

          <div className="mt-14 space-y-12">
            {about.items.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollRef, once: true, amount: 0.4 }}
                transition={{ duration: 1, delay: i === 0 ? 0.6 : 0.1, ease: cine }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-night/40">{String(i + 1).padStart(2, "0")}</div>
                <h2 className="mt-2 font-display text-[28px] leading-[1.15] text-night md:text-[34px]">{it.title}</h2>
                <p className="mt-3 text-[16px] leading-[1.75] text-night/80 md:text-[17px]">{it.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Reveal */}
          {!revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ root: scrollRef, once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-20 flex flex-col items-center gap-6 border-t border-night/10 pt-16 text-center"
            >
              <p className="font-display text-[22px] italic text-night/60">{about.continue}</p>
              <button
                type="button"
                onClick={reveal}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-night/25 px-7 font-mono text-[12px] uppercase tracking-[0.25em] text-night/80 transition-colors hover:border-night/60 hover:bg-night hover:text-ivory"
              >
                <span className="h-1 w-1 rounded-full bg-night/60 transition-all duration-500 group-hover:w-4 group-hover:bg-ivory" />
                open it
              </button>
            </motion.div>
          )}

          {/* Final message */}
          {revealed && (
            <div ref={finalRef} className="mt-24 border-t border-night/10 pt-16">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: cine }}>
                <Kicker className="text-night/50">
                  {facts.birthday.day} {facts.birthday.month} · you're {facts.age}
                </Kicker>
                <h2 className="mt-3 font-display text-[44px] leading-[1] text-night md:text-[60px]">{finalMessage.greeting}</h2>
              </motion.div>

              <div className="mt-10 space-y-6 text-[16.5px] leading-[1.8] text-night/85 md:text-[18px]">
                {finalMessage.paragraphs.map((p, i) => (
                  <motion.p
                    key={p}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.4 + i * 0.5, ease: cine }}
                  >
                    {p}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.4 + finalMessage.paragraphs.length * 0.5, ease: cine }}
                  className="font-display text-[26px] italic leading-[1.3] text-night md:text-[30px]"
                >
                  {finalMessage.closing}
                </motion.p>
              </div>

              {/* In his own words */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.9 + finalMessage.paragraphs.length * 0.5, ease: cine }}
                className="mt-14 rounded-[6px] border border-night/10 bg-white/40 px-6 py-8 md:px-9 md:py-10"
              >
                <Kicker className="text-night/45">in my own words</Kicker>
                <div className="mt-5 whitespace-pre-line text-[16.5px] leading-[1.8] text-night/90 md:text-[18px]">{finalMessage.personal}</div>
                <div className="mt-10 text-[16px] text-night/70">{finalMessage.signoff}</div>
                <div className="mt-1 font-display text-[26px] italic text-night/85">{finalMessage.signoff2}</div>
                <div className="mt-1 font-display text-[38px] leading-none text-night md:text-[44px]">{finalMessage.name}</div>
              </motion.div>

              <Song play={reachedEnd} />

              <p className="mt-16 text-center font-mono text-[10.5px] uppercase tracking-[0.3em] text-night/40">{finalMessage.end}</p>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="min-h-11 rounded-full border border-night/25 px-6 font-mono text-[11px] uppercase tracking-[0.25em] text-night/75 transition-colors hover:border-night/60 hover:bg-night hover:text-ivory"
                >
                  back to the room
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollCue show={!scrolled} tone="light" className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </motion.div>
  );
}

/* ---------- The song ---------- */

type SpotifyController = {
  play: () => void;
  destroy?: () => void;
  addListener: (event: string, cb: (e: { data?: { isPaused?: boolean } }) => void) => void;
};
type SpotifyIframeApi = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string | number; height: string | number },
    cb: (controller: SpotifyController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    __spotifyIframeApi?: SpotifyIframeApi;
  }
}

function loadSpotifyApi(): Promise<SpotifyIframeApi> {
  return new Promise((resolve) => {
    if (window.__spotifyIframeApi) return resolve(window.__spotifyIframeApi);
    const prev = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      prev?.(api);
      resolve(api);
    };
    if (!document.querySelector("script[data-spotify-iframe-api]")) {
      const s = document.createElement("script");
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      s.dataset.spotifyIframeApi = "1";
      document.body.appendChild(s);
    }
  });
}

function Song({ play }: { play: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const local = !!media.song;

  // Spotify embed (only when there is no local file)
  useEffect(() => {
    if (local) return;
    let cancelled = false;
    if (!hostRef.current) return;
    loadSpotifyApi().then((api) => {
      if (cancelled || !hostRef.current) return;
      const el = document.createElement("div");
      hostRef.current.appendChild(el);
      api.createController(el, { uri: `spotify:track:${media.spotifyTrackId}`, width: "100%", height: 152 }, (controller) => {
        controllerRef.current = controller;
        controller.addListener("ready", () => setReady(true));
        controller.addListener("playback_update", (e) => {
          if (e.data && e.data.isPaused === false) {
            setPlaying(true);
            setNeedsTap(false);
          }
        });
      });
    });
    return () => {
      cancelled = true;
      controllerRef.current?.destroy?.();
      controllerRef.current = null;
    };
  }, [local]);

  const start = useCallback(() => {
    if (local) {
      const a = audioRef.current;
      if (!a) return;
      a.volume = 0.9;
      a.play()
        .then(() => {
          setPlaying(true);
          setNeedsTap(false);
        })
        .catch(() => setNeedsTap(true));
      return;
    }
    controllerRef.current?.play();
    window.setTimeout(() => {
      if (!playingRef.current) setNeedsTap(true);
    }, 2500);
  }, [local]);

  useEffect(() => {
    if (!play || playing) return;
    if (local || ready) start();
  }, [play, ready, local, playing, start]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: play ? 1 : 0, y: play ? 0 : 12 }}
      transition={{ duration: 1.4, delay: 0.6, ease: cine }}
      className="mt-14"
    >
      <div className="flex items-baseline justify-between gap-4">
        <Kicker className="text-night/45">
          {media.songTitle} · {media.songArtist}
        </Kicker>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-night/40">{playing ? "playing" : needsTap ? "tap play" : "..."}</span>
      </div>
      <p className="mt-2 font-display text-[22px] italic text-night/80">{finalMessage.songLine}</p>

      {local ? (
        <div className="mt-4 flex items-center gap-4 rounded-[6px] border border-night/10 bg-night px-4 py-3">
          <button
            type="button"
            onClick={start}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-night"
            aria-label="play"
          >
            <span className="ml-0.5 inline-block border-y-[7px] border-l-[12px] border-y-transparent border-l-night" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-[12px] text-ivory">{media.songTitle}</div>
            <div className="font-mono text-[10.5px] text-ivory/50">{media.songArtist}</div>
          </div>
          <audio ref={audioRef} src={media.song} preload="auto" />
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[12px] bg-night/5">
          <div ref={hostRef} />
        </div>
      )}

      {needsTap && !playing && (
        <button
          type="button"
          onClick={start}
          className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-night/60 underline-offset-4 hover:underline"
        >
          {finalMessage.songTap}
        </button>
      )}
    </motion.div>
  );
}
