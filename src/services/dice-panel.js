import mathjs from 'mathjs'
import store from '@/store'
import { client } from "ontology-dapi";
import { BT_TYPE } from '@/store/types';
import  btCode from '@/utils/btCode'
import  { sleep } from '@/utils/util'

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
  },

  /**
   * 修改币种类型
   * @param {*} type
   */
  changeBcType(type) {
    if(type && type !== store.state.bcType) {
      store.commit(BT_TYPE, type)
    }
  },
  
//这个是下注竞猜方法，参数1：当前用户的hash，参数2：下注用的那个币种类型（枚举类型）,参数3：下注数字，参数4:下注的多少，参数5:邀请人的hash（来自url，如果没有可以内置一个）
  async guess(
      fromUserScriptHash,
      tokentype,
      number,
      amount,
      inviterScriptHash = fromUserScriptHash
  ) {

    const MAX_NUMBER = 95;
    const MIN_NUMBER = 4;

    const TNT_DEGREE = 10 ^ 8; //币种的精度，最好这里变成biginter来计算，免得JS不支持那么大的数计算,这里可以弄成全局变量
    const ONG_DEGREE = 10 ^ 8;
    const TONT_DEGREE = 10 ^ 8;

    //把小数转换为整数，因为ONT区块链不支持小数，只能通过放大的方式来，实现小数
    if (tokentype === btCode.ONT) {
      //ONT不能投注，必须得充值转换为TONT，才能下注
      return;
    } else if (tokentype === btCode.TNT) {
      amount = amount * TNT_DEGREE;
    } else if (tokentype === btCode.TONT) {
      amount = amount * TONT_DEGREE;
    } else if (tokentype === btCode.ONG) {
      amount = amount * ONG_DEGREE;
    }

    if (number < MIN_NUMBER || number > MAX_NUMBER) {
      //核对一下，下注的范围，还要考虑一下，这里也不能是小数
      return;
    }
    const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3"; //合约的地址
    const operation = "Guess"; //调用合约的方法名
    const args = [
      { type: "ByteArray", value: fromUserScriptHash },
      { type: "Integer", value: tokentype },
      { type: "Integer", value: number },
      { type: "Integer", value: amount },
      { type: "ByteArray", value: inviterScriptHash }
    ]; //合约的参数

    const gasPrice = 500;
    const gasLimit = 200000;
    const result = await client.api.smartContract.invoke({
      scriptHash,
      operation,
      args,
      gasPrice,
      gasLimit
    }); //向区块链节点发送该交易，会返回该次交易的hash

    //1秒后再接下去请求,重试5次。
    for (let i = 0; i < 5; i++) {
      await sleep(1000);
      console.log(result["transaction"])
      try {
        const txlog = await client.api.network.getSmartCodeEvent(result["transaction"]);
        console.log('交易完成');
        console.log(txlog); //得到交易的状态，json里面有个notify
        break;
      } catch (e) {
        console.log('交易完成');
      }
    }
  },


}