#!/usr/bin/env bash

NAME_SPACE="miso"
DEPLOY_TYPE="apply"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo " ${NAME_SPACE} ${DEPLOY_TYPE} ..."
echo ""

IF_NS=$(kubectl get ns | grep "$NAME_SPACE")

if [ -z "$IF_NS" ]; then
    kubectl create namespace "$NAME_SPACE"
fi

kubectl ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize/
