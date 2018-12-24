<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import url('./assets/styles/rest/elm.rest.less');
html, body {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
