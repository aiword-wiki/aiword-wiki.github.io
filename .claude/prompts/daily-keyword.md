AI Wiki 키워드 일일 자동 업데이트.

## 검색 기간
- 모든 검색은 **최근 48시간** 이내의 콘텐츠를 대상으로 한다.
- WebSearch 쿼리에 오늘 날짜를 포함한다 (예: "AI agent 2026-04-04").
- GeekNews MCP는 get_articles(type:'new')로 최신순 수집.

## 실행 순서

1. 아래 소스에서 최근 48시간 내 AI 핫 토픽을 수집한다:
   - GeekNews MCP: get_articles(type:'new', limit:30) + get_weekly_news()
   - WebSearch: "AI news today site:news.ycombinator.com" (최근 48시간)
   - WebSearch: "AI machine learning new" site:reddit.com (최근 48시간)
   - WebSearch: "AI 최신 뉴스 오늘" (TechCrunch, The Verge, GeekNews 등)
   - WebSearch: "AI latest papers site:arxiv.org" (최근 48시간)

2. index.html의 D 배열과 대조하여 아직 없는 키워드를 선정한다.
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

3. 선정된 키워드마다 /add-keyword 실행

4. /commit 실행
