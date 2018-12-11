import Vue from 'vue'
import Vuex from 'vuex'
import userService from '@/services/user'
import {
    LOGIN_STATUS,
    USER,
    BALANCE,
    BT_TYPE,
    CURRENCYS
} from './types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginStatus: true,
        user: {
            name: '张三',
            address: '64f75b59554a2008bcc1a87a7ae09249abc74a91',
            scripthash: '95feeda3a7f41e43204353de64aa7b016e4ffaa3'
        },
        balance: {
            'TONT': 2,
            'ONG': 100,
            'TNT': 7.32
        },
        // 币种类型
        btType: 'TONT',
        // 币种合集
        currencys: {
            'TONT': {
                name: 'TONT',
                min: 0.1,
                max: 10000
            },
            'ONG': {
                name: 'ONG',
                min: 0.1,
                max: 10000
            },
            'TNT': {
                name: 'TNT',
                min: 10,
                max: 10000
            }
        },
    },
    mutations: {
        [LOGIN_STATUS]({
            state
        }, data) {
            state.loginStatus = data;
        },
        [USER]({
            state
        }, data) {
            state.login = data;
        },
        [BALANCE]({
            state
        }, data) {
            state.balance = data;
        },
        [BT_TYPE]({
            state
        }, data) {
            state.btType = data;
        },
        [CURRENCYS]({
            state
        }, data) {
            state.currencys = data;
        }
    },
    actions: {
        getUserInfo({
            commit
        }) {
            const user = userService.getUserInfo();
            commit(USER, user);
            commit(BALANCE, userService.getBalance());
            commit(LOGIN_STATUS, user)
        }
    },
    getters: {
        loginStatus: state => state.loginStatus,
        user: state => state.user,
        balance: state => state.balance,
        btType: state => state.btType,
        currencys: state => state.currencys
    }
})