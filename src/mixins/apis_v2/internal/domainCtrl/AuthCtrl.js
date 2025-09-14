import env from "@/config/environments.js";
import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";

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
    /**
     * @description [인증된 사용자] 이름을 통한 사용자 존재 여부 확인 API
     * @param {String} name 확인할 사용자의 이름
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckUserName(name, showLog) {
      // 1. 입력값 검증 및 로깅

      if (!name) {
        return { result: 0, message: "이름이 필요합니다." };
      }

      try {
        // 2. API 요청 준비 로깅
        const encodedName = encodeURIComponent(name);
        const requestUrl = `${env.API_BASE_URL}/${this.User_EP}/name`;

        const res = await axios.get(requestUrl, {
          params: { name: encodedName },
          timeout: 8000, // 8초 타임아웃 설정
        });

        if (res.data) {
          // 동명이인 처리: 백엔드에서 userList 배열을 반환하는 경우
          if (res.data.userList && Array.isArray(res.data.userList)) {
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
          return { result: 0, message: "응답 데이터가 없습니다." };
        }
      } catch (error) {
        // 5. 상세 에러 처리 및 로깅

        if (error.code === "ECONNABORTED") {
          return { result: 0, message: "서버 응답 시간 초과" };
        }

        if (error.response) {
          if (error.response.status === 404) {
            return { result: 0, message: "사용자를 찾을 수 없습니다." };
          }

          return {
            result: 0,
            message: `서버 에러 (${error.response.status}): ${error.response.statusText}`,
          };
        } else if (error.request) {
          return { result: 0, message: "서버에 연결할 수 없습니다." };
        } else {
          // 요청 설정 중 에러가 발생한 경우
          return { result: 0, message: "요청 준비 중 오류가 발생했습니다." };
        }
      }
    },

    /**
     * @description [인증된 사용자] 전화번호를 통한 사용자 일치 여부 확인 API
     * @param {Object} userInfo 사용자 정보 객체 (name: 이름, phoneNumber: 전화번호)
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckPhoneNumber(userInfo, showLog) {
      const res = await axios.post(
        `${env.API_BASE_URL}/${this.User_EP}/phone-number`,
        userInfo
      );
      let returnData = res.data;
      return returnData;
    },
  },
};
