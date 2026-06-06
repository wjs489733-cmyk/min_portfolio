import type { Metadata } from 'next'
import localFont from 'next/font/local'
import dynamic from 'next/dynamic'
import '@/styles/globals.css'

const PixelTrail = dynamic(() => import('@/components/PixelTrail'), { ssr: false })
const RouteTransition = dynamic(() => import('@/components/RouteTransition'), { ssr: false })

const galmuri = localFont({
  src: '../fonts/Galmuri9.woff2',
  variable: '--font-galmuri',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'INTERACTION | JEON SEUNG MIN',
  description:
    '끊임없이 반복하고 갱신하는 시각디자이너 전승민의 UX/UI, 브랜딩, 편집 디자인 포트폴리오입니다.',
  metadataBase: new URL('https://min-portfolio.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'INTERACTION | JEON SEUNG MIN',
    description:
      'response, interaction, update를 중심으로 구성한 전승민의 현재 버전 포트폴리오입니다.',
    locale: 'ko_KR',
    siteName: "MIN'S ARCHIVE",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INTERACTION | JEON SEUNG MIN',
    description:
      '끊임없이 반복하고 갱신하는 시각디자이너 전승민의 포트폴리오입니다.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={galmuri.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <PixelTrail />
        <RouteTransition />
        {children}
      </body>
    </html>
  )
}
