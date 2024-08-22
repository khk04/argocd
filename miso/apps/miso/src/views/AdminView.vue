<template>
  <div class="home">
    <v-layout class="rounded rounded-md">
      <v-app-bar color="blue-darken-4 px-2" density="compact">
        <v-app-bar-title class="text-left">Juxtagene</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="goToHome">Home</v-btn>
        <v-btn variant="outlined" @click="handleLogout">Logout</v-btn>
      </v-app-bar>

      <v-navigation-drawer class="pa-0">
        <br />
        <v-list>
          <v-list-item @click="goToHome"> 메인 페이지 </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer location="right" class="pa-0 pt-2">
        <v-btn
          class="my-1"
          width="100%"
          prepend-icon="mdi-plus-outline"
          variant="outlined"
          color="primary"
          :disabled="selectedTrue"
          @click="dialogCU = true"
        >
          Create
        </v-btn>

        <v-dialog v-model="dialogCU" width="auto">
          <v-card>
            <v-card-title>
              <span class="text-h5">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="v-col-3">사용자 이름 :</v-col>
                  <v-col class="v-col-9 text-left">{{ userData.name }}</v-col>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="userData.nickname"
                      label="별명*"
                      required
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="userData.admin"
                      :items="['FALSE', 'TRUE']"
                      label="관리자 설정*"
                      required
                      variant="underlined"
                    ></v-select>
                  </v-col>

                  <!-- CPU field -->
                  <v-col class="v-col-4">
                    <v-text-field
                      v-model="userData.cpu"
                      :rules="tempCpuRules"
                      label="CPU"
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col class="v-col-8">
                    <v-slider
                      v-model="userData.cpu"
                      append-icon="mdi-plus"
                      prepend-icon="mdi-minus"
                      :min="1"
                      :max="30"
                      :step="1"
                      thumb-label
                      class="pt-3"
                    ></v-slider>
                  </v-col>
                  <!-- NODE field -->
                  <v-col class="v-col-4">
                    <v-text-field
                      v-model="userData.node"
                      :rules="tempNodeRules"
                      label="NODE"
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col class="v-col-8">
                    <v-slider
                      v-model="userData.node"
                      append-icon="mdi-plus"
                      prepend-icon="mdi-minus"
                      :min="1"
                      :max="10"
                      :step="1"
                      thumb-label
                      class="pt-3"
                    ></v-slider>
                  </v-col>
                  <!-- Memory field -->
                  <v-col class="v-col-4">
                    <v-text-field
                      v-model="userData.memory"
                      :rules="tempMemRules"
                      label="Memory"
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col class="v-col-8">
                    <v-slider
                      v-model="userData.memory"
                      append-icon="mdi-plus"
                      prepend-icon="mdi-minus"
                      :min="1"
                      :max="200000"
                      :step="1"
                      thumb-label
                      class="pt-3"
                    ></v-slider>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="dialogCU = false">닫기</v-btn>
              <v-btn v-if="selectedFalse" color="primary" @click="create">
                생성
              </v-btn>
              <v-btn v-if="selectedTrue" color="primary" @click="update">
                수정
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogD" width="auto">
          <v-card>
            <v-card-title>
              <span class="text-h5">유정 정보를 삭제 하겠습니까?</span>
            </v-card-title>
            <v-card-text></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="dialogD = false">취소</v-btn>
              <v-btn color="red" @click="deleteFun">삭제</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn
          class="my-1"
          width="100%"
          prepend-icon="mdi-update"
          variant="outlined"
          color="#FFC107"
          :disabled="selectedFalse"
          @click="updateFun"
        >
          Update
        </v-btn>
        <v-btn
          class="my-1"
          width="100%"
          prepend-icon="mdi-delete"
          variant="outlined"
          color="#F44336"
          :disabled="selectedFalse"
          @click="dialogD = true"
        >
          delete
        </v-btn>
      </v-navigation-drawer>

      <v-main>
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account"></v-icon> &nbsp; 유저 관리
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              hide-details
              placeholder="Search name..."
              class="ma-2"
              density="compact"
            ></v-text-field>
          </v-card-title>
        </v-card>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="users"
          :search="search"
          return-object
          select-strategy="single"
          show-select
        ></v-data-table>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { mapGetters, mapActions } from "vuex";
// @ is an alias to /src

export default {
  name: "AdminView",
  components: {},
  data: () => ({
    dialogCU: false,
    dialogD: false,
    userData: {
      name: "",
      nickname: "",
      admin: false,
      cpu: 15,
      node: 10,
      memory: 10240,
    },
    itemsPerPage: 10,
    headers: [
      { title: "이름", key: "name", align: "end", sortable: false },
      { title: "별명", key: "nickname", align: "end" },
      { title: "관리자 권한", key: "admin", align: "end" },
      { title: "CPU 제한", key: "cpu", align: "end" },
      { title: "NODE 제한", key: "node", align: "end" },
      { title: "Memory 제한", key: "memory", align: "end" },
    ],
    selected: [],
    search: "",
    tempCpuRules: [(v) => !!v || "CPU is required"],
    tempNodeRules: [(v) => !!v || "Node is required"],
    tempMemRules: [(v) => !!v || "Memory is required"],
  }),
  created() {
    this.checkAdmin();
  },
  computed: {
    ...mapGetters({}),
    users() {
      return this.$store.state.user.users;
    },
    selectedTrue() {
      return this.selected.length !== 0;
    },
    selectedFalse() {
      return this.selected.length === 0;
    },
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      getUsers: "user/getUsers",
      getUser: "user/getUser",
      createUser: "user/createUser",
      updateUser: "user/updateUser",
      deleteUser: "user/deleteUser",
    }),
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
    goToHome() {
      this.$router.push("/");
    },
    checkAdmin() {
      let username = this.$store.state.auth.username;
      console.log(username);
      return 0;
    },
    create() {
      this.createUser(this.userData);
      this.userData = {
        name: "",
        nickname: "",
        admin: false,
        cpu: 15,
        node: 10,
        memory: 100000,
      };

      setTimeout(() => {
        this.getUsers();
        this.dialogCU = false;
      }, 100);
    },
    update() {
      this.updateUser(this.selected[0]);
      setTimeout(() => {
        this.userData = {
          name: "",
          nickname: "",
          admin: false,
          cpu: 15,
          node: 10,
          memory: 100000,
        };
        this.getUsers();
        this.dialogCU = false;
      }, 100);
    },
    updateFun() {
      this.userData = toRaw(this.selected[0]);
      this.dialogCU = true;
    },
    deleteFun() {
      this.deleteUser(toRaw(this.selected[0]));
      setTimeout(() => {
        this.getUsers();
        this.dialogD = false;
      }, 100);
    },
  },
  mounted() {
    this.getUsers();
    this.loading = false;
  },
  beforeUnmount() {},
};
</script>

<style scoped lang="scss"></style>
