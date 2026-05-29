'use client'

import { useEffect, useRef, useState } from 'react'
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: 'Hello! I am Smart MarketBD AI Assistant. How can I help you?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAttempt, setLastAttempt] = useState<string>('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, loading])

  const extractGroqText = (response: any): string => {
    const rawMessage = response?.content ?? response?.choices?.[0]?.message?.content
    if (typeof rawMessage === 'string') return rawMessage.trim()
    if (Array.isArray(rawMessage)) {
      return rawMessage
        .map((item: any) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .filter(Boolean)
        .join(' ')
        .trim()
    }
    return ''
  }

  const sendMessage = async (message?: string) => {
    const userMsg = message ?? input
    if (!userMsg.trim()) return
    setInput('')
    setError(null)
    setLastAttempt(userMsg)
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })

      const data = await res.json()
      if (!res.ok || data?.error) {
        throw new Error(data?.error || 'AI service returned an invalid response')
      }

      const aiText = extractGroqText(data) || 'Sorry, I could not get a response from the AI service.'
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }])
    } catch (err: any) {
      const message = err?.message || 'Unknown error'
      console.error('AI service error', err)
      setError('AI error: ' + message)
      setMessages((prev) => [...prev, { role: 'ai', text: 'AI error: ' + message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((s) => !s)}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-indigo-500 to-teal-400 text-black p-4 rounded-full shadow-2xl z-[60] text-2xl"
        aria-label="Open AI Assistant"
      >
        {open ? <FaTimes /> : <FaRobot />}
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-20 right-6 w-80 sm:w-96 bg-zinc-900/60 border border-zinc-700 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden glass"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-teal-400 text-black px-4 py-3 font-bold flex items-center gap-2">
            <FaRobot /> Smart AI Assistant
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 text-red-200 border-t border-red-600 text-sm flex items-center justify-between gap-2">
              <span>{error}</span>
              {lastAttempt && !loading && (
                <button
                  onClick={() => sendMessage(lastAttempt)}
                  className="rounded-lg bg-red-500 px-3 py-1 text-black font-semibold hover:bg-red-400 transition"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          <div ref={containerRef} className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`px-3 py-2 rounded-xl text-sm max-w-[90%] ${
                    msg.role === 'user' ? 'bg-indigo-500 text-black' : 'bg-zinc-800 text-white'
                  }`}
                >
                  {msg.text}
                </motion.div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-zinc-400 px-3 py-2 rounded-xl text-sm typing-dots"> <span></span><span></span><span></span> </div>
              </div>
            )}
          </div>

              <div className="p-3 border-t border-zinc-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 bg-transparent text-white px-3 py-2 rounded-xl text-sm outline-none border border-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className={`rounded-xl px-4 py-2 text-black transition ${
                loading
                  ? 'bg-zinc-600 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-500 to-teal-400 hover:scale-[1.02]'
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      )}
    </>
  )
}
