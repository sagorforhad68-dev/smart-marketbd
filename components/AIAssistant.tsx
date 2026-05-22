'use client'

import { useState } from 'react'

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { from: 'user', text: input }])
    const reply = getReply(input)
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'ai', text: reply }])
    }, 500)
    setInput('')
  }

  const getReply = (q: string) => {
    if (q.toLowerCase().includes('price'))
      return 'When negotiating, try: "Can you give a small discount? What is your best price?"'
    if (q.toLowerCase().includes('available'))
      return 'Ask: "Is this item still available?"'
    return 'Be polite and respond quickly to buyers!'
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-50"
      >
        <span className="text-2xl">🛵</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
              🛵
            </div>
            <div>
              <h3 className="font-bold">Delivery Assistant</h3>
              <p className="text-xs opacity-80">Always online to help</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">
                👋 Hello! I&apos;m here to help you with selling tips.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
                {m.from === 'ai' && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">🛵</span>
                    <span className="text-xs font-bold text-orange-600">Delivery Man</span>
                  </div>
                )}
                <span className={`inline-block p-2 rounded-lg max-w-[80%] ${
                  m.from === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow text-gray-800'
                }`}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}