import axios from "axios";

const state = {
  users: [],
  user: {},
  endState__: null,
};

const getters = {
  users() {
    return state.users;
  },
  user() {
    return state.user;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setUsers(state, payload) {
    state.users = payload;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  endMutations__() {},
};

const actions = {
  async createUser({ commit }, user_info) {
    try {
      const response = await axios.post("/users", user_info);
      commit("setUser", response.data);
      console.log("createUser() response=", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getUsers({ commit }) {
    try {
      const response = await axios.get("/users/all");
      commit("setUsers", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getUser({ commit }, user_name) {
    try {
      console.log(user_name);
      const response = await axios.get(`/users/${user_name}`);
      console.log(response.data);
      commit("setUser", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async updateUser({ commit }, user_info) {
    try {
      const response = await axios.post("/users/update", user_info);
      commit("setUser", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async deleteUser({ state }, user_info) {
    console.log(state);
    try {
      const response = await axios.post("/users/delete", user_info);
      console.log(response.data);
    } catch (e) {
      console.error(e);
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
