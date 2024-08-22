#!/bin/bash
echo -e "job-manager select"
echo "job-manager" > .select-src-target



target=$(cat .select-src-target)

rm -rf ../apps/src/$target/go.*

docker-compose run --name neuro-$target-go-ds-build \
 --rm \
 -u $(id -u ${USER}):$(id -g ${USER}) \
 --workdir /work/src/$target/ \
 neuro-go-ds \
 bash -c "go mod init && go mod tidy" 
	

