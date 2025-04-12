// auth 모듈의 초기 상태 정의
const state = {
  // 사용자 이름을 저장할 상태
  userName: "",
  // 사용자 정보
  userInfo: {},
  // 동명이인 리스트
  userList: [],
  // 단일 사용자 데이터 (동명이인이 없는 경우)
  userData: null,
  // AccessToken
  userAccessToken: "",
  // RefreshToken
  userRefreshToken: "",
};

// auth 모듈의 변이 정의
const mutations = {
  // 사용자 이름을 설정하는 변이
  SET_USER_NAME(state, userName) {
    state.userName = userName;
  },
  // 사용자 정보를 설정하는 변이
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  // 동명이인 리스트를 설정하는 변이
  SET_USER_LIST(state, userList) {
    state.userList = userList;
  },
  // 단일 사용자 데이터를 설정하는 변이
  SET_USER_DATA(state, userData) {
    state.userData = userData;
  },
  // 로그아웃 시 모든 상태 초기화
  CLEAR_AUTH_STATE(state) {
    state.userName = "";
    state.userInfo = {};
    state.userList = [];
    state.userData = null;
    state.userAccessToken = "";
    state.userRefreshToken = "";
  },
  // AccessToken 설정
  SET_ACCESSTOKEN(state, userAccessToken) {
    state.userAccessToken = userAccessToken;
  },
  SET_REFRESHTOKEN(state, userRefreshToken) {
    state.userRefreshToken = userRefreshToken;
  },
};

// auth 모듈의 액션 정의
const actions = {
  // 사용자 이름을 설정하는 액션
  setUserName({ commit }, userName) {
    console.log(`[ Store : auth ] setUserName() userName: ${userName}`);
    commit("SET_USER_NAME", userName);
  },
  // 사용자 정보를 설정하는 액션
  setUserInfo({ commit }, userInfo) {
    console.log(`[ Store : auth ] setUserInfo() userInfo:`, userInfo);
    commit("SET_USER_INFO", userInfo);
  },
  // 동명이인 리스트를 설정하는 액션
  setUserList({ commit }, userList) {
    console.log(`[ Store : auth ] setUserList() userList:`, userList);
    commit("SET_USER_LIST", userList);
  },
  // 단일 사용자 데이터를 설정하는 액션
  setUserData({ commit }, userData) {
    console.log(`[ Store : auth ] setUserData() userData:`, userData);
    commit("SET_USER_DATA", userData);
  },
  // 로그아웃 액션
  logout({ commit }) {
    console.log(`[ Store : auth ] logout()`);
    commit("CLEAR_AUTH_STATE");
  },
  setAccessToken({ commit }, userAccessToken) {
    console.log(
      `[ Store : auth ] setAccessToken() userAccessToken:`,
      userAccessToken
    );
    commit("SET_ACCESSTOKEN", userAccessToken);
  },
  setRefreshToken({ commit }, userRefreshToken) {
    console.log(
      `[ Store : auth ] userRefreshToken() userRefreshToken:`,
      userRefreshToken
    );
    commit("SET_REFRESHTOKEN", userRefreshToken);
  },
};

// auth 모듈의 게터 정의
const getters = {
  // 사용자 이름을 반환하는 게터
  userName(state) {
    return state.userName;
  },
  // 사용자 정보를 반환하는 게터
  userInfo(state) {
    return state.userInfo;
  },
  // 동명이인 리스트를 반환하는 게터
  userList(state) {
    return state.userList;
  },
  // 단일 사용자 데이터를 반환하는 게터
  userData(state) {
    return state.userData;
  },
  // 동명이인 여부를 반환하는 게터
  hasDuplicateUsers(state) {
    return state.userList && state.userList.length > 1;
  },
  userAccessToken(state) {
    return state.userAccessToken;
  },
  userRefreshToken(state) {
    return state.userRefreshToken;
  },
};

// auth 모듈 내보내기
export default {
  namespaced: true, // 모듈의 네임스페이스를 사용하도록 설정
  state,
  mutations,
  actions,
  getters,
};
