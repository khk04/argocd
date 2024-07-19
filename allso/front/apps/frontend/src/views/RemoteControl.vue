<template>
  <v-card height="830" flat class="pa-4" dark color="grey darken-3">
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import Control from '@/components/node/Control.vue'

export default {
  name: 'RemoteControl',
  data () {
    return {
      states:[] // 노드 상태 제어
    }
  },

  components: {
    Control,
  },
  created() {
    console.log('CALL created()')
    this.getData()
    this.polling = setInterval(this.getData, 2000);
  },
  computed: {
    ...mapGetters({
      controls: 'ipmi/control',
      nodes: 'ipmi/nodes',
    })
  },

  methods:{
    ...mapMutations({
      // setTest: 'test/setTest'
    }),
    ...mapActions({
      getPower: 'ipmi/getPower',
    }),

    getData(){
      this.getPower('node')
    },
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>

<style>
</style>
