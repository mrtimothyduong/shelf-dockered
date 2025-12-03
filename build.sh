#!/bin/bash
# Multi-architecture build script for Shelf Docker image
# Supports AMD64 and ARM64 platforms

set -e

# Configuration
IMAGE_NAME="${IMAGE_NAME:-mrtimothyduong/shelf-dockered}"
VERSION="${VERSION:-latest}"
PLATFORMS="linux/amd64,linux/arm64"

# Parse command line arguments
PUSH=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH=true
            shift
            ;;
        --version)
            VERSION="$2"
            shift 2
            ;;
        --amd64-only)
            PLATFORMS="linux/amd64"
            shift
            ;;
        --arm64-only)
            PLATFORMS="linux/arm64"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--push] [--version VERSION] [--amd64-only | --arm64-only]"
            exit 1
            ;;
    esac
done

echo "========================================"
echo "Building Shelf Docker Image"
echo "========================================"
echo "Image: ${IMAGE_NAME}:${VERSION}"
echo "Platforms: ${PLATFORMS}"
echo "Push: ${PUSH}"
echo "========================================"

# Ensure buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo "Error: Docker buildx is not available"
    echo "Please install Docker Desktop or enable buildx"
    exit 1
fi

# Create or use existing builder
BUILDER_NAME="shelf-builder"
if ! docker buildx inspect ${BUILDER_NAME} > /dev/null 2>&1; then
    echo "Creating new buildx builder: ${BUILDER_NAME}"
    docker buildx create --name ${BUILDER_NAME} --use
else
    echo "Using existing buildx builder: ${BUILDER_NAME}"
    docker buildx use ${BUILDER_NAME}
fi

# Build command
BUILD_CMD="docker buildx build \
    --platform ${PLATFORMS} \
    --tag ${IMAGE_NAME}:${VERSION}"

# Add push flag if requested
if [ "$PUSH" = true ]; then
    BUILD_CMD="${BUILD_CMD} --push"
    echo "Note: Images will be pushed to registry after build"
else
    BUILD_CMD="${BUILD_CMD} --load"
    echo "Note: Building for local use only (use --push to push to registry)"
fi

# Complete build command
BUILD_CMD="${BUILD_CMD} \
    --file Dockerfile \
    ."

echo ""
echo "Executing build..."
echo ""

# Execute build
eval ${BUILD_CMD}

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo "Image: ${IMAGE_NAME}:${VERSION}"
echo "Platforms: ${PLATFORMS}"

if [ "$PUSH" = true ]; then
    echo ""
    echo "Images pushed to registry successfully!"
else
    echo ""
    echo "To run locally:"
    echo "  docker-compose up -d"
    echo ""
    echo "To push to registry:"
    echo "  ./build.sh --push"
fi
echo "========================================"
