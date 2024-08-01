import { type Metadata } from 'next'
import { GeistSans } from "geist/font/sans";
import '@/styles/globals.css'
import { cookies } from 'next/headers'
import Header from '@/components/common/Header'

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
  const cookieStore = cookies()
  return (
    <html lang="ko" className={GeistSans.className}>
      <body>
      <Header />
      {children}
      </body>
    </html>
  )
}
