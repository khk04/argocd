#!/usr/bin/env bash

NAME_SPACE="elastic"

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
echo "opensearch-dashboard (kibana)"


echo "opensearch"


echo "logstash"


#echo "fluentd"
#kubectl delete -k ../kustomize -n elastic

echo "opensearch-dashboard (kibana)"
if helm status opensearch-dashboards -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete opensearch-dashboards -n elastic
else
	echo "there are no service named opensearch-dashboards"
fi

echo "opensearch (elasticsearch)"
if helm status opensearch -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete opensearch -n elastic
else
	echo "there are no service named opensearch"
fi
#

echo "logstash"
#if helm status logstash-k8s -n $NAME_SPACE >/dev/null 2>&1; then
#	helm delete logstash-k8s -n elastic
#else
#	echo "there are no service named logstash-k8sh"
#fi

if helm status logstash-job-log  -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete logstash-job-log -n elastic
else
	echo "there are no service named logstash-job-log"
fi

if helm status logstash-job-control -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete logstash-job-control -n elastic
else
	echo "there are no service named logstash-job-control"
fi

if helm status logstash-job-state -n $NAME_SPACE >/dev/null 2>&1; then
	helm delete logstash-job-state -n elastic
else
	echo "there are no service named logstash-job-state"
fi

