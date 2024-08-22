#!/bin/bash

EVENTS=("end" "execbegin" "execlaunch" "queue" "run")

for event in "${EVENTS[@]}"; do
    cd $event
    ./apply.sh
    cd -
done
