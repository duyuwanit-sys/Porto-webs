"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, AudioLines, Box, Braces, Check, CircuitBoard, Code2, ContactRound, Cpu, Crosshair, Fingerprint, GitBranch, Mail, Menu, Radar, Radio, ShieldCheck, Terminal, Volume2, VolumeX, X } from "lucide-react";

import Image from "next/image";
import { LinuxIntro, Processor, ProfilePhoto } from "./experience";

type ProjectKey = "feeder" | "robot" | "drone" | "attendance";

const navItems = [
  ["01", "INIT", "home"], ["02", "PROFILE", "about"], ["03", "MODULES", "skills"],
  ["04", "UNITS", "projects"], ["05", "SIGNAL", "contact"],
];

const skillData = [
  ["Reverse Engineering", "REV.ENG", "SEC", 88, Braces], ["Digital Forensics", "FORENSIC", "SEC", 84, Fingerprint],
  ["Web Exploitation", "WEB.EXP", "SEC", 91, ShieldCheck], ["Binary Analysis", "BIN.ANA", "SEC", 79, Terminal],
  ["ESP32 Systems", "ESP.32", "IOT", 92, Cpu], ["Arduino", "ARDUINO", "IOT", 86, CircuitBoard],
  ["IoT Protocols", "MQTT/IP", "IOT", 83, Radio], ["Web Development", "WEB.DEV", "DEV", 87, Code2],
  ["Python / C++", "PY/CPP", "DEV", 85, Box],
] as const;

const projects: Record<ProjectKey, { number: string; title: string; subtitle: string; description: string; tags: string[]; status: string }> = {
  feeder: { number: "UNIT—01", title: "Automatic Fish Feeder", subtitle: "Autonomous nutrition system", description: "Perangkat pemberi pakan terjadwal dengan kontrol jarak jauh, kalibrasi porsi, dan monitoring stok secara real-time.", tags: ["ESP32", "SERVO", "BLYNK"], status: "DEPLOYED" },
  robot: { number: "UNIT—02", title: "Expressive IoT Robot", subtitle: "Connected companion prototype", description: "Robot interaktif yang membaca lingkungan, merespons input sensor, dan menampilkan ekspresi melalui matriks OLED.", tags: ["ESP32", "OLED", "MQTT"], status: "PROTOTYPE" },
  drone: { number: "UNIT—03", title: "Windbreak Monitor", subtitle: "Aerial observation platform", description: "Sistem observasi drone untuk memetakan kondisi windbreak dan mengubah data lapangan menjadi insight spasial.", tags: ["UAV", "SENSOR", "GIS"], status: "FIELD TEST" },
  attendance: { number: "UNIT—04", title: "Smart Attendance", subtitle: "Dual identity verification", description: "Terminal absensi RFID dan fingerprint dengan sinkronisasi database serta dashboard rekap berbasis web.", tags: ["RFID", "BIOMETRIC", "WEB"], status: "ONLINE" },
};

function ping(frequency = 520) {
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = "sine"; osc.frequency.value = frequency; gain.gain.value = .025;
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .08);
  osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .08);
}

