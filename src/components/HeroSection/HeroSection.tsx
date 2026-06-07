'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const CATEGORIES = [
  { label: 'SHOW ALL', href: '/projects' },
  { label: 'UX/UI', href: '/projects?cat=uxui' },
  { label: 'BRANDING', href: '/projects?cat=branding' },
  { label: 'EDITORIAL', href: '/projects?cat=editorial' },
  { label: 'PACKAGE', href: '/projects?cat=package' },
  { label: 'GRAPHIC', href: '/projects?cat=graphic' },
  { label: 'ETC', href: '/projects?cat=etc' },
]

const pct = (value: number, base: number) => `${(value / base) * 100}%`
const fs = (px: number) => `calc(min(100vw, 177.777778svh) * ${px / 1920})`
const seoulDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  hourCycle: 'h23',
})

function at(x: number, y: number, width?: number, height?: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pct(x, 1920),
    top: pct(y, 1080),
    width: width ? pct(width, 1920) : undefined,
    height: height ? pct(height, 1080) : undefined,
  }
}

function TypedText({
  active,
  text,
  delay = 0,
  speed = 30,
  cursorWhileTyping = false,
}: {
  active: boolean
  text: string
  delay?: number
  speed?: number
  cursorWhileTyping?: boolean
}) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!active) {
      let eraseTimer: number | undefined

      eraseTimer = window.setInterval(() => {
        setValue((current) => {
          if (current.length <= 0) {
            if (eraseTimer) window.clearInterval(eraseTimer)
            return ''
          }

          return current.slice(0, Math.max(0, current.length - 2))
        })
      }, 18)

      return () => {
        if (eraseTimer) window.clearInterval(eraseTimer)
      }
    }

    let index = 0
    let timerId: number | undefined
    let cancelled = false

    const typeNext = () => {
      if (cancelled) return

      index += 1
      setValue(text.slice(0, index))

      if (index < text.length) {
        const jitter = Math.floor(Math.random() * 18)
        timerId = window.setTimeout(typeNext, speed + jitter)
      }
    }

    const startId = window.setTimeout(typeNext, delay)

    return () => {
      cancelled = true
      window.clearTimeout(startId)
      if (timerId) window.clearTimeout(timerId)
    }
  }, [active, delay, speed, text])

  return (
    <>
      {value}
      {cursorWhileTyping && active && value.length > 0 && value.length < text.length && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.018em',
            height: '0.9em',
            marginLeft: '0.06em',
            background: '#ffffff',
            verticalAlign: '-0.05em',
            animation: 'blink 0.72s step-end infinite',
          }}
        />
      )}
    </>
  )
}

