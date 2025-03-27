// src/store/index.js

import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./auth";
// import tempUsers from "./tempUsers";
// import visitations from "./visitations"; // visitations 모듈 가져오기

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    // tempUsers,
    // visitations, // visitations 모듈 등록
  },
  plugins: [createPersistedState()],
});
