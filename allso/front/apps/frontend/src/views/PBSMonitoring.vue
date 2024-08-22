<template>
  <v-card dark>
    <v-tabs>
      <template v-for="([title, icon], i) in clustersMenu">
        <v-tab :key="i">
          <v-icon left>
            {{icon}}
          </v-icon>
          {{title}}
        </v-tab>
      </template>

        <v-tab-item key="1">
          
          <v-row>
            <v-col
              cols="12"
              md=9
              class="pa-0"
              style="background-color: grey"
            >
            <v-card flat class="pa-6 pb-12" dark color="grey darken-3">
              <v-row>
                <v-col v-for="([title, value, width, color, suffix], i) in row1"
                  :key="i"
                  cols="12"
                  :md="width"
                  class="pr-0 pb-0"
                >
                  <FaTextBox02
                    :title="title"
                    :value="value"
                    :color="color"
                    :suffix="suffix"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  md="4"
                  class="pr-0 pb-0"
                >
                  <v-card flat class="text-center pa-1 mr-1">
                    현재 작업수
                  </v-card>
                  <v-row class="px-3">
                    <v-col v-for="([title, value, width, color], i) in row21"
                      :key="i"
                      cols="12"
                      :md="width"
                      class="pr-1 pt-4 pl-0 pb-0"
                    >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="8"
                  class="pr-0 pb-0"
                >
                  <v-card flat class="text-center pa-1 mr-1">
                    서버 활용 현황
                  </v-card>
                  <v-row class="px-3">
                    <v-col  v-for="([title, value, width, color, suffix], i) in row22"
                      :key="i"
                      cols="12"
                      :md="width"
                      class="pr-1 pt-4 pl-0 pb-0"
                    >
                      <FaTextBox02
                        :title="title"
                        :value="value"
                        :color="color"
                        :suffix="suffix"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="6"
                  class="pr-0 pt-6 pl-3 pb-0"
                >
                <v-card flat class="text-center pa-1">
                  현재 CPU 사용
                </v-card>
                <v-card flat class="text-center pa-4" style="margin-top: 1px">
                  <LineChart
                    :chart-data="chartCpuDatas"
                    :height="280"
                    :max-height="330"
                  />
                </v-card>

              </v-col>
              <v-col
                  cols="6"
                  class="pr-0 pt-6 pl-3 pb-0"
                >
                <v-card flat class="text-center pa-1">
                  현재 메모리 사용
                </v-card>
                <v-card flat class="text-center pa-4" style="margin-top: 1px">
                  <LineChart
                    :chart-data="chartMemDatas"
                    :height="280"
                    :max-height="330"
                  />
                </v-card>

              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="8"
                class="pr-0 pb-0"
              >
                <v-card flat class="text-center pa-1 mr-1">
                  사용자별 PBS 작업 등록 현황 (누적)
                </v-card>
                <v-row class="px-3">
                  <v-col v-for="([title, value, width, color, suffix], i) in row31"
                    :key="i"
                    cols="12"
                    :md="width"
                    class="pr-1 pt-4 pl-0 pb-0"
                  >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="pr-0 pb-0"
              >
                <v-card flat class="text-center pa-1 mr-1">
                  사용중인 자원 현황
                </v-card>
                <v-row class="px-3">
                  <v-col v-for="([title, value, width, color, suffix], i) in row32"
                    :key="i"
                    cols="12"
                    :md="width"
                    class="pr-1 pt-4 pl-0 pb-0"
                  >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                  </v-col>
                </v-row>
              </v-col>
              
            </v-row>

            </v-card>

            </v-col>
            <v-col
              cols="12"
              md=3
              class="pa-0"
              style="background-color: #424242"
            >
              <v-card flat class="pt-6 pr-6" dark color="grey darken-3">
                <v-card flat dark class="text-center pa-1">
                  서버 상태 현황
                </v-card>
                <v-card flat dark class="text-center pa-1" min-height="343" style="margin-top: 1px">
                  <pbs-nodes
                    :nodes="pbsNodes"
                  ></pbs-nodes>
                </v-card>

                <v-card flat dark class="text-center pa-1 mt-3">
                  PBS 작업 상태 현황
                </v-card>
                <v-card flat dark class="text-center pa-1" min-height="343" style="margin-top: 1px">
                  <pbs-jobs
                    :jobs="pbsJobs.current_jobs"
                  ></pbs-jobs>
                </v-card>
              </v-card>
              
            </v-col>
          </v-row>
          
        </v-tab-item>

        <v-tab-item key="2">
          <v-row>
            <v-col
              cols="12"
              md=9
              class="pa-0"
              style="background-color: grey"
            >
            <v-card flat class="pa-6 pb-12" dark color="grey darken-3">
              <v-row>
                <v-col v-for="([title, value, width, color, suffix], i) in row12"
                  :key="i"
                  cols="12"
                  :md="width"
                  class="pr-0 pb-0"
                >
                  <FaTextBox02
                    :title="title"
                    :value="value"
                    :color="color"
                    :suffix="suffix"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  md="4"
                  class="pr-0 pb-0"
                >
                  <v-card flat class="text-center pa-1 mr-1">
                    현재 작업수
                  </v-card>
                  <v-row class="px-3">
                    <v-col v-for="([title, value, width, color], i) in row212"
                      :key="i"
                      cols="12"
                      :md="width"
                      class="pr-1 pt-4 pl-0 pb-0"
                    >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="8"
                  class="pr-0 pb-0"
                >
                  <v-card flat class="text-center pa-1 mr-1">
                    서버 활용 현황
                  </v-card>
                  <v-row class="px-3">
                    <v-col  v-for="([title, value, width, color, suffix], i) in row222"
                      :key="i"
                      cols="12"
                      :md="width"
                      class="pr-1 pt-4 pl-0 pb-0"
                    >
                      <FaTextBox02
                        :title="title"
                        :value="value"
                        :color="color"
                        :suffix="suffix"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="6"
                  class="pr-0 pt-6 pl-3 pb-0"
                >
                <v-card flat class="text-center pa-1">
                  현재 CPU 사용
                </v-card>
                <v-card flat class="text-center pa-4" style="margin-top: 1px">
                  <LineChart
                    :chart-data="chartCpuDatas2"
                    :height="280"
                    :max-height="330"
                  />
                </v-card>

              </v-col>
              <v-col
                  cols="6"
                  class="pr-0 pt-6 pl-3 pb-0"
                >
                <v-card flat class="text-center pa-1">
                  현재 메모리 사용
                </v-card>
                <v-card flat class="text-center pa-4" style="margin-top: 1px">
                  <LineChart
                    :chart-data="chartMemDatas2"
                    :height="280"
                    :max-height="330"
                  />
                </v-card>

              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="8"
                class="pr-0 pb-0"
              >
                <v-card flat class="text-center pa-1 mr-1">
                  사용자별 PBS 작업 등록 현황 (누적)
                </v-card>
                <v-row class="px-3">
                  <v-col v-for="([title, value, width, color, suffix], i) in row312"
                    :key="i"
                    cols="12"
                    :md="width"
                    class="pr-1 pt-4 pl-0 pb-0"
                  >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="pr-0 pb-0"
              >
                <v-card flat class="text-center pa-1 mr-1">
                  사용중인 자원 현황
                </v-card>
                <v-row class="px-3">
                  <v-col v-for="([title, value, width, color, suffix], i) in row322"
                    :key="i"
                    cols="12"
                    :md="width"
                    class="pr-1 pt-4 pl-0 pb-0"
                  >
                    <FaTextBox02
                      :title="title"
                      :value="value"
                      :color="color"
                      :suffix="suffix"
                    />
                  </v-col>
                </v-row>
              </v-col>
              
            </v-row>

            </v-card>

            </v-col>
            <v-col
              cols="12"
              md=3
              class="pa-0"
              style="background-color: #424242"
            >
              <v-card flat class="pt-6 pr-6" dark color="grey darken-3">
                <v-card flat dark class="text-center pa-1">
                  서버 상태 현황
                </v-card>
                <v-card flat dark class="text-center pa-1" min-height="343" style="margin-top: 1px">
                  <pbs-nodes
                    :nodes="pbsNodes2"
                  ></pbs-nodes>
                </v-card>

                <v-card flat dark class="text-center pa-1 mt-3">
                  PBS 작업 상태 현황
                </v-card>
                <v-card flat dark class="text-center pa-1" min-height="343" style="margin-top: 1px">
                  <pbs-jobs
                    :jobs="pbsJobs2.current_jobs"
                  ></pbs-jobs>
                </v-card>
              </v-card>
              
            </v-col>
          </v-row>
        </v-tab-item>
    </v-tabs>
  </v-card>    
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

