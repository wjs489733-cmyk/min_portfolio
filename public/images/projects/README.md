# Works Image Guide

작업물 이미지는 프로젝트 id별 폴더에 넣으면 됩니다.

예시:

```txt
public/images/projects/ddd/
  thumb.jpg
  01.jpg
  02.jpg
  03.jpg
```

데이터 수정 위치:

```txt
src/lib/archiveProjects.ts
```

이미지 경로 작성 예시:

```ts
thumbnail: '/images/projects/ddd/thumb.jpg',
images: [
  '/images/projects/ddd/01.jpg',
  '/images/projects/ddd/02.jpg',
  '/images/projects/ddd/03.jpg',
],
```

주의:

- `public`은 경로에 적지 않습니다.
- 파일명은 가능하면 영어, 숫자, 하이픈만 쓰는 것이 안전합니다.
- `id`를 바꾸면 상세 페이지 주소도 바뀝니다. 예: `id: 'ddd'` -> `/projects/ddd`
- 이미지가 아직 없으면 `thumbnail`과 `images`를 비워두면 됩니다.

## Terminology Checklist

작품 이미지 안에 들어가는 소제목은 아래 기준으로 정리합니다.

```txt
LOCKUP       -> LOGO COMBINATION / LOGO SYSTEM / LOGO VARIATION
COLOR SYSTEM -> COLOR PALETTE / BRAND COLOR
stationery   -> APPLICATION / BRAND GOODS
packaging    -> PACKAGE
environment  -> OUTDOOR AD / APPLICATION
환경적용      -> 옥외광고 / 적용 예시 / 애플리케이션
```

사용 기준:

- `LOCKUP`은 포트폴리오 평가 상황에서는 의미가 모호할 수 있으므로 단독 사용하지 않습니다.
- 로고와 워드마크 조합이면 `LOGO COMBINATION`, 로고 체계라면 `LOGO SYSTEM`, 로고 변형이면 `LOGO VARIATION`을 사용합니다.
- 명함, 봉투, 카드, 태그 등 문구류 중심이 아니라 브랜드 적용물 전체라면 `APPLICATION`을 사용합니다.
- 굿즈 성격이 강한 경우에는 `BRAND GOODS` 또는 `MERCHANDISE`를 사용합니다.
- 소제목에서는 `PACKAGING`보다 `PACKAGE`로 통일합니다.
- `환경적용`은 범위가 흐리므로 옥외광고면 `OUTDOOR AD`, 기타 적용물은 `APPLICATION`으로 분류합니다.
- `COLOR SYSTEM` 페이지의 구분선, 하단 라인, 장식선은 프로젝트마다 같은 규칙으로 맞춥니다.

## Image Re-export Checklist

아래 이미지는 PNG 내부에 텍스트가 박혀 있으므로, 원본 작업파일에서 수정 후 다시 export하는 것이 가장 깔끔합니다.

| File | Current | Recommended |
| --- | --- | --- |
| `aurevo/07.png` | `COLOR SYSTEM`, `브랜드 컬러 시스템` | `COLOR PALETTE`, `브랜드 컬러 팔레트` |
| `yogerpresso_re/02.png` | `LOCKUP` | `LOGO COMBINATION` |
| `yogerpresso_re/03.png` | `COLOR SYSTEM` | `COLOR PALETTE` |
| `yogerpresso_re/05.png` | `STATIONERY & MERCHANDISE`, `STATIONERY` | `APPLICATION`, `BRAND GOODS` |
| `yogerpresso_re/06.png` | `PACKAGING` | `PACKAGE` |
| `yogerpresso_re/07.png` | `ENVIRONMENTAL APPLICATIONS`, `환경 적용` | `OUTDOOR AD / APPLICATION`, `옥외광고 및 적용 예시` |

원본 작업파일에서 다시 내보내기 어려운 경우에는 PNG 위에 직접 덮어쓰기 보정을 할 수 있지만, 배경 패치 흔적이 보일 수 있어 최종 제출용으로는 권장하지 않습니다.
