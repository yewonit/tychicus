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
    async getActivities(organizationId = null, showLog = false) {
      try {
        let url = `/${this.Activity_EP}?organizationId=${organizationId}`;
        
        const res = await axiosClient.api.get(url);
        let returnData = res.data;
        
        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }
        
        // 데이터 가공 처리
        return this.processActivitiesData(returnData);
      } catch (error) {
        console.error('활동 정보 조회 중 오류 발생:', error);
        return { result: 0 };
      }
    },

    /**
     * @description 활동 데이터를 가공하는 공통 메서드
     * @param {Object} responseData API 응답 데이터
     * @returns {Array} 가공된 활동 데이터
     */
    processActivitiesData(responseData) {
      let activities = [];
      
      // 응답 데이터 구조 검증 및 추출
      if (responseData && responseData.activities && Array.isArray(responseData.activities)) {
        activities = responseData.activities;
      } else if (Array.isArray(responseData)) {
        activities = responseData;
      } else {
        console.warn("활동 데이터 형식이 올바르지 않습니다:", responseData);
        return [];
      }

      // 기본 데이터 매핑 및 정규화
      return activities.map(activity => this.normalizeActivityData(activity));
    },

    /**
     * @description 활동 데이터를 정규화하는 메서드
     * @param {Object} activity 원본 활동 데이터
     * @returns {Object} 정규화된 활동 데이터
     */
    normalizeActivityData(activity) {
      return {
        id: activity.id,
        name: activity.name || "",
        description: activity.description || "",
        location: activity.location || "",
        startDateTime: activity.start_time || activity.startDateTime || activity.start_datetime || "",
        
        // 출석 데이터 정규화
        attendances: this.normalizeAttendances(activity.attendances || []),
        
        // 인스턴스 데이터 (있는 경우)
        instances: activity.instances || [],
        
        // 기타 원본 데이터 보존
        ...activity
      };
    },

    /**
     * @description 출석 데이터를 정규화하는 메서드
     * @param {Array} attendances 원본 출석 데이터
     * @returns {Array} 정규화된 출석 데이터
     */
    normalizeAttendances(attendances) {
      if (!Array.isArray(attendances)) return [];
      
      return attendances.map(attendance => ({
        id: attendance.id,
        userId: attendance.User?.id || attendance.userId || attendance.user_id,
        userName: attendance.User?.name || attendance.userName || attendance.user_name,
        userEmail: attendance.User?.email || attendance.userEmail || attendance.user_email,
        status: attendance.attendance_status || attendance.status || "",
        note: attendance.description || attendance.note || "",
        // 백엔드에서 제공하지 않는 필드들 (필요)
        // check_in_time: null, // 필요
        // filePath: null, // 필요
      }));
    },



    /**
     * @description 대시보드용 활동 데이터 가공 메서드
     * @param {Array} activities 정규화된 활동 데이터
     * @param {Object} organization 조직 정보
     * @param {Function} identifyMeetingType 모임 유형 식별 함수
     * @param {Object} meetingTypes 모임 유형 매핑 객체
     * @returns {Array} 대시보드용 가공된 활동 데이터
     */
    processActivitiesForDashboard(activities, organization, identifyMeetingType, meetingTypes) {
      return activities.map(activity => {
        // 모임 유형 식별 및 분류
        const meetingType = identifyMeetingType(activity.name || activity.type || "");
        
        // 인스턴스 정보가 있는지 확인
        const hasInstances = activity.instances && 
                           Array.isArray(activity.instances) && 
                           activity.instances.length > 0;

        return {
          ...activity,
          meetingType: meetingType,
          meetingTypeName: meetingTypes[meetingType] || "기타",
          organizationId: organization.id,
          organizationName: organization.organization_name,
          date: activity.startDateTime,
        };
      });
    },

    /**
     * @description 모임 히스토리용 활동 데이터 가공 메서드
     * @param {Array} activities 정규화된 활동 데이터
     * @param {Number} orgId 조직 ID
     * @param {Function} getOrganizationName 조직명 조회 함수
     * @param {Function} formatMeetingTime 모임 시간 포맷 함수
     * @param {Function} formatAttendances 출석 데이터 포맷 함수
     * @returns {Array} 모임 히스토리용 가공된 모임 데이터
     */
    processActivitiesForMeetingHistory(activities, orgId, getOrganizationName, formatMeetingTime, formatAttendances) {
      return activities.flatMap(activity => {
          // 출석 및 결석 인원 계산
          const attendances = activity.attendances || [];
          const presentCount = attendances.filter(a => a.status === "출석").length;
          const absentCount = attendances.filter(a => a.status === "결석").length;
          const lateCount = attendances.filter(a => a.status === "지각").length;

          return {
            id: activity.id,
            organization_id: orgId,
            organization_name: getOrganizationName(orgId),
            activity_name: activity.name,
            meeting_date: activity.startDateTime || null,
            meeting_time: formatMeetingTime(
              activity.startDateTime || null
            ),
            location: activity.location || "-",
            present_count: presentCount,
            absent_count: absentCount,
            late_count: lateCount,
            attendances: formatAttendances(attendances),
            image: activity.images && activity.images.length > 0
              ? activity.images[0].path
              : require("@/assets/images/basic_image.png"),
          };
        }
      );
    },

    async getActivityTemplate() {
      try {
        const res = await axiosClient.api.get(`/${this.Activity_EP}/templates`);
        return res.data;
      } catch (error) {
        console.error("활동 템플릿 정보 조회 중 오류 발생: ", error);
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
