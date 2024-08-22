<template>
  <v-card
    class="px-3 pb-3"
    tile
    link
    :disabled="isUrl(url)"
    @click="goUrl(url)"
  >
    <div :class="state" style="height:3px;"></div>
    <div class="body-2 font-weight-bold text-center mb-5 mt-1">
      {{title}}
    </div>
    <v-img
      :height=height
      :width=width
      :src=image
      class="ma-auto"
    ></v-img>
  </v-card>
</template>

<script>

export default {
  name: 'Node',
  props:{
      title: String,
      height: String,
      width: String,
      image: String,
      url: String,
      link: Boolean,
      state: {
        type: String,
        default() {
          return 'bg-wait'
        }
    },
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