import axios from 'axios'

const state = {
    csnow: [],
    thunder: [],
    lineLabel: [],
    nodeData: {},
    csnowData: {},
    thunderData: {},
    endState__: null
}

const getters = {
    csnow() { return state.csnow },
    thunder() { return state.thunder },
    lineLabel() { return state.lineLabel },
    nodeData() { return state.nodeData },
    csnowData() { return state.csnowData },
    thunderData() { return state.thunderData },
    endGetters__() { return null }
}

const mutations = {
    // setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {
    // actTest({ state, commit, dispatch }, args) {
    //     console.log('CALL actTest()')
    //     return 'test'
    // },

    async line() {
        try {
            const response = await axios.get('/ganglia/line')
            let result = response.data

            if (state.csnow.length === 10) state.csnow.shift() //데이터 10 개 이상일 경우 삭제
            if (state.thunder.length === 10) state.thunder.shift()

            state.csnow.push(result.csnow)
            state.thunder.push(result.thunder)

            let y1 = [...state.csnow]
            let y2 = [...state.thunder]

            let date = new Date()
            let hour = date.getHours()
            let min = date.getMinutes()
            let sec = date.getSeconds()

            hour = hour >= 10 ? hour : '0' + hour
            min = min >= 10 ? min : '0' + min
            sec = sec >= 10 ? sec : '0' + sec

            if (state.lineLabel.length === 10) state.lineLabel.shift()
            state.lineLabel.push(hour + ":" + min + ":" + sec)

            state.nodeData = {
                labels: state.lineLabel,
                datasets: [{
                        label: 'CSNOW',
                        borderColor: '#4CAF50',
                        backgroundColor: '#FFFFFF00',
                        data: y1
                    },
                    {
                        label: 'Thunder',
                        borderColor: '#2196F3',
                        backgroundColor: '#FFFFFF00',
                        data: y2
                    }
                ]
            }
        } catch (e) {
            throw e
        }
    },

    async bar() {
        try {
            const response = await axios.get('/ganglia/bar')
            let result = response.data[0]
            console.log(response)

            let csnowData_0 = 0
            let csnowData_1 = 0
            let csnowData_2 = 0

            if (result.csnow.cpu[0] + result.csnow.cpu[1] >= 0) {
                csnowData_0 = (result.csnow.cpu[0] + result.csnow.cpu[1]) / 2
            } else {
                csnowData_0 = 0
            }

            if ((result.csnow.user[0] + result.csnow.user[1]) >= 0) {
                csnowData_1 = (result.csnow.user[0] + result.csnow.user[1]) / 2
            } else {
                csnowData_1 = 0
            }

            csnowData_2 = 100 - csnowData_0 - csnowData_1

            let thunderData_0 = 0
            let thunderData_1 = 0
            let thunderData_2 = 0

            if (result.thunder.cpu[0] + result.thunder.cpu[1] >= 0) {
                thunderData_0 = (result.thunder.cpu[0] + result.thunder.cpu[1]) / 2
            } else {
                thunderData_0 = 0
            }

            if ((result.thunder.user[0] + result.thunder.user[1]) >= 0) {
                thunderData_1 = (result.thunder.user[0] + result.thunder.user[1]) / 2
            } else {
                thunderData_1 = 0
            }

            thunderData_2 = 100 - thunderData_0 - thunderData_1

            state.csnowData = {
                labels: ['System', 'User', 'Other'],
                datasets: [{
                    label: 'SNOW',
                    backgroundColor: [
                        '#F44336',
                        '#1D88F5',
                        '#E0E0E0'
                    ],
                    // data: [(result.csnow.cpu[0] + result.csnow.cpu[1]) / 2, (result.csnow.user[0] + result.csnow.user[1]) / 2, 100 - (result.csnow.cpu[0] + result.csnow.cpu[1]) / 2 - (result.csnow.user[0] + result.csnow.user[1]) / 2]
                    data: [csnowData_0, csnowData_1, csnowData_2]
                }, ]
            }
            console.log(state.csnowData)

            state.thunderData = {
                labels: ['System', 'User', 'Other'],
                datasets: [{
                    label: 'THUNDER',
                    backgroundColor: [
                        '#F44336',
                        '#1D88F5',
                        '#E0E0E0'
                    ],
                    // data: [(result.thunder.cpu[0] + result.thunder.cpu[1]) / 2, (result.thunder.user[0] + result.thunder.user[1]) / 2, 100 - (result.thunder.cpu[0] + result.thunder.cpu[1]) / 2 - (result.thunder.user[0] + result.thunder.user[1]) / 2]
                    data: [thunderData_0, thunderData_1, thunderData_2]
                }, ]
            }
        } catch (error) {
            throw e
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