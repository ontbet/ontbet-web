import http from '@/utils/http'
import { DICE_LOG, MY_DICE_LOG } from './constant'

export default {
    /**
     * 获取投注记录
     */
    getDiceLogList() {
        return http.get(DICE_LOG)
    },

    /**
     * 获取个人投注记录
     * @param {*} address 
     */
    getMyDiceLogList(address) {
        return http.get(`${MY_DICE_LOG}\\${address}`)
    }
}