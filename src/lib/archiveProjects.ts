export type ArchiveCategory = 'uxui' | 'branding' | 'editorial' | 'package' | 'graphic' | 'ect'

export type ArchiveProject = {
  id: string
  title: string
  subtitle: string
  category: ArchiveCategory
  categoryLabel: string
  date: string
  period: string
  method: string
  tools: string
  field: string
  summary: string
  description: string[]
  thumbnail?: string
  images?: string[]
}

export const categoryLabels: Record<ArchiveCategory, string> = {
  uxui: 'UX/UI',
  branding: 'BRANDING',
  editorial: 'EDITORIAL',
  package: 'PACKAGE',
  graphic: 'GRAPHIC',
  ect: 'ECT',
}

const placeholderDescription = [
  '작품에 대한 설명을 작성하는 공간입니다. 기획 의도, 문제 정의, 작업의 핵심 방향을 간단하게 정리해 주세요.',
  '두 번째 문단에는 디자인 과정, 시각적 선택, 구조적 판단 등을 적어두면 좋습니다.',
  '마지막 문단에는 결과물의 의미, 배운 점, 다음 버전에서 보완하고 싶은 지점을 정리할 수 있습니다.',
]

const makePlaceholderProject = (index: number): ArchiveProject => {
  const id = `work-${String(index).padStart(2, '0')}`

  return {
    id,
    title: `TITLE ${String(index).padStart(2, '0')}`,
    subtitle: '부제',
    category: 'ect',
    categoryLabel: 'ECT',
    date: '날짜',
    period: '작업 기간',
    method: '작업 방식',
    tools: '사용 툴',
    field: '분야',
    summary: '작업물에 대한 짧은 소개문을 작성하는 공간입니다.',
    description: placeholderDescription,
    images: [],
  }
}

