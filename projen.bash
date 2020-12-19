#!/bin/bash
# ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
set -euo pipefail
if [ ! -f lib/cli/index.js ]; then
  echo "compiling the cli..."
  ( PATH="$(npx node -e "console.log(process.env.PATH)")";  ( jsii --silence-warnings=reserved-word --no-fix-peer-dependencies ) && ( ( ( PATH="$(npx node -e "console.log(process.env.PATH)")";  ( jsii-docgen ) ) ) ) )
fi
exec bin/projen $@