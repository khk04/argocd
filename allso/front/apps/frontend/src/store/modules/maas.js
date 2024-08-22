import axios from 'axios'

const state = {
    nodes: [],
    endState__: null
}

const getters = {
    nodes() { return state.nodes },
    endGetters__() { return null }
}

const mutations = {
    setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {
    async getMaasInfo() {
        try {
            const response = await axios.get(`/api/maas`)
                // console.log(response.data)
            state.nodes = response.data
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