#!/usr/bin/env bash


set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
}

setup_colors() {
  if [[ -t 2 ]] && [[ -z "${NO_COLOR-}" ]] && [[ "${TERM-}" != "dumb" ]]; then
    NOFORMAT='\033[0m' RED='\033[0;31m' GREEN='\033[0;32m' ORANGE='\033[0;33m' BLUE='\033[0;34m' PURPLE='\033[0;35m' CYAN='\033[0;36m' YELLOW='\033[1;33m'
  else
    NOFORMAT='' RED='' GREEN='' ORANGE='' BLUE='' PURPLE='' CYAN='' YELLOW=''
  fi
}

msg() {
  echo >&2 -e "${1-}"
}

progressbar() {
    local width=50
    local percent=$(( $1 * 100 / $2 ))
    local load=$(( $percent * $width / 100 ))
    local bar=""
    for ((i=0; i<$load; i++)); do
        bar="$bar#"
    done
    local spaces=""
    for ((i=$load; i<$width; i++)); do
        spaces="$spaces "
    done
    printf "\r[%s%s] %d%%" "$bar" "$spaces" "$percent"
}



# --------------------------------------------------------------------------------
# default settings
setup_colors

# end default settings
# --------------------------------------------------------------------------------

# --------------------------------------------------------------------------------
# function

msg "${GREEN} Creating Hook... ${NOFORMAT}"

qmgr -c 'create hook queuejob_hook'
qmgr -c 'set hook queuejob_hook event=queuejob'


qmgr -c 'import hook queuejob_hook application/x-python default ./queuejob.py'

msg "${GREEN} Done... ${NOFORMAT}"
msg "${GREEN} Creating Hook... ${NOFORMAT}"

