'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#%@&<>[]{}+=-*/'

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function ScrambleText({
  text,
  className,
  duration = 320,
  interval = 24,
}: {
  text: string
  className?: string
  duration?: number
  interval?: number
}) {
  const [value, setValue] = useState(text)
  const [active, setActive] = useState(false)
  const intervalRef = useRef<number | undefined>(undefined)

  const stop = useCallback(() => {
    if (intervalRef.current !== undefined) {
      window.clearInterval(intervalRef.current)
    }
    intervalRef.current = undefined
    setActive(false)
    setValue(text)
  }, [text])

  const start = useCallback(() => {
    if (prefersReducedMotion()) return

    if (intervalRef.current !== undefined) {
      window.clearInterval(intervalRef.current)
    }

    const totalFrames = Math.max(1, Math.round(duration / interval))
    let frame = 0

    setActive(true)
    intervalRef.current = window.setInterval(() => {
      frame += 1
      const revealCount = Math.floor((frame / totalFrames) * text.length)

      setValue(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < revealCount) return char
            return randomChar()
          })
          .join(''),
      )

      if (frame >= totalFrames) {
        stop()
      }
    }, interval)
  }, [duration, interval, stop, text])

  useEffect(() => {
    setValue(text)
  }, [text])

  useEffect(
    () => () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
      }
    },
    [],
  )

  return (
    <span
      className={`scramble-text${active ? ' is-scrambling' : ''}${className ? ` ${className}` : ''}`}
      aria-label={text}
      onPointerEnter={start}
      onFocus={start}
      onPointerLeave={stop}
      onBlur={stop}
    >
      {value}
    </span>
  )
}
