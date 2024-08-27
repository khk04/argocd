#!/usr/bin/env bash

NAME_SPACE="argocd"
DEPLOY_TYPE="apply"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo "${NAME_SPACE} ${DEPLOY_TYPE}..."
echo ""

KUBE_CONFIG="/Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml"

IF_NS=$(kubectl --kubeconfig "$KUBE_CONFIG" get ns | grep "$NAME_SPACE")

if [ -z "$IF_NS" ]; then
    kubectl --kubeconfig "$KUBE_CONFIG" create namespace "$NAME_SPACE"
fi

kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} --validate=false -n ${NAME_SPACE} -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.11.7/manifests/install.yaml
kubectl --kubeconfig "$KUBE_CONFIG" ${DEPLOY_TYPE} -n ${NAME_SPACE} -f ../manifests/ingress.yaml

echo "argocd-server deployment 상태 확인 중..."
while true; do
    SERVICE_STATUS=$(kubectl --kubeconfig "$KUBE_CONFIG" get deployment argocd-server -n argocd -o jsonpath='{.status.conditions[?(@.type=="Available")].status}')
    if [ "$SERVICE_STATUS" = "True" ]; then
        break
    fi
    sleep 5
done
echo "argocd-server deployment 상태: $SERVICE_STATUS"
