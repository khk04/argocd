#!/bin/bash


if [ ! -d "/shared/opt/python-modules" ]; then
  # Create the directory if it does not exist
  mkdir -p /shared/opt/python-modules
  chmod 777 -R /shared/opt/python-modules
  echo "Directory /shared/opt/python-modules created."

  pip3 install kafka-python --target=/shared/opt/python-modules
  echo "pip packages for hooks are installed"

else
  echo "Directory /shared/opt/python-modules already exists."
fi


EVENTS=("end" "execbegin" "execlaunch" "queue" "run")

for event in "${EVENTS[@]}"; do
    cd $event
    ./create.sh
    cd ..
done
