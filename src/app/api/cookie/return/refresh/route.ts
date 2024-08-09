import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { refreshToken } = await request.json()
  console.log('refresh/route.ts 에서 보내는 토큰입니다.' + refreshToken)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: refreshToken,
    },
  })

  const toReturn = new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
  console.log('refresh/route.ts 에서 받은 응답입니다.')
  console.log(toReturn)
  // 백엔드로부터 받은 응답을 그대로 리턴
  return toReturn
}
