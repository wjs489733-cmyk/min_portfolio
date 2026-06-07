'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }
const pct = (value: number, base: number) => `${(value / base) * 100}%`
const fs = (px: number) => `calc(min(100vw, 177.777778svh) * ${px / 1920})`

type Mode = 'field' | 'preview' | 'assemble' | 'erase'
type EntryMode = 'initial' | 'return'
type TargetGroup = 'title' | 'line' | 'version' | 'caret' | 'dots' | 'arrow'

interface TargetPoint {
  x: number
  y: number
  group: TargetGroup
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  targetX: number
  targetY: number
  size: number
  alpha: number
  seed: number
  ampX: number
  ampY: number
  speedX: number
  speedY: number
  ghost: boolean
  group: TargetGroup
  previewDelay: number
  assembleDelay: number
  eraseDelay: number
}

const LETTERS: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
}

function at(x: number, y: number, width?: number, height?: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pct(x, 1920),
    top: pct(y, 1080),
    width: width ? pct(width, 1920) : undefined,
    height: height ? pct(height, 1080) : undefined,
  }
}

const groupDelay: Record<TargetGroup, number> = {
  line: 0,
  caret: 90,
  dots: 120,
  title: 170,
  version: 440,
  arrow: 560,
}

const groupEraseDelay: Record<TargetGroup, number> = {
  title: 0,
  caret: 90,
  dots: 110,
  line: 150,
  version: 260,
  arrow: 320,
}

const groupPreviewWeight: Record<TargetGroup, number> = {
  title: 1,
  line: 0.86,
  caret: 0.72,
  dots: 0.64,
  version: 0.54,
  arrow: 0.66,
}

const PREVIEW_IDLE_MS = 900
const PREVIEW_DURATION_MS = 3600
const INTRO_LEFT_LABEL = 'INTERACTION'
const INTRO_RIGHT_LABEL = "MIN'S ARCHIVE"

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount
const easeOutCubic = (value: number) => 1 - Math.pow(1 - clamp(value, 0, 1), 3)
const easeInOut = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2

function pushPoint(points: TargetPoint[], group: TargetGroup, x: number, y: number) {
  points.push({ x, y, group })
}

function pushLine(
  points: TargetPoint[],
  group: TargetGroup,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  step = 16,
) {
  const length = Math.hypot(x2 - x1, y2 - y1)
  const count = Math.max(1, Math.floor(length / step))

  for (let i = 0; i <= count; i += 1) {
    const t = i / count
    pushPoint(points, group, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)
  }
}

function pushRectBorder(
  points: TargetPoint[],
  group: TargetGroup,
  x: number,
  y: number,
  w: number,
  h: number,
  step = 14,
) {
  pushLine(points, group, x, y, x + w, y, step)
  pushLine(points, group, x + w, y, x + w, y + h, step)
  pushLine(points, group, x + w, y + h, x, y + h, step)
  pushLine(points, group, x, y + h, x, y, step)
}

function pushPixelText(points: TargetPoint[], group: TargetGroup, text: string, x: number, y: number, cell: number) {
  let cursor = x

  text.split('').forEach((char) => {
    const glyph = LETTERS[char]

    if (!glyph) {
      cursor += cell * 3
      return
    }

    glyph.forEach((row, rowIndex) => {
      row.split('').forEach((bit, colIndex) => {
        if (bit === '1') pushPoint(points, group, cursor + colIndex * cell, y + rowIndex * cell)
      })
    })

    cursor += cell * 6
  })
}

function getCanvasFontFamily() {
  if (typeof window === 'undefined') return 'monospace'

  const fontFamily = window.getComputedStyle(document.documentElement).getPropertyValue('--font-galmuri').trim()
  return fontFamily || 'monospace'
}

