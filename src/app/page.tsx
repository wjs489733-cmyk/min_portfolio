'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import HomeScreen from '@/components/HomeScreen'
import SminSplash from '@/components/SminSplash'

const IntroSequence = dynamic(() => import('@/components/IntroSequence'), { ssr: false })
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export default function Home({
  searchParams,
}: {
  searchParams?: { intro?: string }
}) {
  const skipIntro = searchParams?.intro === '0'
  const [showIntro, setShowIntro] = useState(!skipIntro)
  const [view, setView]           = useState<'splash' | 'smin' | 'home'>('splash')
  const [introKey, setIntroKey] = useState(0)
  const [introEntryMode, setIntroEntryMode] = useState<'initial' | 'return'>('initial')
  const [homeErasing, setHomeErasing] = useState(false)
  const introTransitionLocked = useRef(false)

  const returnToIntro = useCallback(async () => {
    if (introTransitionLocked.current) return

    introTransitionLocked.current = true
    window.dispatchEvent(new CustomEvent('portfolio-route-transition:start'))

    setHomeErasing(true)
    await wait(view === 'smin' ? 160 : 680)

    setIntroEntryMode('return')
    setView('splash')
    setShowIntro(true)
    setIntroKey((key) => key + 1)
    await wait(120)

    setHomeErasing(false)
    introTransitionLocked.current = false
    window.dispatchEvent(new CustomEvent('portfolio-route-transition:end'))
  }, [view])

  const returnToHome = useCallback(async () => {
    if (introTransitionLocked.current) return

    introTransitionLocked.current = true
    window.dispatchEvent(new CustomEvent('portfolio-route-transition:start'))

    setHomeErasing(true)
    await wait(560)

    setShowIntro(false)
    setView('splash')
    window.history.replaceState(null, '', '/')
    await wait(80)

    setHomeErasing(false)
    introTransitionLocked.current = false
    window.dispatchEvent(new CustomEvent('portfolio-route-transition:end'))
  }, [])

  useEffect(() => {
    if (skipIntro) {
      window.history.replaceState(null, '', '/')
    }
  }, [skipIntro])

  return (
    <>
      {showIntro && (
        <IntroSequence
          key={introKey}
          entryMode={introEntryMode}
          onComplete={() => setShowIntro(false)}
        />
      )}

      <main
        style={{
          width:      '100%',
          opacity:    1,
        }}
      >
        {view === 'splash' && (
          <HeroSection
            playTyping={!showIntro && !homeErasing}
            onExitComplete={() => setView('smin')}
            onIntroRequest={returnToIntro}
            erasing={homeErasing}
          />
        )}

        {view === 'smin' && <SminSplash onComplete={() => setView('home')} />}

        {view === 'home' && (
          <HomeScreen erasing={homeErasing} onHomeRequest={returnToHome} />
        )}
      </main>
    </>
  )
}
