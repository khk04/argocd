<template>
  <v-card
    class="mx-auto"
    outlined
    :color="color"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          <b>{{title}}</b>
        </div>
        <v-list-item-title class="text-h5 mb-1 text-center">
          {{value}} {{suffix}}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'FaTextBox02',
  props:{
    title: String,
    value: Number,
    color: String,
    suffix: String
  },
}
</script>

