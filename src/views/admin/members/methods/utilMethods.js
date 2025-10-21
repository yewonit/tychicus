/**
 * 유틸리티 메서드
 */

import { getCountryNameByCode } from '@/assets/data/countryList';
import { getRoleColor, getRoleName } from '@/utils/memberUtils';
import { formatDateToHyphen } from '@/utils/dateFormatUtils';

export default {
  // 메시지 표시
  showMessage(message, color = 'success') {
    try {
      this.$store.dispatch('snackbar/showMessage', { message, color });
    } catch (e) {
      if (color === 'error') {
        alert(message);
      }
    }
  },

  // 에러 메시지 표시
  showErrorMessage(message) {
    this.showMessage(message, 'error');
    alert(message);
  },

  // 국가 코드로 국가명 조회
  getCountryNameByCode(code) {
    return getCountryNameByCode(code);
  },

  // 역할 색상 조회
  getRoleColor(roleName) {
    return getRoleColor(roleName);
  },

  // 역할 ID로 역할명 조회
  getRoleName(roleId) {
    return getRoleName(roleId);
  },

  // 검증 실패 처리
  handleValidationFailure(errors) {
    let errorMessage = '';

    // 필수 입력 필드 오류 확인
    const requiredFieldsErrors = [];
    if (errors.name) requiredFieldsErrors.push('이름');
    if (errors.phoneNumber) requiredFieldsErrors.push('전화번호');
    if (errors.genderType) requiredFieldsErrors.push('성별');
    if (errors.roleId) requiredFieldsErrors.push('역할');

    if (requiredFieldsErrors.length > 0) {
      errorMessage = `다음 필수 항목을 확인해주세요: ${requiredFieldsErrors.join(
        ', '
      )}`;
    }

    // 날짜 형식 오류 확인
    if (errors.dateError) {
      errorMessage = errorMessage
        ? `${errorMessage}. 또한, ${errors.dateErrorMessage}`
        : errors.dateErrorMessage;
    }

    this.showErrorMessage(errorMessage || '입력 정보를 확인해주세요.');
  },

  // 날짜 형식 변환 (YYYYMMDD -> YYYY-MM-DD)
  formatDate(dateString) {
    return formatDateToHyphen(dateString);
  },

  // 날짜 필터 초기화
  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
  },
};
