/**
 * 활동 관련 유효성 검증 유틸리티
 * @description 활동 선택, 요일 검증 등 활동 관련 검증 로직
 */

import { dateTimeUtils } from './dateTimeUtils';
import { ACTIVITY_DEFAULTS, getActivityDisplayName } from './activityDefaults';
import dayjs from 'dayjs';

/**
 * 선택된 활동의 권장 요일 조회
 * @param {number} selectedActivityId - 선택된 활동 ID
 * @param {Array} activities - 활동 목록
 * @param {Object} activityDefaults - 활동 기본값 객체
 * @returns {number|null} 권장 요일 (0-6) 또는 null
 */
export function getRecommendedDayOfWeek(
  selectedActivityId,
  activities,
  activityDefaults = ACTIVITY_DEFAULTS
) {
  if (!selectedActivityId) return null;

  const activity = activities.find((a) => a.id === selectedActivityId);
  if (!activity || !activityDefaults[activity.name]) return null;

  return activityDefaults[activity.name].dayOfWeek;
}

/**
 * 권장 요일 텍스트 반환
 * @param {number} selectedActivityId - 선택된 활동 ID
 * @param {Array} activities - 활동 목록
 * @param {Object} activityDefaults - 활동 기본값 객체
 * @returns {string} 요일 텍스트 (예: "일요일")
 */
export function getRecommendedDayOfWeekText(
  selectedActivityId,
  activities,
  activityDefaults = ACTIVITY_DEFAULTS
) {
  const dayOfWeek = getRecommendedDayOfWeek(
    selectedActivityId,
    activities,
    activityDefaults
  );
  return dayOfWeek !== null ? dateTimeUtils.getDayOfWeekText(dayOfWeek) : '';
}

/**
 * 선택된 활동 이름 반환 (표시용)
 * @param {number} selectedActivityId - 선택된 활동 ID
 * @param {Array} activities - 활동 목록
 * @returns {string} 활동 이름
 */
export function getActivityName(selectedActivityId, activities) {
  if (!selectedActivityId) return '';

  const activity = activities.find((a) => a.id === selectedActivityId);
  if (!activity) return '';

  return getActivityDisplayName(activity.name);
}

/**
 * 선택된 날짜의 요일이 활동의 권장 요일과 일치하는지 검증
 * @param {string} selectedDate - 선택된 날짜 (YYYY-MM-DD)
 * @param {number} selectedActivityId - 선택된 활동 ID
 * @param {Array} activities - 활동 목록
 * @param {Object} activityDefaults - 활동 기본값 객체
 * @returns {Object} 검증 결과
 * @property {boolean} isValid - 유효한 요일인지 여부
 * @property {string} selectedActivityName - 선택된 활동 이름
 * @property {string} recommendedDayOfWeekText - 권장 요일 텍스트
 * @property {string} selectedDayOfWeekText - 선택된 요일 텍스트
 * @property {string} recommendedDate - 권장 날짜
 * @property {string} selectedDate - 선택된 날짜
 */
export function validateActivityDate(
  selectedDate,
  selectedActivityId,
  activities,
  activityDefaults = ACTIVITY_DEFAULTS
) {
  if (!selectedActivityId) {
    return { isValid: true };
  }

  const activity = activities.find((a) => a.id === selectedActivityId);
  if (!activity || !activityDefaults[activity.name]) {
    return { isValid: true };
  }

  const defaults = activityDefaults[activity.name];
  if (defaults.dayOfWeek === undefined) {
    return { isValid: true };
  }

  const date = dayjs(selectedDate);
  const dayOfWeek = date.day();

  if (dayOfWeek !== defaults.dayOfWeek) {
    // 불일치 - 경고 정보 반환
    return {
      isValid: false,
      selectedActivityName: getActivityDisplayName(activity.name),
      recommendedDayOfWeekText: dateTimeUtils.getDayOfWeekText(
        defaults.dayOfWeek
      ),
      selectedDayOfWeekText: dateTimeUtils.getDayOfWeekText(dayOfWeek),
      selectedDate: selectedDate,
      recommendedDate: dateTimeUtils.getNearestPastDate(defaults.dayOfWeek),
    };
  }

  return { isValid: true };
}

/**
 * 활동 선택 시 기본값 적용
 * @param {number} selectedActivityId - 선택된 활동 ID
 * @param {Array} activities - 활동 목록
 * @param {Object} activityDefaults - 활동 기본값 객체
 * @returns {Object|null} 적용할 기본값 객체
 * @property {string} meetingStartTime - 시작 시간
 * @property {string} meetingEndTime - 종료 시간
 * @property {string} meetingLocation - 장소
 * @property {string} meetingNotes - 메모
 * @property {string} meetingDate - 모임 날짜
 * @property {string} meetingStartDate - 시작 날짜
 * @property {string} meetingEndDate - 종료 날짜
 */
export function getActivityDefaults(
  selectedActivityId,
  activities,
  activityDefaults = ACTIVITY_DEFAULTS
) {
  if (!selectedActivityId) return null;

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  if (!selectedActivity || !activityDefaults[selectedActivity.name]) {
    return null;
  }

  const defaults = activityDefaults[selectedActivity.name];

  const result = {
    meetingStartTime: defaults.startTime,
    meetingEndTime: defaults.endTime,
    meetingLocation: defaults.location,
    meetingNotes: defaults.notes,
  };

  // 요일 정보가 있으면 해당 요일의 가장 최근 과거 날짜로 설정
  if (defaults.dayOfWeek !== undefined) {
    const meetingDate = dateTimeUtils.getNearestPastDate(defaults.dayOfWeek);
    result.meetingDate = meetingDate;
    result.meetingStartDate = meetingDate;

    // 자정을 넘기는 모임인지 확인
    if (
      dateTimeUtils.isOvernightMeeting(defaults.startTime, defaults.endTime)
    ) {
      result.meetingEndDate = dateTimeUtils.getNextDay(meetingDate);
    } else {
      result.meetingEndDate = meetingDate;
    }
  }

  return result;
}
