/**
 * Vue 컴포넌트에서 공통으로 사용하는 헬퍼 함수 모음
 * @description Vue 파일 내 중복 메서드들을 모듈화한 유틸리티 함수들
 */

import { dateTimeUtils } from './dateTimeUtils';

/**
 * 내부 DateTime 객체 업데이트
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * Vue 컴포넌트의 시작/종료 날짜와 시간을 dayjs 객체로 변환하고,
 * 종료 시간이 시작 시간보다 이전인 경우 자동으로 조정합니다.
 * 
 * 필요한 data 속성:
 * - meetingStartDate: 시작 날짜 (YYYY-MM-DD)
 * - meetingEndDate: 종료 날짜 (YYYY-MM-DD)
 * - meetingStartTime: 시작 시간 (HH:mm)
 * - meetingEndTime: 종료 시간 (HH:mm)
 * - meetingStartDateTime: 시작 dayjs 객체 (자동 업데이트)
 * - meetingEndDateTime: 종료 dayjs 객체 (자동 업데이트)
 */
export function updateDateTime(context) {
  // 시작 시간 확인 및 기본값 설정
  const startTime = context.meetingStartTime || '00:00';
  const endTime = context.meetingEndTime || '00:00';

  // 내부 DateTime 객체 업데이트
  context.meetingStartDateTime = dateTimeUtils.createDateTime(
    context.meetingStartDate,
    startTime
  );

  context.meetingEndDateTime = dateTimeUtils.createDateTime(
    context.meetingEndDate,
    endTime
  );

  // 종료 시간이 시작 시간보다 이전인 경우
  if (context.meetingEndDateTime.isBefore(context.meetingStartDateTime)) {
    // 자정을 넘기는 모임인 경우 (같은 날짜에 시작 시간 > 종료 시간)
    if (
      context.meetingStartDate === context.meetingEndDate &&
      startTime > endTime
    ) {
      // 종료 날짜를 다음날로 자동 설정
      context.meetingEndDateTime = dateTimeUtils
        .createDateTime(context.meetingStartDate, endTime)
        .add(1, 'day');

      // UI 필드 업데이트
      context.meetingEndDate = context.meetingEndDateTime.format('YYYY-MM-DD');
    } else {
      // 그 외의 경우 - 종료 시간을 시작 시간 이후로 자동 설정 (1시간 후)
      context.meetingEndDateTime = context.meetingStartDateTime
        .clone()
        .add(1, 'hour');

      // UI 필드 업데이트
      context.meetingEndDate = context.meetingEndDateTime.format('YYYY-MM-DD');
      context.meetingEndTime = context.meetingEndDateTime.format('HH:mm');
    }
  }
}

/**
 * 시간 입력값 변경 시 유효성 검증
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 시작/종료 날짜와 시간의 유효성을 검증하고 DateTime 객체를 업데이트합니다.
 * 시간이 입력되지 않은 경우 기본값(00:00)으로 설정합니다.
 */
export function validateTimes(context) {
  // 필요한 입력값이 모두 있는지 확인
  if (!context.meetingStartDate || !context.meetingEndDate) {
    return;
  }

  // 시간이 입력되지 않은 경우 기본값 설정
  if (!context.meetingStartTime) context.meetingStartTime = '00:00';
  if (!context.meetingEndTime) context.meetingEndTime = '00:00';

  // 내부 DateTime 객체 업데이트
  updateDateTime(context);
}

/**
 * 모임 날짜 변경 시 시작/종료 날짜 업데이트
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 모임 날짜가 변경되면:
 * 1. 시작 날짜를 모임 날짜와 동기화
 * 2. 자정 넘김 여부에 따라 종료 날짜 자동 계산
 * 3. DateTime 객체 업데이트
 * 
 * 필요한 data 속성:
 * - meetingDate: 모임 날짜 (YYYY-MM-DD)
 * - meetingStartDate: 시작 날짜 (자동 업데이트)
 * - meetingEndDate: 종료 날짜 (자동 업데이트)
 * - meetingStartTime: 시작 시간 (HH:mm)
 * - meetingEndTime: 종료 시간 (HH:mm)
 */
export function updateMeetingDates(context) {
  if (context.meetingDateMenu !== undefined) {
    context.meetingDateMenu = false;
  }

  // 모임 날짜가 변경되면 시작 날짜도 변경
  context.meetingStartDate = context.meetingDate;

  // 시작 시간과 종료 시간이 설정되어 있는 경우에만 자정 넘김 확인
  if (context.meetingStartTime && context.meetingEndTime) {
    if (
      dateTimeUtils.isOvernightMeeting(
        context.meetingStartTime,
        context.meetingEndTime
      )
    ) {
      // 자정을 넘기는 모임인 경우 종료일은 다음날로 설정
      context.meetingEndDate = dateTimeUtils.getNextDay(context.meetingDate);
    } else {
      // 자정을 넘기지 않는 모임인 경우 종료일 = 시작일
      context.meetingEndDate = context.meetingDate;
    }
  } else {
    // 시간이 설정되지 않은 경우 기본적으로 종료일 = 시작일
    context.meetingEndDate = context.meetingDate;
  }

  // 내부 DateTime 객체 업데이트
  updateDateTime(context);
}

