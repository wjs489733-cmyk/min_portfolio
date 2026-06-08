'use client'

import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import ArchiveMenu from '@/components/ArchiveMenu'
import ScrambleText from '@/components/ScrambleText'

const gal: CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

function at(x: number, y: number): CSSProperties {
  return {
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
  }
}

const profileItems = [
  { label: 'profile', values: ['전승민 Jeon Seungmin', '2001.04.18'] },
  { label: 'email', values: ['wjs489733@gmail.com'] },
  { label: 'phone', values: ['01058947459'] },
  { label: 'insta', values: ['smin7459'] },
]

const educationItems = [
  ['2020.03', '형곡고등학교 졸업'],
  ['2023.03', '영진전문대학교 콘텐츠디자인과 입학'],
  ['2025.03', '대구가톨릭대학교 시각디자인과 편입'],
  ['2026', '대구가톨릭대학교 시각디자인과 재학'],
]

const toolLines = ['Photoshop / Illustrator /', 'InDesign / After Effects /', 'Figma / Cinema 4D']

function ContactTypedText({
  text,
  delay = 0,
  speed = 22,
  cycle,
  caret = false,
}: {
  text: string
  delay?: number
  speed?: number
  cycle: number
  caret?: boolean
}) {
  const [value, setValue] = useState('')

  useEffect(() => {
    let index = 0
    let timerId: number | undefined
    let startId: number | undefined
    let cancelled = false

    setValue('')

    const typeNext = () => {
      if (cancelled) return

      index += 1
      setValue(text.slice(0, index))

      if (index < text.length) {
        timerId = window.setTimeout(typeNext, speed)
      }
    }

    startId = window.setTimeout(typeNext, delay)

    return () => {
      cancelled = true
      if (startId) window.clearTimeout(startId)
      if (timerId) window.clearTimeout(timerId)
    }
  }, [cycle, delay, speed, text])

  return (
    <>
      {value}
      {caret && value.length > 0 && value.length < text.length && (
        <span className="contact-typing-caret" aria-hidden />
      )}
    </>
  )
}

function useContactTypingCycle() {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    setCycle((current) => current + 1)

    const restartIfContact = () => {
      if (window.location.pathname === '/contact') {
        setCycle((current) => current + 1)
      }
    }

    window.addEventListener('portfolio-route-transition:end', restartIfContact)

    return () => {
      window.removeEventListener('portfolio-route-transition:end', restartIfContact)
    }
  }, [])

  return cycle
}

function ContactNav() {
  const topType: CSSProperties = {
    ...gal,
    color: '#8a8a8a',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    pointerEvents: 'auto',
  }

  return (
    <div className="contact-nav-shell" aria-label="Contact navigation">
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
          className="contact-nav-link contact-nav-brand"
          style={{
            ...topType,
            ...at(50, 56),
            fontSize: fs(27),
            color: '#f2f2f2',
          }}
        >
          <ScrambleText text="JEON SEUNG MIN" />
        </Link>

        <ArchiveMenu
          buttonClassName="contact-nav-link"
          wrapperStyle={at(447, 55)}
          buttonStyle={{
            ...topType,
            fontSize: fs(18),
            color: '#f2f2f2',
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
          className="contact-nav-link"
          style={{
            ...topType,
            ...at(1391, 54),
            fontSize: fs(18),
            color: '#f2f2f2',
          }}
        >
          <ScrambleText text="CONTACT" />
        </Link>

        <Link
          href="/projects"
          className="contact-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(1712, 54),
            fontSize: fs(18),
          }}
        >
          <ScrambleText text="ARCHIVE_0001 ->" />
        </Link>
      </div>
    </div>
  )
}

export default function ContactScreen() {
  const typingCycle = useContactTypingCycle()

  return (
    <main className="contact-screen" aria-label="Contact page">
      <ContactNav />

      <section className="contact-stage">
        <div className="contact-stage-inner">
          <div className="contact-profile-stack">
            {profileItems.map((item, itemIndex) => (
              <section key={item.label} className="contact-block">
                <h2>
                  <ContactTypedText
                    text={item.label}
                    cycle={typingCycle}
                    delay={itemIndex * 120}
                    speed={24}
                    caret
                  />
                </h2>
                <div className="contact-values">
                  {item.values.map((value, valueIndex) => (
                    <p key={value}>
                      <ContactTypedText
                        text={value}
                        cycle={typingCycle}
                        delay={itemIndex * 120 + 180 + valueIndex * 76}
                        speed={18}
                        caret
                      />
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="contact-block contact-education">
            <h2>
              <ContactTypedText text="education" cycle={typingCycle} delay={520} speed={24} caret />
            </h2>
            <div className="contact-education-list">
              {educationItems.map(([date, text], index) => (
                <p key={`${date}-${text}`}>
                  <span>
                    <ContactTypedText text={date} cycle={typingCycle} delay={680 + index * 112} speed={18} />
                  </span>
                  <span>
                    <ContactTypedText
                      text={text}
                      cycle={typingCycle}
                      delay={760 + index * 112}
                      speed={16}
                      caret
                    />
                  </span>
                </p>
              ))}
            </div>
          </section>

          <section className="contact-block contact-tool">
            <h2>
              <ContactTypedText text="tool" cycle={typingCycle} delay={1120} speed={24} caret />
            </h2>
            <div className="contact-values">
              {toolLines.map((line, index) => (
                <p key={line}>
                  <ContactTypedText text={line} cycle={typingCycle} delay={1260 + index * 86} speed={16} caret />
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
