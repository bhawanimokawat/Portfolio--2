import { ArrowUpRight, Code, Download, Linkedin, Mail, Sparkles } from 'lucide-react'

// Dots (nodes) and the lines (edges) that join them, drawn inside an arch.
// The arch is inspired by the windows of Jaipur's old palaces.
const nodes = [
  [200, 110], [120, 170], [285, 165], [200, 215], [95, 265], [310, 270],
  [160, 310], [250, 330], [120, 385], [205, 400], [300, 390],
]
const edges = [
  [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [1, 4], [2, 5], [3, 6], [3, 7], [4, 6],
  [5, 7], [6, 7], [6, 8], [7, 10], [6, 9], [7, 9], [8, 9], [9, 10], [4, 8], [5, 10],
]

// Tiny dots that float up and down in the background:
// [left %, top %, size in px, seconds for one move, start delay in seconds]
const particles = [
  [8, 18, 6, 7, 0], [22, 70, 8, 9, 1.2], [45, 12, 5, 8, 2], [58, 82, 7, 10, 0.6],
  [70, 22, 6, 6.5, 1.8], [88, 60, 8, 9.5, 0.3], [93, 15, 5, 8, 2.4], [35, 45, 5, 11, 1.5],
]

const delay = (ms) => ({ '--d': `${ms}ms` })

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4cf5] focus-visible:ring-offset-2'

// Small animations, written once. They only change opacity and transform (cheap for the GPU).
const css = `
@keyframes hero-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hero-pop  { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
@keyframes hero-ring { 0% { opacity: .5; transform: scale(1); } 70%, 100% { opacity: 0; transform: scale(3); } }
/* Background animations that keep running */
@keyframes hero-drift { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(40px,30px,0) scale(1.12); } }
@keyframes hero-spin  { to { transform: rotate(360deg); } }
@keyframes hero-float { fromimport { ArrowUpRight, Code, Download, Linkedin, Mail, Sparkles } from 'lucide-react' { transform: translateY(0); } to { transform: translateY(-10px); } }
@keyframes hero-bob   { 0%, 100% { transform: translateY(0); opacity: .15; } 50% { transform: translateY(-18px); opacity: .6; } }

.hero-rise { animation: hero-rise .7s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
.hero-fade { animation: hero-fade .8s ease-out var(--d, 0ms) both; }
.hero-pop  { transform-box: fill-box; transform-origin: center; animation: hero-pop .5s cubic-bezier(.2,.8,.2,1) var(--d, 0ms) both; }
.hero-ring { transform-box: fill-box; transform-origin: center; animation: hero-ring 2.6s ease-out 1800ms infinite both; }

.hero-drift { animation: hero-drift var(--t, 18s) ease-in-out var(--s, 0s) infinite alternate; will-change: transform; }
.hero-spin  { animation: hero-spin var(--t, 60s) linear infinite; will-change: transform; }
.hero-rev   { animation-direction: reverse; }
.hero-float { animation: hero-float var(--t, 6s) ease-in-out var(--s, 0s) infinite alternate; }
.hero-bob   { animation: hero-bob var(--t, 8s) ease-in-out var(--s, 0s) infinite; }

@media (prefers-reduced-motion: reduce) {
  .hero-rise, .hero-fade, .hero-pop, .hero-drift, .hero-spin, .hero-float { animation: none; }
  .hero-bob { animation: none; opacity: .3; }
  .hero-ring { display: none; }
}
`


