import { useEffect, useRef } from 'react'

// A soft ring that follows the mouse with a small delay (like it is floating).
// - It grows when the mouse is over a link or button.
// - It shrinks a little when you press.
// - It does NOT replace your normal mouse arrow, so nothing feels strange.
// - It is not used on phones or tablets (they have no mouse) or when the person
//   turned off animations in their device settings.
export default function Cursor() {
  const ring = useRef(null)

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduce) return

    const el = ring.current
    let x = 0, y = 0 // where the mouse really is
    let rx = 0, ry = 0 // where the ring is now (it chases the mouse)
    let scale = 1
    let target = 1 // the size the ring wants to have
    let pressed = false
    let overLink = false
    let seen = false
    let raf = 0

    const draw = () => {
      raf = 0
      // Move 18% of the way to the mouse on every frame. This makes the smooth trailing.
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      scale += (target - scale) * 0.2
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`

      // Keep running only while something is still moving. When the mouse rests, we stop.
      const moving =
        Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 || Math.abs(target - scale) > 0.01
      if (moving) raf = requestAnimationFrame(draw)
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const setTarget = () => {
      target = (overLink ? 1.9 : 1) * (pressed ? 0.8 : 1)
      start()
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!seen) {
        seen = true
        rx = x
        ry = y
        el.style.opacity = '1'
      }
      start()
    }
    const onOver = (e) => {
      const hit = e.target.closest?.(
        'a, button, [role="button"], input, textarea, select, summary, label'
      )
      overLink = Boolean(hit)
      el.dataset.hover = overLink ? 'true' : 'false'
      setTarget()
    }
    const onDown = () => {
      pressed = true
      setTarget()
    }
    const onUp = () => {
      pressed = false
      setTarget()
    }
    const onLeave = () => {
      el.style.opacity = '0'
      seen = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ring}
      aria-hidden="true"
      data-hover="false"
      className="pointer-events-none fixed left-0 top-0 z-[9999] size-9 rounded-full border-2 border-[#6c4cf5]/70 opacity-0 transition-[opacity,background-color] duration-200 will-change-transform data-[hover=true]:bg-[#6c4cf5]/15"
    />
  )
}