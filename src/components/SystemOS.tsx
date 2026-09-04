import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { media, system } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Evidence, QuietButton, ScrollCue } from "./ui";

type Section = "profile" | "incident" | "marriage" | "media" | "locked";

const order: Section[] = ["profile", "incident", "marriage", "media", "locked"];

export function SystemOS({ onBack, onGoEnvelope }: { onBack: () => void; onGoEnvelope: () => void }) {
  const [section, setSection] = useState<Section>("profile");
  const [seen, setSeen] = useState<Section[]>(["profile"]);
  const [canScroll, setCanScroll] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      className="absolute inset-0 z-40 flex items-center justify-center bg-night/80 p-0 backdrop-blur-[2px] md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.9, ease: cine }}
    >
      <BackToRoom onClick={onBack} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: cine }}
        className="relative flex h-full w-full flex-col overflow-hidden border-ice/15 bg-[#07102a] text-ice shadow-[0_40px_120px_rgba(0,0,0,0.6)] md:h-[min(760px,92vh)] md:max-w-[1080px] md:rounded-[10px] md:border"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-ice/10 px-4 pt-[max(3.6rem,env(safe-area-inset-top))] pb-3 md:px-5 md:pt-3.5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-blue shadow-[0_0_12px_rgba(47,107,255,0.9)]" />
            <span className="font-mono text-[12px] tracking-[0.22em] text-ivory">{system.name}</span>
            <span className="hidden font-mono text-[11px] text-ice/40 md:inline">{system.build}</span>
          </div>
          <span className="font-mono text-[11px] text-ice/45">
            {system.status}
            <span className="blink ml-1 inline-block h-[11px] w-[6px] translate-y-[2px] bg-ice/60" />
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar / tabs */}
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-ice/10 px-2 py-2 font-mono text-[12px] md:w-[232px] md:flex-col md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-4">
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
                      "h-1.5 w-1.5 rounded-full",
                      isLocked ? "bg-gold/80" : wasSeen ? "bg-ice/35" : "bg-ice shadow-[0_0_8px_rgba(217,230,255,0.8)]"
                    )}
                  />
                  <span className="truncate">
                    {n.dir && <span className="text-ice/40">{n.dir}</span>}
                    {n.file}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="relative min-h-0 flex-1">
            <div
              ref={scrollRef}
              onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 24)}
              className="scroll-area h-full px-5 py-7 md:px-12 md:py-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.7, ease: cine }}
                  className="mx-auto max-w-[640px] pb-28"
                >
                  {section === "profile" && <Profile />}
                  {section === "incident" && <Incident />}
                  {section === "marriage" && <Marriage />}
                  {section === "media" && <MediaFiles />}
                  {section === "locked" && <Locked onGo={onGoEnvelope} />}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* soft bottom fade so it's obvious the page continues */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07102a] to-transparent" />
            <ScrollCue show={canScroll && !scrolled} className="absolute bottom-3 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Sections ---------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ice/45">{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-2 font-display text-[40px] leading-none text-ivory md:text-[52px]">{children}</h2>;
}

