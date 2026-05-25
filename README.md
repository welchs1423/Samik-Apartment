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
│   └── cocktails.json      # 칵테일 메뉴 데이터 (서버 없이 JSON으로 관리)
├── components/
│   ├── NavBar.vue          # 고정 상단 네비게이션
│   └── SiteFooter.vue      # 하단 풋터
├── pages/
│   ├── MainPage.vue        # 메인 히어로 + 티저 섹션
│   ├── MenuPage.vue        # 칵테일 메뉴 (베이스 필터 + 재료 토글)
│   └── InfoPage.vue        # 운영 시간 및 방문 안내
├── router/
│   └── index.js            # Vue Router 설정
├── App.vue
├── main.js
└── style.css               # Tailwind + Google Fonts + 전역 스타일
```

## 디자인 컨셉

올드 바 / 스피크이지 무드.

| 역할 | 값 |
|---|---|
| 배경 | `#141210` (웜 블랙) |
| 포인트 | `#C5A880` (빛바랜 황동) |
| 텍스트 | `#EAE6DF` (크림) |
| 보조 텍스트 | `#C8C2B8` (뮤트 크림) |
| 테두리 | `#2E2823` (다크 브라운) |

폰트: **Cormorant Garamond** (타이틀, 이탤릭 세리프) + **Lato Light** (본문)

## 페이지

- `/` — 메인 히어로, 바 소개
- `/menu` — 베이스별 필터 + 칵테일 카드 (클릭 시 재료 펼침)
- `/info` — 운영 시간, 방문 안내사항, 위치

## 칵테일 데이터 추가

`src/data/cocktails.json`에 아래 형식으로 항목을 추가하면 Menu 페이지에 자동 반영됩니다.

```json
{
  "id": 6,
  "name": "칵테일 이름",
  "base": "Whiskey",
  "description": "한 줄 설명",
  "ingredients": ["재료 1", "재료 2"],
  "tags": ["Sweet", "Classic"]
}
```

`base` 값은 필터 탭에 자동으로 추가됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다. Vercel Hobby 플랜 무료 배포에 최적화되어 있습니다.

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-25 | 프로젝트 초기 구성 — Vue 3 + Vite + Tailwind CSS v4, 3페이지 SPA, 칵테일 JSON 데이터 5종 |
