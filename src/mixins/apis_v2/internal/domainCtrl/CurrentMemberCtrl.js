import axiosClient from '@/utils/axiosClient';

export const CurrentMemberCtrl = {
  data() {},
  created() {},
  methods: {
    /**
     * @description 특정 조직의 모든 멤버와 그들의 역할 정보를 조회하는 API
     * @param {Number} organizationId 조직 ID
     * @returns {Array} 조회 결과 (멤버 정보 배열)
     */
    async getMembersWithRoles(organizationId) {
      try {
        const res = await axiosClient.api.get(
          `/organizations/${organizationId}/members/roles`
        );

        return res.data;
      } catch (error) {
        console.error('멤버 조회 중 오류 발생:', error);
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
      idOfCreatingUser
    ) {
      try {
        // 요청 본문 구성
        const requestBody = {
          userData,
          organizationId,
          organizationCode,
          idOfCreatingUser,
        };

        // API 요청 실행
        const res = await axiosClient.api.post(`/users`, requestBody);
        // 딜레이를 두어 UI 업데이트가 완료되도록 함
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 응답 처리
        return res.data;
      } catch (error) {
        if (error.response) {
          return {
            error: error.message,
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          return { error: '서버로부터 응답이 없습니다.' };
        } else {
          return { error: error.message };
        }
      }
    },
    // /**
    //  * @description 멤버를 삭제하는 API
    //  * @param {Number} userId 삭제할 멤버의 사용자 ID
    //  * @param {Boolean} showLog 삭제 결과를 로그에 표시할지 여부
    //  * @returns {Object} 삭제 결과
    //  */
    // async deleteMember(userId, showLog) {
    //   if (showLog) {
    //     console.log(
    //       `%c[ Mixin : CurrentMemberCtrl ] deleteMember() userId: ${userId}`,
    //       `color: #6495ED;`
    //     );
    //   }

    //   try {
    //     const res = await axiosClient.api.delete(`/users/${userId}`);

    //     return res.data;
    //   } catch (error) {
    //     console.error('멤버 삭제 중 오류 발생:', error);
    //     return { error: error.message };
    //   }
    // },
    // /**
    //  * @description 멤버 정보를 업데이트하는 API
    //  * @param {Number} userId 업데이트할 멤버의 사용자 ID
    //  * @param {Object} userData 업데이트할 유저 데이터
    //  * @param {Boolean} showLog 업데이트 결과를 로그에 표시할지 여부
    //  * @returns {Object} 업데이트 결과
    //  */
    // async updateMember(userId, userData, showLog) {
    //   if (showLog) {
    //     console.log(
    //       `%c[ Mixin : CurrentMemberCtrl ] updateMember() userId: ${userId}, userData: ${JSON.stringify(
    //         userData
    //       )}`,
    //       `color: #6495ED;`
    //     );
    //   }

    //   try {
    //     const res = await axiosClient.api.put(`/users/${userId}`, userData);

    //     return res.data;
    //   } catch (error) {
    //     console.error('멤버 업데이트 중 오류 발생:', error);
    //     return { error: error.message };
    //   }
    // },
  },
};
