#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT
cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}
DOCKER_REG="docker.juxtagene.com"
DOCKER_PATH="services"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="allso-backend-monitor"
DOCKER_IMG_TAG="latest"

echo ""
echo "Docker image build and push registry ..."
echo ""

docker-compose build allso-services-backend-monitor

docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}

# kubectl -n monitor rollout restart deployment/backend
