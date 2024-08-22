<template>
  <v-card>
      <v-card-title class="text-h5">CPU Allocation</v-card-title>   
      <v-card-text>
          <half-doughnut-chart
              :chart-data="cpuChart"
              :height="200"
              :max-height="200"
          />
          <v-divider class="ma-3"></v-divider>
          <div class="text-center text-h7 black--text font-weight-medium mt-5">{{cpuPersent}} %</div>
          <div class="text-center text-h7 font-weight-medium mt-2">{{cpuUse}} of {{cpuTotal}} ALLOCED</div>
      </v-card-text>
  </v-card>
</template>

<script>
//차트 컴포넌트 사용
import HalfDoughnutChart from '@/components/charts/HalfDoughnutChart.vue'

export default {
  name: 'MonitoringCpu',
  data () {
      return {
      }
    },
    props:{
        cpuChart: Object,
        cpuTotal: Number,
        cpuUse: Number,
        cpuPersent: Number,
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