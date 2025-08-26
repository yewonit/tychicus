import { ModelCtrl } from '@/mixins/apis_v2/internal/core/ModelCtrl';
import axiosClient from '@/utils/axiosClient';
import { mapActions } from 'vuex';

export const AuthCtrl = {
  data() {
    return {
      // URL List
      User_EP: 'users',

      // Model List
      modelUser: {
        name: '',
        name_suffix: '',
        email: '',
        password: '',
        gender_type: '',
        birth_date: '',
        address: '',
        address_detail: '',
        city: '',
        state_province: '',
        country: '',
        zip_postal_code: '',
        is_address_public: '',
        sns_url: '',
        hobby: '',
        phone_number: '',
        is_phone_number_public: '',
        church_member_number: '',
        church_registration_date: '',
        is_deleted: '',
        creator_id: 0,
        updater_id: 0,
        creator_ip: '',
        updater_ip: '',
        access_service_id: '',
      },
    };
  },
  mixins: [ModelCtrl],
  methods: {
    ...mapActions('auth', ['setUserInfo', 'setAccessToken', 'setRefreshToken']),
    /**
     * @description [인증된 사용자] 이름을 통한 사용자 존재 여부 확인 API
     * @param {String} name 확인할 사용자의 이름
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckUserName(name) {
      if (!name) {
        return { result: 0, message: '이름이 필요합니다.' };
      }

      try {
        // 2. API 요청 준비 로깅
        const encodedName = encodeURIComponent(name);
        const requestUrl = `/${this.User_EP}/name`;

        const res = await axiosClient.auth.get(requestUrl, {
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
                message: '이름이 있습니다.',
                hasDuplicates: true,
                userList: res.data.userList,
              };
            }
            // 동명이인이 없는 경우 (1명만 있음)
            else if (res.data.userList.length === 1) {
              return {
                result: 1,
                message: '이름이 있습니다.',
                hasDuplicates: false,
                userData: res.data.userList[0],
              };
            }
            // 해당 이름의 사용자가 없는 경우
            else {
              return { result: 0, message: '이름이 없습니다.' };
            }
          }
          // 기존 응답 형식 처리 (하위 호환성 유지)
          else {
            return res.data;
          }
        } else {
          return { result: 0, message: '응답 데이터가 없습니다.' };
        }
      } catch (error) {
        // 5. 상세 에러 처리 및 로깅

        if (error.code === 'ECONNABORTED') {
          return { result: 0, message: '서버 응답 시간 초과' };
        }

        if (error.response) {
          if (error.response.status === 404) {
            return { result: 0, message: '사용자를 찾을 수 없습니다.' };
          }

          return {
            result: 0,
            message: `서버 에러 (${error.response.status}): ${error.response.statusText}`,
          };
        } else if (error.request) {
          return { result: 0, message: '서버에 연결할 수 없습니다.' };
        } else {
          return { result: 0, message: '요청 준비 중 오류가 발생했습니다.' };
        }
      }
    },

    /**
     * @description [인증된 사용자] 전화번호를 통한 사용자 일치 여부 확인 API
     * @param {Object} userInfo 사용자 정보 객체 (name: 이름, phoneNumber: 전화번호)
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async authCheckPhoneNumber(userInfo) {
      const res = await axiosClient.auth.post(
        `/${this.User_EP}/phone-number`,
        userInfo
      );
      let returnData = res.data;
      // 콘솔에 retrunData 표시
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
        const requestData = { email, password };
        const res = await axiosClient.auth.post('/login', requestData, {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (res.data) {
          // 로그인 성공 시 사용자 정보 저장
          this.setUserInfo(res.data.userData);
          this.setAccessToken(res.data.tokens.accessToken);
          this.setRefreshToken(res.data.tokens.refreshToken);
          return {
            success: true,
            message: '로그인에 성공했습니다.',
          };
        } else {
          return { success: false, message: '로그인 오류' };
        }
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 401) {
          return {
            success: false,
            message: error.response.data.error.message,
            // error: message: "패스워드가 일치하지 않습니다." name: "AuthenticationError"
          };
        }
        return { success: false, message: '로그인 오류입니다.' };
      }
    },

    async authTokenCheck(accessToken, refreshToken) {
      try {
        const res = await axiosClient.auth.get('/login', {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data) {
          // 테스트 주석
          // throw new Error("강제 오류 호출");
          return {
            success: true,
            user: res.data.user,
            message: '로그인에 성공했습니다.',
          };
        } else {
          throw new Error({ success: false, message: '사용불가능한 토큰' });
        }
      } catch (error) {
        return await this.authRefreshToken(refreshToken);
      }
    },

    async authRefreshToken(refreshToken) {
      try {
        const requestData = { refreshToken };
        const res = await axiosClient.auth.post('/refresh', requestData, {
          timeout: 8000, // 8초 타임아웃 설정
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (res.data) {
          this.setAccessToken(res.data.accessToken);
          this.setRefreshToken(res.data.refreshToken);
          return {
            success: true,
            message: '로그인에 성공했습니다.',
          };
        } else {
          return { success: false, message: 'Token Refresh Error' };
        }
      } catch (error) {
        return {
          success: false,
          message: `서버 에러 (${error.response.status}): ${error.message}`,
        };
      }
    },

    async authCheckEmail(email) {
      try {
        const res = await axiosClient.auth.post('/code', { email });

        if (res.status === 204) {
          return { result: 1, message: '인증번호 전송 완료' };
        } else {
          return { result: 0, message: '인증번호 전송 오류' };
        }
      } catch (error) {
        return { result: 0, message: '인증번호 전송 중 오류가 발생했습니다.' };
      }
    },

    async authVerifyCode(email, code) {
      try {
        const res = await axiosClient.auth.post('/verify', { email, code });

        if (res.data) {
          return { result: 1, message: '인증 코드가 유효합니다.' };
        } else {
          return { result: 0, message: '인증 코드가 유효하지 않습니다.' };
        }
      } catch (error) {
        return { result: 0, message: '인증 코드 확인 중 오류가 발생했습니다.' };
      }
    },

    /**
     * @description 이메일 중복 확인 API
     * @param {String} email 확인할 이메일 주소
     * @returns {Object} 조회 결과 ({"message": "이메일 사용 가능","email": "icetime963@gmail.com"})
     */
    async authCheckEmailDuplication(email) {
      try {
        const res = await axiosClient.auth.get(
          `/${this.User_EP}/email`,
          {
            params: { email },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.data) {
          return { result: 0, message: res.data.message };
        } else {
          return { result: 1, message: '이메일 중복 체크 오류입니다.' };
        }
      } catch (error) {
        if (error.response.data.error.name === 'DataConflictError') {
          return {
            result: 1,
            message: '이미 같은 email로 등록된 유저가 있습니다.',
          };
        } else {
          return {
            result: 1,
            message: '이메일 중복 체크 오류입니다.',
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
        const res = await axiosClient.auth.post('/register', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.data) {
          return {
            success: true,
            message: '사용자 등록이 완료되었습니다.',
            data: res.data,
          };
        } else {
          return {
            success: false,
            message: '사용자 등록 중 오류가 발생했습니다.',
          };
        }
      } catch (error) {
        if (error.response) {
          // 서버에서 응답을 받은 경우
          return {
            success: false,
            message:
              error.response.data.message ||
              '사용자 등록 중 오류가 발생했습니다.',
            error: error.response.data,
          };
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          return {
            success: false,
            message: '서버에 연결할 수 없습니다.',
          };
        } else {
          // 요청 설정 중 에러가 발생한 경우
          return {
            success: false,
            message: '요청 준비 중 오류가 발생했습니다.',
          };
        }
      }
    },

    async authResetPassword(userData) {
      try {
        const res = await axiosClient.auth.post('/reset-password', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res) {
          return { result: true, message: '비밀번호가 설정되었습니다.' };
        }
      } catch (e) {
        return { result: false, message: e.error.message };
      }
    },
  },
};
