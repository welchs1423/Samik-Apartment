# Samik — Private Cocktail Bar

개인 칵테일 바 웹사이트. 스피크이지(Speakeasy) 무드의 올드 바 감성을 담은 SPA입니다.

## 기술 스택

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 8** — 빌드 툴
- **Tailwind CSS v4** (`@tailwindcss/vite` 플러그인)
- **Vue Router 4** — Hash 기반 클라이언트 라우팅
- **Express** — 개발용 API 서버 (이미지 업로드 + JSON 파일 저장/조회)

## 프로젝트 구조

```
src/
├── data/
│   ├── categories.json         # 카테고리 목록
│   ├── items.json              # 전체 아이템 (카테고리 id를 키로 하는 객체)
│   └── ingredients.json        # 재료 마스터 목록
├── components/
│   ├── NavBar.vue
│   ├── SiteFooter.vue
│   ├── CocktailModal.vue       # 아이템 상세 팝업
│   └── WatercolorIllustration.vue
├── composables/
│   ├── useMenuData.js          # 카테고리/아이템 데이터 reactive store
│   └── useIngredients.js       # 재료 마스터 CRUD composable
├── pages/
│   ├── MainPage.vue            # 메인 히어로
│   ├── CategoryListPage.vue    # 전체 메뉴 (카테고리 그리드 + 검색)
│   ├── CategoryPage.vue        # 카테고리별 아이템 (그리드/리스트/테이블 뷰)
│   ├── ItemDetailPage.vue      # 단일 아이템 상세 (직접 URL 접근용)
│   └── AdminPage.vue           # 관리자 페이지 (dev 빌드 전용)
├── router/
│   └── index.js
├── App.vue
├── main.js
└── style.css
public/
└── images/                     # 이미지 파일 (git으로 관리)
server.js                       # 개발용 Express 서버 (port 3001)
```

## 페이지

| 경로 | 설명 |
|---|---|
| `/` | 메인 히어로 |
| `/menu` | 전체 카테고리 목록 + 이름 검색 |
| `/menu/:id` | 카테고리별 아이템 (그리드 / 리스트 / 테이블 뷰 전환) |
| `/menu/:id/:itemId` | 단일 아이템 상세 (직접 URL 접근) |
| `/admin` | 관리자 페이지 (비밀번호 보호, **dev 빌드 전용**) |

## 주요 기능

### 메뉴
- 전체 카테고리 카드 그리드 (커버 이미지 지원)
- 상단 검색창 — 전 카테고리 아이템 이름 실시간 검색, 결과 클릭 시 상세 팝업
- 카테고리 내 그리드 / 리스트 / 테이블 뷰 전환
- 서브카테고리가 있는 아이템을 우선 표시, 자동 그룹핑
- 아이템에 이미지가 있으면 카드 썸네일 및 상세 팝업에 표시; 없으면 수채화 일러스트 자동 생성
- 모든 아이템 클릭 시 상세 팝업 (이름, 설명, 재료, 태그, 이미지)
- `available: false` 아이템은 공개 메뉴에서 자동 숨김

### 어드민 (`/admin`, dev 전용)
- `npm run dev` 실행 시에만 접근 가능 (프로덕션 빌드에서 완전 제외)
- 비밀번호 인증 (세션 유지)
- **카테고리** 추가 / 수정 / 삭제 + 커버 이미지 업로드 + `multiIngredient` 설정
- **아이템** 추가 / 수정 / 삭제 — 이름, 설명, 재료(autocomplete), 태그, 이미지, 서브카테고리
- **재고 관리** — 아이템 목록에서 Available / Unavailable 뱃지 표시 + Mark Out/In 토글
- **재료 관리** — 재료 마스터 목록 추가 / 삭제; 아이템 폼에서 autocomplete 소스로 사용
- 변경사항은 **즉시 `src/data/` JSON 파일에 반영** (서버 재시작 없이 Vite HMR로 즉시 적용)
- 이미지는 `public/images/`에 업로드되며 경로가 아이템에 자동 저장

## 콘텐츠 업데이트 워크플로우

```
1. npm run dev 실행 (Vite 5173 + Express 3001 동시 기동)
2. /admin 에서 카테고리 / 아이템 편집
   → 저장 즉시 src/data/*.json 파일에 반영
3. 이미지는 어드민 파일 선택 → public/images/에 자동 업로드
4. git commit + push → Vercel 자동 재배포
```

