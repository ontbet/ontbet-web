import Vue from 'vue'
import Vuex from 'vuex'
import userService from '@/services/user'
import { ReverHexNumberToNumber } from '@/utils/util'
import {
  LOGIN_STATUS,
  BALANCE,
  BT_TYPE,
  ADDRESS,
  SCRIPT_HASH,
  EMPTY_USER,
  ACCOUNT,
  TONT,
  TNT
} from './types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginStatus: false,
        account: '',
        address: '',
        scriptHash: '',
        balance: {
            'TONT': 0,
            'ONG': 0,
            'TNT': 0
        },
        // 币种类型
        bcType: 'TONT',
    },
    mutations: {
        [LOGIN_STATUS](state, data) {
            state.loginStatus = data;
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
            Object.assign(state.balance, {
                ONG: Number(data.ONG),
                ONT: Number(data.ONT)
            });
        },
        [BT_TYPE](state, data) {
            state.bcType = data;
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
        },
        [TNT](state, data = 0) {
            state.balance['TNT'] = data;
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
                dispatch('getBalance')
            }).catch(err => {
                commit(EMPTY_USER)
            })
        },
        // 获取所有的余额
        getBalance({
            dispatch
        }) {
            dispatch('getONGAndONT')
            dispatch('getTONT')
            dispatch('getTNT')
        },
        // 获取ONG和ONT的余额
        getONGAndONT({
            commit,
            state
        }) {
            userService.getBalance(state.address).then(res => {
                commit(BALANCE, res)
            }).catch(err => {
                commit(BALANCE, {'ONG': 0, 'ONT': 0})
            });
        },
        // 获取ONT的余额
        getTONT({
            commit,
            state
        }) {
            userService.getTONT(config.contract.hash, state.scriptHash).then(res => {
                let tontbanlance = ReverHexNumberToNumber(res)
                tontbanlance = tontbanlance.div(100000000)
                tontbanlance = Number(tontbanlance.toString(10))
                commit(TONT, tontbanlance)
            }).catch(err => {
                commit(TONT, 0)
            })
        },
        // 获取TNT的余额
        getTNT({
            commit,
            state
        }) {
            userService.getTNT(config.currencys['TNT'].contractHash, state.scriptHash).then(res => {
                let tntbanlance = ReverHexNumberToNumber(res)
                tntbanlance = tntbanlance.div(100000000)
                tntbanlance = Number(tntbanlance.toString(10))
                commit(TNT, tntbanlance)
            }).catch(err => {
                commit(TNT, 0)
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
        bcType: state => state.bcType
    }
})