#!/usr/bin/env bash
 
NAME_SPACE="gitlab"

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    exit
}

echo ""
echo " ${NAME_SPACE} issuer delete ..."
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
    # An empty 'selector' means that this solver matches all domains
    - selector: {}
      http01:
        ingress:
          class: nginx
" | kubectl --kubeconfig $KUBE_CONFIG delete -f -