function InteractiveTitleText({
  active,
  text,
  delay = 0,
  speed = 30,
}: {
  active: boolean
  text: string
  delay?: number
  speed?: number
}) {
  const [value, setValue] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!active) {
      let eraseTimer: number | undefined

      eraseTimer = window.setInterval(() => {
        setValue((current) => {
          if (current.length <= 0) {
            if (eraseTimer) window.clearInterval(eraseTimer)
            return ''
          }

          return current.slice(0, Math.max(0, current.length - 2))
        })
      }, 18)

      return () => {
        if (eraseTimer) window.clearInterval(eraseTimer)
      }
    }

    let index = 0
    let timerId: number | undefined
    let cancelled = false

    const typeNext = () => {
      if (cancelled) return

      index += 1
      setValue(text.slice(0, index))

      if (index < text.length) {
        const jitter = Math.floor(Math.random() * 18)
        timerId = window.setTimeout(typeNext, speed + jitter)
      }
    }

    const startId = window.setTimeout(typeNext, delay)

    return () => {
      cancelled = true
      window.clearTimeout(startId)
      if (timerId) window.clearTimeout(timerId)
    }
  }, [active, delay, speed, text])

  return (
    <>
      {value.split('').map((letter, index) => {
        const glowing = hoveredIndex === index

        return (
          <span
            key={`${letter}-${index}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: 'inline-block',
              color: glowing ? '#f2f2f2' : '#868686',
              textShadow: glowing
                ? '0 0 10px rgba(255,255,255,0.72), 0 0 24px rgba(255,255,255,0.32)'
                : 'none',
              filter: glowing ? 'drop-shadow(0 0 8px rgba(255,255,255,0.24))' : 'none',
              transition: 'color 0.12s steps(2,end), text-shadow 0.12s steps(2,end), filter 0.12s steps(2,end)',
            }}
          >
            {letter}
          </span>
        )
      })}
      {active && value.length < text.length && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.018em',
            height: '0.9em',
            marginLeft: '0.06em',
            background: '#ffffff',
            verticalAlign: '-0.05em',
            animation: 'blink 0.72s step-end infinite',
          }}
        />
      )}
    </>
  )
}

function getSeoulDateTime() {
  const parts = seoulDateTimeFormatter.formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    date: `${values.year}/${values.month}/${values.day}`,
    time: `${values.hour}:${values.minute} GMT+9`,
  }
}

function LiveSeoulText({
  active,
  type,
  delay,
  speed = 28,
}: {
  active: boolean
  type: 'date' | 'time'
  delay: number
  speed?: number
}) {
  const [value, setValue] = useState('')
  const [hasTyped, setHasTyped] = useState(false)

  useEffect(() => {
    if (!active) {
      let eraseTimer: number | undefined

      eraseTimer = window.setInterval(() => {
        setValue((current) => {
          if (current.length <= 0) {
            if (eraseTimer) window.clearInterval(eraseTimer)
            setHasTyped(false)
            return ''
          }

          return current.slice(0, Math.max(0, current.length - 2))
        })
      }, 18)

      return () => {
        if (eraseTimer) window.clearInterval(eraseTimer)
      }
    }

    let index = 0
    let timerId: number | undefined
    let cancelled = false
    const target = getSeoulDateTime()[type]
    setHasTyped(false)

    const typeNext = () => {
      if (cancelled) return

      index += 1
      setValue(target.slice(0, index))

      if (index < target.length) {
        timerId = window.setTimeout(typeNext, speed)
      } else {
        setHasTyped(true)
      }
    }

    const startId = window.setTimeout(typeNext, delay)

    return () => {
      cancelled = true
      window.clearTimeout(startId)
      if (timerId) window.clearTimeout(timerId)
    }
  }, [active, delay, speed, type])

  useEffect(() => {
    if (!active || !hasTyped) return

    const update = () => setValue(getSeoulDateTime()[type])

    update()
    const intervalId = window.setInterval(update, 1000)

    return () => window.clearInterval(intervalId)
  }, [active, hasTyped, type])

  return <>{value}</>
}

function PixelDots({ visible }: { visible: boolean }) {
  const dotState: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.28s steps(4,end)',
  }

  return (
    <>
      <span
        style={{
          ...at(1433, 450, 13, 13),
          ...dotState,
          background: 'rgba(255,255,255,0.4)',
          animation: 'pixelPulse 1.4s steps(1,end) infinite',
        }}
      />
      <span
        style={{
          ...at(1433, 464, 13, 14),
          ...dotState,
          background: 'rgba(255,255,255,0.5)',
          animation: 'pixelPulse 1.4s steps(1,end) infinite 0.16s',
        }}
      />
      <span
        style={{
          ...at(1433, 479, 13, 13),
          ...dotState,
          background: '#ffffff',
          animation: 'pixelPulse 1.4s steps(1,end) infinite 0.32s',
        }}
      />
    </>
  )
}

function TitleCaret({ visible }: { visible: boolean }) {
  const caret = {
    background: '#ffffff',
    animation: 'blink 0.9s step-end infinite',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.16s ease',
    transitionDelay: visible ? '1120ms' : '0ms',
  }

  return (
    <span aria-hidden>
      <span style={{ ...at(1386.5, 352, 2, 141.3), ...caret }} />
      <span style={{ ...at(1379.8, 352, 15.4, 2), ...caret }} />
      <span style={{ ...at(1379.8, 492, 15.4, 2), ...caret }} />
    </span>
  )
}

function VersionBox({ playTyping, visible }: { playTyping: boolean; visible: boolean }) {
  const box = (x: number, y: number, width?: number, height?: number): React.CSSProperties => ({
    position: 'absolute',
    left: pct(x - 473.659, 188.393),
    top: pct(y - 618.207, 119.793),
    width: width ? pct(width, 188.393) : undefined,
    height: height ? pct(height, 119.793) : undefined,
  })

  return (
    <div
      style={{
        ...at(473.659, 618.207, 188.393, 119.793),
        border: '1px solid rgba(255,255,255,0.9)',
        color: '#ffffff',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.32s steps(5,end)',
      }}
    >
      <span
        style={{
          ...gal,
          ...box(480, 627.5, 54, 14),
          fontSize: fs(14),
          lineHeight: 1,
        }}
      >
        <TypedText active={playTyping} text="VERSION" delay={900} speed={34} />
      </span>
      <span style={{ ...box(640.55, 633.565, 12.287, 1.024), background: '#ffffff' }} />
      <span style={{ ...box(645.67, 627.421, 1.024, 12.287), background: '#ffffff' }} />

      <span
        style={{
          ...gal,
          ...box(480.204, 655.698, 76, 14),
          fontSize: fs(14),
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <TypedText active={playTyping} text="_ 26.05.10" delay={1060} speed={34} />
      </span>

      <span style={{ ...box(640.55, 721.618, 12.287, 1.024), background: '#ffffff' }} />
      <span style={{ ...box(645.67, 716.499, 1.024, 12.287), background: '#ffffff' }} />

      {Array.from({ length: 15 }).map((_, index) => (
        <span
          key={index}
          style={{
            position: 'absolute',
            left: pct(480 + index * 3.95 - 473.659, 188.393),
            top: pct(714.451 - 618.207, 119.793),
            width: pct(index % 3 === 1 ? 1.024 : 2.048, 188.393),
            height: pct(14.334, 119.793),
            background: `rgba(255,255,255,${Math.max(0.05, 1 - index * 0.065)})`,
          }}
        />
      ))}
    </div>
  )
}

function PixelArrow({ active }: { active: boolean }) {
  const pixels = [
    [6, 0, 0],
    [5, 1, 1],
    [4, 2, 2],
    [3, 3, 3],
    [2, 4, 4],
    [1, 5, 5],
    [0, 6, 6],
    [0, 5, 7],
    [1, 6, 7],
    [0, 4, 8],
    [2, 6, 8],
    [0, 3, 9],
    [3, 6, 9],
  ]

  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        transform: active ? 'translate(-8px, 8px)' : 'translate(0, 0)',
        transition: 'transform var(--t-base)',
      }}
    >
      {pixels.map(([x, y, phase]) => (
        <span
          key={`${x}-${y}`}
          className="home-arrow-pixel"
          style={{
            position: 'absolute',
            left: pct(x * 14.48, 101.37),
            top: pct(y * 14.48, 101.363),
            width: pct(14.48, 101.37),
            height: pct(14.48, 101.363),
            background: 'rgba(255,255,255,0.3)',
            opacity: 0.34,
            animation: `arrowPixel 1.45s steps(1,end) ${phase * 0.075}s infinite both`,
          }}
        />
      ))}
    </span>
  )
}

export default function HeroSection({
  playTyping,
  onExitComplete,
  onIntroRequest,
  erasing = false,
}: {
  playTyping: boolean
  onExitComplete: () => void
  onIntroRequest: () => void
  erasing?: boolean
}) {
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveClosing, setArchiveClosing] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [sectionOpacity, setSectionOpacity] = useState(1)
  const archiveCloseTimerRef = useRef<number>()
  const archiveVisible = archiveOpen || archiveClosing

  useEffect(
    () => () => {
      window.clearTimeout(archiveCloseTimerRef.current)
    },
    [],
  )

  const closeArchive = () => {
    if (!archiveOpen || archiveClosing) return

    window.clearTimeout(archiveCloseTimerRef.current)
    setArchiveOpen(false)
    setArchiveClosing(true)
    archiveCloseTimerRef.current = window.setTimeout(() => setArchiveClosing(false), 260)
  }

  const toggleArchive = () => {
    if (archiveOpen) {
      closeArchive()
      return
    }

    window.clearTimeout(archiveCloseTimerRef.current)
    setArchiveClosing(false)
    setArchiveOpen(true)
  }

  const handleExit = useCallback(async () => {
    if (isExiting) return

    setIsExiting(true)
    setArchiveOpen(false)
    setArchiveClosing(false)
    await sleep(880)
    setSectionOpacity(0)
    await sleep(220)
    onExitComplete()
  }, [isExiting, onExitComplete])

  const visible = playTyping && !erasing && !isExiting
  const objectState: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.32s steps(5,end)',
  }

  return (
    <section
      className="hero-screen"
      aria-label="Home intro screen"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        background: '#131313',
        opacity: sectionOpacity,
        transition: 'opacity 0.52s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 'min(100vw, 177.777778svh)',
          height: 'min(100svh, 56.25vw)',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
        }}
      >
      <button
        type="button"
        className="home-top-type"
        onClick={onIntroRequest}
        aria-label="Return to intro page"
        style={{
          ...gal,
          ...at(50, 56),
          zIndex: 20,
          fontSize: fs(27),
          lineHeight: 1,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <TypedText active={visible} text="JEON SEUNG MIN" delay={60} speed={32} />
      </button>

      <button
        type="button"
        className="home-top-type"
        aria-expanded={archiveOpen && !archiveClosing}
        aria-label="Open archive categories"
        onClick={toggleArchive}
        style={{
          ...gal,
          ...at(447, 55),
          zIndex: 20,
          fontSize: fs(18),
          lineHeight: 1,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <TypedText active={visible} text="MIN'S ARCHIVE" delay={220} speed={32} />
      </button>

      {archiveVisible && (
        <div
          className={`home-archive-lnb ${archiveClosing ? 'is-closing' : ''}`}
          style={{
            ...at(447, 88),
            zIndex: 30,
            display: 'grid',
            minWidth: fs(178),
            border: '1px solid rgba(255,255,255,0.68)',
            background: 'rgba(23,23,23,0.96)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {CATEGORIES.map(({ label, href }, index) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              data-transition-kind="archive-lnb"
              style={{
                ...gal,
                fontSize: fs(12),
                lineHeight: 1,
                color: label === 'SHOW ALL' ? '#ffffff' : 'rgba(255,255,255,0.58)',
                padding: `${fs(12)} ${fs(14)}`,
                borderBottom: '1px solid rgba(255,255,255,0.14)',
                whiteSpace: 'nowrap',
              }}
            >
              <TypedText
                active={archiveOpen && visible && !archiveClosing}
                text={label}
                delay={index * 46}
                speed={18}
                cursorWhileTyping
              />
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/projects"
        className="home-top-type"
        style={{
          ...gal,
          ...at(1712, 54),
          zIndex: 20,
          fontSize: fs(18),
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <TypedText active={visible} text="ARCHIVE_0001 ->" delay={380} speed={31} />
      </Link>

      <h1
        style={{
          ...gal,
          ...at(473.659, 339),
          fontSize: fs(150),
          lineHeight: 1,
          color: '#868686',
          fontWeight: 400,
          letterSpacing: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <InteractiveTitleText active={visible} text="INTERACTION" delay={520} speed={46} />
      </h1>

      <TitleCaret visible={visible} />
      <PixelDots visible={visible} />

      <span style={{ ...at(473.659, 521.987, 972.681, 2), ...objectState, background: '#ffffff' }} />

      <span
        style={{
          ...gal,
          ...at(473.659, 545.95),
          fontSize: fs(24),
          lineHeight: 1,
          color: '#ffffff',
          whiteSpace: 'pre',
        }}
      >
        <TypedText active={visible} text="RESPONSE   /   INTERACTION   /   UPDATE" delay={1280} speed={22} />
      </span>

      <span
        style={{
          ...gal,
          ...at(1254.87, 545.95),
          fontSize: fs(24),
          lineHeight: 1,
          color: '#ffffff',
          whiteSpace: 'nowrap',
        }}
      >
        <TypedText active={visible} text="CURRENT VERSION" delay={1460} speed={24} />
      </span>

      <VersionBox playTyping={visible} visible={visible} />

      <button
        type="button"
        className="home-arrow-button"
        aria-label="Go to home landing page"
        onClick={handleExit}
        disabled={isExiting}
        style={{
          ...at(1344.97, 636.637, 101.37, 101.363),
          zIndex: 20,
          cursor: isExiting ? 'default' : 'pointer',
          pointerEvents: isExiting ? 'none' : 'auto',
          ...objectState,
        }}
      >
        <PixelArrow active={isExiting} />
      </button>

      <span
        style={{
          ...gal,
          ...at(50, 1008),
          fontSize: fs(18),
          lineHeight: 1,
          color: 'rgba(255,255,255,0.7)',
          whiteSpace: 'nowrap',
        }}
      >
        <LiveSeoulText active={visible} type="date" delay={1680} speed={28} />
      </span>
      <span
        style={{
          ...gal,
          ...at(447, 1008),
          fontSize: fs(18),
          lineHeight: 1,
          color: 'rgba(255,255,255,0.7)',
          whiteSpace: 'nowrap',
        }}
      >
        <LiveSeoulText active={visible} type="time" delay={1780} speed={28} />
      </span>
      <span
        style={{
          ...gal,
          ...at(1618, 1016.2),
          fontSize: fs(10.8),
          lineHeight: 1,
          color: 'rgba(255,255,255,0.7)',
          whiteSpace: 'nowrap',
        }}
      >
        <TypedText active={visible} text={"\u00A9 2026 min's archive all rights reserved."} delay={1900} speed={18} />
      </span>
      </div>
    </section>
  )
}
