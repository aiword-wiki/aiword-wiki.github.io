---
name: add-keyword
description: AI Wiki에 새 키워드 1개를 리서치+수집+중요도 평가 후 추가
---

# /add-keyword

AI Wiki에 새 키워드를 추가한다. 리서치, 레퍼런스 수집, 중요도 평가를 서브에이전트로 병렬 처리한 뒤 결과를 종합하여 index.html에 반영한다.

## 사용법
```
/add-keyword Agentic RAG
/add-keyword "Model Context Protocol"
```

## 워크플로우

### 1단계: 서브에이전트 정의 읽기
`.claude/agents/` 폴더의 다음 파일을 읽는다:
- `researcher.md`
- `reference-collector.md`
- `importance-analyst.md`

### 2단계: 서브에이전트 3개를 **병렬** 실행
Agent 도구로 3개를 동시에 띄운다. 각 에이전트에게 해당 정의 파일의 내용을 프롬프트로 전달하고, 대상 키워드를 명시한다.

### 3단계: 결과 종합
3개 에이전트의 결과를 합쳐 하나의 항목 객체로 구성한다:

```js
{
  id: 'kebab-case-id',
  t: '한국어 키워드',
  en: 'English Name',
  c: '카테고리',
  h: heat_레벨,
  tags: [...],
  sum: '요약',
  det: 'HTML 상세',
  rel: [...],
  refs: [...],
  videos: [...],
  added: '추가일(YYYY-MM-DD)',
  updated: '날짜'
}
```

### 4단계: 검증
- `id`가 기존 항목과 중복되지 않는지 확인
- `rel`에 있는 ID들이 기존 항목에 존재하는지 확인, 없으면 제거
- `det` HTML이 유효한지 확인

### 5단계: 다국어 번역 생성
- 확정된 `sum`과 `det`를 영어(en), 중국어(zh), 일본어(ja)로 번역
- HTML 태그는 그대로 유지하고 텍스트만 번역
- 기술 용어(LLM, RAG, MCP 등), `<code>` 내부, 브랜드명은 번역하지 않음
- 3개 언어를 병렬 생성

### 6단계: index.html 수정
- `const D = [...]` 배열 끝에 새 항목 추가
- 기존 관련 항목의 `rel` 배열에도 새 항목 ID를 추가 (양방향 연결)
- `I18N_CONTENT` 객체의 `en`, `zh`, `ja` 각각에 새 키워드 번역 추가:
```js
I18N_CONTENT.en['new-keyword-id'] = {sum: '...', det: '...'};
I18N_CONTENT.zh['new-keyword-id'] = {sum: '...', det: '...'};
I18N_CONTENT.ja['new-keyword-id'] = {sum: '...', det: '...'};
```

### 7단계: SEO 페이지 빌드
- `node build.js` 실행하여 키워드 독립 페이지(/k/)와 sitemap.xml 재생성

### 8단계: 사용자에게 결과 요약 보고
- 추가된 키워드, 카테고리, Heat, 레퍼런스 수, 영상 수, 번역 완료 여부를 간단히 보고
