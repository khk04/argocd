import axios from 'axios'

const state = {
    username: null,
    password: null,
    auth: false,
    endState__: null
}

const getters = {
    username() { return state.username },
    password() { return state.password },
    auth() { return state.auth },
    endGetters__() { return null }
}

const mutations = {
    setUsername(state, payload) { state.username = payload },
    setPassword(state, payload) { state.password = payload },
    setAuth(state, payload) { state.auth = payload },
    endMutations__() {}
}

const actions = {
    // actTest({ state, commit, dispatch }, args) {
    //     console.log('CALL actTest()')
    //     return 'test'
    // },
    async auth({}, auth) {
        try {
            const response = await axios.post(`/login`, auth)
            let result = response.data.auth
            state.username = auth.username
            state.password = auth.password
            state.auth = result
        } catch (e) {
            state.username = null
            state.password = null
            state.auth = false
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