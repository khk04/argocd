<template>
  <section>
    <v-container >
      <h1 class="py-4 text-h3 font-weight-bold" id="node">Node</h1>
      
      <Control
        class="mt-6"
        :nodes="nodes"
        :states="states"
      />

    </v-container>
  </section>
</template>

<script>
import ipmi from '@/services/ipmi'

import Control from '@/components/node/Control.vue'

export default {
  data () {
    return {

      nodes:[
        { title:'CSNOW 1'   , id:'snow01'    , state:'off' },
        { title:'CSNOW 2'   , id:'snow02'    , state:'off' },
        { title:'Thunder 1' , id:'thunder01' , state:'off' },
        { title:'Thunder 2' , id:'thunder02' , state:'off' },
      ],

      states:[] // 노드 상태 제어
    }
  },

  components: {
    Control,
  },

  async created() {
    await this.power('node')
    this.polling = setInterval(this.getData, 1000);
  },

  methods:{
    getData(){
      this.power('node')
    },

    async power(type){
        try {
          let result = await ipmi.power(type)

          this.nodes[0].state = result[2] 
          this.nodes[1].state = result[3] 
          this.nodes[2].state = result[0] 
          this.nodes[3].state = result[1] 

          if(this.states.length === 0) this.states = [result[2] , result[3] , result[0] ,result[1]] //최초 1회 업데이트 , UI 문제

        } catch (e) {
          console.error(e)
        }
    },
  },

  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>
