
'use client'

import { useState } from 'react'
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'ai', text: 'Hello! I am Smart MarketBD AI Assistant. How can I help you?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    })
    const data = await res.json()
    const reply =
      data?.content ??
      data?.completion?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.message?.content ??
      'Sorry, I could not get a response from the AI service.'

    setMessages(prev => [...prev, { role: 'ai', text: reply }])
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-black p-4 rounded-full shadow-2xl z-50 text-2xl"
      >
        {open ? <FaTimes /> : <FaRobot />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-green-500 text-black px-4 py-3 font-bold flex items-center gap-2">
            <FaRobot /> Smart AI Assistant
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] ${msg.role === 'user' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-zinc-400 px-3 py-2 rounded-xl text-sm">Typing...</div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-zinc-700 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 bg-zinc-800 text-white px-3 py-2 rounded-xl text-sm outline-none"
            />
            <button onClick={sendMessage} className="bg-green-500 text-black p-2 rounded-xl">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  )
}