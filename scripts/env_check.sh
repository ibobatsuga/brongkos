#!/usr/bin/env bash
# Production environment check (CLAUDE.md protocol step 1). Reports what is
# actually installed; exits nonzero if a render-critical tool is missing.
cd "$(dirname "$0")/.."
fail=0
row() { printf '%-22s %s\n' "$1" "$2"; }
req() {  # name, command producing a version line
  if out=$(eval "$2" 2>/dev/null) && [ -n "$out" ]; then row "$1" "$out"; else row "$1" "MISSING (required)"; fail=1; fi
}
opt() {
  if out=$(eval "$2" 2>/dev/null) && [ -n "$out" ]; then row "$1" "$out"; else row "$1" "not found (optional: $3)"; fi
}

req "node (>=22)"        'node -v'
[ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)" -ge 22 ] || { row "" "node too old"; fail=1; }
req "ffmpeg"             'ffmpeg -version | head -1 | cut -d" " -f1-3'
req "ffprobe"            'ffprobe -version | head -1 | cut -d" " -f1-3'
req "python3"            'python3 --version'
req "hyperframes (local)" 'npx --no-install hyperframes --version'
req "render browser"     'npx --no-install hyperframes browser path | tail -1'
opt "hyperframes skills" 'ls -d ~/.claude/skills/hyperframes-core >/dev/null && echo "installed in ~/.claude/skills"' 'npx hyperframes skills'
opt "whisper-cli"        'command -v whisper-cli || ls ~/.cache/hyperframes/whisper/whisper.cpp/build/bin/whisper-cli' 'bash scripts/setup.sh --with-whisper'
opt "whisper models"     'ls ~/.cache/hyperframes/whisper/models 2>/dev/null | tr "\n" " "' 'downloaded on first transcribe'

echo
npx --no-install hyperframes doctor 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E '✓|✗' || true
echo
[ $fail -eq 0 ] && echo "RESULT: render toolchain present" || echo "RESULT: missing required tools (run bash scripts/setup.sh)"
exit $fail
