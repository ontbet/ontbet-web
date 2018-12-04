<template>
  <div class="main">
    <!-- 帮助 -->
    <help-modal ref="helpModal"></help-modal>
    <!-- 股息 -->
    <dividend-modal ref="dividendModal"></dividend-modal>
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

export default {
  components: {
    NavHeader,
    DicePanel,
    BettingPanel,
    HelpModal,
    DividendModal
  },
  methods: {
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

