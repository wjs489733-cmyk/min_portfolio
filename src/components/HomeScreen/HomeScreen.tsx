'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const CATEGORIES = [
  { label: 'SHOW ALL', href: '/projects' },
  { label: 'UX/UI', href: '/projects?cat=uxui' },
  { label: 'BRANDING', href: '/projects?cat=branding' },
  { label: 'EDITORIAL', href: '/projects?cat=editorial' },
  { label: 'PACKAGE', href: '/projects?cat=package' },
  { label: 'GRAPHIC', href: '/projects?cat=graphic' },
  { label: 'ECT', href: '/projects?cat=ect' },
]

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

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

type OrbitFrame = {
  id: string
  title: string
  lines: string[]
  image?: string
  tone: string
  width: number
  height: number
  tilt: number
}

type LandingSceneId = 'identity' | 'defined' | 'memory' | 'interaction' | 'version' | 'closing'

type LandingTypingTextProps = {
  active: boolean
  text: string
  delay?: number
  speed?: number
  eraseSpeed?: number
  className?: string
}

const orbitFrames: OrbitFrame[] = [
  {
    id: '00',
    title: 'BIRTH',
    lines: ['전승민은', '2001년 4월 18일', '태어났다.'],
    tone: '#f2f2f2',
    width: 196,
    height: 258,
    tilt: -7,
  },
  {
    id: '01',
    title: 'LABOR',
    lines: ['고등학교를 졸업하자마자', '건설현장으로 갔다.', '처음으로 내 손으로', '노동의 대가를 받았다.'],
    tone: '#cfcfcf',
    width: 238,
    height: 178,
    tilt: 5,
  },
  {
    id: '02',
    title: 'DESIGN',
    lines: ['그리고 디자인을 선택했다.', '보이지 않는 생각에', '형태를 주는 일이', '멋있어 보였다.'],
    tone: '#8e8e8e',
    width: 174,
    height: 248,
    tilt: -3,
  },
  {
    id: '03',
    title: 'CITY',
    lines: ['부산에서 태어났고', '대구에서 배웠다.', '두 도시의 속도와 온도가', '내 안에 남아 있다.'],
    tone: '#ffffff',
    width: 222,
    height: 156,
    tilt: 8,
  },
  {
    id: '04',
    title: 'BOUNDARY',
    lines: ['브랜드를 만들고', '그래픽을 그리고', 'UX를 설계한다.', '작업은 자주', '서로의 경계를 넘는다.'],
    tone: '#b4b4b4',
    width: 186,
    height: 244,
    tilt: -9,
  },
  {
    id: '05',
    title: 'PEACE',
    lines: ['가장 원하는 건', '평온한 삶이다.', '그래서 오늘도', '디자인한다.'],
    tone: '#707070',
    width: 216,
    height: 166,
    tilt: 4,
  },
  {
    id: '06',
    title: 'REVISION',
    lines: ['무언가를 만들고', '다시 고친다.', '좋아질 때까지,', '혹은 더 이상', '모르겠을 때까지--'],
    tone: '#e4e4e4',
    width: 156,
    height: 236,
    tilt: 10,
  },
  {
    id: '07',
    title: 'UNFINISHED',
    lines: ['아직 완성되지 않았다.', '앞으로도', '완성되지 않을 것이다.'],
    tone: '#9a9a9a',
    width: 236,
    height: 184,
    tilt: -5,
  },
  {
    id: '08',
    title: 'UPDATE',
    lines: ['끊임없이 갱신하는 디자이너.', '전승민 입니다.'],
    tone: '#d9d9d9',
    width: 170,
    height: 238,
    tilt: 2,
  },
]

const landingSceneIds: LandingSceneId[] = ['identity', 'defined', 'memory', 'interaction', 'version', 'closing']

