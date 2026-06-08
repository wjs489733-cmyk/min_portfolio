'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import ScrambleText from '@/components/ScrambleText'

const gal: CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const CATEGORIES = [
  { label: 'SHOW ALL', href: '/projects' },
  { label: 'UX/UI', href: '/projects?cat=uxui' },
  { label: 'BRANDING', href: '/projects?cat=branding' },
  { label: 'EDITORIAL', href: '/projects?cat=editorial' },
  { label: 'PACKAGE', href: '/projects?cat=package' },
  { label: 'GRAPHIC', href: '/projects?cat=graphic' },
  { label: 'ETC', href: '/projects?cat=etc' },
]

function MenuTypedText({
  active,
  text,
  delay = 0,
}: {
  active: boolean
  text: string
  delay?: number
}) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!active) {
      let intervalId: number | undefined

      intervalId = window.setInterval(() => {
        setValue((current) => {
          if (current.length <= 0) {
            if (intervalId) window.clearInterval(intervalId)
            return ''
          }

          return current.slice(0, Math.max(0, current.length - 2))
        })
      }, 14)

      return () => {
        if (intervalId) window.clearInterval(intervalId)
      }
    }

    let index = 0
    let intervalId: number | undefined
    const timerId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1
        setValue(text.slice(0, index))

        if (index >= text.length && intervalId) {
          window.clearInterval(intervalId)
        }
      }, 18)
    }, delay)

    return () => {
      window.clearTimeout(timerId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [active, delay, text])

  if (active && value === text) {
    return <ScrambleText text={text} />
  }

  return (
    <>
      {value}
      {active && value.length > 0 && value.length < text.length && (
        <span className="lnb-typing-caret" aria-hidden />
      )}
    </>
  )
}

export default function ArchiveMenu({
  wrapperStyle,
  buttonStyle,
  buttonClassName,
  menuStyle,
}: {
  wrapperStyle?: CSSProperties
  buttonStyle?: CSSProperties
  buttonClassName?: string
  menuStyle?: CSSProperties
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)
  const phaseRef = useRef(phase)
  const pathname = usePathname()

  const visible = phase !== 'closed'
  const typing = phase === 'opening' || phase === 'open'

  const closeMenu = useCallback(() => {
    if (phaseRef.current === 'closed' || phaseRef.current === 'closing') return

    window.clearTimeout(closeTimerRef.current)
    phaseRef.current = 'closing'
    setPhase('closing')
    closeTimerRef.current = window.setTimeout(() => {
      phaseRef.current = 'closed'
      setPhase('closed')
    }, 260)
  }, [])

  const toggleMenu = useCallback(() => {
    if (phaseRef.current === 'opening' || phaseRef.current === 'open') {
      closeMenu()
      return
    }

    window.clearTimeout(closeTimerRef.current)
    phaseRef.current = 'opening'
    setPhase('opening')
    closeTimerRef.current = window.setTimeout(() => {
      phaseRef.current = 'open'
      setPhase('open')
    }, 260)
  }, [closeMenu])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [closeMenu])

  useEffect(() => {
    closeMenu()
  }, [closeMenu, pathname])

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  return (
    <div ref={rootRef} style={{ position: 'absolute', pointerEvents: 'auto', ...wrapperStyle }}>
      <button
        type="button"
        className={buttonClassName}
        aria-expanded={typing}
        aria-label="Open archive categories"
        onClick={toggleMenu}
        style={{
          ...gal,
          lineHeight: 1,
          color: 'inherit',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          padding: 0,
          ...buttonStyle,
        }}
      >
        <ScrambleText text="MIN'S ARCHIVE" />
      </button>

      {visible && (
        <div className={`archive-menu-lnb ${phase === 'closing' ? 'is-closing' : ''}`} style={menuStyle}>
          {CATEGORIES.map(({ label, href }, index) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="archive-menu-lnb-link"
              data-transition-kind="archive-lnb"
            >
              <MenuTypedText active={typing} text={label} delay={index * 46} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
