#!/bin/sh
set -e

echo "=== JobHunter Backend Entrypoint ==="

# Generate Prisma client (ensures engine binaries match the platform)
echo "--> Running prisma generate..."
npx prisma generate

# Apply pending migrations
echo "--> Running prisma migrate deploy..."
npx prisma migrate deploy

# Conditionally seed the database
if [ "${SEED_DATABASE:-false}" = "true" ]; then
  echo "--> Seeding database..."
  node dist/scripts/seed.js
fi

echo "--> Starting application..."
exec "$@"
