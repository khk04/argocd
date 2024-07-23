#!/bin/bash


docker rmi dev-docker.seegene.com/elk/fluentd-image:latest


docker build -t dev-docker.seegene.com/elk/fluentd-image:0.2 fluentd-image/

#docker tag elk/fluentd-image:0.1 docker.nemopai.com/elk/fluentd-image:0.1

docker login -u insilico -p "qwer1234" dev-docker.seegene.com
docker push dev-docker.seegene.com/elk/fluentd-image:0.2
docker logout dev-docker.seegene.com
