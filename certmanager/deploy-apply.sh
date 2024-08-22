#!/usr/bin/env bash

DEPLOY_TYPE="apply"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo "${DEPLOY_TYPE}..."
echo ""

KUBE_CONFIG="/Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml"

kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} -f cert-manager.yaml
