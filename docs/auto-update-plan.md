# AI Wiki 자동 업데이트 계획

## 개요

맥북 상시 가동 + Claude Code CLI로 콘텐츠를 자동 갱신하는 구조.
구독 내 사용이므로 추가 비용 없음.

---

## 스케줄

| 작업 | 주기 | 시간 |
|------|------|------|
| 키워드 발굴 + 글쓰기 | 매일 | 매일 09:00 |
| Heat 전체 갱신 | 주 1회 | 월요일 10:00 |

---

## 실행 구조

```
crontab (macOS)
│
├─ 매일 09:00: 키워드 발굴 + 글쓰기
│   └─ claude --dangerously-skip-permissions -p "프롬프트"
│       ├─ 다중 소스에서 최근 AI 핫 토픽 수집
│       ├─ 기존 목록에 없는 키워드를 찾은 만큼 선정
│       ├─ 키워드당 에이전트 3종 병렬 (researcher + reference-collector + trend-analyst)
│       └─ index.html 반영 → 커밋+푸시
│
└─ 월요일 10:00: Heat 전체 갱신
    └─ claude --dangerously-skip-permissions -p "프롬프트"
        ├─ 전체 키워드 trend-analyst로 재조사
        ├─ 변동분만 index.html 반영
        └─ 커밋+푸시
```

### 실행 방법

```bash
# crontab -e
0 9 * * * cd ~/Desktop/dev/ai-wiki && claude --dangerously-skip-permissions -p "$(cat .claude/prompts/daily-keyword.md)" >> logs/daily.log 2>&1
0 10 * * 1 cd ~/Desktop/dev/ai-wiki && claude --dangerously-skip-permissions -p "$(cat .claude/prompts/weekly-heat.md)" >> logs/weekly.log 2>&1
```

프롬프트는 `.claude/prompts/`에 별도 파일로 관리.

---

## 프롬프트 설계

### daily-keyword.md (매일)

```
AI Wiki 키워드 일일 자동 업데이트.

1. 아래 소스에서 최근 AI 핫 토픽을 수집한다:
   - GeekNews MCP (get_articles, get_weekly_news)
   - WebSearch: Hacker News AI 관련 최신 글
   - WebSearch: Reddit r/MachineLearning, r/LocalLLaMA 핫 포스트
   - WebSearch: "AI" 최신 뉴스 (TechCrunch, The Verge, 긱뉴스 등)
   - WebSearch: arXiv 최신 AI 논문 트렌드
2. index.html의 D 배열과 대조하여 아직 없는 키워드를 선정
   - 선정 기준: AI 기술 키워드에 해당, 고유한 개념이 있을 것, 1회성 뉴스 제외
   - 개수 제한 없음 — 다룰 만한 키워드가 있으면 전부 추가
   - 새로 다룰 만한 키워드가 없으면 기존 항목 중 det이 부실한 것을 보강
3. 선정된 키워드마다 /add-keyword 실행
4. /commit 실행
```

### weekly-heat.md (주 1회)

```
AI Wiki Heat 주간 전체 갱신.

1. index.html의 D 배열에서 전체 키워드 목록과 현재 Heat 값을 확인
2. 각 키워드를 trend-analyst 에이전트로 재조사
   - GeekNews MCP, GitHub 활성도, arXiv 논문, Stack Overflow 질문 수
3. 기존 Heat과 비교하여 변동분만 index.html에 반영
4. updated 필드를 오늘 날짜로 갱신
5. /commit 실행
```

---

## 데이터 소스

### 키워드 발굴용

| 소스 | 방법 | 강점 |
|------|------|------|
| GeekNews | MCP (get_articles, get_weekly_news) | 한국 개발자 커뮤니티 트렌드 |
| Hacker News | WebSearch `site:news.ycombinator.com` | 글로벌 테크 커뮤니티 |
| Reddit | WebSearch `site:reddit.com r/MachineLearning OR r/LocalLLaMA` | 연구/오픈소스 커뮤니티 |
| 테크 뉴스 | WebSearch (TechCrunch, The Verge 등) | 산업 동향 |
| arXiv | WebSearch `site:arxiv.org` | 학계 최신 연구 |

### Heat 산출용

| 소스 | 방법 | 가중치 |
|------|------|--------|
| GeekNews | MCP | 25% |
| GitHub | WebSearch (레포 활성도, 스타 수) | 30% |
| arXiv | WebSearch (최근 논문 수) | 20% |
| Stack Overflow | WebSearch (최근 질문 수) | 15% |
| 테크 뉴스 | WebSearch (최근 기사 수) | 10% |

---

## 품질 보장

| 항목 | 방법 |
|------|------|
| 글 톤/구조 | CLAUDE.md 콘텐츠 컨벤션이 자동 로드됨 |
| Heat 근거 | trend-analyst가 reason 명시 |
| 이상 감지 | 로그 파일(logs/)로 실행 결과 추적 |
| 롤백 | 매 실행이 별도 커밋이므로 git revert로 즉시 복구 |
| 부재 시 | 키워드 없으면 기존 항목 보강으로 전환 (빈 커밋 방지) |

---

## 파일 구조

```
.claude/
├── prompts/
│   ├── daily-keyword.md    # 매일 키워드 발굴 프롬프트
│   └── weekly-heat.md      # 주간 Heat 갱신 프롬프트
logs/
├── daily.log               # 일일 실행 로그
└── weekly.log              # 주간 실행 로그
```

---

## 구현 순서

| 순서 | 작업 |
|------|------|
| 1 | trend-analyst.md에 arXiv/SO WebSearch 추가 |
| 2 | .claude/prompts/ 프롬프트 파일 2개 작성 |
| 3 | crontab 등록 |
| 4 | 수동 1회 테스트 실행 후 검증 |
