#!/bin/bash
# Build a cPanel upload tarball on this machine.
# Does not include .env or ssh keys. Create .env on the server after extract.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT="${ROOT}/plugo-cpanel.tar.gz"
SITE_URL="${CPANEL_SITE_URL:-https://example.com}"

if [ ! -d node_modules ]; then
  echo "Run npm ci first."
  exit 1
fi

echo "Generating Prisma client (JS engine + MariaDB adapter)..."
npx prisma generate

echo "Writing prisma/deploy.sql..."
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/deploy.sql

echo "Building Next.js for ${SITE_URL}..."
export NODE_ENV=production
export SKIP_DB_BUILD=1
export NEXT_PUBLIC_SITE_URL="$SITE_URL"
npx next build

echo "Packing ${OUT}..."
rm -f "$OUT"
COPYFILE_DISABLE=1 tar -czf "$OUT" \
  --exclude='./.git' \
  --exclude='./.github' \
  --exclude='./.env' \
  --exclude='./.env.*' \
  --exclude='./.next/cache' \
  --exclude='./.vercel' \
  --exclude='./sshkey' \
  --exclude='./sshkey.pub' \
  --exclude='./public/uploads' \
  --exclude='./plugo-cpanel.tar.gz' \
  --exclude='./plugo-release.tar.gz' \
  --exclude='./*.tar.gz' \
  --exclude='./.DS_Store' \
  -C "$ROOT" \
  .

BYTES="$(wc -c < "$OUT" | tr -d ' ')"
echo "Done: ${OUT} (${BYTES} bytes)"
echo
echo "On cPanel:"
echo "1. File Manager → app folder (e.g. /home/YOURUSER/plugo)"
echo "2. Upload and Extract plugo-cpanel.tar.gz"
echo "3. Create .env in that folder:"
echo "   DATABASE_URL=mysql://CPANEL_DB_USER:PASSWORD@127.0.0.1:3306/CPANEL_DB_NAME"
echo "   AUTH_SECRET=(long random string)"
echo "   JWT_SECRET=(same value as AUTH_SECRET)"
echo "   NEXT_PUBLIC_SITE_URL=${SITE_URL}"
echo "   NODE_ENV=production"
echo "4. Setup Node.js App: Node 20, startup file = server.js, then Restart"
