#!/usr/bin/env bash

set -e

export selected_directory=$(realpath ../apps/frontend)


docker-compose up allso-services-frontend-monitor-build

cp -av ${selected_directory}/dist deployment/html

docker-compose build allso-services-frontend-monitor

rm -rf deployment/html

DOCKER_REG="az.docker.juxtagene.com"
DOCKER_PATH="services"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="allso-frontend-monitor"
DOCKER_IMG_TAG="latest"

docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}

# kubectl -n monitor rollout restart deployment/frontend
