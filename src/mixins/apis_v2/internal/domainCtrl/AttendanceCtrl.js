import { ModelCtrl } from '@/mixins/apis_v2/internal/core/ModelCtrl';
import axiosClient from '@/utils/axiosClient';

export const AttendanceCtrl = {
  data() {
    return {
      // URL List
      Organization_EP: 'organizations',
      Activity_EP: 'activities',

      // Model List
      modelActivity: {
        id: 0,
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        organization_id: 0,
        is_deleted: false,
        creator_id: 0,
        updater_id: 0,
        creator_ip: '',
        updater_ip: '',
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
    async getActivities(showLog) {
      try {
        const res = await axiosClient.api.get(`/${this.Activity_EP}`);
        let returnData = res.data;
        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }
        return returnData;
      } catch (error) {
        console.error('활동 정보 조회 중 오류 발생:', error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : AttendanceCtrl ] createActivity() activityData: ${JSON.stringify(
            activityData
          )}`,
          `color: #6495ED;`
        );
      }
      try {
        const res = await axiosClient.api.post(
          `/${this.Activity_EP}`,
          activityData
        );
        let returnData = res.data;
        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }
        return returnData;
      } catch (error) {
        console.error('활동 정보 생 중 오류 발생:', error);
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
      console.log('📥 recordAttendance 입력 파라미터:', {
        organizationId,
        activityId,
        instanceData,
        attendances,
        imageInfo,
        showLog,
      });

      if (showLog) {
        console.log(
          `%c🔍 [ Mixin : AttendanceCtrl ] recordAttendance() 호출됨`,
          `color: #6495ED; font-weight: bold;`
        );
        console.log(`🏢 organizationId: ${organizationId}`);
        console.log(`🎯 activityId: ${activityId}`);
      }
      try {
        const instanceUrl = `/${this.Activity_EP}?organizationId=${organizationId}&activityTemplateId=${activityId}`;
        console.log('🌐 활동 인스턴스 생성 URL:', instanceUrl);
        console.log('📦 instanceData:', instanceData);
        console.log('👥 attendances:', attendances);
        console.log('📸 imageInfo:', imageInfo);

        const requestData = {
          instanceData,
          attendances,
          imageInfo,
        };

        const res = await axiosClient.api.post(instanceUrl, requestData);
        let returnData = res.data;

        if (showLog) {
          console.log(
            `%c📊 출석 기록 결과:`,
            `color: #6495ED; font-weight: bold;`,
            returnData
          );
        }
        return returnData;
      } catch (error) {
        console.error('❌ 출석 정보 기록 중 오류 발생:', error);
        console.error(
          '오류 상세 정보:',
          error.response ? error.response.data : '응답 데이터 없음'
        );
        return { result: 0, error: error.message };
      }
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
      console.log('🗑️ deleteActivityInstance 호출됨:', {
        organizationId,
        activityId,
        activityInstanceId,
      });

      if (showLog) {
        console.log(
          `%c🔍 [ Mixin : AttendanceCtrl ] deleteActivityInstance() 호출됨`,
          `color: #6495ED; font-weight: bold;`
        );
      }

      try {
        const deleteUrl = `/activities/${activityInstanceId}`;
        console.log('🌐 활동 인스턴스 삭제 URL:', deleteUrl);

        const res = await axiosClient.api.delete(deleteUrl);
        let returnData = res.data;

        if (showLog) {
          console.log(
            `%c📊 활동 인스턴스 삭제 결과:`,
            `color: #6495ED; font-weight: bold;`,
            returnData
          );
        }
        return returnData;
      } catch (error) {
        console.error('❌ 활동 인스턴스 삭제 중 오류 발생:', error);
        console.error(
          '오류 상세 정보:',
          error.response ? error.response.data : '응답 데이터 없음'
        );
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
      if (showLog) {
        console.log(
          `%c🔄 [ Mixin : AttendanceCtrl ] updateAttendance() 호출됨`,
          `color: #6495ED; font-weight: bold;`
        );
      }

      try {
        const updateUrl = `/activities/${activityInstanceId}`;
        console.log('🌐 출석 정보 업데이트 URL:', updateUrl);
        console.log('📦 instanceData:', instanceData);
        console.log('👥 attendances:', attendances);
        console.log('📸 imageInfo:', imageInfo);

        const requestData = { instanceData, attendances, imageInfo };
        const res = await axiosClient.api.put(updateUrl, requestData);
        let returnData = res.data;

        if (showLog) {
          console.log(
            `%c📊 출석 정보 업데이트 결과:`,
            `color: #6495ED; font-weight: bold;`,
            returnData
          );
        }
        return returnData;
      } catch (error) {
        console.error('❌ 출석 정보 업데이트 중 오류 발생:', error);
        console.error(
          '오류 상세 정보:',
          error.response ? error.response.data : '응답 데이터 없음'
        );
        return { result: 0, error: error.message };
      }
    },

    async getActivityInstanceDetails(
      organizationId,
      activityId,
      activityInstanceId,
      showLog = false
    ) {
      if (showLog) {
        console.log(
          `%c🔍 [ Mixin : AttendanceCtrl ] getActivityInstanceDetails() 호출됨`,
          `color: #6495ED; font-weight: bold;`
        );
      }

      try {
        const url = `/activities/${activityInstanceId}`;
        const res = await axiosClient.api.get(url);
        let returnData = res.data;

        if (showLog) {
          console.log(
            `%c📊 활동 인스턴스 상세 정보:`,
            `color: #6495ED; font-weight: bold;`,
            returnData
          );
        }
        return returnData;
      } catch (error) {
        console.error('❌ 활동 인스턴스 상세 정보 조회 중 오류 발생:', error);
        return { result: 0, error: error.message };
      }
    },

    async getOrganizationMembers(organizationId, showLog = false) {
      if (showLog) {
        console.log(
          `%c🔍 [ Mixin : AttendanceCtrl ] getOrganizationMembers() 호출됨`,
          `color: #6495ED; font-weight: bold;`
        );
      }

      try {
        const url = `/organizations/${organizationId}/members`;
        const res = await axiosClient.api.get(url);
        let returnData = res.data;

        if (showLog) {
          console.log(
            `%c📊 조직 멤버 목록:`,
            `color: #6495ED; font-weight: bold;`,
            returnData
          );
        }
        return returnData;
      } catch (error) {
        console.error('❌ 조직 멤버 목록 조회 중 오류 발생:', error);
        return { result: 0, error: error.message };
      }
    },
  },
};
