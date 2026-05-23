import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const PRIMARY_MODEL = 'llama-3.3-70b-versatile'
const FALLBACK_MODEL = 'llama-3.1-8b-instant'

const parseResponseContent = (response: any): string => {
  const rawContent = response?.choices?.[0]?.message?.content
  if (typeof rawContent === 'string') return rawContent.trim()
  if (Array.isArray(rawContent)) {
    return rawContent
      .map((item: any) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .filter(Boolean)
      .join(' ')
      .trim()
  }
  return ''
}

const createCompletion = async (client: Groq, model: string, message: string) => {
  return client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: message }],
    max_tokens: 512,
    temperature: 0.7,
  })
}

export async function POST(request: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'Missing Groq API key' }, { status: 500 })
  }

  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const client = new Groq({ apiKey: GROQ_API_KEY, timeout: 60000 })
  let response: any

  try {
    response = await createCompletion(client, PRIMARY_MODEL, message)
  } catch (primaryError: unknown) {
    const errorMessage = primaryError instanceof Error ? primaryError.message : String(primaryError)
    console.warn('Primary Groq model error:', errorMessage)

    if (errorMessage.includes('model_decommissioned') || errorMessage.includes('unsupported')) {
      try {
        response = await createCompletion(client, FALLBACK_MODEL, message)
      } catch (fallbackError: unknown) {
        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        console.error('Fallback Groq model error:', fallbackMessage)
        return NextResponse.json({ error: fallbackMessage }, { status: 502 })
      }
    } else {
      return NextResponse.json({ error: errorMessage }, { status: 502 })
    }
  }

  const content = parseResponseContent(response)
  if (!content) {
    console.warn('Groq API returned an unexpected response', response)
    return NextResponse.json({ error: 'AI response was invalid. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ content })
}
