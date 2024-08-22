<template>
  <v-card>
    <v-card-title>작업 등록</v-card-title>
    <v-card-text>
      <!-- <v-text-field label="작업 이름" variant="underlined"></v-text-field> -->
      <v-radio-group v-model="job_control" class="" inline>
        <v-spacer></v-spacer>
        <v-radio label="경기 안양" value="Job_control"></v-radio>
        <v-radio label="Cloud(Azure)" value="hpc_Job_control"></v-radio>
      </v-radio-group>
      <v-select
        label="이미지 선택"
        v-model="selectImage"
        item-title="name"
        item-value="name"
        :items="images"
        variant="underlined"
      ></v-select>
      <v-row justify="center">
        <v-col class="v-col-4"
          ><v-text-field
            v-model="resource_cpu"
            :rules="cpuRules"
            label="CPU"
            variant="underlined"
          ></v-text-field
        ></v-col>
        <v-col class="v-col-8">
          <v-slider
            v-model="resource_cpu"
            append-icon="mdi-plus"
            prepend-icon="mdi-minus"
            :min="1"
            :max="max_cpu"
            :step="1"
            thumb-label
            class="pt-3"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="v-col-4"
          ><v-text-field
            v-model="resource_node"
            :rules="nodeRules"
            label="NODE"
            variant="underlined"
          ></v-text-field
        ></v-col>
        <v-col class="v-col-8">
          <v-slider
            v-model="resource_node"
            append-icon="mdi-plus"
            prepend-icon="mdi-minus"
            :min="1"
            :max="max_node"
            :step="1"
            thumb-label
            class="pt-3"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="v-col-4">
          <v-text-field
            v-model="resource_mem"
            :rules="memRules"
            label="Memory"
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col class="v-col-8">
          <v-slider
            v-model="resource_mem"
            append-icon="mdi-plus"
            prepend-icon="mdi-minus"
            :min="1"
            :max="max_mem"
            :step="1"
            thumb-label
            class="pt-3"
          ></v-slider>
        </v-col>
      </v-row>
      <!-- <v-file-input
        label="File input"
        variant="underlined"
        @change="onFileChange"
      ></v-file-input> -->
      <v-file-input
        label="accession file"
        variant="underlined"
        @change="onFileChange1"
      ></v-file-input>
      <v-file-input
        label="oligo file"
        variant="underlined"
        @change="onFileChange2"
      ></v-file-input>
      <v-file-input
        label="parameter file"
        variant="underlined"
        @change="onFileChange3"
      ></v-file-input>
      <v-file-input
        label="multiple file"
        variant="underlined"
        multiple
        @change="onFilesChange"
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="dialogClose">닫기</v-btn>
      <v-btn color="primary" @click="createJob">확인</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CreateJob",
  props: {
    hpc_data: Object,
    max_cpu: Number,
    max_node: Number,
    max_mem: Number,
  },
  data() {
    return {
      selectImage: null,
      resource_cpu: 0,
      resource_node: 0,
      resource_mem: 0,
      job_control: "Job_control",
      cpuRules: [
        (value) => {
          if (value > 0 && value <= this.max_cpu) return true;
          return `CPU 설정범위는 1 ~ ${this.max_cpu} 입니다.`;
        },
      ],
      nodeRules: [
        (value) => {
          if (value > 0 && value <= this.max_node) return true;
          return `nodes 설정범위는 1 ~ ${this.max_node} 입니다.`;
        },
      ],
      memRules: [
        (value) => {
          if (value > 0 && value <= this.max_mem) return true;
          return `메모리 설정범위는 1 ~ ${this.max_mem} 입니다.`;
        },
      ],
      // file: null,
      file1: null,
      file2: null,
      file3: null,
      files: [],
    };
  },
  computed: {
    images() {
      return this.$store.state.docker.images;
    },
  },
  methods: {
    createJob() {
      let data = {
        selectImage: this.selectImage,
        resource_cpu: this.resource_cpu,
        resource_node: this.resource_node,
        resource_mem: this.resource_mem,
        job_control: this.job_control,
        // file: this.file,
        file1: this.file1,
        file2: this.file2,
        file3: this.file3,
        files: this.files,
      };
      this.$emit("createJobEvent", data);
    },
    dialogClose() {
      this.$emit("dialogCloseEvent");
    },
    // onFileChange(event) {
    //   console.log(event.target.files[0]);
    //   this.file = event.target.files[0];
    // },
    onFileChange1(event) {
      console.log(event.target.files[0]);
      this.file1 = event.target.files[0];
    },
    onFileChange2(event) {
      console.log(event.target.files[0]);
      this.file2 = event.target.files[0];
    },
    onFileChange3(event) {
      console.log(event.target.files[0]);
      this.file3 = event.target.files[0];
    },
    onFilesChange(event) {
      console.log(event.target.files);
      this.files = event.target.files;
    },
  },
  mounted() {
    this.resource_cpu = this.hpc_data.resource_cpu;
    this.resource_node = this.hpc_data.resource_node;
    this.resource_mem = this.hpc_data.resource_mem;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.select {
  background-color: #42a5f5;
  color: #ffffff;
}
</style>
