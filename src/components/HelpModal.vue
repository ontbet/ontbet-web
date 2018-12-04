<template>
    <el-dialog title="帮助" width="600px" :visible.sync="show">
        <div>帮助</div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            show: true
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
