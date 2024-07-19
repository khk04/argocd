#!/usr/bin/env bash

NAME_SPACE="monitor"
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

KUBE_CONFIG="$HOME/.kube/config-juxta"


kubectl ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize/
