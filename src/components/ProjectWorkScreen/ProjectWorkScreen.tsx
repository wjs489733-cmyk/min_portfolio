'use client'

import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import type { ArchiveProject } from '@/lib/archiveProjects'
import ArchiveMenu from '@/components/ArchiveMenu'

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

function WorkTypedText({
  text,
  cycle,
  delay = 0,
  speed = 14,
  caret = false,
}: {
  text: string
  cycle: number
  delay?: number
  speed?: number
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
        <span className="work-typing-caret" aria-hidden />
      )}
    </>
  )
}

function useWorkTypingCycle() {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    setCycle((current) => current + 1)

    const restartIfWorkDetail = () => {
      if (window.location.pathname.startsWith('/projects/')) {
        setCycle((current) => current + 1)
      }
    }

    window.addEventListener('portfolio-route-transition:end', restartIfWorkDetail)

    return () => {
      window.removeEventListener('portfolio-route-transition:end', restartIfWorkDetail)
    }
  }, [])

  return cycle
}

function WorkNav({ project }: { project: ArchiveProject }) {
  const topType: CSSProperties = {
    ...gal,
    color: '#8a8a8a',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    pointerEvents: 'auto',
  }

  return (
    <div className="work-nav-shell" aria-label="Work detail navigation">
      <div
        style={{
          position: 'relative',
          width: STAGE_WIDTH,
          height: '100%',
          margin: '0 auto',
        }}
      >
        <Link
          href="/projects"
          className="work-nav-link work-nav-title"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(50, 56),
            fontSize: fs(27),
            color: '#f2f2f2',
          }}
        >
          WORKS / {project.categoryLabel}
        </Link>

        <ArchiveMenu
          buttonClassName="work-nav-link"
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
          className="work-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(1391, 54),
            fontSize: fs(18),
            color: '#f2f2f2',
          }}
        >
          CONTACT
        </Link>

        <Link
          href="/projects"
          className="work-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...topType,
            ...at(1712, 54),
            fontSize: fs(18),
          }}
        >
          ARCHIVE_0001 -&gt;
        </Link>
      </div>
    </div>
  )
}

export default function ProjectWorkScreen({ project }: { project: ArchiveProject }) {
  const projectImages = project.images?.filter(Boolean) ?? []
  const typingCycle = useWorkTypingCycle()

  return (
    <main className="work-screen" aria-label={`${project.title} work detail`}>
      <WorkNav project={project} />

      <section className="work-stage">
        <div className="work-media-stack" aria-label="Project visual area">
          {projectImages.length > 0
            ? projectImages.map((src, index) => (
                <figure key={src} className="work-media-placeholder has-image">
                  <img
                    className="work-media-image"
                    src={src}
                    alt={`${project.title} visual ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </figure>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="work-media-placeholder" aria-hidden />
              ))}
        </div>

        <aside className="work-info" aria-label="Project information">
          <div className="work-info-head">
            <h1>
              <WorkTypedText text={project.title} cycle={typingCycle} delay={120} speed={34} caret />
            </h1>
            <p>
              <WorkTypedText text={project.summary} cycle={typingCycle} delay={340} speed={10} caret />
            </p>
          </div>

          <div className="work-description">
            {project.description.map((paragraph, index) => (
              <p key={index}>
                <WorkTypedText
                  text={paragraph}
                  cycle={typingCycle}
                  delay={620 + index * 190}
                  speed={7}
                  caret={index === project.description.length - 1}
                />
              </p>
            ))}
          </div>

          <dl className="work-meta">
            <div className="work-meta-list">
              <div>
                <dt>
                  <WorkTypedText text="PERIOD" cycle={typingCycle} delay={1080} speed={18} />
                </dt>
                <dd>
                  <WorkTypedText text={project.period} cycle={typingCycle} delay={1180} speed={15} />
                </dd>
              </div>
              <div>
                <dt>
                  <WorkTypedText text="METHOD" cycle={typingCycle} delay={1260} speed={18} />
                </dt>
                <dd>
                  <WorkTypedText text={project.method} cycle={typingCycle} delay={1360} speed={15} />
                </dd>
              </div>
              <div>
                <dt>
                  <WorkTypedText text="TOOLS" cycle={typingCycle} delay={1440} speed={18} />
                </dt>
                <dd>
                  <WorkTypedText text={project.tools} cycle={typingCycle} delay={1540} speed={15} />
                </dd>
              </div>
            </div>
            <div className="work-meta-field">
              <dt>
                <WorkTypedText text="FIELD" cycle={typingCycle} delay={1620} speed={18} />
              </dt>
              <dd>
                <WorkTypedText text={project.field} cycle={typingCycle} delay={1720} speed={15} caret />
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  )
}
