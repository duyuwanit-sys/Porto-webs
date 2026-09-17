"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cpu, Terminal, UserRound } from "lucide-react";

const commands = [
  { at: 100, text: "┌──(adiwangsa㉿portfolio)-[~]", kind: "prompt" },
  { at: 350, text: "└─$ ./access.sh --target localhost", kind: "command" },
  { at: 900, text: "[ OK ] Establishing local session · 127.0.0.1", kind: "output" },
  { at: 1300, text: "[ OK ] Verifying identity signature", kind: "output" },
  { at: 1750, text: "[ OK ] Unlocking encrypted portfolio", kind: "output" },
  { at: 2100, text: "└─$ mount /dev/portfolio /interface", kind: "command" },
  { at: 2550, text: "[ OK ] Interface mounted. Rebuilding fragments…", kind: "output" },
];

/** Decorative local boot sequence; no commands or network scans are executed. */
export function LinuxIntro() {
  const [phase, setPhase] = useState("terminal");
  const [elapsed, setElapsed] = useState(0);
  const skipped = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("ready");
      return;
    }
    document.body.dataset.intro = "terminal";
    const start = performance.now();
    const interval = window.setInterval(() => {
      if (skipped.current) { clearInterval(interval); return; }
      const time = performance.now() - start;
      setElapsed(time);
      const next = time < 3100 ? "terminal" : time < 4100 ? "granted" : time < 5400 ? "assembling" : "ready";
      setPhase(next);
      document.body.dataset.intro = next;
      if (next === "ready") clearInterval(interval);
    }, 45);
    return () => { clearInterval(interval); delete document.body.dataset.intro; };
  }, []);

  const blocked = phase === "terminal" || phase === "granted";
  useEffect(() => {
    if (!blocked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings = [...(document.querySelector("main")?.children ?? [])]
      .filter((node): node is HTMLElement => node instanceof HTMLElement && !node.classList.contains("linux-intro"));
    const previous = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    skipRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      siblings.forEach((node, index) => { node.inert = previous[index]; });
      // Move focus to content without a persistent focus ring around the logo.
      const content = document.querySelector("main");
      if (content) { content.tabIndex = -1; content.focus({ preventScroll: true }); }
    };
  }, [blocked]);

  function skip() {
    skipped.current = true;
    document.body.dataset.intro = "ready";
    setPhase("ready");
  }

  if (!blocked) return null;
  return <div className={`linux-intro ${phase === "granted" ? "is-granted" : ""}`} role="dialog" aria-modal="true" aria-label="Intro terminal portfolio" onKeyDown={event => { if (event.key === "Escape") skip(); }}>
    <div className="terminal-window">
      <div className="terminal-title"><span><i /><i /><i /></span><span><Terminal size={13} /> adiwangsa@portfolio: ~</span><small>LOCAL SESSION</small></div>
      <div className="terminal-content" aria-hidden="true">
        <p className="terminal-welcome">ADIWANGSA / SYSTEMS <span>Linux interface · v3.0</span></p>
        <div className="terminal-lines">{commands.filter(line => elapsed >= line.at).map(line => <p className={line.kind} key={line.at}>{line.text}</p>)}</div>
        <span className="terminal-caret">▌</span>
      </div>
      <div className="access-result" aria-live="polite">{phase === "granted" ? <><span>IDENTITY VERIFIED</span><strong>ACCESS GRANTED</strong><small>Welcome, visitor. Reconstructing interface.</small></> : <><span>AUTHENTICATION IN PROGRESS</span><div className="terminal-progress"><i style={{ width: `${Math.min(100, elapsed / 31)}%` }} /></div></>}</div>
    </div>
    <button ref={skipRef} className="skip-intro" onClick={skip}>Lewati intro <span>ESC ↗</span></button>
    <span className="intro-footnote">PORTFOLIO / LOCAL ACCESS SEQUENCE</span>
  </div>;
}

/** A machined processor sculpture replaces the orbit illustration. */
export function Processor() {
  return <div className="processor-scene" aria-label="Ilustrasi prosesor berbahan platinum">
    <div className="processor-caption"><span>ENGINEERED WITH INTENT</span><small>01 / PROCESSING UNIT</small></div>
    <div className="processor-stack" aria-hidden="true">
      <div className="processor-base" />
      <div className="processor-board"><i className="trace trace-one" /><i className="trace trace-two" /><i className="trace trace-three" /></div>
      <div className="processor-chip"><Cpu /><span>Adiwangsa</span><small>SECURE BY DESIGN</small><i /></div>
    </div>
    <div className="processor-footer"><span><i /> SYSTEM ONLINE</span><span>SECURITY × HARDWARE</span></div>
  </div>;
}

/** Supply the owner's real photo at public/images/profile.jpg. No invented identity. */
export function ProfilePhoto() {
  const [available, setAvailable] = useState(true);
  return <div className="profile-photo-frame">
    {available ? <Image src="/images/profile.jpg" alt="Foto profil Adiwangsa" fill sizes="(max-width: 760px) 90vw, 360px" unoptimized onError={() => setAvailable(false)} /> : <div className="profile-photo-empty"><UserRound strokeWidth={.75} /><span>YOUR PORTRAIT HERE</span><small>Foto profil belum ditambahkan</small></div>}
    <span className="profile-photo-caption">THE PERSON BEHIND THE SYSTEM</span>
  </div>;
}
