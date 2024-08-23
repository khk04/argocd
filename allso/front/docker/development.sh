#!/usr/bin/env bash

set -e

export selected_directory=$(realpath ../apps/main)

echo "선택된 디렉토리: $selected_directory"

# docker-compose build allso-services-frontend-monitor-dev

docker-compose up allso-services-frontend-monitor-dev

# docker run \
#   --name allso-services-frontend-monitor-dev \
#   -ti \
#   --rm \
#   -v ${selected_directory}:/app \
#   -p 8085:8080 \
#   --workdir /app/ \
#   services/allso-frontend-monitor-dev:latest \
#   bash -c 'yarn install; yarn serve'
