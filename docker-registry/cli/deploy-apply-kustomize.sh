#!/usr/bin/env bash

NAME_SPACE="docker"
DEPLOY_TYPE="apply"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

IF_NS=$(kubectl get ns | grep "$NAME_SPACE")

if [ -z "$IF_NS" ]; then
    kubectl  create namespace "$NAME_SPACE"
fi

kubectl ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize
