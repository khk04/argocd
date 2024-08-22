<template>
  <v-list
    :items="jobs"
    item-title="job_name"
    item-value="job_name"
    class="pa-0"
  >
    <v-list-item
      v-for="(job, i) in jobs"
      @click="selectJob(job.job_name)"
      :key="i"
      :value="job.job_name"
      variant="plain"
      :class="{ select: isBackground(job.job_name) }"
      >{{ job.job_name }}</v-list-item
    >
  </v-list>
</template>

<script>
export default {
  name: "ReadyJobList",
  props: {
    jobs: Array,
    selectJobName: String,
  },
  methods: {
    selectJob(job_name) {
      this.$emit("selectReadyJobEvent", job_name);
    },
    isBackground(job_name) {
      if (job_name === this.selectJobName) {
        return true;
      }
      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.select {
  background-color: #42a5f5;
  color: #ffffff;
}
</style>
