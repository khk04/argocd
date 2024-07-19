<template>
  <v-app>
    <v-main>
      <v-card class="mx-auto overflow-hidden pt-16" height="100%">
        <v-app-bar dark flat fixed>
          <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
          <v-btn icon @click="homeClick">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-toolbar-title><b>Juxtagene</b> - {{ title }}</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute temporary dark>
          <v-list color="white">
            <v-list-item>
              <v-img max-height="55" src="../public/juxtagene-logo.png" alt="Juxtagene"></v-img>
            </v-list-item>
          </v-list>

          <v-divider />

          <v-list nav dense>
            <v-list-item-group v-model="group" active-class="orange--text text--darken-1">
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

              <v-list-group :value="false" prepend-icon="mdi-server">
                <template v-slot:activator>
                  <v-list-item-title>Cluster</v-list-item-title>
                </template>

                <template v-for="cluster in clusters">
                  <v-list-group :key="cluster.key" :value="cluster.open" no-action sub-group>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title v-text="cluster.title"
                          @click="clusterClick(cluster.url)"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <v-list-item v-for="([title, icon, url], i) in cluster.nodes" :key="i" link>
                      <v-list-item-title v-text="title" @click="goUrl(url)"></v-list-item-title>

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

              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-remote</v-icon>
                </v-list-item-icon>
                <v-list-item-title @click="goMaasUrl()">Remote Control</v-list-item-title>
              </v-list-item>

              <v-list-item link to="/alarm">
                <v-list-item-icon>
                  <v-icon>mdi-alarm-light</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Alarm</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider />

          <template v-for="([title, icon, url], i) in monitoring">
            <v-list-item link :href="url" :key="i" target="_blank">
              <v-list-item-icon>
                <v-icon>{{ icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
            </v-list-item>
          </template>

        </v-navigation-drawer>

        <v-card class="pa-2 grey">
          <router-view />
        </v-card>

        <Footer />
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import FaAppBar from '@/components/commons/FaAppBar.vue'
import Footer from './components/commons/Footer.vue';
import Header from './components/commons/Header.vue';
import Move from './components/commons/Move.vue';

export default {
  components: {
    FaAppBar,
    Header,
    Move,
    Footer
  },

  name: 'App',

  data: () => ({
    //  drawer: null,
    drawer: false,
    group: null,
    // clusters: [
    //   {key: 0, title: "태원 빌딩", open: false, url: '/cluster1', nodes: [
    //     ['olafmgm00.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/hrpfpn/summary'],
    //     ['olafdb.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/6kfwxr/summary'],
    //     ['olaf00.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/6c33fh/summary'],
    //     ['olaf01.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/6c33fh/summary'],
    //     ['olaf02.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/heew34/summary'],
    //     ['olaf03.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/4ew4ck/summary'],
    //     ['api00.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/8qd46y/summary'],
    //     ['api01.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/8qd46y/summary'],
    //     ['api02.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/8qd46y/summary'],
    //     ['api03.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/8qd46y/summary'],
    //     ['api04.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/8qd46y/summary'],
    //     ['api05.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/wtdxkg/summary'],
    //     ['api06.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/hrfsne/summary'],
    //     ['api07.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/csgyeb/summary'],
    //     ['api08.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/pwbh66/summary'],
    //     ['api09.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/f7d4a4/summary'],
    //     ['api10.maas', 'mdi-application-outline', 'http://10.10.101.71:5240/MAAS/r/machine/f7d4a4/summary'],
    //   ]},
    //   {key: 1, title: "KT IDC", open: false, url: '/cluster2', nodes: [
    //   ]},
    // ],

  }),

  computed: {
    ...mapGetters({
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
      api06_url: 'url/api06_url',
      api07_url: 'url/api07_url',
      api08_url: 'url/api08_url',
      api09_url: 'url/api09_url',
      api10_url: 'url/api10_url',
    }),
    title() {
      if (this.$route.path === '/') return 'Dashboard'
      if (this.$route.path === '/login') return 'Login'
      if (this.$route.path === '/admin-console') return 'Admin Console'
      if (this.$route.path === '/cluster1') return '경기 안양 클러스터'
      if (this.$route.path === '/cluster2') return '경기 성남 클러스터'
      if (this.$route.path === '/pbs-monitoring') return 'PBS Monitoring'
      if (this.$route.path === '/process') return 'Process'
      if (this.$route.path === '/process-sub') return 'Process Sub'
      if (this.$route.path === '/remote-control') return 'Remote Control'
      if (this.$route.path === '/report') return 'Report'
      if (this.$route.path === '/fru') return 'FRU'
      if (this.$route.path === '/alarm') return 'Alarm'
      return ''
    },
    clusters() {
      return [
        {
          key: 0, title: "경기 안양", open: false, url: '/cluster1', nodes: [
            ['olafmgm00.maas', 'mdi-application-outline', this.olafmgmt00_url],
            ['olafdb.maas', 'mdi-application-outline', this.olafdb_url],
            ['olaf00.maas', 'mdi-application-outline', this.olaf00_url],
            ['olaf01.maas', 'mdi-application-outline', this.olaf01_url],
            ['olaf02.maas', 'mdi-application-outline', this.olaf02_url],
            ['olaf03.maas', 'mdi-application-outline', this.olaf03_url],
            ['api00.maas', 'mdi-application-outline', this.api00_url],
            ['api01.maas', 'mdi-application-outline', this.api01_url],
            ['api02.maas', 'mdi-application-outline', this.api02_url],
            ['api03.maas', 'mdi-application-outline', this.api03_url],
            ['api04.maas', 'mdi-application-outline', this.api04_url],
            ['api05.maas', 'mdi-application-outline', this.api05_url],
            ['api06.maas', 'mdi-application-outline', this.api06_url],
            ['api07.maas', 'mdi-application-outline', this.api07_url],
            ['api08.maas', 'mdi-application-outline', this.api08_url],
            ['api09.maas', 'mdi-application-outline', this.api09_url],
            ['api10.maas', 'mdi-application-outline', this.api10_url],
          ]
        },
        {
          key: 1, title: "Cloud (Azure)", open: false, url: '/cluster2', nodes: [
          ]
        },
      ]
    },
    monitoring() {
      return [
        // ['Ganglia', 'mdi-monitor', 'https://ganglia.sourceforge.net/'],
        // ['Prometheus', 'mdi-monitor', 'https://prometheus.io/'],
        // ['Grafana', 'mdi-monitor', 'https://grafana.com/'],
        // ['PMM', 'mdi-monitor', 'https://www.percona.com/software/database-tools/percona-monitoring-and-management'],
        ['MAAS', 'mdi-monitor', this.mass_url],
      ]
    }
  },
  methods: {
    ...mapMutations({
      // setTest: 'test/setTest'
    }),
    ...mapActions({
    }),
    clusterClick(url) {
      this.$router.push(url)
    },
    homeClick() {
      this.$router.push('/').catch(() => {})
    },
    goMaasUrl() {
      window.open(this.mass_url, '_blank');
    },
    goUrl(url) {
      if (url !== '') {
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
          window.open(url, '_blank');
        } else {
          this.$router.push(url)
        }
      }
    },
  },
  created() {
    console.log('process.env')
    console.log(process.env)
  }
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%
}

#app {
  background-color: #CFD8DC;
  height: 100%;
  width: 100%;
}

html {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

html::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera*/
}

section {
  position: relative;
  height: 100%;
  padding-bottom: 100px;
}

.v-list-item__icon {
  align-self: flex-start;
  margin: 12px 0;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 32px !important;
}
</style>