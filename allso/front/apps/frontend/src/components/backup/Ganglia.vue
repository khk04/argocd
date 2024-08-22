<template>
    <article>
        <h2 class="py-2 text-h4 font-weight-bold" id="ganglia" >
            Ganglia
        </h2>
        <v-row>
            <v-col
                cols="12"
                md="12"
            >
                <h3 class="text-h5 ml-2">Load Comparison</h3>
            </v-col>
            <v-col           
                cols="12"
                md="12"
            >
                <v-card>
                    <v-card-title class="text-h5">NODE</v-card-title>         
                    <v-card-text>
                        <LineChart
                            :chart-data="nodeData"
                            :height="280"
                            :max-height="330"

                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                cols="12"
                md="12"
            >
                <h3 class="text-h5 ml-2">CPU Usage</h3>
            </v-col>
            
            <v-col           
                cols="12"
                md="6"
            >
                <v-card>
                    <v-card-title class="text-h5">CSNOW</v-card-title>         
                    <v-card-text>
                        <DoughnutChart
                            :chart-data="csnowData"
                            :height="200"
                            :width="450"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col           
                cols="12"
                md="6"
            >
                <v-card>
                    <v-card-title class="text-h5">THUNDER</v-card-title>         
                    <v-card-text>
                        <DoughnutChart
                            :chart-data="thunderData"
                            :height="200"
                        />
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </article>
</template>

<script>
//차트 컴포넌트 사용
import LineChart from '../charts/LineChart.vue'
import DoughnutChart from '../charts/DoughnutChart.vue'

export default {

    props:{
        nodeData:Object,
        csnowData:Object,
        thunderData:Object,
        legend:Boolean,
        title:String,
    },  

    components: {
        LineChart,
        DoughnutChart,
    },

}
</script>

<style>

</style>