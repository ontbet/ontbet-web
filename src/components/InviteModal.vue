<template>
  <el-dialog :title="$t('modal.invite')" width="600px" :visible.sync="show">
    <el-row :gutter="15">
      <el-col :span="20">
        <el-input v-model="link" placeholder="邀请地址"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="width: 100%">{{$t('copy')}}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters(['domain', 'address']),
    link() {
      return `${this.domain}?ref=${this.address}`;
    }
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = close;
    }
  }
};
</script>

<style>
</style>
