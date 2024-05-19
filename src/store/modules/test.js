const SET_STORE_TEST = 'SET_STORE_TEST'

const state = () => ({
    storeTest: ''
})

const mutations = {
    [SET_STORE_TEST]: (state, data) => {
        state.storeTest = data
    }
}

const actions = {
    setStoreTest({ commit }, val) {
        commit(SET_STORE_TEST, val)
        console.log('store action', val)
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters: {}
}