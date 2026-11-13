import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { serviceCategory, collectionMethod, preferredDate, preferredTime, contactInfo } =
    body as Record<string, unknown>

  if (!serviceCategory || !collectionMethod || !preferredDate || !preferredTime || !contactInfo) {
    return NextResponse.json(
      { ok: false, error: 'Missing required booking fields' },
      { status: 400 }
    )
  }

  // Generate 8-char uppercase alphanumeric reference
  const reference = Array.from({ length: 8 }, () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return chars.charAt(Math.floor(Math.random() * chars.length))
  }).join('')

  console.log('[booking] New booking:', { serviceCategory, collectionMethod, preferredDate, preferredTime, reference })

  return NextResponse.json(
    { ok: true, reference },
    { status: 200 }
  )
}
