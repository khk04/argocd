#!/usr/bin/env bash


NAME_SPACE="kafka"

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
helm repo add kafka-ui https://provectus.github.io/kafka-ui-charts

helm repo update

echo "kafka"

if helm status kafka -n kafka >/dev/null 2>&1; then
	echo "kafka already deployed please delete it first"
else
	helm install kafka -n kafka -f ../chart/kafka/values.yaml --version 23.0.1 --set kraft.enabled=false bitnami/kafka
#	helm install kafka bitnami/kafka --version 25.3.5 -n kafka -f ../chart/kafka/values.yaml --set kraft.enabled=false 
fi

echo "kafka-ui"
if helm status kafka-ui -n kafka >/dev/null 2>&1; then
	echo "kafka-ui already deployed please delete it first"
else
	helm install kafka-ui kafka-ui/kafka-ui -n kafka --version 0.6.2 --set envs.config.KAFKA_CLUSTERS_0_NAME=local --set envs.config.KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092 -f ../chart/kafka-ui/values.yaml
fi

kubectl apply -f ../chart/kafka-ui/issuer.yaml
