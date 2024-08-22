#!/usr/bin/env bash

set -e

export selected_directory=$(realpath ../apps/miso)


echo "선택된 디렉토리: $selected_directory"

docker-compose up miso-services-frontend-api-server-build

mkdir -p deployment/html
cp -av ${selected_directory}/dist deployment/html

docker-compose build miso-services-frontend-api-server

rm -rf deployment/html

DOCKER_REG="az.docker.juxtagene.com"
DOCKER_PATH="services"
DOCKER_REG_USER="juxtagene"
DOCKER_REG_PASSWORD="qwer1234"
DOCKER_IMG_NAME="miso-frontend-api-server"
DOCKER_IMG_TAG="latest"

docker login -u ${DOCKER_REG_USER} -p ${DOCKER_REG_PASSWORD} ${DOCKER_REG}
docker tag ${DOCKER_PATH}/${DOCKER_IMG_NAME} ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker push ${DOCKER_REG}/${DOCKER_PATH}/${DOCKER_IMG_NAME}:${DOCKER_IMG_TAG}
docker logout ${DOCKER_REG}

# kubectl -n miso rollout restart deployment/frontend
