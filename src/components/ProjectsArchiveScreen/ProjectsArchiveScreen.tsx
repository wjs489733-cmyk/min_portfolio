'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { archiveProjects, categoryLabels, type ArchiveCategory, type ArchiveProject } from '@/lib/archiveProjects'
import ArchiveMenu from '@/components/ArchiveMenu'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }

const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

const categoryOptions = [
  { label: 'SHOW ALL', href: '/projects', value: undefined },
  { label: 'UX/UI', href: '/projects?cat=uxui', value: 'uxui' },
  { label: 'BRANDING', href: '/projects?cat=branding', value: 'branding' },
  { label: 'EDITORIAL', href: '/projects?cat=editorial', value: 'editorial' },
  { label: 'PACKAGE', href: '/projects?cat=package', value: 'package' },
  { label: 'GRAPHIC', href: '/projects?cat=graphic', value: 'graphic' },
  { label: 'ETC', href: '/projects?cat=etc', value: 'etc' },
]

function at(x: number, y: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
  }
}

function isArchiveCategory(value?: string): value is ArchiveCategory {
  return Boolean(value && value in categoryLabels)
}

function ArchiveNav() {
  const topType: React.CSSProperties = {
    ...gal,
    color: '#8a8a8a',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    pointerEvents: 'auto',
  }

  return (
    <div className="archive-nav-shell" aria-label="Archive navigation">
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
          className="archive-nav-link archive-nav-brand"
          style={{
            ...topType,
            ...at(50, 56),
            fontSize: fs(27),
            color: '#f2f2f2',
          }}
        >
          JEON SEUNG MIN
        </Link>

        <ArchiveMenu
          buttonClassName="archive-nav-link"
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
          className="archive-nav-link"
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

        <button
          type="button"
          className="archive-nav-link"
          aria-disabled="true"
          tabIndex={-1}
          style={{
            ...topType,
            ...at(1712, 54),
            fontSize: fs(18),
            cursor: 'default',
            padding: 0,
          }}
        >
          ARCHIVE_0001 -&gt;
        </button>
      </div>
    </div>
  )
}

function ArchiveShowcaseCard({
  project,
  index,
}: {
  project: ArchiveProject
  index: number
}) {
  const hasThumbnail = Boolean(project.thumbnail)
  const displayIndex = String(index + 1).padStart(4, '0')
  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const offsetX = x - 0.5
    const offsetY = y - 0.5

    event.currentTarget.style.setProperty('--tilt-x', `${(-offsetY * 8).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(offsetX * 9).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--media-x', `${(-offsetX * 18).toFixed(2)}px`)
    event.currentTarget.style.setProperty('--media-y', `${(-offsetY * 18).toFixed(2)}px`)
    event.currentTarget.style.setProperty('--shine-x', `${(x * 100).toFixed(2)}%`)
    event.currentTarget.style.setProperty('--shine-y', `${(y * 100).toFixed(2)}%`)
    event.currentTarget.style.setProperty('--shine-opacity', '1')
  }
  const handlePointerLeave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
    event.currentTarget.style.setProperty('--media-x', '0px')
    event.currentTarget.style.setProperty('--media-y', '0px')
    event.currentTarget.style.setProperty('--shine-opacity', '0')
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`archive-showcase-card${hasThumbnail ? ' has-thumbnail' : ' is-empty'}`}
      aria-label={`${project.title} detail page`}
      data-transition-kind="work-open"
      data-category={project.categoryLabel}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ ['--card-index' as string]: index } as React.CSSProperties}
    >
      <div className="archive-showcase-thumb" aria-hidden>
        <div className="archive-thumb-frame">
          <div className="archive-thumb-content">
            {project.thumbnail && (
              <img
                className="archive-showcase-image"
                src={project.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            {!hasThumbnail && <span className="archive-showcase-placeholder">coming soon</span>}
          </div>
        </div>
        <div className="archive-render-grid" aria-hidden />
        <div className="archive-scan-line" aria-hidden />
      </div>

      <footer className="archive-showcase-meta">
        <div>
          <span>{displayIndex}</span>
          <h2>{project.title}</h2>
          <p>{project.subtitle}</p>
        </div>
        <div>
          <span>{project.categoryLabel}</span>
          <span>{project.date}</span>
        </div>
      </footer>

      <div className="archive-card-hud" aria-hidden>
        <span>ARCHIVE_{displayIndex}</span>
        <span>{project.categoryLabel}</span>
        <span>RENDER READY</span>
      </div>
    </Link>
  )
}

export default function ProjectsArchiveScreen({ category }: { category?: string }) {
  const normalizedCategory = category === 'ect' ? 'etc' : category
  const selectedCategory = isArchiveCategory(normalizedCategory) ? normalizedCategory : undefined
  const visibleProjects = useMemo(
    () =>
      selectedCategory
        ? archiveProjects.filter((project) => project.category === selectedCategory)
        : archiveProjects,
    [selectedCategory],
  )
  const currentLabel = selectedCategory ? categoryLabels[selectedCategory] : 'SHOW ALL'
  const visibleCount = String(visibleProjects.length).padStart(2, '0')

  return (
    <main className="archive-screen" aria-label="Projects archive">
      <ArchiveNav />

      <section className="archive-stage">
        <div className="archive-index-panel" aria-label="Archive index status">
          <span>INDEXING</span>
          <strong>{currentLabel}</strong>
          <span>{visibleCount} FILES</span>
        </div>

        <div className="archive-category-strip" aria-label="Archive categories">
          {categoryOptions.map((option) => {
            const active = option.value === selectedCategory || (!option.value && !selectedCategory)

            return (
              <Link
                key={option.label}
                href={option.href}
                className={active ? 'is-active' : undefined}
                data-transition-kind="archive-filter"
              >
                {option.label}
              </Link>
            )
          })}
        </div>

        <div
          className="archive-showcase-grid"
          aria-label={currentLabel}
        >
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => (
              <ArchiveShowcaseCard
                key={`${selectedCategory ?? 'all'}-${project.id}`}
                project={project}
                index={index}
              />
            ))
          ) : (
            <div className="archive-empty-state" role="status">
              <span>{currentLabel}</span>
              <strong>NO FILES YET</strong>
              <p>이 카테고리는 아직 정리 중입니다.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