const overwriteCopies = [
  { left: '4%', top: '15%', opacity: 0.05, scale: 1.1, delay: '0ms' },
  { left: '22%', top: '24%', opacity: 0.04, scale: 0.82, delay: '120ms' },
  { left: '54%', top: '16%', opacity: 0.07, scale: 1.28, delay: '260ms' },
  { left: '69%', top: '30%', opacity: 0.05, scale: 0.94, delay: '80ms' },
  { left: '12%', top: '47%', opacity: 0.08, scale: 1.34, delay: '340ms' },
  { left: '44%', top: '45%', opacity: 0.04, scale: 0.76, delay: '180ms' },
  { left: '76%', top: '52%', opacity: 0.06, scale: 1.08, delay: '420ms' },
  { left: '31%', top: '67%', opacity: 0.05, scale: 1.18, delay: '520ms' },
  { left: '58%', top: '76%', opacity: 0.04, scale: 0.88, delay: '220ms' },
]

function at(x: number, y: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
  }
}

function getSeoulDateTime() {
  const parts = seoulDateTimeFormatter.formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    date: `${values.year}/${values.month}/${values.day}`,
    time: `${values.hour}:${values.minute} GMT+9`,
  }
}

function useTypedText(active: boolean, text: string, delay = 0, speed = 24, eraseSpeed = 14) {
  const [value, setValue] = useState('')

  useEffect(() => {
    let timer: number | undefined
    let interval: number | undefined

    if (active) {
      timer = window.setTimeout(() => {
        interval = window.setInterval(() => {
          setValue((current) => {
            if (current.length >= text.length) {
              if (interval) window.clearInterval(interval)
              return text
            }

            return text.slice(0, current.length + 1)
          })
        }, speed)
      }, delay)
    } else {
      interval = window.setInterval(() => {
        setValue((current) => {
          if (current.length <= 0) {
            if (interval) window.clearInterval(interval)
            return ''
          }

          return current.slice(0, Math.max(0, current.length - 2))
        })
      }, eraseSpeed)
    }

    return () => {
      if (timer) window.clearTimeout(timer)
      if (interval) window.clearInterval(interval)
    }
  }, [active, delay, eraseSpeed, speed, text])

  return value
}

function TypedText({
  active,
  text,
  delay,
  speed = 22,
  eraseSpeed = 12,
  cursor = false,
}: {
  active: boolean
  text: string
  delay: number
  speed?: number
  eraseSpeed?: number
  cursor?: boolean
}) {
  const value = useTypedText(active, text, delay, speed, eraseSpeed)

  return (
    <>
      {value}
      {cursor && active && value.length > 0 && value.length < text.length && (
        <span className="typed-inline-caret" aria-hidden />
      )}
    </>
  )
}

function LiveSeoulText({
  active,
  type,
  delay,
}: {
  active: boolean
  type: 'date' | 'time'
  delay: number
}) {
  const [text, setText] = useState('')
  const [target, setTarget] = useState('')

  useEffect(() => {
    setTarget(getSeoulDateTime()[type])
  }, [type])

  const typed = useTypedText(active, target, delay, 22, 12)

  useEffect(() => {
    if (!active) {
      setText(typed)
      return
    }

    if (typed.length < target.length) {
      setText(typed)
      return
    }

    const update = () => setText(getSeoulDateTime()[type])
    update()
    const interval = window.setInterval(update, 1000)

    return () => window.clearInterval(interval)
  }, [active, target, typed, type])

  return <>{text}</>
}

