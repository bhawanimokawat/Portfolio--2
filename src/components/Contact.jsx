import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a99bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1b33]'

const details = [
  {
    icon: Mail,
    label: 'Drop me a line',
    value: 'varshadabi1121@gmail.com',
    href: 'mailto:varshadabi1121@gmail.com',
  },
  {
    icon: Phone,
    label: 'Give me a call',
    value: '+91 99838 84166',
    href: 'tel:+919983884166',
  },
  {
    icon: Linkedin,
    label: 'Let’s connect',
    value: 'LinkedIn profile',
    href: 'https://www.linkedin.com/in/varsha-dabi-550204370',
    external: true,
  },
]

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

export default function Contact() {
  // Moves the soft violet light under the mouse. It sets two CSS values
  // directly, so React does not re-render on every mouse move.
  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`)
  }

  return (
    <section
      id="contact"
      onMouseMove={onMove}
      className="group relative overflow-hidden bg-[#1c1b33] px-5 py-24 text-white sm:px-8 sm:py-32"
    >
      {/* Soft light that follows the mouse (only while the mouse is over this section) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(108,76,245,.22), transparent 65%)',
        }}
      />
      {/* Big outline arch, the same shape as in the Hero */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-16 hidden h-[28rem] w-72 rounded-t-full border-2 border-white/10 lg:block"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Have a good idea?
            <br />
            <span className="text-white/55">I’d love to hear it.</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Open to collaborations, internships, and new conversations.
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Big call to action */}
          <Reveal delay={100}>
            <a
              href="mailto:varshadabi1121@gmail.com"
              className={`group/cta inline-flex items-center gap-5 rounded-full ${focusRing}`}
            >
              <span className="text-5xl font-semibold tracking-tight sm:text-7xl">
                Say hello
              </span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-[#1c1b33] transition-colors duration-300 group-hover/cta:bg-[#6c4cf5] group-hover/cta:text-white motion-reduce:transition-none sm:size-20">
                <ArrowUpRight
                  className="size-7 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none sm:size-9"
                />
              </span>
            </a>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Have a project in mind, a question, or just want to connect? My
              inbox is always open.
            </p>
          </Reveal>

          {/* Ways to reach me */}
          <Reveal delay={200}>
            <ul className="space-y-3">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className={`group/row flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-[background-color,transform] duration-200 hover:translate-x-1 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-x-0 ${focusRing}`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#6c4cf5]/25 text-[#c9bfff]">
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-white/55">{label}</span>
                      <span className="block break-words font-medium">{value}</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-white/50 transition-[transform,color] duration-200 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-white motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <MapPin size={16} />
              Jaipur, Rajasthan, India
            </p>
          </Reveal>
        </div>

        {/* Closing line */}
        <Reveal delay={100} className="mt-24 border-t border-white/10 pt-10">
          <p className="text-2xl font-medium leading-snug text-white/80 sm:text-3xl">
            Good things start
            <br />
            with a hello.
          </p>
        </Reveal>
      </div>
    </section>
  )
}