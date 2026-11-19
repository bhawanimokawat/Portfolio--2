import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'

// YOUR PHOTO: the file is in the `public` folder (public/varsha.jpeg).
const profileImage = '/varsha.jpeg'

// Tiny dots that float up and down in the background:
// [left %, top %, size in px, seconds for one move, start delay in seconds]
const particles = [
  [6, 14, 6, 8, 0], [18, 78, 8, 10, 1.2], [40, 8, 5, 9, 2], [52, 88, 7, 11, 0.6],
  [66, 18, 6, 7, 1.8], [84, 70, 8, 10, 0.3], [94, 22, 5, 9, 2.4], [30, 50, 5, 12, 1.5],
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4cf5] focus-visible:ring-offset-2'

// Animations that keep running. They only change transform and opacity (cheap for the GPU).
const css = `
@keyframes about-drift { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(40px,30px,0) scale(1.12); } }
@keyframes about-spin  { to { transform: rotate(360deg); } }
@keyframes about-float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
@keyframes about-bob   { 0%, 100% { transform: translateY(0); opacity: .12; } 50% { transform: translateY(-18px); opacity: .5; } }
.about-drift { animation: about-drift var(--t, 20s) ease-in-out var(--s, 0s) infinite alternate; will-change: transform; }
.about-spin  { animation: about-spin var(--t, 60s) linear infinite; will-change: transform; }
.about-rev   { animation-direction: reverse; }
.about-float { animation: about-float var(--t, 6s) ease-in-out var(--s, 0s) infinite alternate; }
.about-bob   { animation: about-bob var(--t, 8s) ease-in-out var(--s, 0s) infinite; }
@media (prefers-reduced-motion: reduce) {
  .about-drift, .about-spin, .about-float { animation: none; }
  .about-bob { animation: none; opacity: .25; }
}
`

// Tells us once, when an element first comes into view (Intersection Observer).
function useSeenOnce(threshold = 0.15) {
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
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, seen] = useSeenOnce()
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

const facts = [
  ['1', 'Innovation internship'],
  ['1+', 'Project in progress'],
  ['2029', 'Graduation year'],
]

export default function About() {
  const photo = useRef(null)

  // Cursor effect on the photo: the arch behind it and the picture inside it
  // slide a little, following the mouse (a soft "depth" feeling).
  // It sets two CSS values directly, so React does not re-render on each move.
  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = photo.current.getBoundingClientRect()
    const px = ((e.clientX - box.left) / box.width - 0.5) * 2 // -1 (left) to 1 (right)
    const py = ((e.clientY - box.top) / box.height - 0.5) * 2 // -1 (top) to 1 (bottom)
    photo.current.style.setProperty('--px', px.toFixed(3))
    photo.current.style.setProperty('--py', py.toFixed(3))
  }
  const onLeave = () => {
    photo.current.style.setProperty('--px', '0')
    photo.current.style.setProperty('--py', '0')
  }

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32"
    >
      <style>{css}</style>

      {/* ---------- Background that keeps moving ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <span
          style={{ '--t': '22s' }}
          className="about-drift absolute -left-28 top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(108,76,245,.10),transparent_65%)]"
        />
        <span
          style={{ '--t': '28s', '--s': '-9s' }}
          className="about-drift absolute -bottom-20 -right-24 size-[32rem] rounded-full bg-[radial-gradient(circle,rgba(169,155,255,.22),transparent_65%)]"
        />
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
            className="about-bob absolute rounded-full bg-[#6c4cf5]"
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1b33] sm:text-5xl lg:text-6xl">
            Curiosity is where
            <br />
            <span className="text-[#1c1b33]/55">everything begins.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Photo in an arch frame (same arch as the Hero) */}
          <Reveal delay={100} className="mx-auto w-full max-w-sm lg:mx-0">
            <div
              ref={photo}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="relative mb-5 mr-5"
            >
              {/* Two thin rings turning slowly around the photo, each with a dot riding on it */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  style={{ '--t': '90s' }}
                  className="about-spin relative size-full rounded-full border border-dashed border-[#6c4cf5]/30"
                >
                  <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c4cf5]" />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 size-[118%] -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  style={{ '--t': '60s' }}
                  className="about-spin about-rev relative size-full rounded-full border border-[#6c4cf5]/20"
                >
                  <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#a99bff]" />
                </div>
              </div>

              {/* Outline arch behind. It slides opposite to the mouse. */}
              <span
                aria-hidden="true"
                style={{
                  transform:
                    'translate(calc(1.25rem + var(--px, 0) * -14px), calc(1.25rem + var(--py, 0) * -14px))',
                }}
                className="absolute inset-0 rounded-t-full border-2 border-[#6c4cf5]/40 transition-transform duration-300 ease-out motion-reduce:transition-none"
              />

              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#e5e0ff]">
                {/* The picture is a little bigger than its frame, so it can slide without showing edges */}
                <img
                  src={profileImage}
                  alt="Portrait of Varsha Dabi"
                  width="800"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  style={{
                    transform:
                      'scale(1.08) translate(calc(var(--px, 0) * 8px), calc(var(--py, 0) * 8px))',
                  }}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out motion-reduce:transition-none"
                />
              </div>

              {/* Small card on the edge of the photo. The outer box floats; the inner box is the card. */}
              <div
                style={{ '--t': '5.5s' }}
                className="about-float absolute -left-3 bottom-12 sm:-left-8"
              >
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-[#1c1b33]/10">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#6c4cf5]/10 text-[#6c4cf5]">
                    <Sparkles size={18} />
                  </span>
                  <span className="text-sm leading-tight text-[#1c1b33]/70">
                    AI &amp; Data Science
                    <b className="block font-semibold text-[#1c1b33]">JECRC University</b>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Words */}
          <Reveal delay={200}>
            <p className="text-2xl font-medium leading-snug text-[#1c1b33] sm:text-3xl">
              I’m an aspiring AI &amp; Data Science student at JECRC University,
              Jaipur, with a big curiosity about the ways technology can help
              people learn, create, and connect.
            </p>

            <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-[#1c1b33]/70">
              <p>
                From experimenting with AI tools to collaborating on an
                education platform, I’m always looking for the next idea worth
                building. Right now, I’m learning the fundamentals and getting
                hands-on with projects that make a difference.
              </p>
              <p>
                I believe good work comes from{' '}
                <strong className="font-semibold text-[#1c1b33]">
                  asking better questions, staying open, and building together.
                </strong>{' '}
                That’s the energy I bring to every new challenge.
              </p>
            </div>

            <a
              href="#journey"
              className={`group mt-8 inline-flex items-center gap-1.5 rounded text-[15px] font-medium text-[#6c4cf5] underline-offset-4 hover:underline ${focusRing}`}
            >
              A little more about my journey
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </Reveal>
        </div>

        {/* Facts */}
        <Reveal delay={100} className="mt-20">
          <div className="grid gap-8 border-t border-[#1c1b33]/10 pt-10 sm:grid-cols-3 lg:grid-cols-4">
            {facts.map(([value, label]) => (
              <div key={label}>
                <p className="text-5xl font-semibold tracking-tight text-[#1c1b33]">
                  {value}
                </p>
                <p className="mt-2 text-[15px] text-[#1c1b33]/60">{label}</p>
              </div>
            ))}
            <p className="text-lg leading-snug text-[#1c1b33]/70 sm:col-span-3 lg:col-span-1 lg:self-end">
              A work in progress, in the best way.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}