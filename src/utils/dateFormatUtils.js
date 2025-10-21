/**
 * 날짜 형식 변환 유틸리티 함수 모음
 */

/**
 * YYYYMMDD 형식을 YYYY-MM-DD로 변환
 * @param {string} dateString - YYYYMMDD 형식의 날짜 문자열
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export function formatDateToHyphen(dateString) {
  if (!dateString) return '-';

  // YYYYMMDD 형식일 경우 변환
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // 이미 YYYY-MM-DD 형식이면 그대로 반환
  return dateString;
}

/**
 * YYYY-MM-DD 형식을 YYYYMMDD로 변환
 * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns {string} YYYYMMDD 형식의 날짜 문자열
 */
export function formatDateToCompact(dateString) {
  if (!dateString) return '';

  // 하이픈이 있는 경우 제거
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${year}${month}${day}`;
  }

  // 이미 YYYYMMDD 형식이면 그대로 반환
  return dateString;
}

/**
 * 날짜 형식 검증 (YYYYMMDD)
 * @param {string} dateString - 날짜 문자열
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateDateFormat(dateString) {
  if (!dateString) {
    return { isValid: true, error: '' };
  }

  // 정규식으로 YYYYMMDD 형식 확인 (8자리 숫자)
  const datePattern = /^\d{8}$/;
  if (!datePattern.test(dateString)) {
    return {
      isValid: false,
      error: '날짜 형식이 올바르지 않습니다. (YYYYMMDD)',
    };
  }

  // 입력된 날짜 형식을 년, 월, 일로 분리
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // 날짜 객체로 변환하여 유효성 검사
  const date = new Date(year, parseInt(month) - 1, day);
  const isValidDate =
    !isNaN(date.getTime()) &&
    date.getFullYear() === parseInt(year) &&
    date.getMonth() === parseInt(month) - 1 &&
    date.getDate() === parseInt(day);

  if (!isValidDate) {
    return { isValid: false, error: '유효하지 않은 날짜입니다.' };
  }

  return { isValid: true, error: '' };
}

/**
 * 생년월일 검증 (미래 날짜 체크 포함)
 * @param {string} birthDateString - YYYYMMDD 형식의 생년월일
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateBirthDate(birthDateString) {
  const result = validateDateFormat(birthDateString);

  if (!result.isValid) {
    return result;
  }

  if (!birthDateString) {
    return { isValid: true, error: '' };
  }

  // 미래 날짜인지 검사
  const year = birthDateString.substring(0, 4);
  const month = birthDateString.substring(4, 6);
  const day = birthDateString.substring(6, 8);
  const date = new Date(year, parseInt(month) - 1, day);
  const today = new Date();

  if (date > today) {
    return {
      isValid: false,
      error: '생년월일은 오늘보다 미래일 수 없습니다.',
    };
  }

  return { isValid: true, error: '' };
}

/**
 * 오늘 날짜를 YYYYMMDD 형식으로 반환
 * @returns {string} YYYYMMDD 형식의 오늘 날짜
 */
export function getTodayFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
