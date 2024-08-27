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

msg "${GREEN}Setting up the cert-manager...${NOFORMAT}"
cd certmanager/

./deploy-apply.sh

cd -


msg "${GREEN}Setting up the argocd...${NOFORMAT}"
cd argocd/cli

./deploy-apply-argocd.sh

./argocd-restore.sh

cd -

msg "${GREEN}Setting up the issuer...${NOFORMAT}"
./002-apply-issuer.sh


msg "${GREEN}Building the docker images...${NOFORMAT}"
./003-build-docker-images.sh