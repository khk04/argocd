<template>
  <v-card class="text-left pl-2 py-2" color="">
    <v-card-title>작업 선택</v-card-title>
    <v-card-text> * 작업을 선택하세요. </v-card-text>
    <v-card-actions>
      <v-btn variant="outlined" color="primary" @click="selectJob('SCT')"
        >Demo1</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn variant="outlined">Demo2</v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="outlined">Demo3</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SelectJab",
  props: {},
  methods: {
    selectJob(job_name) {
      this.$emit("selectJobEvent", job_name);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-timeline--vertical.v-timeline {
  height: 85%;
}
</style>
