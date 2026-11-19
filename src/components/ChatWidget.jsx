import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { faqs, findFaq } from '../data/faq.js'

// Empty in development (uses the Vite proxy). Set VITE_API_URL when you deploy the backend separately.
const API = import.meta.env.VITE_API_URL || ''

// Quick-question buttons (the FAQs marked chip: true)
const chips = faqs.filter((f) => f.chip)

const greeting = {
  role: 'assistant',
  content: 'Hi! Ask me anything about Varsha’s projects, skills or experience.',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([greeting])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  async function send(text) {
    const content = text.trim()
    if (!content || loading) return

    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)

    // 1) Locked answer from faq.js: no request is sent
    const faq = findFaq(content)
    if (faq) {
      setTimeout(() => {
        setMessages([...next, { role: 'assistant', content: faq.answer }])
        setLoading(false)
      }, 500) // short pause so it feels natural
      return
    }

    // 2) Everything else goes to the backend
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // skip the greeting so the conversation starts with the visitor
        body: JSON.stringify({ messages: next.slice(1) }),
      })
      const data = await res.json().catch(() => ({}))
      const reply = data.reply ?? data.error ?? 'Something went wrong. Please try again.'
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Varsha's assistant"
          className="fixed bottom-24 right-4 z-50 flex h-[30rem] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-[#1c1b33]/10 bg-white shadow-2xl shadow-[#1c1b33]/25 sm:right-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#1c1b33] px-5 py-4 text-white">
            <div>
              <p className="font-semibold leading-tight">Ask about Varsha</p>
              <p className="text-xs text-white/60">Projects · Skills · Experience</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-[#6c4cf5] text-white'
                      : 'rounded-bl-md bg-[#f6f5fb] text-[#1c1b33]'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-md bg-[#f6f5fb] px-4 py-3">
                  <span className="flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-[#1c1b33]/40" />
                    <span className="size-1.5 animate-bounce rounded-full bg-[#1c1b33]/40 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-[#1c1b33]/40 [animation-delay:300ms]" />
                  </span>
                </p>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chips.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => send(f.question)}
                    className="rounded-full border border-[#6c4cf5]/30 px-3 py-1.5 text-xs font-medium text-[#5a3fe0] transition-colors hover:bg-[#6c4cf5]/10"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-[#1c1b33]/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              maxLength={300}
              placeholder="Ask a question…"
              aria-label="Your question"
              className="flex-1 rounded-full bg-[#f6f5fb] px-4 py-2.5 text-sm text-[#1c1b33] outline-none focus:ring-2 focus:ring-[#6c4cf5]"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="grid size-10 place-items-center rounded-full bg-[#6c4cf5] text-white transition-opacity disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className="fixed bottom-5 right-4 z-50 grid size-14 place-items-center rounded-full bg-[#6c4cf5] text-white shadow-lg shadow-[#6c4cf5]/40 transition-transform hover:scale-105 sm:right-6"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#6c4cf5] opacity-30 motion-reduce:animate-none" />
        )}
        <span className="relative">{open ? <X size={22} /> : <MessageCircle size={22} />}</span>
      </button>
    </>
  )
}