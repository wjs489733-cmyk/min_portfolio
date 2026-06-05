'use client'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(14px, 1.1vw, 22px)',
  letterSpacing: '0',
  color: 'rgba(232,232,232,0.68)',
}

export default function Footer() {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'grid',
        gridTemplateColumns: 'clamp(520px, 34vw, 700px) 1fr auto',
        alignItems: 'center',
        padding: '0 clamp(44px, 3.9vw, 80px) clamp(40px, 2.8vw, 58px)',
        pointerEvents: 'none',
      }}
    >
      <span style={mono}>2026/04/14</span>
      <span style={{ ...mono, textAlign: 'left' }}>13:33 GMT+9</span>
      <span
        style={{
          ...mono,
          fontSize: 'clamp(9px, 0.8vw, 12px)',
          textAlign: 'right',
          color: 'rgba(232,232,232,0.56)',
        }}
      >
        {"\u00A9 2026 min's archive all rights reserved."}
      </span>
    </footer>
  )
}
