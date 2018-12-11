<template>
  <div class="main">

    <!-- 帮助 -->
    <help-modal ref="helpModal"></help-modal>
    <!-- 股息 -->
    <dividend-modal ref="dividendModal"></dividend-modal>
    <!-- 提现 -->
    <withdraw-modal ref="withdrawModal"></withdraw-modal>
    <!-- 充值 -->
    <recharge-modal ref="rechargeModal"></recharge-modal>

    <div id="nav">
      <nav-header 
        @open-modal="openModal"></nav-header>
    </div>
    <div class="main-container">
      <dice-panel></dice-panel>
      <betting-panel></betting-panel>
    </div>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import DicePanel from '@/components/DicePanel'
import BettingPanel from '@/components/BettingPanel'
import HelpModal from '@/components/HelpModal'
import DividendModal from '@/components/DividendModal'
import WithdrawModal from '@/components/WithdrawModal'
import RechargeModal from '@/components/RechargeModal'
import { client } from 'ontology-dapi';


export default {
  components: {
    NavHeader,
    DicePanel,
    BettingPanel,
    HelpModal,
    DividendModal,
    WithdrawModal,
    RechargeModal
  },
  methods: {
  
    async withdraw() {
      const scriptHash = '95feeda3a7f41e43204353de64aa7b016e4ffaa3';
      const operation = 'Withdraw';
      const args = [{type: 'Bytearray', value: scriptHash}, {type: 'Integer', value: 5}];
      const gasPrice = 500;
      const gasLimit = 200000;
      const result = await client.api.smartContract.invoke({scriptHash, operation, args, gasPrice, gasLimit});
      console.log(result);
    },
    async recharge() {
      const scriptHash = '95feeda3a7f41e43204353de64aa7b016e4ffaa3';
      const operation = 'Recharge';
      const args = [{type: 'Bytearray', value: scriptHash}, {type: 'Bytearray', value: scriptHash}, {type: 'Integer', value: 5}];
      const gasPrice = 500;
      const gasLimit = 200000;
      const result = await client.api.smartContract.invoke({scriptHash, operation, args, gasPrice, gasLimit});
      console.log(result);
    },
    async banlanceTONT() {
      const scriptHash = '95feeda3a7f41e43204353de64aa7b016e4ffaa3';
      const operation = 'banlanceTONT';
      const args = [{type: 'Bytearray', value: scriptHash}, {type: 'Bytearray', value: scriptHash}, {type: 'Integer', value: 5}];
      const result = await client.api.smartContract.invokeRead({scriptHash, operation, args});
      console.log(result);
    },
    openModal(type) {
      this.$refs[`${type}Modal`].open();
    }
  }
}
</script>

<style lang="less">
  .main {
    
  }
  #nav {
    position: fixed;
    z-index: 1002;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    top: 0;
    left: 0;
    padding: 0 50px;
    background-color: #353535;
    color: #fff;
}
  .main-container {
    padding-top: 60px;
  }
</style>

