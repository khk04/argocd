import axios from "axios";

const state = {
  runJobs: [],
  runJob: {},
  endState__: null,
};

const getters = {
  runJobs() {
    return state.runJobs;
  },
  runJob() {
    return state.runJob;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setJobs(state, payload) {
    state.runJobs = payload;
  },
  setJob(state, payload) {
    state.runJob = payload;
  },
  endMutations__() {},
};

const actions = {
  async getJobs({ commit }, user_name) {
    try {
      const response = await axios.get(`/run-jobs/name/${user_name}`);
      commit("setJobs", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getJob({ commit }, run_job_name) {
    commit("setJob", {});
    try {
      console.log(run_job_name);
      const response = await axios.get(`/run-jobs/${run_job_name}`);
      console.log(response.data);
      commit("setJob", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async deleteJob({ state }, job_info) {
    console.log(state);
    try {
      const response = await axios.post("/run-jobs/delete", job_info);
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
