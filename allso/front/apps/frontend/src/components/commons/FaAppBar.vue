<template>
  <v-app-bar
    dense
    app
    elevation="1"
    height="64"
    dark
  >
    <v-toolbar-title v-text="title"></v-toolbar-title>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'FaAppBar',
    props:{
      title: String
    },
    data () {
      return {
      }
    },
  }
</script>

<style scoped>

</style>