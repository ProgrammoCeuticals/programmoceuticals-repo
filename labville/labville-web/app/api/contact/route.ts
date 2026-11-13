import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { name, email, message } = body as Record<string, unknown>

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields: name, email, message' },
      { status: 400 }
    )
  }

  console.log('[contact] New submission:', { name, email, message })

  return NextResponse.json(
    { ok: true, message: 'Message received' },
    { status: 200 }
  )
}