function PixelTriangle({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        ...at(427, 59.2),
        width: fs(10.8),
        height: fs(10.8),
        opacity: active ? 1 : 0,
        transition: 'opacity 0.22s steps(3,end)',
      }}
    >
      {[
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [2, 4],
        [1, 5],
        [0, 6],
      ].map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${x * 18}%`,
            top: `${y * 14}%`,
            width: '18%',
            height: '14%',
            background: '#ffffff',
          }}
        />
      ))}
    </span>
  )
}

function ImageOrbit({ active }: { active: boolean }) {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const selectedFrame = orbitFrames.find((frame) => frame.id === selectedFrameId)
  const selectedIndex = selectedFrame
    ? orbitFrames.findIndex((frame) => frame.id === selectedFrame.id)
    : -1

  return (
    <div
      aria-label="Rotating image frame object"
      style={{
        ...at(398, 128),
        zIndex: 12,
        width: fs(1125),
        height: fs(812.5),
        opacity: active ? 1 : 0,
        perspective: fs(1225),
        transition: 'opacity 0.42s steps(6,end)',
      }}
    >
      <div
        className={`home-image-orbit ${selectedFrame ? 'has-selected' : ''}`}
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {orbitFrames.map((frame, index) => {
          const angle = (360 / orbitFrames.length) * index
          const hoveredDelay = index * 34

          return (
            <button
              type="button"
              key={frame.id}
              className={`home-image-frame ${selectedFrameId === frame.id ? 'is-selected' : ''}`}
              aria-label={`page ${String(index + 1).padStart(2, '0')} ${frame.title}`}
              onClick={() => setSelectedFrameId((current) => (current === frame.id ? null : frame.id))}
              style={{
                ...gal,
                position: 'absolute',
                left: `calc(50% - ${fs(frame.width / 2)})`,
                top: `calc(50% - ${fs(frame.height / 2)})`,
                width: fs(frame.width),
                height: fs(frame.height),
                color: 'rgba(0,0,0,0.68)',
                border: '1px solid rgba(255,255,255,0.62)',
                backgroundColor: frame.tone,
                backgroundImage: frame.image ? `url(${frame.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(1) brightness(0.78) contrast(0.96)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 12px 34px rgba(0,0,0,0.32)',
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                transition:
                  'filter 0.24s steps(5,end), box-shadow 0.24s steps(5,end), border-color 0.2s steps(3,end), opacity 0.34s steps(4,end), transform 0.22s steps(5,end)',
                transitionDelay: `${hoveredDelay}ms`,
                ['--orbit-transform' as string]: `rotateY(${angle}deg) translateZ(${fs(456.25)}) rotateZ(${frame.tilt}deg)`,
                ['--orbit-hover-y' as string]: fs(-18),
              } as React.CSSProperties}
            >
              <span
                className="home-image-frame-preview"
                aria-hidden
                style={{
                  color: frame.tone === '#707070' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.62)',
                }}
              >
                {frame.lines.slice(0, 3).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
              <span
                className="home-image-frame-number"
                style={{
                  position: 'absolute',
                  right: fs(12),
                  top: fs(12),
                  fontSize: fs(12),
                  lineHeight: 1,
                  color: frame.tone === '#707070' ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.42)',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className="home-image-frame-title"
                style={{
                  position: 'absolute',
                  left: fs(12),
                  bottom: fs(12),
                  fontSize: fs(11),
                  lineHeight: 1,
                  color: frame.tone === '#707070' ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.24)',
                }}
              >
                {frame.title}
              </span>
              {frame.lines.length > 3 && (
                <span
                  className="home-image-frame-more"
                  style={{
                    position: 'absolute',
                    right: fs(12),
                    bottom: fs(12),
                    fontSize: fs(9),
                    lineHeight: 1,
                    color: frame.tone === '#707070' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.28)',
                  }}
                >
                  +{frame.lines.length - 3}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {selectedFrame && <span className="home-image-selection-backdrop" aria-hidden />}
      {selectedFrame && (
        <button
          type="button"
          className="home-image-focus"
          aria-label={`Close page ${String(selectedIndex + 1).padStart(2, '0')}`}
          onClick={() => setSelectedFrameId(null)}
          style={{
            ...gal,
            width: fs(Math.max(selectedFrame.width * 2.2, 420)),
            height: fs(Math.max(selectedFrame.height * 2.15, 350)),
            backgroundColor: selectedFrame.tone,
            color: selectedFrame.tone === '#707070' ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.72)',
            border: '1px solid rgba(255,255,255,0.92)',
          }}
        >
          <span className="home-image-focus-number">{String(selectedIndex + 1).padStart(2, '0')}</span>
          <span className="home-image-focus-title">
            {selectedFrame.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
          <span className="home-image-focus-note">CLICK TO CLOSE</span>
        </button>
      )}
    </div>
  )
}

