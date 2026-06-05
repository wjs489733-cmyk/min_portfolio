/**
 * 폰트 설정 가이드
 * GitHub CDN을 통해 폰트를 관리합니다
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FONTS_CONFIG = {
  // Galmuri: 제목, 버튼, 캡션
  galmuri: {
    name: 'Galmuri',
    repository: 'quiple/galmuri',
    version: '1.002',
    src: 'https://cdn.jsdelivr.net/gh/quiple/galmuri@1.002/font/woff2/Galmuri09.woff2',
    usage: '제목(h1-h6), 버튼, 캡션',
    cssVariable: '--font-galmuri',
    tailwindClass: 'font-galmuri',
  },

  // Pretendard: 본문, 설명, 보조 텍스트
  pretendard: {
    name: 'Pretendard',
    repository: 'orioncactus/pretendard',
    src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
    usage: '본문, 설명문, 보조 텍스트',
    cssVariable: '--font-pretendard',
    tailwindClass: 'font-pretendard',
  },
}

/**
 * 새로운 폰트 추가 가이드
 *
 * 1. GitHub 저장소에서 폰트 찾기 (예: github.com/username/font-name)
 * 2. jsdelivr CDN 링크 생성:
 *    https://cdn.jsdelivr.net/gh/username/font-name@version/path/to/font.woff2
 *
 * 3. src/styles/globals.css에 @font-face 추가:
 *    @font-face {
 *      font-family: 'FontName';
 *      src: url('https://cdn.jsdelivr.net/gh/...') format('woff2');
 *      font-weight: 400;
 *      font-style: normal;
 *      font-display: swap;
 *    }
 *
 * 4. src/app/layout.tsx의 <head>에 preload 링크 추가:
 *    <link
 *      href="https://cdn.jsdelivr.net/gh/..."
 *      rel="preload"
 *      as="font"
 *      type="font/woff2"
 *      crossOrigin="anonymous"
 *    />
 *
 * 5. tailwind.config.js에 fontFamily 추가:
 *    fontFamily: {
 *      fontname: ['var(--font-fontname)', 'system-ui', 'sans-serif'],
 *    }
 *
 * 6. globals.css의 CSS 변수에 추가:
 *    --font-fontname: 'FontName', system-ui, sans-serif;
 */

/**
 * 추천 한글 폰트 GitHub 저장소
 *
 * 1. Galmuri (픽셀/비트맵 스타일)
 *    https://github.com/quiple/galmuri
 *    사용: 제목, 버튼, 강조
 *
 * 2. Pretendard (현대적, 한글 최적화)
 *    https://github.com/orioncactus/pretendard
 *    사용: 본문, 설명
 *
 * 3. Noto Sans KR (Google의 한글 폰트)
 *    아마도 GitHub에도 미러되어 있음
 *    사용: 보편적인 본문
 *
 * 4. D2Coding (개발자 폰트)
 *    https://github.com/naver/d2codingfont
 *    사용: 코드 관련 내용
 *
 * 5. IBM Plex Sans KR
 *    사용: 모던 비즈니스 스타일
 */
