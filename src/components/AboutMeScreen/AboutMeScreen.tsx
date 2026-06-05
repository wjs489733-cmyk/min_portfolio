'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ArchiveMenu from '@/components/ArchiveMenu'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

const aboutLines = [
  '1. ?꾩듅誘쇱?',
  '2. 2001??4??18??,',
  '3. 遺?곌킅??떆 ?댁슫?援??ъ넚?숈뿉??,',
  '4. ?쒖뼱?щ떎.',
  '5. ?援ш??⑤┃??숆탳?먯꽌',
  '6. ?쒓컖?붿옄?몄쓣',
  '7. 怨듬??덇퀬,',
  '8. 釉뚮옖?? 洹몃옒?? ?몄쭛?붿옄?? UXUI瑜??ㅻ，??',
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
          JEON SEUNG MIN
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
          CONTACT
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
          ARCHIVE_0001 -&gt;
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
