<template>
    <div class="betting-wrap">
        <div class="betting-panel">
            <div class="bp-tab">
                <div class="bp-tab-item" v-for="(item, index) in tab.navs" :key="item.name" :class="{active: index === tab.current}" @click="switchTab(index)">{{item.title}}</div>
            </div>
            <div class="bp-content">
                <component :is="tab.navs[tab.current].component"></component>
            </div>
        </div>
    </div>
</template>

<script>
import AllBets from './AllBets'
import MineBets from './MineBets'

export default {
    components: {
        AllBets,
        MineBets
    },
    data() {
        return {
            tab: {
                current: 0,
                navs: [
                    {
                        title: '所有投注',
                        component: 'AllBets'
                    },
                    {
                        title: '我的投注',
                        component: 'MineBets'
                    }
                ]
            }
        }
    },
    methods: {
        switchTab(index) {
            this.tab.current = index;
        }
    }
}
</script>

<style lang="less">
.betting-panel {
    width: 1200px;
    margin: 0 auto;
    .active {
        color: #409eff;
    }
}
.bp-tab {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bp-tab-item {
    padding: 10px 15px;
    cursor: pointer;
}
</style>
