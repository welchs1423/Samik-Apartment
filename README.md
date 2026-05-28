# Samik — Private Cocktail Bar

개인 칵테일 바 웹사이트. 스피크이지(Speakeasy) 무드의 올드 바 감성을 담은 SPA입니다.

## 기술 스택

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 8** — 빌드 툴
- **Tailwind CSS v4** (`@tailwindcss/vite` 플러그인)
- **Vue Router 4** — Hash 기반 클라이언트 라우팅

## 프로젝트 구조

```
src/
├── data/
│   ├── categories.json         # 카테고리 목록
│   └── items/                  # 카테고리별 아이템 JSON
│       ├── wines.json
│       ├── bourbon.json
│       └── ...
├── components/
│   ├── NavBar.vue
│   ├── SiteFooter.vue
│   ├── CocktailModal.vue       # 아이템 상세 팝업
│   └── WatercolorIllustration.vue
├── composables/
│   └── useMenuData.js          # 데이터 로드 + localStorage 오버라이드
├── pages/
│   ├── MainPage.vue            # 메인 히어로
│   ├── CategoryListPage.vue    # 전체 메뉴 (카테고리 그리드 + 검색)
│   ├── CategoryPage.vue        # 카테고리별 아이템 (그리드/리스트/테이블 뷰)
│   ├── InfoPage.vue            # 운영 시간 및 방문 안내
│   └── AdminPage.vue           # 관리자 페이지
├── router/
│   └── index.js
├── App.vue
├── main.js
└── style.css
```

## 페이지

| 경로 | 설명 |
|---|---|
| `/` | 메인 히어로 |
| `/menu` | 전체 카테고리 목록 + 이름 검색 |
| `/menu/:id` | 카테고리별 아이템 (그리드 / 리스트 / 테이블 뷰 전환) |
| `/info` | 운영 시간, 방문 안내, 위치 |
| `/admin` | 관리자 페이지 (비밀번호 보호) |

## 주요 기능

### 메뉴
- 전체 카테고리 카드 그리드
- 상단 검색창 — 전 카테고리 아이템 이름 실시간 검색, 결과 클릭 시 상세 팝업
- 카테고리 내 그리드 / 리스트 / 테이블 뷰 전환
- 서브카테고리가 있는 경우 자동 그룹핑 표시
- 모든 아이템 클릭 시 상세 팝업 (이름, 가격, 설명, 재료, 태그, 이미지)

### 어드민 (`/admin`)
- 비밀번호 인증 (세션 유지)
- **카테고리** 추가 / 수정 / 삭제 + JSON 내보내기
- **서브카테고리** 추가 / 수정 / 삭제 (카테고리별 독립 관리)
- **아이템** 추가 / 수정 / 삭제 — 이름, 가격, 설명, 재료, 태그, 이미지, 서브카테고리
- 이미지 업로드 (`/api/upload` → `public/images/`)
- 변경사항은 localStorage에 저장, Export로 소스 JSON 파일 교체 가능
- Reset으로 원본 데이터 복원

## 데이터 구조

### categories.json

```json
[
  {
    "id": "martinis",
    "name": "Martini's",
    "description": "Shaken or stirred",
    "coverImage": null
  }
]
```

### items/{id}.json — 일반 아이템

```json
[
  {
    "id": "manhattan",
    "name": "Manhattan",
    "subcategory": "Classic",
    "price": "$12",
    "description": "Flavor notes...",
    "ingredients": ["Bourbon 60ml", "Sweet vermouth 30ml"],
    "tags": ["Strong", "Stirred"],
    "image": null
  }
]
```

### items/wines.json — 와인 (서브카테고리 그룹 구조)

```json
[
  {
    "subcategory": "Red",
    "note": "By the glass & bottle",
    "items": [
      { "name": "Bogle / Cabernet Sauvignon", "glassPrice": "$8.25", "bottlePrice": "$30" }
    ]
  }
]
```

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
npm run dev   # Vite dev server (HMR) + 이미지 업로드 서버 동시 실행
```

## 프로덕션 빌드

```bash
npm run build   # dist/ 생성
npm run preview # 빌드 결과 로컬 미리보기
```

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-28 | 어드민 개선, 메뉴 전체 검색, 상세팝업 전면 개방, 서브카테고리 관리 UI |
| 2026-05-25 | 카테고리/아이템 구조로 메뉴 전면 개편, 어드민 페이지, 다중 뷰 모드 추가 |
| 2026-05-24 | 프로젝트 초기 구성 — Vue 3 + Vite + Tailwind CSS v4, 3페이지 SPA |
