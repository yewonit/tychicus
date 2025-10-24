/**
 * 활동 기본값 설정
 * @description 각 활동 유형별 기본 시간, 장소, 메모, 권장 요일 등을 관리
 */

/**
 * 활동별 기본값 객체
 * @type {Object.<string, {startTime: string, endTime: string, location: string, notes: string, dayOfWeek: number}>}
 * @property {string} startTime - 기본 시작 시간 (HH:mm 형식)
 * @property {string} endTime - 기본 종료 시간 (HH:mm 형식)
 * @property {string} location - 기본 장소
 * @property {string} notes - 기본 메모
 * @property {number} dayOfWeek - 권장 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
 */
export const ACTIVITY_DEFAULTS = {
  주일2부예배: {
    startTime: '10:00',
    endTime: '11:30',
    location: '커버넌트홀',
    notes: '예원교회 주일 2부예배',
    dayOfWeek: 0, // 일요일
  },
  주일3부예배: {
    startTime: '12:00',
    endTime: '13:20',
    location: '커버넌트홀',
    notes: '예원교회 주일 3부예배',
    dayOfWeek: 0, // 일요일
  },
  청년예배: {
    startTime: '14:30',
    endTime: '16:30',
    location: '커버넌트홀',
    notes: '예원교회 코람데오 청년선교회 예배',
    dayOfWeek: 0, // 일요일
  },
  수요예배: {
    startTime: '20:00',
    endTime: '20:50',
    location: '드림홀',
    notes: '예원교회 수요예배',
    dayOfWeek: 3, // 수요일
  },
  금요예배: {
    startTime: '20:20',
    endTime: '22:10',
    location: '커버넌트홀',
    notes: '예원교회 금요예배',
    dayOfWeek: 5, // 금요일
  },
  수요청년예배: {
    startTime: '21:20',
    endTime: '22:10',
    location: '스카이아트홀',
    notes: '그리스도의 제자로 복음을 더욱 깊이 각인하는 시간',
    dayOfWeek: 3, // 수요일
  },
  금요청년예배: {
    startTime: '22:20',
    endTime: '23:20',
    location: '스카이아트홀',
    notes: '두란노의 응답 받아 성경적 전도운동의 증인으로 서는 시간',
    dayOfWeek: 5, // 금요일
  },
};

/**
 * 활동 이름으로 기본값 조회
 * @param {string} activityName - 활동 이름
 * @returns {Object|null} 기본값 객체 또는 null
 */
export function getActivityDefaults(activityName) {
  return ACTIVITY_DEFAULTS[activityName] || null;
}

/**
 * 활동의 권장 요일 조회
 * @param {string} activityName - 활동 이름
 * @returns {number|null} 권장 요일 (0-6) 또는 null
 */
export function getRecommendedDayOfWeek(activityName) {
  const defaults = getActivityDefaults(activityName);
  return defaults?.dayOfWeek ?? null;
}

/**
 * 활동 이름 표시용 매핑
 * @description 내부 이름을 사용자에게 보여줄 이름으로 변환
 */
export const ACTIVITY_DISPLAY_NAMES = {
  현장치유팀사역: '두란노사역자모임',
};

/**
 * 활동 표시 이름 조회
 * @param {string} activityName - 내부 활동 이름
 * @returns {string} 표시할 활동 이름
 */
export function getActivityDisplayName(activityName) {
  // 괄호 안의 내용 제거 (예: "주일예배 (오전)" -> "주일예배")
  const baseName = activityName.split(' (')[0];
  return ACTIVITY_DISPLAY_NAMES[baseName] || baseName;
}

/**
 * 제외할 활동 목록
 * @description 목록에서 숨기고 싶은 활동들
 */
export const EXCLUDED_ACTIVITIES = ['금요예배', '수요예배', '주일2부예배'];

/**
 * 활동이 제외 목록에 포함되는지 확인
 * @param {string} activityName - 활동 이름
 * @returns {boolean} 제외 대상이면 true
 */
export function isExcludedActivity(activityName) {
  return EXCLUDED_ACTIVITIES.includes(activityName);
}

/**
 * 활동 목록 필터링 및 포맷팅
 * @param {Array} activities - 원본 활동 목록
 * @returns {Array} 필터링되고 포맷된 활동 목록
 * @description
 * - 제외 목록에 있는 활동 필터링
 * - 표시 이름으로 변환
 * - 카테고리 정보 추가
 */
export function formatActivitiesForDisplay(activities) {
  if (!Array.isArray(activities)) return [];

  return activities
    .filter((activity) => !isExcludedActivity(activity.name))
    .map((activity) => ({
      ...activity,
      name: getActivityDisplayName(activity.name),
      displayName: getActivityDisplayName(activity.name),
    }));
}

