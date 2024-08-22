import axios from 'axios'

const state = {
    jobs: {
        ttime: 0,
        tjobs: 0,
        rjobs: 0,
        ijobs: 0,
    },
    nodes: [],
    cpuDatas: {},
    memDatas: {},
    AllCpuDatas: {},
    AllMemDatas: {},
    AllNodeDatas: {},
    lineLabel: [],
    cpuDatasets: [],
    memDatasets: [],
    chartCpuDatas: {},
    chartMemDatas: {},
    colorSet: ['#00ACC1', '#039BE5', '#8000FF', '#E0E0E0', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF'],
    endState__: null
}

const getters = {
    nodes() { return state.nodes },
    jobs() { return state.jobs },
    chartCpuDatas() { return JSON.parse(JSON.stringify(state.chartCpuDatas)) },
    chartMemDatas() { return JSON.parse(JSON.stringify(state.chartMemDatas)) },
    AllCpuDatas() { return JSON.parse(JSON.stringify(state.AllCpuDatas)) },
    AllMemDatas() { return JSON.parse(JSON.stringify(state.AllMemDatas)) },
    AllNodeDatas() { return JSON.parse(JSON.stringify(state.AllNodeDatas)) },
    endGetters__() { return null }
}

const mutations = {
    setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {
    async getPbsNodes() {
        try {
            const response = await axios.get(`/api/pbs/nodes/cluster2`)
                // const response = await axios.get(`/demo/pbs/nodes`)
            state.nodes = response.data
            actions.getLineChart(response.data)
            actions.getNodeInfo(response.data)
        } catch (e) {
            console.error(e)
        }
    },
    async getNodeInfo(nodes) {

        // console.log(nodes)

        let tcpus = 0
        let rcpus = 0
        let icpus = 0
        let cpurate = 0

        let tmem = 0
        let rmem = 0
        let imem = 0

        let tnodes = 0
        let rnodes = 0
        let inodes = 0
        let noderate = 0

        nodes.forEach((node, index) => {
            console.log(node)
            tcpus = tcpus + Number(node["tcpus"])

            rcpus = rcpus + Number(node['rcpus'])
            icpus = icpus + Number(node['icpus'])

            tmem = tmem + Number(node["rmem"]) + Number(node["imem"])
            rmem = rmem + Number(node["rmem"])
            imem = imem + Number(node["imem"])

            if (node["rcpus"] === 0) {
                inodes = inodes + 1
            } else {
                rnodes = rnodes + 1
            }

            tnodes = tnodes + 1
        })
        if (rcpus === 0) {
            cpurate = 0
        } else {
            cpurate = Math.floor((rcpus / tcpus) * 100)
        }
        if (rnodes === 0) {
            noderate = 0
        } else {
            noderate = Math.floor((rnodes / tnodes) * 100)
        }

        state.AllCpuDatas = {
            tcpus: tcpus,
            rcpus: rcpus,
            icpus: icpus,
            rate: cpurate,
        }
        state.AllMemDatas = {
            tmem: tmem,
            rmem: rmem,
            imem: imem,
        }

        state.AllNodeDatas = {
            tnodes: tnodes,
            rnodes: rnodes,
            inodes: inodes,
            rate: noderate,
       }
        // console.log(state.AllNodeDatas)

    },
    async getLineChart(nodes) {
        // console.log('getLineChart(nodes)')
            // console.log(state.cpuDatas)

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

        nodes.forEach((node, index) => {
            if (typeof state.cpuDatas[node.name] === 'undefined') {
                state.cpuDatas[node.name] = []
            }
            if (typeof state.memDatas[node.name] === 'undefined') {
                state.memDatas[node.name] = []
            }
            if (state.cpuDatas[node.name].length === data_count) state.cpuDatas[node.name].shift()
            if (state.memDatas[node.name].length === data_count) state.memDatas[node.name].shift()

            // let cmax = Number(node.tcpus)
            // let cmin = 0

            // let crandom = Math.floor(Math.random() * (cmax - cmin) + cmin + 1)
            // state.cpuDatas[node.name].push(crandom)
            state.cpuDatas[node.name].push(node['rcpus'])

            // let mmax = Number(node.rmem + node.imem)
            // let mmin = 0

            // let mrandom = Math.floor(Math.random() * mmax + mmin + 1)
            // console.log("mrandom: " + mrandom)
            // state.memDatas[node.name].push(mrandom)
            state.memDatas[node.name].push(node['rmem'])

            state.cpuDatasets[node.name] = {
                label: node.name,
                borderColor: state.colorSet[index],
                backgroundColor: 'transparent',
                data: state.cpuDatas[node.name]
            }
            state.memDatasets[node.name] = {
                label: node.name,
                borderColor: state.colorSet[index],
                backgroundColor: 'transparent',
                data: state.memDatas[node.name]
            }
        });

        let cpuDatasets = Object.values(state.cpuDatasets)
        let memDatasets = Object.values(state.memDatasets)

        state.chartCpuDatas = {
            labels: state.lineLabel,
            datasets: cpuDatasets
        }
        state.chartMemDatas = {
            labels: state.lineLabel,
            datasets: memDatasets
        }
    },
    async getPbsJobs() {
        try {
            const response = await axios.get(`/api/pbs/jobs/cluster2`)
                // const response = await axios.get(`/demo/pbs/jobs`)
            let jobs = response.data

            // console.log(jobs)

            let user_use_array = [
                { "name": "User1", "value": 0 },
                { "name": "User2", "value": 0 },
                { "name": "User3", "value": 0 },
                { "name": "User4", "value": 0 },
            ]
            let user_use = jobs.user_use

            let user_use_key = Object.keys(user_use)

            user_use_key.forEach((key, index) => {
                user_use_array.push({ "name": key, "value": user_use[key] })
            })

            user_use_array.sort(function(a, b) {
                if (a.value > b.value) {
                    return -1;
                }
                if (a.value < b.value) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });

            state.jobs = {
                ttime: jobs.ttime,
                tjobs: jobs.tjobs,
                rjobs: jobs.rjobs,
                ijobs: jobs.ijobs,
                user_use: user_use_array,
                current_jobs: jobs.current_jobs,
            }
        } catch (e) {
            console.error(e)
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