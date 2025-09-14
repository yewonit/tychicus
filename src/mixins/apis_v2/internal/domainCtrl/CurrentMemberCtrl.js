import env from "@/config/environments.js";
import axios from "axios";

export const CurrentMemberCtrl = {
  data() {
    return {
      // URL List
      CurrentMember_EP: "current-members",
    };
  },
  created() {},
  methods: {
    /**
     * @description 특정 조직의 모든 멤버와 그들의 역할 정보를 조회하는 API
     * @param {Number} organizationId 조직 ID
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Array} 조회 결과 (멤버 정보 배열)
     */
    async getMembersWithRoles(organizationId, showLog) {
      if (showLog) {
        // 로그 출력 제거됨
      }

      try {
        const res = await axios.get(
          `${env.API_BASE_URL}/${this.CurrentMember_EP}`,
          {
            params: {
              organizationId: organizationId,
            },
          }
        );

        let returnData = res.data;

        if (showLog) {
        }

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },
    /**
     * @description 새로운 맴버를 조직에 추가하는 API
     * @param {Object} userData 유저 데이터
     * @param {Number} organizationId 소속 조직의 ID
     * @param {String} organizationCode 소속 조직의 코드
     * @param {Number} idOfCreatingUser 멤버를 생성하는 사용자의 ID
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 생성된 맴버 정보
     */
    async createMember(
      userData,
      organizationId,
      organizationCode,
      idOfCreatingUser,
      showLog
    ) {
      // API 엔드포인트 구성
      const apiEndpoint = `${env.API_BASE_URL}/${this.CurrentMember_EP}`;

      try {
        // 요청 본문 구성
        const requestBody = {
          userData,
          organizationId,
          organizationCode,
          idOfCreatingUser,
        };

        // API 요청 실행
        const res = await axios.post(apiEndpoint, requestBody);

        // 응답 처리
        let returnData = res.data;

        // 딜레이를 두어 UI 업데이트가 완료되도록 함
        await new Promise((resolve) => setTimeout(resolve, 300));

        return returnData;
      } catch (error) {
        // 오류 세부 정보 로깅
        if (error.response) {
          return {
            error: error.message,
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          return { error: "서버로부터 응답이 없습니다." };
        } else {
          return { error: error.message };
        }
      }
    },
    /**
     * @description 멤버를 삭제하는 API
     * @param {Number} userId 삭제할 멤버의 사용자 ID
     * @param {Boolean} showLog 삭제 결과를 로그에 표시할지 여부
     * @returns {Object} 삭제 결과
     */
    async deleteMember(userId, showLog) {
      try {
        const res = await axios.delete(
          `${env.API_BASE_URL}/${this.CurrentMember_EP}/${userId}`
        );

        let returnData = res.data;

        if (showLog) {
        }

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },
    /**
     * @description 멤버 정보를 업데이트하는 API
     * @param {Number} userId 업데이트할 멤버의 사용자 ID
     * @param {Object} userData 업데이트할 유저 데이터
     * @param {Boolean} showLog 업데이트 결과를 로그에 표시할지 여부
     * @returns {Object} 업데이트 결과
     */
    async updateMember(userId, userData, showLog) {
      try {
        const res = await axios.put(
          `${env.API_BASE_URL}/${this.CurrentMember_EP}/${userId}`,
          userData
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },
  },
};
