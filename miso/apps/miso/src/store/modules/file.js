import axios from "axios";

const state = {
  fileList: [],
  filePath: "",
  fileName: "",
  file: null,
  fileCount: 0,
  endState__: null,
};

const getters = {
  fileList() {
    return state.fileList;
  },
  filePath() {
    return state.filePath;
  },
  fileName() {
    return state.fileName;
  },
  file() {
    return state.file;
  },
  fileCount() {
    return state.fileCount;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setFileList(state, payload) {
    state.fileList = payload;
  },
  setFilePath(state, payload) {
    state.filePath = payload;
  },
  setFileName(state, payload) {
    state.fileName = payload;
  },
  setFile(state, payload) {
    state.file = payload;
  },
  setFileCount(state, payload) {
    state.fileCount = payload;
  },
  endMutations__() {},
};

const actions = {
  async getFileList({ commit }, directoryPath) {
    try {
      // Make the HTTP request using Axios
      const response = await axios.post("/filelist", directoryPath);
      console.log("Response:", response.data);
      commit("setFileList", response.data.files);
      commit("setFilePath", response.data.folder);
    } catch (e) {
      console.error("Error uploading filelist:", e);
    }
  },

  async getFileCount({ commit }, directoryPath) {
    try {
      // Make the HTTP request using Axios
      const response = await axios.post("/filecount", directoryPath);
      console.log("Response:", response.data);
      commit("setFileCount", response.data.file_count);
    } catch (e) {
      console.error("Error uploading filecount:", e);
    }
  },

  async uploadFile({ state, commit }, formData) {
    try {
      // Make the HTTP request using Axios
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      commit("setFileName", response.data.filename);
      if (response.data.filename) {
        commit("setFileCount", state.fileCount + 1);
      }
    } catch (e) {
      console.error("Error uploading file:", e);
    }
  },

  async downloadFile({ commit }, fileInfo) {
    try {
      // Make the HTTP request using Axios
      const response = await axios.post("/downloadfile", fileInfo);
      console.log("Response:", response.data);
      commit("setFileName", response.data.fileName);
      return response;
    } catch (e) {
      console.error("Error download file:", e);
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
