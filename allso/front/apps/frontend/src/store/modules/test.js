const state = {
    test: 'test!!!',
    endState__: null
}

const getters = {
    test() { return state.test },
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
    actTest() {
        console.log('CALL actTest()')
        return 'test'
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}