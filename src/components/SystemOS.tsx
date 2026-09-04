import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { media, system } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Placeholder, QuietButton, ScrollCue } from "./ui";

type Section = "profile" | "suthiyama" | "marriage" | "media" | "locked";

const order: Section[] = ["profile", "suthiyama", "marriage", "media", "locked"];

export function SystemOS({ onBack, onGoEnvelope }: { onBack: () => void; onGoEnvelope: () => void }) {
  const [section, setSection] = useState<Section>("profile");
  const [seen, setSeen] = useState<Section[]>(["profile"]);
  const [canScroll, setCanScroll] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEscape(onBack);

  const go = (s: Section) => {
    setSection(s);
    setSeen((p) => (p.includes(s) ? p : [...p, s]));
  };

  // Reset scroll per section and work out whether there is more below.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setScrolled(false);
    const check = () => setCanScroll(el.scrollHeight - el.clientHeight > 40);
    const t = window.setTimeout(check, 600);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [section]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-night/70 p-3 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
      transition={{ duration: 1, delay: 0.4, ease: cine }}
    >
      <BackToRoom onClick={onBack} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.7, ease: cine }}
        className="screen relative mt-10 flex h-[min(88dvh,760px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-[10px] md:mt-0"
      >
        {/* Title bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-blue/15 px-4 md:px-6">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em]">
            <span className="inline-block h-2 w-2 rounded-full bg-blue shadow-[0_0_10px_rgba(127,163,232,0.9)]" />
            <span className="text-ice/90">{system.name}</span>
            <span className="hidden text-ice/45 sm:inline">{system.build}</span>
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-ice/45">{system.status}</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar / tabs */}
          <nav
            aria-label="System files"
            className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-blue/15 px-2 py-2 md:w-[268px] md:flex-col md:gap-0 md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-5"
          >
            {order.map((s) => {
              const n = system.nav[s];
              const isActive = s === section;
              const wasSeen = seen.includes(s);
              const isLocked = s === "locked";
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => go(s)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "grid min-h-11 shrink-0 grid-cols-[14px_minmax(0,1fr)] items-center gap-x-2.5 rounded-[4px] px-2.5 text-left transition-colors md:w-full",
                    isActive ? "bg-blue/10 text-ivory" : "text-ivory/65 hover:bg-blue/6 hover:text-ivory"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 justify-self-center rounded-full",
                      isLocked
                        ? "bg-lamp/80 shadow-[0_0_8px_rgba(240,183,122,0.7)]"
                        : isActive
                          ? "bg-ice shadow-[0_0_8px_rgba(217,230,255,0.8)]"
                          : wasSeen
                            ? "bg-blue/70"
                            : "bg-ice/35"
                    )}
                  />
                  <span className="truncate font-mono text-[13px] tracking-[0.02em]">
                    {n.dir && <span className="text-ice/45">{n.dir}</span>}
                    <span>{n.file}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="relative min-h-0 flex-1">
            <div ref={scrollRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 24)} className="scroll-area h-full px-5 py-7 md:px-12 md:py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.7, ease: cine }}
                  className="mx-auto max-w-[760px]"
                >
                  {section === "profile" && <Profile />}
                  {section === "suthiyama" && <Suthiyama />}
                  {section === "marriage" && <Marriage />}
                  {section === "media" && <MediaFiles />}
                  {section === "locked" && <Locked onGo={onGoEnvelope} />}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* soft bottom fade so it's obvious the page continues */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(8,16,40,0.9))] transition-opacity duration-700",
                canScroll && !scrolled ? "opacity-100" : "opacity-0"
              )}
            />
            <ScrollCue show={canScroll && !scrolled} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Sections ---------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">{children}</p>;
}

