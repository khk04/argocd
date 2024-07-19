#!/usr/bin/env bash

NAME_SPACE="monitor"
DEPLOY_TYPE="delete"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo " ${NAME_SPACE} ${DEPLOY_TYPE} ..."
echo ""


kubectl ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize/
