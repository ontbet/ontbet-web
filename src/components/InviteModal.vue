<template>
  <el-dialog :title="$t('modal.invite')" width="600px" :visible.sync="show">
    <el-row :gutter="15">
      <el-col :span="20">
        <el-input v-model="link" placeholder="邀请地址" ref="link"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="width: 100%"
          v-clipboard:copy="link"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError">{{$t('copy')}}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { showMsg } from '@/utils/util'

export default {
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters(['address']),
    link() {
      return `http://${window.location.host}?ref=${this.address}`;
    }
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = close;
    },
    onCopySuccess(e) {
      showMsg(this.$t('message.copySuccess'))
    },
    onCopyError() {
      showMsg(this.$t('message.copyError'))
    }
  }
};
</script>

<style>
</style>
