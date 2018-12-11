<template>
    <el-dialog :title="$t('modal.recharge')" width="400px" :visible.sync="show">
        <div class="result-number">{{value}} (ONT) = {{result}} (TONT)</div>
        <el-input-number 
            v-model="value"
            :step="1"
            :controls="false"
            :precision="2"
            :min="0"
            :max="10000"
            style="width: 100%">
        </el-input-number>
        <span slot="footer">
            <el-button @click="close">{{$t('btn.cancel')}}</el-button>
            <el-button type="primary" @click="submit">{{$t('btn.ok')}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { toFixed, multiple} from '@/utils/util'

export default {
    data() {
        return {
            show: false,
            value: 0
        }
    },
    methods: {
        open() {
            this.value = 0;
            this.show = true;
        },
        close() {
            this.show = close;
        },
        submit() {
            this.close();
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'balance',
            'loginStatus',
            'btType',
            'currencys'
        ]),
        result() {
            return toFixed(multiple([this.value || 0, 0.5]));
        }
    }
}
</script>

<style lang="less">
.result-number {
    padding-bottom: 20px;
    font-size: 20px;
    text-align: center;
}
</style>

