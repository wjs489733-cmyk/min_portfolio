# 포트폴리오 웹사이트 기획서

## 📋 프로젝트 개요
- **프로젝트명**: 개인 포트폴리오 웹사이트
- **목표**: 시각디자인 포트폴리오를 Modern하고 Interactive한 웹사이트로 표현
- **예상 완성도**: MVP(최소 기능 완성) → 지속적 개선

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js (React + TypeScript)
- **Styling**: CSS/SCSS (Tailwind CSS 고려)
- **Animation**: Framer Motion (Interactive 요소)
- **State Management**: React Context API 또는 Zustand
- **빌드 도구**: Next.js 내장

### 개발
- **Node.js**: v18+
- **Package Manager**: npm 또는 yarn
- **배포**: Vercel (Next.js 최적화)

---

## 🎨 디자인 및 구조

### 페이지 구성
```
포트폴리오 웹사이트
├── / (Home/Intro)
│   ├── Hero Section (인상적인 소개)
│   └── Navigation
├── /about (소개)
│   ├── 프로필
│   ├── 경력 요약
│   └── 개인 스토리
├── /experience (경험)
│   ├── 직무 경험
│   └── 교육 배경
├── /projects (프로젝트)
│   ├── 프로젝트 리스트
│   ├── 프로젝트 상세 페이지
│   └── 필터링 (카테고리, 기술)
├── /skills (기술 스택)
│   ├── 기술 분류
│   ├── 숙련도 표시
│   └── 체계적인 표현
├── /blog (블로그)
│   ├── 포스트 리스트
│   ├── 포스트 상세 페이지
│   └── 카테고리/검색
└── /contact (연락처)
    └── 연락 양식 (Formspree, EmailJS 등)
```

### 디자인 방향
- **Theme**: Modern + Minimalist + Interactive
- **Color**: 시각디자인 전공답게 신중하게 선택
- **Animation**: 
  - 페이지 전환 애니메이션
  - Scroll 기반 애니메이션
  - Hover 인터렉션
  - Parallax 효과

---

## 📦 프로젝트 폴더 구조

```
min_v.1_portpolio_web/
├── public/
│   ├── images/
│   ├── assets/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── blog/
│   │   └── contact/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   ├── HeroSection/
│   │   └── ... (기타 재사용 가능한 컴포넌트)
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.local
├── next.config.js
├── tsconfig.json
├── tailwind.config.js (선택사항)
├── package.json
└── README.md
```

---

## 🎯 개발 단계

### Phase 1: 기초 설정 (1-2일)
- [ ] Next.js 프로젝트 초기화
- [ ] TypeScript 설정
- [ ] 기본 레이아웃 구성 (Header, Footer, Navigation)
- [ ] 스타일링 시스템 설정
- [ ] Git 저장소 초기화

### Phase 2: 코어 페이지 (3-5일)
- [ ] Home/Hero Section (인상적으로!)
- [ ] About 페이지
- [ ] Experience 페이지
- [ ] Skills 페이지
- [ ] 기본 Navigation 구현

### Phase 3: 프로젝트 및 포트폴리오 (4-6일)
- [ ] Projects 페이지
- [ ] 프로젝트 상세 페이지
- [ ] 필터링 및 검색
- [ ] 이미지/비디오 갤러리

### Phase 4: 추가 기능 (3-4일)
- [ ] Blog 페이지 (Markdown 기반)
- [ ] Contact 페이지 (연락 양식)
- [ ] 검색 기능
- [ ] 다국어 지원 (선택사항)

### Phase 5: 인터렉션 및 최적화 (3-4일)
- [ ] Framer Motion 애니메이션
- [ ] Scroll 기반 효과
- [ ] 성능 최적화
- [ ] SEO 최적화

### Phase 6: 배포 및 마무리 (1-2일)
- [ ] Vercel 배포
- [ ] 도메인 연결
- [ ] 최종 테스트
- [ ] 문서화

---

## 💡 Interactive 요소 아이디어

1. **Hero Section**
   - Parallax 스크롤
   - 마우스 추적 효과
   - 자동 타이핑 텍스트

2. **프로젝트 카드**
   - Hover 시 확대/변형
   - 이미지 오버레이 애니메이션
   - 클릭 시 상세 정보 모달

3. **스킬 섹션**
   - 프로그레스 바 애니메이션
   - 실시간 카운팅
   - 카테고리별 그룹화

4. **네비게이션**
   - Sticky navbar
   - Smooth scroll
   - Active 섹션 강조

---

## 📊 주요 고려사항

- **성능**: Image 최적화, Code splitting, Lazy loading
- **반응형**: Mobile-first 설계
- **접근성**: ARIA labels, 키보드 네비게이션
- **SEO**: Meta tags, Open Graph, Sitemap
- **속도**: Core Web Vitals 최적화

---

## 🚀 다음 단계

1. Next.js 프로젝트 초기화
2. 기본 폴더 구조 생성
3. 스타일링 시스템 구축
4. 첫 번째 페이지(Home) 프로토타입 작성

**준비됐나요? 시작할까요?** 🎉
