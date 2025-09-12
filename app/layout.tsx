import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '외주팀 족보 V0',
  description: '외주팀 견적조건 및 표준내역 검토 체크리스트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-neutral-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
