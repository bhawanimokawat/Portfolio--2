import { useEffect, useRef, useState } from 'react'
import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { award, experience } from '../data/portfolio.js'

const delay = (ms) => ({ '--d': `${ms}ms` })

// Entrance animations + continuous background loops.
// Only opacity and transform are animated (cheap for the GPU).
const css = `
.j-item { opacity: 0; }
.j-line { transform-origin: top; transform: scaleY(0); }
.j-in .j-item { animation: j-rise .6s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
.j-in .j-line { animation: j-grow 1.1s ease-out both; }

/* ---- continuous loops (only run while the section is on screen) ---- */
.j-blob { position: absolute; border-radius: 9999px; filter: blur(70px); opacity: .35; pointer-events: none; will-change: transform; }
.j-blob-a { animation: j-drift-a 18s ease-in-out infinite alternate; animation-play-state: paused; }
.j-blob-b { animation: j-drift-b 22s ease-in-out infinite alternate; animation-play-state: paused; }
.j-live .j-blob-a, .j-live .j-blob-b { animation-play-state: running; }

.j-pulse { position: absolute; left: -1px; top: 0; width: 3px; height: 70px; border-radius: 9999px;
  background: linear-gradient(to bottom, transparent, #6c4cf5, transparent);
  opacity: 0; animation: j-travel 4.5s ease-in-out infinite; animation-play-state: paused; }
.j-live .j-pulse { animation-play-state: running; }

.j-ring { position: absolute; inset: 0; border-radius: 9999px; border: 2px solid #6c4cf5;
  opacity: 0; animation: j-breathe 3.2s ease-out infinite; animation-play-state: paused; }
.j-live .j-ring { animation-play-state: running; }

.j-shine { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
.j-shine::before { content: ''; position: absolute; top: 0; bottom: 0; left: -40%; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.14), transparent);
  transform: translateX(0) skewX(-15deg); animation: j-sweep 6s ease-in-out infinite; animation-play-state: paused; }
.j-live .j-shine::before { animation-play-state: running; }

.j-float { animation: j-bob 3.6s ease-in-out infinite; animation-play-state: paused; }
.j-live .j-float { animation-play-state: running; }

.j-card { transition: transform .3s ease; }
.j-card:hover { transform: translateY(-3px); }

@keyframes j-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes j-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes j-drift-a { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
@keyframes j-drift-b { from { transform: translate(0,0) scale(1.1); } to { transform: translate(-50px,-30px) scale(.95); } }
@keyframes j-travel { 0% { transform: translateY(-20px); opacity: 0; } 15% { opacity: .9; } 85% { opacity: .9; } 100% { transform: translateY(var(--travel, 360px)); opacity: 0; } }
@keyframes j-breathe { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(2.4); opacity: 0; } }
@keyframes j-sweep { 0%, 55% { transform: translateX(0) skewX(-15deg); } 100% { transform: translateX(480%) skewX(-15deg); } }
@keyframes j-bob { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-4px) rotate(6deg); } }

@media (prefers-reduced-motion: reduce) {
  .j-item { opacity: 1; animation: none !important; }
  .j-line { transform: none; animation: none !important; }
  .j-blob, .j-pulse, .j-ring, .j-shine::before, .j-float { animation: none !important; }
  .j-card:hover { transform: none; }
}
`

// Reports { seen, live }:
// seen = has entered view at least once (starts entrance animations)
// live = currently on screen (runs/pauses the looping animations)
function useVisibility() {
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
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen, live]
}

function ColumnTitle({ icon: Icon, children }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-[#6c4cf5]/10 text-[#6c4cf5]">
        <Icon size={19} />
      </span>
      <h3 className="text-xl font-semibold text-[#1c1b33]">{children}</h3>
    </div>
  )
}

// Vertical line with a light pulse that keeps travelling down it.
function TimelineLine({ pulseDelay = 0 }) {
  return (
    <span className="j-line absolute bottom-2 left-[7px] top-2 w-px bg-[#1c1b33]/15">
      <span className="j-pulse" style={{ animationDelay: `${pulseDelay}ms` }} />
    </span>
  )
}

