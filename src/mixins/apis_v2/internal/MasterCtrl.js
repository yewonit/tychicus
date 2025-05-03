import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";

export const MasterCtrl = {
  data() {
    return {
      // URL List
      Login: "/login",
      RefreshToken: "/refresh",
      User: "/users",
      Organization: "/organizations",
      Role: "/roles",
      UserHasRole: "/user-has-roles",
      ActivityCategory: "/activity-categories",
      Activity: "/activities",
      ActivityChild: "/activity-children",
      Attendance: "/attendances",
      File: "/files",
      ActivityHasFile: "/activity-has-files",
      ActivityChildHasFile: "/activity-child-has-files",
      Visitation: "/visitations",

      // Model List
      modelUser: {
        name: "",
        email: "",
        password: "",
        gender_type: "",
        birth_date: "",
        address: "",
        address_detail: "",
        is_address_public: "",
        sns_url: "",
        hobby: "",
        user_type: "",
        phone_number: "",
        is_phone_number_public: "",
        church_member_number: "",
        internship_field_idx: "",
        authority_idx: "",
      },
      modelOrganization: {
        session_id: "",
        organization_code: "",
        organization_name: "",
        organization_description: "",
        upper_organization_id: "",
        start_date: "",
        end_date: "",
      },
      modelRole: {
        role_name: "",
        organization_id: "",
      },
      modelUserHasRole: {
        user_id: "",
        role_id: "",
        organization_id: "",
        organization_code: "",
        session_id: "",
        role_start_date: "",
        role_end_date: "",
      },
      modelActivityCategory: {
        name: "",
        description: "",
        activityCategory: "",
      },
      modelActivity: {
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        activity_category_id: "",
        organizer_type: "",
        location: "",
        organizer_name: "",
        purpose: "",
        participants: "",
        organization_id: "",
      },
      modelActivityChild: {
        activity_id: "",
        activity_date: "",
        start_time: "",
        end_time: "",
        session_number: "",
        attendance: "",
        notes: "",
      },
      modelAttendance: {
        user_id: "",
        activity_id: "",
        attendance_status_id: "",
        activity_child_id: "",
      },
      modelFile: {
        file_for: "",
        file_name: "",
        file_title: "",
        file_description: "",
        file_path: "",
        file_size: "",
        file_type: "",
      },
      modelActivityHasFile: {
        activity_id: "",
        file_id: "",
      },
      modelActivityChildHasFile: {
        activity_child_id: "",
        file_id: "",
      },
    };
  },
  created() {
    // ToDo
    // [ ] Create 실패할 경우 처리정책 수립
  },
  mixins: [ModelCtrl],
  methods: {
    // Model BizNews
    // CREATE

    /**
     * @description [인증되지 않은 사용자] BizNews 생성 API
     * @param {String} url 요청 URL
     * @param {Object} model 생성에 사용할 모델 객체
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async openCreateData(url, model, showLog) {
      if (showLog) {
        console.log(
          `%c[ ${url} ]` +
            `%c[ Mixin : MasterCtrl ] openCreateBizNews() model:`,
          `color: #6495ED;`,
          `color: #6495ED;`,
          model
        );
      }
      const res = await this.openCreateModel(url, model, showLog);
      let returnData = res.data;
      if (returnData === null) {
        returnData = { result: 0 };
      }
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },

    // READ
    /**
     * @description [인증되지 않은 사용자] BizNews 전체 리스트 조회 API
     * @param {String} url 요청 URL
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Array} 조회 결과
     */
    async openReadDataList(url, showLog) {
      if (showLog) {
        console.log(
          `%c[ ${url} ]` + `%c[ Mixin : MasterCtrl ] openReadDataList()`,
          `color: #6495ED;`,
          `color: #6495ED;`
        );
      }
      const res = await this.openReadModel(url, "undefined", showLog);
      const returnData = res.data;
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },
    /**
     * @description [인증되지 않은 사용자] ID를 통한 BizNews 조회 API
     * @param {String} url 요청 URL
     * @param {Number} id 조회할 BizNews의 ID
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async openReadDataItemById(url, id, showLog) {
      if (showLog) {
        console.log(
          `%c[ ${url}/${id} ]` +
            `%c[ Mixin : MasterCtrl ] openReadDataItemById() id:`,
          `color: #6495ED;`,
          `color: #6495ED;`,
          id
        );
      }

      // URL에 ID를 포함시켜 요청합니다.
      const completeUrl = `${url}/${id}`;
      const res = await this.openReadModel(completeUrl, showLog);
      let returnData = res.data;

      if (returnData === null) {
        returnData = { result: 0 };
      }

      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }

      return returnData;
    },

    // UPDATE
    /**
     * @description [인증되지 않은 사용자] PK를 통한 BizNews 수정 API
     * @param {String} url 요청 URL
     * @param {Number} idOfTarget 수정할 BizNews의 PK
     * @param {Object} modelForUpdate 수정할 데이터 모델
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (object: 성공, {result:0}: 실패)
     */
    async openUpdateData(url, idOfTarget, modelForUpdate, showLog) {
      if (showLog) {
        console.log(
          `%c[ ${url} ]` +
            `%c[ Mixin : MasterCtrl ] openUpdateBizNews() idOfTarget:`,
          `color: #6495ED;`,
          `color: #6495ED;`,
          idOfTarget
        );
      }
      modelForUpdate.id = idOfTarget;
      const res = await this.openUpdateModel(url, modelForUpdate, showLog);

      let returnData = null;

      if (res.data) {
        returnData = res.data;
      } else {
        returnData = res;
      }

      if (returnData === null) {
        returnData = { result: 0 };
      }
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },

    // DELETE
    /**
     * @description [인증되지 않은 사용자] PK를 통한 BizNews 삭제 API
     * @param {String} url 요청 URL
     * @param {Number} idOfTarget 삭제 BizNews의 PK
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Boolean} 수행 결과 (1: 성공, 0: 실패)
     */
    async openDeleteData(url, idOfTarget, showLog) {
      if (showLog) {
        console.log(
          `%c[ ${url} ]` +
            `%c[ Mixin : MasterCtrl ] openDeleteBizNews() idOfTarget:`,
          `color: #6495ED;`,
          `color: #6495ED;`,
          idOfTarget
        );
      }
      console.log("여기를 지나가야해🙏🏻");
      let dataObject = {
        data: {
          id: idOfTarget,
        },
      };

      const res = await this.openDeleteModel(url, dataObject, showLog);
      let returnData = res.data;
      if (showLog) {
        console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
      }
      return returnData;
    },
  },
};
