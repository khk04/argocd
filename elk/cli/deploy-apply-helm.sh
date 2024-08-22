#!/usr/bin/env bash


NAME_SPACE="elastic"

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
helm repo add opensearch https://opensearch-project.github.io/helm-charts/
helm repo add elastic https://helm.elastic.co
helm repo update

echo "opensearch (elasticsearch)"

if helm status opensearch -n $NAME_SPACE >/dev/null 2>&1; then
	echo "elasticsearch already deployed please delete it first"
else
	helm install opensearch opensearch/opensearch -f ../chart/opensearch.yaml -n elastic --version 2.19.0 
fi

echo "opensearch-dashboard (kibana)"
if helm status opensearch-dashboards -n $NAME_SPACE >/dev/null 2>&1; then
	echo "kibana already deployed please delete it first"
else
	helm install opensearch-dashboards opensearch/opensearch-dashboards -f ../chart/opensearch-dashboards.yaml -n elastic --version 2.17.0
fi

echo "logstash"

#if helm status logstash-k8s -n $NAME_SPACE >/dev/null 2>&1; then
#	echo "logstash-k8s already deployed please delete it first"
#else
#	helm install logstash-k8s elastic/logstash --version 8.5.1 -f ../chart/logstash-k8s.yaml -n elastic
#fi

if helm status logstash-job-log  -n $NAME_SPACE >/dev/null 2>&1; then
	echo "logstash-joblog already deployed please delete it first"
else
	helm install logstash-job-log elastic/logstash --version 8.5.1 -f ../chart/logstash-job-execlog.yaml -n elastic
fi

if helm status logstash-job-control -n $NAME_SPACE >/dev/null 2>&1; then
	echo "logstash-jobcontrol already deployed please delete it first"
else
	helm install logstash-job-control elastic/logstash --version 8.5.1 -f ../chart/logstash-job-control.yaml -n elastic
fi

if helm status logstash-job-state -n $NAME_SPACE >/dev/null 2>&1; then
	echo "logstash-job-state already deployed please delete it first"
else
	helm install logstash-job-state elastic/logstash --version 8.5.1 -f ../chart/logstash-job-state.yaml -n elastic
fi

#echo "fluentd"
##kubectl apply -k ../kustomize -n elastic
#
kubectl apply -f ../chart/issuer.yaml