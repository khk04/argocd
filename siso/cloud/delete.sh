#!/bin/bash

EVENTS=("end" "execbegin" "execlaunch" "queue" "run")

for event in "${EVENTS[@]}"; do
    cd $event
    ./delete.sh
    cd -
done
