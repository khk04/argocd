<template>
  <v-card>
    <v-card-title class="text-h5">Memory Usage</v-card-title>      
    <v-card-text>
        <HalfDoughnutChart
            :chart-data="memoryChart"
            :height="200"
            :max-height="200"
        />   
        <v-divider class="ma-3"></v-divider>
        <div class="text-center text-h7 black--text font-weight-medium mt-5">{{memoryPersent}} %</div>
        <div class="text-center text-h7  font-weight-medium mt-2">{{memoryTotal - memoryUse}} of {{memoryTotal}} GB</div>
    </v-card-text>
  </v-card>
</template>

<script>
//차트 컴포넌트 사용
import HalfDoughnutChart from '@/components/charts/HalfDoughnutChart.vue'

export default {
  data () {
      return {
      }
    },
    props:{
      memoryChart: Object,
      memoryPersent: Number,
      memoryUse: Number,
      memoryTotal: Number,
    },

    computed: {
    },
    components: {
        HalfDoughnutChart,
    },
}
</script>

<style>

</style>