#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT
cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}
DOCKER_REG="az.docker.juxtagene.com"
DOCKER_PATH="services"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="biso-backend-api-server"
DOCKER_IMG_TAG="latest"

echo ""
echo "Docker image build and push registry ..."
echo ""

# docker-compose build --no-cache biso-services-backend-api-server
docker-compose build biso-services-backend-api-server

docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}

# kubectl -n biso rollout restart deployment/backend 