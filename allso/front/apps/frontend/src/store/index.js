import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import modules from './modules'

Vue.use(Vuex)

const localPaths = [
    'auth-model' // 인증 모델
]

const sessionPaths = []

const store = new Vuex.Store({
    plugins: [
        createPersistedState({ key: 'vuex-local', storage: window.localStorage, paths: ['auth-model'] })
    ],
    modules,
    // strict: process.env.NODE_ENV !== 'production'
    strict: false
})

if (process.env.NODE_ENV === 'test') store.localPaths = localPaths
if (process.env.NODE_ENV === 'test') store.sessionPaths = sessionPaths

export default store