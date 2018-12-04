<template>
    <div class="dice-wrap">
        <div class="dice-panel">
            <div class="dice-amount">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <div class="dice-atr-title">{{$t('game.betting')}}(EOS)</div>
                        <div class="">
                            <el-row>
                                <el-col :span="12">
                                    <el-input-number v-model="bettingNumber" :step="1" :controls="false" class="dice-input"></el-input-number>
                                </el-col>
                                <el-col :span="9">
                                    <div class="dice-multiple">
                                        <span>1/2</span>
                                        <span>2X</span>
                                        <span>MAX</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="dice-atr-title">{{$t('game.obtain')}}(EOS)</div>
                        <div class="dice-bonus">212.00</div>
                    </el-col>
                </el-row>
            </div>
            <div class="dice-attributes">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div>
                            <div class="dice-atr-title">{{$t('game.victoryCondition')}}</div>
                            <span class="dice-count">{{target}}<i class="el-icon-caret-bottom" style="color:red"></i></span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <div class="dice-atr-title">{{$t('game.odds')}}</div>
                            <span class="dice-count">1.63X</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <div class="dice-atr-title">{{$t('game.probability')}}</div>
                            <span class="dice-count">{{target - 1}}%</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="dice-slide">
                <el-slider v-model="target" :max="95" :min="4" height="20"></el-slider>
            </div>
            <div class="dice-user">
                <el-button type="primary">{{$t("btn.login")}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bettingNumber: 0,
            target: 50,
        }
    },
    methods: {
    }
}
</script>

<style lang="less">
.dice-wrap {
    padding: 30px;
    background-color: #1a1a1a;
    color: #fff;
    // background: url(https://dice.eosbet.io/background.7418bc01c2269ba7e456.png) top left/contain;
}
.dice-panel {
    width: 800px;
    margin: 0 auto;
    // background-color: #fff;
}
.dice-attributes {
    display: flex;
    // text-align: center;
    & > div {
        flex: 1;
    }
}
.dice-atr-title {
    padding: 10px 0;
    font-size: 14px;
    color: #9a9a9a;
}
.dice-multiple {
    width: 100%;
    height: 100%;
    display: flex;
    & > span {
        height: 40px;
        flex: 1;
        margin: 0 2px;
        display: inline-block;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
            background-color: #353535;
        }
    }
}
// 输入金额
.dice-input {
    width: 100%;
    .el-input {
        background-color: #353535;
        font-size: 24px;
        font-weight: 700;
    }
    .el-input__inner {
        background-color: #353535;
        border: 1px solid #414141;
        color: #fff;
    }
}
// 奖金
.dice-bonus {
    font-size: 24px;
    line-height: 40px;
    font-weight: 700;
    background-color: #353535;
    text-align: center;
    border: 1px solid #414141;
    color: #fff;
    border-radius: 2px;
}
// 计数
.dice-count {
    font-size: 34px;
}
// 滑动条
.dice-slide {
    padding-top: 30px;
}
.dice-user {
    padding: 10px 0;
    text-align: center;
}
</style>
