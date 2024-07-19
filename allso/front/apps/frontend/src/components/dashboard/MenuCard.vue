<template>
  <v-card
    height="150"
    class="pa-3"
    flat
    dark
    link
    color="grey darken-4"
    :disabled="isUrl(url)"
    @click="goUrl(url)">
           
    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
    >
      <v-col cols="3" class="pl-3 pt-2">
        <v-avatar
        color="grey"
        size="40"
      ></v-avatar>
      </v-col>
        
      <v-col cols="9" class="pl-3" >

        <v-card-title>{{title}}</v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="text-center">{{subTitle}}</v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'MenuCard',
  props:{
    title: String,
    subTitle: String,
    url: String,
    link: Boolean,
  },
    methods:{
      isUrl(url) {
        if (url === '') {
          return true
        }
        return false
      },
      goUrl(url) {
        if (url !== '') {
          if( url.indexOf('http://') === 0 || url.indexOf('https://') === 0 ) {
            window.open(url, '_blank');
          } else {
            this.$router.push(url)
          }
        }
      },
  }
}
</script>

<style scoped>
.v-card--disabled {
  opacity: 0.5;
}

.bg-on {
  background-color: #29B6F6;
}

.bg-off {
  background-color: #EF5350;
}

.bg-wait {
  background-color: #78909C;
}

</style>