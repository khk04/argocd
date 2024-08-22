import axios from "axios";

const state = {
  images: [],
  endState__: null,
};

const getters = {
  images() {
    return state.images;
  },
  endGetters__() {
    return null;
  },
};

const mutations = {
  setImages(state, payload) {
    state.images = payload;
  },
  endMutations__() {},
};

const actions = {
  // actTest({ state, commit, dispatch }, args) {
  //     console.log('CALL actTest()')
  //     return 'test'
  // },
  async getImages({ commit }, username) {
    try {
      const response = await axios.get(`/user-images?username=${username}`);
      commit("setImages", response.data);
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
