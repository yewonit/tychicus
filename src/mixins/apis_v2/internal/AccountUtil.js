/**
 * @description NEO CORE 믹스인
 */
import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl';
import { Utility } from '@/mixins/apis_v2/utility/Utility';

export const AccountUtil = {
  data() {
    return {};
  },
  created() {},
  mixins: [MasterCtrl, AWSS3Ctrl, Utility],
  methods: {
    // CREATE FIEL
    // USER
    /**
     * @description 유저 파일을 생성한다.
     * @param {String} name 유저 아이디
     * @param {String} email 유저 이메일
     * @param {boolean} showLog 로그를 출력할지 여부
     * @returns {Object} 생성된 파일 객체
     */
    async findAccountEmail(name, phoneNumber, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: AccountUtil ] findAccountEmail()`,
          `color:#6495ED;`
        );
        console.log(`%cname :`, `color:#6495ED;`, name);
        console.log(`%cphoneNumber :`, `color:#6495ED;`, phoneNumber);
      }
      // 1.1. 정보 조회를 위한 데이터 오브젝트 생성
      let paramsObject = {
        params: {
          name: name,
          phone_number: phoneNumber,
        },
      };
      // 1.2. (File) 파일정보를 생성한다
      console.log(`this.Account :`, this.Account);
      const res = await this.openReadModel(this.Account, paramsObject, showLog);

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      if (showLog) {
        console.log(`%c[ res ] :`, `color: #6495ED;`, res);
      }

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let returnData = res.data;
      if (returnData === null) {
        returnData = 0;
      }
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      return returnData;
    },
    /**
     * @description 유저 파일을 생성한다.
     * @param {String} email 유저 이메일
     * @param {boolean} showLog 로그를 출력할지 여부
     * @returns {Object} 생성된 파일 객체
     */
    async resetAccountPasswordCheckEmail(email, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: AccountUtil ] resetAccountPasswordCheckEmail()`,
          `color:#6495ED;`
        );
        console.log(`%cemail :`, `color:#6495ED;`, email);
      }
      // 1.1. 정보 조회를 위한 데이터 오브젝트 생성
      let paramsObject = {
        params: {
          email: email,
        },
      };
      // 1.2. (File) 파일정보를 생성한다
      console.log(`this.ResetPassword :`, this.ResetPassword);
      const res = await this.openReadModel(
        this.ResetPassword,
        paramsObject,
        showLog
      );

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      if (showLog) {
        console.log(`%c[ res ] :`, `color: #6495ED;`, res);
      }

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let returnData = res.data;
      if (returnData === null) {
        returnData = 0;
      }
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      return returnData;
    },
    async resetAccountPassword(userId, userEmail, userPassword, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: AccountUtil ] resetAccountPassword()`,
          `color:#6495ED;`
        );
        console.log(`%cuserId :`, `color:#6495ED;`, userId);
        console.log(`%cemail :`, `color:#6495ED;`, userEmail);
        console.log(`%cuserPassword :`, `color:#6495ED;`, userPassword);
      }
      // 1.1. 정보 조회를 위한 데이터 오브젝트 생성
      let tempUserModel = {
        id: userId,
        email: userEmail,
        password: userPassword,
      };
      // 1.2. (File) 파일정보를 생성한다
      console.log(`this.ResetPasswordOutside :`, this.ResetPasswordOutside);
      const res = await this.openUpdateData(
        this.ResetPasswordOutside,
        userId,
        tempUserModel,
        showLog
      );

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      if (showLog) {
        console.log(`%c[ res ] :`, `color: #6495ED;`, res);
      }

      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let returnData = null;
      if (res.data) {
        returnData = res.data;
      } else {
        returnData = res;
      }
      if (returnData === null) {
        returnData = 0;
      }
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      return returnData;
    },
  },
};

// yglee2601@gmai.com
