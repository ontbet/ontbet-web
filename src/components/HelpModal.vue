<template>
    <el-dialog :title="$t('modal.help')" width="600px" :visible.sync="show">
        <div>帮助</div>
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
