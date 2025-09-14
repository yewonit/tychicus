import env from "@/config/environments";
import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";

export const AttendanceCtrl = {
  data() {
    return {
      // URL List
      Organization_EP: "organizations",
      Activity_EP: "activities",

      // Model List
      modelActivity: {
        id: 0,
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        organization_id: 0,
        is_deleted: false,
        creator_id: 0,
        updater_id: 0,
        creator_ip: "",
        updater_ip: "",
      },
    };
  },
  mixins: [ModelCtrl],
  methods: {
    /**
     * @description 조직의 모든 활동 정보를 가져오는 API
     * @param {Number} organizationId 조직 ID
     * @param {Boolean} showLog 조회 결과를 로그에 표시할지 여부
     * @returns {Array} 조직의 활동 목록 (array: 성공, {result:0}: 실패)
     */
    async getOrganizationActivities(organizationId, showLog) {
      if (showLog) {
        // [ Mixin : AttendanceCtrl ] getOrganizationActivities() organizationId: ${organizationId}
      }
      try {
        const res = await axios.get(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}/${this.Activity_EP}`
        );
        let returnData = res.data;
        if (showLog) {
        }
        return returnData;
      } catch (error) {
        return { result: 0 };
      }
    },

    /**
     * @description 활동 정보 생성 API
     * @param {Object} activityData 생성할 활동 정보
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 생성된 활동 정보 (object: 성공, {result:0}: 실패)
     */
    async createActivity(activityData, showLog) {
      try {
        const res = await axios.post(
          `${env.API_BASE_URL}/${this.Activity_EP}`,
          activityData
        );
        let returnData = res.data;
        if (showLog) {
        }
        return returnData;
      } catch (error) {
        return { result: 0 };
      }
    },

    /**
     * @description 활동 인스턴스에 대한 출석 기록 생성 API
     * @param {Number} organizationId 조직 ID
     * @param {Number} activityId 활동 ID
     * @param {Object} instanceData 활동 인스턴스 데이터
     * @param {Array} attendances 출석 데이터
     * @param {Object|null} imageInfo 이미지 정보 (선택적)
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 생성된 출석 정보 (object: 성공, {result:0}: 실패)
     */
    async recordAttendance(
      organizationId,
      activityId,
      instanceData,
      attendances,
      imageInfo = null,
      showLog = false
    ) {
      try {
        const instanceUrl = `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}/${this.Activity_EP}/${activityId}/attendance`;

        const requestData = {
          instanceData,
          attendances,
          imageInfo,
        };

        const res = await axios.post(instanceUrl, requestData);
        let returnData = res.data;
        return returnData;
      } catch (error) {
        return { result: 0, error: error.message };
      }
    },

    // 출석 데이터 생성을 위한 헬퍼 메서드
    createAttendanceData(userId, status, checkInTime, checkOutTime, note) {
      return {
        userId,
        status,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        note,
      };
    },

    /**
     * @description 활동 인스턴스 삭제 API
     * @param {Number} organizationId 조직 ID
     * @param {Number} activityId 활동 ID
     * @param {Number} activityInstanceId 활동 인스턴스 ID
     * @param {Boolean} showLog 삭제 결과를 로그에 표시할지 여부
     * @returns {Object} 삭제 결과 (object: 성공, {result:0}: 실패)
     */
    async deleteActivityInstance(
      organizationId,
      activityId,
      activityInstanceId,
      showLog = false
    ) {
      try {
        const deleteUrl = `${env.API_BASE_URL}/organizations/${organizationId}/activities/${activityId}/instances/${activityInstanceId}`;

        const res = await axios.delete(deleteUrl);
        let returnData = res.data;
        return returnData;
      } catch (error) {
        return { result: 0, error: error.message };
      }
    },

    /**
     * @description 활동 인스턴스 및 출석 정보 업데이트 API
     * @param {Number} organizationId 조직 ID
     * @param {Number} activityId 활동 ID
     * @param {Number} activityInstanceId 활동 인스턴스 ID
     * @param {Object} instanceData 인스턴스 데이터
     * @param {Array} attendances 출석 데이터
     * @param {Object|null} imageInfo 이미지 정보 (선택적)
     * @param {Boolean} showLog 업데이트 결과를 로그에 표시할지 여부
     * @returns {Object} 업데이트된 출석 정보 (object: 성공, {result:0}: 실패)
     */
    async updateAttendance(
      organizationId,
      activityId,
      activityInstanceId,
      instanceData,
      attendances,
      imageInfo = null,
      showLog = false
    ) {
      try {
        const updateUrl = `${env.API_BASE_URL}/organizations/${organizationId}/activities/${activityId}/instances/${activityInstanceId}/attendance`;

        const requestData = { instanceData, attendances, imageInfo };
        const res = await axios.put(updateUrl, requestData);
        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { result: 0, error: error.message };
      }
    },

    async getActivityInstanceDetails(
      organizationId,
      activityId,
      activityInstanceId,
      showLog = false
    ) {
      try {
        const url = `${env.API_BASE_URL}/organizations/${organizationId}/activities/${activityId}/instances/${activityInstanceId}`;
        const res = await axios.get(url);
        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { result: 0, error: error.message };
      }
    },

    async getOrganizationMembers(organizationId, showLog = false) {
      try {
        const url = `${env.API_BASE_URL}/organizations/${organizationId}/members`;
        const res = await axios.get(url);
        let returnData = res.data;
        return returnData;
      } catch (error) {
        return { result: 0, error: error.message };
      }
    },
  },
};
