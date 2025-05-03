const state = {
  organizations: [],
  selectedOrganization: null,
};

const mutations = {
  SET_ORGANIZATIONS(state, organizations) {
    state.organizations = organizations;
  },
  SET_SELECTED_ORGANIZATION(state, organization) {
    state.selectedOrganization = organization;
  },
};

const actions = {
  async fetchOrganizations({ commit }) {
    try {
      // TODO: API 호출 구현
      const response = await fetch("/api/organizations");
      const data = await response.json();
      commit("SET_ORGANIZATIONS", data);
      return data;
    } catch (error) {
      console.error("조직 정보 가져오기 실패:", error);
      throw error;
    }
  },
  selectOrganization({ commit }, organization) {
    commit("SET_SELECTED_ORGANIZATION", organization);
  },
};

const getters = {
  getOrganizations: (state) => state.organizations,
  getSelectedOrganization: (state) => state.selectedOrganization,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
