<template>
  <el-dialog :title="$t('modal.recharge')" width="400px" :visible.sync="show">
    <div class="result-number">{{value}} (ONT) = {{result}} (TONT)</div>
    <el-input-number
      v-model="value"
      :step="1"
      :controls="false"
      :precision="0"
      :min="0"
      :max="10000"
      :close-on-click-modal="false"
      style="width: 100%"
    ></el-input-number>
    <span slot="footer">
      <el-button @click="close">{{$t('btn.cancel')}}</el-button>
      <el-button
        type="primary"
        @click="submit"
        :loading="loading"
      >{{loading ? '充值中' : $t('btn.ok')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { toFixed, multiple, showMsg } from "@/utils/util";
import { client } from "ontology-dapi";
import userService from '@/services/user'

let Ont = require("ontology-ts-sdk");
export default {
  data() {
    return {
      show: false,
      loading: false,
      value: 0,
      userScriptHash: "",
      userAddress: ""
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
    ...mapActions(['getBalance']),
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
        return this.showMsg(this.$t("message.rechargeNull"));
      }
      this.loading = true;
      this.recharge(this.scriptHash, this.scriptHash, this.value);
    },

    recharge(from, to, amount) {
      //付款账户，充值给谁，充值的个数，需要修改，不能跑完成吧，需要容错处理和健壮性
      //这里可以来一些检测，如账户的检测，是否都为20长度的字符串
      const scriptHash = this.contractHash
      const gasPrice = 500;
      const gasLimit = 200000;
      const operation = "Recharge"; //调用合约的方法名
      const args = [
        { type: "ByteArray", value: from },
        { type: "ByteArray", value: to },
        { type: "Integer", value: amount }
      ];
      client.api.smartContract
        .invoke({scriptHash, operation, args, gasPrice, gasLimit})
        .then(result => {
          // setTimeout(() => {
          // console.log('交易发送成功');
          // console.log(2);
          // console.log(result);
          // console.log(result["transaction"]);
          let txid = result["transaction"]; //这里需要判断一下，是否成功什么的。
          client.api.network.getSmartCodeEvent({ value: txid.toString()}).then(
            res => {
              console.log('交易完成');
              console.log(res); //得到交易的状态，json里面有个notify
              let notify = res.Notify;

              for(let i = 0;i < notify.length;i++){
            if(notify[i].ContractAddress == this.contractHash){
              let states = notify[i].States

              if(states[0] == '73756363657373'){
                showMsg(this.$t('message.rechargeSuccess'), 'success')
                return
              }
              if(states[0] == '73756363657373'){

                 msg = $t('message.errorCode' + parseInt(states[1],16))
                 showMsg(msg)
                 return
              }

              }

            }
              const msg = '充值失败';
              showMsg(msg)
            },
            err => {
              console.log(err); //这里可能是网络原因,或者交易还没被执行，还没有结果会到这里。
            }
          ).fin;
        // }, 1500);
      },
      err => {
        console.log(err); //发送交易执行失败走这里，或者用户取消交易导致的
        //用户在主动取消的，点击
        if (err == "CANCELED") {
          showMsg(this.$t('message.rechargeCanel'))
        } else {
          showMsg(this.$t('message.rechargeError'))
        }
      }).finally(() => this.close());
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

