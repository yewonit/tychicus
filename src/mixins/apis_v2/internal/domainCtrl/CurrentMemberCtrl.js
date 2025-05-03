import axios from "axios";
<<<<<<< HEAD
=======
import env from "@/config/environments.js";
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b

export const CurrentMemberCtrl = {
  data() {
    return {
      // URL List
      CurrentMember_EP: "current-members",
<<<<<<< HEAD

      // Base URL
      // BASIC_URL: "https://attendance.icoramdeo.com/api/",
      BASIC_URL: "https://attendance-dev.icoramdeo.com/api/",
      // BASIC_URL: "http://localhost:3000/api/",
=======
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
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
        console.log(
          `%c[ Mixin : CurrentMemberCtrl ] getMembersWithRoles() organizationId: ${organizationId}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axios.get(
<<<<<<< HEAD
          `${this.BASIC_URL}${this.CurrentMember_EP}`,
=======
          `${env.API_BASE_URL}/${this.CurrentMember_EP}`,
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
          {
            params: {
              organizationId: organizationId,
            },
          }
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("멤버 조회 중 오류 발생:", error);
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
<<<<<<< HEAD
      const apiEndpoint = `${this.BASIC_URL}${this.CurrentMember_EP}`;
=======
      const apiEndpoint = `${env.API_BASE_URL}/${this.CurrentMember_EP}`;
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b

      if (showLog) {
        console.group(
          "%c🚀 [API 요청] createMember() 실행",
          "color: #6495ED; font-weight: bold;"
        );
        console.log(
          "%c📌 API 엔드포인트:",
          "color: #6495ED; font-weight: bold;",
          apiEndpoint
        );

        // 요청 파라미터 로깅
        console.log("%c📝 요청 파라미터:", "color: #6495ED;");
        console.log("- userData:", userData);
        console.log("- organizationId:", organizationId);
        console.log("- organizationCode:", organizationCode);
        console.log("- idOfCreatingUser:", idOfCreatingUser);

        // 요청 본문의 중요 필드 표로 표시
        console.log("%c📋 userData 중요 필드:", "color: #6495ED;");
        console.table({
          id: userData.id || "신규 멤버",
          name: userData.name,
          name_suffix: userData.name_suffix,
          phone_number: userData.phone_number,
          gender_type: userData.gender_type,
          role_id: userData.role_id,
          is_new_member: userData.is_new_member,
        });

        console.groupEnd();
      }

      try {
        // 요청 본문 구성
        const requestBody = {
          userData,
          organizationId,
          organizationCode,
          idOfCreatingUser,
        };

        if (showLog) {
          console.group(
            "%c📨 API 요청 세부 정보",
            "color: #6495ED; font-weight: bold;"
          );
          console.log("HTTP 메서드:", "POST");
          console.log("API 엔드포인트:", apiEndpoint);
          console.log("요청 헤더:", {
            "Content-Type": "application/json",
            Authorization:
              axios.defaults.headers.common["Authorization"] ||
              "인증 정보 없음",
          });
          console.log("요청 본문:", requestBody);
          console.groupEnd();
        }

        // API 요청 실행
        console.time("API 요청 시간");
        const res = await axios.post(apiEndpoint, requestBody);
        console.timeEnd("API 요청 시간");

        // 응답 처리
        let returnData = res.data;

        if (showLog) {
          console.group(
            "%c📬 API 응답 데이터",
            "color: #2E8B57; font-weight: bold;"
          );
          console.log("응답 상태:", res.status);
          console.log("응답 헤더:", res.headers);
          console.log("응답 본문:", returnData);

          // 응답 데이터 중요 필드 표로 표시
          if (returnData && typeof returnData === "object") {
            console.log("%c📋 응답 데이터 중요 필드:", "color: #2E8B57;");
            try {
              console.table({
                id: returnData.id || returnData.userId || "알 수 없음",
                status: "성공",
                created_at:
                  returnData.created_at || returnData.createdAt || "알 수 없음",
                message: returnData.message || "응답 메시지 없음",
              });
            } catch (e) {
              console.log("응답 데이터를 표로 표시할 수 없음:", e);
            }
          }

          console.groupEnd();
        }

        // 딜레이를 두어 UI 업데이트가 완료되도록 함
        await new Promise((resolve) => setTimeout(resolve, 300));

        return returnData;
      } catch (error) {
        console.group("%c❌ API 오류 발생", "color: red; font-weight: bold;");
        console.error("맴버 생성 중 오류 발생:", error);

        // 오류 세부 정보 로깅
        if (error.response) {
          console.error("응답 상태:", error.response.status);
          console.error("응답 헤더:", error.response.headers);
          console.error("응답 데이터:", error.response.data);

          // 오류 데이터 표로 표시
          console.log("%c📋 오류 세부 정보:", "color: red;");
          try {
            console.table({
              status: error.response.status,
              statusText: error.response.statusText || "상태 텍스트 없음",
              message: error.response.data?.message || error.message,
              error: error.response.data?.error || "알 수 없는 오류",
            });
          } catch (e) {
            console.log("오류 데이터를 표로 표시할 수 없음:", e);
          }

          console.groupEnd();
          return {
            error: error.message,
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          console.error("요청만 전송됨, 응답 없음:", error.request);
          console.groupEnd();
          return { error: "서버로부터 응답이 없습니다." };
        } else {
          console.error("요청 설정 중 오류:", error.message);
          console.groupEnd();
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
      if (showLog) {
        console.log(
          `%c[ Mixin : CurrentMemberCtrl ] deleteMember() userId: ${userId}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axios.delete(
<<<<<<< HEAD
          `${this.BASIC_URL}${this.CurrentMember_EP}/${userId}`
=======
          `${env.API_BASE_URL}/${this.CurrentMember_EP}/${userId}`
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("멤버 삭제 중 오류 발생:", error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : CurrentMemberCtrl ] updateMember() userId: ${userId}, userData: ${JSON.stringify(
            userData
          )}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axios.put(
<<<<<<< HEAD
          `${this.BASIC_URL}${this.CurrentMember_EP}/${userId}`,
=======
          `${env.API_BASE_URL}/${this.CurrentMember_EP}/${userId}`,
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
          userData
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("멤버 업데이트 중 오류 발생:", error);
        return { error: error.message };
      }
    },
  },
};
