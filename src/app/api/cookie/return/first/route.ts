import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/local`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  )

  const toReturn = new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
  console.log(toReturn)
  // 백엔드로부터 받은 응답을 그대로 리턴
  return toReturn
}
