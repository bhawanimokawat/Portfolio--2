import { useEffect, useRef, useState } from 'react'
import { skills } from '../data/portfolio.js'

// ------------------------------------------------------------------
// LOGOS (optional): to show a real logo inside a circle, put the logo file
// in the `public/logos` folder and add one line here. The name must match
// the skill name in your data exactly. Example:
//   const logos = { Python: '/logos/python.svg', React: '/logos/react.svg' }
// A skill with no logo shows its name inside the circle.
// ------------------------------------------------------------------
const logos = {}

// The three rings: how many circles each one holds, and how it turns.
// (Tailwind needs the full class names written out, so they are listed here.)
const rings = [
  {
    inset: 'inset-[27%]',
    max: 4,
    turn: 'animate-[spin_30s_linear_infinite]',
    back: 'animate-[spin_30s_linear_infinite_reverse]',
    line: 'border-[#6c4cf5]/30',
  },
  {
    inset: 'inset-[14%]',
    max: 6,
    turn: 'animate-[spin_45s_linear_infinite_reverse]',
    back: 'animate-[spin_45s_linear_infinite]',
    line: 'border-[#6c4cf5]/20',
  },
  {
    inset: 'inset-0',
    max: 8,
    turn: 'animate-[spin_60s_linear_infinite]',
    back: 'animate-[spin_60s_linear_infinite_reverse]',
    line: 'border-[#6c4cf5]/15',
  },
]

// Tells us once, when an element first comes into view (Intersection Observer).
function useSeenOnce(threshold = 0.2) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

// Fades anything in once, with a small rise (opacity + transform only).
function Reveal({ children, className = '', delay = 0, from = 'translate-y-5' }) {
  const [ref, seen] = useSeenOnce(0.15)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: seen ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? 'translate-y-0 scale-100 opacity-100' : `${from} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  )
}

// One circle on a ring: a logo, or the skill's name if there is no logo.
function Badge({ name }) {
  const logo = logos[name]
  return (
    <span
      title={name}
      className="group/badge grid size-12 place-items-center rounded-full border border-[#1c1b33]/10 bg-white p-1 text-center shadow-md shadow-[#1c1b33]/10 transition-[transform,background-color] duration-200 hover:scale-110 hover:bg-[#6c4cf5] motion-reduce:transition-none sm:size-16"
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          decoding="async"
          className="size-6 object-contain sm:size-8"
        />
      ) : (
        <span className="text-[9px] font-medium leading-tight text-[#1c1b33] transition-colors group-hover/badge:text-white sm:text-[11px]">
          {name}
        </span>
      )}
    </span>
  )
}

// The turning circles. They only use `transform: rotate`, which the
// graphics card (GPU) handles smoothly. Mouse over = they pause.
function Orbit() {
  const active = rings
    .map((ring, i) => ({ ring, items: skills[i]?.items?.slice(0, ring.max) ?? [] }))
    .filter(({ items }) => items.length > 0)

  return (
    <Reveal from="scale-90" className="mx-auto w-full max-w-[34rem]">
      <div
        aria-hidden="true"
        className="group/orbit relative mx-auto aspect-square w-full p-9 sm:p-10"
      >
        <div className="relative size-full">
          {/* Soft glow behind everything */}
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#e5e0ff,transparent_70%)]" />

          {active.map(({ ring, items }, r) => (
            <div
              key={r}
              className={`absolute ${ring.inset} rounded-full border border-dashed ${ring.line} ${ring.turn} group-hover/orbit:[animation-play-state:paused] motion-reduce:animate-none`}
            >
              {items.map((name, i) => {
                // Spread the circles evenly around the ring.
                const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2 + r * 0.6
                return (
                  <span
                    key={name}
                    style={{
                      left: `${50 + 50 * Math.cos(angle)}%`,
                      top: `${50 + 50 * Math.sin(angle)}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Turns the opposite way, so the text stays straight */}
                    <span
                      className={`block ${ring.back} group-hover/orbit:[animation-play-state:paused] motion-reduce:animate-none`}
                    >
                      <Badge name={name} />
                    </span>
                  </span>
                )
              })}
            </div>
          ))}

          {/* Centre */}
          <span className="absolute inset-[36%] grid place-items-center rounded-full bg-[#1c1b33] text-3xl font-semibold text-white shadow-[0_0_60px_rgba(108,76,245,.45)] sm:text-4xl">
            v<span className="text-[#a99bff]">.</span>
          </span>
        </div>
      </div>
    </Reveal>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="overflow-hidden bg-[#f6f5fb] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1b33] sm:text-5xl lg:text-6xl">
            What I’m learning
            <br />
            <span className="text-[#1c1b33]/55">and working with.</span>
          </h2>
          <p className="mt-5 text-lg text-[#1c1b33]/70">
            A growing toolkit for ideas that make a difference.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Orbit />

          {/* The full list, in words (also for screen readers) */}
          <div>
            {skills.map((skill, i) => (
              <Reveal key={skill.title} delay={Math.min(i, 4) * 80}>
                <div className="border-t border-[#1c1b33]/10 py-6 last:border-b">
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-xl text-[#6c4cf5] shadow-sm shadow-[#1c1b33]/10">
                      {skill.icon}
                    </span>
                    <h3 className="text-lg font-semibold leading-snug text-[#1c1b33]">
                      {skill.title}
                    </h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[#1c1b33]/10 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1c1b33]/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          <p className="text-[15px] text-[#1c1b33]/60">
            Always learning, always building. This list will keep growing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}