function Profile() {
  const p = system.profile;
  return (
    <div>
      <Kicker>profile.egg</Kicker>
      <Title>Egginaya.</Title>

      <dl className="mt-8 space-y-4">
        {p.rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 border-b border-ice/8 pb-4 md:grid-cols-[150px_1fr] md:gap-6">
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice/45">{k}</dt>
            <dd className="text-[15px] leading-[1.6] text-ivory/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <Kicker>diagnostics</Kicker>
      </div>
      <div className="mt-4 space-y-5">
        {p.diagnostics.map((d, i) => {
          const infinite = d.value === "∞";
          return (
            <div key={d.key}>
              <div className="flex items-baseline justify-between font-mono text-[12px]">
                <span className="text-ivory/85">{d.key}</span>
                {/* The infinity glyph is tiny in the mono font, so it borrows the display face and is sized to match the other numbers. */}
                <span
                  className={cn(
                    "text-ice",
                    infinite && "font-display text-[24px] font-semibold leading-none [transform:translateY(3px)] md:text-[26px]"
                  )}
                  aria-label={infinite ? "infinite" : undefined}
                >
                  {d.value}
                </span>
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ice/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(1.5, d.ratio * 100)}%` }}
                  transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: cine }}
                  className={cn("h-full rounded-full", d.ratio === 0 ? "bg-gold/80" : "bg-blue")}
                />
              </div>
              {d.note && <p className="mt-1.5 text-[12.5px] italic text-ice/55">{d.note}</p>}
            </div>
          );
        })}
      </div>
      <p className="mt-10 font-mono text-[11px] text-ice/40">{p.footer}</p>
    </div>
  );
}

function Incident() {
  const s = system.incident;
  return (
    <div>
      <Kicker>incidents / {s.id}</Kicker>
      <Title>{s.title}</Title>

      <dl className="mt-8 space-y-3">
        {[
          ["type", s.type],
          ["severity", s.severity],
          ["status", s.status],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 md:grid-cols-[150px_1fr] md:gap-6">
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice/45">{k}</dt>
            <dd className="text-[14.5px] text-ivory/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 space-y-2 rounded-[6px] border border-ice/10 bg-night/40 p-4 font-mono text-[12.5px] leading-[1.7] text-ivory/85">
        {s.summary.map((l) => (
          <div key={l} className="flex gap-3">
            <span className="text-blue">&gt;</span>
            <span>{l}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Kicker>notes</Kicker>
      </div>
      <ul className="mt-3 space-y-2 text-[14.5px] leading-[1.65] text-ivory/85">
        {s.notes.map((n) => (
          <li key={n} className="flex gap-3">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ice/50" />
            <span>{n}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Kicker>evidence</Kicker>
      </div>
      <Evidence
        src={media.mathsScreenshot}
        alt="Screenshot of the message: maths mam borrowed my maths period"
        caption={s.evidenceCaption}
        missing={s.evidenceMissing}
      />
    </div>
  );
}

function Marriage() {
  const m = system.marriage;
  return (
    <div>
      <Kicker>records / scanned document</Kicker>
      <div className="paper mt-4 rounded-[3px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:p-10">
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-night/50">certificate</div>
          <h3 className="mt-2 font-display text-[30px] leading-[1.05] tracking-wide text-night md:text-[40px]">{m.title}</h3>
          <div className="mx-auto mt-4 h-px w-24 bg-night/25" />
        </div>

        <p className="mt-6 text-center font-display text-[18px] italic text-night/80">
          between <span className="not-italic font-semibold text-night">{m.between[0]}</span> and{" "}
          <span className="not-italic font-semibold text-night">{m.between[1]}</span>
        </p>

        <dl className="mt-8 space-y-3">
          {m.fields.map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 gap-0.5 border-b border-dotted border-night/20 pb-2 md:grid-cols-[140px_1fr] md:gap-6">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-night/55">{k}</dt>
              <dd className="text-[14.5px] text-night/90">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.32em] text-night/50">how it happened</div>
        <div className="mt-3 space-y-3 text-[14.5px] leading-[1.7] text-night/85">
          {m.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.32em] text-night/50">terms &amp; conditions</div>
        <ul className="mt-3 space-y-2 text-[14px] leading-[1.65] text-night/85">
          {m.terms.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-mono text-[11px] text-night/45">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-2 gap-8">
          <div>
            <div className="font-display text-[22px] italic text-night/85">Abinaya</div>
            <div className="mt-1 h-px bg-night/30" />
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-night/50">her</div>
          </div>
          <div>
            <div className="font-display text-[22px] italic text-night/85">{m.between[1]}</div>
            <div className="mt-1 h-px bg-night/30" />
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-night/50">him</div>
          </div>
        </div>

        <p className="mt-8 text-[12px] italic leading-[1.6] text-night/55">{m.footnote}</p>
      </div>

      <div className="mt-10">
        <Kicker>attachment / the signed agreement</Kicker>
      </div>
      <Evidence
        src={media.marriageScreenshot}
        alt="Screenshot of the signed Instagram Marriage Association agreement"
        caption={m.evidenceCaption}
        missing={m.evidenceMissing}
      />
    </div>
  );
}

function MediaFiles() {
  return (
    <div>
      <Kicker>media / read only</Kicker>
      <Title>{system.mediaHeading}</Title>
      <ul className="mt-8 divide-y divide-ice/8">
        {system.mediaFiles.map((f, i) => (
          <motion.li
            key={f.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: cine }}
            className="py-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[12.5px]">
              <span className="text-ivory">
                <span className="text-ice/35">media/</span>
                {f.name}
              </span>
              <span className="text-[11px] text-ice/45">{f.meta}</span>
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-blue/80">{f.tag}</div>
            <p className="mt-2 max-w-[560px] font-display text-[17.5px] italic leading-[1.45] text-ivory/85 md:text-[19px]">{f.note}</p>
          </motion.li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-[11px] text-ice/40">{system.mediaFooter}</p>
    </div>
  );
}

function Locked({ onGo }: { onGo: () => void }) {
  return (
    <div className="flex min-h-[380px] flex-col items-start justify-center">
      <Kicker>encrypted</Kicker>
      <div className="mt-2 font-mono text-[18px] tracking-[0.06em] text-gold/90">{system.lockedFile.name}</div>
      <p className="mt-6 max-w-[440px] font-display text-[26px] italic leading-[1.3] text-ivory/90 md:text-[30px]">{system.lockedFile.line}</p>
      <QuietButton onClick={onGo} className="mt-8">
        {system.lockedFile.button}
      </QuietButton>
    </div>
  );
}
