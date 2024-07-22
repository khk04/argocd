import axios from "axios";

const state = {
  readyJobs: [],
  readyJob: {},
  endState__: null,
};

const getters = {
  readyJobs() {
    return state.readyJobs;
  },
  readyJob() {
    return state.readyJob;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setJobs(state, payload) {
    state.readyJobs = payload;
  },
  setJob(state, payload) {
    state.readyJob = payload;
  },
  endMutations__() {},
};

const actions = {
  async createJob({ commit }, job_info) {
    try {
      const response = await axios.post("/ready-jobs", job_info);
      commit("setJob", response.data);
      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getJobs({ commit }, user_name) {
    try {
      const response = await axios.get(`/ready-jobs/name/${user_name}`);
      commit("setJobs", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getJob({ commit }, ready_job_name) {
    commit("setJob", {});
    try {
      console.log(ready_job_name);
      const response = await axios.get(`/ready-jobs/${ready_job_name}`);
      console.log(response.data);
      commit("setJob", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async updateJob({ commit }, job_info) {
    try {
      const response = await axios.post("/ready-jobs/update", job_info);
      commit("setJob", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async deleteJob({ state }, job_info) {
    console.log(state);
    try {
      const response = await axios.post("/ready-jobs/delete", job_info);
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
