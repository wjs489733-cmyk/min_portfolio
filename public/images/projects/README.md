# Works image guide

작업물 이미지는 이 폴더 아래에 프로젝트 id별로 넣으면 됩니다.

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

- `public`은 경로에 쓰지 않습니다.
- 파일명은 가능하면 영어, 숫자, 하이픈만 쓰는 것이 안전합니다.
- `id`를 바꾸면 상세 페이지 주소도 바뀝니다. 예: `id: 'ddd'` -> `/projects/ddd`
- 이미지가 아직 없으면 `thumbnail`과 `images`를 비워두면 됩니다.

## Works page terminology checklist

작품 이미지 안에 들어가는 소제목은 아래 기준으로 정리합니다.

```txt
LOCKUP       -> LOGO / LOGO SYSTEM / LOGO VARIATION
stationery   -> APPLICATION
packaging    -> PACKAGE
environment  -> OUTDOOR AD / APPLICATION
환경적용      -> 옥외광고 / 적용 예시 / 애플리케이션
컬러시스템    -> COLOR / COLOR PALETTE / BRAND COLOR
```

사용 기준:

- `LOCKUP`은 의미가 모호하므로 단독 사용을 피합니다.
- 로고 조합 규정이면 `LOGO SYSTEM`, 로고 변형이면 `LOGO VARIATION`을 사용합니다.
- 명함, 봉투, 카드, 태그 등 문구류 중심이 아니라 브랜드 적용물 전체라면 `APPLICATION`을 사용합니다.
- `packaging`보다 소제목에서는 `PACKAGE`로 통일합니다.
- `환경적용`은 범위가 흐리므로 옥외광고면 `OUTDOOR AD`, 기타 적용물은 `APPLICATION`으로 분류합니다.
- `COLOR SYSTEM` 페이지는 선, 구분선, 하단 라인 유무를 모든 프로젝트에서 같은 규칙으로 맞춥니다.
