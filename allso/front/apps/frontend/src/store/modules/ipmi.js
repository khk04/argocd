import axios from 'axios'

const state = {
    state: [],
    control: [],
    nodes: {},
    endState__: null
}

const getters = {
    state() { return state.state },
    control() { return state.control },
    nodes() { return state.nodes },
    endGetters__() { return null }
}

const mutations = {
    setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {
    // actTest({ state, commit, dispatch }, args) {
    //     console.log('CALL actTest()')
    //     return 'test'
    // },
    async getPower({}, type) {
        // try {
        //     const response = await axios.get(`/ipmi/power?type=${type}`)
        // let result = response.data
        if (type === 'state') {
            let result = []
            state.state = result
        } else {
            let result = [{
                    "node": "supreme-snow01",
                    "state": "on"
                },
                {
                    "node": "supreme-snow02",
                    "state": "on"
                },
                {
                    "node": "supreme-thunder01",
                    "state": "on"
                },
                {
                    "node": "supreme-thunder02",
                    "state": "off"
                },
                {
                    "node": "supreme-jade01",
                    "state": "on"
                },
                {
                    "node": "supreme-storage01",
                    "state": "on"
                },
                {
                    "node": "supreme-storage02",
                    "state": "on"
                },
                {
                    "node": "supreme-storage03",
                    "state": "on"
                }
            ]
            state.control = result
            const items = result
            items.forEach(item => {
                state.nodes[item.node] = 'bg-' + item.state
            });
        }
        // } catch (e) {
        //     console.error(e)
        // }
    },

    async powerUpdate({}, host, state) {
        try {
            await axios.get(`/ipmi/powerUpdate?host=${host}&state=${state}`)
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