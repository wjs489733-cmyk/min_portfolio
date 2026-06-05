'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }
const PAGE_ERASE_LEAD = 540
const COVER_PAUSE = 180

function sleepWithTimer(timers: React.MutableRefObject<number[]>, callback: () => void, delay: number) {
  const timer = window.setTimeout(callback, delay)
  timers.current.push(timer)
}

function routeLabel(url: URL) {
  const category = url.searchParams.get('cat')

  if (url.pathname === '/') return 'HOME_0000'
  if (url.pathname === '/about') return 'ABOUT_ME'
  if (url.pathname === '/contact') return 'CONTACT'
  if (url.pathname === '/blog') return 'BLOG'
  if (url.pathname === '/experience') return 'EXPERIENCE'
  if (url.pathname === '/skills') return 'SKILLS'

  if (url.pathname === '/projects') {
    if (!category) return 'ARCHIVE_0001'
    return `${category.replace(/[^a-z0-9]/gi, '').toUpperCase()}_INDEX`
  }

  if (url.pathname.startsWith('/projects/')) return 'WORKS_0001'

  return url.pathname
    .split('/')
    .filter(Boolean)
    .join('_')
    .replace(/[^a-z0-9_]/gi, '')
    .toUpperCase()
}

const ROUTE_TRANSITION_KINDS = new Set(['archive-lnb', 'archive-filter', 'work-open', 'page-nav'])

function isTransitionableLink(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  if (anchor.dataset.transition === 'false') return false

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return false

  const targetUrl = new URL(anchor.href, window.location.href)
  const currentUrl = new URL(window.location.href)

  if (targetUrl.origin !== currentUrl.origin) return false

  const samePath = targetUrl.pathname === currentUrl.pathname
  const sameSearch = targetUrl.search === currentUrl.search
  const hashOnly = samePath && sameSearch && targetUrl.hash

  if (hashOnly || (samePath && sameSearch && targetUrl.hash === currentUrl.hash)) return false

  return true
}