// One entry on a timeline. `current` makes the dot solid and blinking.
function Entry({ date, tag, title, subtitle, place, current, d, ringDelay = 0, children }) {
  return (
    <article style={delay(d)} className="j-item j-card relative pb-10 pl-9 last:pb-0">
      <span className="absolute left-0 top-1.5 flex size-[15px]">
        {current ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6c4cf5] opacity-40 motion-reduce:animate-none" />
        ) : (
          <span className="j-ring" style={{ animationDelay: `${ringDelay}ms` }} />
        )}
        <span
          className={`relative inline-flex size-full rounded-full border-2 border-[#6c4cf5] ${
            current ? 'bg-[#6c4cf5]' : 'bg-white'
          }`}
        />
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[#1c1b33]/60">
        <span>{date}</span>
        {tag && (
          <span className="rounded-full bg-[#6c4cf5]/10 px-2.5 py-0.5 text-xs font-medium text-[#5a3fe0]">
            {tag}
          </span>
        )}
      </div>

      <h4 className="mt-2 text-lg font-semibold leading-snug text-[#1c1b33] sm:text-xl">
        {title}
      </h4>
      {subtitle && <p className="mt-1 text-[15px] text-[#1c1b33]/75">{subtitle}</p>}
      {place && <p className="mt-1 text-sm text-[#1c1b33]/55">{place}</p>}
      {children}
    </article>
  )
}

export default function Journey() {
  const [ref, seen, live] = useVisibility()

  return (
    <section
      id="journey"
      ref={ref}
      className={`relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32 ${
        seen ? 'j-in' : ''
      } ${live ? 'j-live' : ''}`}
    >
      <style>{css}</style>

      {/* Ambient background glow */}
      <span aria-hidden className="j-blob j-blob-a -left-24 top-10 size-80 bg-[#6c4cf5]" />
      <span aria-hidden className="j-blob j-blob-b -right-20 bottom-10 size-96 bg-[#a99bff]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div style={delay(0)} className="j-item max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1b33] sm:text-5xl lg:text-6xl">
            Learning by doing.
            <br />
            <span className="text-[#1c1b33]/55">Growing as I go.</span>
          </h2>
          <p className="mt-5 text-lg text-[#1c1b33]/70">
            A few milestones on my learning journey.
          </p>
        </div>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Education */}
          <div>
            <ColumnTitle icon={GraduationCap}>Education</ColumnTitle>
            <div className="relative">
              <TimelineLine />
              <Entry
                d={150}
                current
                date="Aug 2025 – 2029"
                tag="In progress"
                title="Bachelor of Technology in Computer Science"
                subtitle="Artificial Intelligence & Data Science"
                place="JECRC University, Jaipur"
              />
              <Entry
                d={280}
                ringDelay={1200}
                date="2024"
                title="Higher Secondary"
                subtitle="Physics, Chemistry & Mathematics"
                place="Rawat Public School, Jaipur"
              />
            </div>
          </div>

          {/* Experience and award */}
          <div>
            <ColumnTitle icon={Briefcase}>Experience</ColumnTitle>
            <div className="relative">
              <TimelineLine pulseDelay={1800} />
              <Entry
                d={220}
                ringDelay={600}
                date={experience.period}
                tag="Internship"
                title={experience.company}
                subtitle={experience.role}
                place={experience.location}
              >
                <ul className="mt-4 space-y-2.5">
                  {experience.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-[#1c1b33]/75"
                    >
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#6c4cf5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Entry>
            </div>

            {/* Award: the one dark block, so it stands out */}
            <div
              style={delay(420)}
              className="j-item j-card relative mt-10 flex items-start gap-4 rounded-3xl bg-[#1c1b33] p-6 text-white sm:p-7"
            >
              <span className="j-shine" />
              <span className="j-float grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-amber-300">
                <Award size={21} />
              </span>
              <div>
                <p className="text-sm text-[#a99bff]">A moment to remember</p>
                <h4 className="mt-1 text-lg font-semibold leading-snug">{award.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{award.detail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}