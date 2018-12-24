<template>
    <div>
        <el-table :data="data" stripe style="width: 100%" border :row-class-name="tableRowClassName">
            <el-table-column prop="gameid" :label="$t('table.game')" width="180" align="center"></el-table-column>
            <el-table-column prop="address" :label="$t('table.betsPeople')" align="center"></el-table-column>
            <el-table-column prop="usernumber" :label="$t('table.victoryCondition')" align="center" :width="150"></el-table-column>
            <el-table-column prop="sysnumber" :label="$t('table.number')" align="center" :width="150"></el-table-column>
            <el-table-column prop="amount" :label="$t('table.betting')" align="center" :width="150"></el-table-column>
            <el-table-column prop="bonus" :label="$t('table.bonus')" align="center" :width="150"></el-table-column>
            <el-table-column prop="tokentype" :label="$t('table.type')" align="center" :width="100"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toFixed } from '@/utils/util'
import diceApi from '@/api/dice'
import diceLogService from '@/services/dice-log'

export default {
 data() {
    return {
      data: []
    };
  },
  computed: {
    ...mapGetters(['address'])
  },
  mounted() {
    this.getLogs()
  },
  methods: {
    getLogs () {
      diceApi.getMyDiceLogList(this.address).then(res => {
        this.data = diceLogService.processData(this, JSON.parse(res.data.result));
      })
    },
    tableRowClassName({row, rowIndex}) {
      return row.usernumber > row.sysnumber ? '' : 'dice-lose';
    }
  }
}
</script>

<style>

</style>
