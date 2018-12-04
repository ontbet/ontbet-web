<template>
    <div class="nav-header">
        <div class="logo">
            <img src="https://www.betdice.one/img/logo.png" alt="LOGO">
        </div>
        <div></div>
        <ul class="nav-menu">
            <li class="nav-menu-item active">骰子</li>
            <li class="nav-menu-item" @click="openModal('dividend')">股息</li>
            <li class="nav-menu-item" @click="openModal('help')">帮助</li>
        </ul>
        <el-dropdown>
            <span class="language-btn">
                中文<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>中文</el-dropdown-item>
                <el-dropdown-item>English</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    methods: {
        openModal(type) {
            this.$emit('open-modal', type)
        }
    }
}
</script>

<style lang="less">
.nav-header {
    // width: 1200px;
    height: 100%;
    margin: 0 auto;
    // background-color: #353535;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo {
    height: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    img {
        height: 100%;
    }
}
.nav-menu {
    width: 0;
    flex: 1;
    height: 100%;
    margin: 0;
    padding: 0 15px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    list-style-type: none;
    font-size: 14px;
}
.nav-menu-item {
    padding: 10px 15px;
    cursor: pointer;
    &.active {
        color: #409eff;
    }
}
.language-btn {
    padding: 10px 0;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
}
</style>
