const state = {
    mass_url: 'https://maas.juxtagene.com:5443/MAAS/r/machines',
    rancher_url: 'https://rancher.juxtagene.com',
    database_url: 'https://10.10.101.57:8443/graph/login',
    olafmgmt00_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-8&var-instance=olafmgmt00:9100&kiosk',
    olafdb_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-10&var-instance=olaflogin00:9100&kiosk',
    olaf00_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-4&var-instance=olaf00:9100&kiosk',
    olaf01_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-5&var-instance=olaf01:9100&kiosk',
    olaf02_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-6&var-instance=olaf02:9100&kiosk',
    olaf03_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-7&var-instance=olaf03:9100&kiosk',
    api00_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.10:9796&kiosk',
    api01_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.11:9796&kiosk',
    api02_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.12:9796&kiosk',
    api03_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.13:9796&kiosk',
    api04_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.14:9796&kiosk',
    api05_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus&var-instance=10.10.122.15:9796&kiosk',
    olafdb00_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-1&var-instance=olafdb00:9100&kiosk',
    olafdb01_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-2&var-instance=olafdb01:9100&kiosk',
    olafdb02_url: 'https://rancher.juxtagene.com/k8s/clusters/c-m-7vfwx4xh/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-grafana:80/proxy/d/EPhSojASz/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=Prometheus-3&var-instance=olafdb02:9100&kiosk',
    endState__: null
}

const getters = {
    mass_url() { return state.mass_url },
    rancher_url() { return state.rancher_url },
    database_url() { return state.database_url },
    olafmgmt00_url() { return state.olafmgmt00_url },
    olafdb_url() { return state.olafdb_url },
    olaf00_url() { return state.olaf00_url },
    olaf01_url() { return state.olaf01_url },
    olaf02_url() { return state.olaf02_url },
    olaf03_url() { return state.olaf03_url },
    api00_url() { return state.api00_url },
    api01_url() { return state.api01_url },
    api02_url() { return state.api02_url },
    api03_url() { return state.api03_url },
    api04_url() { return state.api04_url },
    api05_url() { return state.api05_url },
    olafdb00_url() { return state.olafdb00_url },
    olafdb01_url() { return state.olafdb01_url },
    olafdb02_url() { return state.olafdb02_url },
    // api09_url() { return state.api09_url },
    // api10_url() { return state.api10_url },
    endGetters__() { return null }
}

const mutations = {
    endMutations__() {}
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
