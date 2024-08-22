const state = {
    dashboardMenu: [
        ['메인', 'mdi-view-dashboard'],
        ['경기 안양', 'mdi-server'],
        ['경기 성남', 'mdi-server'],
    ],
    clusters: [
        ['경기 안양', 'mdi-server'],
        ['Cloud (Azure)', 'mdi-server'],
    ],
    endState__: null
}

const getters = {
    dashboardMenu() { return state.dashboardMenu },
    clustersMenu() { return state.clusters },
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