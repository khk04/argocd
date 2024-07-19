<template>
    <article>
        <!-- <h2 class="py-2 text-h4 font-weight-bold" id="job" >
            Job 
        </h2> -->
        <v-row>
          <v-col           
                cols="12"
                md="8"
            >
                <v-card>
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
            </v-col>
            <v-col
                cols="12"
                md="4"
            >
                <v-card class="pb-5">
                    <v-card-title class="text-h5">Job Count</v-card-title>    
                    <v-card-subtitle>
                      <v-chip
                            dark
                            color="#00897B"
                            label
                            x-small
                        >
                            CSNOW :
                            {{csnow}}
                        </v-chip>
                      <v-chip
                            dark
                            class="mx-2"
                            color="#039BE5"
                            label
                            x-small
                        >
                          Thunder :
                          {{thunder}}
                      </v-chip>
                      <v-chip
                          dark
                          class="mx-2"
                          color="#8000FF"
                          label
                          x-small
                      >
                        CJADE :
                        {{cjade}}
                      </v-chip>  
                        <v-chip
                            dark
                            class="mx-2"
                            color="#00ACC1"
                            label
                            x-small
                        >
                            All :
                            {{all}}
                        </v-chip>
                        <v-chip
                            dark
                            color="#E0E0E0"
                            label
                            x-small
                        >
                            Other :
                            {{other}}
                        </v-chip>
                    </v-card-subtitle>      
                    <v-card-text>
                        <HorizontalBar
                            :chart-data="jobHorizontalChart"
                            :height="180"
                            :max-height="180"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
    </article>
</template>

<script>

import HorizontalBar from '@/components/charts/HorizontalBar.vue'
import BarChart from '@/components/charts/BarChart.vue'

export default {
    props:{
        jobBarChart:Object,
        jobHorizontalChart:Object,
        jobHistory:Number,
        cjade:Number,
        csnow:Number,
        thunder:Number,
        all:Number,
        other:Number,
    },  

    components: {
        HorizontalBar,
        BarChart
    },
}
</script>

<style>

</style>