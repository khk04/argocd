import axios from "axios";

const state = {
  image: null,
  log: "",
  progress: 0,
  status: {},
  jobs: [],
  jobInfo: {},
  fileName: "",
  file: null,
  endState__: null,
};

const getters = {
  image() {
    return state.image;
  },
  log() {
    return state.log;
  },
  progress() {
    return state.progress;
  },
  status() {
    return state.status;
  },
  jobs() {
    return state.jobs;
  },
  jobInfo() {
    return state.jobInfo;
  },
  fileName() {
    return state.fileName;
  },
  file() {
    return state.file;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setImages(state, payload) {
    state.images = payload;
  },
  setImage(state, payload) {
    state.image = payload;
  },
  setLog(state, payload) {
    state.log = payload;
  },
  setProgress(state, payload) {
    state.progress = payload;
  },
  setStatus(state, payload) {
    state.status = payload;
  },
  setJobs(state, payload) {
    state.jobs = payload;
  },
  setJobInfo(state, payload) {
    state.jobInfo = payload;
  },
  setFileName(state, payload) {
    state.fileName = payload;
  },
  setFile(state, payload) {
    state.file = payload;
  },
  endMutations__() {},
};

const actions = {
  infoInit({ commit }) {
    commit("setLog", "");
    commit("setProgress", 0);
    commit("setStatus", {});
  },
  async sendKafkaTopic({ commit }, username) {
    commit("setImage", username);
    try {
      await axios.post("/kafka", { data: username });
      // console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getLog({ commit }, username) {
    commit("setImage", username);
    try {
      const response = await axios.post("/execlog", { data: username });
      // console.log(response.data);
      commit("setLog", response.data.content);
      commit("setProgress", response.data.progress);
      // console.log(state.log);
    } catch (e) {
      console.error(e);
    }
  },

  async getStatus({ commit }, username) {
    commit("setImage", username);
    try {
      const response = await axios.post("/jobstate", { data: username });
      console.log(response.data);
      commit("setStatus", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getJobList({ commit }, username) {
    try {
      const response = await axios.post("/joblist", { data: username });
      // console.log(response.data);
      commit("setJobs", response.data);
    } catch (e) {
      console.error(e);
    }
  },

  async getJobInfo({ commit }, jobname) {
    try {
      const response = await axios.post("/jobinfo", { data: jobname });
      // console.log(response.data);
      commit("setJobInfo", response.data);
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
