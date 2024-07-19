<template>
  <v-card height="290">
    <v-card-title class="text-h5">Runing Job - ({{jobs.length}})</v-card-title>      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="jobs"
          :items-per-page="-1"
          hide-default-footer
          class="elevation-1"
          height="200"
        ></v-data-table>
      </v-card-text>
  </v-card>
</template>

<script>
//차트 컴포넌트 사용
export default {
  name: 'MonitoringCpu',
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
      jobs:Array,
    },
    computed: {
    },
    components: {
    },
}
</script>

<style>

</style>