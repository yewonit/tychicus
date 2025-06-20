<template>
  <div class="dashboard-time-series-tab">
    <!-- 시간 범위 선택 영역 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="primary">mdi-calendar-range</v-icon>
            시간별 출석 통계
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="timeRangeType"
              dense
              mandatory
              color="primary"
              class="mx-2"
            >
              <v-btn value="weekly" small>
                <v-icon left small>mdi-calendar-week</v-icon>
                주간
              </v-btn>
              <v-btn value="monthly" small>
                <v-icon left small>mdi-calendar-month</v-icon>
                월간
              </v-btn>
              <v-btn value="quarterly" small>
                <v-icon left small>mdi-calendar-text</v-icon>
                분기
              </v-btn>
              <v-btn value="yearly" small>
                <v-icon left small>mdi-calendar</v-icon>
                년간
              </v-btn>
            </v-btn-toggle>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-select
                  v-model="selectedMeetingType"
                  :items="meetingTypeItems"
                  label="예배 유형 선택"
                  dense
                  outlined
                  hide-details
                  class="mb-2"
                  prepend-icon="mdi-church"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="chartType"
                  :items="chartTypeItems"
                  label="차트 유형"
                  dense
                  outlined
                  hide-details
                  class="mb-2"
                  prepend-icon="mdi-chart-box"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 통계 요약 카드 -->
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center" outlined elevation="2">
          <v-card-title class="justify-center text-body-1">
            <v-icon left color="primary">mdi-calendar-multiple</v-icon>
            총 모임 수
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold primary--text">
              {{ summaryData.meetingCount || 0 }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center" outlined elevation="2">
          <v-card-title class="justify-center text-body-1">
            <v-icon left color="success">mdi-account-group</v-icon>
            총 출석 인원
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold success--text">
              {{ summaryData.attendeeCount || 0 }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center" outlined elevation="2">
          <v-card-title class="justify-center text-body-1">
            <v-icon left color="info">mdi-percent</v-icon>
            평균 출석률
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold info--text">
              {{ (summaryData.attendanceRate || 0).toFixed(1) }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 시계열 차트 영역 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="info">mdi-chart-timeline-variant</v-icon>
            {{ getTimeRangeTitle() }} 출석 추이
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="displayMode" dense mandatory color="primary">
              <v-btn value="chart" small>
                <v-icon left small>mdi-chart-bar</v-icon>
                차트
              </v-btn>
              <v-btn value="table" small>
                <v-icon left small>mdi-table</v-icon>
                테이블
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <!-- 차트 뷰 -->
            <div v-if="displayMode === 'chart'" style="height: 400px">
              <canvas id="timeSeriesChart"></canvas>
            </div>

            <!-- 테이블 뷰 -->
            <div v-else>
              <v-data-table
                :headers="getTableHeaders()"
                :items="tableData"
                :items-per-page="10"
                class="elevation-0"
                :footer-props="{
                  itemsPerPageOptions: [5, 10, 15, -1],
                  itemsPerPageText: '페이지당 행 수',
                }"
              >
                <!-- 기간 열 -->
                <template v-slot:[`item.period`]="{ item }">
                  <strong>{{ item.periodName }}</strong>
                </template>

                <!-- 출석률 열 -->
                <template v-slot:[`item.attendanceRate`]="{ item }">
                  <v-progress-linear
                    :value="parseFloat(item.attendanceRate) * 100"
                    height="20"
                    :color="getAttendanceRateColor(item.attendanceRate)"
                    class="rounded-lg"
                  >
                    <template v-slot:default="{ value }">
                      <span class="white--text">{{ value.toFixed(1) }}%</span>
                    </template>
                  </v-progress-linear>
                </template>

                <!-- 추세 열 -->
                <template v-slot:[`item.trend`]="{ item }">
                  <v-icon
                    small
                    :color="
                      item.trend > 0
                        ? 'success'
                        : item.trend < 0
                        ? 'error'
                        : 'grey'
                    "
                  >
                    {{
                      item.trend > 0
                        ? 'mdi-arrow-up'
                        : item.trend < 0
                        ? 'mdi-arrow-down'
                        : 'mdi-arrow-right'
                    }}
                  </v-icon>
                  {{ Math.abs(item.trend).toFixed(1) }}%
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 예배 유형별 비교 -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="purple">mdi-chart-pie</v-icon>
            예배 유형별 비교
          </v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <canvas id="worshipTypeComparisonChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 요일/시간별 히트맵 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="orange">mdi-calendar-clock</v-icon>
            요일별 출석 분포
          </v-card-title>
          <v-card-text>
            <div class="day-heatmap">
              <!-- 요일별 히트맵 그리드 -->
              <div class="heatmap-grid">
                <div
                  v-for="(day, index) in weekdays"
                  :key="index"
                  class="heatmap-day"
                >
                  <div class="day-label">{{ day }}</div>
                  <div class="day-bar">
                    <v-progress-linear
                      :value="getDayAttendancePercent(index)"
                      height="30"
                      :color="getDayAttendanceColor(index)"
                      class="rounded-lg"
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ Math.round(value) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </div>
                  <div class="day-stat">
                    {{ getDayAttendanceCount(index) }}명
                  </div>
                </div>
              </div>

              <!-- 데이터 없음 표시 -->
              <div v-if="!hasDayData" class="text-center grey--text my-5">
                <v-icon color="grey" class="mb-2">mdi-calendar-blank</v-icon>
                <div>요일별 데이터가 없습니다.</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 동향 분석 & 예측 -->
    <v-row v-if="hasTrendData">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon left color="green">mdi-trending-up</v-icon>
            출석률 동향 분석
          </v-card-title>
          <v-card-text>
            <v-row>
              <!-- 동향 그래프 -->
              <v-col cols="12" md="8">
                <div style="height: 300px">
                  <canvas id="trendAnalysisChart"></canvas>
                </div>
              </v-col>

              <!-- 통계 정보 -->
              <v-col cols="12" md="4">
                <v-card outlined class="mb-3">
                  <v-card-subtitle class="pb-0">
                    <v-icon left small color="primary">
                      mdi-chart-bell-curve
                    </v-icon>
                    추세 분석
                  </v-card-subtitle>
                  <v-card-text>
                    <div class="trend-stats">
                      <div class="trend-stat-item">
                        <div class="trend-label">전체 평균</div>
                        <div class="trend-value text-h6 primary--text">
                          {{ trendStats.overall.toFixed(1) }}%
                        </div>
                      </div>
                      <div class="trend-stat-item">
                        <div class="trend-label">최근 30일 평균</div>
                        <div
                          class="trend-value text-h6"
                          :class="
                            getTrendValueClass(
                              trendStats.recent,
                              trendStats.overall
                            )
                          "
                        >
                          {{ trendStats.recent.toFixed(1) }}%
                          <v-icon
                            x-small
                            :color="
                              getTrendColor(
                                trendStats.recent,
                                trendStats.overall
                              )
                            "
                          >
                            {{
                              getTrendIcon(
                                trendStats.recent,
                                trendStats.overall
                              )
                            }}
                          </v-icon>
                        </div>
                      </div>
                      <div class="trend-stat-item">
                        <div class="trend-label">변화율</div>
                        <div
                          class="trend-value text-h6"
                          :class="getTrendValueClass(trendStats.change, 0)"
                        >
                          {{ trendStats.change > 0 ? '+' : ''
                          }}{{ trendStats.change.toFixed(1) }}%
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-alert
                  dense
                  outlined
                  :type="getTrendAlertType()"
                  class="trend-alert"
                >
                  <div class="font-weight-bold">{{ getTrendAlertTitle() }}</div>
                  <div class="text-body-2">{{ getTrendAlertMessage() }}</div>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'DashboardTimeSeriesTab',
    props: {
      timeSeriesData: {
        type: Object,
        default: () => ({
          weekly: {},
          monthly: {},
          quarterly: {},
          yearly: {},
        }),
      },
      meetingTypes: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        timeRangeType: 'monthly',
        selectedMeetingType: null,
        chartType: 'bar',
        displayMode: 'chart',

        // 차트 유형 옵션
        chartTypeItems: [
          { text: '막대 차트', value: 'bar' },
          { text: '선 차트', value: 'line' },
          { text: '영역 차트', value: 'area' },
        ],

        // 모임 유형 아이템 (props에서 동적 생성)
        meetingTypeItems: [],

        // 요일 레이블
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],

        // 가상 데이터 (실제 구현에서는 실제 데이터 계산)
        summaryData: {
          meetingCount: 250,
          attendeeCount: 8750,
          attendanceRate: 78.5,
        },
        tableData: [], // 테이블 데이터는 timeRangeType에 따라 동적 생성

        // 요일별 출석 데이터 (가상)
        dayAttendance: [
          { day: 0, count: 2450, percent: 85 }, // 일
          { day: 1, count: 120, percent: 25 }, // 월
          { day: 2, count: 150, percent: 30 }, // 화
          { day: 3, count: 850, percent: 75 }, // 수
          { day: 4, count: 100, percent: 20 }, // 목
          { day: 5, count: 650, percent: 60 }, // 금
          { day: 6, count: 150, percent: 30 }, // 토
        ],

        // 추세 분석 데이터 (가상)
        trendStats: {
          overall: 75.3, // 전체 기간 평균
          recent: 82.1, // 최근 30일 평균
          change: 6.8, // 변화율
        },

        // 테이블 헤더 (시간 범위별 다르게 표시)
        headersWeekly: [
          { text: '주차', value: 'period', width: '150px' },
          { text: '모임 수', value: 'meetingCount', width: '100px' },
          { text: '참석자', value: 'attendeeCount', width: '100px' },
          { text: '출석률', value: 'attendanceRate' },
          { text: '추세', value: 'trend', width: '100px' },
        ],
        headersMonthly: [
          { text: '월', value: 'period', width: '150px' },
          { text: '모임 수', value: 'meetingCount', width: '100px' },
          { text: '참석자', value: 'attendeeCount', width: '100px' },
          { text: '출석률', value: 'attendanceRate' },
          { text: '추세', value: 'trend', width: '100px' },
        ],
        headersQuarterly: [
          { text: '분기', value: 'period', width: '150px' },
          { text: '모임 수', value: 'meetingCount', width: '100px' },
          { text: '참석자', value: 'attendeeCount', width: '100px' },
          { text: '출석률', value: 'attendanceRate' },
          { text: '추세', value: 'trend', width: '100px' },
        ],
        headersYearly: [
          { text: '년도', value: 'period', width: '150px' },
          { text: '모임 수', value: 'meetingCount', width: '100px' },
          { text: '참석자', value: 'attendeeCount', width: '100px' },
          { text: '출석률', value: 'attendanceRate' },
          { text: '추세', value: 'trend', width: '100px' },
        ],
      };
    },
    computed: {
      hasDayData() {
        return (
          this.dayAttendance &&
          this.dayAttendance.length > 0 &&
          this.dayAttendance.some((day) => day.count > 0)
        );
      },
      hasTrendData() {
        return true; // 실제 구현에서는 적절한 조건 체크
      },
    },
    watch: {
      meetingTypes: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.initializeMeetingTypeItems();
          }
        },
      },
      timeRangeType() {
        this.updateTableData();
        this.$nextTick(() => {
          // 차트 업데이트
        });
      },
      selectedMeetingType() {
        this.updateSummaryAndChart();
      },
      chartType() {
        this.$nextTick(() => {
          // 차트 업데이트
        });
      },
      displayMode() {
        if (this.displayMode === 'chart') {
          this.$nextTick(() => {
            // 차트 렌더링
          });
        } else {
          this.updateTableData();
        }
      },
    },
    methods: {
      initializeMeetingTypeItems() {
        this.meetingTypeItems = [
          { value: 'all', text: '모든 예배 유형' },
          ...Object.entries(this.meetingTypes).map(([value, text]) => ({
            value,
            text,
          })),
        ];

        // 기본 선택 값 설정
        if (this.meetingTypeItems.length > 0 && !this.selectedMeetingType) {
          this.selectedMeetingType = 'all';
        }
      },

      getTimeRangeTitle() {
        const ranges = {
          weekly: '주간별',
          monthly: '월별',
          quarterly: '분기별',
          yearly: '연도별',
        };

        return ranges[this.timeRangeType] || '기간별';
      },

      getTableHeaders() {
        switch (this.timeRangeType) {
          case 'weekly':
            return this.headersWeekly;
          case 'monthly':
            return this.headersMonthly;
          case 'quarterly':
            return this.headersQuarterly;
          case 'yearly':
            return this.headersYearly;
          default:
            return this.headersMonthly;
        }
      },

      updateTableData() {
        // 실제 구현에서는 timeSeriesData와 selectedMeetingType에 따라 데이터 구성
        this.tableData = [
          // 샘플 데이터 (실제 구현에서는 동적 생성)
          {
            period: '2023-Q1',
            periodName: '2023년 1분기',
            meetingCount: 65,
            attendeeCount: 2340,
            attendanceRate: 0.78,
            trend: 5.2,
          },
          {
            period: '2023-Q2',
            periodName: '2023년 2분기',
            meetingCount: 62,
            attendeeCount: 2150,
            attendanceRate: 0.75,
            trend: -3.0,
          },
          {
            period: '2023-Q3',
            periodName: '2023년 3분기',
            meetingCount: 58,
            attendeeCount: 2080,
            attendanceRate: 0.72,
            trend: -3.5,
          },
          {
            period: '2023-Q4',
            periodName: '2023년 4분기',
            meetingCount: 65,
            attendeeCount: 2480,
            attendanceRate: 0.81,
            trend: 8.0,
          },
        ];
      },

      updateSummaryAndChart() {
        // 선택된 예배 유형에 따라 요약 데이터와 차트 업데이트
        // 실제 구현에서는 timeSeriesData와 selectedMeetingType을 기반으로 계산

        this.$nextTick(() => {
          // 차트 업데이트
        });
      },

      getAttendanceRateColor(rate) {
        rate = parseFloat(rate);
        if (rate >= 0.8) return 'success';
        if (rate >= 0.6) return 'info';
        if (rate >= 0.4) return 'warning';
        return 'error';
      },

      // 요일별 출석 데이터 가져오기
      getDayAttendancePercent(dayIndex) {
        const day = this.dayAttendance.find((d) => d.day === dayIndex);
        return day ? day.percent : 0;
      },

      getDayAttendanceCount(dayIndex) {
        const day = this.dayAttendance.find((d) => d.day === dayIndex);
        return day ? day.count : 0;
      },

      getDayAttendanceColor(dayIndex) {
        const percent = this.getDayAttendancePercent(dayIndex);
        if (percent >= 80) return 'success';
        if (percent >= 60) return 'info';
        if (percent >= 40) return 'warning';
        return 'error';
      },

      // 추세 분석 관련 메서드
      getTrendValueClass(value, baseline) {
        if (value > baseline) return 'success--text';
        if (value < baseline) return 'error--text';
        return 'grey--text';
      },

      getTrendColor(value, baseline) {
        if (value > baseline) return 'success';
        if (value < baseline) return 'error';
        return 'grey';
      },

      getTrendIcon(value, baseline) {
        if (value > baseline) return 'mdi-arrow-up';
        if (value < baseline) return 'mdi-arrow-down';
        return 'mdi-arrow-right';
      },

      getTrendAlertType() {
        if (this.trendStats.change >= 5) return 'success';
        if (this.trendStats.change <= -5) return 'error';
        if (this.trendStats.change > 0) return 'info';
        return 'warning';
      },

      getTrendAlertTitle() {
        if (this.trendStats.change >= 5) return '출석률이 크게 향상되었습니다!';
        if (this.trendStats.change <= -5) return '출석률이 감소하고 있습니다';
        if (this.trendStats.change > 0) return '출석률이 소폭 상승 중입니다';
        return '출석률이 소폭 하락 중입니다';
      },

      getTrendAlertMessage() {
        if (this.trendStats.change >= 5) {
          return '최근 30일 간 출석률이 평균 대비 크게 향상되었습니다. 지속적인 관리가 중요합니다.';
        }
        if (this.trendStats.change <= -5) {
          return '최근 30일 간 출석률이 평균 대비 크게 감소했습니다. 원인 파악이 필요합니다.';
        }
        if (this.trendStats.change > 0) {
          return '출석률이 소폭 상승 중입니다. 좋은 추세를 유지하세요.';
        }
        return '출석률이 소폭 하락 중입니다. 관심을 기울일 필요가 있습니다.';
      },
    },
  };
</script>

<style scoped>
  .search-field {
    max-width: 200px;
  }

  .heatmap-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }

  .heatmap-day {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .day-label {
    width: 30px;
    text-align: center;
    font-weight: bold;
  }

  .day-bar {
    flex-grow: 1;
  }

  .day-stat {
    width: 60px;
    text-align: right;
    font-size: 0.85rem;
    color: #666;
  }

  .trend-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .trend-stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .trend-label {
    font-size: 0.9rem;
    color: #666;
  }

  .trend-alert {
    margin-top: 16px;
  }

  @media (max-width: 600px) {
    .search-field {
      max-width: 100%;
    }
  }
</style>
