<template>
  <div class="dice-wrap">
    <!-- 提现 -->
    <withdraw-modal ref="withdrawModal"></withdraw-modal>
    <!-- 充值 -->
    <recharge-modal ref="rechargeModal"></recharge-modal>

    <div class="dice-panel">
      <div class="dice-types">
        <el-button
          v-for="(item, key) in $config.currencys"
          :key="item.code"
          :type="item.name === bcType ? 'primary' : ''"
          size="small"
          v-if="item.enable"
          @click="changeBcType(key)"
        >{{item.name}}</el-button>
      </div>
      <div class="dice-amount" v-if="$config.currencys">
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
                {{betting.target}}
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
              <span class="dice-count">{{betting.target - 1}}%</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="dice-slide-wrap">
        <span>1</span>
        <div class="dice-slide">
          <el-slider v-model="betting.target" :max="100" :min="1" height="20" @change="changeTarget"></el-slider>
          <div class="dice-result-number" v-show="result.show">{{result.number}}</div>
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
            >{{$t('nav.balance')}}: {{balance[bcType] | toFixed}} {{$config.currencys[bcType].name}}</span>
          </el-popover>
          <span v-else style="flex: 1">{{$t('nav.balance')}}: {{balance[bcType] | toFixed}} {{$config.currencys[bcType].name}}</span>
          <el-button
            :loading="game.status === 1"
            type="primary"
            @click="submit"
            style="width: 100px"
          >
            <template v-if="game.status === 2">{{game.randomNumber}}</template>
            <template v-else>{{$t("btn.submit")}}</template>
          </el-button>
          <span style="flex: 1">{{balance['TNT'] | toFixed}} TNT</span>
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
import { mapGetters, mapActions } from "vuex";
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
        target: 50,
        max: 10000
      },
      game: {
        // 游戏状态 0 关闭， 1 准备， 2 进行中
        status: 0,
        randomNumber: 0
      },
      result: {
        show: true,
        number: 50
      }
    };
  },
  watch: {
    'game.status': function (value) {
      if(value === 0) {
        gameTimer = null;
      } else {
        this.setGameRandomNumber();
      }
    }
  },
  computed: {
    ...mapGetters([
      "balance",
      "loginStatus",
      "bcType",
      "scriptHash"
    ]),
    // 倍数
    odds() {
      return toFixed((100 - 2) / this.betting.target);
    },
    // 奖金
    bonus() {
      return toFixed(multiple([this.odds, this.betting.current || 0]));
    },
    // 当前币
    bt() {
      return this.$config.currencys ? this.$config.currencys[this.bcType] : {};
    }
  },
  methods: {
    ...mapActions(['getBalance']),
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
      if (value > this.$config.game.targetMax) this.betting.target = this.$config.game.targetMax;
      if (value < this.$config.game.targetMin) this.betting.target = this.$config.game.targetMin;
    },
    // 投注请求成功
    gameRequestSuccess(txid) {
      client.api.network.getSmartCodeEvent({ value: txid.toString() })
      .then(
        res => this.gameSuccess(res), 
        err => this.gameFailure(err))
      .catch(err => this.gameFailure(err))
    },
    // 投注操作成功
    gameSuccess(data) {
      // 结束游戏
      this.game.status = 0;
      const notify = data.Notify;
      for (let i = 0; i < notify.length; i++) {
        if (notify[i].ContractAddress === this.$config.contract.hash) {
          const states = notify[i].States;
          return this.gameEndAction(states[0], parseInt(states[5], 16), parseInt(states[6], 16));
        }
      }
      return this.gameFailure();
    },
    // 投注操作失败
    gameFailure(type) {
      // 结束游戏
      this.game.status = 0;
      // 用户取消操作
      if(type === 'CANCELED') {
        showMsg(this.$t("message.gameCanel"));
      }
      // 其他错误 
      else {
        showMsg(this.$t("message.gameError"));
      }
    },
    // 投注操作结束
    gameEndAction(state, myNumber, sysNumber) {
      // 投注成功
      if(state === this.$config.game.successCode) {
        this.result.number = sysNumber;
        this.result.show = true;
        myNumber > sysNumber ? this.gameWin(myNumber, sysNumber) : this.gameLose(myNumber, sysNumber);
      } 
      // 投注失败
      else if (state === this.$config.game.errorCode) {
        showMsg(state);
      }
    },
    // 投注 - 赢
    gameWin(myNumber, sysNumber) {
      if(this.$i18n.locale === 'en') {
        showMsg(`恭喜你，投注 ${myNumber} ${this.bcType},掷出 ${sysNumber}，获得奖励 ${this.betting.current * this.odds} ${this.bcType}`, 'success');
      } else {
        showMsg(`恭喜你，投注 ${myNumber} ${this.bcType},掷出 ${sysNumber}，获得奖励 ${this.betting.current * this.odds} ${this.bcType}`, 'success');
      }
    },
    // 投注 - 输
    gameLose(myNumber, sysNumber) {
      if(this.$i18n.locale === 'en') {
        showMsg(`投注 ${myNumber} ${this.bcType},掷出 ${sysNumber}，未能获得奖励`);
      } else {
        showMsg(`投注 ${myNumber} ${this.bcType},掷出 ${sysNumber}，未能获得奖励`, '');
      }
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
        // 游戏准备
        this.game.status = 1;
        // 游戏开始
        this.game.status = 2;
        // 调用投注方法
        this.guess(
          this.scriptHash,
          this.$config.currencys[this.bcType].code,
          this.betting.target,
          this.betting.current
        );
      }
    },
    guess(
      fromUserScriptHash,
      tokentype,
      number,
      amount
    ) {

      //把小数转换为整数，因为ONT区块链不支持小数，只能通过放大的方式来，实现小数
      if(tokentype === this.$config.currencys['ONT'].code) {
        showMsg('ONT不能投注，必须得充值转换为TONT，才能下注');
        return this.game.status = 0;
      }

      const _amount = amount * this.$config.degree[this.bcType];

      //核对一下，下注的范围，还要考虑一下，这里也不能是小数
      if (number < this.$config.game.targetMin || number > this.$config.game.targetMax) {
        showMsg(this.$t('message.gameCurrentError'));
        return this.game.status = 0;
      }

      const contract = this.$config.contract;
      const args = [
        { type: "ByteArray", value: fromUserScriptHash },
        { type: "Integer", value: tokentype },
        { type: "Integer", value: number },
        { type: "Integer", value: _amount },
        { type: "ByteArray", value: fromUserScriptHash }
      ];

      const options = {
        scriptHash: contract.hash,
        operation: contract.operation,
        args, 
        gasPrice: contract.gasPrice,
        gasLimit: contract.gasLimit
      }

      client.api.smartContract
        .invoke(options)
        .then(
          res => this.gameRequestSuccess(res["transaction"]),
          err => this.gameFailure(err))
        .catch(err => this.gameFailure(err));
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
  position: relative;
  width: 0;
  flex: 1;
}
.dice-result-number {
  position: absolute;
  top: 0;
  left: 0;
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
