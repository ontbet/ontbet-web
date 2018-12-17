import Vue from 'vue'
import Vuex from 'vuex'
import userService from '@/services/user'
import { ReverHexNumberToNumber } from '@/utils/util'
import config from '../config'
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
  TONT,
  TNT
} from './types'

Vue.use(Vuex)

console.log(config)

export default new Vuex.Store({
    state: {
        loginStatus: false,
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
        TNTcontractHash: config.TNTcontractHash,
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
                min: 1,
                max: 100,
                degree: 100000000
            },
            'ONG': {
                name: 'ONG',
                min: 1,
                max: 100
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
        // 获取Tont的余额
        getTONT({
            commit,
            state
        }) {
            userService.getTONT(state.contractHash, state.scriptHash).then(res => {
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
            userService.getTNT(state.TNTcontractHash, state.scriptHash).then(res => {
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
        bcType: state => state.bcType,
        currencys: state => state.currencys,
        contractHash: state => state.contractHash,
        domain: () => config.domain
    }
})