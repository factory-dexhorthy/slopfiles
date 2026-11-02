#!/bin/sh
# Usage: publish.sh <site-slug> <prd.md> [site.mjs flags...]
# Builds the mirror into a temp folder and deploys it to Conjure. Prints the version and URL.
set -e
[ $# -ge 2 ] || { echo "Usage: publish.sh <site-slug> <prd.md> [site.mjs flags...]" >&2; exit 2; }
slug=$1; shift
md=$1; shift
out="${TMPDIR:-/tmp}/conjure-prd-mirror/$slug"
node "$(dirname "$0")/site.mjs" "$md" "$out" "$@" >/dev/null
conjure deploy "$out" --site "$slug" --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("conjure v"+j.seq,j.url)})'