function ReactorNav({ active, sound, setSound }: { active: string; sound: boolean; setSound: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return <header className="nav-wrap"><nav className="reactor-nav" aria-label="Navigasi utama">
    <div className="tube-cap left"><i /><i /><span /></div>
    <a className="nav-brand" href="#home"><span className="brand-core"><Cpu /></span><b>Adiwangsa</b><em>/SYS</em></a>
    <div className={`tube-links ${open ? "open" : ""}`}>{navItems.map(([n, label, id]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""} onClick={() => setOpen(false)}>
      {active === id && <motion.span layoutId="nav-energy" className="nav-energy" transition={{ type: "spring", stiffness: 320, damping: 28 }} />}<small>{n}</small><b>{label}</b></a>)}</div>
    <div className="tube-controls"><span className="tube-readout"><i /> NET.OK</span><button aria-label="Toggle audio" onClick={() => { setSound(!sound); if (!sound) setTimeout(() => ping(690), 0); }}>{sound ? <Volume2 /> : <VolumeX />}</button><button className="menu-toggle" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    <div className="tube-cap right"><i /><i /><span /></div><div className="tube-current" />
  </nav></header>;
}

function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const canvas = canvasRef.current, ctx = canvas?.getContext("2d"); if (!canvas || !ctx) return; let raf = 0; let dots: {x:number;y:number;s:number;v:number}[] = [];
    const resize = () => { const r = Math.min(devicePixelRatio, 1.5); canvas.width = innerWidth*r; canvas.height=innerHeight*r; canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;ctx.setTransform(r,0,0,r,0,0);dots=Array.from({length:Math.min(45,innerWidth/25)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:Math.random()*1.4+.3,v:Math.random()*.12+.03})); };
    const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);dots.forEach(d=>{d.y-=d.v;if(d.y<0)d.y=innerHeight;ctx.fillStyle="rgba(114,244,255,.45)";ctx.fillRect(d.x,d.y,d.s,d.s)});raf=requestAnimationFrame(draw)};resize();draw();addEventListener("resize",resize);return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize)};
  },[]); return <><canvas ref={canvasRef} className="particles"/><div className="world-grid"/><div className="page-scan"/><div className="grain"/></>;
}

function SectionLabel({ index, overline, title }: { index: string; overline: string; title: string }) {
  return <div className="section-label"><span>{index}</span><div><small>{overline}</small><h2>{title}</h2></div><i /><em>SCROLL.DATA<br/>{index}/06</em></div>;
}

function SkillMatrix() {
  const [filter,setFilter]=useState("ALL"),[selected,setSelected]=useState(0); const shown=skillData.filter(s=>filter==="ALL"||s[2]===filter); const current=skillData[selected];
  return <div className="skills-console"><div className="skill-toolbar"><div className="filter-tabs">{["ALL","SEC","IOT","DEV"].map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f==="ALL"?"ALL MODULES":f}</button>)}</div><span>AVAILABLE // {String(shown.length).padStart(2,"0")}</span></div>
    <div className="skill-stage"><div className="skill-rail">{shown.map((s,i)=>{const Icon=s[4];const real=skillData.indexOf(s);return <motion.button layout key={s[0]} className={selected===real?"active":""} onClick={()=>setSelected(real)}><small>{String(i+1).padStart(2,"0")}</small><Icon/><span>{s[0]}</span><em>{s[1]}</em></motion.button>})}</div>
      <div className="skill-inspector"><div className="inspector-orbit"><div><span>{current[3]}</span><small>SYNC</small></div></div><p>MODULE.SELECTED</p><h3>{current[0]}</h3><div className="meter"><motion.i animate={{width:`${current[3]}%`}}/></div><div className="inspector-meta"><span>GROUP<br/><b>{current[2]}</b></span><span>STATE<br/><b>LOADED</b></span><span>CODE<br/><b>{current[1]}</b></span></div></div>
    </div></div>;
}

function ProjectVisual({ type }: { type: ProjectKey }) {
  return <div className="project-art project-photograph">
    <Image src={`/images/${type}.webp`} alt={`Ilustrasi konsep ${projects[type].title}`} fill sizes="(max-width: 760px) 100vw, 650px" />
    <span className="photo-project-label">CONCEPT IMAGE <span>{projects[type].number}</span></span>
  </div>;
}

function ProjectRow({ id, reverse, open }: { id: ProjectKey; reverse: boolean; open:()=>void }) { const p=projects[id]; return <motion.article className={`project-row ${reverse?"reverse":""}`} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
  <ProjectVisual type={id}/><div className="project-info"><div className="project-kicker"><span>{p.number}</span><em><i/>{p.status}</em></div><small>{p.subtitle}</small><h3>{p.title}</h3><p>{p.description}</p><div className="project-bottom"><div>{p.tags.map(t=><span key={t}>{t}</span>)}</div><button onClick={open}>OPEN CASE <ArrowUpRight/></button></div></div></motion.article> }

