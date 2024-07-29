#!/usr/bin/env bash

NAME_SPACE="argocd"
DEPLOY_TYPE="delete"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo "${NAME_SPACE} ${DEPLOY_TYPE}..."
echo ""

KUBE_CONFIG="$HOME/.kube/config"


kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} -n ${NAME_SPACE} -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.6.1/manifests/install.yaml
kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} -n ${NAME_SPACE} -f ../manifests/ingress.yaml
kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} -n ${NAME_SPACE} -f ../manifests/secret.yaml