export const archiveProjects: ArchiveProject[] = [
  {
    id: 'ddd',
    title: 'ddd',
    subtitle: '남성 화장품 쇼핑몰 앱',
    category: 'uxui',
    categoryLabel: 'UX/UI',
    date: '2025년 10월',
    period: '2025.09 - 2025.10',
    method: '개인 작업',
    tools: 'Figma',
    field: 'UX/UI',
    summary: 'AI 피부 진단과 성분 추천을 통해 남성 화장품 선택 과정을 간결하게 정리한 쇼핑몰 앱 프로젝트입니다.',
    description: [
      'ddd는 discover, define, do의 흐름을 기반으로 남성 사용자가 자신의 피부 상태를 발견하고, 필요한 성분과 제품을 정의한 뒤, 바로 구매까지 이어갈 수 있도록 설계한 모바일 쇼핑몰 앱입니다.',
      '화장품 성분 정보가 어렵고 제품 비교가 번거로운 문제를 줄이기 위해 AI 피부 진단, 맞춤형 챗봇, 성분 및 효능 필터, 제품 비교 차트, 리뷰 큐레이션 기능을 하나의 흐름으로 구성했습니다.',
      '브랜드 무드는 투명한 글래스 비주얼과 정제된 디지털 인터페이스를 중심으로 깨끗함, 정확함, 신뢰감을 전달하는 방향으로 잡았습니다.',
    ],
    thumbnail: '/images/projects/ddd/thumb.png',
    images: [
      '/images/projects/ddd/01.png',
      '/images/projects/ddd/02.png',
      '/images/projects/ddd/03.png',
      '/images/projects/ddd/04.png',
      '/images/projects/ddd/05.png',
      '/images/projects/ddd/06.png',
      '/images/projects/ddd/07.png',
      '/images/projects/ddd/08.png',
    ],
  },
  {
    id: 'aurevo',
    title: 'aurevo',
    subtitle: '산토리니를 느끼는 호텔',
    category: 'branding',
    categoryLabel: 'BRANDING',
    date: '2025년 10월',
    period: '2025.10',
    method: '2인 팀 작업',
    tools: 'Illustrator, Photoshop',
    field: 'BRANDING',
    summary: '국내에서도 산토리니의 이국적인 휴양 감각을 경험할 수 있도록 기획한 호텔 브랜드 경험 디자인 프로젝트입니다.',
    description: [
      'Aurevo는 비용과 거리의 제약으로 해외 휴양지를 쉽게 경험하기 어려운 이용자에게 국내에서 누릴 수 있는 새로운 휴식의 대안을 제안하는 호텔 브랜드입니다.',
      '산토리니의 하얀 벽, 하늘빛, 아치형 구조, 곡선 계단, 지중해의 생명력과 노을의 따뜻한 여운을 브랜드 무드로 설정하고, 이를 로고와 컬러 시스템, 그래픽 모티프, 공간 경험으로 확장했습니다.',
      '포스터, 키카드, 웰컴 드링크, 어메니티, 와인, 로브, 메뉴, 테이블웨어, 비치 에센셜, 굿즈 등 호텔 이용 흐름 안에서 만나는 접점들을 하나의 브랜드 경험으로 구성했습니다.',
    ],
    thumbnail: '/images/projects/aurevo/thumb.png',
    images: [
      '/images/projects/aurevo/01.png',
      '/images/projects/aurevo/02.png',
      '/images/projects/aurevo/03.png',
      '/images/projects/aurevo/04.png',
      '/images/projects/aurevo/05.png',
      '/images/projects/aurevo/06.png',
      '/images/projects/aurevo/07.png',
      '/images/projects/aurevo/08.png',
      '/images/projects/aurevo/09.png',
      '/images/projects/aurevo/10.png',
      '/images/projects/aurevo/11.png',
      '/images/projects/aurevo/12.png',
    ],
  },
  {
    id: 're-memory',
    title: 're:memory',
    subtitle: '기억 재구성 편집 실험',
    category: 'editorial',
    categoryLabel: 'EDITORIAL',
    date: '2025년 12월',
    period: '2025.12',
    method: '개인 작업',
    tools: 'InDesign, Photoshop',
    field: 'EDITORIAL',
    summary: '기억이 저장되는 것이 아니라 반복적으로 재구성된다는 관점을 책의 구조와 이미지 실험으로 풀어낸 편집 디자인 프로젝트입니다.',
    description: [
      'RE:MEMORY는 인간의 기억이 감정, 맥락, 사회적 영향 속에서 어떻게 왜곡되고 다시 쓰이는지 탐구한 북디자인 프로젝트입니다.',
      '책은 재구성 기억, 집단 기억 왜곡, 감정에 의한 기억 변형, 예술가들의 기억 표현 방식, 그리고 AI의 생성적 재구성 실험으로 구성됩니다.',
      'InDesign을 중심으로 본문 구조와 지면 리듬을 설계하고, Photoshop을 활용해 흐릿함, 반복, 노이즈, 재생성의 이미지를 편집해 기억의 불완전한 상태를 시각화했습니다.',
    ],
    thumbnail: '/images/projects/re-memory/thumb.png',
    images: [
      '/images/projects/re-memory/01.png',
      '/images/projects/re-memory/02.png',
      '/images/projects/re-memory/03.png',
      '/images/projects/re-memory/04.png',
      '/images/projects/re-memory/05.png',
    ],
  },
  {
    id: 'yogerpresso',
    title: 'yogerpresso',
    subtitle: '요거트 카페 브랜드 리디자인',
    category: 'branding',
    categoryLabel: 'BRANDING',
    date: '2024년 4월',
    period: '2024.04.08 - 2024.04.29',
    method: '개인 작업',
    tools: 'Illustrator, Photoshop',
    field: 'BRANDING',
    summary: '요거프레소의 기존 BI가 가진 거리감을 줄이고, 요거트와 커피 메뉴의 감각을 더 직관적으로 전달하도록 리디자인한 브랜드 아이덴티티 프로젝트입니다.',
    description: [
      'YOGERPRESSO RE는 디저트 카페 브랜드 요거프레소의 심볼 로고와 브랜드 아이덴티티를 새롭게 정리한 리브랜딩 프로젝트입니다.',
      '기존의 모던하고 얇은 산세리프 기반 BI가 요거트를 주력 메뉴로 하는 브랜드의 젊고 사랑스러운 이미지와 충분히 연결되지 않는다고 판단하고, 요거트와 커피 메뉴가 직관적으로 드러나는 방향으로 심볼을 재구성했습니다.',
      '기존 상징색인 붉은색을 유지해 브랜드의 연속성을 남기면서, 그래픽 모티프와 컬러 시스템을 통해 더 밝고 아기자기한 디저트 카페 경험으로 확장했습니다.',
    ],
    thumbnail: '/images/projects/yogerpresso_re/thumb.png',
    images: [
      '/images/projects/yogerpresso_re/01.png',
      '/images/projects/yogerpresso_re/02.png',
      '/images/projects/yogerpresso_re/03.png',
      '/images/projects/yogerpresso_re/04.png',
      '/images/projects/yogerpresso_re/05.png',
      '/images/projects/yogerpresso_re/06.png',
      '/images/projects/yogerpresso_re/07.png',
      '/images/projects/yogerpresso_re/08.png',
    ],
  },
  ...Array.from({ length: 12 }).map((_, index) => makePlaceholderProject(index + 5)),
]

export function getArchiveProject(id: string) {
  return archiveProjects.find((project) => project.id === id)
}