/**
 * 참가자 다이얼로그 열기
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 참가자 선택 다이얼로그를 엽니다.
 * 필요한 data 속성: participantsDialog
 */
export function openParticipantsDialog(context) {
  context.participantsDialog = true;
}

/**
 * 참가자 다이얼로그 닫기
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 참가자 선택 다이얼로그를 닫고 선택된 참가자 수를 계산합니다.
 * 필요한 data 속성:
 * - participantsDialog
 * - memberList (각 member는 isParticipating 속성 필요)
 * - numberOfParticipants (자동 업데이트)
 */
export function closeParticipantsDialog(context) {
  context.participantsDialog = false;
  context.numberOfParticipants = context.memberList.filter(
    (member) => member.isParticipating
  ).length;
  console.log('참여자 선택 후 memberList:', context.memberList);
}

/**
 * 로딩 상태 초기화
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 로딩 인디케이터 상태를 초기화합니다.
 * 필요한 data 속성: loadingState
 */
export function initLoadingState(context) {
  context.loadingState = {
    isLoading: true,
    currentStep: 0,
    totalSteps: 5,
    currentStepText: '준비 중...',
    progressPercent: 0,
    startTime: Date.now(),
    estimatedTimeLeft: null,
    hasLongDelay: false,
  };
}

/**
 * 로딩 상태 업데이트
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @param {number} step - 현재 단계 (1~5)
 * @param {string} text - 현재 단계 설명 텍스트
 * @param {number} progress - 진행률 (0~100)
 * @returns {void}
 * @description
 * 로딩 인디케이터의 상태와 진행률을 업데이트합니다.
 * 장시간 소요 시 hasLongDelay 플래그를 설정하여 사용자에게 알립니다.
 */
export function updateLoadingState(context, step, text, progress) {
  context.loadingState.currentStep = step;
  context.loadingState.currentStepText = text;
  context.loadingState.progressPercent = progress;

  // 단계 전환 시 진동 피드백 (모바일에서만 동작)
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(100);
  }

  // 장시간 소요 감지 (15초 이상)
  const currentTime = Date.now();
  const elapsedTime = (currentTime - context.loadingState.startTime) / 1000;

  if (elapsedTime > 15 && !context.loadingState.hasLongDelay) {
    context.loadingState.hasLongDelay = true;

    // 지연 감지 시 더 강한 진동 (모바일에서만 동작)
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 200]);
    }
  }
}

/**
 * 필드 수정 시작
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @param {string} field - 수정할 필드명
 * @returns {void}
 * @description
 * 지정된 필드의 입력 요소에 포커스를 주고 전체 선택합니다.
 * 필요한 data 속성: editingField
 * 필요한 refs: 필드명과 동일한 ref
 */
export function startEditingField(context, field) {
  context.editingField = field;
  context.$nextTick(() => {
    const input = context.$refs[field]?.[0] || context.$refs[field];
    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  });
}

/**
 * 필드 수정 완료
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 필드 수정 상태를 해제합니다.
 * 필요한 data 속성: editingField
 */
export function finishEditingField(context) {
  context.editingField = null;
}

/**
 * 폼 초기화
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {void}
 * @description
 * 모든 입력 필드와 상태를 기본값으로 재설정합니다.
 * 
 * 초기화되는 필드:
 * - 이미지 관련: meetingImageUrl, photos
 * - 활동 정보: selectedActivity, meetingName
 * - 날짜/시간: meetingDate, meetingStartDate, meetingEndDate, meetingStartTime, meetingEndTime
 * - 참가자: numberOfParticipants, memberList의 isParticipating
 * - 기타: meetingLocation, meetingNotes
 */
export function resetMeetingForm(context) {
  const today = dateTimeUtils.getTodayString();

  context.meetingImageUrl = null;
  context.selectedActivity = null;
  context.meetingName = '';
  context.meetingDate = today;
  context.meetingStartDate = today;
  context.meetingEndDate = today;
  context.meetingStartTime = '';
  context.meetingEndTime = '';
  context.numberOfParticipants = null;
  context.photos = null;
  context.meetingLocation = '';
  context.meetingNotes = '';

  // 멤버 참여 상태 초기화
  if (context.memberList && Array.isArray(context.memberList)) {
    context.memberList.forEach((member) => (member.isParticipating = false));
  }
}

/**
 * 파일 업로드 상태 텍스트 반환
 * @param {Object} context - Vue 컴포넌트 컨텍스트 (this)
 * @returns {string} 업로드 상태 설명 텍스트
 * @description
 * 현재 업로드 중인 파일의 크기 정보를 포맷된 문자열로 반환합니다.
 * 필요한 data 속성: photos
 */
export function getFileUploadStatus(context) {
  if (!context.photos) return '이미지 없음';

  const fileSizeMB = (context.photos.size / (1024 * 1024)).toFixed(1);
  return `${fileSizeMB}MB 이미지 업로드 중`;
}

/**
 * TODO: 확장 가능한 기능들
 * - 폼 유효성 검증 함수
 * - 공통 에러 핸들링
 * - 공통 알림 표시 함수
 */

