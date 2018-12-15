<template>
  <div class="dice-wrap">
    <!-- 提现 -->
    <withdraw-modal ref="withdrawModal"></withdraw-modal>
    <!-- 充值 -->
    <recharge-modal ref="rechargeModal"></recharge-modal>
    <!-- 游戏结果modal -->
    <el-dialog :title="$t('modal.gameResult')" :visible.sync="resultModal.show" width="30%">
      <span>这是返回的结果信息</span>
      <span slot="footer">
        <el-button type="primary" @click="closeResultModal">{{$t('btn.ok')}}</el-button>
      </span>
    </el-dialog>
    
    <div class="dice-panel">
      <div class="dice-types">
        <el-button
          v-for="(item, key) in currencys"
          :key="key"
          :type="item.name === bcType ? 'primary' : ''"
          size="small"
          @click="changeBcType(key)"
        >{{item.name}}</el-button>
      </div>
      <div class="dice-amount" v-if="currencys">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="dice-atr-title">{{$t('game.betting')}}({{bt.name}})</div>
            <div class>
              <el-row>
                <el-col :span="12">
                  <el-input-number
                    v-model="betting.current"
                    :step="1"
                    :controls="false"
                    :precision="2"
                    :min="bt.min"
                    :max="bt.max"
                    class="dice-input"
                  ></el-input-number>
                </el-col>
                <el-col :span="9">
                  <div class="dice-multiple">
                    <span
                      v-for="item in multiples"
                      :key="item.label"
                      @click="multipleHandler(item.value)"
                    >{{item.label}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="dice-atr-title">{{$t('game.obtain')}}({{bt.name}})</div>
            <div class="dice-bonus">{{bonus}}</div>
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
              <span class="dice-count">{{odds}}X</span>
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
      <div class="dice-slide-wrap">
        <span>1</span>
        <div class="dice-slide">
          <el-slider v-model="target" :max="100" :min="1" height="20" @change="changeTarget"></el-slider>
        </div>
        <span>100</span>
      </div>
      <div class="dice-user">
        <template v-if="loginStatus">
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
            style="flex: 1;"
            class="balance-btn"
          >
            <div>
              <el-row :gutter="15">
                <el-col :span="12">
                  <el-button
                    type="success"
                    style="width: 100%"
                    @click="openModal('recharge')"
                  >{{$t('btn.recharge')}}</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button
                    type="primary"
                    style="width: 100%"
                    @click="openModal('withdraw')"
                  >{{$t('btn.withdraw')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <span
              slot="reference"
            >{{$t('nav.balance')}}: {{balance[bcType]}} {{currencys[bcType].name}}</span>
          </el-popover>
          <el-button
            :loading="game.status === 1"
            type="primary"
            @click="submit"
            style="width: 100px"
          >
            <template v-if="game.status === 2">{{game.randomNumber}}</template>
            <template v-else>{{$t("btn.submit")}}</template>
          </el-button>
          <span style="flex: 1"> 100 TNT</span>
        </template>
        <el-button v-else type="primary" @click="test">{{$t("btn.login")}}</el-button>
      </div>
      <div class="dice-remark">
        <span>{{$t('message.dice')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { client } from "ontology-dapi";
import { toFixed, multiple } from "@/utils/util";
import dicePanelService from "@/services/dice-panel";
import WithdrawModal from "@/components/WithdrawModal";
import RechargeModal from "@/components/RechargeModal";
let Ont = require("ontology-ts-sdk");

let gameTimer = null;

export default {
  components: {
    WithdrawModal,
    RechargeModal
  },
  data() {
    return {
      multiples: dicePanelService.multiples,
      betting: {
        current: 0,
        max: 10000
      },
      target: 50,
      resultModal: {
        show: false
      },
      game: {
        // 游戏状态 0 关闭， 1 准备， 2 进行中
        status: 0,
        randomNumber: 0
      },
      Address: "",
      scriptHash: ""
    };
  },
  computed: {
    ...mapGetters(["user", "balance", "loginStatus", "currencys", "bcType"]),
    // 倍数
    odds() {
      return toFixed((100 - 2) / this.target);
    },
    // 奖金
    bonus() {
      return toFixed(multiple([this.odds, this.betting.current || 0]));
    },
    bt() {
      return this.currencys ? this.currencys[this.bcType] : {};
    }
  },
  methods: {
    // 修改币种
    changeBcType(type) {
      dicePanelService.changeBcType(type);
    },
    // 倍数点击
    multipleHandler(value) {
      this.betting.current = dicePanelService.computeBetting(
        this.betting.current,
        value,
        this.betting.max
      );
    },
    // 监听目标点数
    changeTarget(value) {
      if(value > 96) this.target = 96;
      if(value < 2) this.target = 2;
    },
    // 投注
    submit() {
      if (this.game.status === 0) {
        if (!this.betting.current) {
          return this.$message({
            message: this.$t("game.beetinIsNull"),
            type: "warning"
          });
        }
        // 接下来是走投注的流程
        // 游戏准备中
        this.game.status = 1;
        // 游戏开始
        setTimeout(() => {
          this.game.status = 2;
          this.setGameRandomNumber();
        }, 2000);
        // 游戏进行中
        setTimeout(() => {
          this.game.status = 0;
          this.openResultModal();
        }, 4000);
      }
    },
    openResultModal() {
      this.resultModal.show = true;
    },
    closeResultModal() {
      this.resultModal.show = false;
    },
    setGameRandomNumber() {
      clearTimeout(gameTimer);
      gameTimer = setTimeout(() => {
        if (this.game.status === 2) {
          this.game.randomNumber = Math.floor(Math.random() * 96 + 4);
          this.setGameRandomNumber();
        }
      }, 30);
    },
    openModal(type) {
      this.$refs[`${type}Modal`].open();
    },

    //关于一些字符串的转换啊，hex转换的方法，都可以去https://github.com/ontio-community/Smartx-ide-components/blob/master/src/components/scIDE/Tool.vue ，这里找参考调用。
    async test() {
      let userScriptHash = "64f75b59554a2008bcc1a87a7ae09249abc74a91"; //AQyjYLQNRXtjr6cPoru1vpCTwehg6EQPCs的scripthash
      const txlog = await client.api.network.getSmartCodeEvent({
        value:
          "e476c3212462777cd1c2a07f58151c0f942cd067866c92daf7accc699ad3e590"
      });
      console.log(txlog);
      //this.recharge(userScriptHash,userScriptHash,1)
    },

    async banlanceTONT(userScriptHash) {
      //判断一下长度是否是20
      const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3";
      const operation = "banlanceTONT";
      const args = [{ type: "Bytearray", value: userScriptHash }];
      const result = await client.api.smartContract.invokeRead({
        scriptHash,
        operation,
        args
      }); //得到banlanceTONT返回的调用结果，结果返回的是一个hexstring的int，需要转换一下。
      return result;
    },
    //这个是下注竞猜方法，参数1：当前用户的hash，参数2：下注用的那个币种类型（枚举类型）,参数3：下注数字，参数4:下注的多少，参数5:邀请人的hash（来自url，如果没有可以内置一个）
    async Guess(
      fromUserScriptHash,
      tokentype,
      number,
      amount,
      inviterScriptHash
    ) {
      ONG = 1;
      ONT = 2;
      TNT = 3;
      TONT = 4;

      MAX_NUMBER = 95;
      MIN_NUMBER = 4;

      TNT_DEGREE = 10 ^ 8; //币种的精度，最好这里变成biginter来计算，免得JS不支持那么大的数计算,这里可以弄成全局变量
      ONG_DEGREE = 10 ^ 8;
      TONT_DEGREE = 10 ^ 8;

      if (len(fromUserScriptHash) != 20 || len(inviterScriptHash) != 20) {
        //scripthash的长度为20，
        return false;
      }
      //把小数转换为整数，因为ONT区块链不支持小数，只能通过放大的方式来，实现小数
      if (tokentype == ONT) {
        //ONT不能投注，必须得充值转换为TONT，才能下注
        return false;
      } else if (tokentype == TNT) {
        amount = amount * TNT_DEGREE;
      } else if (tokentype == TONT) {
        amount = amount * TONT_DEGREE;
      } else if (tokentype == ONG) {
        amount = amount * ONG_DEGREE;
      }

      if (number < MIN_NUMBER || number > MAX_NUMBER) {
        //核对一下，下注的范围，还要考虑一下，这里也不能是小数

        return;
      }
      const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3"; //合约的地址
      const operation = "Guess"; //调用合约的方法名
      const args = [
        { type: "Bytearray", value: fromUserScriptHash },
        { type: "Integer", value: tokentype },
        { type: "Integer", value: number },
        { type: "Integer", value: amount },
        { type: "Bytearray", value: inviterScriptHash }
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
      console.log(result); //大概1秒后再接下去请求。
      const txlog = await client.api.network.getSmartCodeEvent(
        result["transaction"]
      ); //利用该交易的hash去，去查询该交易的状态，json里面有个notify
      console.log(txlog); //notify里面都有的，都是对应字符串的hexstring的模式，需要把hexstaring转换为str。具体你们可以调试一下，到这个位置，看看内容。
      //如果竞猜成功，notify里面的state数组里面有一个内容是：['guess', 下注币种类型,投注人scripthash, 下注多少, 总的第几局, 下注数字, 系统出的数字]
      //如果有其他错误是有：['error',错误消息提示]（例如['error',"BET number error"]），后面我们可以设定一下错误码什么的
      //这里需要取里面的值，出来判断一下。
    },
    async recharge(fromUserScriptHash, toUserScript, amount) {
      //付款账户，充值给谁，充值的个数，需要修改，不能跑完成吧，需要容错处理和健壮性
      //这里可以来一些检测，如账户的检测，是否都为20长度的字符串
      const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3"; //合约的地址
      const operation = "Recharge"; //调用合约的方法名
      const args = [
        { type: "Bytearray", value: fromUserScriptHash },
        { type: "Bytearray", value: toUserScript },
        { type: "Integer", value: amount }
      ];
      const gasPrice = 500;
      const gasLimit = 200000;
      const result = await client.api.smartContract.invoke({
        scriptHash,
        operation,
        args,
        gasPrice,
        gasLimit
      });
      console.log(result); //大概1秒后再接下去请求。
      const txlog = await client.api.network.getSmartCodeEvent(
        result["transaction"]
      ); //得到交易的状态，json里面有个notify
      console.log(txlog);
    },

    //把账户里的TONT提取转换为ONT，这里也必须是整数
    async Withdraw(fromUserScriptHash, amount) {
      const scriptHash = "95feeda3a7f41e43204353de64aa7b016e4ffaa3"; //合约的地址
      const operation = "Withdraw"; //调用合约的方法名
      const args = [
        { type: "Bytearray", value: fromUserScriptHash },
        { type: "Integer", value: amount }
      ];
      const gasPrice = 500;
      const gasLimit = 200000;
      const result = await client.api.smartContract.invoke({
        scriptHash,
        operation,
        args,
        gasPrice,
        gasLimit
      });
      console.log(result); //大概1秒后再接下去请求。
      const txlog = await client.api.network.getSmartCodeEvent(
        result["transaction"]
      ); //得到交易的状态，json里面有个notify
      //充值成功，会有个数组["withdraw",提取数量]，目前合约这里有小bug，没有修改
    },
    async LoginAndGetUserinfo() {
      //获取用户信息
      let Crypto = Ont.Crypto;
      let util = Ont.utils;

      client.registerClient({});
      const account = await client.api.asset.getAccount(); //得到当前插件钱包的用户地址。
      console.log(account);
      let Address = new Crypto.Address(account);
      console.log(Address);
      let newScriptHash = Address.serialize(); //得到当前地址的scripthash，用于合约的调用
      console.log(newScriptHash);
      this.Address = Address;
      this.scriptHash = newScriptHash;

      let bla = banlanceTONT(newScriptHash); //获取当前钱包用户的TONT的多少。这里调用不到，肯定是我的其他有问题
      console.log(bla);
    }
  }
};
</script>

<style lang="less">
.dice-wrap {
  padding: 30px;
  background-color: #1a1a1a;
  color: #fff;
}
.dice-panel {
  width: 800px;
  margin: 0 auto;
  // background-color: #fff;
}
.dice-types {
  text-align: center;
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
    box-sizing: border-box;
    height: 40px;
    flex: 1;
    margin-left: 2px;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    border: 1px solid #444;
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
.dice-slide-wrap {
  padding-top: 30px;
  display: flex;
  align-items: center;
  & > span {
    padding: 10px;
  }
}
.dice-slide {
  width: 0;
  flex: 1;
}
.dice-user {
  padding: 10px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.balance-btn {
  cursor: pointer;
}
.dice-remark {
  padding-top: 30px;
  text-align: center;
  span {
    display: inline-block;
    padding: 10px 20px;
    background-color: #111;
    font-size: 14px;
    border-radius: 20px;
  }
}
.el-slider__runway {
  height: 12px;
  border-radius: 6px;
  background-color: #353535;
}
.el-slider__bar {
  height: 12px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
.el-slider__button-wrapper {
  top: -12px;
}
</style>
