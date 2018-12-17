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
            v-if="bcType === 'TONT'"
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
          <span v-else style="flex: 1">{{$t('nav.balance')}}: {{balance[bcType]}} {{currencys[bcType].name}}</span>
          <el-button
            :loading="game.status === 1"
            type="primary"
            @click="submit"
            style="width: 100px"
          >
            <template v-if="game.status === 2">{{game.randomNumber}}</template>
            <template v-else>{{$t("btn.submit")}}</template>
          </el-button>
          <span style="flex: 1">100 TNT</span>
        </template>
        <el-button v-else type="primary" @click="login">{{$t("btn.login")}}</el-button>
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
import { toFixed, multiple, showMsg } from "@/utils/util";
import dicePanelService from "@/services/dice-panel";
import WithdrawModal from "@/components/WithdrawModal";
import RechargeModal from "@/components/RechargeModal";
import Ont from "ontology-ts-sdk";
import btCode from "@/utils/btCode";

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
      Address: ""
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "balance",
      "loginStatus",
      "contractHash",
      "currencys",
      "bcType",
      "scriptHash"
    ]),
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
      if (value > 96) this.target = 96;
      if (value < 2) this.target = 2;
    },
    // 投注
    async submit() {
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
        this.game.status = 2;
        this.setGameRandomNumber();
        this.guess(
          this.scriptHash,
          btCode[this.bcType],
          this.target,
          this.betting.current
        );
        //this.game.status = 0;
        //this.openResultModal();
      }
    },
    guess(
      fromUserScriptHash,
      tokentype,
      number,
      amount,
      inviterScriptHash = fromUserScriptHash
    ) {
      const MAX_NUMBER = 96;
      const MIN_NUMBER = 2;

      const TNT_DEGREE = 10000000000; //币种的精度，最好这里变成biginter来计算，免得JS不支持那么大的数计算,这里可以弄成全局变量
      const ONG_DEGREE = 1000000000;
      const TONT_DEGREE = 1000000000;

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
      const scriptHash = this.contractHash; //合约的地址
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
      client.api.smartContract
        .invoke({
          scriptHash,
          operation,
          args,
          gasPrice,
          gasLimit
        })
        .then(
          res => {
            console.log(res["transaction"]);
            let txid = res["transaction"];
            client.api.network
              .getSmartCodeEvent({ value: txid.toString() })
              .then(
                res2 => {
                  console.log(res2);
                  let notify = res2.Notify;
                  //console.log(notify)
                  for (let i = 0; i < notify.length; i++) {
                    if (notify[i].ContractAddress == this.contractHash) {
                      console.log(notify[i].States);
                      let states = notify[i].States;

                      if (states[0] == "6775657373") {
                        let sysnumber = parseInt(states[6], 16);
                        let mynumber = parseInt(states[5], 16);
                        console.log(sysnumber);
                        if (mynumber > sysnumber) {
                          console.log("win");
                        } else {
                          console.log("lose");
                        }
                        this.game.status = 0;
                        return;
                      }

                      if (states[0] == "6572726f72") {
                        console.log("error");
                        this.game.status = 0;
                      }
                    }
                  }

                  this.game.status = 0;
                },
                err => {
                  console.log(err);
                  this.game.status = 0;
                }
              );
          },
          err => {
            if (err == "CANCELED") {
              showMsg(this.$t("message.rechargeCanel"));
            } else {
              showMsg(this.$t("message.rechargeError")); //这里要改一下
            }
            this.game.status = 0;
          }
        ); //向区块链节点发送该交易，会返回该次交易的hash
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
    login() {
      console.log("去登录");
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