//컴포넌트
import MonitoringNode from '@/components/monitoring/MonitoringNode.vue'
import MonitoringCpu from '@/components/monitoring/MonitoringCpu.vue'
import MonitoringMemory from '@/components/monitoring/MonitoringMemory.vue'
import MonitoringJobRuntime from '@/components/monitoring/MonitoringJobRuntime.vue'
import MonitoringJobs from '@/components/monitoring/MonitoringJobs.vue'
import MonitoringJobCount from '@/components/monitoring/MonitoringJobCount.vue'

import FaTextBox02 from '@/components/commons/FaTextBox02.vue'
import LineChart from '@/components/charts/LineChart.vue'

import PbsJobs from '@/components/monitoring/PbsJobs.vue'
import PbsNodes from '@/components/monitoring/PbsNodes.vue'

export default {
  name: 'PBSMonitoring',

  components: {
    MonitoringNode,
    MonitoringCpu,
    MonitoringMemory,
    MonitoringJobRuntime,
    MonitoringJobs,
    MonitoringJobCount,

    FaTextBox02,
    LineChart,

    PbsJobs,
    PbsNodes,
  },

  data () {
    return {
      nodesNone: {"node": "None", "state": 'None'},
    }
  },

  computed: {
    ...mapGetters({
      pbsNodes: 'pbs/nodes',
      pbsJobs: 'pbs/jobs',
      chartCpuDatas: 'pbs/chartCpuDatas',
      chartMemDatas: 'pbs/chartMemDatas',
      AllCpuDatas: 'pbs/AllCpuDatas',
      AllMemDatas: 'pbs/AllMemDatas',
      AllNodeDatas: 'pbs/AllNodeDatas',

      pbsNodes2: 'pbs2/nodes',
      pbsJobs2: 'pbs2/jobs',
      chartCpuDatas2: 'pbs2/chartCpuDatas',
      chartMemDatas2: 'pbs2/chartMemDatas',
      AllCpuDatas2: 'pbs2/AllCpuDatas',
      AllMemDatas2: 'pbs2/AllMemDatas',
      AllNodeDatas2: 'pbs2/AllNodeDatas',

      clustersMenu: 'menu/clustersMenu',
    }),
    row1() {
      return [
        ['PBS 작업 시간 (누적)', this.pbsJobs.ttime, '6', '#001734', '시간'],
        ['PBS 작업 수 (누적)', this.pbsJobs.tjobs, '6', '#001628', ''],
      ]
    },
    row21() {
      return [
        ['수행중', this.pbsJobs.rjobs, '6', '#582c83', ''],
        ['대기', this.pbsJobs.ijobs, '6', '#512d6d', ''],
      ]
    },
    row22() {
      return [
        ['총 서버', this.AllNodeDatas.tnodes, '3', '#330d73', ''],
        ['사용중인 서버', this.AllNodeDatas.rnodes, '3', '#211551', ''],
        ['대기중인 서버', this.AllNodeDatas.inodes, '3', '#260d54', ''],
        ['서버 사용률', this.AllNodeDatas.rate, '3', '#261a40', '%']
      ]
    },
    row31() {
      return [
        [this.pbsJobs.user_use[0].name, this.pbsJobs.user_use[0].value, '3', '#126133', ''],
        [this.pbsJobs.user_use[1].name, this.pbsJobs.user_use[1].value, '3', '#0F512C', ''],
        [this.pbsJobs.user_use[2].name, this.pbsJobs.user_use[2].value, '3', '#0D4024', ''],
        [this.pbsJobs.user_use[3].name, this.pbsJobs.user_use[3].value, '3', '#09321F', '']
      ]
    },
    row32(){
      return [
        ['CPU', this.AllCpuDatas.rcpus , '6', '#5d285f', ''],
        ['Memory', Math.round(this.AllMemDatas.rmem / 1024) , '6', '#522145', 'GB']
      ]
    },
    // pbs2
    row12() {
      return [
        ['PBS 작업 시간 (누적)', this.pbsJobs2.ttime, '6', '#a77f15', '시간'],
        ['PBS 작업 수 (누적)', this.pbsJobs2.tjobs, '6', '#a77f15', ' '],
      ]
    },
    row212() {
      return [
        ['수행중', this.pbsJobs2.rjobs, '6', '#5c4d8a', ''],
        ['대기', this.pbsJobs2.ijobs, '6', '#5c4d8a', ''],
      ]
    },
    row222() {
      return [
        ['총 서버', this.AllNodeDatas2.tnodes, '3',    '#7d8888', ''],
        ['사용중인 서버', this.AllNodeDatas2.rnodes, '3', '#7d8888', ''],
        ['대기중인 서버', this.AllNodeDatas2.inodes, '3', '#7d8888', ''],
        ['서버 사용률', this.AllNodeDatas2.rate, '3',    '#7d8888', '%']
      ]
    },
    row312() {
      return [
        [this.pbsJobs2.user_use[0].name, this.pbsJobs2.user_use[0].value, '3', '#a89d12', ''],
        [this.pbsJobs2.user_use[1].name, this.pbsJobs2.user_use[1].value, '3', '#a89d12', ''],
        [this.pbsJobs2.user_use[2].name, this.pbsJobs2.user_use[2].value, '3', '#a89d12', ''],
        [this.pbsJobs2.user_use[3].name, this.pbsJobs2.user_use[3].value, '3', '#a89d12', '']
      ]
    },
    row322(){
      return [
        ['CPU', this.AllCpuDatas2.rcpus , '6', '#6565ba', ''],
        ['Memory', Math.round(this.AllMemDatas2.rmem / 1024) , '6', '#6565ba', 'GB']
      ]
    }
  },

  created() {
    this.getData()
    this.polling = setInterval(this.getData, 5000);

    let test = this.pbsJobs.user_use[0]
    console.log(test)
  },

  methods:{
    ...mapMutations({
    }),
    ...mapActions({
      getPbsNodes: 'pbs/getPbsNodes',
      getPbsJobs: 'pbs/getPbsJobs',
      getPbsNodes2: 'pbs2/getPbsNodes',
      getPbsJobs2: 'pbs2/getPbsJobs',
    }),
    getData(){
      this.getPbsNodes()
      this.getPbsJobs()
      this.getPbsNodes2()
      this.getPbsJobs2()
      console.log("PBS1 ALLCpuDatas=", this.AllCpuDatas)
      console.log("PBS1 AllNodeDatas=", this.AllNodeDatas)
      console.log("PBS2 ALLCpuDatas2=", this.AllCpuDatas2)
      console.log("PBS2 AllNodeDatas2=", this.AllNodeDatas2)
      console.log("PBS1 pbsJobs=", this.pbsJobs)
      console.log("PBS2 pbsJobs=", this.pbsJobs2)
    },
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }

}
</script>

<style>



</style>
