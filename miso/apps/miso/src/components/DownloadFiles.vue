<template>
  <v-card variant="elevated">
    <v-card-title>다운로드 파일 목록</v-card-title>
    <hr />
    <v-card-text>
      <v-list v-if="isUupDirectory" class="pb-0">
        <v-list-item @click="upDirectory" class="pt-2"
          ><v-list-item-content v-text="'뒤로가기'"></v-list-item-content>
          <template v-slot:prepend>
            <v-icon icon="mdi-arrow-left-bold-box-outline"></v-icon>
          </template>
        </v-list-item>
      </v-list>
      <v-list v-if="fileListCheck">
        <v-list-item
          v-for="(item, i) in fileList"
          :key="i"
          color="primary"
          @click="downloadFile(item)"
        >
          <template v-slot:prepend>
            <v-icon :icon="ifType(item.type)"></v-icon>
          </template>

          <v-list-item-title
            class="pt-1"
            v-text="item.name"
          ></v-list-item-title>
        </v-list-item>
      </v-list>

      <v-infinite-scroll v-else height="300" side="start" @load="load">
        <v-list>
          <template v-for="item in items" :key="item.name">
            <v-list-item color="primary" @click="downloadFile(item)">
              <template v-slot:prepend>
                <v-icon :icon="ifType(item.type)"></v-icon>
              </template>
              <v-list-item-title
                class="pt-1"
                v-text="item.name"
              ></v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-infinite-scroll>
    </v-card-text>
    <hr />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="dialogClose">닫기</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { toRaw } from "vue";

export default {
  name: "DownloadFiles",
  props: {
    fileList: Array,
    filePath: String,
  },
  data() {
    return {
      index: 0,
      items: [],
    };
  },
  computed: {
    isUupDirectory() {
      // /app/userhome/tmp/240306_ksskor_575/out/result/test
      let pathArray = this.filePath.split("/");
      let lastString = pathArray[pathArray.length - 1];

      if (lastString === "result") return false;
      return true;
    },
    fileListCheck() {
      if (this.fileList.length < 100) {
        return true;
      }
      return false;
    },
  },
  methods: {
    upDirectory() {
      console.log(this.filePath);
      let pathArray = this.filePath.split("/");
      let remove1 = pathArray.splice(pathArray.length - 1, 1);
      console.log(remove1);
      let fileName = pathArray[pathArray.length - 1];
      let remove2 = pathArray.splice(pathArray.length - 1, 1);
      console.log(remove2);
      let newFilePath = pathArray.join("/");

      this.$emit("downloadFileEvent", {
        filePath: newFilePath,
        fileName: fileName,
        fileType: "dir",
      });
    },
    downloadFile(item) {
      this.index = 0;
      this.$emit("downloadFileEvent", {
        filePath: this.filePath,
        fileName: item.name,
        fileType: item.type,
      });
    },
    dialogClose() {
      this.$emit("dialogCloseEvent");
    },
    ifType(type) {
      if (type === "file") {
        return "mdi-file";
      }
      if (type === "dir") {
        return "mdi-folder";
      }
      return "mdi-alert";
    },
    async api() {
      return new Promise((resolve) => {
        const largeArray = toRaw(this.fileList);
        let index = this.index;
        const chunk = largeArray.slice(index, index + 1);
        this.index = index + 1;
        resolve(chunk);
      });
    },
    async load({ done }) {
      // Perform API call
      const res = await this.api();
      this.items.push(...res);
      done("ok");
    },
  },
  mounted() {
    // this.resource_cpu = this.hpc_data.resource_cpu;
    // this.resource_mem = this.hpc_data.resource_mem;
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
