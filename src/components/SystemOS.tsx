import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { media, system } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Evidence, Kicker, QuietButton, ScrollCue } from "./ui";

type Section = keyof typeof system.nav;
const order: Section[] = ["profile", "incident", "marriage", "media", "locked"];

export function SystemOS({ onBack, onGoEnvelope }: { onBack: () => void; onGoEnvelope: () => void }) {
  const [section, setSection] = useState<Section>("profile");
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEscape(onBack);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setScrolled(false);
  }, [section]);

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-night text-ivory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
    >
      {/* faint screen glow */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_30%_20%,rgba(47,107,255,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(180deg,transparent_0_2px,rgba(255,255,255,0.35)_2px_3px)]" />

      <BackToRoom onClick={onBack} />

      {/* system header, top right */}
      <div className="pointer-events-none absolute right-6 top-5 z-30 hidden text-right font-mono text-[10.5px] uppercase tracking-[0.3em] text-ice/45 md:right-8 md:top-7 md:block">
        <p className="text-ice/70">{system.name}</p>
        <p className="mt-1">{system.build}</p>
        <p className="mt-1 text-blue">{system.status}</p>
      </div>

      <div className="absolute inset-0 flex flex-col pt-[max(4.5rem,env(safe-area-inset-top))] md:flex-row md:pt-0">
        {/* nav */}
        <nav className="relative z-20 shrink-0 border-b border-ice/10 md:w-[260px] md:border-b-0 md:border-r md:pt-28">
          <ul className="flex gap-1 overflow-x-auto px-4 pb-3 md:flex-col md:gap-0 md:px-0 md:pb-0">
            {order.map((key) => {
              const item = system.nav[key];
              const on = section === key;
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setSection(key)}
                    className={cn(
                      "group relative flex w-full items-baseline gap-0 whitespace-nowrap rounded-full px-4 py-2 text-left font-mono text-[12px] transition-colors md:rounded-none md:px-8 md:py-3",
                      on ? "bg-ice/10 text-ivory md:bg-transparent" : "text-ice/50 hover:text-ice/85"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 hidden h-5 w-[2px] -translate-y-1/2 bg-blue transition-opacity md:block",
                        on ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-ice/40">{item.dir}</span>
                    <span>{item.file}</span>
                    {key === "locked" && <span className="ml-2 text-[10px] text-gold/70">●</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* content */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)}
            className="scroll-area absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, ease: cine }}
                className="mx-auto max-w-[820px] px-6 pb-[max(6rem,env(safe-area-inset-bottom))] pt-8 md:px-12 md:pt-28"
              >
                {section === "profile" && <Profile />}
                {section === "incident" && <Incident />}
                {section === "marriage" && <Marriage />}
                {section === "media" && <MediaFiles />}
                {section === "locked" && <Locked onGo={onGoEnvelope} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <ScrollCue hidden={scrolled || section === "locked"} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-4 font-display text-[44px] leading-[1.02] text-ivory md:text-[64px]">{title}</h2>
    </>
  );
}

function Profile() {
  const p = system.profile;
  return (
    <div>
      <Heading kicker="profile.egg / subject file" title="Egginaya." />

      <dl className="mt-12 divide-y divide-ice/10 border-y border-ice/10">
        {p.rows.map(([k, v]) => (
          <div key={k} className="grid gap-2 py-5 md:grid-cols-[170px_1fr] md:gap-8">
            <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ice/45">{k}</dt>
            <dd className="font-display text-[19px] leading-[1.45] text-ivory/90 md:text-[21px]">{v}</dd>
          </div>
        ))}
      </dl>

      <Kicker className="mt-16">diagnostics</Kicker>
      <ul className="mt-6 space-y-7">
        {p.diagnostics.map((d) => (
          <li key={d.key}>
            <div className="flex items-baseline justify-between font-mono text-[12px]">
              <span className="text-ivory/90">{d.key}</span>
              <span className="text-ice/70">{d.value}</span>
            </div>
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ice/10">
              <motion.div
                className="h-full rounded-full bg-blue shadow-[0_0_12px_rgba(47,107,255,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, d.ratio) * 100}%` }}
                transition={{ duration: 1.6, delay: 0.3, ease: cine }}
              />
            </div>
            <p className="mt-2 font-display text-[16px] italic text-ivory/55">{d.note}</p>
          </li>
        ))}
      </ul>

      <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.3em] text-ice/40">{p.footer}</p>
    </div>
  );
}

function Incident() {
  const inc = system.incident;
  return (
    <div>
      <Heading kicker={`incidents / ${inc.id}`} title={inc.title} />

      <dl className="mt-10 grid gap-x-8 gap-y-4 font-mono text-[12px] md:grid-cols-2">
        {[
          ["type", inc.type],
          ["severity", inc.severity],
          ["status", inc.status],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1">
            <dt className="text-[10.5px] uppercase tracking-[0.3em] text-ice/45">{k}</dt>
            <dd className="text-ivory/85">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 rounded-[6px] border border-ice/15 bg-deep/60 p-5 font-mono text-[12.5px] leading-[1.9] text-ice/85 md:p-6">
        {inc.summary.map((l, i) => (
          <p key={i}>
            <span className="mr-3 text-ice/35">{String(i + 1).padStart(2, "0")}</span>
            {l}
          </p>
        ))}
      </div>

      <Kicker className="mt-12">notes</Kicker>
      <ul className="mt-5 space-y-4">
        {inc.notes.map((n) => (
          <li key={n} className="flex gap-4 font-display text-[19px] leading-[1.5] text-ivory/85">
            <span className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-blue" />
            {n}
          </li>
        ))}
      </ul>

      <Kicker className="mt-14">evidence</Kicker>
      <p className="mb-5 mt-3 font-display text-[18px] italic text-ivory/70">{inc.evidenceCaption}</p>
      <Evidence src={media.mathsScreenshot} alt="The maths period message" missing={inc.evidenceMissing} />
    </div>
  );
}

function Marriage() {
  const m = system.marriage;
  return (
    <div>
      <Heading kicker="records / marriage.cert" title="Filed. Signed. Binding." />

      <div className="relative mt-12 rounded-[4px] border border-gold/35 p-6 md:p-10">
        <div className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-gold/20" />
        <div className="text-center">
          <Kicker className="text-gold/70">certificate</Kicker>
          <h3 className="mt-4 font-display text-[30px] leading-[1.05] tracking-[0.08em] text-ivory md:text-[40px]">{m.title}</h3>
          <p className="mt-5 font-display text-[19px] italic text-ivory/75">
            between {m.between[0]} and{" "}
            <span className="whitespace-nowrap">{m.between[1]}</span>
          </p>
        </div>

        <dl className="mt-10 divide-y divide-ice/10 border-y border-ice/10">
          {m.fields.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 md:grid-cols-[160px_1fr] md:gap-6">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-ice/45">{k}</dt>
              <dd className="font-display text-[18px] leading-[1.45] text-ivory/90">{v}</dd>
            </div>
          ))}
        </dl>

        <Kicker className="mt-12 text-gold/70">how it happened</Kicker>
        <div className="mt-5 space-y-5 font-display text-[19px] leading-[1.6] text-ivory/88 md:text-[20px]">
          {m.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <Kicker className="mt-12 text-gold/70">terms &amp; conditions</Kicker>
        <ol className="mt-5 space-y-4">
          {m.terms.map((t, i) => (
            <li key={t} className="grid grid-cols-[36px_1fr] gap-2 font-display text-[18px] leading-[1.5] text-ivory/85">
              <span className="font-mono text-[11px] text-ice/40">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="hand text-[34px] leading-none text-ivory">Abinaya</p>
            <div className="mx-auto mt-3 h-px w-3/4 bg-ice/25" />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/45">her</p>
          </div>
          <div className="text-center">
            <p className="hand text-[34px] leading-none text-ivory">{m.between[1]}</p>
            <div className="mx-auto mt-3 h-px w-3/4 bg-ice/25" />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/45">him</p>
          </div>
        </div>

        <p className="mt-12 text-center font-display text-[15px] italic text-ivory/55">{m.footnote}</p>
      </div>

      <Kicker className="mt-14">attachment / the signed agreement</Kicker>
      <p className="mb-5 mt-3 font-display text-[18px] italic text-ivory/70">{m.evidenceCaption}</p>
      <Evidence src={media.marriageScreenshot} alt="The signed Instagram Marriage Association message" missing={m.evidenceMissing} />
    </div>
  );
}

function MediaFiles() {
  return (
    <div>
      <Heading kicker="media / read only" title={system.mediaHeading} />
      <ul className="mt-12 divide-y divide-ice/10 border-t border-ice/10">
        {system.mediaFiles.map((f) => (
          <li key={f.name} className="py-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-mono text-[13px]">
                <span className="text-ice/40">media/</span>
                <span className="text-ivory">{f.name}</span>
              </p>
              <p className="font-mono text-[11.5px] text-ice/45">{f.meta}</p>
            </div>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-blue">{f.tag}</p>
            <p className="mt-4 max-w-[700px] font-display text-[20px] italic leading-[1.5] text-ivory/90 md:text-[21px]">{f.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-ice/40">{system.mediaFooter}</p>
    </div>
  );
}

function Locked({ onGo }: { onGo: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center">
      <Kicker className="text-gold/70">encrypted</Kicker>
      <p className="mt-4 font-mono text-[16px] text-ivory">
        <span className="text-ice/40">~/</span>
        {system.lockedFile.name}
      </p>
      <p className="mt-8 max-w-[520px] font-display text-[30px] italic leading-[1.25] text-ivory/90 md:text-[38px]">{system.lockedFile.line}</p>
      <QuietButton className="mt-10" onClick={onGo}>
        {system.lockedFile.button}
      </QuietButton>
    </div>
  );
}
