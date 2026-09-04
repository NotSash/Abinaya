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

type Stage = "sealed" | "opening" | "letter";

export function Letter({ unlocked, visited, onBack }: { unlocked: boolean; visited: HotspotId[]; onBack: () => void }) {
  const [stage, setStage] = useState<Stage>("sealed");
  useEscape(onBack);

  const open = () => {
    setStage("opening");
    window.setTimeout(() => setStage("letter"), 1700);
  };

  if (!unlocked) return <Locked visited={visited} onBack={onBack} />;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        {stage !== "letter" ? (
          <Sealed key="sealed" opening={stage === "opening"} onOpen={open} onBack={onBack} />
        ) : (
          <Paper key="paper" onBack={onBack} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The blue envelope                                                   */
/* ------------------------------------------------------------------ */

function Envelope({ size = 230, opening = false, golden = false }: { size?: number; opening?: boolean; golden?: boolean }) {
  const h = size * 0.66;
  // Siblings only, no nested stacking contexts:
  //   flap (behind everything once open) < letter < body < seal
  return (
    <div className="relative" style={{ width: size, height: h, perspective: 900 }}>
      {/* flap */}
      <motion.div
        className="envelope-flap"
        initial={false}
        animate={{ rotateX: opening ? -175 : 0 }}
        transition={{ duration: 0.9, ease: cine }}
        style={{ zIndex: opening ? 0 : 4 }}
      />

      {/* the letter inside, slides up out of the envelope when opened */}
      <motion.div
        className="paper absolute left-[7%] right-[7%] top-[8%] h-[84%] rounded-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        initial={false}
        animate={opening ? { y: -h * 0.72, opacity: 1 } : { y: 0, opacity: 0 }}
        transition={{ duration: 1.1, delay: opening ? 0.55 : 0, ease: cine }}
        style={{ zIndex: 1 }}
      >
        <div className="absolute left-[14%] right-[14%] top-[18%] space-y-[9%]">
          {[100, 82, 92, 60].map((w, i) => (
            <span key={i} className="block h-[2px] rounded-full bg-night/15" style={{ width: `${w}%` }} />
          ))}
        </div>
      </motion.div>

      {/* body */}
      <div className="envelope absolute inset-0" style={{ zIndex: 2 }}>
        <p
          className="absolute inset-x-0 bottom-[10%] text-center font-mono uppercase tracking-[0.4em] text-white/70"
          style={{ fontSize: Math.max(7, size * 0.038) }}
        >
          for {facts.nickname}
        </p>
      </div>

      {/* seal */}
      <motion.div
        className={cn(
          "seal absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
          golden
            ? "bg-[radial-gradient(circle_at_35%_30%,#fff0c2_0%,#e8c98a_45%,#a8843f_100%)]"
            : "bg-[radial-gradient(circle_at_35%_30%,#fff0c2_0%,#e8c98a_45%,#9a7a3a_100%)]"
        )}
        style={{ top: "58%", width: size * 0.16, height: size * 0.16, zIndex: 5 }}
        initial={false}
        animate={opening ? { scale: 0.6, opacity: 0, y: 20 } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: cine }}
      >
        <span className="text-[#7a5a1e]" style={{ fontSize: size * 0.075, lineHeight: 1 }}>
          ♥
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Not yet.                                                            */
/* Same vocabulary as the room: the envelope on the desk, the marks.   */
/* ------------------------------------------------------------------ */

function Locked({ visited, onBack }: { visited: HotspotId[]; onBack: () => void }) {
  const total = envelopeRequires.length;
  const found = envelopeRequires.filter((id) => visited.includes(id)).length;
  const missing = envelopeRequires.filter((id) => !visited.includes(id));

  return (
    <motion.div
      className="absolute inset-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
      onClick={onBack}
    >
      <div className="absolute inset-0 bg-night/45" />
      {/* a single soft light from above, like the lamp found it */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(42%_38%_at_50%_26%,rgba(90,140,255,0.28),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_70%_at_50%_50%,transparent_50%,rgba(6,11,28,0.7)_100%)]" />
      <div className="grain" />

      <BackToRoom onClick={onBack} />

      <div className="scroll-area absolute inset-0">
        <div
          className="mx-auto flex min-h-full max-w-[680px] flex-col items-center justify-center px-6 pb-16 pt-24 text-center md:pb-20"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.2, ease: cine }}>
            <div className="float">
              <Envelope size={220} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: cine }}
            className="mt-12"
          >
            <Kicker className="text-ice/60">
              sealed · {found}/{total} found
            </Kicker>
            <h2 className="mt-5 text-balance font-display text-[40px] italic leading-[1.05] text-ivory md:text-[54px]">
              {envelopeWhisper.locked}.
            </h2>
            <p className="mx-auto mt-6 max-w-[430px] text-[14.5px] leading-[1.75] text-ivory/60 md:text-[15px]">
              There are still a few things in the room I want you to see first. The envelope opens once you've found all of them.
            </p>
          </motion.div>

          {/* the five marks, exactly as they look in the room */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: cine }}
            className="mt-12 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 md:gap-x-9"
          >
            {discoverable.map((id) => {
              const h = hotspots.find((x) => x.id === id);
              const done = visited.includes(id);
              return (
                <li key={id} className={cn("relative flex w-[96px] flex-col items-center gap-3", done ? "mark-seen" : "hotspot")}>
                  <span className="relative block h-12 w-12">
                    <span className="mark-ring" />
                    <span className="mark-ring mark-ring-2" />
                    <span className="mark-dot" />
                  </span>
                  <span className={cn("font-mono text-[10px] uppercase tracking-[0.3em]", done ? "text-ice/50" : "text-ice")}>{h?.label ?? id}</span>
                  <span className={cn("-mt-1.5 font-display text-[14px] italic", done ? "text-ice/40" : "text-ivory/80")}>{done ? "seen" : "waiting"}</span>
                </li>
              );
            })}
          </motion.ul>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.4, ease: cine }} className="mt-14">
            <QuietButton onClick={onBack}>{missing.length === 1 ? "one more to find" : "go look"}</QuietButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Open me. finally.                                                   */
