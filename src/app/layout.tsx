import { type Metadata } from 'next'
import { GeistSans } from "geist/font/sans";
import '@/styles/globals.css'
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    template: '%s - teTrips',
    default: 'teTrips - 여행 계획',
  },
  description: '여행 계획은 역시 테트립스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${GeistSans.className} h-full`}>
      <body className="h-full">
      <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAPS_API_KEY}&submodules=geocoder`}
          strategy="beforeInteractive"
          />
      {children}
      </body>
    </html>
  )
}
