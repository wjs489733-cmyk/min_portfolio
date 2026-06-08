'use client'

import Link from 'next/link'
import ArchiveMenu from '@/components/ArchiveMenu'
import ScrambleText from '@/components/ScrambleText'

const gal: React.CSSProperties = { fontFamily: 'var(--font-galmuri)' }
const SVG_WIDTH = 1920
const VIEW_HEIGHT = 1080
const STAGE_WIDTH = 'min(100vw, 177.777778svh)'

const pctX = (value: number) => `${(value / SVG_WIDTH) * 100}%`
const pctY = (value: number) => `${(value / VIEW_HEIGHT) * 100}%`
const fs = (px: number) => `calc(${STAGE_WIDTH} * ${px / SVG_WIDTH})`

function at(x: number, y: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
  }
}

export default function Navigation({
  erasing = false,
}: {
  erasing?: boolean
}) {
  const brandStyle: React.CSSProperties = {
    ...gal,
    fontSize: fs(27),
    lineHeight: 1,
    color: 'var(--text)',
    pointerEvents: 'auto',
    whiteSpace: 'nowrap',
  }

  const navType: React.CSSProperties = {
    ...gal,
    fontSize: fs(18),
    lineHeight: 1,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
  }

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '100vh',
        minHeight: '100svh',
        pointerEvents: 'none',
        opacity: erasing ? 0 : 1,
        transition: 'opacity 0.28s steps(5,end)',
      }}
    >
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
          className="site-nav-link"
          aria-label="Go to home page"
          style={{
            ...brandStyle,
            ...at(50, 56),
          }}
        >
          <ScrambleText text="JEON SEUNG MIN" />
        </Link>

        <ArchiveMenu
          buttonClassName="site-nav-link"
          wrapperStyle={at(447, 55)}
          buttonStyle={navType}
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
          className="site-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...navType,
            ...at(1391, 54),
            pointerEvents: 'auto',
          }}
        >
          <ScrambleText text="CONTACT" />
        </Link>

        <Link
          href="/projects"
          className="site-nav-link"
          data-transition-kind="page-nav"
          style={{
            ...navType,
            ...at(1712, 54),
            pointerEvents: 'auto',
          }}
        >
          <ScrambleText text="ARCHIVE_0001 ->" />
        </Link>
      </div>
    </nav>
  )
}
