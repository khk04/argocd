<template>
  <v-card height="290">
    <!-- <v-card-title class="text-h5">PBS node status - ({{nodes.length}})</v-card-title> -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="jobs"
          :items-per-page="-1"
          hide-default-footer
          class="elevation-1"
          height="300"
        ></v-data-table>
      </v-card-text>
  </v-card>
</template>

<script>
//차트 컴포넌트 사용
export default {
  name: 'PbsJobs',
  data () {
      return {
        headers: [
          { text: 'Name', align: 'end', value: 'name' },
          { text: 'User', align: 'end', value: 'user' },
          { text: 'Time', align: 'end', value: 'time' },
          { text: 'State', align: 'end', value: 'state' },
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