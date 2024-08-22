<template>
  <v-card dark>
    <v-card height="870" flat class="pa-6 pb-12" dark color="grey darken-3">
      <v-container class="grey darken-2 py-10">
        <v-row no-gutters style="flex-wrap: nowrap;">
          <v-col cols="3" class="px-3">
            <v-row no-gutters style="flex-wrap: nowrap;">
              <v-col cols="6" class="px-3">
                <Node title="Mass" :image="admin_console" width="130" state="bg-on" :url="mass_url" />
              </v-col>

            </v-row>
            <v-row>
              <v-col cols="6"></v-col>
              <v-col cols="6" class="pa-2">
                <v-card flat class="pa-6 pb-12" dark color="grey darken-2">
                  <div class="font-weight-bold mb-5">
                    IB HDR / GbE
                  </div>
                  <v-img width="90" :src="network" url=""></v-img>
                </v-card>
              </v-col>
            </v-row>
            <v-row no-gutters style="flex-wrap: nowrap;">
              <v-col cols="6" class="pa-3">
                <v-card dark color="grey darken-3">
                  <v-card-title class="mb-7">
                    Power State
                  </v-card-title>

                  <v-card-subtitle>
                    <v-row no-gutters style="flex-wrap: nowrap;">
                      <v-col cols="4">
                        <b>ON</b>
                      </v-col>
                      <v-col>
                        <div>
                          <v-progress-linear color="#29B6F6" class="mt-2" value="100"></v-progress-linear>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="flex-wrap: nowrap;">
                      <v-col cols="4">
                        <b>OFF</b>
                      </v-col>
                      <v-col>
                        <div>
                          <v-progress-linear color="#EF5350" class="mt-2" value="100"></v-progress-linear>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="flex-wrap: nowrap;">
                      <v-col cols="4">
                        <b>WAIT</b>
                      </v-col>
                      <v-col>
                        <div>
                          <v-progress-linear color="#78909C" class="mt-2" value="100"></v-progress-linear>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="9" class="flex-grow-0 flex-shrink-0">
            <v-card height="740" flat class="px-6 pt-6" dark color="grey darken-3">
              <div class="body-2 font-weight-bold mb-7">
                Managed By Maas
              </div>
              <v-row no-gutters style="flex-wrap: nowrap;" class="ma-5">
                <v-col cols="2" class="pa-3">
                  <Node title="olafmgmt00" :image="managerment_node" width="130" state="bg-on" :url="olafmgmt00_url" />
                </v-col>
                <v-col cols="2" class="pa-3">

                </v-col>
                <v-col cols="2" class="pa-3">
                  <Node title="olaf00" width="130" :image="compute_node" state="bg-on" :url="olaf00_url" />
                </v-col>
                <v-col cols="2" class="pa-3">
                  <Node title="olaf01" width="130" :image="compute_node" state="bg-on" :url="olaf01_url" />
                </v-col>
                <v-col cols="2" class="pa-3">
                  <Node title="olaf02" width="130" :image="compute_node" state="bg-on" :url="olaf02_url" />
                </v-col>
                <v-col cols="2" class="pa-3">
                  <Node title="olaf03" width="130" :image="compute_node" state="bg-on" :url="olaf03_url" />
                </v-col>
              </v-row>

              <v-row no-gutters style="flex-wrap: nowrap;">
                <v-col cols="12" style="min-width: 100px; max-width: 100%;" class="flex-grow-1 flex-shrink-0">
                </v-col>
              </v-row>

              <v-row no-gutters style="flex-wrap: nowrap;">
                <v-col cols="12" style="min-width: 100px; max-width: 100%;" class="flex-grow-1 flex-shrink-0">
                  <v-row class="ma-5">
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">

                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api00" width="130" :image="compute_node" state="bg-on" :url="api00_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api01" width="130" :image="compute_node" state="bg-on" :url="api01_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api02" width="130" :image="compute_node" state="bg-on" :url="api02_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api03" width="130" :image="compute_node" state="bg-on" :url="api03_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api04" width="130" :image="compute_node" state="bg-on" :url="api04_url" />
                    </v-col>

                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters style="flex-wrap: nowrap;">
                <v-col cols="12" style="min-width: 100px; max-width: 100%;" class="flex-grow-1 flex-shrink-0">
                  <v-row class="ma-5">
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="olaflogin00" width="130" :image="managerment_node" state="bg-on" :url="olafdb_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="api05" width="130" :image="compute_node" state="bg-on" :url="api05_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="olafdb00" width="130" :image="storage_node" state="bg-on" :url="olafdb00_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="olafdb01" width="130" :image="storage_node" state="bg-on" :url="olafdb01_url" />
                    </v-col>
                    <v-col cols="2" class="flex-grow-0 flex-shrink-0">
                      <Node title="olafdb02" width="130" :image="storage_node" state="bg-on" :url="olafdb02_url" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

