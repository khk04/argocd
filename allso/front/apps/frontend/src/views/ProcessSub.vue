<template>
  <v-card height="830" flat class="pa-4" dark color="grey darken-3">
    <v-container style="max-width: 1500px;">
      <v-row
        no-gutters
      >
        <v-col cols="12" sm="6" class="px-2 pt-3">
          <v-card height="260" class="px-4" color="grey darken-4">
            <v-icon>mdi-developer-board</v-icon> CPU Monitoring
            <v-card flat class="text-center pa-4" style="margin-top: 1px">
              <LineChart
                :chart-data="chartCpuDatas"
                :height="200"
                :max-height="200"
              />
            </v-card>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="px-2 pt-3">
          <v-card height="260" class="px-4" color="grey darken-4">
            <v-icon>mdi-memory</v-icon> Memory Monitoring
            <v-card flat class="text-center pa-4" style="margin-top: 1px">
              <LineChart
                :chart-data="chartMemDatas"
                :height="200"
                :max-height="200"
              />
            </v-card>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        no-gutters
      >
        <v-col cols="12" sm="6" class="px-2 pt-3">
          <v-card height="260" class="px-4" color="grey darken-4">
            <v-icon>mdi-network</v-icon> Network Monitoring
            <v-card flat class="text-center pa-4" style="margin-top: 1px">
              <LineChart
                :chart-data="chartNetworkDatas"
                :height="200"
                :max-height="200"
              />
            </v-card>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="px-2 pt-3">
          <v-card height="260" class="px-4" color="grey darken-4">
            <v-icon>mdi-database</v-icon> Disk I/O Monitoring
            <v-card flat class="text-center pa-4" style="margin-top: 1px">
              <LineChart
                :chart-data="chartDiskDatas"
                :height="200"
                :max-height="200"
              />
            </v-card>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        no-gutters
      >
        <v-col cols="12" class="px-2 pt-3">
          <v-btn link to="process">돌아가기</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import LineChart from '@/components/charts/LineChart.vue'

  export default {
    name: 'Process',
    data () {
      return {
        step1: 100,
        step2: 50,
        step3: 0,
        step4: 0,
        dialog: false,
      }
    },

    created() {
      this.getData()
      this.polling = setInterval(this.getData, 5000);
    },
  
    computed: {
      ...mapGetters({
      chartCpuDatas: 'process/chartCpuDatas',
      chartMemDatas: 'process/chartMemDatas',
      chartNetworkDatas: 'process/chartNetworkDatas',
      chartDiskDatas: 'process/chartDiskDatas',
      }),
    },

    methods:{
      ...mapMutations({
      }),
      ...mapActions({
        getDemoData: 'process/getLineChartDemo',
      }),
      btnState (data) {
        if(data == 0) {
          return 'grey'
        } else if(data == 100) {
          return 'primary lighten-2'
        } else {
          return 'orange'
        }
      },
      getData(){
        this.getDemoData()
        console.log(this.chartCpuDatas)
      },
    },
  
    components: {
      LineChart
    },

    beforeDestroy () {
      clearInterval(this.polling)
    }
  }
</script>

<style>
@media (min-width: 1264px) {
  .container {
    max-width: 1900px;
  }
}
</style>
