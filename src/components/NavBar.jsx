import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Work', '#work'],
  ['Journey', '#journey'],
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4cf5] focus-visible:ring-offset-2'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [dotX, setDotX] = useState(0)
  const linkRefs = useRef({})

  // 1. Know when the page has been scrolled (changes the bar's look)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      if (window.scrollY < 120) setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 2. Know which section is on screen (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`))
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    links.forEach(([, href]) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // 3. Move the little dot under the active link
  useEffect(() => {
    const place = () => {
      const el = linkRefs.current[active]
      if (el) setDotX(el.offsetLeft + el.offsetWidth / 2 - 3)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  // 4. Close the mobile menu with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main navigation"
        className={`relative mx-auto flex max-w-5xl items-center justify-between rounded-full border px-2.5 py-2 backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none ${
          scrolled
            ? 'border-[#1c1b33]/10 bg-white/90 shadow-lg shadow-[#1c1b33]/10'
            : 'border-transparent bg-white/50'
        }`}
      >
        {/* Brand */}
        <a
          href="#top"
          aria-label="Varsha Dabi home"
          className={`flex items-center gap-3 rounded-full pr-3 ${focusRing}`}
        >
          <span className="grid size-9 place-items-center rounded-full bg-[#1c1b33] text-lg font-semibold leading-none text-white">
            v<span className="text-[#a99bff]">.</span>
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold text-[#1c1b33]">
              varsha dabi
            </span>
            <span className="hidden text-xs text-[#1c1b33]/55 md:block">
              Portfolio 2025
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="relative hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              ref={(el) => (linkRefs.current[href] = el)}
              aria-current={active === href ? 'true' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#1c1b33] ${focusRing} ${
                active === href ? 'text-[#1c1b33]' : 'text-[#1c1b33]/60'
              }`}
            >
              {label}
            </a>
          ))}
          {/* The sliding dot: only moves with transform + opacity (cheap) */}
          <span
            aria-hidden="true"
            style={{ transform: `translateX(${dotX}px)` }}
            className={`pointer-events-none absolute -bottom-0.5 left-0 size-1.5 rounded-full bg-[#6c4cf5] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Contact button */}
        <a
          href="#contact"
          className={`group hidden items-center gap-1.5 rounded-full bg-[#1c1b33] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#6c4cf5] md:inline-flex ${focusRing}`}
        >
          Let's talk
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`grid size-10 place-items-center rounded-full text-[#1c1b33] transition-colors hover:bg-[#1c1b33]/5 md:hidden ${focusRing}`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile menu: stays in the page, fades and slides (opacity + transform) */}
        <div
          id="mobile-menu"
          className={`absolute inset-x-0 top-full mt-2 origin-top rounded-3xl border border-[#1c1b33]/10 bg-white p-2 shadow-xl shadow-[#1c1b33]/10 transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none md:hidden ${
            open
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block rounded-2xl px-4 py-3 text-base font-medium ${focusRing} ${
                active === href
                  ? 'bg-[#6c4cf5]/10 text-[#6c4cf5]'
                  : 'text-[#1c1b33] hover:bg-[#1c1b33]/5'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className={`mt-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#1c1b33] px-4 py-3 text-base font-medium text-white ${focusRing}`}
          >
            Let's talk <ArrowUpRight size={16} />
          </a>
        </div>
      </nav>
    </header>
  )
}