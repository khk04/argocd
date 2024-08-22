#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT
cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}
DOCKER_REG="az.docker.juxtagene.com"
DOCKER_PATH="service"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="kafka-redis-publisher"
DOCKER_IMG_TAG="latest"

echo ""
echo "Docker image build and push registry ..."
echo ""

#echo "insert image version"
#read DOCKER_IMG_TAG

export DOCKER_IMG_TAG=$DOCKER_IMG_TAG

export DOCKER_IMG_NAME="kafka-redis-publisher"
export DOCKER_PATH="services"


docker-compose build kafka-redis-publisher

docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}

# commit 할 때 주석 해주세요.
#kubectl -n redis rollout restart deployment/kafka-redis-publisher