export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden bg-[#f6f5fb] bg-[radial-gradient(ellipse_at_80%_20%,#e5e0ff,transparent_60%)] px-5 pb-16 pt-32 sm:px-8"
    >
      <style>{css}</style>

      {/* ---------- Background that keeps moving (behind everything) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Two big soft colour clouds that drift slowly */}
        <span
          style={{ '--t': '20s' }}
          className="hero-drift absolute -left-24 top-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(108,76,245,.16),transparent_65%)]"
        />
        <span
          style={{ '--t': '26s', '--s': '-8s' }}
          className="hero-drift absolute -bottom-16 -right-20 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(169,155,255,.30),transparent_65%)]"
        />

        {/* Tiny dots floating up and down */}
        {particles.map(([left, top, size, t, s], i) => (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              '--t': `${t}s`,
              '--s': `${s}s`,
            }}
            className="hero-bob absolute rounded-full bg-[#6c4cf5]"
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---------- Left: words ---------- */}
        <div>
          <p
            style={delay(0)}
            className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-[#1c1b33]/10 bg-white px-4 py-1.5 text-sm text-[#1c1b33]/75"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Open to opportunities in Jaipur, India
          </p>

          <h1
            style={delay(100)}
            className="hero-rise mt-7 text-[clamp(3.75rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-[#1c1b33]"
          >
            Varsha
            <br />
            Dabi<span className="text-[#6c4cf5]">.</span>
          </h1>

          <p
            style={delay(200)}
            className="hero-rise mt-6 text-lg font-medium text-[#1c1b33]"
          >
            AI &amp; Data Science student and aspiring builder
          </p>

          <p
            style={delay(300)}
            className="hero-rise mt-4 max-w-[34rem] text-base leading-relaxed text-[#1c1b33]/70 sm:text-lg"
          >
            I’m curious about how technology can make learning better. I love
            exploring AI, building for the web, and turning early ideas into
            useful experiences.
          </p>

          <div style={delay(400)} className="hero-rise mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className={`group inline-flex items-center gap-1.5 rounded-full bg-[#1c1b33] px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#6c4cf5] ${focusRing}`}
            >
              Explore my work
              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
            <a
              href="/Varsha%20Dabi%20(1).pdf"
              download="Varsha-Dabi-CV.pdf"
              className={`group inline-flex items-center gap-1.5 rounded-full border border-[#1c1b33]/15 px-6 py-3.5 text-[15px] font-medium text-[#1c1b33] transition-colors duration-200 hover:bg-white ${focusRing}`}
            >
              Download CV
              <Download size={16} className="transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none" />
            </a>
          </div>

          <div
            style={delay(500)}
            className="hero-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#1c1b33]/70"
          >
            <a
              href="mailto:varshadabi1121@gmail.com"
              className={`inline-flex items-center gap-2 rounded underline-offset-4 transition-colors hover:text-[#1c1b33] hover:underline ${focusRing}`}
            >
              <Mail size={16} /> varshadabi1121@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/varsha-dabi-550204370"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded underline-offset-4 transition-colors hover:text-[#1c1b33] hover:underline ${focusRing}`}
            >
              <Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* ---------- Right: arch with a network of dots ---------- */}
        <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-md">
          {/* Two thin rings that turn slowly around the arch, each with a dot riding on it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[135%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              style={{ '--t': '90s' }}
              className="hero-spin relative size-full rounded-full border border-dashed border-[#6c4cf5]/30"
            >
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c4cf5]" />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[112%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              style={{ '--t': '60s' }}
              className="hero-spin hero-rev relative size-full rounded-full border border-[#6c4cf5]/20"
            >
              <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#a99bff]" />
            </div>
          </div>

          <svg
            viewBox="0 0 420 500"
            role="img"
            aria-label="A network of connected dots inside an arch, inspired by Jaipur’s palace windows"
            className="relative block h-auto w-full"
          >
            <defs>
              <linearGradient id="hero-arch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2d2860" />
                <stop offset="1" stopColor="#1c1b33" />
              </linearGradient>
            </defs>

            {/* Outline arch behind, shifted a little for depth */}
            <path
              d="M34 474 V214 A180 180 0 0 1 394 214 V474 Z"
              fill="none"
              stroke="#6c4cf5"
              strokeOpacity=".35"
              strokeWidth="2"
            />
            {/* Main arch */}
            <path
              d="M20 460 V200 A180 180 0 0 1 380 200 V460 Z"
              fill="url(#hero-arch)"
            />

            <g stroke="#a99bff" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round">
              {edges.map(([a, b], i) => (
                <line
                  key={`${a}-${b}`}
                  className="hero-fade"
                  style={delay(500 + i * 40)}
                  x1={nodes[a][0]}
                  y1={nodes[a][1]}
                  x2={nodes[b][0]}
                  y2={nodes[b][1]}
                />
              ))}
            </g>

            {nodes.map(([x, y], i) => (
              <circle
                key={i}
                className="hero-pop"
                style={delay(700 + i * 60)}
                cx={x}
                cy={y}
                r={i === 3 ? 7 : 5}
                fill={i === 3 ? '#ffffff' : '#d9d3ff'}
              />
            ))}

            {/* One soft ring that pulses from the centre dot: the single "alive" moment */}
            <circle
              className="hero-ring"
              cx={nodes[3][0]}
              cy={nodes[3][1]}
              r="7"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </svg>

          {/* The two cards float gently up and down, out of step with each other.
              The outer box floats; the inner box does the first entrance. */}
          <div
            style={{ '--t': '5.5s' }}
            className="hero-float absolute -left-1 bottom-20 sm:-left-8"
          >
            <div
              style={delay(900)}
              className="hero-rise flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-[#1c1b33]/10"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#6c4cf5]/10 text-[#6c4cf5]">
                <Code size={18} />
              </span>
              <span className="text-sm leading-tight text-[#1c1b33]/70">
                Learning
                <b className="block font-semibold text-[#1c1b33]">every day</b>
              </span>
            </div>
          </div>

          <div
            style={{ '--t': '6.5s', '--s': '-2s' }}
            className="hero-float absolute -right-1 top-24 sm:-right-6"
          >
            <div
              style={delay(1000)}
              className="hero-rise flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-[#1c1b33]/10"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Sparkles size={18} />
              </span>
              <span className="text-sm leading-tight text-[#1c1b33]/70">
                Ideas into
                <b className="block font-semibold text-[#1c1b33]">impact</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}