<template>
    <div>
        <el-table :data="tableData" stripe style="width: 100%" border>
            <el-table-column prop="date" label="时间" width="180" align="center"></el-table-column>
            <el-table-column prop="name" label="投注者" width="180" align="center"></el-table-column>
            <el-table-column prop="address" label="小于该号码获胜" align="center"></el-table-column>
            <el-table-column prop="address" label="投注" align="center"></el-table-column>
            <el-table-column prop="address" label="开奖号码" align="center"></el-table-column>
            <el-table-column prop="address" label="奖金" align="center"></el-table-column>
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
          date: '2016-05-04',
          name: '王小虎',
          address: '23'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '98'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '88'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '67'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '23'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '98'
        }
      ]
    };
  }
}
</script>

<style>

</style>
