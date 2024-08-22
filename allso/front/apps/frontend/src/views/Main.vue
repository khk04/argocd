<template>
  <v-card dark>
    <v-card height="830" flat class="px-0" dark color="grey darken-3">
      <v-container style="max-width: 1500px;">
      <v-row
        no-gutters
      >
          <v-col v-for="([title, subTitle, url], i) in lists" :key="i" cols="12" sm="6" md="4" lg="3" class="px-2 pt-3">
            <menu-card
              :title="title"
              :subTitle="subTitle"
              :url="url"
            ></menu-card>
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
import MenuCard from '@/components/dashboard/MenuCard.vue'

export default {
  name: 'Main',

  components: {
    MainNodeLink,
    MainSlurm,
    Node,
    MenuCard,
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters({
      mass_url: 'url/mass_url',
      rancher_url: 'url/rancher_url',
      database_url: 'url/database_url',
    }),
    lists() {
      return [
        ['MAAS', '고성능 머신 관리', this.mass_url],
        ['Rancher', '클러스터 노드 관리', this.rancher_url],
        ['DATABASE', '데이터베이스 분석', this.database_url],
        ['경기 안양', '경기 안양 클러스터 정보', '/cluster1'],
        ['경기 성남', '경기 성남 클러스터 정보', '/cluster2'],
        ['PBS Monitoring', '노드, Job, CPU, Memory 정보', '/pbs-monitoring'],
        ['Process', '프로세스 진행 상태 정보', 'process'],
        ['Admin Console', '노드에 관리자로 접속', '/admin-console'],
        ['Alarm', '모니터링 알람 정보', '/alarm'],
      ]
    } 
  },

  created() {
    console.log('CALL created()')
  },

  methods:{
    ...mapMutations({
      // setTest: 'test/setTest'
    }),
    ...mapActions({
    }),
  },

  beforeDestroy () {
  }
}
</script>
<style lang="scss">
@media (min-width: 1264px) {
  .container {
    max-width: 2000px;
  }
}

.opacity07 {
  opacity: 0.7;
}
</style>