function pushSampledText(
  points: TargetPoint[],
  group: TargetGroup,
  text: string,
  x: number,
  y: number,
  fontSize: number,
) {
  if (typeof document === 'undefined') {
    pushPixelText(points, group, text, x, y, 15.7)
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  if (!ctx) {
    pushPixelText(points, group, text, x, y, 15.7)
    return
  }

  const fontFamily = getCanvasFontFamily()
  const font = `${fontSize}px ${fontFamily}, monospace`

  ctx.font = font
  const metrics = ctx.measureText(text)
  const width = Math.ceil(metrics.width) + 32
  const height = Math.ceil(fontSize * 1.12)

  canvas.width = width
  canvas.height = height
  ctx.font = font
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'top'
  ctx.fillText(text, 0, 0)

  const image = ctx.getImageData(0, 0, width, height)
  const step = 8
  const threshold = 92

  for (let py = 0; py < height; py += step) {
    for (let px = 0; px < width; px += step) {
      let covered = 0

      for (let oy = 0; oy < step; oy += 2) {
        for (let ox = 0; ox < step; ox += 2) {
          const ix = Math.min(width - 1, px + ox)
          const iy = Math.min(height - 1, py + oy)
          const alpha = image.data[(iy * width + ix) * 4 + 3]
          if (alpha > threshold) covered += 1
        }
      }

      if (covered >= 3) {
        pushPoint(points, group, x + px, y + py)
      }
    }
  }
}

function createTargets() {
  const points: TargetPoint[] = []

  pushSampledText(points, 'title', 'INTERACTION', 474, 338, 150)
  pushLine(points, 'line', 474, 522, 1446, 522, 14)
  pushRectBorder(points, 'version', 474, 618, 188, 120, 12)

  for (let i = 0; i < 15; i += 1) {
    pushPoint(points, 'version', 481 + i * 4, 715)
    pushPoint(points, 'version', 481 + i * 4, 722)
  }

  pushLine(points, 'caret', 1387, 352, 1387, 493, 10)
  pushLine(points, 'caret', 1380, 352, 1395, 352, 5)
  pushLine(points, 'caret', 1380, 493, 1395, 493, 5)

  ;[
    [1433, 450],
    [1433, 464],
    [1433, 479],
  ].forEach(([x, y]) => pushPoint(points, 'dots', x, y))

  ;[
    [1446, 637],
    [1432, 651],
    [1417, 666],
    [1403, 680],
    [1388, 695],
    [1374, 709],
    [1359, 724],
    [1345, 666],
    [1345, 680],
    [1345, 695],
    [1345, 709],
    [1359, 724],
    [1374, 724],
    [1388, 724],
  ].forEach(([x, y]) => pushPoint(points, 'arrow', x, y))

  return points
}

function createParticles(targets = createTargets()) {
  const particles: Particle[] = []
  const count = 1840

  for (let i = 0; i < count; i += 1) {
    const target = targets[Math.floor(Math.random() * targets.length)]
    const layer = Math.random()
    const angle = Math.random() * Math.PI * 2
    const radius = Math.pow(Math.random(), 0.62) * (layer > 0.72 ? 720 : 540)
    const baseX =
      960 +
      Math.cos(angle) * radius * (0.76 + Math.random() * 0.38) +
      (Math.random() - 0.5) * 240
    const baseY =
      540 +
      Math.sin(angle) * radius * (0.38 + Math.random() * 0.24) +
      (Math.random() - 0.5) * 190

    particles.push({
      x: baseX + (Math.random() - 0.5) * 360,
      y: baseY + (Math.random() - 0.5) * 220,
      vx: (Math.random() - 0.5) * 0.58,
      vy: (Math.random() - 0.5) * 0.58,
      baseX,
      baseY,
      targetX: target.x + (Math.random() - 0.5) * 4,
      targetY: target.y + (Math.random() - 0.5) * 4,
      size: 1.8 + Math.random() * 3.6,
      alpha: 0.055 + Math.random() * 0.27,
      seed: Math.random() * 1000,
      ampX: 18 + Math.random() * 136,
      ampY: 12 + Math.random() * 92,
      speedX: 0.14 + Math.random() * 0.58,
      speedY: 0.12 + Math.random() * 0.52,
      ghost: Math.random() > 0.78,
      group: target.group,
      previewDelay: Math.random() * 0.46,
      assembleDelay: groupDelay[target.group] + Math.random() * 145,
      eraseDelay: groupEraseDelay[target.group] + ((target.x - 474) / 972) * 120 + Math.random() * 90,
    })
  }

  return particles
}

function InlineCursor({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: '1px',
        height: '0.92em',
        marginLeft: '0.12em',
        background: '#ffffff',
        verticalAlign: '-0.08em',
        animation: 'blink 0.72s step-end infinite',
      }}
    />
  )
}

