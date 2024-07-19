<template>

  <v-card dark>
    <v-tabs>
      <template v-for="([title, icon], i) in sshMenu">
        <v-tab :key="i">
          <v-icon left>
            {{icon}}
          </v-icon>
          {{title}}
        </v-tab>
      </template>

        <v-tab-item key="1">
            <v-card height="768" flat dark color="grey darken-3">
            <div class="container">
              <fa-console :terminal="terminal1"></fa-console>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item key="2">
          <v-card height="768" flat dark color="grey darken-3">
            <div class="container">
              <fa-console :terminal="terminal2"></fa-console>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item key="3">
          <v-card height="768" flat dark color="grey darken-3">
            <div class="container">
              <fa-console :terminal="terminal3"></fa-console>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item key="4">
          <v-card height="768" flat dark color="grey darken-3">
            <div class="container">
              <fa-console :terminal="terminal4"></fa-console>
            </div>
          </v-card>
        </v-tab-item>
    </v-tabs>
  </v-card>


</template>

<script>
// import { Terminal } from 'xterm';
import FaConsole from '@/components/commons/FaConsole.vue'

export default {
  name: 'AdminConsole',
  data () {
    return {
      sshMenu: [
        ['olaflogin00', 'mdi-console-line'],
        ['olafmgmt00', 'mdi-console-line'],
        ['genielogin00', 'mdi-console-line'],
        ['geninemgmt00', 'mdi-console-line'],
      ],
      terminal1: {
        pid: 1,
        name: 'terminal',
        wsUrl: 'allso-backend.juxtagene.com',
        cols: 80,
        rows: 44
      },
      terminal2: {
        pid: 2,
        name: 'terminal',
        wsUrl: 'allso-backend.juxtagene.com',
        cols: 80,
        rows: 44
      },
      terminal3: {
        pid: 3,
        name: 'terminal',
        wsUrl: 'allso-backend.juxtagene.com',
        cols: 80,
        rows: 44
      },
      terminal4: {
        pid: 4,
        name: 'terminal',
        wsUrl: 'allso-backend.juxtagene.com',
        cols: 80,
        rows: 44
      }
    }
  },

  created() {
      console.log(this.$route.path)
  },

  mounted () {
  },

  components: {
    FaConsole,
  },

  methods:{
  }

}
</script>

<style>

@media (min-width: 1264px) {
  .container {
    max-width: 1900px;
  }
}
</style>

<style scoped>
</style>
