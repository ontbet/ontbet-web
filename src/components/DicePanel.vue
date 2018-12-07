<template>
  <div class="dice-wrap">
    <div class="dice-panel">
      <div class="dice-amount">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="dice-atr-title">{{$t('game.betting')}}(EOS)</div>
            <div class>
              <el-row>
                <el-col :span="12">
                  <el-input-number
                    v-model="bettingNumber"
                    :step="1"
                    :controls="false"
                    class="dice-input"
                  ></el-input-number>
                </el-col>
                <el-col :span="9">
                  <div class="dice-multiple">
                    <span>1/2</span>
                    <span>2X</span>
                    <span>MAX</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="dice-atr-title">{{$t('game.obtain')}}(EOS)</div>
            <div class="dice-bonus">212.00</div>
          </el-col>
        </el-row>
      </div>
      <div class="dice-attributes">
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <div class="dice-atr-title">{{$t('game.victoryCondition')}}</div>
              <span class="dice-count">
                {{target}}
                <i class="el-icon-caret-bottom" style="color:red"></i>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="dice-atr-title">{{$t('game.odds')}}</div>
              <span class="dice-count">1.63X</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="dice-atr-title">{{$t('game.probability')}}</div>
              <span class="dice-count">{{target - 1}}%</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="dice-slide">
        <el-slider v-model="target" :max="95" :min="4" height="20"></el-slider>
      </div>
      <div class="dice-user">
        <el-button type="primary" @click="test" >{{$t("btn.login")}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
let Ont = require('ontology-ts-sdk');
import { client } from "ontology-dapi";
export default {
  data() {
    return {
      bettingNumber: 0,
      target: 50,
      Address:"",
      scriptHash:""
    };
  },
  methods: {
    async test(){
        let userScriptHash = '64f75b59554a2008bcc1a87a7ae09249abc74a91'; //AQyjYLQNRXtjr6cPoru1vpCTwehg6EQPCs的scripthash
        const txlog = await client.api.network.getSmartCodeEvent({value:"e476c3212462777cd1c2a07f58151c0f942cd067866c92daf7accc699ad3e590"});
        console.log(txlog)
        //this.recharge(userScriptHash,userScriptHash,1)
    },
    async banlanceTONT(userScriptHash) {
      //判断一下长度是否是20
      const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3";
      const operation = "banlanceTONT";
      const args = [
        { type: "Bytearray", value: userScriptHash },
      ];
      const result = await client.api.smartContract.invokeRead({
        scriptHash,
        operation,
        args
      });//得到banlanceTONT返回的调用结果，结果返回的是一个hexstring的int，需要转换一下。
      return result;
    },
    async recharge(fromUserScriptHash,toUserScript,amount) {//付款账户，充值给谁，充值的个数，需要修改，不能跑完成吧，需要容错处理和健壮性

      //这里可以来一些检测，如账户的检测，是否都为20长度的字符串
      const scriptHash = '95feeda3a7f41e43204353de64aa7b016e4ffaa3'; //合约的地址
      const operation = 'Recharge';//调用合约的方法名
      const args = [{type: 'Bytearray', value: fromUserScriptHash}, {type: 'Bytearray', value: toUserScript}, {type: 'Integer', value: amount}];
      const gasPrice = 500;
      const gasLimit = 200000;
      const result = await client.api.smartContract.invoke({scriptHash, operation, args, gasPrice, gasLimit});
      console.log(result);//大概1秒后再接下去请求。
      const txlog = await client.api.network.getSmartCodeEvent(result['transaction']);//得到交易的状态，json里面有个notify
      console.log(txlog);//notify里面都有的
    },
    async LoginAndGetUserinfo(){
        let Crypto = Ont.Crypto;
        let util = Ont.utils;

        client.registerClient({});
        const account = await client.api.asset.getAccount();//得到当前插件钱包的用户地址。
        console.log(account);
         try{
          let Address = new Crypto.Address(account);
          console.log(Address);
          let newScriptHash = Address.serialize();//得到当前地址的scripthash，用于合约的调用
          console.log(newScriptHash);
          this.Address = Address;
          this.scriptHash = newScriptHash;

          let bla = banlanceTONT(newScriptHash);//获取当前钱包用户的TONT的多少。这里调用不到，肯定是我的其他有问题
          console.log(bla)
        }catch (e) {
        }
    }
  }
};
</script>

<style lang="less">
.dice-wrap {
  padding: 30px;
  background-color: #1a1a1a;
  color: #fff;
  // background: url(https://dice.eosbet.io/background.7418bc01c2269ba7e456.png) top left/contain;
}
.dice-panel {
  width: 800px;
  margin: 0 auto;
  // background-color: #fff;
}
.dice-attributes {
  display: flex;
  // text-align: center;
  & > div {
    flex: 1;
  }
}
.dice-atr-title {
  padding: 10px 0;
  font-size: 14px;
  color: #9a9a9a;
}
.dice-multiple {
  width: 100%;
  height: 100%;
  display: flex;
  & > span {
    height: 40px;
    flex: 1;
    margin: 0 2px;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      background-color: #353535;
    }
  }
}
// 输入金额
.dice-input {
  width: 100%;
  .el-input {
    background-color: #353535;
    font-size: 24px;
    font-weight: 700;
  }
  .el-input__inner {
    background-color: #353535;
    border: 1px solid #414141;
    color: #fff;
  }
}
// 奖金
.dice-bonus {
  font-size: 24px;
  line-height: 40px;
  font-weight: 700;
  background-color: #353535;
  text-align: center;
  border: 1px solid #414141;
  color: #fff;
  border-radius: 2px;
}
// 计数
.dice-count {
  font-size: 34px;
}
// 滑动条
.dice-slide {
  padding-top: 30px;
}
.dice-user {
  padding: 10px 0;
  text-align: center;
}
</style>