function TypingCursor({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: fs(Math.max(2, size * 0.08)),
        height: '0.9em',
        marginLeft: fs(8),
        background: '#f2f2f2',
        verticalAlign: '-0.12em',
        animation: 'blink 0.72s step-end infinite',
      }}
    />
  )
}

function LandingTypingText({
  active,
  text,
  delay = 0,
  speed = 34,
  eraseSpeed = 14,
  className,
}: LandingTypingTextProps) {
  const value = useTypedText(active, text, delay, speed, eraseSpeed)

  return (
    <span className={className}>
      {value}
      {active && <span aria-hidden className="landing-typing-cursor" />}
    </span>
  )
}

function LandingScene({
  id,
  active,
  setSceneRef,
  children,
}: {
  id: LandingSceneId
  active: boolean
  setSceneRef: (id: LandingSceneId, node: HTMLElement | null) => void
  children: React.ReactNode
}) {
  return (
    <section
      ref={(node) => setSceneRef(id, node)}
      data-landing-scene={id}
      className={`landing-intro-scene ${active ? 'is-active' : ''}`}
    >
      <div className="landing-intro-scene-inner">{children}</div>
    </section>
  )
}

function MemoryTrace() {
  const dots = [
    [18, 19],
    [34, 35],
    [52, 28],
    [68, 44],
    [79, 22],
    [26, 66],
    [57, 70],
    [73, 62],
  ]

  return (
    <div className="landing-memory-trace" aria-hidden>
      <span className="landing-memory-scan landing-memory-scan-a" />
      <span className="landing-memory-scan landing-memory-scan-b" />
      <span className="landing-memory-scan landing-memory-scan-c" />
      <span className="landing-memory-streak landing-memory-streak-a" />
      <span className="landing-memory-streak landing-memory-streak-b" />
      <span className="landing-memory-streak landing-memory-streak-c" />
      {dots.map(([left, top], index) => (
        <span
          key={`${left}-${top}`}
          className="landing-memory-dot"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${index * 140}ms`,
          }}
        />
      ))}
    </div>
  )
}

function PixelStatue() {
  const rows = [
    '      ░░████░░',
    '    ░██████████░',
    '   ░██▓▓████▓▓██',
    '   ██▓▓▓▓██▓▓▓▓█',
    '   ████▓▓▓▓████░',
    '    ░████████░',
    '    ░░██████░░',
    '  ░████████████░',
    ' ░██████████████',
    ' ████████████████',
    '██████████████████',
    '██████░████░██████',
    '███░░░░████░░░░███',
    '░░░░  ░████░  ░░░░',
  ]

  return (
    <pre className="landing-statue" aria-hidden>
      {rows.join('\n')}
    </pre>
  )
}

function PixelDataGrid() {
  return (
    <div className="landing-data-grid" aria-hidden>
      {Array.from({ length: 30 }).map((_, index) => (
        <span key={index} className={index % 7 === 0 || index > 20 ? 'is-bright' : undefined} />
      ))}
    </div>
  )
}

function SceneIdentity({ active }: { active: boolean }) {
  return (
    <>
      <div aria-hidden className="landing-overwrite-field">
        {overwriteCopies.map((copy) => (
          <span
            key={`${copy.left}-${copy.top}`}
            className="landing-overwrite-copy"
            style={{
              left: copy.left,
              top: copy.top,
              opacity: active ? copy.opacity : 0,
              transform: `scale(${copy.scale})`,
              animationDelay: copy.delay,
            }}
          >
            &apos;나&apos;는 누구일까?
          </span>
        ))}
      </div>
      <h1 className="landing-main-question">
        <LandingTypingText active={active} text="‘나’는 누구일까?" speed={42} />
      </h1>
    </>
  )
}

function SceneDefined({ active }: { active: boolean }) {
  const formText = '[ NAME      : _ _ _ ]\n[ GENDER    : _ _ _ ]\n[ AGE       : _ _ _ ]'

  return (
    <div className="landing-two-column">
      <pre className="landing-ascii-form" aria-label="Undefined profile form">
        <LandingTypingText active={active} text={formText} delay={380} speed={18} className="landing-ascii-text" />
      </pre>
      <p className="landing-body-copy landing-body-copy-large landing-align-right">
        <LandingTypingText active={active} text={'이름도, 성별도, 나이도\n결국은 타인들이 정의한 것입니다'} speed={34} />
      </p>
    </div>
  )
}

function SceneMemory({ active }: { active: boolean }) {
  return (
    <div className="landing-two-column landing-memory-layout">
      <div className={`landing-glitch-wrap ${active ? 'is-active' : ''}`}>
        <div aria-hidden className="landing-noise-line landing-noise-line-a" />
        <div aria-hidden className="landing-noise-line landing-noise-line-b" />
        <p className="landing-body-copy landing-glitch-copy">
          <LandingTypingText
            active={active}
            text={'기억이라는 데이터조차\n고정되어 있지 않으며\n끊임없이 덮어 씌어집니다'}
            speed={35}
          />
        </p>
      </div>
      <MemoryTrace />
    </div>
  )
}

function SceneInteraction({ active }: { active: boolean }) {
  return (
    <div className="landing-interaction-scene">
      <span aria-hidden className="landing-interaction-bg">
        INTERACTION
      </span>
      <h2 className="landing-interaction-title">
        <LandingTypingText active={active} text="INTERACTION" speed={30} />
      </h2>
      <p className="landing-interaction-sub">
        <LandingTypingText active={active} text="끊임없는 반복과 갱신" delay={520} speed={40} />
      </p>
    </div>
  )
}

function SceneVersion({ active }: { active: boolean }) {
  return (
    <div className="landing-version-stack">
      <div className="landing-version-panel landing-statue-panel">
        <PixelStatue />
        <p className="landing-body-copy landing-align-right">
          <LandingTypingText active={active} text={'‘나’는 단단하게 굳어진\n조각상이 아닙니다'} speed={31} />
        </p>
      </div>
      <div className="landing-version-panel landing-data-panel">
        <p className="landing-body-copy">
          <LandingTypingText
            active={active}
            text={"어제의 ‘나’라는 데이터 위에\n오늘을 덮어쓰며\n끊임없이 다음 버전으로-"}
            delay={780}
            speed={31}
          />
        </p>
        <PixelDataGrid />
      </div>
    </div>
  )
}

function SceneClosing({ active }: { active: boolean }) {
  return (
    <div className="landing-closing">
      <p className="landing-closing-kicker">
        <LandingTypingText active={active} text="끊임없이 갱신하는 디자이너," speed={38} />
      </p>
      <h2 className="landing-closing-name">
        <LandingTypingText active={active} text="JEON SEUNG MIN" delay={520} speed={44} />
      </h2>
      <div aria-hidden className={`landing-closing-line ${active ? 'is-active' : ''}`} />
      <span className={`landing-now-badge ${active ? 'is-active' : ''}`}>ver. now</span>
    </div>
  )
}

function LandingEndMark({ active }: { active: boolean }) {
  const pixels = [0, 1, 2, 3, 7, 8, 11, 12, 13, 16, 21, 22, 23, 24, 27, 28, 32, 33, 34, 37, 38]

  return (
    <section className="landing-end-mark" aria-label="Landing footer mark">
      <div className="landing-end-word">INTERACTION</div>
      <div className={`landing-end-band ${active ? 'is-active' : ''}`} aria-hidden>
        {Array.from({ length: 40 }).map((_, index) => (
          <span key={index} className={pixels.includes(index) ? 'is-dark' : undefined} />
        ))}
      </div>
    </section>
  )
}

const sceneStyle: React.CSSProperties = {
  position: 'relative',
  height: '100vh',
  minHeight: '100svh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#131313',
}

export default function HomeScreen({
  erasing = false,
  onHomeRequest,
}: {
  erasing?: boolean
  onHomeRequest?: () => void
}) {
  const [ready, setReady] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveClosing, setArchiveClosing] = useState(false)
  const scrollRootRef = useRef<HTMLElement>(null)
  const archiveCloseTimerRef = useRef<number>()
  const active = ready && !erasing
  const archiveVisible = archiveOpen || archiveClosing

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 60)
    window.scrollTo(0, 0)
    scrollRootRef.current?.scrollTo({ top: 0 })
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!active) {
      window.clearTimeout(archiveCloseTimerRef.current)
      setArchiveOpen(false)
      setArchiveClosing(false)
    }
  }, [active])

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

  const topType: React.CSSProperties = {
    ...gal,
    color: '#868686',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    pointerEvents: 'auto',
  }

  const footerType: React.CSSProperties = {
    ...gal,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
  }

  return (
    <section
      ref={scrollRootRef}
      className="home-screen"
      aria-label="Home screen"
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '100svh',
        background: '#131313',
        color: '#e8e8e8',
        overflowX: 'hidden',
        overflowY: 'hidden',
        overscrollBehaviorY: 'contain',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          height: 0,
          pointerEvents: 'none',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.36s steps(5,end)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: STAGE_WIDTH,
            height: '100vh',
            minHeight: '100svh',
            margin: '0 auto',
          }}
        >
          <button
            type="button"
            className="home-top-type"
            onClick={onHomeRequest}
            aria-label="Go to home page"
            style={{
              ...topType,
              ...at(50, 56),
              zIndex: 20,
              fontSize: fs(27),
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <TypedText active={active} text="JEON SEUNG MIN" delay={40} speed={22} />
          </button>

          <PixelTriangle active={active} />

          <button
            type="button"
            className="home-top-type"
            aria-expanded={archiveOpen && !archiveClosing}
            aria-label="Open archive categories"
            onClick={toggleArchive}
            style={{
              ...topType,
              ...at(447, 55),
              zIndex: 20,
              fontSize: fs(18),
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <TypedText active={active} text="MIN'S ARCHIVE" delay={180} speed={22} />
          </button>

          {archiveVisible && (
            <div
              className={`home-archive-lnb ${archiveClosing ? 'is-closing' : ''}`}
              style={{
                ...at(447, 88),
                zIndex: 28,
                minWidth: fs(178),
              }}
            >
              {CATEGORIES.map(({ label, href }, index) => (
                <Link key={label} href={href} aria-label={label} data-transition-kind="archive-lnb">
                  <TypedText
                    active={archiveOpen && active && !archiveClosing}
                    text={label}
                    delay={index * 46}
                    speed={18}
                    cursor
                  />
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/contact"
            className="home-top-type"
            style={{
              ...topType,
              ...at(1391, 54),
              zIndex: 20,
              fontSize: fs(18),
              color: '#ffffff',
            }}
          >
            <TypedText active={active} text="CONTACT" delay={360} speed={22} />
          </Link>

          <Link
            href="/projects"
            className="home-top-type"
            style={{
              ...topType,
              ...at(1712, 54),
              zIndex: 20,
              fontSize: fs(18),
            }}
          >
            <TypedText active={active} text="ARCHIVE_0001 ->" delay={500} speed={22} />
          </Link>

          <span
            style={{
              ...footerType,
              ...at(50, 1011),
              fontSize: fs(18),
            }}
          >
            <LiveSeoulText active={active} type="date" delay={800} />
          </span>

          <span
            style={{
              ...footerType,
              ...at(447, 1011),
              fontSize: fs(18),
            }}
          >
            <LiveSeoulText active={active} type="time" delay={930} />
          </span>

          <span
            style={{
              ...footerType,
              ...at(1618, 1019),
              fontSize: fs(10.8),
            }}
          >
            <TypedText
              active={active}
              text={"\u00A9 2026 min's archive all rights reserved."}
              delay={1060}
              speed={16}
            />
          </span>
        </div>
      </div>

      <section aria-label="About page object scene" style={sceneStyle}>
        <div
          style={{
            position: 'relative',
            width: STAGE_WIDTH,
            height: '100vh',
            minHeight: '100svh',
            margin: '0 auto',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.36s steps(5,end)',
          }}
        >
          <ImageOrbit active={active} />
          <span className="landing-who-label">
            <TypedText active={active} text="+ WHO AM I +" delay={620} speed={34} cursor />
          </span>
        </div>
      </section>
    </section>
  )
}
