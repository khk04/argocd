# k8s docker registry

* K8s 내부에 docker.falinux.dev 도메인으로 docker registry 설치 스크립트

## code download

    git clone ssh://git@git.falinux.com:10022/onitc/falinux-docker-registry.git

## k8s 에 설치법

    cd cli
    ./deploy-apply-kustomize.sh

## k8s에 삭제법

    cd cli
    ./deploy-delete-kustomize.sh

## secret.yaml 의 htpasswd 설정 방법

    docker run --entrypoint htpasswd registry:2.7.0 -Bbn falinux PassWord