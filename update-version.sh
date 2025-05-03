#!/bin/bash
# 버전 업데이트 및 배포 스크립트

# 현재 버전 파싱
CURRENT_VERSION=$(cat public/version.json | grep -o '"version": "[^"]*"' | cut -d'"' -f4)
echo "현재 버전: $CURRENT_VERSION"

# 버전 증가 (마이너 버전)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# 패치 버전 증가
PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "새 버전: $NEW_VERSION"

# 현재 날짜시간 (ISO 형식)
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# version.json 파일 업데이트
echo "{
  \"version\": \"$NEW_VERSION\",
  \"buildDate\": \"$NOW\"
}" > public/version.json

echo "version.json 파일 업데이트 완료"

# 빌드
echo "빌드 시작..."
npm run build

# Firebase 배포
echo "Firebase에 배포 시작..."
firebase deploy

echo "완료: 버전 $NEW_VERSION이 배포되었습니다." 