/* ------------------------------------------------------------------ */

function Sealed({ opening, onOpen, onBack }: { opening: boolean; onOpen: () => void; onBack: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1, ease: cine }}
    >
      <div className="absolute inset-0 bg-night/50" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(42%_38%_at_50%_30%,rgba(232,201,138,0.22),transparent_70%)]" />
      <div className="grain" />
      <BackToRoom onClick={onBack} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.button
          type="button"
          onClick={onOpen}
          disabled={opening}
          className="relative"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: opening ? 1.08 : 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: cine }}
          aria-label="open the envelope"
        >
          <div className={cn(!opening && "float")}>
            <Envelope size={260} opening={opening} golden />
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: opening ? 0 : 1, y: 0 }}
          transition={{ duration: 1.2, delay: opening ? 0 : 0.7, ease: cine }}
          className="mt-14"
        >
          <Kicker className="text-gold/80">for {facts.nickname}</Kicker>
          <h2 className="mt-4 font-display text-[40px] italic leading-[1.05] text-ivory md:text-[54px]">{envelopeWhisper.open}</h2>
          <QuietButton className="mt-10" onClick={onOpen}>
            open it
          </QuietButton>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The letter                                                          */
/* ------------------------------------------------------------------ */

function Paper({ onBack }: { onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  const reveal = useCallback(() => {
    setRevealed(true);
    window.setTimeout(() => finalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const el = finalRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReachedEnd(true);
          io.disconnect();
        }
      },
      { root, threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <motion.div
      className="absolute inset-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1.2, ease: cine }}
    >
      <BackToRoom onClick={onBack} dark />
      <div ref={scrollRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)} className="paper scroll-area absolute inset-0">
        <div className="mx-auto max-w-[640px] px-6 pb-[max(6rem,env(safe-area-inset-bottom))] pt-[max(6rem,env(safe-area-inset-top))] md:px-8 md:pt-28">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: cine }}>
            <Kicker className="text-night/50">{about.kicker}</Kicker>
            <h2 className="mt-3 font-display text-[44px] leading-[1] text-night md:text-[64px]">{about.intro}</h2>
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
                <p className="font-mono text-[10.5px] tracking-[0.35em] text-night/40">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-[28px] leading-[1.15] text-night md:text-[34px]">{it.title}</h3>
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
              <QuietButton dark onClick={reveal}>
                read it
              </QuietButton>
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
                <p className="hand mt-5 whitespace-pre-line text-[23px] leading-[1.4] text-night/90 md:text-[26px]">{finalMessage.personal}</p>
                <p className="hand mt-8 text-[22px] leading-[1.2] text-night/70">{finalMessage.signoff}</p>
                <p className="hand text-[22px] leading-[1.2] text-night/70">{finalMessage.signoff2}</p>
                <p className="hand mt-2 text-[34px] leading-[1.1] text-night">{finalMessage.name}</p>
              </motion.div>

              <Song play={reachedEnd} />

              <p className="mt-16 text-center font-mono text-[10.5px] uppercase tracking-[0.3em] text-night/40">{finalMessage.end}</p>
              <div className="mt-8 flex justify-center">
                <QuietButton dark onClick={onBack}>
                  back to the room
                </QuietButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollCue hidden={scrolled} dark />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Our song                                                            */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}
