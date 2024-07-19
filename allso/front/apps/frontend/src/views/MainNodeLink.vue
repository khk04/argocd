
<template>
  <v-container class="grey lighten-5 py-10">
    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
    >
      <v-col cols="2" class="flex-grow-0 flex-shrink-0 px-13">
        <Node
          title="Admin console"
          width="125"
          :image="admin_console"
          :url=admin_console_url
          state="bg-on"
        />
      </v-col>
      <v-col
        cols="8"
        style="min-width: 100px; max-width: 100%;"
        class="flex-grow-1 flex-shrink-0"
      >
        <v-row class="mx-10">
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Management Node"
              width="150"
              :image="managerment_node"
              :url=master_url
              state="bg-on"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node1"
              width="150"
              :image="compute_node"
              :url=snow01_url
              :state="nodes['supreme-snow01']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node3"
              width="150"
              :image="compute_node"
              :url=thunder01_url
              :state="nodes['supreme-thunder01']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node5"
              width="150"
              :image="compute_node"
              :url=jade01_url
              :state="nodes['supreme-jade01']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Storage Node1"
              width="150"
              :image="storage_node"
              :url=storage01_url
              :state="nodes['supreme-storage01']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Storage Node3"
              width="150"
              :image="storage_node"
              :url=storage03_url
              :state="nodes['supreme-storage03']"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="2"
        style="min-width: 100px;"
        class="flex-grow-0 flex-shrink-1"
      >
      </v-col>
    </v-row>

    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
    >
      <v-col cols="2" class="flex-grow-0 flex-shrink-0">
      </v-col>
      <v-col
        cols="8"
        style="min-width: 100px; max-width: 100%;"
        class="flex-grow-1 flex-shrink-0"
      >
      <v-img src="../assets/dashboard-img-01.png"></v-img>
      </v-col>
      <v-col cols="2" class="flex-grow-0 flex-shrink-0 px-15">
        <div class="font-weight-bold text-center mb-5">
          IB HDR / GbE
        </div>
        <v-img
          width="150"
          :src="network"
          url=""
        ></v-img>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
    >
      <v-col
        cols="2"
        class="flex-grow-0 flex-shrink-0"
      >
      </v-col>
      <v-col
        cols="8"
        style="min-width: 100px; max-width: 100%;"
        class="flex-grow-1 flex-shrink-0"
      >
        <v-row class="mx-10">
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Login Node"
              width="150"
              :image="login_node"
              :url=master_url
              state="bg-on"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node2"
              width="150"
              :image="compute_node"
              :url=snow02_url
              :state="nodes['supreme-snow02']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node4"
              width="150"
              :image="compute_node"
              :url=thunder02_url
              :state="nodes['supreme-thunder02']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Compute Node6"
              width="150"
              :image="compute_node"
              url=""
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Storage Node2"
              width="150"
              :image="storage_node"
              :url=storage02_url
              :state="nodes['supreme-storage02']"
            />
          </v-col>
          <v-col cols="2" class="flex-grow-0 flex-shrink-0">
            <Node
              title="Storage Node4"
              width="150"
              :image="storage_node"
              url=""
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="2"
        height="150"
        width="150"
        style="min-width: 100px;"
        class="flex-grow-0 flex-shrink-1"
      >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import Node from '@/components/dashboard/Node.vue'

export default {
  name: 'DashboardMain',
  data () {
    return {
      admin_console: require("../../public/dashboard/admin_console.png"),
      managerment_node: require("../../public/dashboard/managerment_node.png"),
      login_node: require("../../public/dashboard/login_node.png"),
      compute_node: require("../../public/dashboard/compute_node.png"),
      storage_node: require("../../public/dashboard/storage_node.png"),
      network: require("../../public/dashboard/network_node.png"),
    }
  },

  computed: {
    ...mapGetters({
      nodes: 'ipmi/nodes',
      admin_console_url: 'url/admin_console_url',
      master_url: 'url/master_url',
      snow01_url: 'url/snow01_url',
      snow02_url: 'url/snow02_url',
      thunder01_url: 'url/thunder01_url',
      thunder02_url: 'url/thunder02_url',
      jade01_url: 'url/jade01_url',
      storage01_url: 'url/storage01_url',
      storage02_url: 'url/storage02_url',
      storage03_url: 'url/storage03_url',
    }),
  },

  components: {
    Node,
  },
  created() {
    this.getData()
    this.polling = setInterval(this.getData, 2000);
  },

  methods:{
    ...mapMutations({
      // setTest: 'test/setTest'
    }),
    ...mapActions({
      getPower: 'ipmi/getPower',
    }),

    getData(){
      this.getPower('node')
    },
  },

  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>

<style scoped>

</style>
