<template>
    <div class="betting-wrap">
        <div class="betting-panel">
            <div class="bp-tab">
                <div class="bp-tab-item" v-for="(item, index) in navs" :key="item.name" :class="{active: index === tab.current}" @click="switchTab(index)">{{$t(item.text)}}</div>
            </div>
            <div class="bp-content">
                <component :is="navs[tab.current].component"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
                        component: 'AllBets',
                        text: 'tab.allBets'
                    }
                ]
            }
        }
    },
    mounted() {
        if(this.loginStatus) {
            this.tab.navs.push({
                component: 'MineBets',
                text: 'tab.mineBets'
            })
        }
    },
    computed: {
        ...mapGetters(['loginStatus']),
        navs() {
            let temp = [
                {
                    component: 'AllBets',
                    text: 'tab.allBets'
                }
            ]
            if(this.loginStatus) {
                temp.push({
                    component: 'MineBets',
                    text: 'tab.mineBets'
                })
            }
            return temp;
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
