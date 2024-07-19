<template>
  <v-card height="290">
    <!-- <v-card-title class="text-h5">PBS node status - ({{nodes.length}})</v-card-title> -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="nodes"
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
  name: 'PbsNodes',
  data () {
      return {
        headers: [
          { text: 'Server Name', align: 'end', value: 'name' },
          { text: 'Available Core', align: 'end', value: 'icpus' },
          { text: 'Available Memory (MB)', align: 'end', value: 'imem' },
        ],
      }
    },
    props:{
      nodes:Array,
    },
    computed: {
    },
    components: {
    },
}
</script>

<style>

</style>