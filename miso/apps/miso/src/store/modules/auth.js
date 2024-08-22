import axios from "axios";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리에서 jwt_decode 함수를 가져옵니다.

const state = {
  username: null,
  password: null,
  auth: false,
  endState__: null,
};

const getters = {
  username() {
    return state.username;
  },
  password() {
    return state.password;
  },
  auth() {
    return state.auth;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setUsername(state, payload) {
    state.username = payload;
  },
  setPassword(state, payload) {
    state.password = payload;
  },
  setAuth(state, payload) {
    state.auth = payload;
  },
  endMutations__() {},
};

const actions = {
  // actTest({ state, commit, dispatch }, args) {
  //     console.log('CALL actTest()')
  //     return 'test'
  // },
  async auth({ commit }, auth) {
    console.log("CALL auth()");
    try {
      let token = localStorage.getItem("token");
      if (token !== null) {
        console.log("token");
        console.log(token);
      }

      const response = await axios.post("/login", auth);
      token = response.data.token;

      // 토큰의 만료 시간을 가져옵니다.
      const tokenExpiration = jwtDecode(token).exp;
      // console.log('Token expiration time:', new Date(tokenExpiration * 1000).toString());

      // 현재 시간을 가져옵니다.
      const currentTime = Date.now() / 1000;
      // console.log('Current time:', new Date(currentTime * 1000).toString());

      // 토큰이 만료되지 않았을 경우에만 로그인 처리를 합니다.
      if (tokenExpiration > currentTime) {
        console.log("Token is valid. Logging in...");
        commit("setUsername", auth.username);
        commit("setPassword", auth.password);
        commit("setAuth", true);
        localStorage.setItem("token", token);
      } else {
        console.log("토큰이 만료되었습니다. 다시 로그인해주세요.");
        throw new Error("토큰이 만료되었습니다.");
      }
    } catch (e) {
      console.error("Login failed:", e);
      commit("setUsername", null);
      commit("setPassword", null);
      commit("setAuth", false);
      localStorage.removeItem("token");
      throw e;
    }
  },
  async logout({ commit }) {
    // logs
    console.log("CALL logout()");
    commit("setUsername", null);
    commit("setPassword", null);
    commit("setAuth", false);
    localStorage.removeItem("token"); // 로그아웃 시 토큰 삭제
  },
  async checkToken({ commit }) {
    console.log("CALL checkToken()");
    try {
      let token = localStorage.getItem("token");
      console.log(jwtDecode(token));

      // 토큰의 만료 시간을 가져옵니다.
      const tokenExpiration = jwtDecode(token).exp;
      // console.log('Token expiration time:', new Date(tokenExpiration * 1000).toString());

      // 현재 시간을 가져옵니다.
      const currentTime = Date.now() / 1000;
      // console.log('Current time:', new Date(currentTime * 1000).toString());

      // 토큰이 만료되지 않았을 경우에만 로그인 처리를 합니다.
      if (tokenExpiration > currentTime) {
        console.log("Token is valid. Logging in...");
        commit("setUsername", jwtDecode(token).username);
        commit("setAuth", true);
      } else {
        console.log("토큰이 만료되었습니다. 다시 로그인해주세요.");
        throw new Error("토큰이 만료되었습니다.");
      }
    } catch (e) {
      console.error("Login failed:", e);
      commit("setUsername", null);
      commit("setPassword", null);
      commit("setAuth", false);
      localStorage.removeItem("token");
      throw e;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
