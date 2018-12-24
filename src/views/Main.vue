<template>
  <div class="main">
    <!-- 帮助 -->
    <help-modal ref="helpModal"></help-modal>
    <!-- 股息 -->
    <dividend-modal ref="dividendModal"></dividend-modal>
    <!-- 邀请好友 -->
    <invite-modal ref="inviteModal"></invite-modal>

    <div id="nav">
      <nav-header @open-modal="openModal"></nav-header>
    </div>
    <div class="main-container">
      <dice-panel></dice-panel>
      <betting-panel></betting-panel>
    </div>
  </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import DicePanel from "@/components/DicePanel";
import BettingPanel from "@/components/BettingPanel";
import HelpModal from "@/components/HelpModal";
import DividendModal from "@/components/DividendModal";
import InviteModal from "@/components/InviteModal";
import { mapMutations } from "vuex";
import { client } from "ontology-dapi";
import { INVITER_SCRIPTHASH } from "@/store/types";
let Ont = require("ontology-ts-sdk");

export default {
  components: {
    NavHeader,
    DicePanel,
    BettingPanel,
    HelpModal,
    DividendModal,
    InviteModal
  },
  mounted() {
    this.processInviterLink(this.$route.query.ref);
  },
  methods: {
    ...mapMutations({
      setInviterScriptHash: INVITER_SCRIPTHASH
    }),
    openModal(type) {
      this.$refs[`${type}Modal`].open();
    },
    processInviterLink(ref) {
      if (ref) {
        try{
          client.registerClient({});
          const address = new Ont.Crypto.Address(ref);
          const hash = address.serialize();
          this.setInviterScriptHash(hash);
        }catch(err) {
          console.log(err)
        }
      }
    }
  }
};
</script>

<style lang="less">
.main {
  margin-bottom: 100px;
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

