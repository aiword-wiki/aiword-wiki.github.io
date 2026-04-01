---
name: start-phase
description: PLAN.md에서 특정 항목을 꺼내 PLAN-CURRENT.md로 이동하고 작업 시작
---

# /start-phase

PLAN.md의 특정 Phase 또는 항목을 PLAN-CURRENT.md로 옮기고 작업을 시작한다.

## 사용법
```
/start-phase Phase 1
/start-phase 2-1
/start-phase 우선순위 1~3
```

## 워크플로우

### 1단계: 현재 상태 확인
1. `PLAN-CURRENT.md`를 읽는다
2. 이미 진행 중인 항목이 있으면 사용자에게 알리고 확인을 받는다
   - "기존 진행 항목을 완료 처리할까요?" → Yes면 `/complete-phase` 로직 실행
   - "기존 항목을 유지하면서 추가할까요?" → 병합

### 2단계: PLAN.md에서 추출
1. `PLAN.md`를 읽는다
2. 사용자가 지정한 Phase/항목 번호에 해당하는 섹션을 찾는다
3. 해당 섹션의 내용을 추출한다

### 3단계: PLAN-CURRENT.md 작성
아래 형식으로 `PLAN-CURRENT.md`를 작성한다:

```markdown
# 현재 진행 중인 플랜

> 시작: YYYY-MM-DD
> 항목: Phase X / X-X 항목명

---

## 목표
(PLAN.md에서 추출한 목표/설명)

## 체크리스트
- [ ] 세부 항목 1
- [ ] 세부 항목 2
- [ ] 세부 항목 3
...

## 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| (자동 기록) | |
```

### 4단계: PLAN.md 업데이트
- 해당 항목 옆에 `(진행 중)` 표시 추가

### 5단계: 사용자에게 보고
- 시작된 항목, 체크리스트 요약 출력
- 바로 구현 시작할지 물어본다
