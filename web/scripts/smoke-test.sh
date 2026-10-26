#!/usr/bin/env sh
# Smoke test a running instance of the site. Does not write to the sheet.
# Usage: scripts/smoke-test.sh [base_url]   (default http://localhost:8080)
set -eu

BASE="${1:-http://localhost:8080}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
FAILED=0

check() {
  # check <label> <expected_status> <curl args...>
  label="$1"; expected="$2"; shift 2
  status="$(curl -s -o "$TMP/body" -w '%{http_code}' "$@" || true)"
  if [ "$status" = "$expected" ]; then
    echo "ok    $label ($status)"
  else
    echo "FAIL  $label (expected $expected, got $status)"
    FAILED=1
  fi
}

# Wait up to 30s for the server to come up
i=0
until curl -fs -o /dev/null "$BASE/"; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "FAIL  $BASE/ not reachable after 30s"
    exit 1
  fi
  sleep 1
done

check "GET /" 200 "$BASE/"
cp "$TMP/body" "$TMP/index.html"
if grep -q '<div id="app"' "$TMP/index.html"; then
  echo "ok    index.html has #app mount point"
else
  echo "FAIL  index.html missing #app mount point"
  FAILED=1
fi

assets="$(grep -oE '/assets/[^"]+\.(js|css)' "$TMP/index.html" || true)"
if [ -z "$assets" ]; then
  echo "FAIL  no JS/CSS bundles referenced in index.html"
  FAILED=1
fi
for asset in $assets; do
  check "GET $asset" 200 "$BASE$asset"
  # A missing asset falls back to index.html with a 200, so check the body too
  if grep -qi '<!doctype html' "$TMP/body"; then
    echo "FAIL  $asset served index.html instead of the bundle"
    FAILED=1
  fi
  if grep -q 'script.google' "$TMP/body"; then
    echo "FAIL  $asset contains the Apps Script URL"
    FAILED=1
  fi
done

check "GET unknown route falls back to index.html" 200 "$BASE/does/not/exist"
check "POST /api/signup rejects empty body" 400 -X POST \
  -H 'Content-Type: application/json' -d '{"name":"","email":""}' "$BASE/api/signup"
check "POST /api/signup honeypot is silently accepted" 200 -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"bot@example.com","groups":["fdm"],"colleagues_invited":"3"}' \
  "$BASE/api/signup"
check "PUT / is rejected" 405 -X PUT "$BASE/"

if [ "$FAILED" -ne 0 ]; then
  echo "Smoke test FAILED"
  exit 1
fi
echo "Smoke test passed"
