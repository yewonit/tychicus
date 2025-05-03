import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";
<<<<<<< HEAD
=======
import env from "@/config/environments.js";
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b

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
<<<<<<< HEAD

      // Base URL
      BASIC_URL: "https://attendance.icoramdeo.com/api/",
      // BASIC_URL: "https://attendance-dev.icoramdeo.com/api/",
      // BASIC_URL: "http://localhost:3000/api/",
=======
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
    };
  },
  created() {},
  mixins: [ModelCtrl],
  methods: {
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
<<<<<<< HEAD
        const requestUrl = `${this.BASIC_URL}${this.User_EP}/name`;
=======
        const requestUrl = `${env.API_BASE_URL}/${this.User_EP}/name`;
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b

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
            console.log(`${logPrefix} �� 사용자를 찾을 수 없습니다.`);
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
<<<<<<< HEAD
        `${this.BASIC_URL}/${this.User_EP}/phone-number`,
=======
        `${env.API_BASE_URL}/${this.User_EP}/phone-number`,
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
        userInfo
      );
      let returnData = res.data;
      // 콘솔에 retrunData 표시

      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },
  },
};
