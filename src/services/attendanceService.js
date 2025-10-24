/**
 * 출석 관리 서비스 레이어
 * @description AttendanceCtrl mixin의 API 호출을 명확한 서비스 함수로 래핑
 */

import { AttendanceCtrl } from '@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl';

/**
 * AttendanceCtrl 인스턴스 생성
 * Vue 컴포넌트가 아닌 순수 서비스에서도 API를 호출할 수 있도록 지원
 */
const attendanceService = {
  ...AttendanceCtrl,
  // mixin을 위한 더미 data
  data() {
    return {};
  },
  methods: AttendanceCtrl.methods,
};

/**
 * 활동 목록 조회
 * @param {number} organizationId - 조직 ID
 * @returns {Promise<Array>} 활동 목록
 * @description 조직의 모든 활동 정보를 조회합니다.
 */
export async function fetchActivities(organizationId) {
  try {
    return await attendanceService.methods.getActivities(organizationId);
  } catch (error) {
    console.error('활동 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 활동 템플릿 조회
 * @returns {Promise<Object>} 활동 템플릿 정보
 * @description 활동 템플릿 목록을 조회합니다.
 */
export async function fetchActivityTemplate() {
  try {
    return await attendanceService.methods.getActivityTemplate();
  } catch (error) {
    console.error('활동 템플릿 조회 실패:', error);
    throw error;
  }
}

/**
 * 출석 기록 생성
 * @param {number} organizationId - 조직 ID
 * @param {number} activityTemplateId - 활동 템플릿 ID
 * @param {Object} activityData - 활동 데이터
 * @param {Array} attendances - 출석 데이터 배열
 * @param {Object|null} imageInfo - 이미지 정보 (선택사항)
 * @returns {Promise<Object>} 생성 결과
 * @description 새로운 모임의 출석 정보를 기록합니다.
 */
export async function createAttendanceRecord(
  organizationId,
  activityTemplateId,
  activityData,
  attendances,
  imageInfo = null
) {
  try {
    return await attendanceService.methods.recordAttendance(
      organizationId,
      activityTemplateId,
      activityData,
      attendances,
      imageInfo
    );
  } catch (error) {
    console.error('출석 기록 생성 실패:', error);
    throw error;
  }
}

/**
 * 출석 정보 업데이트
 * @param {number} organizationId - 조직 ID
 * @param {number} activityId - 활동 ID
 * @param {number} activityInstanceId - 활동 인스턴스 ID
 * @param {Object} activityData - 활동 데이터
 * @param {Array} attendances - 출석 데이터 배열
 * @param {Object|null} imageInfo - 이미지 정보 (선택사항)
 * @returns {Promise<Object>} 업데이트 결과
 * @description 기존 모임의 출석 정보를 업데이트합니다.
 */
export async function updateAttendanceRecord(
  organizationId,
  activityId,
  activityInstanceId,
  activityData,
  attendances,
  imageInfo = null
) {
  try {
    return await attendanceService.methods.updateAttendance(
      organizationId,
      activityId,
      activityInstanceId,
      activityData,
      attendances,
      imageInfo
    );
  } catch (error) {
    console.error('출석 정보 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 활동 인스턴스 삭제
 * @param {number} organizationId - 조직 ID
 * @param {number} activityId - 활동 ID
 * @param {number} activityInstanceId - 활동 인스턴스 ID
 * @returns {Promise<Object>} 삭제 결과
 * @description 특정 모임 기록을 삭제합니다.
 */
export async function deleteActivityInstance(
  organizationId,
  activityId,
  activityInstanceId
) {
  try {
    return await attendanceService.methods.deleteActivityInstance(
      organizationId,
      activityId,
      activityInstanceId
    );
  } catch (error) {
    console.error('활동 인스턴스 삭제 실패:', error);
    throw error;
  }
}

/**
 * 활동 인스턴스 상세 조회
 * @param {number} organizationId - 조직 ID
 * @param {number} activityId - 활동 ID
 * @param {number} activityInstanceId - 활동 인스턴스 ID
 * @returns {Promise<Object>} 활동 인스턴스 상세 정보
 * @description 특정 모임의 상세 정보를 조회합니다.
 */
export async function fetchActivityInstanceDetails(
  organizationId,
  activityId,
  activityInstanceId
) {
  try {
    return await attendanceService.methods.getActivityInstanceDetails(
      organizationId,
      activityId,
      activityInstanceId
    );
  } catch (error) {
    console.error('활동 인스턴스 상세 조회 실패:', error);
    throw error;
  }
}

/**
 * 조직 멤버 목록 조회
 * @param {number} organizationId - 조직 ID
 * @returns {Promise<Object>} 조직 멤버 목록
 * @description 특정 조직의 모든 멤버 정보를 조회합니다.
 */
export async function fetchOrganizationMembers(organizationId) {
  try {
    return await attendanceService.methods.getOrganizationMembers(
      organizationId
    );
  } catch (error) {
    console.error('조직 멤버 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * TODO: 추가 개선사항
 * - 에러 핸들링 강화 (특정 에러 타입별 처리)
 * - 재시도 로직 추가
 * - 캐싱 메커니즘 구현
 * - 요청 취소 기능 (AbortController)
 */
