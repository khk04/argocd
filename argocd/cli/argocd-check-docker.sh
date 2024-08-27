#!/usr/bin/env bash

NAME_SPACE="argocd"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

KUBE_CONFIG="/Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml"

# IF_NS=$(kubectl --kubeconfig "$KUBE_CONFIG" get ns | grep "$NAME_SPACE")

# if [ -z "$IF_NS" ]; then
#     kubectl --kubeconfig "$KUBE_CONFIG" create namespace "$NAME_SPACE"
# fi

argocd_pod=$(kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} get po | grep "argocd-server-" | awk '{print $1}')

# kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- bash

# kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- bash -c "argocd app get argocd/docker-registry | grep 'Running' > /dev/null && echo 'The application \"argocd/docker-registry\" is running.' || echo 'The application \"argocd/docker-registry\" is not running.'"

kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} exec -it $argocd_pod -- bash -c '
while true; do
    status=$(argocd app get argocd/docker-registry | awk "/Running/{print \$4}")
    echo "status: $status"
    if [ "$status" == "Running" ]; then
        echo "The application \"argocd/docker-registry\" is running."
        exit 0
    else
        echo "The application \"argocd/docker-registry\" is not running. Checking again..."
        sleep 10  # Wait for 10 seconds before retrying
    fi
done'