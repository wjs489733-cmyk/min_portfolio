'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ArchiveMenu from '@/components/ArchiveMenu'
import ScrambleText from '@/components/ScrambleText'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

const aboutLines = [
  '01. 전승민은',
  '02. 2001년 4월 18일 태어났다.',
  '03. 고등학교를 졸업하자마자 건설현장으로 갔다.',
  '04. 처음으로 내 손으로 노동의 대가를 받았다.',
  '05. 그리고 디자인을 선택했다.',
  '06. 보이지 않는 생각에 형태를 주는 일이 멋있어 보였다.',
  '07. 부산에서 태어났고 대구에서 배웠다.',
  '08. 브랜드를 만들고, 그래픽을 그리고, UX를 설계한다.',
  '09. 가장 원하는 건 평온한 삶이다.',
  '10. 무언가를 만들고 다시 고친다.',
  '11. 아직 완성되지 않았다.',
  '12. 끊임없이 갱신하는 디자이너. 전승민입니다.',
]

function at(x: number, y: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
  }
}

function useIdleGlow(lineCount: number) {
  const [idle, setIdle] = useState(false)
  const [activeLine, setActiveLine] = useState(0)

  useEffect(() => {
    let idleTimer: number | undefined

    const resetIdle = () => {
      setIdle(false)
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => setIdle(true), 15000)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart', 'scroll']
    events.forEach((eventName) => window.addEventListener(eventName, resetIdle, { passive: true }))
    resetIdle()

    return () => {
      window.clearTimeout(idleTimer)
      events.forEach((eventName) => window.removeEventListener(eventName, resetIdle))
    }
  }, [])

  useEffect(() => {
    if (!idle) return

    const interval = window.setInterval(() => {
      setActiveLine((current) => (current + 1) % lineCount)
    }, 3400)

    return () => window.clearInterval(interval)
  }, [idle, lineCount])

  return { idle, activeLine }
}

function AboutNav() {
  const topType: React.CSSProperties = {
    ...gal,
    color: '#8a8a8a',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    pointerEvents: 'auto',
  }

  return (
    <div className="about-nav-shell" aria-label="About page navigation">
      <div
        style={{
          position: 'relative',
          width: STAGE_WIDTH,
          height: '100%',
          margin: '0 auto',
        }}
      >
        <Link
          href="/?intro=0"
          className="about-nav-link about-nav-brand"
          style={{
            ...topType,
            ...at(50, 56),
            fontSize: fs(27),
          }}
        >
          <ScrambleText text="JEON SEUNG MIN" />
        </Link>

        <ArchiveMenu
          buttonClassName="about-nav-link"
          wrapperStyle={at(447, 55)}
          buttonStyle={{
            ...topType,
            fontSize: fs(18),
          }}
          menuStyle={{
            ['--archive-menu-top' as string]: fs(33),
            ['--archive-menu-width' as string]: fs(178),
            ['--archive-menu-row-height' as string]: fs(36),
            ['--archive-menu-font-size' as string]: fs(12),
            ['--archive-menu-padding-y' as string]: fs(12),
            ['--archive-menu-padding-x' as string]: fs(14),
          }}
        />

        <Link
          href="/contact"
          className="about-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(1391, 54),
            fontSize: fs(18),
            color: '#f2f2f2',
          }}
        >
          <ScrambleText text="CONTACT" />
        </Link>

        <Link
          href="/projects"
          className="about-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(1712, 54),
            fontSize: fs(18),
          }}
        >
          <ScrambleText text="ARCHIVE_0001 ->" />
        </Link>
      </div>
    </div>
  )
}

function GlowLine({
  text,
  active,
  index,
}: {
  text: string
  active: boolean
  index: number
}) {
  const chars = useMemo(() => Array.from(text), [text])

  return (
    <li className={`about-line ${active ? 'is-auto-glowing' : ''}`} style={{ ['--line-index' as string]: index }}>
      {chars.map((char, charIndex) => (
        <span
          key={`${char}-${charIndex}`}
          className="about-char"
          style={{ ['--char-index' as string]: charIndex }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </li>
  )
}

export default function AboutMeScreen() {
  const { idle, activeLine } = useIdleGlow(aboutLines.length)

  return (
    <main className="about-screen" aria-label="About Me">
      <AboutNav />
      <section className="about-stage">
        <div className="about-stage-inner">
          <ol className={`about-list ${idle ? 'is-idle' : ''}`} aria-label="About Jeon Seung Min">
            {aboutLines.map((line, index) => (
              <GlowLine key={line} text={line} index={index} active={idle && activeLine === index} />
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
