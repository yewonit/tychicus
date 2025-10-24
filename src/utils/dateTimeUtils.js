// Moment.js → Day.js 교체 (8 MB → 71 KB, 99% 감소)
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Day.js 플러그인 활성화
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 날짜와 시간 처리를 위한 유틸리티 클래스
 */
export const dateTimeUtils = {
  /**
   * 한국 시간대 상수
   */
  KOREA_TIMEZONE: 'Asia/Seoul',

  /**
   * 날짜와 시간 문자열로부터 한국 시간대의 DateTime 객체 생성
   * @param {string} date - YYYY-MM-DD 형식의 날짜 문자열
   * @param {string} time - HH:mm 형식의 시간 문자열 (기본값 "00:00")
   * @returns {dayjs.Dayjs} 한국 시간대의 dayjs 객체
   */
  createDateTime(date, time = '00:00') {
    return dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', this.KOREA_TIMEZONE);
  },

  /**
   * DateTime 객체를 UTC ISO 문자열로 변환
   * @param {dayjs.Dayjs} dateTime - dayjs 객체
   * @returns {string} UTC ISO 형식의 문자열 (예: "2023-10-01T14:00:00Z")
   */
  toUTCString(dateTime) {
    return dateTime.utc().format();
  },

  /**
   * UTC 문자열을 한국 시간대의 DateTime 객체로 변환
   * @param {string} utcString - UTC ISO 형식 문자열
   * @returns {dayjs.Dayjs} 한국 시간대의 dayjs 객체
   */
  fromUTCString(utcString) {
    return dayjs.utc(utcString).tz(this.KOREA_TIMEZONE);
  },

  /**
   * 현재 한국 날짜를 YYYY-MM-DD 형식으로 반환
   * @returns {string} YYYY-MM-DD 형식의 오늘 날짜
   */
  getTodayString() {
    return dayjs().tz(this.KOREA_TIMEZONE).format('YYYY-MM-DD');
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
   * @param {dayjs.Dayjs} startDateTime - 시작 일시
   * @param {dayjs.Dayjs} endDateTime - 종료 일시
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

  /**
   * 주어진 요일에 해당하는 가장 최근 과거 날짜를 반환하는 함수
   * @param {number} dayOfWeek - 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
   * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
   * @example
   * // 오늘이 수요일(3)이고 일요일(0)을 찾는 경우 -> 지난 일요일 날짜 반환
   * getNearestPastDate(0) // "2024-01-21"
   */
  getNearestPastDate(dayOfWeek) {
    const today = dayjs();
    const todayDayOfWeek = today.day(); // 현재 요일 (0-6)

    let daysToSubtract;

    if (todayDayOfWeek === dayOfWeek) {
      // 오늘이 해당 요일이면 오늘 날짜 반환
      daysToSubtract = 0;
    } else if (todayDayOfWeek > dayOfWeek) {
      // 찾는 요일이 현재 요일보다 앞에 있으면 (예: 오늘이 수요일이고 일요일을 찾는 경우)
      daysToSubtract = todayDayOfWeek - dayOfWeek;
    } else {
      // 찾는 요일이 현재 요일보다 뒤에 있으면 (예: 오늘이 화요일이고 금요일을 찾는 경우)
      // 이 경우 지난 주의 해당 요일을 계산
      daysToSubtract = 7 - (dayOfWeek - todayDayOfWeek);
    }

    // 지정된 일수만큼 오늘 날짜에서 빼기
    const targetDate = dayjs().subtract(daysToSubtract, 'days');
    return targetDate.format('YYYY-MM-DD');
  },

  /**
   * 날짜에서 다음 날 날짜를 YYYY-MM-DD 형식으로 반환
   * @param {string} date - YYYY-MM-DD 형식의 날짜 문자열
   * @returns {string} YYYY-MM-DD 형식의 다음 날 날짜
   */
  getNextDay(date) {
    return dayjs(date).add(1, 'day').format('YYYY-MM-DD');
  },

  /**
   * 요일 숫자를 한글 텍스트로 변환
   * @param {number} dayOfWeek - 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
   * @returns {string} 한글 요일명
   */
  getDayOfWeekText(dayOfWeek) {
    const days = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    return days[dayOfWeek] || '';
  },
};

export default dateTimeUtils;
