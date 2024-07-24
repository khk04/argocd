#!/usr/bin/env bash


NAME_SPACE="redis"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo "seegene cluster ${NAME_SPACE} delpoy..."
echo ""

IF_NS=$(kubectl get ns | grep "$NAME_SPACE")

if [ -z "$IF_NS" ]; then
    kubectl create namespace "$NAME_SPACE"
fi
echo "install helm repos"

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

echo "redis"

if helm status job-redis -n redis >/dev/null 2>&1; then
	echo "job-redis already deployed please delete it first"
else
	helm install job-redis bitnami/redis -n redis -f ../chart/redis-values.yaml --version 17.13.2
fi

echo "kafka-redis-publisher"

kubectl apply -k ../kustomize/kafka-redis-publisher/ -n redis
