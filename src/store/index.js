import Vue from 'vue'
import Vuex from 'vuex'
import userService from '@/services/user'
import {
    LOGIN_STATUS,
    USER,
    BALANCE,
    BT_TYPE,
    CURRENCYS,
    CONTRACT_HASH,
    ADDRESS,
    SCRIPT_HASH,
    EMPTY_USER,
    ACCOUNT,
    TONT
} from './types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginStatus: true,
        user: {
            name: '张三',
            address: '64f75b59554a2008bcc1a87a7ae09249abc74a91',
            scriptHash: '95feeda3a7f41e43204353de64aa7b016e4ffaa3'
        },
        account: '',
        address: '',
        scriptHash: '',
        // 合约hash
        contractHash: config.contractHash,
        balance: {
            'TONT': 0,
            'ONG': 0,
            'TNT': 0
        },
        // 币种类型
        bcType: 'TONT',
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
        }
    },
    mutations: {
        [LOGIN_STATUS](state, data) {
            state.loginStatus = data;
        },
        [USER](state, data) {
            state.user = data;
        },
        [ACCOUNT](state, payload) {
            state.account = payload.account;
        },
        [ADDRESS](state, payload) {
            state.address = payload.address;
        },
        [SCRIPT_HASH](state, payload) {
            state.scriptHash = payload.scriptHash;
        },
        [BALANCE](state, data) {
            Object.assign(state.balance, data);
        },
        [BT_TYPE](state, data) {
            state.bcType = data;
        },
        [CURRENCYS](state, data) {
            state.currencys = data;
        },
        [CONTRACT_HASH](state, data) {
            state.contractHash = data;
        },
        [EMPTY_USER](state) {
            state.loginStatus = false;
            state.user = {};
            state.address = '';
            state.scriptHash = '';
            state.balance = {
                'TONT': 0,
                'ONG': 0,
                'TNT': 0
            };
        },
        [TONT](state, data = 0) {
            state.balance['TONT'] = data;
        }

    },
    actions: {
        getAccount({
            dispatch,
            commit
        }) {
            userService.getAccount().then(res => {
                commit(LOGIN_STATUS, true)
                commit(ACCOUNT, res)
                commit(ADDRESS, res)
                commit(SCRIPT_HASH, res)
                dispatch('getTont');
                return userService.getBalance(res.address)
            }).then(res => {
                commit(BALANCE, res)
            }).catch(err => {
                console.log(err);
                commit(EMPTY_USER)
            })
        },
        getTont({
            commit,
            state
        }) {
            userService.getTont(state.contractHash, state.scriptHash).then(res => {
                console.log(res);
                // 处理返回的TONT数量
                commit(TONT, res)
            })
        }
    },
    getters: {
        loginStatus: state => state.loginStatus,
        user: state => state.user,
        account: state => state.account,
        address: state => state.address,
        scriptHash: state => state.scriptHash,
        balance: state => state.balance,
        bcType: state => state.bcType,
        currencys: state => state.currencys,
        contractHash: state => state.contractHash
    }
})