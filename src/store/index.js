import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {
            name: '张三'
        }
    },
    mutations: {
        setUserInfo({ state }, data) {
            state.userInfo = data;
        }
    },
    actions: {
        getUserInfo({ commit }) {
            commit.setUserInfo({name: '李四'})
        }
    },
    getters: {
        userInfo: state => state.userInfo
    }
})