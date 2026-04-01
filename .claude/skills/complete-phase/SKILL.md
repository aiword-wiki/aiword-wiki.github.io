---
name: complete-phase
description: 현재 진행 플랜을 완료 처리하고 PLAN-DONE.md에 기록
---

# /complete-phase

현재 진행 중인 플랜(PLAN-CURRENT.md)을 완료 처리하고 PLAN-DONE.md에 아카이빙한다.

## 사용법
```
/complete-phase
/complete-phase "추가 메모"
```

## 워크플로우

### 1단계: 현재 상태 확인
1. `PLAN-CURRENT.md`를 읽는다
2. 진행 중인 항목이 없으면 안내하고 종료
3. 미완료 체크리스트 항목이 있으면 사용자에게 알린다
   - "미완료 항목 N개가 있습니다. 그래도 완료 처리할까요?"

### 2단계: PLAN-DONE.md에 추가
1. `PLAN-DONE.md`를 읽는다
2. PLAN-CURRENT.md의 내용을 아래 형식으로 추가한다:

```markdown
---

## {항목명} (YYYY-MM-DD 완료)

{체크리스트 전체 — 완료/미완료 상태 그대로}

### 진행 로그
{진행 로그 테이블}

{추가 메모가 있으면 여기에}
```

### 3단계: PLAN.md 업데이트
1. `PLAN.md`를 읽는다
2. 해당 항목을 `[x]`로 체크하고 `(진행 중)` 표시 제거
3. 완료 날짜 추가

### 4단계: PLAN-CURRENT.md 초기화
```markdown
# 현재 진행 중인 플랜

> `/start-phase`로 플랜을 시작하면 이 파일이 자동 업데이트됩니다.

현재 진행 중인 항목 없음.
```

### 5단계: 보고
- 완료된 항목명, 체크리스트 달성률, 소요 기간 보고
- 다음 추천 항목 제안 (PLAN.md 우선순위 기준)
