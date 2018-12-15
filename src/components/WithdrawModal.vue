<template>
  <el-dialog
    :title="$t('modal.withdraw')"
    width="400px"
    :visible.sync="show"
    :close-on-click-modal="false"
  >
    <div class="result-number">{{value}} (TONT) = {{result}} (ONT)</div>
    <el-input-number
      v-model="value"
      :step="1"
      :controls="false"
      :precision="0"
      :min="0"
      :max="10000"
      style="width: 100%"
    ></el-input-number>
    <span slot="footer">
      <el-button @click="close">{{$t('btn.cancel')}}</el-button>
      <el-button
        type="primary"
        @click="submit"
        :loading="loading"
      >{{loading ? '提现中' : $t('btn.ok')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { toFixed, multiple, showMsg } from "@/utils/util";
import { client } from "ontology-dapi";
import userService from "@/services/user";

let Ont = require("ontology-ts-sdk");

export default {
  data() {
    return {
      show: false,
      loading: false,
      value: 0,
      form: {
        value: 0
      }
    };
  },
  computed: {
    ...mapGetters([
      "account",
      "address",
      "scriptHash",
      "contractHash",
      "balance",
      "loginStatus",
      "bcType",
      "currencys"
    ]),
    result() {
      return (this.value || 0) * 1;
    }
  },
  methods: {
    open() {
      this.value = 0;
      this.show = true;
    },
    close() {
      this.show = false;
      this.loading = false;
    },
    submit() {
      if (!this.value) {
        return showMsg(this.$t("message.withdrawNull"));
      }
      this.loading = true;
      let TONT_DRGREE = 10 ^ 8;
      userService.getAccount().then(res => {
        this.withdraw(this.scriptHash, this.value * 100000000);
      }).catch(err => {
        console.log('未获取钱包信息');
      })
    },

    withdraw(formUser, amount) {
      const scriptHash = this.contractHash; //合约的地址
      const operation = "Withdraw"; //调用合约的方法名
      const args = [
        { type: "Bytearray", value: formUser },
        { type: "Integer", value: amount }
      ];
      const gasPrice = 500;
      const gasLimit = 200000;
      client.api.smartContract
        .invoke({scriptHash, operation, args, gasPrice, gasLimit})
        .then(
          result => {
            setTimeout(() => {
              console.log(2);
              console.log(result);
              console.log(result["transaction"]);
              let txid = result["transaction"]; //这里需要判断一下，是否成功什么的。
              client.api.network
                .getSmartCodeEvent({
                  value: txid.toString()
                })
                .then(
                  err => {
                    console.log(err); //得到交易的状态，json里面有个notify
                    //取txlogjson文件中的最终信息，来看，结果，然后给界面上相应响应，主要看NOtify中对应的自己合约的东西。
                    //对应自己的合约hash里面没有error的信息，就代表成功，
                  },
                  err => {
                    console.log(err); //这里可能是网络原因或者交易还没被执行，还没有结果会到这里。
                  }
                );
            }, 1000);
          },
          err => {
            console.log(err);
            if (err == "CANCELED") {
              //用户在主动取消的，点击了cancel按钮的情况
            }
          }
        );
    }
  }
};
</script>

<style lang="less">
.result-number {
  padding-bottom: 20px;
  font-size: 20px;
  text-align: center;
}
</style>
