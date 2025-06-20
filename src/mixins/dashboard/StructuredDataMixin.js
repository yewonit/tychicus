import moment from 'moment';

// 디버깅 로그 추가
console.log('StructuredDataMixin이 로드됨');

export const StructuredDataMixin = {
  data() {
    console.log('StructuredDataMixin data() 함수 실행');
    return {
      // 다차원 데이터 구조 (조직 > 모임유형 > 시간 > 출석정보)
      structuredData: {
        byOrganization: {}, // 조직별 데이터
        byMeetingType: {}, // 모임 유형별 데이터
        byDate: {}, // 날짜별 데이터
        summary: {}, // 요약 데이터
      },
    };
  },
  methods: {
    // 데이터 구조화 (다차원 데이터 구조 생성)
    structureData() {
      console.log('데이터 구조화 시작...');

      // 구조화된 데이터 초기화
      this.structuredData = {
        byOrganization: {},
        byMeetingType: {},
        byDate: {},
        summary: {
          totalMeetings: 0,
          totalAttendees: 0,
          meetingTypeCounts: {},
        },
      };

      // 모임 유형별 초기 카운트 설정
      Object.keys(this.meetingTypes).forEach((type) => {
        this.structuredData.byMeetingType[type] = {
          name: this.meetingTypes[type],
          meetings: [],
          totalMeetings: 0,
          totalAttendees: 0,
        };
        this.structuredData.summary.meetingTypeCounts[type] = 0;
      });

      // 조직별, 모임 유형별, 날짜별 데이터 구성
      this.attendanceData.meetings.forEach((orgData) => {
        // 조직별 데이터 초기화
        if (!this.structuredData.byOrganization[orgData.organizationId]) {
          this.structuredData.byOrganization[orgData.organizationId] = {
            name: orgData.organizationName,
            meetingTypes: {},
            totalMeetings: 0,
            totalAttendees: 0,
          };

          // 조직별 모임 유형 초기화
          Object.keys(this.meetingTypes).forEach((type) => {
            this.structuredData.byOrganization[
              orgData.organizationId
            ].meetingTypes[type] = {
              name: this.meetingTypes[type],
              meetings: [],
              totalMeetings: 0,
              totalAttendees: 0,
            };
          });
        }

        // 각 활동 데이터 처리
        if (orgData.activities) {
          orgData.activities.forEach((activity) => {
            const meetingType = activity.meetingType || 'OTHER';
            const activityDate = moment(activity.date).format('YYYY-MM-DD');

            // 활동 기본 정보
            const activityInfo = {
              id: activity.id,
              instanceId: activity.instance_id,
              name: activity.name,
              date: activityDate,
              organizationId: orgData.organizationId,
              organizationName: orgData.organizationName,
              meetingType: meetingType,
              meetingTypeName: this.meetingTypes[meetingType] || '기타',
              attendanceCount: 0, // 실제 출석 데이터 연결 전 기본값
            };

            // 조직별 데이터에 활동 추가
            this.structuredData.byOrganization[
              orgData.organizationId
            ].meetingTypes[meetingType].meetings.push(activityInfo);
            this.structuredData.byOrganization[orgData.organizationId]
              .totalMeetings++;

            // 모임 유형별 데이터에 활동 추가
            this.structuredData.byMeetingType[meetingType].meetings.push(
              activityInfo
            );
            this.structuredData.byMeetingType[meetingType].totalMeetings++;

            // 날짜별 데이터 구성
            if (!this.structuredData.byDate[activityDate]) {
              this.structuredData.byDate[activityDate] = {
                meetings: [],
                totalMeetings: 0,
                meetingTypes: {},
              };

              // 날짜별 모임 유형 초기화
              Object.keys(this.meetingTypes).forEach((type) => {
                this.structuredData.byDate[activityDate].meetingTypes[type] = {
                  meetings: [],
                  totalMeetings: 0,
                };
              });
            }

            // 날짜별 데이터에 활동 추가
            this.structuredData.byDate[activityDate].meetings.push(
              activityInfo
            );
            this.structuredData.byDate[activityDate].totalMeetings++;
            this.structuredData.byDate[activityDate].meetingTypes[
              meetingType
            ].meetings.push(activityInfo);
            this.structuredData.byDate[activityDate].meetingTypes[meetingType]
              .totalMeetings++;

            // 전체 요약 데이터 업데이트
            this.structuredData.summary.totalMeetings++;
            this.structuredData.summary.meetingTypeCounts[meetingType]++;
          });
        }
      });

      console.log('데이터 구조화 완료:', this.structuredData);

      // 모임 유형별 통계 계산 및 meetingTypeData 업데이트
      this.calculateMeetingTypeStatistics();

      // 시계열 데이터 구조화
      this.structureTimeSeriesData();
    },

    // 모임 유형별 통계 계산 (processMeetingTypeData 로직 일부 통합)
    calculateMeetingTypeStatistics() {
      const meetingTypeDataResult = [];

      Object.entries(this.structuredData.byMeetingType).forEach(
        ([type, data]) => {
          let totalAttendees = 0;
          let totalAttendancePossible = 0; // 출석 가능 총 인원 (모임별 총원 합계)

          // 각 모임의 출석 정보를 합산
          data.meetings.forEach((meeting) => {
            totalAttendees += meeting.presentCount || 0;
            totalAttendancePossible += meeting.attendanceCount || 0; // attendanceCount가 모임 총원이라고 가정
          });

          // 출석률 계산 (전체 출석자 / 전체 가능 인원)
          const attendanceRate =
            totalAttendancePossible > 0
              ? totalAttendees / totalAttendancePossible
              : 0;

          meetingTypeDataResult.push({
            type,
            name: data.name,
            meetingCount: data.totalMeetings, // 구조화된 데이터에서 가져옴
            attendanceCount: totalAttendees, // 실제 출석자 수 합계
            attendanceRate: Math.max(0, Math.min(1, attendanceRate)), // 0~1 사이로 제한
            // periodType은 TimeSeriesDataMixin에서 관리하므로 여기선 제외
          });

          // structuredData 업데이트
          data.totalAttendees = totalAttendees;
          data.averageAttendanceRate = attendanceRate;
        }
      );

      // DashboardView의 meetingTypeData 업데이트
      this.meetingTypeData = meetingTypeDataResult;
      console.log(
        '모임 유형별 통계 계산 완료 (meetingTypeData):',
        this.meetingTypeData
      );
    },

    // 구조화된 데이터에 출석 정보 업데이트
    updateStructuredDataAttendance(
      organizationId,
      activity,
      meetingStats,
      instance = null
    ) {
      const meetingType = activity.meetingType || 'OTHER';
      const activityDate = meetingStats.date;
      const attendanceCount = meetingStats.presentCount || 0;

      // 활동 기본 정보 확장
      const activityInfo = {
        id: activity.id,
        instanceId: meetingStats.instanceId || activity.instance_id,
        name: activity.name,
        date: activityDate,
        organizationId: organizationId,
        organizationName: activity.organizationName || '',
        meetingType: meetingType,
        meetingTypeName: this.meetingTypes[meetingType] || '기타',
        attendanceCount: attendanceCount,
        presentCount: meetingStats.presentCount || 0,
        absentCount: meetingStats.absentCount || 0,
        lateCount: meetingStats.lateCount || 0,
        totalCount:
          (meetingStats.presentCount || 0) +
          (meetingStats.absentCount || 0) +
          (meetingStats.lateCount || 0),
        attendanceRate:
          meetingStats.totalCount > 0
            ? (meetingStats.presentCount / meetingStats.totalCount).toFixed(2)
            : 0,
      };

      // 인스턴스 정보 추가 (있는 경우)
      if (instance) {
        activityInfo.location = instance.actual_location;
        activityInfo.notes = instance.notes;
        activityInfo.start_datetime = instance.start_datetime;
        activityInfo.end_datetime = instance.end_datetime;
      }

      // 조직별 데이터 업데이트
      if (this.structuredData.byOrganization[organizationId]) {
        this.structuredData.byOrganization[organizationId].totalAttendees +=
          attendanceCount;

        if (
          this.structuredData.byOrganization[organizationId].meetingTypes[
            meetingType
          ]
        ) {
          this.structuredData.byOrganization[organizationId].meetingTypes[
            meetingType
          ].totalAttendees += attendanceCount;

          // 해당 활동 찾아서 출석 정보 업데이트
          const activityIndex = this.structuredData.byOrganization[
            organizationId
          ].meetingTypes[meetingType].meetings.findIndex(
            (a) =>
              a.id === activity.id &&
              a.instanceId === (meetingStats.instanceId || activity.instance_id)
          );

          if (activityIndex >= 0) {
            Object.assign(
              this.structuredData.byOrganization[organizationId].meetingTypes[
                meetingType
              ].meetings[activityIndex],
              activityInfo
            );
          }
        }
      }

      // 모임 유형별 데이터 업데이트
      if (this.structuredData.byMeetingType[meetingType]) {
        this.structuredData.byMeetingType[meetingType].totalAttendees +=
          attendanceCount;

        // 해당 활동 찾아서 출석 정보 업데이트
        const activityIndex = this.structuredData.byMeetingType[
          meetingType
        ].meetings.findIndex(
          (a) =>
            a.id === activity.id &&
            a.instanceId ===
              (meetingStats.instanceId || activity.instance_id) &&
            a.organizationId === organizationId
        );

        if (activityIndex >= 0) {
          Object.assign(
            this.structuredData.byMeetingType[meetingType].meetings[
              activityIndex
            ],
            activityInfo
          );
        }
      }

      // 날짜별 데이터 업데이트
      if (this.structuredData.byDate[activityDate]) {
        // 해당 활동 찾아서 출석 정보 업데이트
        const activityIndex = this.structuredData.byDate[
          activityDate
        ].meetings.findIndex(
          (a) =>
            a.id === activity.id &&
            a.instanceId ===
              (meetingStats.instanceId || activity.instance_id) &&
            a.organizationId === organizationId
        );

        if (activityIndex >= 0) {
          Object.assign(
            this.structuredData.byDate[activityDate].meetings[activityIndex],
            activityInfo
          );
        }

        // 날짜별 모임 유형 데이터 업데이트
        if (
          this.structuredData.byDate[activityDate].meetingTypes[meetingType]
        ) {
          const typeActivityIndex = this.structuredData.byDate[
            activityDate
          ].meetingTypes[meetingType].meetings.findIndex(
            (a) =>
              a.id === activity.id &&
              a.instanceId ===
                (meetingStats.instanceId || activity.instance_id) &&
              a.organizationId === organizationId
          );

          if (typeActivityIndex >= 0) {
            Object.assign(
              this.structuredData.byDate[activityDate].meetingTypes[meetingType]
                .meetings[typeActivityIndex],
              activityInfo
            );
          }
        }
      }

      // 전체 요약 데이터 업데이트
      this.structuredData.summary.totalAttendees += attendanceCount;
    },

    // 전체 통계 업데이트
    updateGlobalStatistics() {
      let totalMeetings = 0;
      let totalAttendees = 0;

      Object.values(this.attendanceData.statistics).forEach((stats) => {
        totalMeetings += stats.totalMeetings;
        totalAttendees += stats.totalAttendees;
      });

      this.attendanceData.summary = {
        totalMeetings,
        totalAttendees,
        averageAttendanceRate:
          totalMeetings > 0 ? (totalAttendees / totalMeetings).toFixed(2) : 0,
      };

      // 숫자 타입으로 변환하여 백분율 표시에 적합하게 만들기
      this.attendanceData.summary.averageAttendanceRate = parseFloat(
        this.attendanceData.summary.averageAttendanceRate
      );
    },

    // 조직 계층 구조 통계 처리 (하위 조직 → 상위 조직으로 롤업)
    processOrganizationHierarchyStats() {
      console.log('조직 계층 구조 통계 처리 시작...');

      // 조직 트리 활용하여 리프 노드부터 상위로 통계 롤업
      const rollupStats = () => {
        // 하위에서 상위로 집계하기 위해 레벨별로 정렬 (높은 레벨 = 깊은 깊이 = 먼저 처리)
        const sortedOrgs = [...this.flattenedOrganizations].sort(
          (a, b) => b.level - a.level
        );

        // 조직별 통계 초기화
        const orgStats = {};

        // 각 조직의 기본 통계 세팅 (자신의 데이터만)
        sortedOrgs.forEach((org) => {
          const orgId = org.id;

          // 기본 조직 통계
          orgStats[orgId] = {
            id: orgId,
            name: org.organization_name,
            level: org.level,
            parentId: org.upper_organization_id,
            isLeafNode: org.isLeafNode,
            path: org.path,
            pathIds: org.pathIds,
            // 자체 통계 (직접 소속된 모임에 대한 통계)
            own: {
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
              byMeetingType: {},
            },
            // 집계 통계 (하위 조직 포함한 통계)
            aggregated: {
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
              byMeetingType: {},
              childOrgs: [], // 하위 조직 ID 목록
            },
          };

          // 모임 유형별 초기화
          Object.keys(this.meetingTypes).forEach((type) => {
            orgStats[orgId].own.byMeetingType[type] = {
              name: this.meetingTypes[type],
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
            };

            orgStats[orgId].aggregated.byMeetingType[type] = {
              name: this.meetingTypes[type],
              meetings: [],
              meetingCount: 0,
              attendeeCount: 0,
              attendanceRate: 0,
            };
          });
        });

        // 모든 모임을 해당 조직에 할당
        this.attendanceData.meetings.forEach((orgData) => {
          const organizationId = orgData.organizationId;

          // 해당 조직이 초기화되어 있는지 확인
          if (!orgStats[organizationId]) {
            console.warn(
              `조직 ID ${organizationId}에 대한 통계가 초기화되지 않았습니다.`
            );
            return;
          }

          // 각 활동을 모임 통계에 추가
          if (orgData.activities) {
            orgData.activities.forEach((activity) => {
              // 활동에 인스턴스가 있는 경우
              if (
                activity.instances &&
                Array.isArray(activity.instances) &&
                activity.instances.length > 0
              ) {
                for (const instance of activity.instances) {
                  const attendances = instance.attendances || [];
                  const meetingType = activity.meetingType || 'OTHER';

                  // 출석한 인원수 계산
                  const presentCount = attendances.filter(
                    (a) => a.status === '출석'
                  ).length;

                  // 모임 정보 생성
                  const meetingInfo = {
                    activityId: activity.id,
                    instanceId: instance.id,
                    date:
                      instance.date ||
                      activity.date ||
                      (function () {
                        try {
                          if (instance.start_datetime) {
                            const date = moment(instance.start_datetime);
                            if (date.isValid()) {
                              return date.format('YYYY-MM-DD');
                            }
                          }
                          return moment().format('YYYY-MM-DD');
                        } catch (e) {
                          console.warn('날짜 변환 중 오류:', e);
                          return moment().format('YYYY-MM-DD');
                        }
                      })(),
                    name: activity.name,
                    type: activity.category || activity.type || '정기예배',
                    location: instance.actual_location,
                    notes: instance.notes,
                    meetingType: meetingType,
                    meetingTypeName: this.meetingTypes[meetingType] || '기타',
                    attendanceCount: attendances.length,
                    presentCount: presentCount,
                    absentCount: attendances.filter((a) => a.status === '결석')
                      .length,
                    lateCount: attendances.filter((a) => a.status === '지각')
                      .length,
                    organizationId: organizationId,
                    organizationName: orgData.organizationName,
                  };

                  // 자체 통계에 모임 추가
                  orgStats[organizationId].own.meetings.push(meetingInfo);
                  orgStats[organizationId].own.meetingCount++;
                  orgStats[organizationId].own.attendeeCount += presentCount;

                  // 모임 유형별 통계 추가
                  orgStats[organizationId].own.byMeetingType[
                    meetingType
                  ].meetings.push(meetingInfo);
                  orgStats[organizationId].own.byMeetingType[meetingType]
                    .meetingCount++;
                  orgStats[organizationId].own.byMeetingType[
                    meetingType
                  ].attendeeCount += presentCount;
                }
              }
            });
          }

          // 자체 통계 출석률 계산
          if (orgStats[organizationId].own.meetingCount > 0) {
            orgStats[organizationId].own.attendanceRate = parseFloat(
              (
                orgStats[organizationId].own.attendeeCount /
                orgStats[organizationId].own.meetingCount
              ).toFixed(2)
            );
          }

          // 모임 유형별 자체 출석률 계산
          Object.keys(orgStats[organizationId].own.byMeetingType).forEach(
            (type) => {
              const typeData = orgStats[organizationId].own.byMeetingType[type];
              if (typeData.meetingCount > 0) {
                typeData.attendanceRate = parseFloat(
                  (typeData.attendeeCount / typeData.meetingCount).toFixed(2)
                );
              }
            }
          );

          // 집계 통계 초기화 (자체 통계로)
          orgStats[organizationId].aggregated.meetings = [
            ...orgStats[organizationId].own.meetings,
          ];
          orgStats[organizationId].aggregated.meetingCount =
            orgStats[organizationId].own.meetingCount;
          orgStats[organizationId].aggregated.attendeeCount =
            orgStats[organizationId].own.attendeeCount;
          orgStats[organizationId].aggregated.attendanceRate =
            orgStats[organizationId].own.attendanceRate;

          Object.keys(this.meetingTypes).forEach((type) => {
            const ownTypeData =
              orgStats[organizationId].own.byMeetingType[type];
            orgStats[organizationId].aggregated.byMeetingType[type] = {
              name: this.meetingTypes[type],
              meetings: [...ownTypeData.meetings],
              meetingCount: ownTypeData.meetingCount,
              attendeeCount: ownTypeData.attendeeCount,
              attendanceRate: ownTypeData.attendanceRate,
            };
          });
        });

        // 하위 조직부터 상위 조직으로 통계 롤업
        sortedOrgs.forEach((org) => {
          const orgId = org.id;
          const parentId = org.upper_organization_id;

          // 상위 조직이 있는 경우, 해당 조직의 집계 통계를 상위 조직의 집계 통계에 추가
          if (parentId && orgStats[parentId] && orgStats[orgId]) {
            const parentStats = orgStats[parentId];
            const childStats = orgStats[orgId];

            // 하위 조직 ID 목록에 추가
            parentStats.aggregated.childOrgs.push(orgId);

            // 상위 조직의 집계 통계에 하위 조직의 모임 추가
            parentStats.aggregated.meetings.push(
              ...childStats.aggregated.meetings
            );
            parentStats.aggregated.meetingCount +=
              childStats.aggregated.meetingCount;
            parentStats.aggregated.attendeeCount +=
              childStats.aggregated.attendeeCount;

            // 모임 유형별 통계 롤업
            Object.keys(this.meetingTypes).forEach((type) => {
              const parentTypeStats =
                parentStats.aggregated.byMeetingType[type];
              const childTypeStats = childStats.aggregated.byMeetingType[type];

              parentTypeStats.meetings.push(...childTypeStats.meetings);
              parentTypeStats.meetingCount += childTypeStats.meetingCount;
              parentTypeStats.attendeeCount += childTypeStats.attendeeCount;
            });

            // 출석률 재계산
            if (parentStats.aggregated.meetingCount > 0) {
              parentStats.aggregated.attendanceRate = parseFloat(
                (
                  parentStats.aggregated.attendeeCount /
                  parentStats.aggregated.meetingCount
                ).toFixed(2)
              );
            }

            // 모임 유형별 출석률 재계산
            Object.keys(parentStats.aggregated.byMeetingType).forEach(
              (type) => {
                const typeStats = parentStats.aggregated.byMeetingType[type];
                if (typeStats.meetingCount > 0) {
                  typeStats.attendanceRate = parseFloat(
                    (typeStats.attendeeCount / typeStats.meetingCount).toFixed(
                      2
                    )
                  );
                }
              }
            );
          }
        });

        return orgStats;
      };

      // 통계 롤업 실행
      const hierarchyStats = rollupStats();

      // 계층 구조를 반영한 데이터 저장
      this.structuredData.hierarchyStats = hierarchyStats;

      console.log(
        '조직 계층 구조 통계 처리 완료:',
        this.structuredData.hierarchyStats
      );

      // 엑셀 다운로드용 데이터 준비
      this.prepareExportData();
    },
  },
};
