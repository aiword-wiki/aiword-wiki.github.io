#!/bin/bash
# 대화 종료 시 PLAN.md 업데이트 알림
# Stop 이벤트에서 실행됨
# 대화 중 방향성 논의가 있었으면 PLAN.md 반영 알림

PLAN="PLAN.md"

if [ ! -f "$PLAN" ]; then
  exit 0
fi

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│  PLAN SYNC REMINDER                                 │"
echo "│                                                     │"
echo "│  이번 대화에서 방향성·우선순위·기능 변경이          │"
echo "│  논의되었다면 PLAN.md에 반영하세요.                  │"
echo "└─────────────────────────────────────────────────────┘"
