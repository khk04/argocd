<template>
  <v-card height="365">
    <v-card-title class="text-h5">Job Runtime</v-card-title>    
    <v-card-subtitle>Top 18 of {{jobHistory}}</v-card-subtitle>     
    <v-card-text>
        <BarChart
            :chart-data="jobBarChart"
            :height="200"
            :max-height="200"
        />
    </v-card-text>
  </v-card>
</template>

<script>
//차트 컴포넌트 사용
import BarChart from '@/components/charts/BarChart.vue'

export default {
  name: 'MonitoringJobCount',
  data () {
      return {
      }
    },
    props:{
      jobHistory: Number,
      jobBarChart: Object,
    },
    computed: {
    },
    components: {
      BarChart
    },
}
</script>

<style scoped>

</style>