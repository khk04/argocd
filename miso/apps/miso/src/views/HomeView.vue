<template>
  <div class="home">
    <v-layout class="rounded rounded-md">
      <v-app-bar color="blue-darken-4 px-2" density="compact">
        <v-app-bar-title class="text-left">Juxtagene</v-app-bar-title>
        <v-spacer></v-spacer>
        &nbsp;&nbsp;&nbsp;{{ nickName }}&nbsp;&nbsp;&nbsp;
        <v-btn
          v-if="admin"
          class="mr-2"
          variant="outlined"
          router-link
          to="/admin"
          >관리자페이지링크</v-btn
        >
        <v-btn variant="outlined" @click="handleLogout">Logout</v-btn>
      </v-app-bar>

      <v-navigation-drawer location="right" class="pa-1">
        <v-list>
          <v-list-item title="작업 현황"></v-list-item>
        </v-list>
        <div class="jab-state-height pt-3">
          <div class="pb-3">&nbsp;{{ hpc_data.job_name }}&nbsp;</div>
          <jab-state :job_status="job_status" :progress="progress"></jab-state>
        </div>
        <div class="text-center">
          <v-btn
            :disabled="!isSetup"
            :loading="loading"
            block
            class="text-none mt-1"
            color="yellow-darken-4"
            size="x-large"
            variant="flat"
            @click="dialogEditJob = true"
          >
            설정
          </v-btn>
          <v-btn
            :disabled="!isRun"
            :loading="loading"
            block
            class="text-none mt-1"
            color="blue-accent-3"
            size="x-large"
            variant="flat"
            @click="runJobFun"
          >
            실행
          </v-btn>

          <v-btn
            :disabled="!isStop"
            block
            class="text-none mt-1"
            color="grey-darken-3"
            size="x-large"
            variant="flat"
            @click="stopJobFun"
          >
            종료
          </v-btn>
          <v-btn
            :disabled="!isDownload"
            block
            class="text-none mt-1"
            color="indigo-darken-3"
            size="x-large"
            variant="flat"
            @click="fileListFun"
          >
            다운로드
          </v-btn>
        </div>
      </v-navigation-drawer>
      <v-navigation-drawer
        v-if="true"
        location="right"
        class="pa-0 pt-1"
        width="290"
      >
        <v-list>
          <v-list-item title="작업 목록"></v-list-item>
        </v-list>
        <v-tabs v-model="jobTab" bg-color="white" color="primary">
          <v-tab value="one">준비</v-tab>
          <v-tab value="two">확인</v-tab>
          <v-tab value="three">완료</v-tab>
        </v-tabs>
        <hr />
        <v-window v-model="jobTab" class="pa-1">
          <v-window-item value="one">
            <v-btn
              class="mt-4"
              width="100%"
              variant="outlined"
              @click="dialogSelectJob = true"
              ><v-icon icon="mdi-plus"></v-icon>작업 추가</v-btn
            >
            <ready-job-list
              :jobs="readyJobs"
              :selectJobName="selectJobName"
              @selectReadyJobEvent="selectReadyJobEvent"
            ></ready-job-list>
          </v-window-item>
          <v-window-item value="two">
            <run-job-list
              :jobs="runJobs"
              :selectJobName="selectJobName"
              @selectRunJobEvent="selectRunJobEvent"
            ></run-job-list>
          </v-window-item>
          <v-window-item value="three">
            <job-list
              :jobs="jobs"
              :selectJobName="selectJobName"
              @selectJobEvent="selectJobEvent"
            ></job-list>
          </v-window-item>
        </v-window>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center">
        <v-row no-gutters class="flex-nowrap bg-surface-variant">
          <v-col cols="12" v-if="true" class="flex-grow-0 flex-shrink-0">
            <v-card
              ><v-tabs
                v-model="favoritesTab"
                class="tab-width"
                bg-color="blue"
                center-active
              >
                <v-tab
                  v-for="n in favorites.length"
                  :key="n"
                  :value="n"
                  @click="selectFavorites(favorites.item[n - 1])"
                >
                  {{ favorites.item[n - 1] }}
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="delFavorites(favorites.item[n - 1])"
                  >
                  </v-btn>
                </v-tab>
              </v-tabs>
            </v-card>
            <console-log ref="consoleLogRef" :runImage="runImage"></console-log>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>

    <v-dialog v-model="dialogSelectJob" width="600">
      <select-job
        @selectJobEvent="selectJobFun"
        @dialogCloseEvent="dialogSelectJob = false"
      ></select-job>
    </v-dialog>

    <v-dialog v-model="dialogCreateJob" width="600">
      <create-job
        :hpc_data="hpc_data"
        :max_cpu="max_cpu"
        :max_node="max_node"
        :max_mem="max_mem"
        @createJobEvent="createJobFun"
        @dialogCloseEvent="dialogCreateJob = false"
      ></create-job>
    </v-dialog>

    <v-dialog v-model="dialogEditJob" width="600">
      <edit-job
        :hpc_data="hpc_data"
        :max_cpu="max_cpu"
        :max_node="max_node"
        :max_mem="max_mem"
        :image="selectImage"
        @editJobEvent="editJobFun"
        @dialogCloseEvent="dialogEditJob = false"
      ></edit-job>
    </v-dialog>

    <v-dialog v-model="dialogDownloadFiles" width="600">
      <download-files
        :fileList="fileList"
        :filePath="downloadPath"
        @downloadFileEvent="downloadFun"
        @dialogCloseEvent="dialogDownloadFiles = false"
      ></download-files>
    </v-dialog>
    <v-snackbar
      v-model="alert.view"
      color="yellow-darken-4"
      elevation="24"
      :timeout="alert.timeout"
    >
      {{ alert.text }}

      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="alert.view = false">
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { mapGetters, mapActions } from "vuex";
import { saveAs } from "file-saver";

