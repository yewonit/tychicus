import moment from 'moment';

export const TimeSeriesDataMixin = {
  data() {
    return {
      // 시계열 데이터 구조 (시간 흐름에 따른 데이터)
      timeSeriesData: {
        weekly: {}, // 주차별 데이터 {year-weekNumber: {meetings, stats}}
        monthly: {}, // 월별 데이터 {year-month: {meetings, stats}}
        quarterly: {}, // 분기별 데이터 {year-Q1~Q4: {months: [], stats}}
        yearly: {}, // 년별 데이터 {year: {quarters: [], stats}}
      },
    };
  },
  methods: {
    // 시계열 데이터 구조화
    structureTimeSeriesData() {
      console.log('시계열 데이터 구조화 시작...');

      // 시계열 데이터 초기화
      this.timeSeriesData = {
        weekly: {},
        monthly: {},
        quarterly: {},
        yearly: {},
      };

      // 모든 모임의 날짜별로 순회
      const dateMap = {}; // 날짜별 모임 모음

      // 구조화된 데이터에서 날짜별 모임 정보 추출
      Object.keys(this.structuredData.byDate).forEach((dateStr) => {
        const dateData = this.structuredData.byDate[dateStr];
        if (!dateData || !dateData.meetings || dateData.meetings.length === 0) {
          console.log(`날짜 ${dateStr}에 유효한 모임 데이터가 없습니다.`);
          return;
        }

        const date = moment(dateStr);

        // 주차 정보 (YYYY-WW 형식)
        const weekKey = date.format('GGGG-[W]WW');
        // 월 정보 (YYYY-MM 형식)
        const monthKey = date.format('YYYY-MM');
        // 분기 정보 (YYYY-Q# 형식)
        const quarterKey = date.format('YYYY-[Q]Q');
        // 년 정보 (YYYY 형식)
        const yearKey = date.format('YYYY');

        // 출석률 계산에 필요한 총 데이터 초기화
        const meetingTypeStats = {};

        // 각 예배 유형별 통계 집계를 위한 초기화
        Object.keys(this.meetingTypes).forEach((type) => {
          meetingTypeStats[type] = {
            totalCount: 0, // 총 출석 대상자 수
            presentCount: 0, // 실제 출석자 수
            attendeeCount: 0, // 참석자 수 (집계용)
            meetingCount: 0, // 모임 수
          };
        });

        // 각 모임에 대해 처리
        dateData.meetings.forEach((meeting) => {
          const meetingType = meeting.meetingType || 'OTHER';

          // 모임별 출석률 정보 (디버깅용)
          console.log(`모임 [${meeting.name}] 출석률 정보:`, {
            type: meetingType,
            totalCount: meeting.totalCount || 0,
            presentCount: meeting.presentCount || 0,
            attendanceRate: meeting.attendanceRate || 0,
          });

          // 예배 유형별 통계 집계
          meetingTypeStats[meetingType].meetingCount += 1;
          meetingTypeStats[meetingType].attendeeCount +=
            meeting.presentCount || 0;

          // 출석률 계산을 위한 데이터 누적
          if (meeting.totalCount && meeting.totalCount > 0) {
            meetingTypeStats[meetingType].totalCount += meeting.totalCount;
            meetingTypeStats[meetingType].presentCount +=
              meeting.presentCount || 0;
          }
        });

        // 예배 유형별 데이터 처리
        const meetingTypeData = {};

        Object.keys(meetingTypeStats).forEach((type) => {
          const stats = meetingTypeStats[type];

          // 출석률 계산 (0~1 범위 보장)
          let attendanceRate = 0;
          if (stats.totalCount > 0) {
            attendanceRate = Math.min(stats.presentCount / stats.totalCount, 1);
          }

          meetingTypeData[type] = {
            name: this.meetingTypes[type],
            attendanceRate: attendanceRate,
            attendeeCount: stats.attendeeCount,
            meetingCount: stats.meetingCount,
            // 디버깅을 위한 원본 데이터
            _debug: {
              totalCount: stats.totalCount,
              presentCount: stats.presentCount,
            },
          };

          // 출석률 로깅 (디버깅용)
          if (stats.meetingCount > 0) {
            console.log(
              `날짜 ${dateStr} 예배유형 [${this.meetingTypes[type]}] 출석률:`,
              {
                meetingCount: stats.meetingCount,
                totalCount: stats.totalCount,
                presentCount: stats.presentCount,
                attendanceRate: (attendanceRate * 100).toFixed(1) + '%',
              }
            );
          }
        });

        // 날짜 정보 저장
        dateMap[dateStr] = {
          date,
          weekKey,
          monthKey,
          quarterKey,
          yearKey,
          meetings: dateData.meetings,
          meetingCount: dateData.totalMeetings,
          attendeeCount: dateData.meetings.reduce(
            (sum, m) => sum + (m.presentCount || 0),
            0
          ),
          meetingTypeData: meetingTypeData, // 예배 유형별 처리된 데이터
        };
      });

      // 주차별 집계
      this.aggregateWeeklyData(dateMap);

      // 월별 집계
      this.aggregateMonthlyData(dateMap);

      // 분기별 집계
      this.aggregateQuarterlyData();

      // 연도별 집계
      this.aggregateYearlyData();

      console.log('시계열 데이터 구조화 완료:', this.timeSeriesData);

      // 결과 검증 (디버깅)
      this.validateTimeSeriesData();
    },

    // 주차별 데이터 집계
    aggregateWeeklyData(dateMap) {
      // 주차별 데이터 초기화
      const weeklyData = {};

      // 모임 유형별 통계 초기화 함수
      const initMeetingTypeStats = () => {
        const stats = {};
        Object.keys(this.meetingTypes).forEach((type) => {
          stats[type] = {
            name: this.meetingTypes[type],
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            totalCount: 0, // 출석 대상자 수 합계
            presentCount: 0, // 출석자 수 합계
          };
        });
        return stats;
      };

      // 날짜별 데이터를 주차별로 집계
      Object.values(dateMap).forEach((data) => {
        const { weekKey, meetings, meetingCount, attendeeCount } = data;

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            startDate: moment(data.date)
              .startOf('isoWeek')
              .format('YYYY-MM-DD'),
            endDate: moment(data.date).endOf('isoWeek').format('YYYY-MM-DD'),
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            byMeetingType: initMeetingTypeStats(),
          };
        }

        // 주차 데이터에 모임 추가
        weeklyData[weekKey].meetings.push(...meetings);
        weeklyData[weekKey].meetingCount += meetingCount;
        weeklyData[weekKey].attendeeCount += attendeeCount;

        // 모임 유형별 데이터 추가
        if (data.meetingTypeData) {
          Object.entries(data.meetingTypeData).forEach(([type, typeData]) => {
            const weekTypeStats = weeklyData[weekKey].byMeetingType[type];

            if (typeData.meetingCount > 0) {
              weekTypeStats.meetingCount += typeData.meetingCount;
              weekTypeStats.attendeeCount += typeData.attendeeCount;

              // 출석률 계산을 위한 원본 데이터 누적
              weekTypeStats.totalCount += typeData._debug?.totalCount || 0;
              weekTypeStats.presentCount += typeData._debug?.presentCount || 0;

              // 개별 모임 추가 (필요한 경우)
              if (typeData.meetings) {
                weekTypeStats.meetings.push(...typeData.meetings);
              }
            }
          });
        }
      });

      // 주차별 출석률 계산
      Object.keys(weeklyData).forEach((weekKey) => {
        const weekData = weeklyData[weekKey];

        // 모임 유형별 출석률 계산
        let totalAttendances = 0;
        let totalPresent = 0;

        Object.keys(weekData.byMeetingType).forEach((type) => {
          const typeData = weekData.byMeetingType[type];

          // 출석률 계산 (0~1 범위로 제한)
          if (typeData.totalCount > 0) {
            typeData.attendanceRate = Math.min(
              typeData.presentCount / typeData.totalCount,
              1
            );

            // 디버깅 로그
            console.log(`주차 ${weekKey} 예배유형 [${typeData.name}] 출석률:`, {
              attendanceRate: (typeData.attendanceRate * 100).toFixed(1) + '%',
              presentCount: typeData.presentCount,
              totalCount: typeData.totalCount,
              meetingCount: typeData.meetingCount,
            });
          } else {
            typeData.attendanceRate = 0;
          }

          // 전체 통계 누적
          totalAttendances += typeData.totalCount;
          totalPresent += typeData.presentCount;
        });

        // 주간 전체 출석률 계산
        weekData.attendanceRate =
          totalAttendances > 0
            ? Math.min(totalPresent / totalAttendances, 1)
            : 0;
      });

      // 주차별 데이터 저장
      this.timeSeriesData.weekly = weeklyData;
    },

    // 월별 데이터 집계
    aggregateMonthlyData(dateMap) {
      // 월별 데이터 초기화
      const monthlyData = {};

      // 모임 유형별 통계 초기화 함수
      const initMeetingTypeStats = () => {
        const stats = {};
        Object.keys(this.meetingTypes).forEach((type) => {
          stats[type] = {
            name: this.meetingTypes[type],
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            totalCount: 0, // 출석 대상자 수 합계
            presentCount: 0, // 출석자 수 합계
          };
        });
        return stats;
      };

      // 날짜별 데이터를 월별로 집계
      Object.values(dateMap).forEach((data) => {
        const { monthKey, meetings, meetingCount, attendeeCount } = data;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            monthName: moment(data.date).format('YYYY년 M월'),
            startDate: moment(data.date).startOf('month').format('YYYY-MM-DD'),
            endDate: moment(data.date).endOf('month').format('YYYY-MM-DD'),
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            byMeetingType: initMeetingTypeStats(),
            byWeek: {}, // 주차별 통계 참조
          };
        }

        // 월별 데이터에 모임 추가
        monthlyData[monthKey].meetings.push(...meetings);
        monthlyData[monthKey].meetingCount += meetingCount;
        monthlyData[monthKey].attendeeCount += attendeeCount;

        // 주차 참조 추가
        if (!monthlyData[monthKey].byWeek[data.weekKey]) {
          monthlyData[monthKey].byWeek[data.weekKey] =
            this.timeSeriesData.weekly[data.weekKey];
        }

        // 모임 유형별 데이터 추가
        if (data.meetingTypeData) {
          Object.entries(data.meetingTypeData).forEach(([type, typeData]) => {
            const monthTypeStats = monthlyData[monthKey].byMeetingType[type];

            if (typeData.meetingCount > 0) {
              monthTypeStats.meetingCount += typeData.meetingCount;
              monthTypeStats.attendeeCount += typeData.attendeeCount;

              // 출석률 계산을 위한 원본 데이터 누적
              monthTypeStats.totalCount += typeData._debug?.totalCount || 0;
              monthTypeStats.presentCount += typeData._debug?.presentCount || 0;

              // 개별 모임 추가 (필요한 경우)
              if (typeData.meetings) {
                monthTypeStats.meetings.push(...typeData.meetings);
              }
            }
          });
        }
      });

      // 월별 출석률 계산
      Object.keys(monthlyData).forEach((monthKey) => {
        const monthData = monthlyData[monthKey];

        // 모임 유형별 출석률 계산
        let totalAttendances = 0;
        let totalPresent = 0;

        Object.keys(monthData.byMeetingType).forEach((type) => {
          const typeData = monthData.byMeetingType[type];

          // 출석률 계산 (0~1 범위로 제한)
          if (typeData.totalCount > 0) {
            typeData.attendanceRate = Math.min(
              typeData.presentCount / typeData.totalCount,
              1
            );

            // 디버깅 로그
            console.log(
              `월간 ${monthKey} 예배유형 [${typeData.name}] 출석률:`,
              {
                attendanceRate:
                  (typeData.attendanceRate * 100).toFixed(1) + '%',
                presentCount: typeData.presentCount,
                totalCount: typeData.totalCount,
                meetingCount: typeData.meetingCount,
              }
            );
          } else {
            typeData.attendanceRate = 0;
          }

          // 전체 통계 누적
          totalAttendances += typeData.totalCount;
          totalPresent += typeData.presentCount;
        });

        // 월별 전체 출석률 계산
        monthData.attendanceRate =
          totalAttendances > 0
            ? Math.min(totalPresent / totalAttendances, 1)
            : 0;

        console.log(`월간 ${monthKey} 전체 출석률:`, {
          attendanceRate: (monthData.attendanceRate * 100).toFixed(1) + '%',
          meetingCount: monthData.meetingCount,
          attendeeCount: monthData.attendeeCount,
        });
      });

      // 월별 데이터 저장
      this.timeSeriesData.monthly = monthlyData;
    },

    // 분기별 데이터 집계
    aggregateQuarterlyData() {
      // 분기별 데이터 초기화
      const quarterlyData = {};

      // 모임 유형별 통계 초기화 함수
      const initMeetingTypeStats = () => {
        const stats = {};
        Object.keys(this.meetingTypes).forEach((type) => {
          stats[type] = {
            name: this.meetingTypes[type],
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            totalCount: 0, // 출석 대상자 수 합계
            presentCount: 0, // 출석자 수 합계
          };
        });
        return stats;
      };

      // 월별 데이터를 분기별로 집계
      Object.entries(this.timeSeriesData.monthly).forEach(
        ([monthKey, monthData]) => {
          const date = moment(monthKey + '-01');
          const quarterKey = date.format('YYYY-[Q]Q');

          if (!quarterlyData[quarterKey]) {
            quarterlyData[quarterKey] = {
              quarterName: `${date.format('YYYY')}년 ${date.format('Q')}분기`,
              startDate: moment(date).startOf('quarter').format('YYYY-MM-DD'),
              endDate: moment(date).endOf('quarter').format('YYYY-MM-DD'),
              months: [],
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
              byMeetingType: initMeetingTypeStats(),
            };
          }

          // 분기 데이터에 월 추가
          quarterlyData[quarterKey].months.push(monthKey);

          // 분기 데이터에 월별 모임 데이터 추가
          quarterlyData[quarterKey].meetings.push(...monthData.meetings);
          quarterlyData[quarterKey].meetingCount += monthData.meetingCount;
          quarterlyData[quarterKey].attendeeCount += monthData.attendeeCount;

          // 모임 유형별 데이터 추가
          Object.keys(this.meetingTypes).forEach((type) => {
            const monthTypeData = monthData.byMeetingType[type];
            const quarterTypeData =
              quarterlyData[quarterKey].byMeetingType[type];

            quarterTypeData.meetings.push(...monthTypeData.meetings);
            quarterTypeData.meetingCount += monthTypeData.meetingCount;
            quarterTypeData.attendeeCount += monthTypeData.attendeeCount;

            // 출석률 계산을 위한 데이터 누적
            quarterTypeData.totalCount += monthTypeData.totalCount || 0;
            quarterTypeData.presentCount += monthTypeData.presentCount || 0;
          });
        }
      );

      // 분기별 출석률 계산
      Object.keys(quarterlyData).forEach((quarterKey) => {
        const quarterData = quarterlyData[quarterKey];

        // 모임 유형별 출석률 계산
        let totalAttendances = 0;
        let totalPresent = 0;

        Object.keys(quarterData.byMeetingType).forEach((type) => {
          const typeData = quarterData.byMeetingType[type];

          // 출석률 계산 (0~1 범위로 제한)
          if (typeData.totalCount > 0) {
            typeData.attendanceRate = Math.min(
              typeData.presentCount / typeData.totalCount,
              1
            );

            // 디버깅 로그 (모임이 있는 유형만)
            if (typeData.meetingCount > 0) {
              console.log(
                `분기 ${quarterKey} 예배유형 [${typeData.name}] 출석률:`,
                {
                  attendanceRate:
                    (typeData.attendanceRate * 100).toFixed(1) + '%',
                  presentCount: typeData.presentCount,
                  totalCount: typeData.totalCount,
                  meetingCount: typeData.meetingCount,
                }
              );
            }
          } else {
            typeData.attendanceRate = 0;
          }

          // 전체 통계 누적
          totalAttendances += typeData.totalCount;
          totalPresent += typeData.presentCount;
        });

        // 분기 전체 출석률 계산
        quarterData.attendanceRate =
          totalAttendances > 0
            ? Math.min(totalPresent / totalAttendances, 1)
            : 0;
      });

      // 분기별 데이터 저장
      this.timeSeriesData.quarterly = quarterlyData;
    },

    // 연간 데이터 집계
    aggregateYearlyData() {
      // 연간 데이터 초기화
      const yearlyData = {};

      // 모임 유형별 통계 초기화 함수
      const initMeetingTypeStats = () => {
        const stats = {};
        Object.keys(this.meetingTypes).forEach((type) => {
          stats[type] = {
            name: this.meetingTypes[type],
            meetings: [],
            meetingCount: 0,
            attendeeCount: 0,
            attendanceRate: 0,
            totalCount: 0, // 출석 대상자 수 합계
            presentCount: 0, // 출석자 수 합계
          };
        });
        return stats;
      };

      // 분기별 데이터를 연간으로 집계
      Object.entries(this.timeSeriesData.quarterly).forEach(
        ([quarterKey, quarterData]) => {
          const date = moment(quarterData.startDate);
          const yearKey = date.format('YYYY');

          if (!yearlyData[yearKey]) {
            yearlyData[yearKey] = {
              yearName: `${yearKey}년`,
              startDate: moment(yearKey).startOf('year').format('YYYY-MM-DD'),
              endDate: moment(yearKey).endOf('year').format('YYYY-MM-DD'),
              quarters: [],
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
              byMeetingType: initMeetingTypeStats(),
            };
          }

          // 연간 데이터에 분기 추가
          yearlyData[yearKey].quarters.push(quarterKey);

          // 분기별 모임 데이터 추가
          yearlyData[yearKey].meetings.push(...quarterData.meetings);
          yearlyData[yearKey].meetingCount += quarterData.meetingCount;
          yearlyData[yearKey].attendeeCount += quarterData.attendeeCount;

          // 모임 유형별 데이터 추가
          Object.keys(this.meetingTypes).forEach((type) => {
            const quarterTypeData = quarterData.byMeetingType[type];
            const yearTypeData = yearlyData[yearKey].byMeetingType[type];

            yearTypeData.meetings.push(...quarterTypeData.meetings);
            yearTypeData.meetingCount += quarterTypeData.meetingCount;
            yearTypeData.attendeeCount += quarterTypeData.attendeeCount;

            // 출석률 계산을 위한 데이터 누적
            yearTypeData.totalCount += quarterTypeData.totalCount || 0;
            yearTypeData.presentCount += quarterTypeData.presentCount || 0;
          });
        }
      );

      // 연간 출석률 계산
      Object.keys(yearlyData).forEach((yearKey) => {
        const yearData = yearlyData[yearKey];

        // 모임 유형별 출석률 계산
        let totalAttendances = 0;
        let totalPresent = 0;

        Object.keys(yearData.byMeetingType).forEach((type) => {
          const typeData = yearData.byMeetingType[type];

          // 출석률 계산 (0~1 범위로 제한)
          if (typeData.totalCount > 0) {
            typeData.attendanceRate = Math.min(
              typeData.presentCount / typeData.totalCount,
              1
            );

            // 디버깅 로그 (모임이 있는 유형만)
            if (typeData.meetingCount > 0) {
              console.log(
                `연간 ${yearKey} 예배유형 [${typeData.name}] 출석률:`,
                {
                  attendanceRate:
                    (typeData.attendanceRate * 100).toFixed(1) + '%',
                  presentCount: typeData.presentCount,
                  totalCount: typeData.totalCount,
                  meetingCount: typeData.meetingCount,
                }
              );
            }
          } else {
            typeData.attendanceRate = 0;
          }

          // 전체 통계 누적
          totalAttendances += typeData.totalCount;
          totalPresent += typeData.presentCount;
        });

        // 연도 전체 출석률 계산
        yearData.attendanceRate =
          totalAttendances > 0
            ? Math.min(totalPresent / totalAttendances, 1)
            : 0;

        console.log(`연간 ${yearKey} 전체 출석률:`, {
          attendanceRate: (yearData.attendanceRate * 100).toFixed(1) + '%',
          meetingCount: yearData.meetingCount,
          attendeeCount: yearData.attendeeCount,
        });
      });

      // 연간 데이터 저장
      this.timeSeriesData.yearly = yearlyData;
    },

    // 시계열 데이터 검증
    validateTimeSeriesData() {
      console.log('시계열 데이터 검증 시작...');

      // 주간 데이터 확인
      console.log(
        '주간 데이터 키 목록:',
        Object.keys(this.timeSeriesData.weekly)
      );

      // 모든 유형별로 첫 번째 주간 데이터의 값 확인
      if (Object.keys(this.timeSeriesData.weekly).length > 0) {
        const firstWeekKey = Object.keys(this.timeSeriesData.weekly)[0];
        const firstWeekData = this.timeSeriesData.weekly[firstWeekKey];

        console.log(`첫 번째 주간(${firstWeekKey}) 데이터:`, {
          meetingCount: firstWeekData.meetingCount,
          attendeeCount: firstWeekData.attendeeCount,
          attendanceRate: firstWeekData.attendanceRate,
        });

        // 모임 유형별 데이터 확인
        Object.entries(firstWeekData.byMeetingType).forEach(
          ([meetingType, typeData]) => {
            if (typeData.meetingCount > 0) {
              console.log(
                `첫 번째 주간 예배유형 [${typeData.name}] (${meetingType}) 데이터:`,
                {
                  meetingType,
                  meetingCount: typeData.meetingCount,
                  attendeeCount: typeData.attendeeCount,
                  attendanceRate: typeData.attendanceRate,
                  // 백분율로 표시
                  attendanceRatePercent:
                    (typeData.attendanceRate * 100).toFixed(1) + '%',
                }
              );
            }
          }
        );
      } else {
        console.warn('주간 데이터가 없습니다.');
      }

      // 월간 데이터 확인
      console.log(
        '월간 데이터 키 목록:',
        Object.keys(this.timeSeriesData.monthly)
      );

      // 첫 번째 월간 데이터 확인
      if (Object.keys(this.timeSeriesData.monthly).length > 0) {
        const firstMonthKey = Object.keys(this.timeSeriesData.monthly)[0];
        const firstMonthData = this.timeSeriesData.monthly[firstMonthKey];

        console.log(`첫 번째 월간(${firstMonthKey}) 데이터:`, {
          monthName: firstMonthData.monthName,
          meetingCount: firstMonthData.meetingCount,
          attendeeCount: firstMonthData.attendeeCount,
          attendanceRate: firstMonthData.attendanceRate,
        });
      }

      console.log('시계열 데이터 검증 완료');
    },
  },
};
