#!/bin/zsh
cd -- "${0:A:h}" || exit 1
if command -v python3 >/dev/null 2>&1; then
  python3 serve.py
elif [[ -x /Users/deigote/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 ]]; then
  /Users/deigote/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 serve.py
else
  print 'Python 3 fehlt. Du kannst stattdessen dist/index.html direkt im Browser öffnen.'
fi
read -r '?Zum Schließen Enter drücken.'
