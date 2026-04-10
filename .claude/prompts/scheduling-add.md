AI Wiki 키워드 일일 자동 업데이트. --print 모드 전용 (스킬/서브에이전트 없이 직접 처리).

## 1단계: 트렌드 수집 (최근 48시간)

GeekNews MCP로 수집한다 (HN/Reddit 핫토픽을 이미 커버):
- get_articles(type:'new', limit:30)
- get_weekly_news()

## 2단계: 키워드 선정

`keywords-index.txt`를 읽어 기존 ID 목록과 대조한다 (data.js 전체를 읽지 않는다).

선정 기준:
1. AI 분야에서 독립적으로 설명 가능한 기술/도구/패턴
2. 기존 키워드와 중복 아님
3. 수집한 소스에서 실제로 언급됨

주의:
- 특정 제품 기능이라도 독립 기술 패턴으로 확산 중이면 추가
- 오래된 기술이라도 최근 재조명되면 대상
- 커뮤니티 언급 = 충분히 중요
- 개수 제한 없음
- 새 키워드 없으면 기존 항목 중 det이 부실한 것을 보강 (data.js에서 해당 항목만 읽기)

## 3단계: 키워드별 리서치 + 콘텐츠 작성

선정된 키워드마다:

### 검색 1: 리서치 + 레퍼런스
- WebSearch로 "{키워드} 공식 문서 설명"을 검색
- **공식 자료 우선**: 공식 문서 > 공식 블로그 > 논문 > 튜토리얼 (서드파티 블로그는 공식 자료 없을 때만)
- refs 최대 5개, arXiv 논문 최대 2개 (있으면)
- 기존 항목에 이미 refs가 있으면 누락분만 추가

### 검색 2: YouTube (정확히 3개 = 영어 2 + 한국어 1)
- WebSearch `site:youtube.com {keyword}` → 영어 영상 2개
- WebSearch `site:youtube.com {한국어키워드}` → 한국어 영상 1개
- 한국어 영상 못 찾으면 `{키워드} 한국어 설명 site:youtube.com`으로 재검색
- YouTube ID는 v= 뒤 11자리만
- 기존 항목에 이미 videos가 있으면 누락분만 추가 (예: 영어 2개 있으면 한국어 1개만)

### 콘텐츠 작성
- **sum**: 1~2문장. 뭔지 + 왜 쓰는지. 수치로 시작 금지.
- **det**: `<h4>`섹션 + `<p>`문단. 줄글 중심, 글머리표 금지.
  - 순서: 개념 설명 → 사용 예시 → 심화(선택) → 주의점(선택)
  - 사용 예시는 개발자 관점으로 구체적 작성
  - `<strong>`은 핵심 개념명만, `<code>`는 코드/경로만
- **tags**: 2~4개
- **c**: prompting|model|tooling|data|agent|infra|safety|application
- **rel**: keywords-index.txt에 존재하는 id만

### 번역 (en/zh/ja)
- sum과 det를 영어, 중국어, 일본어로 번역
- HTML 태그 유지, 기술 용어/`<code>`/브랜드명 번역 안 함

## 4단계: data.js 수정

1. D 배열 마지막 항목의 `}` 뒤에 새 항목 추가:
```js
{id:'kebab-id',t:'한국어',en:'English',c:'cat',h:0,born:'YYYY-MM',tags:[...],
 sum:'...',det:`...`,rel:[...],
 refs:[{title:'...',url:'...',type:'official|blog|paper|tutorial'}],
 videos:[{title:'...',id:'...',lang:'ko|en'}],
 added:'YYYY-MM-DD',updated:'YYYY-MM-DD'},
```

2. 기존 관련 항목의 rel에 새 ID 추가 (양방향 연결) — Grep으로 해당 id를 찾아 수정

3. I18N_CONTENT에 번역 추가:
```js
I18N_CONTENT.en['new-id'] = {sum:'...',det:'...'};
I18N_CONTENT.zh['new-id'] = {sum:'...',det:'...'};
I18N_CONTENT.ja['new-id'] = {sum:'...',det:'...'};
```

4. HOT_IDS를 전체 비우고 이번 트렌딩 ID로 교체

5. LAST_UPDATED를 현재 시각(UTC ISO)으로 갱신

## 5단계: 빌드 + 로깅 + 커밋

1. `node build.js` 실행 (키워드 페이지 + sitemap + keywords-index.txt 재생성)

2. log.md 맨 위에 추가 (현재 시각 분 단위):
```
## YYYY-MM-DD HH:MM
- 추가: id-1, id-2, ...
- HOT: hot-1, hot-2, ...
- 보강: (있으면 기재, 없으면 "없음")
```

3. git add → 한국어 커밋 메시지 → git push
