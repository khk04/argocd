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

# define airflow version
AIRFLOW_VERSION=19.0.1


# helm add repo
function helm_add_repo() {
  msg "${GREEN}#-Adding Helm Repo${NOFORMAT}"
  helm repo add apache-airflow https://airflow.apache.org
  helm repo update
}


# helm fetch chart
function helm_fetch_chart() {
  msg "${GREEN}#-Fetching Helm Chart${NOFORMAT}"
  helm fetch bitnami/airflow --version $AIRFLOW_VERSION
}

# helm tar extract
function helm_tar_extract() {
  msg "${GREEN}#-Extracting Helm Chart${NOFORMAT}"
  if [ ! -f airflow-$AIRFLOW_VERSION.tgz ]; then
    msg "${RED}#-Error: airflow-$AIRFLOW_VERSION.tgz not found${NOFORMAT}"
    exit 1
  fi
  tar -xvf airflow-$AIRFLOW_VERSION.tgz
  rm -rf airflow-$AIRFLOW_VERSION.tgz
}

# main function
function main() {
  msg "${GREEN}#-Start main function${NOFORMAT}"
  if [ ! -d airflow ]; then
    helm_add_repo
    helm_fetch_chart
    helm_tar_extract
  fi
}

main