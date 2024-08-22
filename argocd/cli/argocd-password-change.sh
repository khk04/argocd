#!/usr/bin/env bash

NAME_SPACE="argocd"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

KUBE_CONFIG="/Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml"

IF_NS=$(kubectl --kubeconfig "$KUBE_CONFIG" get ns | grep "$NAME_SPACE")

if [ -z "$IF_NS" ]; then
    kubectl --kubeconfig "$KUBE_CONFIG" create namespace "$NAME_SPACE"
fi

argocd_pod=$(kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} get po | grep "argocd-server-" | awk '{print $1}')


echo "argocd_pod: $argocd_pod"
argcd_initpass=$(kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- argocd admin initial-password | head -1)
echo argcd_initpass: $argcd_initpass

kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- argocd login localhost:8080 
kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- argocd account update-password

