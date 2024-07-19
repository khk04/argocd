<template>
  <v-card class="pb-2">
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
</template>

<script>
//차트 컴포넌트 사용
import HorizontalBar from '@/components/charts/HorizontalBar.vue'

export default {
  name: 'MonitoringJobCount',
  data () {
      return {
      }
    },
    props:{
      csnow:Number,
      thunder:Number,
      cjade:Number,
      other:Number,
      jobHorizontalChart:Object,
    },
    computed: {
    },
    components: {
      HorizontalBar
    },
}
</script>

<style>

</style>