import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";
import env from "@/config/environments.js";

export const AuthCtrl = {
  data() {
    return {
      // URL List
      User_EP: "users",

      // Model List
      modelUser: {
        name: "",
        name_suffix: "",
        email: "",
        password: "",
        gender_type: "",
        birth_date: "",
        address: "",
        address_detail: "",
        city: "",
        state_province: "",
        country: "",
        zip_postal_code: "",
        is_address_public: "",
        sns_url: "",
        hobby: "",
        phone_number: "",
        is_phone_number_public: "",
        church_member_number: "",
        church_registration_date: "",
        is_deleted: "",
        creator_id: 0,
        updater_id: 0,
        creator_ip: "",
        updater_ip: "",
        access_service_id: "",
      },
    };
  },
  created() {},
  mixins: [ModelCtrl],
  methods: {
    // ...mapActions("auth", ["setUserData", "setAccessToken", "setRefreshToken"]),
    /**
     * @description [인증된 사용자] 이름을 통한 사용자 존재 여부 확인 API
     * @param {String} name 확인할 사용자의 이름
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckUserName(name, showLog) {
      const logPrefix = "[ authCheckUserName ]";

      // 1. 입력값 검증 및 로깅
      console.log(`${logPrefix} 함수 시작 ============================`);
      console.log(`${logPrefix} 파라미터 확인:`, { name, showLog });

      if (!name) {
        console.error(`${logPrefix} ❌ 이름이 제공되지 않았습니다.`);
        return { result: 0, message: "이름이 필요합니다." };
      }

      try {
        // 2. API 요청 준비 로깅
        const encodedName = encodeURIComponent(name);
        const requestUrl = `${env.API_BASE_URL}/${this.User_EP}/name`;

        console.log(`${logPrefix} 📡 API 요청 정보:`, {
          url: requestUrl,
          method: "GET",
          params: { name: encodedName },
          originalName: name,
          encodedName: encodedName,
        });

        // 3. API 요청 실행
        console.log(`${logPrefix} ⏳ API 요청 시작...`);
        const startTime = performance.now();

        const res = await axios.get(requestUrl, {
          params: { name: encodedName },
          timeout: 8000, // 8초 타임아웃 설정
        });

        // 4. 응답 처리 및 로깅
        const endTime = performance.now();
        console.log(
          `${logPrefix} ⌛ API 응답 시간: ${(endTime - startTime).toFixed(2)}ms`
        );

        if (res.data) {
          console.log(`${logPrefix} ✅ API 응답 성공:`, res.data);

          // 동명이인 처리: 백엔드에서 userList 배열을 반환하는 경우
          if (res.data.userList && Array.isArray(res.data.userList)) {
            console.log(
              `${logPrefix} 👥 동명이인 발견:`,
              res.data.userList.length,
              "명"
            );

            // 동명이인이 있는 경우 (2명 이상)
            if (res.data.userList.length > 1) {
              return {
                result: 1,
                message: "이름이 있습니다.",
                hasDuplicates: true,
                userList: res.data.userList,
              };
            }
            // 동명이인이 없는 경우 (1명만 있음)
            else if (res.data.userList.length === 1) {
              return {
                result: 1,
                message: "이름이 있습니다.",
                hasDuplicates: false,
                userData: res.data.userList[0],
              };
            }
            // 해당 이름의 사용자가 없는 경우
            else {
              return { result: 0, message: "이름이 없습니다." };
            }
          }
          // 기존 응답 형식 처리 (하위 호환성 유지)
          else {
            return res.data;
          }
        } else {
          console.warn(`${logPrefix} ⚠️ API 응답이 비어있습니다.`);
          return { result: 0, message: "응답 데이터가 없습니다." };
        }
      } catch (error) {
        // 5. 상세 에러 처리 및 로깅
        console.error(`${logPrefix} 🚨 에러 발생 ============================`);

        if (error.code === "ECONNABORTED") {
          console.error(
            `${logPrefix} ⌛ 요청 시간 초과 (${error.config.timeout}ms)`
          );
          return { result: 0, message: "서버 응답 시간 초과" };
        }

        if (error.response) {
          // 서버가 응답을 반환한 경우
          console.error(`${logPrefix} 서버 응답 에러:`, {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
          });

          if (error.response.status === 404) {
            console.log(`${logPrefix} 사용자를 찾을 수 없습니다.`);
            return { result: 0, message: "사용자를 찾을 수 없습니다." };
          }

          return {
            result: 0,
            message: `서버 에러 (${error.response.status}): ${error.response.statusText}`,
          };
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error(`${logPrefix} 네트워크 에러:`, {
            message: error.message,
            config: {
              url: error.config.url,
              method: error.config.method,
              timeout: error.config.timeout,
            },
          });
          return { result: 0, message: "서버에 연결할 수 없습니다." };
        } else {
          // 요청 설정 중 에러가 발생한 경우
          console.error(`${logPrefix} 요청 설정 에러:`, error.message);
          return { result: 0, message: "요청 준비 중 오류가 발생했습니다." };
        }
      } finally {
        console.log(`${logPrefix} 함수 종료 ============================\n`);
      }
    },

    /**
     * @description [인증된 사용자] 전화번호를 통한 사용자 일치 여부 확인 API
     * @param {Object} userInfo 사용자 정보 객체 (name: 이름, phoneNumber: 전화번호)
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckPhoneNumber(userInfo, showLog) {
      if (showLog) {
        console.log(
          `%c[ Mixin : MasterCtrl ] authCheckPhoneNumber() userInfo: ${JSON.stringify(
            userInfo
          )}`,
          `color: #6495ED;`
        );
      }
      const res = await axios.post(
        `${env.API_BASE_URL}/${this.User_EP}/phone-number`,
        userInfo
      );
      let returnData = res.data;
      // 콘솔에 retrunData 표시

      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },

    /**
     * @description 로그인 API 호출
     * @param {String} email 사용자 이메일
     * @param {String} password 사용자 비밀번호
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authLogin(email, password) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/login`;
        const requestData = { email, password };
        const res = await axios.post(requestUrl, requestData, {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log("응답 : " + JSON.stringify(res.data));

        if (res.data) {
          // 로그인 성공 시 사용자 정보 저장
          this.setUserData(res.data.user);
          this.setAccessToken(res.data.tokens.accessToken);
          this.setRefreshToken(res.data.tokens.refreshToken);
          return {
            success: true,
            message: "로그인에 성공했습니다.",
          };
        } else {
          return { success: false, message: "로그인 오류" };
        }
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 401) {
          return {
            success: false,
            message: error.response.data.error.message,
            // error: message: "패스워드가 일치하지 않습니다." name: "AuthenticationError"
          };
        }
        return {
          success: false,
          message: `서버 에러 (${error.response.status}): ${error.response.statusText}`,
        };
      }
    },

    async authTokenCheck(accessToken, refreshToken) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/login`;
        const res = await axios.get(requestUrl, {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("authTokenCheck 리턴 : " + JSON.stringify(res.data));

        if (res.data) {
          // 테스트 주석
          // throw new Error("강제 오류 호출");
          return {
            success: true,
            user: res.data.user,
            message: "로그인에 성공했습니다.",
          };
        } else {
          throw new Error({ success: false, message: "사용불가능한 토큰" });
        }
      } catch (error) {
        console.log("3. 만료된 토큰인가봐요. authRefreshToken 호출");
        return await this.authRefreshToken(refreshToken);
      }
    },

    async authRefreshToken(refreshToken) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/refresh`;
        const requestData = { refreshToken };
        const res = await axios.post(requestUrl, requestData, {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log("authRefreshToken 리턴 : " + JSON.stringify(res.data));

        if (res.data) {
          console.log("3-1. 토큰 Refresh 성공");
          this.setAccessToken(res.data.accessToken);
          this.setRefreshToken(res.data.refreshToken);
          return {
            success: true,
            message: "로그인에 성공했습니다.",
          };
        } else {
          console.log("3-2. 토큰 Refresh 실패");
          return { success: false, message: "Token Refresh Error" };
        }
      } catch (error) {
        console.log("3-2. 토큰 Refresh 실패");
        return {
          success: false,
          message: `서버 에러 (${error.response.status}): ${error.message}`,
        };
      }
    },

    async authCheckEmail(email) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/code`;
        const res = await axios.post(requestUrl, { email });

        if (res.status === 204) {
          return { result: 1, message: "인증번호 전송 완료" };
        } else {
          return { result: 0, message: "인증번호 전송 오류" };
        }
      } catch (error) {
        console.error("인증번호 전송 오류:", error);
        return { result: 0, message: "인증번호 전송 중 오류가 발생했습니다." };
      }
    },

    async authVerifyCode(email, code) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/verify`;
        const res = await axios.post(requestUrl, { email, code });

        if (res.data) {
          return { result: 1, message: "인증 코드가 유효합니다." };
        } else {
          return { result: 0, message: "인증 코드가 유효하지 않습니다." };
        }
      } catch (error) {
        console.error("인증 코드 확인 중 오류 발생:", error);
        return { result: 0, message: "인증 코드 확인 중 오류가 발생했습니다." };
      }
    },

    /**
     * @description 이메일 중복 확인 API
     * @param {String} email 확인할 이메일 주소
     * @returns {Object} 조회 결과 ({"message": "이메일 사용 가능","email": "icetime963@gmail.com"})
     */
    async authCheckEmailDuplication(email) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/check-email`;
        const res = await axios.get(
          requestUrl,
          {
            params: { email },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data) {
          return { result: 0, message: res.data.message };
        } else {
          return { result: 1, message: "이메일 중복 체크 오류입니다." };
        }
      } catch (error) {
        if (error.response.data.error.name === "DataConflictError") {
          return {
            result: 1,
            message: "이미 같은 email로 등록된 유저가 있습니다.",
          };
        } else {
          return {
            result: 1,
            message: "이메일 중복 체크 오류입니다.",
          };
        }
      }
    },

    /**
     * @description 사용자 등록 API
     * @param {Object} userData 사용자 등록 정보 (id: 사용자 ID, email: 이메일, password: 비밀번호)
     * @returns {Object} 등록 결과 (success: true/false, message: 결과 메시지)
     */
    async authRegister(userData) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/register`;
        const res = await axios.post(requestUrl, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data) {
          return {
            success: true,
            message: "사용자 등록이 완료되었습니다.",
            data: res.data,
          };
        } else {
          return {
            success: false,
            message: "사용자 등록 중 오류가 발생했습니다.",
          };
        }
      } catch (error) {
        console.error("사용자 등록 오류:", error);

        if (error.response) {
          // 서버에서 응답을 받은 경우
          return {
            success: false,
            message:
              error.response.data.message ||
              "사용자 등록 중 오류가 발생했습니다.",
            error: error.response.data,
          };
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          return {
            success: false,
            message: "서버에 연결할 수 없습니다.",
          };
        } else {
          // 요청 설정 중 에러가 발생한 경우
          return {
            success: false,
            message: "요청 준비 중 오류가 발생했습니다.",
          };
        }
      }
    },

    async authResetPassword(userData) {
      try {
        const requestUrl = `${env.AUTH_BASE_URL}/reset-password`;
        const res = await axios.post(requestUrl, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res) {
          return { result: true, message: "비밀번호가 설정되었습니다." };
        }
      } catch (e) {
        console.error(e);
        console.error(e.error.message);
        return { result: false, message: e.error.message };
      }
    },
  },
};
