import mathjs from 'mathjs'

export default {

    // 倍数
    multiples: [{
            label: '1/2',
            value: 0.5
        },
        {
            label: '2X',
            value: 2
        },
        {
            label: 'MAX',
            value: null
        }
    ],

    // 币种
    currencys: [{
            name: 'TONT',
            min: 0.1,
            max: 10000
        },
        {
            name: 'ONG',
            min: 0.1,
            max: 10000
        },
        {
            name: 'TNT',
            min: 10,
            max: 10000
        }
    ],

    /**
     * 计算投注金额
     * @param {*} current 当前值
     * @param {*} multiple 倍数
     * @param {*} max 最大值
     */
    computeBetting(current, multiple, max) {
        let temp = 0;
        if (!multiple || mathjs.multiply(current, multiple) > max) {
            temp = max;
        } else {
            temp = mathjs.multiply(current, multiple);
        }
        return temp;
    },

    /**
     * 校验投注内容
     * @param {*} ctx 
     */
    checkForm(ctx) {
        if (!ctx.betting.current) {
            ctx.$message({
                message: ctx.$t('game.beetinIsNull'),
                type: 'warning'
            });
            return false;
        }
        return true;
    }

}