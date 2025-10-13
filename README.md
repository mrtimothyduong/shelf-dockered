# Shelf Docker Deployment Guide

This is a Docker-enabled fork of [barrowclift/shelf](https://github.com/barrowclift/shelf) that simplifies deployment using Docker containers.

## Quick Start

### Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrtimothyduong/shelf-dockered.git
   cd shelf-dockered
   ```

2. **Configure environment variables**
   ```bash
   cp .env.template .env
   ```

3. **Edit the `.env` file with your settings**

   Required settings:
   ```bash
   # Your name for the About page
   SHELF_NAME="Your Name"

   # Public URL where Shelf will be accessible
   PUBLIC_URL=http://localhost:10800

   # Discogs credentials (for records)
   DISCOGS_USER_ID=your_discogs_username
   DISCOGS_USER_TOKEN=your_discogs_token

   # BoardGameGeek username (for board games)
   BOARDGAMEGEEK_USER_ID=your_bgg_username
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access Shelf**

   Open your browser to: `http://localhost:10800`

## Configuration

### Getting API Credentials

#### Discogs (for Records)
1. Create a Discogs account at [discogs.com](https://www.discogs.com)
2. Add records to your collection
3. Generate a Personal Access Token at: https://www.discogs.com/settings/developers
4. Add your username and token to `.env`:
   ```bash
   DISCOGS_USER_ID=your_username
   DISCOGS_USER_TOKEN=your_token_here
   ```

#### BoardGameGeek (for Board Games)
1. Create a BoardGameGeek account at [boardgamegeek.com](https://boardgamegeek.com)
2. Add games to your collection (mark as "Own")
3. Add your username to `.env`:
   ```bash
   BOARDGAMEGEEK_USER_ID=your_username
   ```

### Port Configuration

Default ports:
- Frontend: `10800`

### Disabling Collections

To hide specific shelves, set these to `false` in `.env`:
```bash
RECORD_SHELF_ENABLED=false        # Disable records
BOARDGAME_SHELF_ENABLED=false     # Disable board games
```

## Data Persistence

Docker volumes are used to persist data:
- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `shelf_logs` - Application logs
- `shelf_cache` - Cached images and data

### Data not syncing from Discogs/BGG
1. Check your credentials in `.env`
2. Verify your collections are public on Discogs/BGG
3. Check logs: `docker-compose logs -f shelf`
4. Wait a few minutes for initial sync (controlled by `REFRESH_FREQUENCY_IN_MINUTES`)

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (Port 10800)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  Shelf App      │◄────►│   MongoDB       │
│  Container      │      │   Container     │
│  (Node.js)      │      │   (Port 27017)  │
└─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  External APIs                  │
│  - Discogs                      │
│  - BoardGameGeek                │
└─────────────────────────────────┘
```

## Development

### Building locally
```bash
docker build -t shelf:local .
```

### Running tests
```bash
docker-compose exec shelf npm test
```

### Accessing container shell
```bash
docker-compose exec shelf sh
```

## Differences from Original Shelf

This Docker version differs from the [original Shelf](https://github.com/barrowclift/shelf) in the following ways:

1. **Containerized deployment** - No need to install Node.js or MongoDB on host
2. **Environment-based configuration** - Uses `.env` file instead of editing `shelf.properties`
3. **Simplified management** - Docker Compose handles all services
4. **Data persistence** - Docker volumes ensure data survives container restarts
5. **Health checks** - Built-in monitoring of service health

## Updating from Upstream

This repository tracks upstream changes from [barrowclift/shelf](https://github.com/barrowclift/shelf). To update:

```bash
# Fetch latest from upstream
git fetch upstream

# Merge into master branch
git checkout master
git merge upstream/master

# Rebuild Docker images
docker-compose up -d --build
```

## Support

For Docker-specific issues, please open an issue on this repository.

For general Shelf questions, refer to the [original Shelf documentation](https://github.com/barrowclift/shelf).

## License

This project inherits the MIT License from the original Shelf project. See [LICENSE.md](LICENSE.md) for details.
