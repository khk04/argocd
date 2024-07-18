#!/usr/bin/env bash
 
NAME_SPACE="kafka"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

CERT_NAME="kafka-juxtagene-com"
DNS_NAME="kafka.juxtagene.com"

echo "Certificate name: $CERT_NAME"
echo "DNS name: $DNS_NAME"

echo ""
echo "${NAME_SPACE} issuer apply ..."
echo ""
echo " 1) juxta cluster"
echo ""
echo -n "Select: "
read KUBE_CONFIG_SELECTION

case $KUBE_CONFIG_SELECTION in
    1) 
        echo "juxta cluster selected"
        KUBE_CONFIG="$HOME/.kube/config-juxta"
        ;;
esac


echo "
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ${CERT_NAME}
  namespace: ${NAME_SPACE}
spec:
  secretName: ${CERT_NAME}-tls
  issuerRef:
    name: letsencrypt-prod
  commonName: ${DNS_NAME}
  dnsNames:
  - ${DNS_NAME}
" | kubectl --kubeconfig $KUBE_CONFIG apply -f -

watch -n 1 kubectl --kubeconfig $KUBE_CONFIG -n ${NAME_SPACE} describe certificate ${CERT_NAME}
