<template>
    <el-dialog :title="$t('modal.dividend')" width="600px" :visible.sync="show">
        <div>股息</div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            show: false
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
