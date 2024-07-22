<template>
  <section>
    <v-container>
      <v-layout row wrap>
        <v-card flat class="mx-auto">
          <v-row style="margin-top: 250px">
            <dev class="mx-auto">
              <p class="text-h3 font-weight-black">Welcome to Juxtagene</p>
            </dev>
          </v-row>
          <v-row class="mx-auto" style="margin-top: 150px">
            <v-col>
              <v-form style="width: 500px; height: 300px">
                <div class="mx-3">
                  <!-- <v-icon color="black" size="30px">mdi-account</v-icon>
                    Username -->
                  <div class="mx-1">
                    <v-text-field
                      label="Username"
                      v-model="username"
                      required
                    ></v-text-field>
                  </div>
                </div>
                <div class="mx-3">
                  <!-- <v-icon color="black" size="30px">mdi-lock</v-icon>
                    Password -->
                  <div class="mx-1">
                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="password"
                      required
                    ></v-text-field>
                  </div>
                </div>
                <v-card-actions>
                  <v-btn color="#2c4f91" dark large block @click="handleLogin"
                    >Login</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginView",

  data() {
    return {
      username: null,
      password: null,
    };
  },

  methods: {
    ...mapActions({
      login: "auth/auth", // 'auth/auth' 액션을 'login' 메서드로 매핑합니다.
    }),

    async handleLogin() {
      try {
        // 사용자가 입력한 유저네임과 패스워드를 auth/auth 액션으로 전달하여 로그인 시도
        // console.log(this.username, this.password);
        await this.login({ username: this.username, password: this.password });

        // 로그인 성공 시 처리할 로직을 추가할 수 있습니다.
        // 예를 들어, 사용자 정보를 가져오거나, 로그인 성공 메시지를 표시하는 등의 작업을 수행할 수 있습니다.

        // 인증이 완료되면 호출하는 페이지로 이동합니다.
        // 여기서는 '/'(홈 화면)으로 이동하도록 설정합니다.
        this.$router.push({ path: "/" });
      } catch (error) {
        // 로그인 실패 또는 오류 처리를 해줍니다.
        // 로그인 실패 메시지를 표시하거나 에러를 처리하는 등의 작업을 수행할 수 있습니다.
      }
    },
  },
};
</script>

<style lang="scss"></style>
