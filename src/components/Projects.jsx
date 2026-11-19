import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/portfolio.js'
import ProjectCard, { motionCss } from './ProjectCard.jsx'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4cf5] focus-visible:ring-offset-2'

const css = `
/* ---------- section loops (paused until .pr-live) ---------- */
.pr-loop { animation-play-state: paused; }
.pr-live .pr-loop { animation-play-state: running; }

.pr-blob { position: absolute; border-radius: 9999px; filter: blur(80px); opacity: .3; pointer-events: none; will-change: transform; }
.pr-blob-a { animation: pr-drift-a 20s ease-in-out infinite alternate; }
.pr-blob-b { animation: pr-drift-b 24s ease-in-out infinite alternate; }

/* endless tech-stack ribbon; pauses when the mouse is over it */
.pr-marquee { mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); }
.pr-track { display: flex; width: max-content; animation: pr-scroll 38s linear infinite; }
.pr-marquee:hover .pr-track { animation-play-state: paused !important; }

/* call-to-action card */
.pr-shine { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
.pr-shine::before { content: ''; position: absolute; top: 0; bottom: 0; left: -40%; width: 30%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.12), transparent);
  transform: translateX(0) skewX(-15deg); animation: pr-sweep 6s ease-in-out infinite; animation-play-state: paused; }
.pr-live .pr-shine::before { animation-play-state: running; }
.pr-ring { position: absolute; inset: 0; border-radius: 9999px; background: #fff; opacity: 0; animation: pr-ring 2.8s ease-out infinite; }
.pr-nudge { animation: pr-nudge 1.8s ease-in-out infinite; }
.pr-cta-a { animation: pr-float-a 8s ease-in-out infinite; }
.pr-cta-b { animation: pr-float-b 10s ease-in-out infinite; }

@keyframes pr-drift-a { from { transform: translate(0,0) scale(1); } to { transform: translate(70px,50px) scale(1.2); } }
@keyframes pr-drift-b { from { transform: translate(0,0) scale(1.1); } to { transform: translate(-60px,-40px) scale(.95); } }
@keyframes pr-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pr-sweep { 0%,55% { transform: translateX(0) skewX(-15deg); } 100% { transform: translateX(560%) skewX(-15deg); } }
@keyframes pr-ring { 0% { transform: scale(1); opacity: .35; } 100% { transform: scale(1.35, 1.7); opacity: 0; } }
@keyframes pr-nudge { 0%,100% { transform: translate(0,0); } 50% { transform: translate(3px,-3px); } }
@keyframes pr-float-a { 0%,100% { transform: translateY(0); } 50% { transform: translateY(18px); } }
@keyframes pr-float-b { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-14px) rotate(2deg); } }

@media (prefers-reduced-motion: reduce) {
  .pr-blob, .pr-track, .pr-shine::before, .pr-ring, .pr-nudge, .pr-cta-a, .pr-cta-b { animation: none !important; }
}
`

// Reports { seen, live }: seen = entered view once, live = on screen right now
function useVisibility(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen, live]
}

// Fades in once, with a small rise
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, seen] = useVisibility()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: seen ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// All unique tools used across projects
const allTools = [...new Set(projects.flatMap((p) => p.stack))]

export default function Projects() {
  const [sectionRef, , live] = useVisibility(0.05)

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32 ${
        live ? 'pr-live' : ''
      }`}
    >
      {/* Injected once for the whole section and all cards */}
      <style>{motionCss}</style>
      <style>{css}</style>

      {/* Ambient background glow */}
      <span aria-hidden className="pr-loop pr-blob pr-blob-a -left-24 top-24 size-80 bg-[#6c4cf5]" />
      <span aria-hidden className="pr-loop pr-blob pr-blob-b -right-24 top-[55%] size-96 bg-[#a99bff]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1b33] sm:text-5xl lg:text-6xl">
            Small steps.
            <br />
            <span className="text-[#1c1b33]/55">Meaningful ideas.</span>
          </h2>
          <p className="mt-5 text-lg text-[#1c1b33]/70">
            A selection of experiments and work in progress.
          </p>
        </Reveal>

        {/* Endless tool ribbon */}
        <Reveal className="mt-12" delay={150}>
          <div className="pr-marquee overflow-hidden" aria-hidden="true">
            <div className="pr-loop pr-track">
              {[...allTools, ...allTools].map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  className="mr-3 shrink-0 rounded-full border border-[#1c1b33]/10 bg-[#f6f5fb] px-4 py-1.5 text-sm font-medium text-[#1c1b33]/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.number} project={project} />
          ))}
        </div>

        {/* Closing invitation */}
        <Reveal className="mt-14">
          <a
            href="mailto:varshadabi1121@gmail.com?subject=Varsha%20Dabi%20portfolio"
            className={`group relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-[#1c1b33] p-8 text-white transition-colors duration-300 hover:bg-[#2a2560] motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between sm:p-10 ${focusRing}`}
          >
            <span className="pr-loop pr-shine" aria-hidden="true" />

            <span
              aria-hidden="true"
              className="absolute -top-12 right-40 size-40 transition-transform duration-500 ease-out group-hover:translate-y-4 motion-reduce:transition-none"
            >
              <span className="pr-loop pr-cta-a block size-full rounded-full bg-white/5" />
            </span>
            <span
              aria-hidden="true"
              className="absolute -bottom-6 right-12 hidden h-40 w-28 transition-transform duration-500 ease-out group-hover:-translate-y-3 motion-reduce:transition-none sm:block"
            >
              <span className="pr-loop pr-cta-b block size-full rounded-t-full border-2 border-white/15" />
            </span>

            <span className="relative max-w-md text-2xl font-semibold leading-snug sm:text-3xl">
              Have an idea we could build together?
            </span>

            <span className="relative inline-flex w-fit">
              <span aria-hidden="true" className="pr-loop pr-ring" />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-medium text-[#1c1b33]">
                Let’s talk
                <span className="pr-loop pr-nudge inline-flex">
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}