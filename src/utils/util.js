import mathjs from 'mathjs'
import { Message } from 'element-ui'

/**
 * 四舍五入
 * @param {*} num 
 * @param {*} bit 小数位
 */
export function toFixed(num, bit = 2) {
    if (Number.isFinite(num)) {
        return mathjs.round(num, bit).toFixed(bit);
    } else {
        console.error('num不是一个数字');
    }
}

/**
 * 乘
 * @param {*} arr 
 */
export function multiple(arr = []) {
    return mathjs.multiply(...arr);
}

export function showMsg(msg = '无内容', type = 'warring') {
    Message({
        message: msg,
        type: type
    })
}