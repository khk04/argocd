#!/usr/bin/env bash

set -Eeuo pipefail

setup_colors() {
  if [[ -t 2 ]] && [[ -z "${NO_COLOR-}" ]] && [[ "${TERM-}" != "dumb" ]]; then
    NOFORMAT='\033[0m' RED='\033[0;31m' GREEN='\033[0;32m' \
    ORANGE='\033[0;33m' BLUE='\033[0;34m' PURPLE='\033[0;35m' \
    CYAN='\033[0;36m' YELLOW='\033[1;33m'
  else
    NOFORMAT='' RED='' GREEN='' ORANGE='' BLUE='' PURPLE='' CYAN='' YELLOW=''
  fi
}

msg() {
  echo >&2 -e "${1-}"
}

setup_colors

KUBE_CONFIG="/Users/khk/work/juxtagene/quickstart/rancher/azure/kube_config_workload.yaml"

apply_issuer() {
  local NAME=$1
  local NAMESPACE=$2
  local EMAILADDRESS=$3

  cat <<EOF | kubectl --kubeconfig ${KUBE_CONFIG} -n ${NAMESPACE} apply -f -
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ${NAME}
  namespace: ${NAMESPACE}
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: ${EMAILADDRESS}
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: ${NAME}
    # Enable the HTTP-01 challenge provider
    solvers:
    # An empty 'selector' means that this solver matches all domains
    - selector: {}
      http01:
        ingress:
          class: nginx
EOF
}

issuers=(
  "letsencrypt-prod-kafka   kafka	  khkraining@juxtagene.com"
  "letsencrypt-prod-elk     elk     khkraining@juxtagene.com"
  "letsencrypt-prod-argocd  argocd  khkraining@juxtagene.com"
  "letsencrypt-prod-allso   allso  khkraining@juxtagene.com"
  # "letsencrypt-prod-miso    miso  khkraining@juxtagene.com"
  # "letsencrypt-prod-biso    biso  khkraining@juxtagene.com"
)

for issuer in "${issuers[@]}"; do
  apply_issuer $issuer
done
