<template>
  <v-card class="mx-auto" max-width="1000">
    <v-list :items="images" item-title="name" item-value="name">
      <v-list-item
        v-for="(image, i) in images"
        @click="selectImage(image.name)"
        :key="i"
        >{{ image.name }}</v-list-item
      >
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "DocerImages",
  props: {
    images: Array,
  },
  methods: {
    selectImage(name) {
      this.$emit("selectImageEvent", name);
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
</style>
