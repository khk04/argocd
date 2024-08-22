<template>
  <v-timeline align="start" side="end">
    <v-timeline-item
      v-for="(value, index) in items"
      :key="index"
      :dot-color="value.color"
      size="small"
    >
      <div class="d-flex">
        <dev class="me-3">{{ value.time }}</dev>
        <strong class="me-4">{{ value.status }}</strong>
      </div>
    </v-timeline-item>

    <!-- <v-timeline-item dot-color="teal-darken-3" size="small">
      <div class="d-flex">
        <dev class="me-3">06:00</dev>
        <strong class="me-4">사전준비완료</strong>
      </div>
    </v-timeline-item>

    <v-timeline-item dot-color="cyan-darken-3" size="small">
      <div class="d-flex">
        <dev class="me-3">08:00</dev>
        <strong class="me-4">자원대기중</strong>
      </div>
    </v-timeline-item>

    <v-timeline-item dot-color="light-blue-darken-3" size="small">
      <div class="d-flex">
        <dev class="me-3">10:00</dev>
        <strong class="me-4">작업수행중</strong>
      </div>
    </v-timeline-item>

    <v-timeline-item dot-color="blue-darken-3" size="small">
      <div class="d-flex">
        <dev class="me-3">12:00</dev>
        <strong class="me-4">작업종료중</strong>
      </div>
    </v-timeline-item>

    <v-timeline-item dot-color="indigo-darken-3" size="small">
      <div class="d-flex">
        <dev class="me-3">15:00</dev>
        <strong class="me-4">작업완료</strong>
      </div>
    </v-timeline-item> -->
  </v-timeline>
</template>

<script>
export default {
  name: "JabState",
  props: {
    items: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-timeline--vertical.v-timeline {
  height: 85%;
}
</style>