## 데이터 구조

### categories.json

```json
[
  {
    "id": "bourbon",
    "name": "Bourbon",
    "description": "American whiskey",
    "coverImage": "/images/cover.jpg",
    "note": "Optional serving note",
    "multiIngredient": false
  }
]
```

`multiIngredient`: `false` — 스피릿 등 재료 없이 이름만 표시 / `true` — 칵테일 등 재료 목록 표시 및 어드민 재료 입력 활성화

### items.json

카테고리 id를 키로 하는 단일 객체. 값은 아이템 배열.

```json
{
  "bourbon": [
    { "name": "Woodford Reserve" },
    { "name": "Knob Creek", "available": false }
  ],
  "cocktails": [
    {
      "id": "Manhattan",
      "name": "Manhattan",
      "subcategory": "Classic",
      "description": "Flavor notes...",
      "ingredients": ["Bourbon 60ml", "Sweet Vermouth 30ml"],
      "tags": ["Strong", "Stirred"],
      "image": "/images/filename.jpg",
      "available": true
    }
  ]
}
```

- `multiIngredient: false` 카테고리 아이템은 `name`만 필수. `available: false`면 공개 메뉴에서 숨김.
- `multiIngredient: true` 카테고리 아이템은 `id`, `ingredients` 필드 포함.

### ingredients.json

```json
["Bourbon", "Sweet Vermouth", "Angostura Bitters"]
```

어드민 아이템 폼의 재료 autocomplete 소스로 사용되는 평면 배열.

## 개발 서버 구성

| 서버 | 포트 | 역할 |
|---|---|---|
| Vite | 5173 | 프론트엔드 HMR |
| Express (`server.js`) | 3001 | 데이터 조회 + 이미지 업로드 + JSON 파일 저장 API |

앱 시작 시 `GET /api/data/categories`, `GET /api/data/items`로 데이터를 fetch합니다 (빌드 타임 static import 아님).

Express 서버는 개발 시에만 사용되며 프로덕션 배포에는 포함되지 않습니다.  
Vercel 배포 후에는 어드민 자체가 제외되므로 API 서버가 불필요합니다.

## 디자인 토큰

| 역할 | 값 |
|---|---|
| 배경 | `#141210` (웜 블랙) |
| 포인트 | `#C5A880` (빛바랜 황동) |
| 텍스트 | `#EAE6DF` (크림) |
| 보조 텍스트 | `#C8C2B8` (뮤트 크림) |
| 테두리 | `#2E2823` (다크 브라운) |

폰트: **Cormorant Garamond** (타이틀, 이탤릭 세리프) + **Lato** (본문)

## 로컬 실행

```bash
npm install
npm run dev   # Vite (localhost:5173) + Express dev server (localhost:3001) 동시 실행
```

## 프로덕션 빌드

```bash
npm run build   # dist/ 생성
npm run preview # 빌드 결과 로컬 미리보기
```

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-06-04 | 재료 재고-메뉴 연동 (available 토글, 공개 메뉴 자동 필터) / 재료 마스터 목록 + 어드민 재료 관리 섹션 + 아이템 폼 autocomplete / 아이템 데이터 단일 파일(`items.json`)로 통합 및 서버 fetch 방식으로 전환 / `type` 필드 제거 → `multiIngredient` 플래그로 대체 |
| 2026-06-04 | 카테고리 커버 이미지 업로드 기능 추가 / Cocktails 카테고리 추가 및 구조 정리 / localStorage 제거 → Express API 서버로 직접 JSON 파일 저장 방식으로 전환 |
| 2026-05-28 | 어드민 로컬 전용 전환, 이미지 git 직접 관리 / 카드 썸네일 이미지 표시, 서브카테고리 우선 정렬, 리스트/테이블 뷰 스타일 통일 / 어드민 개선, 메뉴 전체 검색, 상세팝업 전면 개방, 서브카테고리 관리 UI |
| 2026-05-25 | 카테고리/아이템 구조로 메뉴 전면 개편, 어드민 페이지, 다중 뷰 모드 추가 |
| 2026-05-24 | 프로젝트 초기 구성 — Vue 3 + Vite + Tailwind CSS v4, 3페이지 SPA |