export default function IntroSequence({
  onComplete,
  entryMode = 'initial',
}: {
  onComplete: () => void
  entryMode?: EntryMode
}) {
  const isReturnEntry = entryMode === 'return'
  const [isExiting, setIsExiting] = useState(false)
  const [isErasingLabels, setIsErasingLabels] = useState(false)
  const [isTypingLabels, setIsTypingLabels] = useState(isReturnEntry)
  const [introLabels, setIntroLabels] = useState({
    left: isReturnEntry ? '' : INTRO_LEFT_LABEL,
    right: isReturnEntry ? '' : INTRO_RIGHT_LABEL,
  })
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetsRef = useRef<TargetPoint[]>([])
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({
    x: 960,
    y: 540,
    targetX: 960,
    targetY: 540,
    active: false,
    startedAt: 0,
    lastMovedAt: 0,
  })
  const modeRef = useRef<Mode>('field')
  const assembleStartRef = useRef(0)
  const eraseStartRef = useRef(0)
  const previewStartRef = useRef(0)
  const lastInteractionRef = useRef(0)
  const returnStartRef = useRef(0)
  const returnAwakeRef = useRef(!isReturnEntry)
  const returnAwakeStartRef = useRef(0)
  const isReturnEntryRef = useRef(isReturnEntry)
  const rafRef = useRef<number>(0)

  const wakeReturnField = useCallback((now = performance.now()) => {
    if (!isReturnEntry || returnAwakeRef.current) return

    returnAwakeRef.current = true
    returnAwakeStartRef.current = now
    lastInteractionRef.current = now
  }, [isReturnEntry])

  const enter = useCallback(() => {
    if (isExiting || modeRef.current === 'assemble' || modeRef.current === 'erase') return
    wakeReturnField()
    setIsExiting(true)
    modeRef.current = 'assemble'
    assembleStartRef.current = performance.now()
    mouseRef.current.active = false
    setIsErasingLabels(true)

    const maxLength = Math.max(INTRO_LEFT_LABEL.length, INTRO_RIGHT_LABEL.length)

    for (let i = 0; i <= maxLength; i += 1) {
      window.setTimeout(() => {
        setIntroLabels({
          left: INTRO_LEFT_LABEL.slice(0, Math.max(0, INTRO_LEFT_LABEL.length - i)),
          right: INTRO_RIGHT_LABEL.slice(0, Math.max(0, INTRO_RIGHT_LABEL.length - i)),
        })
      }, i * 38)
    }

    window.setTimeout(() => {
      modeRef.current = 'erase'
      eraseStartRef.current = performance.now()
    }, 1660)
    window.setTimeout(onComplete, 2620)
  }, [isExiting, onComplete, wakeReturnField])

  useEffect(() => {
    isReturnEntryRef.current = isReturnEntry
  }, [isReturnEntry])

  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      returnStartRef.current = performance.now()
      returnAwakeRef.current = !isReturnEntry
      returnAwakeStartRef.current = returnAwakeRef.current ? returnStartRef.current : 0

      await document.fonts?.ready
      if (cancelled) return

      targetsRef.current = createTargets()
      particlesRef.current = createParticles(targetsRef.current)
      lastInteractionRef.current = isReturnEntry ? performance.now() + 3600 : performance.now()
    }

    setup()

    return () => {
      cancelled = true
    }
  }, [isReturnEntry])

  useEffect(() => {
    if (!isReturnEntry) return

    const timers: number[] = []
    const maxLength = Math.max(INTRO_LEFT_LABEL.length, INTRO_RIGHT_LABEL.length)

    setIntroLabels({ left: '', right: '' })
    setIsTypingLabels(true)

    for (let i = 0; i <= maxLength; i += 1) {
      timers.push(
        window.setTimeout(() => {
          setIntroLabels({
            left: INTRO_LEFT_LABEL.slice(0, Math.min(i, INTRO_LEFT_LABEL.length)),
            right: INTRO_RIGHT_LABEL.slice(0, Math.min(i, INTRO_RIGHT_LABEL.length)),
          })
        }, 260 + i * 42),
      )
    }

    timers.push(window.setTimeout(() => setIsTypingLabels(false), 260 + maxLength * 42 + 220))

    return () => timers.forEach(window.clearTimeout)
  }, [isReturnEntry])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const stage = stageRef.current
      if (!stage) return

      const rect = stage.getBoundingClientRect()
      const nextX = ((event.clientX - rect.left) / rect.width) * 1920
      const nextY = ((event.clientY - rect.top) / rect.height) * 1080
      const now = performance.now()

      if (!mouseRef.current.active) {
        mouseRef.current.startedAt = now
      }

      wakeReturnField(now)

      mouseRef.current.targetX = nextX
      mouseRef.current.targetY = nextY
      mouseRef.current.active = true
      mouseRef.current.lastMovedAt = now
      lastInteractionRef.current = performance.now()

      if (modeRef.current === 'preview') {
        modeRef.current = 'field'
      }
    }

    const onMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [wakeReturnField])

  useEffect(() => {
    const animate = () => {
      const stage = stageRef.current
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (!stage || !canvas || !ctx) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const dpr = window.devicePixelRatio || 1
      const width = stage.clientWidth
      const height = stage.clientHeight
      const sx = width / 1920
      const sy = height / 1080
      const scale = Math.min(sx, sy)

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const now = performance.now()
      const time = now / 1000
      const mouse = mouseRef.current
      let mode = modeRef.current

      if (mouse.active) {
        mouse.x = mix(mouse.x, mouse.targetX, 0.08)
        mouse.y = mix(mouse.y, mouse.targetY, 0.08)

        if (now - mouse.lastMovedAt > 900) {
          mouse.active = false
        }
      }

      const returnEntry = isReturnEntryRef.current

      if (mode === 'field' && now - lastInteractionRef.current > PREVIEW_IDLE_MS && (!returnEntry || returnAwakeRef.current)) {
        mode = 'preview'
        modeRef.current = 'preview'
        previewStartRef.current = now
      }

      if (mode === 'preview' && now - previewStartRef.current > PREVIEW_DURATION_MS) {
        mode = 'field'
        modeRef.current = 'field'
        lastInteractionRef.current = now
      }

      const assembleElapsed = mode === 'assemble' ? now - assembleStartRef.current : 0
      const eraseElapsed = mode === 'erase' ? now - eraseStartRef.current : 0
      const returnElapsed = returnEntry ? now - returnStartRef.current : 0
      const returnQuiet = returnEntry && mode !== 'assemble' && !returnAwakeRef.current
      const returnAwakeProgress = returnAwakeRef.current
        ? easeOutCubic((now - returnAwakeStartRef.current) / 900)
        : 0
      const fieldStrength = returnEntry && mode !== 'assemble'
        ? returnAwakeRef.current
          ? mix(0.2, 1, returnAwakeProgress)
          : easeOutCubic((returnElapsed - 260) / 1800) * 0.16
        : 1
      const previewElapsed = mode === 'preview' ? now - previewStartRef.current : 0
      const previewProgress = clamp(previewElapsed / PREVIEW_DURATION_MS, 0, 1)
      const previewHold =
        previewProgress < 0.34
          ? easeInOut(previewProgress / 0.34)
          : previewProgress < 0.72
            ? 1
            : 1 - easeInOut((previewProgress - 0.72) / 0.28)

      particlesRef.current.forEach((particle) => {
        let localEase = 0
        const delayedPreview = easeOutCubic((previewProgress - particle.previewDelay * 0.42) / 0.5)
        const previewAmount =
          mode === 'preview' ? previewHold * delayedPreview * groupPreviewWeight[particle.group] * 0.64 : 0

        if (returnQuiet && particle.seed % 10 > 1.7) return

        if (mode === 'assemble') {
          localEase = easeOutCubic((assembleElapsed - particle.assembleDelay) / 820)
          const pull = 0.035 + localEase * 0.18

          particle.x += (particle.targetX - particle.x) * pull
          particle.y += (particle.targetY - particle.y) * pull
          particle.vx *= 0.72
          particle.vy *= 0.72
        } else if (mode === 'erase') {
          const eraseAmount = clamp((eraseElapsed - particle.eraseDelay) / 340, 0, 1)

          if (eraseAmount >= 1) return

          particle.x += (particle.targetX - particle.x) * 0.22
          particle.y += (particle.targetY - particle.y) * 0.22
          particle.vx *= 0.58
          particle.vy *= 0.58
        } else {
          const waveX =
            Math.sin(time * particle.speedX + particle.seed) * particle.ampX +
            Math.sin(time * (particle.speedY * 0.71) + particle.seed * 1.73) * particle.ampX * 0.28
          const waveY =
            Math.cos(time * particle.speedY + particle.seed * 0.83) * particle.ampY +
            Math.sin(time * (particle.speedX * 0.63) + particle.seed * 2.11) * particle.ampY * 0.22
          const fieldX = particle.baseX + waveX
          const fieldY = particle.baseY + waveY
          const targetX = mix(fieldX, particle.targetX, previewAmount)
          const targetY = mix(fieldY, particle.targetY, previewAmount)
          const dx = targetX - particle.x
          const dy = targetY - particle.y

          particle.vx += dx * 0.0022
          particle.vy += dy * 0.0022

          if (mouse.active && mode !== 'preview') {
            const mx = particle.x - mouse.x
            const my = particle.y - mouse.y
            const dist = Math.hypot(mx, my)

            if (dist < 178 && dist > 0.01) {
              const mouseRamp = clamp((now - mouse.startedAt) / 650, 0, 1)
              const force = (1 - dist / 178) * 1.18 * mouseRamp
              particle.vx += (mx / dist) * force
              particle.vy += (my / dist) * force
            }
          }

          particle.vx *= 0.92
          particle.vy *= 0.92
          particle.x += particle.vx
          particle.y += particle.vy
        }

        const px = particle.x * sx
        const py = particle.y * sy
        const pulse =
          mode === 'assemble'
            ? 0.22 + localEase * 0.58
            : Math.sin(time * (1.1 + particle.speedX) + particle.seed * 4) * 0.05 + previewAmount * 0.48
        const eraseAmount = mode === 'erase' ? clamp((eraseElapsed - particle.eraseDelay) / 340, 0, 1) : 0
        const eraseGate = mode === 'erase' && eraseAmount > 0.72 ? 0 : 1
        const alpha = clamp(particle.alpha + pulse, 0.035, 0.94) * fieldStrength * eraseGate
        const size = Math.max(
          2,
          particle.size * scale * (mode === 'assemble' ? 1.1 + localEase * 0.2 : 1 + previewAmount * 0.26),
        )
        const tone = Math.round(clamp(170 + (particle.seed % 58) + localEase * 34 + previewAmount * 26, 150, 242))

        ctx.fillStyle = `rgba(${tone},${tone},${tone},${alpha.toFixed(3)})`
        ctx.fillRect(Math.round(px / size) * size, Math.round(py / size) * size, size, size)

        if (mode !== 'assemble' && mode !== 'erase' && particle.ghost && fieldStrength > 0.32) {
          ctx.fillStyle = `rgba(${tone},${tone},${tone},${(alpha * (mode === 'preview' ? 0.12 : 0.22)).toFixed(3)})`
          ctx.fillRect(px + size * (1.6 + (particle.seed % 2)), py + size * 0.4, size * 0.72, size * 0.72)
        }
      })

      if (mode === 'preview') {
        const flash = previewHold * 0.38
        const targetSize = Math.max(2, 5.2 * scale)

        targetsRef.current.forEach((target, index) => {
          const twinkle = 0.58 + Math.sin(time * 3.4 + index * 0.71) * 0.28
          const alpha = clamp(flash * groupPreviewWeight[target.group] * twinkle, 0, 0.3)
          const px = target.x * sx
          const py = target.y * sy

          ctx.fillStyle = `rgba(232,232,232,${alpha.toFixed(3)})`
          ctx.fillRect(
            Math.round(px / targetSize) * targetSize,
            Math.round(py / targetSize) * targetSize,
            targetSize,
            targetSize,
          )
        })
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', enter, { once: true })
    return () => window.removeEventListener('keydown', enter)
  }, [enter])

  return (
    <section
      aria-label="Intro pixel interaction field"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#131313',
        opacity: 1,
        overflow: 'hidden',
      }}
    >
      <div
        ref={stageRef}
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
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        />

        <button
          type="button"
          onClick={enter}
          style={{
            ...gal,
            ...at(50, 56),
            zIndex: 20,
            fontSize: fs(27),
            lineHeight: 1,
            color: '#ffffff',
            cursor: 'pointer',
            padding: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {introLabels.left}
          <InlineCursor visible={isErasingLabels || isTypingLabels} />
        </button>

        <button
          type="button"
          onClick={enter}
          style={{
            ...gal,
            ...at(1712, 54),
            zIndex: 20,
            fontSize: fs(27),
            lineHeight: 1,
            color: '#ffffff',
            cursor: 'pointer',
            padding: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {introLabels.right}
          <InlineCursor visible={isErasingLabels || isTypingLabels} />
        </button>

        <button
          type="button"
          aria-label="Assemble current version"
          onClick={enter}
          style={{
            position: 'absolute',
            left: pct(340, 1920),
            top: pct(160, 1080),
            width: pct(1240, 1920),
            height: pct(740, 1080),
            zIndex: 10,
            cursor: 'pointer',
            padding: 0,
          }}
        />
      </div>
    </section>
  )
}
