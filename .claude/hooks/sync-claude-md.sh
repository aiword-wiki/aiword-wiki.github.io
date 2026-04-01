#!/bin/bash
# CLAUDE.md 동기화 알림 훅
# PostToolUse (Edit/Write) 후 실행됨
# stdin으로 tool 실행 결과 JSON이 들어옴

# tool_input에서 file_path 추출
FILE_PATH=$(cat | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    # PostToolUse는 tool_input 안에 file_path가 있음
    fp = data.get('tool_input', {}).get('file_path', '')
    print(fp)
except:
    print('')
" 2>/dev/null)

# CLAUDE.md 자체 편집이거나 파일 경로가 없으면 무시
if [[ -z "$FILE_PATH" || "$FILE_PATH" == *"CLAUDE.md"* ]]; then
  exit 0
fi

# 관련 파일 패턴: src/, scripts/, 설정 파일들
if [[ "$FILE_PATH" == *"/src/"* || \
      "$FILE_PATH" == *"/scripts/"* || \
      "$FILE_PATH" == *"tailwind.config"* || \
      "$FILE_PATH" == *"next.config"* || \
      "$FILE_PATH" == *"package.json"* || \
      "$FILE_PATH" == *"/styles/"* || \
      "$FILE_PATH" == *"/types/"* || \
      "$FILE_PATH" == *"/data/"* ]]; then

  BASENAME=$(basename "$FILE_PATH")

  echo ""
  echo "┌─────────────────────────────────────────────────────┐"
  echo "│  CLAUDE.md SYNC CHECK                               │"
  echo "│  수정된 파일: $BASENAME"
  echo "│                                                     │"
  echo "│  기술스택, 디자인, 도구, 스키마, 컨벤션 변경이     │"
  echo "│  있었다면 지금 CLAUDE.md를 갱신하세요.              │"
  echo "│  결정 변경 로그에도 한 줄 추가하세요.              │"
  echo "└─────────────────────────────────────────────────────┘"
fi
