#!/bin/sh
# Docker entrypoint script for Shelf application
# Converts environment variables to shelf.properties file

set -e

PROPERTIES_FILE="/app/backend/resources/shelf.properties"

echo "Generating shelf.properties from environment variables..."

# Create properties file from environment variables
cat > "$PROPERTIES_FILE" <<EOF
# Shelf Properties File
# Generated from environment variables at $(date)

# Base Application Settings
name=${SHELF_NAME:-Owner}
twitter.handle=${SHELF_TWITTER_HANDLE:-}
site.title=${SITE_TITLE:-Shelf}
public.url=${PUBLIC_URL:-http://localhost:10800}
frontend.url=${FRONTEND_URL:-http://localhost}
backend.url=${BACKEND_URL:-http://localhost}
frontend.port=${FRONTEND_PORT:-10800}
backend.port=${BACKEND_PORT:-10801}
user.agent.base=${USER_AGENT_BASE:-Shelf/3.2.8 +https://github.com/barrowclift/shelf}

# Performance and Logging
refresh.frequency.in.minutes=${REFRESH_FREQUENCY_IN_MINUTES:-1}
request.timeout.in.seconds=${REQUEST_TIMEOUT_IN_SECONDS:-5}
max.art.size=${MAX_ART_SIZE:-400}

# MongoDB Configuration
mongodb.host=${MONGODB_HOST:-0.0.0.0}
mongodb.port=${MONGODB_PORT:-27017}
mongodb.name=${MONGODB_NAME:-shelfDb}
mongodb.collection.records.name=${MONGODB_COLLECTION_RECORDS_NAME:-recordsV2}
mongodb.collection.boardGames.name=${MONGODB_COLLECTION_BOARDGAMES_NAME:-boardGames}
mongodb.collection.books.name=${MONGODB_COLLECTION_BOOKS_NAME:-books}

# Records (Discogs Integration)
record.shelf.enabled=${RECORD_SHELF_ENABLED:-true}
discogs.user.id=${DISCOGS_USER_ID:-SET_ME}
discogs.user.token=${DISCOGS_USER_TOKEN:-SET_ME_USING_DISCOG_API}

# Board Games (BoardGameGeek Integration)
boardgame.shelf.enabled=${BOARDGAME_SHELF_ENABLED:-false}
boardgamegeek.user.id=${BOARDGAMEGEEK_USER_ID:-SET_ME}
experimental.boardgame.box.rendering=${EXPERIMENTAL_BOARDGAME_BOX_RENDERING:-false}

# Books (Goodreads Integration - Defunct)
book.shelf.enabled=${BOOK_SHELF_ENABLED:-false}
EOF

echo "Properties file generated successfully at $PROPERTIES_FILE"

# Display MongoDB connection info for debugging
echo "MongoDB connection: ${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}"

# Execute the main application
exec "$@"
