'use client'

import { useEffect, useState } from 'react'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }
const word = 'SMIN'

function useQuickType(onComplete: () => void) {
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing' | 'done'>('typing')

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []

    const queue = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (!cancelled) callback()
      }, delay)
      timers.push(timer)
    }

    word.split('').forEach((_, index) => {
      queue(() => setValue(word.slice(0, index + 1)), 56 * (index + 1))
    })

    queue(() => setPhase('hold'), 300)

    word.split('').forEach((_, index) => {
      queue(() => {
        setPhase('erasing')
        setValue(word.slice(0, Math.max(0, word.length - index - 1)))
      }, 440 + 42 * (index + 1))
    })

    queue(() => {
      setPhase('done')
      onComplete()
    }, 720)

    return () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
    }
  }, [onComplete])

  return { value, phase }
}

export default function SminSplash({ onComplete }: { onComplete: () => void }) {
  const { value, phase } = useQuickType(onComplete)

  return (
    <section
      aria-label="SMIN loading splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 180,
        display: 'grid',
        placeItems: 'center',
        background: '#131313',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.16s steps(2, end)',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          ...gal,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'min(86vw, 5.2ch)',
          fontSize: 'clamp(42px, 7.3vw, 142px)',
          lineHeight: 1,
          color: '#f2f2f2',
          letterSpacing: 0,
          textAlign: 'center',
          opacity: phase === 'erasing' ? 0.82 : 1,
          transform: phase === 'erasing' ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'opacity 0.12s steps(2, end), transform 0.12s steps(2, end)',
          textShadow: '0 0 18px rgba(255,255,255,0.08)',
        }}
      >
        {value}
        {phase !== 'done' && (
          <span
            aria-hidden
            style={{
              width: '0.035em',
              height: '0.84em',
              marginLeft: '0.08em',
              background: '#f2f2f2',
              animation: 'blink 0.34s step-end infinite',
            }}
          />
        )}
      </span>
    </section>
  )
}
