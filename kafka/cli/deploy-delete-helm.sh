#!/usr/bin/env bash

NAME_SPACE="kafka"

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
echo "kafka-ui"

if helm status kafka-ui -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete kafka-ui -n kafka 
else
	echo "there no service named kafka-ui in kubernetes $NAME_SPACE"
fi

echo "kafka"
if helm status kafka -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete kafka -n kafka 
else
	echo "there no service named kafka in kubernetes $NAME_SPACE"
fi



