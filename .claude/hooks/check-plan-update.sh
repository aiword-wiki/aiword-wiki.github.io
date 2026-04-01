#!/bin/bash
# 플랜 진행 상황 자동 업데이트 알림 훅
# Stop 이벤트에서 실행됨
# 구현 작업 후 PLAN-CURRENT.md 업데이트를 알림

PLAN_CURRENT="PLAN-CURRENT.md"

# PLAN-CURRENT.md가 없으면 무시
if [ ! -f "$PLAN_CURRENT" ]; then
  exit 0
fi

# "현재 진행 중인 항목 없음"이면 무시
if grep -q "현재 진행 중인 항목 없음" "$PLAN_CURRENT"; then
  exit 0
fi

# 체크리스트에 미완료 항목이 있는지 확인
TOTAL=$(grep -c "\- \[.\]" "$PLAN_CURRENT" 2>/dev/null || echo "0")
DONE=$(grep -c "\- \[x\]" "$PLAN_CURRENT" 2>/dev/null || echo "0")
REMAINING=$((TOTAL - DONE))

# 체크리스트가 없으면 무시
if [ "$TOTAL" -eq 0 ]; then
  exit 0
fi

# index.html에 변경이 있었는지 확인 (실제 구현 작업이 있었는지)
HAS_CHANGES=$(git diff --name-only 2>/dev/null | grep -c "index.html" || echo "0")
HAS_STAGED=$(git diff --cached --name-only 2>/dev/null | grep -c "index.html" || echo "0")

if [ "$HAS_CHANGES" -gt 0 ] || [ "$HAS_STAGED" -gt 0 ]; then
  echo ""
  echo "┌─────────────────────────────────────────────────────┐"
  echo "│  PLAN UPDATE REMINDER                               │"
  echo "│  진행률: $DONE/$TOTAL 완료 (남은 항목: $REMAINING)       "
  echo "│                                                     │"
  echo "│  PLAN-CURRENT.md의 체크리스트와 진행 로그를         │"
  echo "│  업데이트해주세요.                                  │"
  echo "│                                                     │"
  echo "│  모두 완료했으면: /complete-phase                    │"
  echo "└─────────────────────────────────────────────────────┘"
fi
