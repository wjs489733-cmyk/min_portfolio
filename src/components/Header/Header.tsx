'use client'

import Navigation from '@/components/Navigation'

export default function Header({
  erasing = false,
}: {
  erasing?: boolean
}) {
  return (
    <header className="w-full">
      <Navigation erasing={erasing} />
    </header>
  )
}
