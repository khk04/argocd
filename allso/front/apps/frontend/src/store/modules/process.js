import axios from 'axios'

const state = {
    cpuDatas: {},
    memDatas: {},
    networkDatas: {},
    diskDatas: {},
    lineLabel: [],
    cpuDatasets: [],
    memDatasets: [],
    networkDatasets: [],
    diskDatasets: [],
    chartCpuDatas: {},
    chartMemDatas: {},
    chartNetworkDatas: {},
    chartDiskDatas: {},
    colorSet: ['#00ACC1', '#039BE5', '#8000FF', '#E0E0E0'],
    endState__: null
}

const getters = {
    chartCpuDatas() { return JSON.parse(JSON.stringify(state.chartCpuDatas)) },
    chartMemDatas() { return JSON.parse(JSON.stringify(state.chartMemDatas)) },
    chartNetworkDatas() { return JSON.parse(JSON.stringify(state.chartNetworkDatas)) },
    chartDiskDatas() { return JSON.parse(JSON.stringify(state.chartDiskDatas)) },
    endGetters__() { return null }
}

const mutations = {
    setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {

    async getLineChartDemo() {
        console.log('getLineChartDemo()')

        let node_name = 'test001'

        let data_count = 6
        let date = new Date()
        let hour = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()

        hour = hour >= 10 ? hour : '0' + hour
        min = min >= 10 ? min : '0' + min
        sec = sec >= 10 ? sec : '0' + sec

        if (state.lineLabel.length === data_count) state.lineLabel.shift()
        state.lineLabel.push(hour + ":" + min + ":" + sec)

        if (typeof state.cpuDatas[node_name] === 'undefined') {
            state.cpuDatas[node_name] = []
        }
        if (typeof state.memDatas[node_name] === 'undefined') {
            state.memDatas[node_name] = []
        }
        if (typeof state.networkDatas[node_name] === 'undefined') {
            state.networkDatas[node_name] = []
        }
        if (typeof state.diskDatas[node_name] === 'undefined') {
            state.diskDatas[node_name] = []
        }

        if (state.cpuDatas[node_name].length === data_count) state.cpuDatas[node_name].shift()
        if (state.memDatas[node_name].length === data_count) state.memDatas[node_name].shift()
        if (state.networkDatas[node_name].length === data_count) state.networkDatas[node_name].shift()
        if (state.diskDatas[node_name].length === data_count) state.diskDatas[node_name].shift()

        state.cpuDatas[node_name].push(Math.round(Math.random() * 100))
        state.memDatas[node_name].push(Math.round(Math.random() * 100))
        state.networkDatas[node_name].push(Math.round(Math.random() * 100))
        state.diskDatas[node_name].push(Math.round(Math.random() * 100))

        state.cpuDatasets[node_name] = {
            label: node_name,
            borderColor: state.colorSet[0],
            backgroundColor: 'transparent',
            data: state.cpuDatas[node_name]
        }
        state.memDatasets[node_name] = {
            label: node_name,
            borderColor: state.colorSet[1],
            backgroundColor: 'transparent',
            data: state.memDatas[node_name]
        }
        state.networkDatasets[node_name] = {
            label: node_name,
            borderColor: state.colorSet[2],
            backgroundColor: 'transparent',
            data: state.networkDatas[node_name]
        }
        state.diskDatasets[node_name] = {
            label: node_name,
            borderColor: state.colorSet[3],
            backgroundColor: 'transparent',
            data: state.diskDatas[node_name]
        }

        let cpuDatasets = Object.values(state.cpuDatasets)
        let memDatasets = Object.values(state.memDatasets)
        let networkDatasets = Object.values(state.networkDatasets)
        let diskDatasets = Object.values(state.diskDatasets)

        state.chartCpuDatas = {
            labels: state.lineLabel,
            datasets: cpuDatasets
        }
        state.chartMemDatas = {
            labels: state.lineLabel,
            datasets: memDatasets
        }
        state.chartNetworkDatas = {
            labels: state.lineLabel,
            datasets: networkDatasets
        }
        state.chartDiskDatas = {
            labels: state.lineLabel,
            datasets: diskDatasets
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}