//컴포넌트
import MainNodeLink from '@/views/MainNodeLink.vue'
import MainSlurm from '@/views/MainSlurm.vue'
import Node from '@/components/dashboard/Node.vue'

// import Ganglia from '@/components/dashboard/Ganglia.vue'
// import Ipmi from '@/components/dashboard/Ipmi.vue'

export default {
  name: 'Main',

  components: {
    MainNodeLink,
    MainSlurm,
    Node,
  },

  data() {
    return {
      polling: null,
      admin_console: require("../../public/dashboard/admin_console.svg"),
      managerment_node: require("../../public/dashboard/managerment_node.svg"),
      login_node: require("../../public/dashboard/login_node.svg"),
      compute_node: require("../../public/dashboard/compute_node.svg"),
      storage_node: require("../../public/dashboard/storage_node.svg"),
      network: require("../../public/dashboard/network_node.svg"),
    }
  },

  computed: {
    ...mapGetters({
      dashboardMenu: 'menu/dashboardMenu',

      csnow: 'ganglia/csnow',
      thunder: 'ganglia/thunder',
      nodeData: 'ganglia/nodeData',
      csnowData: 'ganglia/csnowData',
      thunderData: 'ganglia/thunderData',

      time: 'slurm/time',
      jobs: 'slurm/jobs',
      idle: 'slurm/idle',
      total: 'slurm/total',
      use: 'slurm/use',
      persent: 'slurm/persent',
      runtime: 'slurm/runtime',

      state: 'ipmi/state',
      nodes: 'ipmi/nodes',

      mass_url: 'url/mass_url',
      olafmgmt00_url: 'url/olafmgmt00_url',
      olafdb_url: 'url/olafdb_url',
      olaf00_url: 'url/olaf00_url',
      olaf01_url: 'url/olaf01_url',
      olaf02_url: 'url/olaf02_url',
      olaf03_url: 'url/olaf03_url',
      api00_url: 'url/api00_url',
      api01_url: 'url/api01_url',
      api02_url: 'url/api02_url',
      api03_url: 'url/api03_url',
      api04_url: 'url/api04_url',
      api05_url: 'url/api05_url',
      olafdb00_url: 'url/olafdb00_url',
      olafdb01_url: 'url/olafdb01_url',
      olafdb02_url: 'url/olafdb02_url',
    }),
    // dashboardMenu() {
    //   let menu = this.clustersMenu
    //   console.log(menu)
    //   if (menu.length === 2) {
    //     menu.unshift(['메인', 'mdi-view-dashboard'])
    //   }
    //   return menu
    // }
  },

  created() {
    console.log('CALL created()')
    this.getData()
    this.polling = setInterval(this.getData, 2000);
  },

  methods: {
    ...mapMutations({
      // setTest: 'test/setTest'
    }),
    ...mapActions({
      getGangliaLine: 'ganglia/line',
      getGangliaBar: 'ganglia/bar',
      getRuntime: 'slurm/getRuntime',
      getJobs: 'slurm/getJobs',
      getNodes: 'slurm/getNodes',
      getPower: 'ipmi/getPower',
    }),

    getData() {
      this.getRuntime()
      this.getNodes('state')
      this.getJobs()
      // this.getGangliaLine()
      // this.getGangliaBar()
      this.getPower('node')
    },
  },

  beforeDestroy() {
    clearInterval(this.polling)
  }
}
</script>
<style lang="scss">
@media (min-width: 1264px) {
  .container {
    max-width: 2000px;
  }
}

@media (min-width: 1264px) {
  .container {
    max-width: 2000px;
  }
}

.opacity07 {
  opacity: 0.7;
}
</style>
