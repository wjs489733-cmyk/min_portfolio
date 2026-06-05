'use client'

import { useEffect, useRef } from 'react'

const GRID = 12
const HOLD_MS = 2200
const DECAY = 0.018
const LINE_WIDTH = 1
const LINE_ALPHA = 0
const POINTER_EASE = 0.16
const SPAWN_MS = 26
const TRAIL_SUPPRESS_MS = 420

type CellKey = string

interface Cell {
  col: number
  row: number
  alpha: number
  createdAt: number
  color: string
  radius: number
}

export default function PixelTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cells = useRef<Map<CellKey, Cell>>(new Map())
  const rafRef = useRef<number>(0)
  const lastCell = useRef<CellKey>('')
  const lastSpawnAt = useRef(0)
  const suppressUntil = useRef(0)
  const transitionActive = useRef(false)
  const pointer = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    initialized: false,
    lastMovedAt: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const clearTrailState = () => {
      cells.current.clear()
      lastCell.current = ''
      lastSpawnAt.current = 0
      pointer.current.active = false
      pointer.current.initialized = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const onTransitionStart = () => {
      transitionActive.current = true
      suppressUntil.current = Date.now() + TRAIL_SUPPRESS_MS
      clearTrailState()
    }

    const onTransitionEnd = () => {
      clearTrailState()
      transitionActive.current = false
      suppressUntil.current = Date.now() + TRAIL_SUPPRESS_MS
    }

    const spawnCell = (x: number, y: number) => {
      const col = Math.floor(x / GRID)
      const row = Math.floor(y / GRID)
      const key = `${col},${row}`

      if (key === lastCell.current) return
      lastCell.current = key

      const tone = Math.floor(122 + Math.random() * 110)
      const alpha = 0.14 + Math.random() * 0.16
      const radius = Math.floor(Math.random() * 5)

      cells.current.set(key, {
        col,
        row,
        alpha,
        createdAt: Date.now(),
        color: `${tone}, ${tone}, ${tone}`,
        radius,
      })
    }

    const onMouseMove = (event: MouseEvent) => {
      if (transitionActive.current || Date.now() < suppressUntil.current) return

      pointer.current.targetX = event.clientX
      pointer.current.targetY = event.clientY
      pointer.current.active = true
      pointer.current.lastMovedAt = Date.now()

      if (!pointer.current.initialized) {
        pointer.current.x = event.clientX
        pointer.current.y = event.clientY
        pointer.current.initialized = true
      }
    }

    const onMouseLeave = () => {
      pointer.current.active = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('portfolio-route-transition:start', onTransitionStart)
    window.addEventListener('portfolio-route-transition:end', onTransitionEnd)

    const drawGrid = () => {
      ctx.strokeStyle = `rgba(232, 232, 232, ${LINE_ALPHA})`
      ctx.lineWidth = LINE_WIDTH
      ctx.beginPath()

      for (let x = 0; x <= canvas.width; x += GRID) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      }

      for (let y = 0; y <= canvas.height; y += GRID) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
      }

      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid()

      const now = Date.now()
      const cursor = pointer.current

      if (transitionActive.current || now < suppressUntil.current) {
        clearTrailState()
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      if (cursor.active) {
        cursor.x += (cursor.targetX - cursor.x) * POINTER_EASE
        cursor.y += (cursor.targetY - cursor.y) * POINTER_EASE

        if (now - lastSpawnAt.current > SPAWN_MS) {
          spawnCell(cursor.x, cursor.y)
          lastSpawnAt.current = now
        }

        if (now - cursor.lastMovedAt > 1000) {
          cursor.active = false
        }
      }

      for (const [key, cell] of cells.current) {
        if (cell.alpha <= 0.005) {
          cells.current.delete(key)
          continue
        }

        const inset = LINE_WIDTH
        const x = cell.col * GRID + inset
        const y = cell.row * GRID + inset
        const size = GRID - inset * 2

        ctx.fillStyle = `rgba(${cell.color}, ${cell.alpha.toFixed(3)})`

        const roundedCtx = ctx as CanvasRenderingContext2D & {
          roundRect?: (x: number, y: number, w: number, h: number, radii?: number | number[]) => void
        }

        if (typeof roundedCtx.roundRect === 'function') {
          roundedCtx.beginPath()
          roundedCtx.roundRect(x, y, size, size, cell.radius)
          roundedCtx.fill()
        } else {
          ctx.fillRect(x, y, size, size)
        }

        if (now - cell.createdAt >= HOLD_MS) {
          cell.alpha -= DECAY
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('portfolio-route-transition:start', onTransitionStart)
      window.removeEventListener('portfolio-route-transition:end', onTransitionEnd)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  )
}
