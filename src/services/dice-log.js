
import { toFixed } from '@/utils/util'

export default {
    /**
     * 处理投注记录数据
     * @param {*} list 
     */
    processData(ctx, list = []) {
        var codes = ctx.$config.currencyCodes;
        var degree = ctx.$config.degree;
        return list.map(item => ({
            gameid: item.gameid,
            address: item.address,
            usernumber: item.usernumber,
            sysnumber: item.sysnumber,
            amount: toFixed(item.amount / degree[codes[item.tokentype]]),
            tokentype: codes[item.tokentype],
            bonus: item.usernumber > item.sysnumber ? toFixed((98 / item.usernumber) * (item.amount / degree[codes[item.tokentype]])) : 0
        }))
    }
}