function Profile() {
  const p = system.profile;
  return (
    <div>
      <h2 className="font-display text-[52px] leading-none text-ivory md:text-[64px]">
        Egginaya<span className="text-blue">.</span>
      </h2>
      <Kicker>profile.egg</Kicker>

      <dl className="mt-10 grid grid-cols-1 gap-y-4 sm:grid-cols-[170px_1fr] sm:gap-x-8 sm:gap-y-5">
        {p.rows.map(([k, v]) => (
          <div className="contents" key={k}>
            <dt className="font-mono text-[11px] tracking-[0.12em] text-ice/45 sm:pt-1.5">{k}</dt>
            <dd className="font-display text-[21px] leading-snug text-ivory/92">{v}</dd>
          </div>
        ))}
      </dl>

      <Kicker>
        <span className="mt-14 block">diagnostics</span>
      </Kicker>
      <ul className="mt-6 space-y-7">
        {p.diagnostics.map((d, i) => (
          <li key={d.key}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[22px] text-ivory">{d.key}</span>
              <span className="font-mono text-[12px] text-ice/80">{d.value}</span>
            </div>
            <motion.div
              className="bar mt-2.5"
              initial={{ ["--v" as string]: 0 }}
              animate={{ ["--v" as string]: d.ratio }}
              transition={{ duration: 1.4, delay: 0.4 + i * 0.12, ease: cine }}
            >
              <i />
            </motion.div>
            {d.note && <p className="mt-2 font-display text-[15px] italic text-ice/55">{d.note}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-12 font-mono text-[11px] text-ice/40">{p.footer}</p>
    </div>
  );
}

function Suthiyama() {
  const s = system.suthiyama;
  return (
    <div>
      <Kicker>incidents / {s.id}</Kicker>
      <h2 className="mt-3 font-display text-[44px] leading-none text-ivory md:text-[56px]">suthiyama.</h2>

      <dl className="mt-9 grid grid-cols-1 gap-y-3 sm:grid-cols-[120px_1fr] sm:gap-x-8 sm:gap-y-4">
        {[
          ["type", s.type],
          ["severity", s.severity],
          ["status", s.status],
        ].map(([k, v]) => (
          <div className="contents" key={k}>
            <dt className="font-mono text-[11px] tracking-[0.12em] text-ice/45 sm:pt-1">{k}</dt>
            <dd className="font-display text-[19px] leading-snug text-ivory/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 border-l border-blue/30 pl-5">
        {s.summary.map((l) => (
          <p key={l} className="font-mono text-[13px] leading-[1.9] text-ice/85">
            <span className="text-ice/35">&gt; </span>
            {l}
          </p>
        ))}
      </div>

      <Kicker>
        <span className="mt-10 block">notes</span>
      </Kicker>
      <ul className="mt-3 space-y-2">
        {s.notes.map((n) => (
          <li key={n} className="font-display text-[19px] leading-snug text-ivory/85">
            {n}
          </li>
        ))}
      </ul>

      <Kicker>
        <span className="mt-10 block">evidence</span>
      </Kicker>
      <div className="mt-3 overflow-hidden rounded-[4px] border border-blue/20 bg-navy/60">
        {media.suthiyamaScreenshot ? (
          <img src={media.suthiyamaScreenshot} alt="The message" className="block w-full" />
        ) : (
          <div className="flex aspect-[16/8] items-center justify-center p-6">
            <Placeholder>{s.evidenceCaption}</Placeholder>
          </div>
        )}
      </div>
    </div>
  );
}

function Marriage() {
  const m = system.marriage;
  return (
    <div>
      <Kicker>records / scanned document</Kicker>
      <div style={{ transform: "rotate(-0.6deg)" }} className="paper mt-4 rounded-[2px] px-6 py-8 md:px-12 md:py-12">
        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] text-navy/50">certificate</p>
          <h2 className="mt-3 font-display text-[34px] leading-[1.02] text-navy md:text-[44px]">{m.title}</h2>
          <div className="mx-auto mt-6 h-px w-16 bg-navy/25" />
          <p className="mt-6 font-display text-[17px] italic text-navy/70">this is to record that</p>
          <p className="mt-2 font-display text-[26px] leading-tight text-navy">{m.between[0]}</p>
          <p className="font-display text-[17px] italic text-navy/70">and</p>
          <p className="font-display text-[26px] leading-tight text-navy">
            <Placeholder tone="dark">{m.between[1]}</Placeholder>
          </p>
          <p className="mt-5 font-display text-[18px] leading-snug text-navy/85">are, as far as the two of them are concerned, married.</p>
        </div>

        <dl className="mx-auto mt-9 grid max-w-[440px] grid-cols-[110px_1fr] gap-x-5 gap-y-2.5 text-left md:grid-cols-[130px_1fr]">
          {m.fields.map(([k, v]) => (
            <div className="contents" key={k}>
              <dt className="font-mono text-[10px] tracking-[0.15em] text-navy/50">{k}</dt>
              <dd className="font-display text-[17px] leading-snug text-navy/90">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto mt-8 max-w-[440px]">
          <p className="font-mono text-[10px] tracking-[0.15em] text-navy/50">terms</p>
          <p className="mt-2 font-display text-[18px] leading-snug text-navy/85">
            <Placeholder tone="dark">{m.terms}</Placeholder>
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[440px] items-end justify-between gap-6">
          <div className="flex-1">
            <div className="h-px bg-navy/40" />
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-navy/45">her</p>
          </div>
          <div className="flex-1">
            <div className="h-px bg-navy/40" />
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-navy/45">him</p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[440px] text-center font-display text-[14px] italic leading-snug text-navy/55">{m.footnote}</p>
      </div>
    </div>
  );
}

function MediaFiles() {
  return (
    <div>
      <Kicker>media / read only</Kicker>
      <h2 className="mt-3 font-display text-[44px] leading-none text-ivory md:text-[56px]">{system.mediaHeading}</h2>
      <ul className="mt-9 divide-y divide-blue/12 border-y border-blue/12">
        {system.mediaFiles.map((f) => (
          <li key={f.name} className="flex items-baseline justify-between gap-4 py-3.5">
            <span className="font-mono text-[13px] text-ice/90">{f.name}</span>
            <span className="text-right font-display text-[16px] italic text-ice/55">
              {f.meta}
              {f.note && <span className="text-ice/35"> · {f.note}</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[11px] text-ice/40">{system.mediaFooter}</p>
    </div>
  );
}

function Locked({ onGo }: { onGo: () => void }) {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center">
      <Kicker>{system.lockedFile.name}</Kicker>
      <h2 className="mt-3 font-display text-[40px] leading-[1.05] text-ivory md:text-[52px]">{system.lockedFile.line}</h2>
      <div className="mt-8">
        <QuietButton onClick={onGo}>{system.lockedFile.button}</QuietButton>
      </div>
    </div>
  );
}
