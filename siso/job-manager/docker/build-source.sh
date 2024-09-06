#!/bin/bash


APP_NAME="job-manager"

rm ../apps/bin/${APP_NAME}
rm ../apps/src/${APP_NAME}/go.mod
rm ../apps/src/${APP_NAME}/go.sum

# if mac 
if [ "$(uname)" == 'Darwin' ]; then
	echo "Mac OS X"
	docker-compose run --name build-go \
		--rm \
		-u 1000:1000 \
		--workdir /work/src/${APP_NAME} \
		build-go-ds \
		bash -c "go mod init && go mod tidy && \
		CGO_ENABLED=1 GOOS=linux go install -a -ldflags '-extldflags \"-static\"' ./..."
fi

# exec example echo 
# ./job-manager -D -d batch/ -r docker.juxtagene.com -id juxtagene -pw "xxxxxxxxx" -br 10.0.0.4:31091 -re 10.0.0.4:32001 -C "genie" -pbs "/opt/pbs"
