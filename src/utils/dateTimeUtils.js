import moment from "moment-timezone";

/**
 * 날짜와 시간 처리를 위한 유틸리티 클래스
 */
export const dateTimeUtils = {
  /**
   * 한국 시간대 상수
   */
  KOREA_TIMEZONE: "Asia/Seoul",

  /**
   * 날짜와 시간 문자열로부터 한국 시간대의 DateTime 객체 생성
   * @param {string} date - YYYY-MM-DD 형식의 날짜 문자열
   * @param {string} time - HH:mm 형식의 시간 문자열 (기본값 "00:00")
   * @returns {moment.Moment} 한국 시간대의 moment 객체
   */
  createDateTime(date, time = "00:00") {
    return moment.tz(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      this.KOREA_TIMEZONE
    );
  },

  /**
   * DateTime 객체를 UTC ISO 문자열로 변환
   * @param {moment.Moment} dateTime - moment 객체
   * @returns {string} UTC ISO 형식의 문자열 (예: "2023-10-01T14:00:00Z")
   */
  toUTCString(dateTime) {
    return dateTime.clone().utc().format();
  },

  /**
   * UTC 문자열을 한국 시간대의 DateTime 객체로 변환
   * @param {string} utcString - UTC ISO 형식 문자열
   * @returns {moment.Moment} 한국 시간대의 moment 객체
   */
  fromUTCString(utcString) {
    return moment.utc(utcString).tz(this.KOREA_TIMEZONE);
  },

  /**
   * 현재 한국 날짜를 YYYY-MM-DD 형식으로 반환
   * @returns {string} YYYY-MM-DD 형식의 오늘 날짜
   */
  getTodayString() {
    return moment().tz(this.KOREA_TIMEZONE).format("YYYY-MM-DD");
  },

  /**
   * 모임이 자정을 넘어가는지 확인 (시작 시간이 종료 시간보다 늦은 경우)
   * @param {string} startTime - HH:mm 형식의 시작 시간
   * @param {string} endTime - HH:mm 형식의 종료 시간
   * @returns {boolean} 자정을 넘어가는 모임이면 true, 아니면 false
   */
  isOvernightMeeting(startTime, endTime) {
    // 유효한 시간 형식인지 확인
    if (
      !startTime ||
      !endTime ||
      !startTime.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/) ||
      !endTime.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    ) {
      return false;
    }

    // 시작 시간이 종료 시간보다 늦으면 자정을 넘어가는 모임
    return startTime > endTime;
  },

  /**
   * 두 DateTime 객체 간의 유효성 검증
   * @param {moment.Moment} startDateTime - 시작 일시
   * @param {moment.Moment} endDateTime - 종료 일시
   * @returns {boolean} 유효한 일시 범위면 true, 그렇지 않으면 false
   */
  validateDateTimeRange(startDateTime, endDateTime) {
    return (
      startDateTime &&
      endDateTime &&
      endDateTime.isValid() &&
      startDateTime.isValid() &&
      !endDateTime.isBefore(startDateTime)
    );
  },
};

export default dateTimeUtils;
