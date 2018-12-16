import mathjs from 'mathjs'
import { Message } from 'element-ui'
let Ont = require('ontology-ts-sdk');
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

export function ReverHexNumberToNumber(hexnumber){
    let BigNumber = require('bignumber.js');
    let util = Ont.utils
    let num = util.reverseHex(hexnumber)
   
    num = new BigNumber(num,16)

    //console.log(num)
    return num
}


export function sleep(time){
    return new Promise(((resolve) => {
        window.setTimeout(resolve, time);
    }))
}