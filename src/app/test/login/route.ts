import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const headers = new Headers({
    vary: 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '0',
    'referrer-policy': 'no-referrer',
    'content-length': '0', // Important for matching the original response
  });

  // Set cookies in the headers (adjust values as needed)
  headers.set('set-cookie', 'accessToken=eyJhbGciOiJIUzI1NiJ9...; Max-Age=60000; Expires=Thu, 25 Jul 2024 00:15:47 GMT; Path=/, refreshToken=eyJhbGciOiJIUzI1NiJ9...; Max-Age=2592000000; Expires=Mon, 13 Sep 2106 07:35:47 GMT; Path=/, username=qwerty@qwerty.com; Max-Age=60000; Expires=Thu, 25 Jul 2024 00:15:47 GMT; Path=/, nickname=; Max-Age=60000; Expires=Thu, 25 Jul 2024 00:15:47 GMT; Path=/');

  return new NextResponse(null, { // Empty body
    status: 200,
    statusText: 'OK',
    headers: headers,
  });
}
