/* eslint-disable no-unused-vars */
// 디버깅 로그 추가
console.log('ExportDataMixin이 로드됨');

export const ExportDataMixin = {
  data() {
    console.log('ExportDataMixin data() 함수 실행');
    return {
      // 엑셀 다운로드용 데이터
      exportData: {
        summary: null, // 요약 데이터
        byOrganization: null, // 조직별 데이터
        byMeetingType: null, // 모임 유형별 데이터
        timeSeries: null, // 시계열 데이터
      },
    };
  },
  methods: {
    // 엑셀 다운로드용 데이터 준비
    prepareExportData() {
      console.log('엑셀 다운로드용 데이터 준비 시작...');

      // 데이터가 없는 경우 먼저 구조화
      if (Object.keys(this.timeSeriesData.weekly || {}).length === 0) {
        console.log(
          'timeSeriesData가 비어 있어 데이터 구조화를 다시 시도합니다.'
        );
        this.structureTimeSeriesData();
      }

      // 요약 데이터 준비
      this.prepareExportSummaryData();

      // 조직별 데이터 준비
      this.prepareExportOrganizationData();

      // 모임 유형별 데이터 준비
      this.prepareExportMeetingTypeData();

      // 시계열 데이터 준비
      this.prepareExportTimeSeriesData();

      console.log('엑셀 다운로드용 데이터 준비 완료:', this.exportData);
    },

    // 엑셀 다운로드 - 요약 데이터 준비
    prepareExportSummaryData() {
      // 요약 데이터 구조
      this.exportData.summary = {
        title: '출석 데이터 요약',
        period: `${this.dateRange.start} ~ ${this.dateRange.end}`,
        totalStats: {
          totalMeetings: this.attendanceData.summary.totalMeetings,
          totalAttendees: this.attendanceData.summary.totalAttendees,
          averageAttendanceRate:
            this.attendanceData.summary.averageAttendanceRate,
        },
        meetingTypeStats: [],
        organizationStats: [],
      };

      // 모임 유형별 통계
      Object.entries(this.structuredData.byMeetingType).forEach(
        ([type, data]) => {
          if (data.totalMeetings > 0) {
            this.exportData.summary.meetingTypeStats.push({
              type,
              name: data.name,
              meetingCount: data.totalMeetings,
              attendeeCount: data.totalAttendees,
              attendanceRate:
                data.totalMeetings > 0
                  ? parseFloat(
                      (data.totalAttendees / data.totalMeetings).toFixed(2)
                    )
                  : 0,
            });
          }
        }
      );

      // 조직별 통계 (계층 구조 반영)
      // 최상위 조직과 주요 하위 조직만 요약에 포함
      if (this.organizationTree.length > 0) {
        const rootOrg = this.organizationTree[0];
        const rootId = rootOrg.id.toString();

        if (
          this.structuredData.hierarchyStats &&
          this.structuredData.hierarchyStats[rootId]
        ) {
          const rootStats = this.structuredData.hierarchyStats[rootId];

          // 최상위 조직 통계
          this.exportData.summary.organizationStats.push({
            id: rootId,
            name: rootStats.name,
            level: 0,
            isRoot: true,
            meetingCount: rootStats.aggregated.meetingCount,
            attendeeCount: rootStats.aggregated.attendeeCount,
            attendanceRate: rootStats.aggregated.attendanceRate,
          });

          // 주요 하위 조직 통계 (1단계 자식들)
          rootOrg.children.forEach((childOrg) => {
            const childId = childOrg.id.toString();
            if (this.structuredData.hierarchyStats[childId]) {
              const childStats = this.structuredData.hierarchyStats[childId];

              this.exportData.summary.organizationStats.push({
                id: childId,
                name: childStats.name,
                level: 1,
                isRoot: false,
                meetingCount: childStats.aggregated.meetingCount,
                attendeeCount: childStats.aggregated.attendeeCount,
                attendanceRate: childStats.aggregated.attendanceRate,
              });
            }
          });
        }
      }
    },

    // 엑셀 다운로드 - 조직별 데이터 준비
    prepareExportOrganizationData() {
      // 조직별 데이터 구조
      this.exportData.byOrganization = {
        title: '조직별 출석 데이터',
        period: `${this.dateRange.start} ~ ${this.dateRange.end}`,
        hierarchyData: [], // 계층 구조를 반영한 조직 데이터
        detailedData: [], // 각 조직별 상세 데이터
      };

      // 1. 계층 구조를 반영한 조직 데이터 생성
      const processOrgTree = (nodes, parentName = '') => {
        const result = [];

        nodes.forEach((node) => {
          const orgId = node.id.toString();
          const orgStats = this.structuredData.hierarchyStats[orgId];

          if (orgStats) {
            // 조직 기본 정보
            const orgData = {
              id: orgId,
              name: node.organization_name,
              fullName: parentName
                ? `${parentName} > ${node.organization_name}`
                : node.organization_name,
              level: node.level,
              isLeafNode: node.isLeafNode,
              // 자체 모임 통계 (직접 소속된 모임만)
              own: {
                meetingCount: orgStats.own.meetingCount,
                attendeeCount: orgStats.own.attendeeCount,
                attendanceRate: orgStats.own.attendanceRate,
                byMeetingType: [],
              },
              // 집계 통계 (하위 조직 포함)
              aggregated: {
                meetingCount: orgStats.aggregated.meetingCount,
                attendeeCount: orgStats.aggregated.attendeeCount,
                attendanceRate: orgStats.aggregated.attendanceRate,
                byMeetingType: [],
              },
            };

            // 모임 유형별 통계 추가
            Object.entries(orgStats.own.byMeetingType).forEach(
              ([type, typeData]) => {
                if (typeData.meetingCount > 0) {
                  orgData.own.byMeetingType.push({
                    type,
                    name: typeData.name,
                    meetingCount: typeData.meetingCount,
                    attendeeCount: typeData.attendeeCount,
                    attendanceRate: typeData.attendanceRate,
                  });
                }
              }
            );

            Object.entries(orgStats.aggregated.byMeetingType).forEach(
              ([type, typeData]) => {
                if (typeData.meetingCount > 0) {
                  orgData.aggregated.byMeetingType.push({
                    type,
                    name: typeData.name,
                    meetingCount: typeData.meetingCount,
                    attendeeCount: typeData.attendeeCount,
                    attendanceRate: typeData.attendanceRate,
                  });
                }
              }
            );

            result.push(orgData);

            // 하위 조직 처리
            if (node.children && node.children.length > 0) {
              const childrenData = processOrgTree(
                node.children,
                orgData.fullName
              );
              result.push(...childrenData);
            }
          }
        });

        return result;
      };

      // 조직 트리 처리
      this.exportData.byOrganization.hierarchyData = processOrgTree(
        this.organizationTree
      );

      // 2. 각 조직별 상세 데이터 생성 (모든 모임 목록 포함)
      Object.values(this.structuredData.hierarchyStats).forEach((orgStats) => {
        // 모임이 있는 조직만 포함
        if (orgStats.own.meetingCount > 0) {
          const detailedOrgData = {
            id: orgStats.id,
            name: orgStats.name,
            level: orgStats.level,
            isLeafNode: orgStats.isLeafNode,
            path: orgStats.path.join(' > '),
            meetingCount: orgStats.own.meetingCount,
            attendeeCount: orgStats.own.attendeeCount,
            attendanceRate: orgStats.own.attendanceRate,
            meetings: [],
          };

          // 모임 상세 정보 추가
          orgStats.own.meetings.forEach((meeting) => {
            detailedOrgData.meetings.push({
              id: meeting.id,
              name: meeting.name,
              date: meeting.date,
              meetingType: meeting.meetingTypeName,
              attendanceCount: meeting.attendanceCount,
            });
          });

          this.exportData.byOrganization.detailedData.push(detailedOrgData);
        }
      });
    },

    // 엑셀 다운로드 - 모임 유형별 데이터 준비
    prepareExportMeetingTypeData() {
      // 모임 유형별 데이터 구조
      this.exportData.byMeetingType = {
        title: '모임 유형별 출석 데이터',
        period: `${this.dateRange.start} ~ ${this.dateRange.end}`,
        summaryData: [], // 모임 유형별 요약 통계
        timeSeriesData: [], // 시간에 따른 모임 유형별 통계
      };

      // 1. 모임 유형별 요약 통계
      Object.entries(this.structuredData.byMeetingType).forEach(
        ([type, data]) => {
          // 모임이 있는 유형만 포함
          if (data.totalMeetings > 0) {
            const typeData = {
              type,
              name: data.name,
              meetingCount: data.totalMeetings,
              attendeeCount: data.totalAttendees,
              attendanceRate:
                data.totalMeetings > 0
                  ? parseFloat(
                      (data.totalAttendees / data.totalMeetings).toFixed(2)
                    )
                  : 0,
              byOrganization: [], // 조직별 통계
            };

            // 조직별 통계 추가 (최상위 조직과 주요 하위 조직만)
            if (this.organizationTree.length > 0) {
              const rootOrg = this.organizationTree[0];
              const rootId = rootOrg.id.toString();

              if (
                this.structuredData.hierarchyStats &&
                this.structuredData.hierarchyStats[rootId]
              ) {
                const rootStats = this.structuredData.hierarchyStats[rootId];
                const meetingTypeStats =
                  rootStats.aggregated.byMeetingType[type];

                if (meetingTypeStats && meetingTypeStats.meetingCount > 0) {
                  typeData.byOrganization.push({
                    id: rootId,
                    name: rootStats.name,
                    level: 0,
                    isRoot: true,
                    meetingCount: meetingTypeStats.meetingCount,
                    attendeeCount: meetingTypeStats.attendeeCount,
                    attendanceRate: meetingTypeStats.attendanceRate,
                  });
                }

                // 주요 하위 조직 통계
                rootOrg.children.forEach((childOrg) => {
                  const childId = childOrg.id.toString();
                  if (this.structuredData.hierarchyStats[childId]) {
                    const childStats =
                      this.structuredData.hierarchyStats[childId];
                    const childTypeStats =
                      childStats.aggregated.byMeetingType[type];

                    if (childTypeStats && childTypeStats.meetingCount > 0) {
                      typeData.byOrganization.push({
                        id: childId,
                        name: childStats.name,
                        level: 1,
                        isRoot: false,
                        meetingCount: childTypeStats.meetingCount,
                        attendeeCount: childTypeStats.attendeeCount,
                        attendanceRate: childTypeStats.attendanceRate,
                      });
                    }
                  }
                });
              }
            }

            this.exportData.byMeetingType.summaryData.push(typeData);
          }
        }
      );

      // 2. 시간에 따른 모임 유형별 통계 (월별)
      Object.entries(this.timeSeriesData.monthly).forEach(
        ([monthKey, monthData]) => {
          const monthEntry = {
            month: monthKey,
            monthName: monthData.monthName,
            byMeetingType: [],
          };

          // 각 모임 유형별 통계
          Object.entries(monthData.byMeetingType).forEach(
            ([typeKey, typeData]) => {
              if (typeData.meetingCount > 0) {
                monthEntry.byMeetingType.push({
                  type: typeKey,
                  name: typeData.name,
                  meetingCount: typeData.meetingCount,
                  attendeeCount: typeData.attendeeCount,
                  attendanceRate: typeData.attendanceRate,
                });
              }
            }
          );

          if (monthEntry.byMeetingType.length > 0) {
            this.exportData.byMeetingType.timeSeriesData.push(monthEntry);
          }
        }
      );
    },

    // 엑셀 다운로드 - 시계열 데이터 준비
    prepareExportTimeSeriesData() {
      // 시계열 데이터 구조
      this.exportData.timeSeries = {
        title: '시계열 출석 데이터',
        period: `${this.dateRange.start} ~ ${this.dateRange.end}`,
        weekly: [],
        monthly: [],
        quarterly: [],
        yearly: [],
      };

      // 주차별 데이터
      Object.entries(this.timeSeriesData.weekly).forEach(
        ([weekKey, weekData]) => {
          this.exportData.timeSeries.weekly.push({
            week: weekKey,
            period: `${weekData.startDate} ~ ${weekData.endDate}`,
            meetingCount: weekData.meetingCount,
            attendeeCount: weekData.attendeeCount,
            attendanceRate: weekData.attendanceRate,
            byMeetingType: Object.entries(weekData.byMeetingType)
              .filter((entry) => entry[1].meetingCount > 0)
              .map(([type, typeData]) => ({
                type,
                name: typeData.name,
                meetingCount: typeData.meetingCount,
                attendeeCount: typeData.attendeeCount,
                attendanceRate: typeData.attendanceRate,
              })),
          });
        }
      );

      // 월별 데이터
      Object.entries(this.timeSeriesData.monthly).forEach(
        ([monthKey, monthData]) => {
          this.exportData.timeSeries.monthly.push({
            month: monthKey,
            monthName: monthData.monthName,
            period: `${monthData.startDate} ~ ${monthData.endDate}`,
            meetingCount: monthData.meetingCount,
            attendeeCount: monthData.attendeeCount,
            attendanceRate: monthData.attendanceRate,
            byMeetingType: Object.entries(monthData.byMeetingType)
              .filter((entry) => entry[1].meetingCount > 0)
              .map(([type, typeData]) => ({
                type,
                name: typeData.name,
                meetingCount: typeData.meetingCount,
                attendeeCount: typeData.attendeeCount,
                attendanceRate: typeData.attendanceRate,
              })),
          });
        }
      );

      // 분기별 데이터
      Object.entries(this.timeSeriesData.quarterly).forEach(
        ([quarterKey, quarterData]) => {
          this.exportData.timeSeries.quarterly.push({
            quarter: quarterKey,
            quarterName: quarterData.quarterName,
            period: `${quarterData.startDate} ~ ${quarterData.endDate}`,
            meetingCount: quarterData.meetingCount,
            attendeeCount: quarterData.attendeeCount,
            attendanceRate: quarterData.attendanceRate,
            byMeetingType: Object.entries(quarterData.byMeetingType)
              .filter((entry) => entry[1].meetingCount > 0)
              .map(([type, typeData]) => ({
                type,
                name: typeData.name,
                meetingCount: typeData.meetingCount,
                attendeeCount: typeData.attendeeCount,
                attendanceRate: typeData.attendanceRate,
              })),
          });
        }
      );

      // 연도별 데이터
      Object.entries(this.timeSeriesData.yearly).forEach(([year, yearData]) => {
        this.exportData.timeSeries.yearly.push({
          year,
          yearName: yearData.yearName,
          period: `${yearData.startDate} ~ ${yearData.endDate}`,
          meetingCount: yearData.meetingCount,
          attendeeCount: yearData.attendeeCount,
          attendanceRate: yearData.attendanceRate,
          byMeetingType: Object.entries(yearData.byMeetingType)
            .filter((entry) => entry[1].meetingCount > 0)
            .map(([type, typeData]) => ({
              type,
              name: typeData.name,
              meetingCount: typeData.meetingCount,
              attendeeCount: typeData.attendeeCount,
              attendanceRate: typeData.attendanceRate,
            })),
        });
      });
    },
  },
};
