<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%" border>
      <el-table-column prop="date" :label="$t('table.time')" width="180" align="center"></el-table-column>
      <el-table-column prop="name" :label="$t('table.betsPeople')" width="180" align="center"></el-table-column>
      <el-table-column prop="address" :label="$t('table.victoryCondition')" align="center"></el-table-column>
      <el-table-column prop="address" :label="$t('table.betting')" align="center"></el-table-column>
      <el-table-column prop="address" :label="$t('table.number')" align="center"></el-table-column>
      <el-table-column prop="address" :label="$t('table.bonus')" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '67'
        },
        {
          date: '2016-05-04' ,
          name: '王小虎' ,
          address: '23'
        },
        {
          date: '2016-05-01' ,
          name: '王小虎' ,
          address: '98'
        },
        {
          date: '2016-05-03' ,
          name: '王小虎' ,
          address: '88'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '67'
        },
        {
          date: '2016-05-04' ,
          name: '王小虎' ,
          address: '23'
        },
        {
          date: '2016-05-01' ,
          name: '王小虎' ,
          address: '98'
        },
        {
          date: '2016-05-03' ,
          name: '王小虎' ,
          address: '88'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '67'
        },
        {
          date: '2016-05-04' ,
          name: '王小虎' ,
          address: '23'
        },
        {
          date: '2016-05-01' ,
          name: '王小虎' ,
          address: '98'
        },
        {
          date: '2016-05-03' ,
          name: '王小虎' ,
          address: '88'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '67'
        },
        {
          date: '2016-05-04' ,
          name: '王小虎' ,
          address: '23'
        },
        {
          date: '2016-05-01' ,
          name: '王小虎' ,
          address: '98'
        },
        {
          date: '2016-05-03' ,
          name: '王小虎' ,
          address: '88'
        }
      ]
    };
  }
};
</script>

<style>
</style>
