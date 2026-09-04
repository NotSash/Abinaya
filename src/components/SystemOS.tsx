import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { media, system } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Placeholder } from "./ui";

type FileId = "profile" | "suthiyama" | "marriage" | "media" | "locked";

const files: { id: FileId; path: string; name: string }[] = [
  { id: "profile", path: "", name: "profile.egg" },
  { id: "suthiyama", path: "incidents/", name: "suthiyama.log" },
  { id: "marriage", path: "records/", name: "OUR SECRET MARRIAGE" },
  { id: "media", path: "media/", name: "8 files" },
  { id: "locked", path: "", name: system.lockedFile.name },
];

export function SystemOS({ onBack, onGoToEnvelope }: { onBack: () => void; onGoToEnvelope: () => void }) {
  const [file, setFile] = useState<FileId>("profile");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onBack();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center p-3 pt-[4.5rem] sm:items-center sm:p-6 sm:pt-20 md:p-10 md:pt-24">
      <BackToRoom onClick={onBack} />

      <motion.section
        role="dialog"
        aria-label="Egginaya System"
        initial={{ opacity: 0, scale: 0.62, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 30, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
        transition={{ duration: 1.2, delay: 0.35, ease: cine }}
        className="screen relative flex h-full max-h-[760px] w-full max-w-[1040px] flex-col overflow-hidden rounded-[6px] text-ice"
      >
        {/* Title bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-blue/15 px-4 font-mono text-[11px] tracking-[0.08em] text-ice/70 md:px-5">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue/80 shadow-[0_0_10px_rgba(127,163,232,0.8)]" />
            <span className="text-ice">{system.name}</span>
            <span className="hidden text-ice/45 sm:inline">{system.build}</span>
          </div>
          <span className="text-ice/45">{booted ? "running" : "waking"}</span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Files */}
          <nav
            aria-label="Files"
            className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-blue/15 px-2 py-2 md:w-[230px] md:flex-col md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-4"
          >
            {files.map((f) => {
              const active = f.id === file;
              const locked = f.id === "locked";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFile(f.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-2 rounded-[3px] px-3 text-left font-mono text-[12px] transition-colors duration-300 md:min-h-10",
                    active ? "bg-blue/15 text-ice" : "text-ice/60 hover:bg-blue/8 hover:text-ice/90",
                    locked && !active && "text-ice/40"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", locked ? "bg-lamp/70" : active ? "bg-blue" : "bg-ice/30")} />
                  <span className="whitespace-nowrap">
                    {f.path && <span className="text-ice/35">{f.path}</span>}
                    {f.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Pane */}
          <div className="scroll-area relative min-h-0 flex-1 px-5 py-6 md:px-10 md:py-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={file}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: cine }}
                className="mx-auto max-w-[620px]"
              >
                {file === "profile" && <Profile booted={booted} />}
                {file === "suthiyama" && <Suthiyama />}
                {file === "marriage" && <Marriage />}
                {file === "media" && <MediaFiles />}
                {file === "locked" && <Locked onGo={onGoToEnvelope} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <dt className="font-mono text-[11px] tracking-[0.08em] text-ice/45">{children}</dt>;
}

function Profile({ booted }: { booted: boolean }) {
  return (
    <div>
      <h2 className="font-display text-[44px] leading-none text-ivory md:text-[56px]">
        Egginaya<span className="text-blue">.</span>
      </h2>
      <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-ice/45">profile.egg</p>

      <dl className="mt-9 grid grid-cols-[110px_1fr] gap-x-6 gap-y-3.5 md:grid-cols-[150px_1fr]">
        {system.profile.rows.map(([k, v]) => (
          <div key={k} className="contents">
            <Key>{k}</Key>
            <dd className="font-display text-[19px] leading-snug text-ivory/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-11 space-y-5">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">diagnostics</p>
        {system.profile.diagnostics.map((d, i) => (
          <div key={d.key}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[20px] text-ivory">{d.key}</span>
              <span className="font-mono text-[13px] text-ice">{d.value}</span>
            </div>
            <div className="bar mt-2">
              <i style={{ ["--v" as string]: booted ? d.ratio : 0, transitionDelay: `${i * 120}ms` }} />
            </div>
            {d.note && <p className="mt-1.5 font-mono text-[11px] text-ice/45">{d.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Suthiyama() {
  const s = system.suthiyama;
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">incident report {s.id}</p>
      <h2 className="mt-3 font-display text-[44px] leading-none text-ivory md:text-[56px]">suthiyama</h2>
      <p className="mt-2 font-display text-[19px] italic text-ice/60">not sathiyama</p>

      <dl className="mt-9 grid grid-cols-[90px_1fr] gap-x-6 gap-y-3 md:grid-cols-[120px_1fr]">
        <Key>type</Key>
        <dd className="font-display text-[18px] text-ivory/90">{s.type}</dd>
        <Key>severity</Key>
        <dd className="font-display text-[18px] text-ivory/90">{s.severity}</dd>
        <Key>status</Key>
        <dd className="font-display text-[18px] text-ivory/90">{s.status}</dd>
      </dl>

      <div className="mt-9">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">summary</p>
        <ul className="mt-3 space-y-1.5 font-display text-[20px] leading-snug text-ivory/90">
          {s.summary.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <div className="mt-9">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">evidence</p>
        <figure className="mt-3">
          {media.suthiyamaScreenshot ? (
            <img src={media.suthiyamaScreenshot} alt="Screenshot of the suthiyama message" className="w-full max-w-[380px] rounded-[3px]" />
          ) : (
            <div className="photo-slot flex aspect-[4/3] w-full max-w-[380px] items-end rounded-[3px] p-4 ring-1 ring-blue/25">
              <span className="font-mono text-[11px] tracking-[0.08em] text-ice/55">screenshot pending</span>
            </div>
          )}
          <figcaption className="mt-2 font-mono text-[11px] text-ice/45">
            <Placeholder>{s.evidenceCaption}</Placeholder>
          </figcaption>
        </figure>
      </div>

      <div className="mt-9">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">notes</p>
        <ul className="mt-3 space-y-1.5 font-display text-[19px] leading-snug text-ivory/85">
          {s.notes.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Marriage() {
  const m = system.marriage;
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">records / scanned document</p>
      <div className="paper mt-4 rounded-[2px] px-6 py-8 md:px-12 md:py-12" style={{ transform: "rotate(-0.6deg)" }}>
        <div className="mx-auto max-w-[440px] text-center">
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
            <div key={k} className="contents">
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
            <div className="h-px bg-navy/30" />
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-navy/45">her</p>
          </div>
          <div className="flex-1">
            <div className="h-px bg-navy/30" />
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
      <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">media / read only</p>
      <h2 className="mt-3 font-display text-[44px] leading-none text-ivory md:text-[56px]">things she'd get</h2>
      <ul className="mt-9 divide-y divide-blue/12 border-y border-blue/12">
        {system.mediaFiles.map((f) => (
          <li key={f.name} className="flex items-baseline justify-between gap-4 py-3.5">
            <span className="font-mono text-[13px] text-ice/90">{f.name}</span>
            <span className="text-right font-display text-[16px] italic text-ice/55">
              {f.meta}
              {f.note && <span className="text-ice/35"> {f.note}</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[11px] text-ice/40">no previews available. you know them anyway.</p>
    </div>
  );
}

function Locked({ onGo }: { onGo: () => void }) {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center">
      <p className="font-mono text-[11px] tracking-[0.08em] text-ice/45">{system.lockedFile.name}</p>
      <h2 className="mt-3 font-display text-[40px] leading-[1.05] text-ivory md:text-[52px]">{system.lockedFile.line}</h2>
      <button type="button" onClick={onGo} className="underline-soft mt-8 self-start font-display text-[20px] italic text-ice/80 hover:text-ice">
        go to the desk
      </button>
    </div>
  );
}
