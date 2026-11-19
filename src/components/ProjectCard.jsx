import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const accents = {
  violet: { bg: 'from-[#5b3df0] to-[#1c1b33]', dot: 'bg-[#6c4cf5]' },
  indigo: { bg: 'from-[#4338ca] to-[#1e1b4b]', dot: 'bg-[#4338ca]' },
  blue: { bg: 'from-[#1d4ed8] to-[#1e1b4b]', dot: 'bg-[#1d4ed8]' },
  teal: { bg: 'from-[#0f766e] to-[#134e4a]', dot: 'bg-[#0f766e]' },
  emerald: { bg: 'from-[#047857] to-[#064e3b]', dot: 'bg-[#047857]' },
  amber: { bg: 'from-[#b45309] to-[#78350f]', dot: 'bg-[#b45309]' },
  orange: { bg: 'from-[#c2410c] to-[#7c2d12]', dot: 'bg-[#c2410c]' },
  rose: { bg: 'from-[#be123c] to-[#4c0519]', dot: 'bg-[#be123c]' },
}
const fallbackOrder = ['violet', 'teal', 'amber', 'rose']

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4cf5] focus-visible:ring-offset-2'

// Shared CSS. Render <style>{motionCss}</style> ONCE (Projects.jsx does this).
// Only opacity and transform are animated. Loops are paused until the card is on screen.
export const motionCss = `
/* ---------- interactive 3D tilt ---------- */
.pc-tilt {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
  transition: transform .25s ease-out, box-shadow .3s ease;
  will-change: transform;
}
.pc-tilt:hover { --lift: -6px; }

/* ---------- continuous loops (paused until .pc-live) ---------- */
.pc-loop { animation-play-state: paused; }
.pc-live .pc-loop { animation-play-state: running; }

.pc-float-a { animation: pc-float-a 7s ease-in-out infinite; }
.pc-float-b { animation: pc-float-b 9s ease-in-out infinite; }
.pc-aurora  { animation: pc-aurora 12s ease-in-out infinite alternate; }
.pc-mark    { animation: pc-mark 5s ease-in-out infinite; }
.pc-badge   { animation: pc-badge 3.2s ease-in-out infinite; }
.pc-sweep::before {
  content: ''; position: absolute; top: -10%; bottom: -10%; left: -50%; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.18), transparent);
  transform: translateX(0) skewX(-15deg);
  animation: pc-sweep 7s ease-in-out infinite; animation-play-state: paused;
}
.pc-live .pc-sweep::before { animation-play-state: running; }
.pc-dot-pulse { animation: pc-dot 2.6s ease-in-out infinite; }

/* tags lift one after another on card hover */
.pc-tag { transition: transform .25s ease, background-color .25s ease, color .25s ease; }
.group:hover .pc-tag { transform: translateY(-2px); background-color: #1c1b33; color: #fff; }

@keyframes pc-float-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-14px,16px) scale(1.08); } }
@keyframes pc-float-b { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-14px) rotate(3deg); } }
@keyframes pc-aurora  { from { transform: translate(-15%,-10%) scale(1); } to { transform: translate(20%,15%) scale(1.25); } }
@keyframes pc-mark    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes pc-badge   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes pc-sweep   { 0%,60% { transform: translateX(0) skewX(-15deg); } 100% { transform: translateX(520%) skewX(-15deg); } }
@keyframes pc-dot     { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: .55; } }

/* touch devices: no tilt */
@media (hover: none) { .pc-tilt { transform: none !important; } }

@media (prefers-reduced-motion: reduce) {
  .pc-float-a, .pc-float-b, .pc-aurora, .pc-mark, .pc-badge, .pc-dot-pulse,
  .pc-sweep::before { animation: none !important; }
  .pc-tilt { transform: none !important; }
  .pc-tag, .group:hover .pc-tag { transform: none; }
}
`

// Reports { seen, live }:
// seen = has entered view once (starts the reveal), live = on screen right now (runs the loops)
function useVisibility(threshold = 0.2) {
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

export default function ProjectCard({ project }) {
  const [ref, seen, live] = useVisibility()
  const index = (Number(project.number) || 1) - 1
  const a =
    accents[project.accent] ?? accents[fallbackOrder[index % fallbackOrder.length]]
  const mark = `${project.title.trim().charAt(0).toLowerCase()}.`

  // Light under the mouse (sets CSS values directly, no re-render)
  const onPictureMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`)
  }

  // 3D tilt: the card leans toward the mouse
  const onTilt = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width - 0.5
    const py = (e.clientY - box.top) / box.height - 0.5
    e.currentTarget.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(-py * 9).toFixed(2)}deg`)
  }
  const onTiltEnd = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: seen ? `${(index % 3) * 120}ms` : '0ms' }}
      className={`h-full transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${live ? 'pc-live' : ''}`}
    >
      <article
        onMouseMove={onTilt}
        onMouseLeave={onTiltEnd}
        className="pc-tilt group flex h-full flex-col overflow-hidden rounded-3xl border border-[#1c1b33]/10 bg-white hover:shadow-xl hover:shadow-[#1c1b33]/10"
      >
        {/* Picture */}
        <div
          onMouseMove={onPictureMove}
          className={`pc-sweep relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${a.bg}`}
        >
          {/* Slow moving colour glow, always running */}
          <span
            aria-hidden="true"
            className="pc-loop pc-aurora absolute -left-1/4 -top-1/4 size-3/4 rounded-full bg-white/15 blur-3xl"
          />

          {/* Shapes: outer span handles hover, inner span handles the loop */}
          <span className="absolute -right-10 -top-10 size-44 transition-transform duration-500 ease-out group-hover:-translate-x-4 group-hover:translate-y-4 motion-reduce:transition-none">
            <span className="pc-loop pc-float-a block size-full rounded-full bg-white/10" />
          </span>
          <span className="absolute -bottom-2 right-8 h-32 w-24 transition-transform duration-500 ease-out group-hover:-translate-y-4 motion-reduce:transition-none">
            <span className="pc-loop pc-float-b block size-full rounded-t-full border-2 border-white/25" />
          </span>

          {/* Light that follows the mouse */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
            style={{
              background:
                'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.22), transparent 70%)',
            }}
          />

          <span className="pc-loop pc-badge absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            {project.category}
          </span>
          <span
            aria-hidden="true"
            className="pc-loop pc-mark absolute bottom-4 left-6 text-7xl font-semibold leading-none tracking-tight text-white"
          >
            {mark}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-snug text-[#1c1b33] sm:text-2xl">
              {project.title}
            </h3>
            <a
              href="#contact"
              aria-label={`Ask Varsha about ${project.title}`}
              className={`grid size-10 shrink-0 place-items-center rounded-full border border-[#1c1b33]/15 text-[#1c1b33] transition-colors duration-200 group-hover:border-[#1c1b33] group-hover:bg-[#1c1b33] group-hover:text-white ${focusRing}`}
            >
              <ArrowUpRight
                size={18}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-[#1c1b33]/70">
            {project.description}
          </p>

          {project.highlights && (
            <ul className="mt-4 space-y-2">
              {project.highlights.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[#1c1b33]/75"
                >
                  <span
                    className={`pc-loop pc-dot-pulse mt-2 size-1.5 shrink-0 rounded-full ${a.dot}`}
                    style={{ animationDelay: `${i * 400}ms` }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {project.stack.map((item, i) => (
              <li
                key={item}
                style={{ transitionDelay: `${i * 40}ms` }}
                className="pc-tag rounded-full bg-[#f6f5fb] px-3 py-1 text-xs font-medium text-[#1c1b33]/75"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  )
}