import mathjs from 'mathjs'

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