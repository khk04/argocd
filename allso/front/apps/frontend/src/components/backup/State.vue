<template>
    <article>
        <!-- <h2 class="py-2 text-h4 font-weight-bold" id="state" >
            State
        </h2> -->

        <v-row>
            <v-col
                cols="12"
                md="4"
            >
                <v-card>
                    <v-card-title class="text-h5">CPU Allocation</v-card-title>   
                    <v-card-text>
                        <HalfDoughnutChart
                            :chart-data="cpuChart"
                            :height="200"
                            :maxHeight="200"
                        />
                        <v-divider class="ma-3"></v-divider>
                        <div class="text-center text-h6 black--text font-weight-medium mt-5">{{cpuPersent}} %</div>
                        <div class="text-center text-h6 font-weight-medium mt-2">{{cpuUse}} of {{cpuTotal}} ALLOCED</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col           
                cols="12"
                md="4"
            >
                <v-card>
                    <v-card-title class="text-h5">Memory Usage</v-card-title>      
                    <v-card-text>
                        <HalfDoughnutChart
                            :chart-data="memoryChart"
                            :height="200"
                            :maxHeight="200"
                        />   
                        <v-divider class="ma-3"></v-divider>
                        <div class="text-center text-h6 black--text font-weight-medium mt-5">{{memoryPersent}} %</div>
                        <div class="text-center text-h6  font-weight-medium mt-2">{{memoryTotal - memoryUse}} of {{memoryTotal}} GB</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
            cols="12"
            md="4"
            >
            <v-card>
              <v-card-title class="text-h5">Runing Job - ({{jobs.length}})</v-card-title>      
              <template>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="jobs"
                    hide-default-footer
                    class="elevation-1"
                  ></v-data-table>
                </v-card-text>
              </template>
            </v-card>
            </v-col>
        </v-row>
    </article>
</template>

<script>
//차트 컴포넌트 사용
import HalfDoughnutChart from '@/components/charts/HalfDoughnutChart.vue'

export default {
  data () {
      return {
        headers: [
          { text: 'JOBID', align: 'end', value: 'jobid' },
          { text: 'PARTITION', align: 'end', value: 'partition' },
          { text: 'NAME', align: 'end', value: 'name' },
          { text: 'USER', align: 'end', value: 'user' },
          { text: 'ST', align: 'end', value: 'st' },
          { text: 'TIME', align: 'end', value: 'time' },
          { text: 'NODES', align: 'end', value: 'nodes' },
          { text: 'NODELIST(REASON)', align: 'end', value: 'nodelist' },
        ],
      }
    },
    props:{
        cpuChart:Object,
        cpuTotal:Number,
        cpuUse:Number,
        cpuPersent:Number,

        memoryChart:Object,
        memoryTotal:Number,
        memoryUse:Number,
        memoryPersent:Number,

        nodes:Array,
        jobs:Array,

        nodeData:Object,
        csnowData:Object,
        thunderData:Object,
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