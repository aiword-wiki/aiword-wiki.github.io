---
name: scheduling-add
description: AI Wiki 키워드 일일 자동 업데이트 (트렌드 수집 → 키워드 추가 → HOT 표식 → 로깅 → 커밋)
---

# /scheduling-add

AI Wiki 키워드 일일 자동 업데이트. 수동 실행과 스케줄러 공용.

## 검색 기간
- 모든 검색은 **최근 48시간** 이내의 콘텐츠를 대상으로 한다.
- WebSearch 쿼리에 오늘 날짜를 포함한다 (예: "AI agent 2026-04-04").
- GeekNews MCP는 get_articles(type:'new')로 최신순 수집.

## 실행 모드

- **대화형** (`/scheduling-add`): 스킬/서브에이전트 사용 가능
- **스케줄러** (`--print` 모드): 스킬/서브에이전트 없이 인라인 처리. `.claude/prompts/scheduling-add.md` 참조.

## 실행 순서

1. 아래 소스에서 최근 48시간 내 AI 핫 토픽을 수집한다:
   - GeekNews MCP: get_articles(type:'new', limit:30) + get_weekly_news()
   - WebSearch: "AI news today site:news.ycombinator.com" (최근 48시간)
   - WebSearch: "AI machine learning new site:reddit.com" (최근 48시간)

2. data.js의 D 배열과 대조하여 아직 없는 키워드를 선정한다.
   - 선정 기준:
     1. **독립된 개념인가** — 특정 제품의 하위 기능이 아니라 AI 분야에서 독립적으로 설명할 수 있는 기술·도구·패턴이어야 한다.
     2. **위키에 없는가** — 기존 키워드와 중복되지 않아야 한다.
     3. **커뮤니티에서 화제인가** — 수집한 소스에서 실제로 언급되었어야 한다.
   - 주의:
     - 특정 제품의 기능이라도, 그 기능이 독립된 기술 패턴으로 확산되고 있다면 추가한다.
     - 등장 시점이 오래됐더라도 최근 커뮤니티에서 재조명되고 있다면 추가 대상이다.
     - "너무 세부적"이라는 이유로 쉽게 제외하지 않는다. 커뮤니티에서 언급될 정도면 충분히 중요하다.
   - 개수 제한 없음 — 기준에 부합하는 키워드는 전부 추가
   - 새로 다룰 만한 키워드가 없으면 기존 항목 중 det이 부실한 것을 보강

3. 선정된 키워드마다 리서치 + 콘텐츠 작성 + 레퍼런스 수집 + 번역 (대화형이면 /add-keyword, 스케줄러면 인라인)
   - **refs**: 공식 자료 우선 (공식문서 > 공식블로그 > 논문 > 튜토리얼)
   - **videos**: 영어 2개 + 한국어 1개 = 총 3개 고정
   - 기존 항목 수정 시 이미 있는 refs/videos는 유지하고 누락분만 추가

4. HOT_IDS 및 LAST_UPDATED 갱신
   - data.js의 `const HOT_IDS = [...]` 배열을 **전체 비우고** 이번 배치에서 트렌딩으로 식별된 키워드 ID로 교체
   - 새로 추가된 키워드 + 기존 키워드 중 이번 수집에서 화제였던 것 모두 포함
   - `const LAST_UPDATED = '...';` 값을 현재 실행 시각(UTC ISO 형식)으로 갱신

5. `node build.js` 실행하여 키워드 독립 페이지(/k/)와 sitemap.xml 재생성

6. 로깅 — log.md 맨 위에 추가 (현재 시각을 분 단위까지 확인):
   ## YYYY-MM-DD HH:MM
   - 추가: keyword-id-1, keyword-id-2, ...
   - HOT: hot-id-1, hot-id-2, ...
   - 보강: (있으면 기재, 없으면 "없음")

7. 변경 파일을 git add + 한국어 커밋 메시지 + git push
