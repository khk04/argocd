#!/bin/bash

kubectl delete -f ./certificate-letsencrypt-prod.yaml
rm -rf certificate-letsencrypt-prod.yaml

echo "
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: dockerui-juxtagene-com
  namespace: docker
spec:
  secretName: dockerui-juxtagene-com-tls
  issuerRef:
    name: letsencrypt-prod
  commonName: dockerui.juxtagene.com
  dnsNames:
  - dockerui.juxtagene.com
" > certificate-letsencrypt-prod.yaml

kubectl apply -f ./certificate-letsencrypt-prod.yaml


watch -n 1 kubectl -n docker describe certificate dockerui-juxtagene-com
