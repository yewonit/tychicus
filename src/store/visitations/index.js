// src/store/visitations.js

const state = {
  visitations: [
    // 이영수 (새가족)
    {
      id: 1,
      visitationType: "새가족",
      visitorUserId: 1,
      visitedUserId: 2, // 이영수
      visitationDate: "2023-06-03 10:00:00",
      visitationContent:
        "이영수 새가족 심방을 진행하였습니다. 교회에 잘 정착하고 있으며, 성경공부에 대한 관심이 높았습니다.",
    },
    {
      id: 2,
      visitationType: "새가족",
      visitorUserId: 1,
      visitedUserId: 2, // 이영수
      visitationDate: "2023-06-18 14:00:00",
      visitationContent:
        "이영수 새가족 심방을 진행하였습니다. 교회 생활에 만족하고 있으며, 소그룹 모임에 참여하고 싶어 했습니다.",
    },

    // 박민수 (새가족)
    {
      id: 3,
      visitationType: "새가족",
      visitorUserId: 10,
      visitedUserId: 3, // 박민수
      visitationDate: "2023-06-05 11:00:00",
      visitationContent:
        "박민수 새가족 심방을 진행하였습니다. 교회 분위기에 만족하고 있으며, 봉사활동에 참여하고 싶어 했습니다.",
    },
    {
      id: 4,
      visitationType: "새가족",
      visitorUserId: 11,
      visitedUserId: 3, // 박민수
      visitationDate: "2023-06-20 15:00:00",
      visitationContent:
        "박민수 새가족 심방을 진행하였습니다. 교회 생활에 적응하고 있으며, 예배 참석에 대한 의지가 강했습니다.",
    },

    // 이동현 (장기결석자)
    {
      id: 5,
      visitationType: "장결자",
      visitorUserId: 1,
      visitedUserId: 7, // 이동현
      visitationDate: "2023-06-07 13:00:00",
      visitationContent:
        "이동현 장기결석자 심방을 진행하였습니다. 개인적인 사정으로 교회에 나오기 어려웠던 상황이었으며, 기도와 격려가 필요해 보였습니다.",
    },
    {
      id: 6,
      visitationType: "장결자",
      visitorUserId: 1,
      visitedUserId: 7, // 이동현
      visitationDate: "2023-06-22 17:00:00",
      visitationContent:
        "이동현 장기결석자 심방을 진행하였습니다. 건강상의 문제로 교회 출석이 어려웠던 상황이었으며, 지속적인 관심과 기도 지원이 필요할 것 같습니다.",
    },

    // 김성진 (장기결석자)
    {
      id: 7,
      visitationType: "장결자",
      visitorUserId: 1,
      visitedUserId: 8, // 김성진
      visitationDate: "2023-06-10 14:00:00",
      visitationContent:
        "김성진 장기결석자 심방을 진행하였습니다. 업무로 인해 교회에 참석하기 어려웠던 상황이었으며, 영적인 도움과 지지가 필요해 보였습니다.",
    },
    {
      id: 8,
      visitationType: "장결자",
      visitorUserId: 1,
      visitedUserId: 8, // 김성진
      visitationDate: "2023-06-25 16:00:00",
      visitationContent:
        "김성진 장기결석자 심방을 진행하였습니다. 개인적인 어려움으로 교회 생활에 소홀했던 상황이었으며, 다시 교회로 돌아올 수 있도록 격려와 기도가 필요할 것 같습니다.",
    },
  ],
};

// 나머지 코드는 이전과 동일합니다.

const getters = {
  getAllVisitations(state) {
    return state.visitations;
  },
  getVisitationById: (state) => (id) => {
    return state.visitations.find((visitation) => visitation.id === id);
  },
};

const mutations = {
  CREATE_VISITATION(state, visitation) {
    state.visitations.push(visitation);
  },
  UPDATE_VISITATION(state, updatedVisitation) {
    const index = state.visitations.findIndex(
      (visitation) => visitation.id === updatedVisitation.id
    );
    if (index !== -1) {
      state.visitations.splice(index, 1, updatedVisitation);
    }
  },
  DELETE_VISITATION(state, visitationId) {
    const index = state.visitations.findIndex(
      (visitation) => visitation.id === visitationId
    );
    if (index !== -1) {
      state.visitations.splice(index, 1);
    }
  },
};

const actions = {
  createVisitation({ commit }, visitation) {
    commit("CREATE_VISITATION", visitation);
  },
  updateVisitation({ commit }, visitation) {
    commit("UPDATE_VISITATION", visitation);
  },
  deleteVisitation({ commit }, visitationId) {
    commit("DELETE_VISITATION", visitationId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
