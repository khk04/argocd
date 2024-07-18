#!/usr/bin/env bash
 
NAME_SPACE="gitlab"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

CERT_NAME="git-falinux-dev"
DNS_NAME="git.falinux.dev"

echo "Certificate name: $CERT_NAME"
echo "DNS name: $DNS_NAME"

echo ""
echo "${NAME_SPACE} certificate delete ..."
echo ""
echo " 1) main cluster"
echo " 2) clone cluster"
echo " 3) erp2 cluster"
echo ""
echo -n "Select: "
read KUBE_CONFIG_SELECTION

case $KUBE_CONFIG_SELECTION in
    1) 
        echo "main cluster selected"
        KUBE_CONFIG="$HOME/.kube/config-main"
        ;;
    2) 
        echo "clone cluster selected"
        KUBE_CONFIG="$HOME/.kube/config-clone"
        ;;

    3)
        echo "erp2 cluster selected"
        KUBE_CONFIG="$HOME/.kube/config-erp2"
        ;;
esac


echo "
apiVersion: cert-manager.io/v1alpha2
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
" | kubectl --kubeconfig $KUBE_CONFIG delete -f -
