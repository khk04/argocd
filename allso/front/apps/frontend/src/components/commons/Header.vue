<template>
    <!--
        헤더와 네이비게이션 
    -->
    <header>
        <!-- 모니터 크기에서 실행 -->
        <v-app-bar
            v-if="!$vuetify.breakpoint.mdAndUp"  
            app
            flat
            fixed
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true" /> <!-- 햄버거 버튼  -->
            <v-app-bar-title 
                class="font-weight-bold"
            >
              Seegene
            </v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer
          app
          dark
          v-model="drawer"
          :permanent="$vuetify.breakpoint.mdAndUp"
        >
            <v-list color="white">
                <v-list-item>
                  <v-img max-height="43" src="../../../public/seegen-logo.png" alt="Seegene"></v-img>
                </v-list-item>
            </v-list>
            
            <v-divider/>

            <v-list
                nav
                dense
            >
                <v-list-item-group
                    v-model="group"
                    active-class="orange--text text--darken-1"
                >
                    <v-list-item link to="/">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item>

                    <v-list-item link to="/admin-console">
                        <v-list-item-icon>
                            <v-icon>mdi-console</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Admin Console</v-list-item-title>
                    </v-list-item>
             
                    <v-list-group
                      :value="false"
                      prepend-icon="mdi-server"
                    >
                      <template v-slot:activator>
                        <v-list-item-title>Cluster</v-list-item-title>
                      </template>
              
                      <template v-for="cluster in clusters">
                        <v-list-group
                          :key="cluster.key"
                          :value="cluster.open"
                          no-action
                          sub-group
                        >
                          <template v-slot:activator>
                            <v-list-item-content>
                              <v-list-item-title v-text="cluster.title">Admin</v-list-item-title>
                            </v-list-item-content>
                          </template>
                
                          <v-list-item
                            v-for="([title, icon], i) in cluster.nodes"
                            :key="i"
                            link
                          >
                            <v-list-item-title v-text="title"></v-list-item-title>
                
                            <v-list-item-icon>
                              <v-icon v-text="icon"></v-icon>
                            </v-list-item-icon>
                          </v-list-item>
                        </v-list-group>
                      </template>
                    </v-list-group>

                    <v-list-item link to="/pbs-monitoring">
                        <v-list-item-icon>
                            <v-icon>mdi-chart-line</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>PBS Monitoring</v-list-item-title>
                    </v-list-item>

                    <v-list-item link to="/remote-control">
                      <v-list-item-icon>
                          <v-icon>mdi-remote</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Remote Control</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item link to="/alarm">
                        <v-list-item-icon>
                            <v-icon>mdi-alarm-light</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Alarm</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            <v-divider/>

            <template v-for="([title, icon, url], i) in monitoring">
              <v-list-item link :href="url" :key="i" target="_blank" >
                  <v-list-item-icon>
                    <v-icon>{{icon}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                      {{title}}
                  </v-list-item-title>
              </v-list-item>
            </template>

        </v-navigation-drawer>
    </header>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

export default {
  name: 'Header',
  data: () => ({
    drawer: false,
    group: null,
    clusters: [
      {key: 0, title: "Cluster 1", open: false, nodes: [
        ['node 01', 'mdi-application-outline' ],
        ['node 02', 'mdi-application-outline' ],
        ['node 03', 'mdi-application-outline' ]
      ]},
      {key: 1, title: "Cluster 2", open: false, nodes: [
        ['node 11', 'mdi-application-outline' ],
        ['node 12', 'mdi-application-outline' ],
        ['node 13', 'mdi-application-outline' ]
      ]},
      {key: 2, title: "Cluster 3", open: false, nodes: [
        ['node 21', 'mdi-application-outline' ],
        ['node 22', 'mdi-application-outline' ],
        ['node 23', 'mdi-application-outline' ]
      ]}
    ],
    monitoring: [
      // ['Ganglia', 'mdi-monitor', 'https://ganglia.sourceforge.net/'],
      // ['Prometheus', 'mdi-monitor', 'https://prometheus.io/'],
      // ['Grafana', 'mdi-monitor', 'https://grafana.com/'],
      // ['PMM', 'mdi-monitor', 'https://www.percona.com/software/database-tools/percona-monitoring-and-management'],
      ['MAAS', 'mdi-monitor', 'http://10.10.101.71:5240/MAAS/r/'],
    ],
  }),
  computed: {
    now() {
      return Date.now()
    },
    selectSC() {
      if(this.$route.path === '/system-configuration') return true
      return false
    },
    ...mapGetters({
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
    })
  }
}
</script>

<style scoped>
.v-list-item__icon {
  align-self: flex-start;
  margin: 12px 0;
}

.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 32px !important;
}
</style>