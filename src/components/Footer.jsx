import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Heart } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a99bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14132a]'

// Tells us once, when the footer first comes into view (Intersection Observer).
function useSeenOnce() {
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
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

export default function Footer() {
  const [ref, seen] = useSeenOnce()

  return (
    <footer className="relative bg-[#14132a] px-5 pb-10 pt-14 text-white sm:px-8">
      {/* Thin glowing line on top, to join the Contact section above */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6c4cf5]/60 to-transparent"
      />

      <div
        ref={ref}
        className={`mx-auto max-w-6xl transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          seen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-6">
          <a
            href="#top"
            aria-label="Varsha Dabi, back to the top"
            className={`rounded text-2xl font-semibold tracking-tight sm:text-3xl ${focusRing}`}
          >
            varsha dabi<span className="text-[#a99bff]">.</span>
          </a>

          <a
            href="#top"
            className={`group inline-flex items-center gap-3 rounded-full py-1 pl-4 text-[15px] font-medium text-white/80 transition-colors duration-200 hover:text-white ${focusRing}`}
          >
            Back to top
            <span className="grid size-11 place-items-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-[#6c4cf5] group-hover:bg-[#6c4cf5] motion-reduce:transition-none">
              <ArrowUp
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            </span>
          </a>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="group flex flex-wrap items-center gap-x-1.5">
            © {new Date().getFullYear()} Varsha Dabi. Made with
            <Heart
              size={14}
              aria-label="love"
              className="fill-[#a99bff] text-[#a99bff] transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none"
            />
            and a lot of curiosity.
          </p>
          <p>Designed with curiosity in Jaipur, India.</p>
        </div>
      </div>
    </footer>
  )
}