function ProjectModal({ current, close }: { current: ProjectKey|null; close:()=>void }) { const p=current?projects[current]:null; return <AnimatePresence>{p&&current&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><motion.div className="case-modal" initial={{scale:.94,y:20}} animate={{scale:1,y:0}} exit={{scale:.96}} role="dialog" aria-modal="true"><div className="case-top"><span>CASE.FILE // {p.number}</span><button onClick={close}><X/></button></div><ProjectVisual type={current}/><small>{p.subtitle}</small><h2>{p.title}</h2><p>{p.description}</p><div className="case-specs"><span>ARCHITECTURE<b>MODULAR</b></span><span>UPLINK<b>REALTIME</b></span><span>STATUS<b>{p.status}</b></span></div></motion.div></motion.div>}</AnimatePresence> }

function ContactForm({sound}:{sound:boolean}) { const [state,setState]=useState<"idle"|"sending"|"sent">("idle"); const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setState("sending");const form=e.currentTarget;setTimeout(()=>{setState("sent");form.reset();if(sound)ping(820)},1300)}; return <form className="signal-form" onSubmit={submit}><div className="form-status"><span><i/> SECURE CHANNEL</span><em>AES—256</em></div><label><span>IDENTITY</span><input name="name" placeholder="Your name" minLength={2} required/></label><label><span>RETURN CHANNEL</span><input name="email" type="email" placeholder="name@domain.com" required/></label><label><span>TRANSMISSION</span><textarea name="message" rows={5} minLength={10} placeholder="Tell me about your mission..." required/></label><button className="transmit-button" disabled={state==="sending"}>{state==="sending"?<><AudioLines/> ENCODING SIGNAL</>:state==="sent"?<><Check/> SIGNAL TRANSMITTED</>:<>TRANSMIT MESSAGE <ArrowUpRight/></>}</button></form> }

export default function Home() {
  const [active,setActive]=useState("home"),[sound,setSound]=useState(false),[modal,setModal]=useState<ProjectKey|null>(null),[robotMode,setRobotMode]=useState(false); const clicks=useRef(0);
  useEffect(()=>{const sections=[...document.querySelectorAll<HTMLElement>("section[id]")];const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:"-35% 0px -55%"});sections.forEach(s=>o.observe(s));return()=>o.disconnect()},[]);
  const robot=()=>{clicks.current++;if(clicks.current>=5){setRobotMode(true);clicks.current=0;if(sound)ping(130);setTimeout(()=>setRobotMode(false),4200)}};
  return <main className={robotMode?"robot-mode":""}><LinuxIntro/><Atmosphere/><ReactorNav active={active} sound={sound} setSound={setSound}/>
    <section id="home" className="hero"><div className="hero-side-code"><span>6°12&apos;48.2&quot;S</span><i/><span>106°49&apos;31.0&quot;E</span></div><motion.div className="hero-copy" initial={false}><div className="system-state"><i/> SYSTEM.INIT <span>AVAILABLE FOR WORK</span></div><p className="hero-intro">HELLO, I&apos;M</p><h1 data-text="Adiwangsa">Adiwangsa<span>.</span></h1><div className="hero-role"><span>CYBERSECURITY</span><i>/</i><span>EMBEDDED SYSTEMS</span><i>/</i><span>SOFTWARE</span></div><p className="hero-lead">I engineer secure systems and expressive machines—where careful code meets the physical world.</p><div className="hero-actions"><a href="#projects" className="primary-action">EXPLORE SYSTEMS <ArrowDownRight/></a><a href="#contact" className="quiet-action">START A TRANSMISSION <span>↗</span></a></div></motion.div><motion.div className="hero-core-wrap" initial={false}><Processor/></motion.div><div className="hero-footer"><span>PORTFOLIO_OS — V2.0</span><i/><span>SCROLL TO INTERFACE</span></div></section>

    <section id="about" className="section-shell"><SectionLabel index="02" overline="DATABASE //" title="PROFILE"/><div className="about-layout"><motion.div className="portrait-system" initial={{opacity:0,x:-35}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><div className="portrait-code"><span>SUBJECT.01</span><em>VERIFIED</em></div><ProfilePhoto/><div className="portrait-readout"><span>Adiwangsa<small>SYSTEMS ENGINEER</small></span><b>99.8<sup>%</sup></b></div></motion.div><motion.div className="about-copy" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><p className="about-statement">Saya membangun di persimpangan <em>security, hardware,</em> dan <em>human interaction.</em></p><p className="about-body">Rasa penasaran membawa saya dari membedah binary dan mencari celah aplikasi, sampai menyolder sensor dan menghidupkan robot. Bagi saya, teknologi yang baik bukan sekadar berjalan—ia harus tangguh, jelas, dan punya karakter.</p><div className="domain-list">{[["01","OFFENSIVE SECURITY","Memahami sistem dengan membongkar cara ia dapat gagal."],["02","PHYSICAL COMPUTING","Membawa kode keluar dari layar ke mesin yang dapat merasakan."],["03","SOFTWARE CRAFT","Mengubah kompleksitas menjadi pengalaman yang mudah digunakan."]].map(d=><div key={d[0]}><span>{d[0]}</span><h3>{d[1]}</h3><p>{d[2]}</p><ArrowUpRight/></div>)}</div></motion.div></div></section>

    <section id="skills" className="section-shell"><SectionLabel index="03" overline="SYSTEM //" title="MODULES.LOADED"/><SkillMatrix/></section>
    <section id="projects" className="section-shell"><SectionLabel index="04" overline="ARCHIVE //" title="DEPLOYED.UNITS"/><div className="project-list">{(Object.keys(projects) as ProjectKey[]).map((k,i)=><ProjectRow key={k} id={k} reverse={i%2===1} open={()=>setModal(k)}/>)}</div></section>
    <section id="missions" className="section-shell"><SectionLabel index="05" overline="SECURITY //" title="MISSION.LOG"/><div className="mission-layout"><div className="radar-console"><Radar/><div className="radar-sweep"/><i className="blip b1"/><i className="blip b2"/><i className="blip b3"/><span>LIVE<br/>OPS</span></div><div className="mission-log">{[["2025.11","National Cyber Competition","WEB EXPLOITATION · FORENSICS · REVERSE","TOP 10"],["2025.06","Internal CTF Laboratory","CHALLENGE AUTHOR · SECURITY RESEARCH","AUTHOR"],["2024.10","Incident Trace Challenge","DISK ARTIFACTS · NETWORK ANALYSIS","SOLVED"],["2024.04","IoT Prototype Showcase","ESP32 · AUTOMATION · TELEMETRY","FINALIST"]].map((m,i)=><motion.article key={m[1]} initial={{opacity:0,x:25}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><time>{m[0]}</time><span className="mission-node"/><div><small>LOG.ENTRY // 0{i+1}</small><h3>{m[1]}</h3><p>{m[2]}</p></div><b>{m[3]}</b></motion.article>)}</div></div></section>
    <section id="contact" className="section-shell contact-section"><SectionLabel index="06" overline="COMMUNICATION //" title="TRANSMIT.MESSAGE"/><div className="contact-layout"><div className="contact-copy"><span className="available"><i/> CHANNEL OPEN</span><h2>Let&apos;s build<br/>something <em>alive.</em></h2><p>Punya eksperimen, sistem embedded, atau masalah security yang menarik? Kirim sinyal dan ceritakan misinya.</p><div className="social-stack"><a href="mailto:hello@example.com"><Mail/> hello@example.com <ArrowUpRight/></a><a href="https://github.com"><GitBranch/> @adiwangsa-systems <ArrowUpRight/></a><a href="https://linkedin.com"><ContactRound/> /in/adiwangsa-systems <ArrowUpRight/></a></div></div><ContactForm sound={sound}/></div></section>
    <footer><div><span className="brand-core"><Cpu/></span><b>Adiwangsa/SYS</b></div><p>ENGINEERED IN INDONESIA // © {new Date().getFullYear()}</p><a href="#home">RETURN TO ORIGIN ↑</a></footer>
    <button className="companion" onClick={robot}><span><i/></span><em>AI.ONLINE</em></button><AnimatePresence>{robotMode&&<motion.div className="robot-alert" initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><Crosshair/><span>PROTOCOL OVERRIDE</span><b>ROBOT MODE // ENGAGED</b></motion.div>}</AnimatePresence><ProjectModal current={modal} close={()=>setModal(null)}/>
  </main>;
}