interface SpotifyController {
  play: () => void;
  togglePlay: () => void;
}
interface SpotifyIframeApi {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number; theme?: string },
    cb: (controller: SpotifyController) => void
  ) => void;
}

/** The Spotify API only announces itself once per page, so remember it for later mounts. */
let spotifyApi: SpotifyIframeApi | null = null;

function Song({ play }: { play: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [playing, setPlaying] = useState(false);

  // local file
  useEffect(() => {
    if (!media.song || !play) return;
    const a = audioRef.current;
    if (!a) return;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setNeedsTap(true));
  }, [play]);

  // spotify
  const holder = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    if (media.song) return;
    const el = holder.current;
    if (!el) return;
    const mount = (api: SpotifyIframeApi) => {
      spotifyApi = api;
      try {
        api.createController(
          el,
          { uri: `spotify:track:${media.spotifyTrackId}`, width: "100%", height: 152, theme: "dark" },
          (c) => {
            controller.current = c;
          }
        );
      } catch {
        setFallback(true);
      }
    };
    if (spotifyApi) {
      mount(spotifyApi);
      return;
    }
    window.onSpotifyIframeApiReady = mount;
    const existing = document.querySelector<HTMLScriptElement>("script[data-spotify-iframe-api]");
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      s.dataset.spotifyIframeApi = "1";
      s.onerror = () => setFallback(true);
      document.body.appendChild(s);
    }
    return () => {
      window.onSpotifyIframeApiReady = undefined;
    };
  }, []);

  useEffect(() => {
    if (media.song || !play) return;
    const t = window.setTimeout(() => controller.current?.play(), 600);
    return () => window.clearTimeout(t);
  }, [play]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.2, ease: cine }}
      className="mt-14"
    >
      <Kicker className="text-night/45">{finalMessage.songLine}</Kicker>
      <p className="mt-3 font-display text-[22px] text-night">
        {media.songTitle} <span className="text-night/50">· {media.songArtist}</span>
      </p>

      {media.song ? (
        <div className="mt-5 flex items-center gap-5">
          <audio ref={audioRef} src={media.song} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          <button
            type="button"
            onClick={() => {
              const a = audioRef.current;
              if (!a) return;
              if (a.paused) a.play().then(() => setNeedsTap(false)).catch(() => {});
              else a.pause();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-night/25 text-night transition-colors hover:bg-night/5"
            aria-label={playing ? "pause" : "play"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          {needsTap && !playing && <span className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-night/50">{finalMessage.songTap}</span>}
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-[12px]">
          {fallback ? (
            <iframe
              title="our song"
              src={`https://open.spotify.com/embed/track/${media.spotifyTrackId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <div className="min-h-[152px]">
              <div ref={holder} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
