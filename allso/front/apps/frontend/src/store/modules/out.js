import axios from 'axios'

const state = {
    folder: [],
    endState__: null
}

const getters = {
    folder() { return state.folder },
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

    async getList() {
        try {
            const response = await axios.get(`/out`)
            let result = response.data
            state.folder = result
        } catch (e) {
            throw e
        }
    },

    async read(dir, name) {
        try {
            const response = await axios.get(`/out/read?dir=${dir}&file=${name}`)

            return response.data
        } catch (e) {
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