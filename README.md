# 포트폴리오 웹사이트

시각디자이너를 위한 Modern하고 Interactive한 포트폴리오 웹사이트입니다.

## ✨ 특징

- **Modern Design**: 최신 디자인 트렌드 반영
- **Interactive Elements**: Framer Motion을 사용한 자연스러운 애니메이션
- **Responsive**: 모든 디바이스에 최적화
- **TypeScript**: 타입 안정성을 위한 TypeScript 사용
- **Tailwind CSS**: 효율적인 스타일링
- **SEO Optimized**: 검색 엔진 최적화
- **Fast Performance**: Next.js의 최적화된 성능

## 🎨 폰트 시스템

- **Galmuri 9**: 제목, 서브제목, 버튼, 캡션
- **Pretendard**: 본문, 소개문, 보조 텍스트

## 🛠️ 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Fonts**: Galmuri 09, Pretendard

## 📂 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── experience/         # Experience page
│   ├── projects/           # Projects page
│   ├── skills/             # Skills page
│   ├── blog/               # Blog page
│   └── contact/            # Contact page
├── components/             # Reusable components
│   ├── Header/             # Header component
│   ├── Footer/             # Footer component
│   ├── Navigation/         # Navigation component
│   ├── HeroSection/        # Hero section
│   └── common/             # Common components
├── styles/                 # Global styles
├── lib/                    # Utility functions
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## 🚀 시작하기

### 초기 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📝 개발 가이드

### 새 컴포넌트 추가

1. `src/components` 폴더에 새로운 폴더 생성
2. 컴포넌트 파일 작성 (예: `Component.tsx`)
3. `index.ts` 파일로 export
4. 필요한 곳에서 import하여 사용

### 스타일링

- Tailwind CSS 클래스 사용
- CSS 변수는 `src/styles/globals.css`에 정의됨
- 커스텀 색상, 간격 등은 `tailwind.config.js`에 정의

### 타입 정의

- 모든 타입은 `src/types/index.ts`에 정의
- 페이지별로 필요한 타입 추가

## 🎯 주요 섹션

### Home
- Hero Section with Interactive Elements
- 소개 및 CTA 버튼
- Scroll indication

### About
- 개인 소개 및 프로필
- 스토리텔링

### Experience
- 직무 경험
- 교육 배경

### Projects
- 프로젝트 리스트
- 프로젝트 상세 페이지
- 필터링 및 검색

### Skills
- 기술 분류
- 숙련도 표시
- 시각적 표현

### Blog
- 포스트 리스트
- 포스트 상세 페이지
- 카테고리 및 검색

### Contact
- 연락 양식
- 소셜 링크

## 📱 반응형 디자인

모든 페이지는 다음 breakpoint에 최적화됨:
- Mobile: up to 640px
- Tablet: 768px - 1024px
- Desktop: 1025px+

## 🔍 SEO

- Meta 태그 최적화
- Open Graph 설정
- Canonical URL
- Sitemap

## 📦 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

## 🤝 기여

포트폴리오 개선을 위한 피드백과 제안은 언제든 환영합니다.

## 📄 라이선스

MIT License

---

**문의**: 연락처 페이지를 통해 문의 부탁드립니다.
