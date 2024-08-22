<template>
    <v-list-item>
      <v-row>
        <v-col
            cols="12"
            md="7"
        >
          <v-list-item-content v-text="title">
          </v-list-item-content>
        </v-col>
        <v-col
            cols="12"
            md="5"
        >
          <v-list-item-content
            class="align-end red--text"
          >
            {{value[0][title]}}
          </v-list-item-content>
        </v-col>
      </v-row>
    </v-list-item>
</template>

<script>
  export default {
    name: 'ListItem',
    props:{
        title: Text,
        value: Array,
    },  
}
</script>

<style>

</style>