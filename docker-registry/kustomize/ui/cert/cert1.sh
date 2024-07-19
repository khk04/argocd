#!/bin/bash

kubectl delete -f ./issuer-letsencrypt-prod.yaml
rm -rf issuer-letsencrypt-prod.yaml

cat << EOF > issuer-letsencrypt-prod.yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: letsencrypt-prod
  namespace: docker
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: khkraining@juxtagene.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod
    # Enable the HTTP-01 challenge provider
    solvers:
    # An empty 'selector' means that this solver matches all domains
    - selector: {}
      http01:
        ingress:
          class: nginx
EOF

kubectl apply -f ./issuer-letsencrypt-prod.yaml
