#!/usr/bin/env bash

NAME_SPACE="docker"
DEPLOY_TYPE="delete"

set -Eeuo pipefail

kubectl ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize
