<template>
    <el-dialog :title="$t('modal.help')" width="600px" :visible.sync="show">
        <div>
            <p>1、准备好你的Ontology账号，如果还未有Ontology帐号，可根据教程创建</p>
            <p>2、您需要通过Cyano wallet 在网页上操作帐号，如果还未有安装Cyano wallet，请安装Cyano wallet</p>
            <p>3、按下登入按钮，通过Cyano wallet 进行登入</p>
            <p>4、可使用ONT、ONG、TNT进行投注</p>
            <p>5、设置需要投注量</p>
            <p>6、调整滑条投注骰子号码上限，改变胜出机率</p>
            <p>7、按下"掷骰子"按钮进行投注，如果 摇到骰子号码小于投注骰子号码上限，立即中奖</p>
            <p>由于游戏都在Ontology 的智能合约上执，因此游戏保证公平，并不能作弊。我们透过独有的加密技术，保证赛果不会被更改，请您放心下注。</p>
            <div class="help-certification-wrap"><el-button type="primary">Verify</el-button></div>
        </div>
        <div slot="footer"><el-button type="primary">Verify</el-button></div>
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
</style>
