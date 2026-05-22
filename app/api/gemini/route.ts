import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  
  const response = await fetch(
    https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY},
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: You are the AI assistant of Smart MarketBD, an online marketplace in Bangladesh. Help buyers and sellers. Question: ${message}
          }]
        }]
      })
    }
  )
  
  const data = await response.json()
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not answer.'
  return NextResponse.json({ reply })
}