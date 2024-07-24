#!/usr/bin/env bash

NAME_SPACE="redis"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo "seegene cluster ${NAME_SPACE} delete..."
echo ""

KUBE_CONFIG="$HOME/.kube/config-olaf"
echo "redis"
if helm status job-redis -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete job-redis -n redis
else
	echo "there no service named redis in kubernetes $NAME_SPACE"
fi

kubectl delete -k ../kustomize/kafka-redis-publisher -n redis
