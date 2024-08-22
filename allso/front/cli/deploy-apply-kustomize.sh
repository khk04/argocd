#!/usr/bin/env bash

NAME_SPACE="default"
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

kubectl --kubeconfig /Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml ${DEPLOY_TYPE} -n ${NAME_SPACE} -k ../kustomize/