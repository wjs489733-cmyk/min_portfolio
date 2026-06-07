/**
 * Font configuration guide
 *
 * The actual site font is loaded with next/font/local in src/app/layout.tsx.
 * This file is a reference for keeping font sources and usage rules organized.
 */

export const FONTS_CONFIG = {
  galmuri: {
    name: 'Galmuri 9',
    repository: 'quiple/galmuri',
    version: '1.002',
    localSrc: 'src/fonts/Galmuri9.woff2',
    cdnSrc: 'https://cdn.jsdelivr.net/gh/quiple/galmuri/font/woff2/Galmuri9.woff2',
    usage: 'Headings, navigation, buttons, captions, pixel-style keywords',
    cssVariable: '--font-galmuri',
    tailwindClass: 'font-galmuri',
  },
  pretendard: {
    name: 'Pretendard',
    repository: 'orioncactus/pretendard',
    cdnSrc: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
    usage: 'Body copy, descriptions, supporting text',
    cssVariable: '--font-pretendard',
    tailwindClass: 'font-pretendard',
  },
} as const

export type FontKey = keyof typeof FONTS_CONFIG
