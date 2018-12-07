<template>
    <el-dialog :title="$t('modal.help')" width="600px" :visible.sync="show">
        <div>
            <p>1、准备好你的EOS 帐号，如果还未有EOS帐号，可根据教程创建</p>
            <p>2、您需要通过Scatter 在网页上操作帐号，如果还未有安装Scatter，请安装Scatter</p>
            <p>3、按下登入按钮，通过Scatter 进行登入</p>
            <p>4、可使用EOS进行投注</p>
            <p>5、设置需要投注量</p>
            <p>6、调整滑条投注骰子号码上限，改变胜出机率</p>
            <p>7、按下"掷骰子"按钮进行投注，如果 摇到骰子号码小于投注骰子号码上限，立即中奖</p>
            <p>由于游戏都在EOS 的智能合约上执，因此游戏保证公平，并不能作弊。我们透过独有的加密技术，保证赛果不会被更改，请您放心下注。</p>
            <div class="help-certification-wrap"><el-button type="primary">Verify</el-button></div>
        </div>
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

<style lang="less">
.el-dialog__body {
    padding: 10px 20px;
    background-color: #f5f6f7;
}
.help-certification-wrap {
    padding: 10px 0;
    text-align: right;
}
</style>