export default function RouteTransition() {
  const router = useRouter()
  const timersRef = useRef<number[]>([])
  const pulseTimersRef = useRef<number[]>([])
  const filterTimersRef = useRef<number[]>([])
  const filterEntryTimersRef = useRef<number[]>([])
  const entryTimersRef = useRef<number[]>([])
  const typographyEraseSourcesRef = useRef<Set<string>>(new Set())
  const lockedRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const [covered, setCovered] = useState(false)
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'idle' | 'erasing' | 'typing' | 'leaving'>('idle')

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []
  }, [])

  const clearPulseTimers = useCallback(() => {
    pulseTimersRef.current.forEach(window.clearTimeout)
    pulseTimersRef.current = []
  }, [])

  const clearFilterTimers = useCallback(() => {
    filterTimersRef.current.forEach(window.clearTimeout)
    filterTimersRef.current = []
  }, [])

  const clearEntryTimers = useCallback(() => {
    entryTimersRef.current.forEach(window.clearTimeout)
    entryTimersRef.current = []
  }, [])

  const playTypographyErasePulse = useCallback(
    (source: string) => {
      clearPulseTimers()
      window.dispatchEvent(new CustomEvent('portfolio-typography-erase:start', { detail: { source } }))
      sleepWithTimer(
        pulseTimersRef,
        () => window.dispatchEvent(new CustomEvent('portfolio-typography-erase:end', { detail: { source } })),
        460,
      )
    },
    [clearPulseTimers],
  )

  const playArchiveFilterTransition = useCallback(
    (targetUrl: URL) => {
      if (lockedRef.current) return

      lockedRef.current = true
      clearFilterTimers()
      clearEntryTimers()
      delete document.body.dataset.typographyEntering
      delete document.body.dataset.typographyErasing
      window.dispatchEvent(new CustomEvent('portfolio-archive-filter-transition:start'))

      const destination = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`

      sleepWithTimer(
        filterTimersRef,
        () => {
          window.dispatchEvent(new CustomEvent('portfolio-archive-filter-transition:hold'))
          router.push(destination)
        },
        420,
      )
      sleepWithTimer(
        filterTimersRef,
        () => {
          lockedRef.current = false
          window.dispatchEvent(new CustomEvent('portfolio-archive-filter-transition:end'))
        },
        760,
      )
    },
    [clearEntryTimers, clearFilterTimers, router],
  )

  const playTransition = useCallback(
    (targetUrl: URL, source = 'route') => {
      if (lockedRef.current) return

      lockedRef.current = true
      clearTimers()
      window.dispatchEvent(new CustomEvent('portfolio-route-transition:start', { detail: { source } }))

      const currentUrl = new URL(window.location.href)
      const fromLabel = routeLabel(currentUrl)
      const toLabel = routeLabel(targetUrl)
      const destination = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`

      setVisible(true)
      setCovered(false)
      setText('')
      setMode('erasing')
      sleepWithTimer(timersRef, () => setCovered(true), PAGE_ERASE_LEAD)

      const labelStart = PAGE_ERASE_LEAD + COVER_PAUSE
      const eraseStep = 24
      const typeStep = 31
      const eraseDuration = fromLabel.length * eraseStep
      const typeStart = labelStart + eraseDuration + 140
      const typeDuration = toLabel.length * typeStep
      const navigateAt = typeStart + typeDuration + 180
      const exitAt = navigateAt + 420

      sleepWithTimer(timersRef, () => setText(fromLabel), labelStart)
      for (let i = 0; i <= fromLabel.length; i += 1) {
        sleepWithTimer(
          timersRef,
          () => setText(fromLabel.slice(0, Math.max(0, fromLabel.length - i))),
          labelStart + i * eraseStep,
        )
      }

      sleepWithTimer(timersRef, () => setMode('typing'), typeStart - 30)

      for (let i = 0; i <= toLabel.length; i += 1) {
        sleepWithTimer(timersRef, () => setText(toLabel.slice(0, i)), typeStart + i * typeStep)
      }

      sleepWithTimer(timersRef, () => router.push(destination), navigateAt)

      sleepWithTimer(timersRef, () => setMode('leaving'), exitAt - 80)

      for (let i = 0; i <= toLabel.length; i += 1) {
        sleepWithTimer(
          timersRef,
          () => setText(toLabel.slice(0, Math.max(0, toLabel.length - i))),
          exitAt + i * 18,
        )
      }

      sleepWithTimer(
        timersRef,
          () => {
            setVisible(false)
            setCovered(false)
            setMode('idle')
            lockedRef.current = false
            window.dispatchEvent(new CustomEvent('portfolio-route-transition:end', { detail: { source } }))
          },
          exitAt + toLabel.length * 18 + 170,
      )
    },
    [clearTimers, router],
  )

  useEffect(() => {
    const startTypographyEntering = () => {
      clearEntryTimers()
      delete document.body.dataset.typographyEntering
      void document.body.offsetHeight
      document.body.dataset.typographyEntering = 'true'
      sleepWithTimer(entryTimersRef, () => delete document.body.dataset.typographyEntering, 1280)
    }

    const setTypographyErasing = (active: boolean, source = 'route') => {
      if (active) {
        clearEntryTimers()
        delete document.body.dataset.typographyEntering
        typographyEraseSourcesRef.current.add(source)
      } else {
        typographyEraseSourcesRef.current.delete(source)
      }

      if (typographyEraseSourcesRef.current.size > 0) {
        document.body.dataset.typographyErasing = 'true'
      } else {
        delete document.body.dataset.typographyErasing
        if (source === 'route' || ROUTE_TRANSITION_KINDS.has(source)) {
          startTypographyEntering()
        }
      }
    }

    const getSource = (event: Event) =>
      event instanceof CustomEvent && typeof event.detail?.source === 'string'
        ? event.detail.source
        : 'route'

    const onEraseStart = (event: Event) => setTypographyErasing(true, getSource(event))
    const onEraseEnd = (event: Event) => setTypographyErasing(false, getSource(event))

    window.addEventListener('portfolio-route-transition:start', onEraseStart)
    window.addEventListener('portfolio-route-transition:end', onEraseEnd)
    window.addEventListener('portfolio-typography-erase:start', onEraseStart)
    window.addEventListener('portfolio-typography-erase:end', onEraseEnd)

    return () => {
      window.removeEventListener('portfolio-route-transition:start', onEraseStart)
      window.removeEventListener('portfolio-route-transition:end', onEraseEnd)
      window.removeEventListener('portfolio-typography-erase:start', onEraseStart)
      window.removeEventListener('portfolio-typography-erase:end', onEraseEnd)
      delete document.body.dataset.typographyErasing
      delete document.body.dataset.typographyEntering
      typographyEraseSourcesRef.current.clear()
    }
  }, [clearEntryTimers])

  useEffect(() => {
    const clearFilterEntryTimers = () => {
      filterEntryTimersRef.current.forEach(window.clearTimeout)
      filterEntryTimersRef.current = []
    }

    const startFilterEntering = () => {
      clearFilterEntryTimers()
      delete document.body.dataset.archiveFilterEntering
      void document.body.offsetHeight
      document.body.dataset.archiveFilterEntering = 'true'
      sleepWithTimer(filterEntryTimersRef, () => delete document.body.dataset.archiveFilterEntering, 1120)
    }

    const onFilterStart = () => {
      clearFilterEntryTimers()
      delete document.body.dataset.archiveFilterHolding
      delete document.body.dataset.archiveFilterEntering
      document.body.dataset.archiveFilterErasing = 'true'
    }

    const onFilterHold = () => {
      clearFilterEntryTimers()
      delete document.body.dataset.archiveFilterErasing
      delete document.body.dataset.archiveFilterEntering
      document.body.dataset.archiveFilterHolding = 'true'
    }

    const onFilterEnd = () => {
      delete document.body.dataset.archiveFilterErasing
      delete document.body.dataset.archiveFilterHolding
      startFilterEntering()
    }

    window.addEventListener('portfolio-archive-filter-transition:start', onFilterStart)
    window.addEventListener('portfolio-archive-filter-transition:hold', onFilterHold)
    window.addEventListener('portfolio-archive-filter-transition:end', onFilterEnd)

    return () => {
      window.removeEventListener('portfolio-archive-filter-transition:start', onFilterStart)
      window.removeEventListener('portfolio-archive-filter-transition:hold', onFilterHold)
      window.removeEventListener('portfolio-archive-filter-transition:end', onFilterEnd)
      clearFilterEntryTimers()
      delete document.body.dataset.archiveFilterErasing
      delete document.body.dataset.archiveFilterHolding
      delete document.body.dataset.archiveFilterEntering
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const anchor = target?.closest('a')

      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isTransitionableLink(anchor, event)) {
        const href = anchor.getAttribute('href')
        const label = anchor.textContent?.replace(/\s+/g, ' ').trim() ?? ''

        if (href && label.includes('ARCHIVE_0001')) {
          const targetUrl = new URL(anchor.href, window.location.href)
          const currentUrl = new URL(window.location.href)
          const sameUrl =
            targetUrl.origin === currentUrl.origin &&
            targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search &&
            targetUrl.hash === currentUrl.hash

          if (sameUrl) {
            event.preventDefault()
            event.stopPropagation()
            playTypographyErasePulse('archive-link-same-page')
          }
        }

        return
      }

      event.preventDefault()
      event.stopPropagation()

      const targetUrl = new URL(anchor.href, window.location.href)
      if (anchor.dataset.transitionKind === 'archive-filter') {
        playArchiveFilterTransition(targetUrl)
        return
      }

      playTransition(targetUrl, anchor.dataset.transitionKind ?? 'route')
    }

    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimers()
      clearPulseTimers()
      clearEntryTimers()
    }
  }, [clearEntryTimers, clearFilterTimers, clearPulseTimers, clearTimers, playArchiveFilterTransition, playTransition, playTypographyErasePulse])

  return (
    <div
      className="route-transition-overlay"
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 260,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: visible ? 'auto' : 'none',
        background: covered ? '#131313' : 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 120ms steps(2, end)',
      }}
    >
      <span
        style={{
          ...gal,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'min(86vw, 15ch)',
          fontSize: 'clamp(24px, 3.6vw, 70px)',
          lineHeight: 1,
          color: 'rgba(242,242,242,0.94)',
          letterSpacing: 0,
          textAlign: 'center',
          opacity: mode === 'leaving' ? 0.82 : 1,
          textShadow: visible ? '0 0 16px rgba(255,255,255,0.16)' : 'none',
        }}
      >
        {text}
        {visible && mode !== 'idle' && text.length > 0 && (
          <span
            style={{
              width: '0.04em',
              height: '0.86em',
              marginLeft: '0.1em',
              background: '#f2f2f2',
              animation: 'blink 0.42s step-end infinite',
            }}
          />
        )}
      </span>
    </div>
  )
}
