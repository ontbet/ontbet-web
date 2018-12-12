<template>
  <el-dialog :title="$t('modal.recharge')" width="400px" :visible.sync="show">
    <div class="result-number">{{value}} (ONT) = {{result}} (TONT)</div>
    <el-input-number
      v-model="value"
      :step="1"
      :controls="false"
      :precision="2"
      :min="0"
      :max="10000"
      style="width: 100%"
    ></el-input-number>
    <span slot="footer">
      <el-button @click="close">{{$t('btn.cancel')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('btn.ok')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { toFixed, multiple } from "@/utils/util";
import { client } from "ontology-dapi";

let Ont = require("ontology-ts-sdk");
export default {
  data() {
    return {
      show: false,
      value: 0,
      userScriptHash: "",
      userAddress: ""
    };
  },
  methods: {
    open() {
      this.value = 0;
      this.show = true;
    },
    close() {
      this.show = close;
    },
    submit() {
      this.GetUserInfo().then(() => {
        this.recharge(
          this.userScriptHash,
          this.userScriptHash,
          this.value
        );
      },
      ()=>{
          console.log("请登录或安装插件钱包")
      });

      this.close();
    },
    async GetUserInfo() {
      let Crypto = Ont.Crypto;
      let util = Ont.utils;
      client.registerClient({});
      const account = await client.api.asset.getAccount(); //得到当前插件钱包的用户地址。
      console.log(account);
      let Address = new Crypto.Address(account);
      console.log(Address);
      this.userAddress = Address.toString();
      this.userScriptHash = Address.serialize();
    },
    recharge(fromUserScriptHash, toUserScript, amount) {
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
      client.api.smartContract
        .invoke({ scriptHash, operation, args, gasPrice, gasLimit })
        .then(result => {
          setTimeout(() => {
            console.log(2);
            console.log(result);
            console.log(result["transaction"]);
            let txid = result["transaction"]; //这里需要判断一下，是否成功什么的。
            client.api.network.getSmartCodeEvent({
              value: txid.toString()
            }).then(
                (err)=>{
                    console.log(err);//得到交易的状态，json里面有个notify
                    //取txlogjson文件中的最终信息，来看，结果，然后给界面上相应响应，主要看NOtify中对应的自己合约的东西。
                    //对应自己的合约hash里面没有error的信息，就代表成功，
                },
                (err)=>{
                    console.log(err);//这里可能是网络原因,或者交易还没被执行，还没有结果会到这里。
                }
            ); 
            
          }, 1500);
        },
        (err)=>{
            console.log(err)//发送交易执行失败走这里，或者用户取消交易导致的
            if(err == "CANCELED"){
                //用户在主动取消的，点击
            }
        }
        );

    }
  },
  computed: {
    ...mapGetters(["user", "balance", "loginStatus", "btType", "currencys"]),
    result() {
      return toFixed(multiple([this.value || 0, 0.5]));
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

