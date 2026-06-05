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
