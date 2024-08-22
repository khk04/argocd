#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT
cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}
DOCKER_REG="az.docker.juxtagene.com"
DOCKER_PATH="juxtagene"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="run_test_image"
DOCKER_IMG_TAG="0.1"

echo ""
echo "Docker image build and push registry ..."
echo ""

echo "insert image version"

export DOCKER_IMG_TAG=$DOCKER_IMG_TAG

export DOCKER_IMG_NAME="run_test_image"
export DOCKER_PATH="juxtagene"

docker-compose build run_test_image

docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}
