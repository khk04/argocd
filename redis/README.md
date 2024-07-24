# REDIS service


---
HPC 작업의 상태정보를 캐싱하는 역할을 위한 redis 의 서비스 디렉토리
---

### redis - kafka publisher

1. deploy
    *  cli/deploy-apply-helm.sh 에 포함되어있음
2. delete
    *  cli/delete-apply-helm.sh 에 포함되어있음
3. source code
    *  docker/app
4. deploy config
    *  kustomize/kafka-redis-publisher/