// @ is an alias to /src
// import DockerImages from "@/components/DockerImages.vue";
import JobList from "@/components/JobList.vue";
import ReadyJobList from "@/components/ReadyJobList.vue";
import RunJobList from "@/components/RunJobList.vue";
import ConsoleLog from "@/components/ConsoleLog.vue";
import JabState from "@/components/JabState.vue";

import SelectJob from "@/components/SelectJob.vue";
import CreateJob from "@/components/CreateJob.vue";
import EditJob from "@/components/EditJob.vue";
import DownloadFiles from "@/components/DownloadFiles.vue";

export default {
  name: "HomeView",
  components: {
    // DockerImages,
    JobList,
    ReadyJobList,
    RunJobList,
    ConsoleLog,
    JabState,
    SelectJob,

    CreateJob,
    EditJob,
    DownloadFiles,
  },
  data: () => ({
    loading: false,
    isSetup: false,
    isRun: false,
    isStop: false,
    isDownload: false,
    jobTab: null,
    favoritesTab: null,
    favorites: {
      item: [],
      length: 0,
    },
    logoutInProgress: false,
    userName: null,
    nickName: null,
    selectImage: null,
    selectJobName: null,
    runImage: null,
    intervalId: null,
    dialogSelectJob: false,
    dialogCreateJob: false,
    dialogEditJob: false,
    dialogDownloadFiles: false,
    dialogSelectImage: false,
    dialogUpload: false,
    updateConsoleState: false,
    file_count: 0,
    // items: [
    //   { name: "ksskor/test1:0.1", id: 1 },
    //   { name: "ksskor/test1:0.2", id: 2 },
    //   { name: "ksskor/test1:0.3", id: 3 },
    // ],
    file: null,
    jsonData: {
      key1: "",
      key2: "",
    },
    job_status: { status: "", value: 0, color: "#FFD600" },
    checkStatus: null,
    hpc_data: {
      // topic_name: "Job_control",
      jobName: "",
      user_name: "",
      resource_cpu: 0,
      resource_node: 0,
      resource_mem: 0,
      max_cpu: 0,
      max_node: 0,
      max_mem: 0,
      job_name: "",
      // job_cmd: [
      //   "docker container run -i ",
      //   "-v /juxtagene/result/multiTOM/$HOSTNAME:/app/res ",
      //   "--net=host ",
      //   "docker.juxtagene.com/multitom-ci-cd:latest",
      // ],
      outfile_path: "/juxtagene/logs/pbs/out/",
      cmd: "job_run",
      docker_image: "",
      upload: "",
      download: "",
      downloadPath: "",
      statusCheck: false,
    },
    tempCpu: 0,
    tempCpuRules: [
      (value) => {
        if (value > 0 && value < 30) return true;
        return "CPU 설정범위는 1 ~ 30 입니다.";
      },
    ],
    tempNode: 0,
    tempNodeRules: [
      (value) => {
        if (value > 0 && value < 30) return true;
        return "NODE 설정범위는 1 ~ 30 입니다.";
      },
    ],
    tempMem: 0,
    tempMemRules: [
      (value) => {
        if (value > 0 && value < 200000) return true;
        return "메모리 설정범위는 1 ~ 200000 입니다.";
      },
    ],
    alert: {
      view: false,
      timeout: 30000,
      text: "",
    },
  }),
  async created() {
    console.log("created()");
    this.checkAuth();
    this.userName = this.$store.state.auth.username;
    console.log(this.$store.state);
    this.$store.commit("kafka/setLog", "");
    this.$store.commit("kafka/setProgress", 0);

    await this.getImages(this.userName);
    await this.getReadyJobs(this.userName);
    await this.getRunJobs(this.userName);
    await this.getJobList(this.userName);
    await this.getUser(this.userName);
    this.nickName = this.$store.state.user.user.nickname;
    this.max_cpu = this.$store.state.user.user.cpu;
    this.max_node = this.$store.state.user.user.node;
    this.max_mem = this.$store.state.user.user.memory;

    // console.log(this.jobs);
  },
  watch: {
    loading(val) {
      if (!val) return;
      // setTimeout(() => (this.loading = false), 2000);
    },
    // favorites(val) {
    //   console.log("favorites(val)");
    //   console.log(val);
    //   console.log(this.favorites.length);
    //   this.favorites.length = val - 1;
    // },
  },
  computed: {
    ...mapGetters({
      images: "docker/images",
      status: "kafka/status",
    }),
    // images() {
    //   return this.$store.state.docker.images;
    // },
    admin() {
      return this.$store.state.user.user.admin;
    },
    readyJobs() {
      return this.$store.state.readyJob.readyJobs;
    },
    readyJob() {
      return this.$store.state.readyJob.readyJob;
    },
    runJobs() {
      return this.$store.state.runJob.runJobs;
    },
    runJob() {
      return this.$store.state.runJob.runJob;
    },
    jobs() {
      return this.$store.state.kafka.jobs;
    },
    jobInfo() {
      return this.$store.state.kafka.jobInfo;
    },
    status() {
      return this.$store.state.kafka.status;
    },
    progress() {
      console.log(this.$store.state.kafka.progress);
      return Math.floor(this.$store.state.kafka.progress * 100) / 100;
    },
    fileList() {
      return this.$store.state.file.fileList;
    },
    filePath() {
      return this.$store.state.file.filePath;
    },
    fileCount() {
      return this.$store.state.file.fileCount;
    },
  },
  methods: {
    ...mapActions({
      checkToken: "auth/checkToken",
      logout: "auth/logout", // 'auth/logout' 액션을 'logout' 메서드로 매핑합니다.
      getUser: "user/getUser",

      infoInit: "kafka/infoInit",
      getReadyJobs: "readyJob/getJobs",
      getReadyJob: "readyJob/getJob",
      createJob: "readyJob/createJob",
      updateJob: "readyJob/updateJob",
      deleteReadyJob: "readyJob/deleteJob",

      getRunJobs: "runJob/getJobs",
      getRunJob: "runJob/getJob",
      deleteRunJob: "runJob/deleteJob",

      getImages: "docker/getImages",
      sendKafkaTopic: "kafka/sendKafkaTopic",
      getLog: "kafka/getLog",
      getStatus: "kafka/getStatus",
      getJobList: "kafka/getJobList",
      getJobInfo: "kafka/getJobInfo",
      uploadFile: "file/uploadFile",
      downloadFile: "file/downloadFile",
      getFileList: "file/getFileList",
      getFileCount: "file/getFileCount",
    }),
    checkAuth() {
      this.checkToken();
    },
    async handleLogout() {
      if (this.logoutInProgress) {
        return;
      }

      this.logoutInProgress = true;

      try {
        // 로그아웃을 시도합니다.
        await this.logout();

        // 로그아웃이 성공한 경우에는 홈 화면으로 이동하도록 설정합니다.
        this.$router.push({ path: "/login" });
      } catch (error) {
        // 로그아웃 도중 에러가 발생한 경우 에러 메시지를 표시하거나 적절한 액션을 취합니다.
        console.error("로그아웃 도중 에러가 발생했습니다.", error);
      }
    },
    btnInit() {
      this.isSetup = false;
      this.isRun = false;
      this.isStop = false;
      this.isDownload = false;
    },
    logInit() {
      this.infoInit();
      this.$refs.consoleLogRef.clearTerminal();
    },
    addFavorites(jobName) {
      toRaw(this.favorites.item).push(jobName);
      toRaw(this.favorites.length++);
      this.favoritesTab = this.favorites.length;
    },
    delFavorites(jobName) {
      const findIndex = toRaw(this.favorites.item).indexOf(jobName);
      if (findIndex !== -1) {
        toRaw(this.favorites.item).splice(findIndex, 1);
        let length = toRaw(this.favorites.length--);
        this.favoritesTab = length;
      }
    },
    async selectFavorites(jobName) {
      console.log("selectFavorites(jobName)");
      console.log(jobName);
      let job_state = "end";
      await this.getReadyJob(jobName);
      job_state = this.readyJob.job_state;

      console.log("selectFavorites(jobName)1");
      console.log(job_state);
      if (job_state === "ready") {
        this.selectReadyJob(jobName);
        this.jobTab = "one";
      } else if (this.readyJob.job_state === "run") {
        this.selectRunJob(jobName);
        this.jobTab = "two";
      } else {
        this.selectJob(jobName);
        this.jobTab = "three";
      }
      console.log("selectFavorites(jobName)2");
    },
    uniqueNameGen() {
      // this.hpc_data.docker_image에서 dockerimage name과 tag 분리 후 ':'와 '.'을 '_'로 변경
      const dockerImageTagChange = this.hpc_data.docker_image
        .split("/")
        .pop()
        .replace(/[:.]/g, "_");
      console.log("dockerImageTagChange: ", dockerImageTagChange);
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const uniqueName = `${randomNum}_${dockerImageTagChange}`;
      this.hpc_data.job_name = uniqueName;
    },
    jobcommandGen() {
      let uniqueName = this.hpc_data.job_name;
      let userName = this.hpc_data.user_name;
      const containerName = `--name=${uniqueName} `;
      const resultDir = `-v /juxtagene/home/${userName}/projects/${uniqueName}/result:/app/res `;
      const inputDir = `-v /juxtagene/home/${userName}/projects/${uniqueName}/input:/app/input `;
      const checkDir = `-v /juxtagene/home/${userName}/projects/${uniqueName}/chk:/app/chk `;
      const tempDir = `-v /juxtagene/home/${userName}/projects/${uniqueName}/tmp:/app/tmp `;
      const tmp_job_cmd = [
        "docker run --tty --rm ",
        containerName,
        resultDir,
        inputDir,
        checkDir,
        tempDir,
        "--net=host ",
        this.hpc_data.docker_image,
      ];
      this.hpc_data.job_cmd = tmp_job_cmd;
    },
    async selectReadyJobEvent(job_name) {
      let index = toRaw(this.favorites.item).indexOf(job_name);
      if (index === -1) {
        this.addFavorites(job_name);
      }
      this.selectReadyJob(job_name);
    },
    async selectReadyJob(job_name) {
      this.btnInit();
      this.logInit();
      this.loading = true;
      this.isSetup = true;
      this.isRun = true;
      this.updateConsoleState = false;
      this.statusCheck = false;
      let filePath = "/app/userhome/tmp/" + job_name + "/in";
      let directoryPath = {
        directorypath: filePath,
      };
      this.getFileCount(directoryPath);

      await this.getReadyJob(job_name);
      this.selectImage = this.readyJob.image;
      this.hpc_data.id = this.readyJob.id;
      this.hpc_data.user_name = this.readyJob.user_name;
      this.hpc_data.resource_cpu = this.readyJob.cpu;
      this.hpc_data.resource_node = this.readyJob.node;
      this.hpc_data.resource_mem = this.readyJob.memory;
      this.hpc_data.docker_image = this.readyJob.image;
      this.hpc_data.job_name = job_name;
      this.hpc_data.outfile_path = "/juxtagene/logs/pbs/out/";
      this.hpc_data.job_state = "ready";
      this.file_count = this.readyJob.file_count;
      this.jobcommandGen();
      this.selectJobName = job_name;
    },
    async selectRunJobEvent(job_name) {
      let index = toRaw(this.favorites.item).indexOf(job_name);
      if (index === -1) {
        this.addFavorites(job_name);
      }
      this.selectRunJob(job_name);
    },
    async selectRunJob(job_name) {
      this.btnInit();
      this.logInit();
      this.isStop = true;
      this.statusCheck = false;
      this.hpc_data.job_name = job_name;
      this.selectJobName = job_name;
      console.log(job_name);
      await this.getJobInfo(job_name);
      await this.getRunJob(job_name);
      console.log(this.jobInfo);
      this.updateConsoleState = true;
      if (this.jobInfo.flow_state === "job_end") {
        let end_job = {
          id: this.runJob.id,
        };

        await this.deleteRunJob(end_job);
        await this.getJobList(this.hpc_data.user_name);
        await this.getRunJobs(this.hpc_data.user_name);
        this.btnInit();
        this.logInit();
        this.isDownload = true;
        this.jobTab = "three";
        this.updateConsoleState = false;
      }
      this.updateConsoleState = true;
    },

    async selectJobEvent(job_name) {
      let index = toRaw(this.favorites.item).indexOf(job_name);
      if (index === -1) {
        this.addFavorites(job_name);
      }
      this.selectJob(job_name);
    },
    async selectJob(job_name) {
      this.btnInit();
      this.logInit();
      this.isStop = true;
      this.isDownload = true;
      this.statusCheck = true;
      // this.getLog(this.jobInfo.job_name);
      // this.getStatus(this.jobInfo.job_name);

      // console.log(job_name);
      await this.getJobInfo(job_name);
      console.log(this.jobInfo);
      this.hpc_data.user_name = this.jobInfo.user_name;
      this.hpc_data.resource_cpu = this.jobInfo.resource_cpu;
      this.hpc_data.resource_node = this.jobInfo.resource_node;
      this.hpc_data.resource_mem = this.jobInfo.resource_mem;
      this.hpc_data.docker_image = this.jobInfo.docker_image;
      this.hpc_data.job_name = job_name;
      this.hpc_data.outfile_path = "/juxtagene/logs/pbs/out/";
      this.hpc_data.job_state = "";
      this.jobcommandGen();
      this.selectJobName = job_name;
      this.updateConsoleState = true;
    },
    async initJob() {
      this.job_status = { status: "", value: 0, color: "#E0E0E0" };
      this.$refs.consoleLogRef.clearTerminal();
      // this.hpc_data.resource_node = 1;
      if (this.$store.state.user.user.name == undefined) {
        this.hpc_data.user_name = "test user01";
      } else {
        this.hpc_data.user_name = this.$store.state.user.user.name;
      }

      if (this.$store.state.user.user.cpu == undefined) {
        this.hpc_data.resource_cpu = 0;
      } else {
        this.hpc_data.resource_cpu = this.$store.state.user.user.cpu;
      }

      if (this.$store.state.user.user.node == undefined) {
        this.hpc_data.resource_node = 0;
      } else {
        this.hpc_data.resource_node = this.$store.state.user.user.node;
      }

      if (this.$store.state.user.user.memory == undefined) {
        this.hpc_data.resource_mem = 0;
      } else {
        this.hpc_data.resource_mem = this.$store.state.user.user.memory;
      }

      console.log(this.hpc_data);
      this.dialogCreateJob = true;
    },

    selectJobFun(jobName) {
      this.dialogSelectJob = false;
      if (jobName === "SCT") {
        this.initJob();
      }
    },
    async createJobFun(data) {
      this.$store.commit("file/setFileCount", 0);
      this.btnInit();
      this.logInit();
      this.isSetup = true;
      this.isRun = true;
      let file_count = 0;
      console.log(data);
      if (data.job_control === null) {
        console.log("this.job_control === 'null'");
        console.log(this.job_control);
        this.alert = {
          view: true,
          timeout: 3000,
          text: "작업을 수행하기 위한 환경 선택이 안되어 있습니다.",
        };
      } else if (data.selectImage === null) {
        console.log("this.runImage === 'docker.juxtagene.com/null'");
        console.log(this.runImage);
        this.alert = {
          view: true,
          timeout: 3000,
          text: "작업을 수행하기 위한 이미지 선택이 안되어 있습니다.",
        };
      } else {
        this.selectImage = data.selectImage;
        this.hpc_data.resource_cpu = data.resource_cpu;
        this.hpc_data.resource_node = data.resource_node;
        this.hpc_data.resource_mem = data.resource_mem;
        this.hpc_data.job_control = data.job_control;

        this.job_status = { status: "", value: 0, color: "#E0E0E0" };
        this.$refs.consoleLogRef.clearTerminal();
        this.hpc_data.docker_image = `docker.juxtagene.com/${this.selectImage}`;
        this.hpc_data.outfile_path = "/juxtagene/logs/pbs/out/";
        // this.uniqueNameGen(this.hpc_data.docker_image);
        this.uniqueNameGen();
        this.jobcommandGen();
        this.hpc_data.upload = "tmp/" + this.hpc_data.job_name + "/in/";
        this.hpc_data.download = "tmp/" + this.hpc_data.job_name + "/out/";
        this.hpc_data.job_state = "ready";
        this.hpc_data.file_name1 = "null";
        this.hpc_data.file_name2 = "null";
        this.hpc_data.file_name3 = "null";

        if (data.file1 !== null) {
          this.uploadFun(data.file1);
          this.hpc_data.file_name1 = data.file1.name;
          file_count++;
        }
        if (data.file2 !== null) {
          this.uploadFun(data.file2);
          this.hpc_data.file_name2 = data.file2.name;
          file_count++;
        }
        if (data.file3 !== null) {
          this.uploadFun(data.file3);
          this.hpc_data.file_name3 = data.file3.name;
          file_count++;
        }

        // 다중 파일 처리
        if (data.files.length > 0) {
          this.uploadFuns(data.files);
          file_count = file_count + data.files.length;
        }

        let ready_job = {
          job_name: this.hpc_data.job_name,
          user_name: this.hpc_data.user_name,
          cpu: this.hpc_data.resource_cpu,
          node: this.hpc_data.resource_node,
          memory: this.hpc_data.resource_mem,
          image: this.hpc_data.docker_image,
          job_state: this.hpc_data.job_state,
          file_count: file_count,
          file_name1: this.hpc_data.file_name1,
          file_name2: this.hpc_data.file_name2,
          file_name3: this.hpc_data.file_name3,
          job_control: this.hpc_data.job_control,
        };
        console.log(ready_job);

        await this.createJob(ready_job);
        await this.getReadyJobs(this.hpc_data.user_name);
        await this.getReadyJob(this.hpc_data.job_name);
        this.selectJobName = this.hpc_data.job_name;
        this.updateConsoleState = false;
        this.file_count = file_count;
        this.loading = true;
        this.dialogCreateJob = false;
      }
    },

    // 설정 버튼 클릭시
    async editJobFun(data) {
      this.$store.commit("file/setFileCount", 0);
      this.btnInit();
      this.logInit();
      this.isSetup = true;
      this.isRun = true;
      let file_count = 0;
      this.selectImage = data.selectImage;
      this.hpc_data.resource_cpu = data.resource_cpu;
      this.hpc_data.resource_node = data.resource_node;
      this.hpc_data.resource_mem = data.resource_mem;
      this.hpc_data.job_control = data.job_control;

      this.job_status = { status: "", value: 0, color: "#E0E0E0" };
      this.$refs.consoleLogRef.clearTerminal();
      this.hpc_data.docker_image = `docker.juxtagene.com/${this.selectImage}`;
      this.hpc_data.outfile_path = "/juxtagene/logs/pbs/out/";
      this.hpc_data.job_state = "ready";
      // this.uniqueNameGen(this.hpc_data.docker_image);
      // this.jobcommandGen();
      if (data.file1 !== null) {
        this.uploadFun(data.file1);
        this.hpc_data.file_name1 = data.file1.name;
        file_count++;
      }
      if (data.file2 !== null) {
        this.uploadFun(data.file2);
        this.hpc_data.file_name2 = data.file2.name;
        file_count++;
      }
      if (data.file3 !== null) {
        this.uploadFun(data.file3);
        this.hpc_data.file_name3 = data.file3.name;
        file_count++;
      }

      // 다중 파일 처리
      if (data.files.length > 0) {
        this.uploadFuns(data.files);
        file_count = file_count + data.files.length;
      }

      let ready_job = {
        id: this.hpc_data.id,
        job_name: this.hpc_data.job_name,
        user_name: this.hpc_data.user_name,
        cpu: this.hpc_data.resource_cpu,
        node: this.hpc_data.resource_node,
        memory: this.hpc_data.resource_mem,
        image: this.hpc_data.docker_image,
        job_state: this.hpc_data.job_state,
        file_name1: this.hpc_data.file_name1,
        file_name2: this.hpc_data.file_name2,
        file_name3: this.hpc_data.file_name3,
        job_control: this.hpc_data.job_control,
        upload: this.hpc_data.upload,
      };

      await this.updateJob(ready_job);
      await this.getReadyJobs(this.hpc_data.user_name);
      await this.getReadyJob(this.hpc_data.job_name);
      this.selectJobName = this.hpc_data.job_name;
      this.updateConsoleState = false;
      this.file_count = file_count;
      this.loading = true;
      this.dialogEditJob = false;
    },

    async runJobFun() {
      let parameter = "";

      if (this.hpc_data.file_name1 !== "null") {
        parameter += `-a ${this.hpc_data.file_name1} `;
      }
      if (this.hpc_data.file_name2 !== "null") {
        parameter += `-o ${this.hpc_data.file_name2} `;
      }
      if (this.hpc_data.file_name3 !== "null") {
        parameter += `-p ${this.hpc_data.file_name3} `;
      }
      // this.hpc_data.job_parameter = `-a ${this.hpc_data.file_name1} -o ${this.hpc_data.file_name2} -p ${this.hpc_data.file_name3}`;
      this.hpc_data.job_parameter = parameter;
      console.log(this.hpc_data.job_parameter);
      // console.log("Sending data to Kafka topic:", this.hpc_data);
      await this.sendKafkaTopic(this.hpc_data);
      this.runImage = this.selectImage;

      console.log(this.selectImage);

      this.updateConsoleState = true;
      if (this.hpc_data.job_state === "ready") {
        let ready_job = {
          id: this.readyJob.id,
          job_name: this.hpc_data.job_name,
          user_name: this.hpc_data.user_name,
          cpu: this.hpc_data.resource_cpu,
          node: this.hpc_data.resource_node,
          memory: this.hpc_data.resource_mem,
          image: this.hpc_data.docker_image,
          job_state: "run",
          file_name1: this.hpc_data.file_name1,
          file_name2: this.hpc_data.file_name2,
          file_name3: this.hpc_data.file_name3,
          job_control: this.hpc_data.job_control,
        };

        await this.updateJob(ready_job);
        await this.getReadyJobs(this.hpc_data.user_name);
        await this.getRunJobs(this.hpc_data.user_name);
        await this.getJobList(this.hpc_data.user_name);
        this.btnInit();
        this.logInit();
        this.isStop = true;
        this.jobTab = "two";
      }

      this.dialog = false;
    },
    async stopJobFun() {
      this.hpc_data.cmd = "job_del";
      await this.sendKafkaTopic(this.hpc_data);

      let end_job = {
        id: this.runJob.id,
      };
      await this.deleteRunJob(end_job);
      await this.getJobList(this.hpc_data.user_name);
      await this.getRunJobs(this.hpc_data.user_name);
    },
    close() {
      this.dialog = false;
    },
    editFun() {
      // console.log(this);
    },
    uploadFun(file) {
      // console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_name", this.hpc_data.job_name);
      this.uploadFile(formData);
    },

    // 다중 파일 처리
    uploadFuns(files) {
      // console.log(files);
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("job_name", this.hpc_data.job_name);
        this.uploadFile(formData);
      }
    },

    async fileListFun() {
      console.log("fileListFun()");
      let filePath =
        "/app/userhome/tmp/" + this.hpc_data.job_name + "/out/result";

      this.downloadPath = filePath;

      console.log(filePath);
      // /app/userhome/tmp/240227_ksskor_103/out

      let directoryPath = {
        directorypath: filePath,
      };
      this.getFileList(directoryPath);

      this.dialogDownloadFiles = true;
    },

    async downloadFun(fileInfo) {
      console.log(fileInfo);

      if (fileInfo.fileType === "file") {
        this.hpc_data.download = fileInfo.fileName;
        const response = await this.downloadFile(fileInfo);
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        // Save the file with the specified name using the FileSaver API
        saveAs(blob, fileInfo.fileName);
      }

      if (fileInfo.fileType === "dir") {
        let filePath = fileInfo.filePath + "/" + fileInfo.fileName;

        this.downloadPath = filePath;

        console.log(filePath);
        // /app/userhome/tmp/240227_ksskor_103/out

        let directoryPath = {
          directorypath: filePath,
        };
        this.getFileList(directoryPath);
      }

      // filePath: this.filePath,
      //   fileName: item.name,
      //   fileType: item.type,
    },
  },
  mounted() {
    console.log("mounted()");
    this.intervalId = setInterval(() => {
      if (!this.$store.state.auth.auth) {
        this.$router.push({ path: "/login" });
      }
      if (this.file_count > this.fileCount) {
        console.log(this.file_count);
        console.log(this.fileCount);
        this.loading = true;
      } else {
        this.loading = false;
      }
      if (this.updateConsoleState == true) {
        this.getLog(this.hpc_data.job_name);
        this.getStatus(this.hpc_data.job_name);
        this.getJobList(this.userName);

        this.job_status = { status: "", color: "#E0E0E0" };

        console.log(this.status.content);
        if (this.status.content === "job_summited") {
          this.job_status = { status: "제출", color: "#FFD600" };
        }
        if (this.status.content === "job_ready") {
          this.job_status = { status: "사전준비", color: "#FFD600" };
        }
        if (this.status.content === "job_queued") {
          this.job_status = { status: "자원대기", color: "#FFD600" };
        }
        if (this.status.content === "job_running") {
          this.job_status = {
            status: "작업수행",
            color: "#03A9F4",
          };
        }
        if (this.status.content === "job_done") {
          this.job_status = {
            status: "작업종료",
            color: "#0277BD",
          };
          this.statusCheck = true;
        }
        if (this.status.content === "job_end") {
          this.job_status = {
            status: "작업완료",
            color: "#01579B",
          };
          console.log("job_end");
          this.statusCheck = false;
          this.updateConsoleState = false;
          this.getLog(this.hpc_data.job_name);
          this.getStatus(this.hpc_data.job_name);
          this.getJobList(this.userName);
        }
      }
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped lang="scss">
.height-element {
  height: calc(100vh - 50x);
}
.jab-state-height {
  height: calc(100vh - 345px);
}
.v-list-item {
  border-bottom: solid 1px #ddd;
  height: 48px;
}
.hover-effect:hover {
  background-color: #e0e0e0; /* Set your desired hover background color */
  cursor: pointer; /* Change cursor on hover if you want */
}
.tab-width {
  position: relative;
  width: calc(100vw - 560px);
}
</style>
