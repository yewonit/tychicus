const state = {
  attendanceData: {
    meetings: [],
    statistics: {},
    summary: {
      totalMeetings: 0,
      totalAttendees: 0,
      averageAttendanceRate: 0,
    },
  },
};

const mutations = {
  SET_ATTENDANCE_DATA(state, data) {
    state.attendanceData = data;
  },
  UPDATE_ATTENDANCE_STATISTICS(state, statistics) {
    state.attendanceData.statistics = statistics;
  },
  UPDATE_ATTENDANCE_SUMMARY(state, summary) {
    state.attendanceData.summary = summary;
  },
};

const actions = {
  async fetchAttendanceData({ commit }, { startDate, endDate }) {
    try {
      // TODO: API 호출 구현
      const response = await fetch(
        `/api/attendance?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      commit('SET_ATTENDANCE_DATA', data);
      return data;
    } catch (error) {
      console.error('출석 데이터 가져오기 실패:', error);
      throw error;
    }
  },
};

const getters = {
  getAttendanceData: (state) => state.attendanceData,
  getAttendanceStatistics: (state) => state.attendanceData.statistics,
  getAttendanceSummary: (state) => state.attendanceData.summary,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
