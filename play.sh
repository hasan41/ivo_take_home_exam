#!/bin/bash
# Run the agent using Node 24 (required for isolated-vm compatibility)
# Usage: ./play.sh [--iterations=N]
PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH" \
  node --no-node-snapshot --max-old-space-size=8192 main.js "$@"
