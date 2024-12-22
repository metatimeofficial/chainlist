#!/bin/bash

# source .env if it exists
set -a
[ -f .env ] && . .env

# find the last commit hash and commit comment and author
COMMIT_AUTHOR=$(git log -1 --pretty=%an)
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_COMMENT=$(git log -1 --pretty=%B)
# starting time in UTC string and timestamp (for calculating build duration)
START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME_TS=$(date -u +"%s")

echo ""
echo "======================="
echo "🔨 New build started"
echo "💬 $COMMIT_COMMENT"
echo "🦙 $COMMIT_AUTHOR"
echo "📸 $COMMIT_HASH"
echo "======================="
echo ""

next build 2>&1 | tee build.log
BUILD_STATUS=${PIPESTATUS[0]}

BUILD_TIME_SEC=$(($(date -u +"%s") - $START_TIME_TS))
BUILD_TIME_MIN=$(($BUILD_TIME_SEC / 60))
BUILD_TIME_STR=$(printf "%ss" $(($BUILD_TIME_SEC % 60)))
if [ $BUILD_TIME_MIN -gt 0 ]; then
  BUILD_TIME_STR=$(printf "%sm %s" $BUILD_TIME_MIN $BUILD_TIME_STR)
fi

# find the parent directory name of the file _buildManifest.js within the .next/static directory
BUILD_ID=$(find .next -name _buildManifest.js | sed 's/\/_buildManifest.js//g' | sed 's/\.next\/static\///g')

echo ""
echo "======================="
if [ $BUILD_STATUS -eq 0 ]; then
  echo "🎉 Build succeeded in $BUILD_TIME_STR"
else
  echo "🚨 Build failed in $BUILD_TIME_STR"
fi
echo "📅 Build started at: $START_TIME"
if [ -n "$BUILD_ID" ]; then
  echo "📦 Build ID: $BUILD_ID"
fi
echo "======================="
echo "💬 [$COMMIT_COMMENT]"
echo "🦙 $COMMIT_AUTHOR"
echo "📸 $COMMIT_HASH"
echo "======================="
echo ""

node ./scripts/build-msg.js $BUILD_STATUS "$BUILD_TIME_STR" "$START_TIME" "$BUILD_ID" "$COMMIT_COMMENT" "$COMMIT_AUTHOR" "$COMMIT_HASH"

# exit with the build status
exit $BUILD_STATUS