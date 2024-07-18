#!/usr/bin/env bash
 
NAME_SPACE="kafka"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo " ${NAME_SPACE} issuer apply ..."
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
kind: Issuer
metadata:
  name: letsencrypt-prod
  namespace: ${NAME_SPACE}
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: khkraining@falinux.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod
    # Enable the HTTP-01 challenge provider
    solvers:
    # An empty 'selector' means that this solver matches all dojuxtas
    - selector: {}
      http01:
        ingress:
          class: nginx
" | kubectl --kubeconfig $KUBE_CONFIG apply -f -
