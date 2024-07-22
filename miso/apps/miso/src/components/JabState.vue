<template>
  <v-progress-circular
    :color="job_status.color"
    :model-value="progress"
    :size="200"
    :width="50"
    ><template v-slot:default>
      {{ job_status.status }} <br />
      {{ progress }} %
    </template>
  </v-progress-circular>
</template>

<script>
export default {
  name: "JabState",
  props: {
    job_status: Object,
    progress: Number,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-timeline--vertical.v-timeline {
  height: 85%;
}
</style>
