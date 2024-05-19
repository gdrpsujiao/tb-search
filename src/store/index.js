import { createStore } from 'vuex'

import createPersistedstate from 'vuex-persistedstate'

import test from './modules/test'

export default createStore({
    modules: {
        test
    },
    plugins: [
        createPersistedstate({
            storage: window.sessionStorage
        })
    ]
})