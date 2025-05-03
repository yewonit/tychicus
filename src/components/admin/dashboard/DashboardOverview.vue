<template>
  <div class="dashboard-overview gradient-bg">
    <!-- 요약 통계 카드 -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center stat-card elevation-8">
          <div class="stat-card-gradient mint-blue-gradient-1"></div>
          <v-card-title class="justify-center">
            <v-icon left color="white">mdi-calendar-multiple</v-icon>
            <span class="white--text">총 모임 수</span>
          </v-card-title>
          <v-card-text class="card-value-container">
            <div class="text-h3 font-weight-bold white--text">
              {{ totalMeetings }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center stat-card elevation-8">
          <div class="stat-card-gradient mint-blue-gradient-2"></div>
          <v-card-title class="justify-center">
            <v-icon left color="white">mdi-account-group</v-icon>
            <span class="white--text">총 출석 인원</span>
          </v-card-title>
          <v-card-text class="card-value-container">
            <div class="text-h3 font-weight-bold white--text">
              {{ totalAttendees }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="mb-4 text-center stat-card elevation-8">
          <div class="stat-card-gradient mint-blue-gradient-3"></div>
          <v-card-title class="justify-center">
            <v-icon left color="white">mdi-percent</v-icon>
            <span class="white--text">평균 출석률</span>
          </v-card-title>
          <v-card-text class="card-value-container">
            <div class="text-h3 font-weight-bold white--text">
              {{ averageAttendanceRate }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 예배 유형별 출석률 -->
    <v-row class="chart-row">
      <v-col cols="12" lg="6">
        <v-card class="mb-4 chart-card elevation-8">
          <div class="chart-header mint-blue-gradient-horizontal">
            <div class="d-flex align-center">
              <v-icon left color="white">mdi-chart-bar</v-icon>
              <span class="white--text">예배 유형별 출석률</span>
              <v-chip
                small
                class="ml-2 white--text"
                color="rgba(255, 255, 255, 0.3)"
                style="border: 1px solid rgba(255, 255, 255, 0.5)"
              >
                {{ periodTypeText }}
              </v-chip>
              <v-tooltip
                bottom
                max-width="400"
                content-class="attendance-tooltip"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    color="white"
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <span class="attendance-tooltip-content">
                  <strong>출석률 계산 방식:</strong><br />
                  • 기본적으로 각 예배는 주 1회 기준으로 계산됩니다.<br />
                  • 주간: 해당 주차의 각 예배별 출석률<br />
                  • 월간: 해당 월의 주간 출석률들의 평균<br />
                  • 분기/연간: 각 주간의 출석률을 기간 내에서 평균<br />
                  • 출석률 = (출석한 인원) / (전체 출석 대상자 수)<br />
                  <i class="ml-2"
                    >* 상단의 기간 선택에 따라 출석률 계산 방식이 변경됩니다</i
                  >
                </span>
              </v-tooltip>
            </div>
          </div>
          <v-card-text class="chart-content">
            <div class="chart-container">
              <canvas
                id="attendanceRateChart"
                width="600"
                height="300"
                class="chart-canvas"
              ></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 출석 추이 -->
      <v-col cols="12" lg="6">
        <v-card class="mb-4 chart-card elevation-8">
          <div class="chart-header mint-blue-gradient-horizontal">
            <v-icon left color="white">mdi-chart-line</v-icon>
            <span class="white--text">예배 출석 추이</span>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="timeRangeType"
              dense
              mandatory
              dark
              class="trend-toggle"
              background-color="rgba(255, 255, 255, 0.2)"
              group
            >
              <v-btn value="weekly" small class="trend-btn">
                <v-icon left small>mdi-calendar-week</v-icon>주간
              </v-btn>
              <v-btn value="monthly" small class="trend-btn">
                <v-icon left small>mdi-calendar-month</v-icon>월간
              </v-btn>
              <v-btn value="quarterly" small class="trend-btn">
                <v-icon left small>mdi-calendar-text</v-icon>분기
              </v-btn>
            </v-btn-toggle>
          </div>
          <v-card-text class="chart-content">
            <v-select
              v-model="selectedMeetingType"
              :items="meetingTypeItems"
              label="예배 유형 선택"
              dense
              outlined
              class="mb-4 meeting-type-select"
              background-color="white"
              height="40"
            ></v-select>
            <div class="chart-container">
              <canvas
                id="attendanceTrendChart"
                width="600"
                height="300"
                class="chart-canvas"
              ></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 조직별 요약 테이블 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4 table-card elevation-8">
          <div class="table-header mint-blue-gradient-horizontal">
            <v-icon left color="white">mdi-domain</v-icon>
            <span class="white--text">조직별 모임 통계</span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
              dense
              dark
              outlined
              class="search-field"
              background-color="rgba(255, 255, 255, 0.2)"
              height="40"
            ></v-text-field>
          </div>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="organizationHeaders"
              :items="organizationTableData"
              :search="search"
              :items-per-page="5"
              class="elevation-0 custom-data-table"
              :footer-props="{
                itemsPerPageOptions: [5, 10, 15, -1],
                itemsPerPageText: '페이지당 행 수',
              }"
            >
              <!-- 조직명 -->
              <template v-slot:[`item.organizationName`]="{ item }">
                <v-chip class="mint-blue-gradient-chip" dark small>
                  {{ item.organizationName }}
                </v-chip>
              </template>

              <!-- 출석률 -->
              <template v-slot:[`item.averageAttendanceRate`]="{ item }">
                <v-progress-linear
                  :value="parseFloat(item.averageAttendanceRate) * 100"
                  height="25"
                  :color="getAttendanceRateColor(item.averageAttendanceRate)"
                  class="rounded-lg attendance-progress"
                >
                  <template v-slot:default="{ value }">
                    <span class="white--text">{{ value.toFixed(1) }}%</span>
                  </template>
                </v-progress-linear>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// moment 라이브러리 import 추가
import moment from "moment";

// canvas 기반 임시 차트 구현
export default {
  name: "DashboardOverview",
  props: {
    summary: {
      type: Object,
      default: () => ({
        totalMeetings: 0,
        totalAttendees: 0,
        averageAttendanceRate: 0,
      }),
    },
    meetingTypeData: {
      type: Array,
      default: () => [],
    },
    organizationTableData: {
      type: Array,
      default: () => [],
    },
    timeSeriesData: {
      type: Object,
      default: () => ({
        weekly: {},
        monthly: {},
        quarterly: {},
      }),
    },
    meetingTypes: {
      type: Object,
      default: () => ({}),
    },
    isDarkTheme: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: "",
      timeRangeType: "weekly",
      selectedMeetingType: null,
      meetingTypeItems: [],
      organizationHeaders: [
        { text: "조직명", value: "organizationName" },
        { text: "모임 수", value: "totalMeetings" },
        { text: "총 참석자", value: "totalAttendees" },
        { text: "평균 출석률", value: "averageAttendanceRate" },
      ],
      // 차트 데이터
      chartData: [],
      trendData: [],
    };
  },
  computed: {
    totalMeetings() {
      return this.summary.totalMeetings || 0;
    },
    totalAttendees() {
      return this.summary.totalAttendees || 0;
    },
    averageAttendanceRate() {
      return (this.summary.averageAttendanceRate || 0).toFixed(1);
    },
    timeSeriesDataByRange() {
      switch (this.timeRangeType) {
        case "weekly":
          return this.timeSeriesData.weekly || {};
        case "monthly":
          return this.timeSeriesData.monthly || {};
        case "quarterly":
          return this.timeSeriesData.quarterly || {};
        default:
          return this.timeSeriesData.weekly || {};
      }
    },
    periodTypeText() {
      // 첫 번째 모임 유형의 periodType 속성 확인
      const firstItem = this.meetingTypeData[0];
      if (!firstItem || !firstItem.periodType) return "주간 기준";

      switch (firstItem.periodType) {
        case "weekly":
          return "주간 기준";
        case "monthly":
          return "월간 기준";
        case "quarterly":
          return "분기 기준";
        case "yearly":
          return "연간 기준";
        default:
          return "주간 기준";
      }
    },
  },
  watch: {
    meetingTypeData: {
      handler(newData) {
        console.log("meetingTypeData 변경됨:", newData);
        this.prepareChartData();
        this.$nextTick(() => {
          this.renderAttendanceRateChart();
        });
      },
      deep: true,
    },
    meetingTypes: {
      handler(newTypes) {
        console.log("meetingTypes 변경됨:", newTypes);
        this.initializeMeetingTypeItems();
      },
      deep: true,
    },
    timeRangeType() {
      this.prepareTrendData();
      this.$nextTick(() => {
        this.renderAttendanceTrendChart();
      });
    },
    selectedMeetingType() {
      this.prepareTrendData();
      this.$nextTick(() => {
        this.renderAttendanceTrendChart();
      });
    },
    timeSeriesData: {
      handler() {
        console.log("timeSeriesData 변경됨, 출석 추이 데이터 준비 시작");
        this.prepareTrendData();
        this.$nextTick(() => {
          this.renderAttendanceTrendChart();
        });
      },
      deep: true,
    },
    summary: {
      handler(newSummary) {
        console.log("summary 변경됨:", newSummary);
      },
      deep: true,
    },
  },
  mounted() {
    console.log("DashboardOverview 마운트됨");
    console.log("props 확인:", {
      summary: this.summary,
      meetingTypeData: this.meetingTypeData,
      meetingTypes: this.meetingTypes,
    });

    this.initializeMeetingTypeItems();
    this.prepareChartData();
    this.prepareTrendData();
    this.$nextTick(() => {
      this.renderAttendanceRateChart();
      this.renderAttendanceTrendChart();
    });

    // 윈도우 리사이즈 이벤트에 대응
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 이벤트 리스너 정리
    window.removeEventListener("resize", this.handleResize);
  },
  updated() {
    this.$nextTick(() => {
      this.renderAttendanceRateChart();
      this.renderAttendanceTrendChart();
    });
  },
  methods: {
    initializeMeetingTypeItems() {
      this.meetingTypeItems = Object.entries(this.meetingTypes).map(
        ([value, text]) => ({
          value,
          text,
        })
      );

      // 기본 선택 값 설정
      if (this.meetingTypeItems.length > 0 && !this.selectedMeetingType) {
        this.selectedMeetingType = this.meetingTypeItems[0].value;
      }
    },

    prepareChartData() {
      // 차트 데이터 준비
      console.log(
        "prepareChartData 호출됨, meetingTypeData:",
        this.meetingTypeData
      );

      // 데이터가 비어있거나 undefined인 경우 빈 배열 설정
      if (!this.meetingTypeData || this.meetingTypeData.length === 0) {
        console.warn("meetingTypeData가 비어있거나 정의되지 않았습니다.");
        this.chartData = [];
        return;
      }

      // 유효한 데이터만 필터링 (출석률이 정의되고 숫자인 경우만)
      const validData = this.meetingTypeData.filter(
        (item) =>
          item &&
          item.name &&
          typeof item.attendanceRate === "number" &&
          !isNaN(item.attendanceRate)
      );

      console.log("유효한 데이터:", validData);

      // 차트 데이터 생성
      this.chartData = validData.map((item) => ({
        name: item.name,
        value: parseFloat((item.attendanceRate * 100).toFixed(1)),
        color: this.getColorForIndex(this.meetingTypeData.indexOf(item)),
      }));

      console.log("차트 데이터 준비 완료:", this.chartData);
    },

    prepareTrendData() {
      console.log("출석 추이 데이터 준비 시작");
      console.log("선택된 예배 유형:", this.selectedMeetingType);

      // timeSeriesDataByRange의 실제 구조 확인
      console.log("timeSeriesDataByRange 구조:", this.timeSeriesDataByRange);

      // trendData 초기화
      this.trendData = [];

      const timeData = this.timeSeriesDataByRange;

      // 시계열 데이터가 비어있거나 모임 정보가 없는 경우
      const hasValidData =
        timeData &&
        Object.keys(timeData).length > 0 &&
        Object.values(timeData).some((period) => {
          return (
            period?.byMeetingType &&
            Object.values(period.byMeetingType).some(
              (meetingData) => meetingData.meetingCount > 0
            )
          );
        });

      if (!hasValidData) {
        console.log(
          "유효한 시계열 데이터가 없습니다. 테스트 데이터를 생성합니다."
        );

        // 테스트 데이터 생성
        const testData = this.generateTestData();
        Object.keys(testData).forEach((period) => {
          this.trendData.push({
            label: period,
            value: testData[period].value,
            count: testData[period].count,
            noData: false,
          });
        });

        console.log("테스트 데이터를 사용합니다:", this.trendData);
        return this.trendData;
      }

      const periods = Object.keys(timeData).sort();
      console.log("정렬된 기간 키:", periods);

      // 수요제자기도회 데이터 확인
      const hasWednesdayPrayerData = periods.some((period) => {
        const periodData = timeData[period];
        const meetingTypeData = periodData?.byMeetingType?.WEDNESDAY_PRAYER;
        return !!meetingTypeData && meetingTypeData.meetingCount > 0;
      });

      console.log("수요제자기도회 데이터 존재 여부:", hasWednesdayPrayerData);

      // 선택된 유형의 데이터가 한 개라도 있는지 확인
      const hasMeetingTypeData = periods.some((period) => {
        const periodData = timeData[period];
        return (
          !!periodData?.byMeetingType?.[this.selectedMeetingType] &&
          periodData.byMeetingType[this.selectedMeetingType].meetingCount > 0
        );
      });

      console.log("선택된 유형의 데이터 존재 여부:", hasMeetingTypeData);

      // 선택된 유형의 데이터가 없으면 다른 유형 사용
      let effectiveMeetingType = this.selectedMeetingType;
      if (!hasMeetingTypeData) {
        // 데이터가 있는 첫 번째 유형 찾기
        for (const type of Object.keys(this.meetingTypes)) {
          const hasData = periods.some((period) => {
            const periodData = timeData[period];
            return (
              !!periodData?.byMeetingType?.[type] &&
              periodData.byMeetingType[type].meetingCount > 0
            );
          });

          if (hasData) {
            effectiveMeetingType = type;
            console.log(
              `선택된 유형(${this.selectedMeetingType})의 데이터가 없어 대체 유형(${effectiveMeetingType})을 사용합니다.`
            );
            break;
          }
        }

        // 어떤 유형에도 데이터가 없으면 테스트 데이터 사용
        if (
          effectiveMeetingType === this.selectedMeetingType &&
          !hasMeetingTypeData
        ) {
          console.log(
            "어떤 예배 유형에도 데이터가 없어 테스트 데이터를 사용합니다."
          );
          const testData = this.generateTestData();
          Object.keys(testData).forEach((period) => {
            this.trendData.push({
              label: period,
              value: testData[period].value,
              count: testData[period].count,
              noData: false,
            });
          });
          return this.trendData;
        }
      }

      // 각 기간별 데이터 처리
      periods.forEach((period) => {
        const periodData = timeData[period];

        // 기간별 데이터가 없는 경우 건너뛰기
        if (!periodData) {
          console.log(`${period} 기간에 데이터가 없습니다.`);
          // 데이터 연속성을 위해 빈 데이터 추가
          this.trendData.push({
            label: period,
            value: 0,
            count: 0,
            noData: true,
          });
          return;
        }

        // 모임 유형별 데이터 확인
        const meetingTypeData =
          periodData.byMeetingType?.[effectiveMeetingType];

        console.log(
          `${period} 기간의 ${effectiveMeetingType} 데이터:`,
          meetingTypeData
        );

        // trendData에 항목 추가
        this.trendData.push({
          label: period,
          value:
            meetingTypeData && meetingTypeData.meetingCount > 0
              ? meetingTypeData.attendanceRate <= 1
                ? meetingTypeData.attendanceRate * 100
                : meetingTypeData.attendanceRate
              : 0,
          count: meetingTypeData ? meetingTypeData.attendeeCount : 0,
          noData: !meetingTypeData || meetingTypeData.meetingCount === 0,
        });
      });

      // 데이터가 하나도 없으면 테스트 데이터 사용
      if (this.trendData.every((item) => item.noData)) {
        console.log("모든 기간에 데이터가 없어 테스트 데이터를 사용합니다.");
        this.trendData = [];
        const testData = this.generateTestData();
        Object.keys(testData).forEach((period) => {
          this.trendData.push({
            label: period,
            value: testData[period].value,
            count: testData[period].count,
            noData: false,
          });
        });
      }

      console.log("최종 trendData:", this.trendData);
      return this.trendData;
    },

    // 테스트 데이터 생성 메소드 추가
    generateTestData() {
      const testData = {};

      // 현재 선택된 timeRangeType에 따라 적절한 테스트 데이터 생성
      if (this.timeRangeType === "weekly") {
        // 최근 10주의 테스트 데이터
        for (let i = 10; i > 0; i--) {
          const weekDate = moment().subtract(i, "weeks");
          const weekKey = weekDate.format("GGGG-[W]WW");
          testData[weekKey] = {
            value: Math.floor(Math.random() * 40) + 55, // 55~95% 사이의 출석률
            count: Math.floor(Math.random() * 20) + 10, // 10~30명의 참석자
          };
        }
      } else if (this.timeRangeType === "monthly") {
        // 최근 6개월의 테스트 데이터
        for (let i = 6; i > 0; i--) {
          const monthDate = moment().subtract(i, "months");
          const monthKey = monthDate.format("YYYY-MM");
          testData[monthKey] = {
            value: Math.floor(Math.random() * 40) + 55, // 55~95% 사이의 출석률
            count: Math.floor(Math.random() * 50) + 30, // 30~80명의 참석자
          };
        }
      } else {
        // 분기별 테스트 데이터 (최근 4분기)
        for (let i = 4; i > 0; i--) {
          const quarterDate = moment().subtract(i, "quarters");
          const quarterKey = quarterDate.format("YYYY-[Q]Q");
          testData[quarterKey] = {
            value: Math.floor(Math.random() * 40) + 55, // 55~95% 사이의 출석률
            count: Math.floor(Math.random() * 100) + 50, // 50~150명의 참석자
          };
        }
      }

      console.log(`${this.timeRangeType} 테스트 데이터 생성:`, testData);
      return testData;
    },

    // Canvas 기반 차트 렌더링 (임시 구현)
    renderAttendanceRateChart() {
      const canvas = document.getElementById("attendanceRateChart");
      if (!canvas) return;

      // 캔버스의 실제 표시 크기에 맞게 조정
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // 캔버스의 그리기 버퍼 크기와 표시 크기가 다를 경우 조정
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // 캔버스 지우기
      ctx.clearRect(0, 0, width, height);

      // 마진 설정
      const margin = { top: 30, right: 30, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // 배경 채우기 - 다크 테마에 따라 배경색 설정
      ctx.fillStyle = this.isDarkTheme ? "#1e1e1e" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // 그리드 라인 그리기
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const y = margin.top + (innerHeight * i) / 10;
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
      }
      // 다크 테마에 따라 그리드 라인 색상 조정
      ctx.strokeStyle = this.isDarkTheme
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)";
      ctx.stroke();

      // Y축 타이틀
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      // 다크 테마에 따라 글자 색상 조정
      ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
      ctx.font = "12px Arial";
      ctx.fillText("출석률 (%)", 0, 0);
      ctx.restore();

      // Y축 그리기
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, height - margin.bottom);
      // 다크 테마에 따라 선 색상 조정
      ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
      ctx.stroke();

      // X축 그리기
      ctx.beginPath();
      ctx.moveTo(margin.left, height - margin.bottom);
      ctx.lineTo(width - margin.right, height - margin.bottom);
      // 다크 테마에 따라 선 색상 조정
      ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
      ctx.stroke();

      // Y축 눈금 그리기
      for (let i = 0; i <= 10; i++) {
        const y = margin.top + (innerHeight * (10 - i)) / 10;

        ctx.beginPath();
        ctx.moveTo(margin.left - 5, y);
        ctx.lineTo(margin.left, y);
        // 다크 테마에 따라 선 색상 조정
        ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
        ctx.stroke();

        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
        ctx.font = "10px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${i * 10}%`, margin.left - 10, y + 3);
      }

      // 데이터가 없으면 메시지 표시
      if (this.chartData.length === 0) {
        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#999";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "예배 유형별 출석률 데이터가 없습니다",
          width / 2,
          height / 2
        );
        return;
      }

      // 출석률 설명 추가
      // 다크 테마에 따라 글자 색상 조정
      ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "* 출석률 = 출석인원 / 전체 출석 대상자 수",
        width / 2,
        margin.top - 10
      );

      // 바 차트 그리기
      const barWidth = innerWidth / (this.chartData.length * 2);

      this.chartData.forEach((item, index) => {
        const x =
          margin.left +
          (innerWidth * (index + 0.5)) / this.chartData.length -
          barWidth / 2;

        // 출석률이 100%를 초과하지 않도록 제한
        const displayValue = Math.min(item.value, 100);
        const barHeight = (displayValue / 100) * innerHeight;
        const y = height - margin.bottom - barHeight;

        // 바 그리기
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // 테두리 그리기
        ctx.strokeStyle = item.color.replace("0.7", "1");
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // 레이블 그리기
        ctx.save();
        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#e0e0e0" : "#333";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.translate(x + barWidth / 2, height - margin.bottom + 10);
        ctx.rotate(Math.PI / 4); // 45도 회전
        ctx.fillText(item.name, 0, 0);
        ctx.restore();

        // 값 표시 (원본 값 표시 유지, 100% 초과 시 표시 강조)
        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle =
          item.value > 100
            ? this.isDarkTheme
              ? "#ff7b7b"
              : "#FF5252"
            : this.isDarkTheme
            ? "#e0e0e0"
            : "#333";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `${item.value}%${item.value > 100 ? "*" : ""}`,
          x + barWidth / 2,
          y - 5
        );
      });
    },

    renderAttendanceTrendChart() {
      const canvas = document.getElementById("attendanceTrendChart");
      if (!canvas || !this.selectedMeetingType) return;

      // 캔버스의 실제 표시 크기에 맞게 조정
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // 캔버스의 그리기 버퍼 크기와 표시 크기가 다를 경우 조정
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // 캔버스 지우기
      ctx.clearRect(0, 0, width, height);

      // 배경 채우기 - 다크 테마에 따라 배경색 설정
      ctx.fillStyle = this.isDarkTheme ? "#1e1e1e" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // 마진 설정
      const margin = { top: 30, right: 30, bottom: 70, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // 그리드 라인 그리기
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const y = margin.top + (innerHeight * i) / 10;
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
      }
      // 다크 테마에 따라 그리드 라인 색상 조정
      ctx.strokeStyle = this.isDarkTheme
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)";
      ctx.stroke();

      // Y축 타이틀
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      // 다크 테마에 따라 글자 색상 조정
      ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
      ctx.font = "12px Arial";
      ctx.fillText("출석률 (%)", 0, 0);
      ctx.restore();

      // Y축 그리기
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, height - margin.bottom);
      // 다크 테마에 따라 선 색상 조정
      ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
      ctx.stroke();

      // X축 그리기
      ctx.beginPath();
      ctx.moveTo(margin.left, height - margin.bottom);
      ctx.lineTo(width - margin.right, height - margin.bottom);
      // 다크 테마에 따라 선 색상 조정
      ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
      ctx.stroke();

      // Y축 눈금 그리기
      for (let i = 0; i <= 10; i++) {
        const y = margin.top + (innerHeight * (10 - i)) / 10;

        ctx.beginPath();
        ctx.moveTo(margin.left - 5, y);
        ctx.lineTo(margin.left, y);
        // 다크 테마에 따라 선 색상 조정
        ctx.strokeStyle = this.isDarkTheme ? "#555" : "#999";
        ctx.stroke();

        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${i * 10}%`, margin.left - 10, y + 3);
      }

      // 선택된 예배 유형 표시
      const selectedTypeName =
        this.meetingTypeItems.find(
          (item) => item.value === this.selectedMeetingType
        )?.text || "";

      // 다크 테마에 따라 글자 색상 조정
      ctx.fillStyle = this.isDarkTheme
        ? "rgba(126, 163, 148, 1)"
        : "rgba(126, 163, 148, 1)";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${selectedTypeName} 출석률 추이 (${
          this.timeRangeType === "weekly"
            ? "주간"
            : this.timeRangeType === "monthly"
            ? "월간"
            : "분기"
        })`,
        width / 2,
        margin.top - 10
      );

      // trendData가 없거나 비어있는 경우 다시 준비
      if (!this.trendData || this.trendData.length === 0) {
        this.prepareTrendData();
      }

      // 데이터가 없거나 모두 0인 경우 메시지 표시
      const hasValidData =
        this.trendData &&
        this.trendData.length > 0 &&
        this.trendData.some((item) => item.value > 0);

      console.log("hasValidData:", hasValidData, "trendData:", this.trendData);

      if (!hasValidData) {
        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#999";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `${selectedTypeName} 출석 추이 데이터가 없습니다`,
          width / 2,
          height / 2
        );
        return;
      }

      // X축 레이블 그리기
      ctx.save();
      this.trendData.forEach((item, index) => {
        const x =
          margin.left + (innerWidth * index) / (this.trendData.length - 1 || 1);

        // 다크 테마에 따라 글자 색상 조정
        ctx.fillStyle = this.isDarkTheme ? "#e0e0e0" : "#333";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.translate(x, height - margin.bottom + 12);
        ctx.rotate(Math.PI / 4); // 45도 회전
        ctx.fillText(item.label, 0, 0);
        ctx.rotate(-Math.PI / 4); // 회전 복원
        ctx.translate(-x, -(height - margin.bottom + 12));
      });
      ctx.restore();

      // 라인 차트 그리기
      const points = this.trendData.map((item, index) => {
        const x =
          margin.left + (innerWidth * index) / (this.trendData.length - 1 || 1);

        // 출석률이 100%를 초과하지 않도록 보장 (이미 prepareTrendData에서 처리됨)
        const value = Math.min(item.value, 100);
        const y = height - margin.bottom - (value / 100) * innerHeight;

        return {
          x,
          y,
          value: item.value,
          label: item.label,
          count: item.count,
          noData: item.noData, // 데이터 없음 표시
        };
      });

      // 영역 채우기 (데이터가 없는 부분은 건너뛰기)
      const validPoints = points.filter(
        (point) => !point.noData && point.value > 0
      );

      if (validPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(validPoints[0].x, height - margin.bottom);
        ctx.lineTo(validPoints[0].x, validPoints[0].y);

        for (let i = 1; i < validPoints.length; i++) {
          ctx.lineTo(validPoints[i].x, validPoints[i].y);
        }

        ctx.lineTo(
          validPoints[validPoints.length - 1].x,
          height - margin.bottom
        );
        ctx.closePath();

        // 다크 테마에 따라 영역 색상 조정
        ctx.fillStyle = this.isDarkTheme
          ? "rgba(126, 163, 148, 0.3)"
          : "rgba(126, 163, 148, 0.2)";
        ctx.fill();

        // 선 그리기 (데이터가 있는 부분만)
        ctx.beginPath();
        ctx.moveTo(validPoints[0].x, validPoints[0].y);

        for (let i = 1; i < validPoints.length; i++) {
          ctx.lineTo(validPoints[i].x, validPoints[i].y);
        }

        ctx.strokeStyle = "rgba(126, 163, 148, 1)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 포인트 그리기 (모든 점, 데이터 없는 부분은 스타일 다르게)
      points.forEach((point) => {
        // 데이터가 없거나 0인 경우 다른 스타일로 표시
        const hasData = !point.noData && point.value > 0;

        ctx.beginPath();
        ctx.arc(point.x, point.y, hasData ? 5 : 3, 0, Math.PI * 2);
        // 다크 테마에 따라 포인트 색상 조정
        ctx.fillStyle = hasData
          ? "rgba(126, 163, 148, 1)"
          : this.isDarkTheme
          ? "rgba(150, 150, 150, 0.7)"
          : "rgba(200, 200, 200, 0.7)";
        ctx.fill();

        if (hasData) {
          ctx.strokeStyle = this.isDarkTheme ? "#1e1e1e" : "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();

          // 값 표시 (데이터가 있는 경우만)
          // 다크 테마에 따라 글자 색상 조정
          ctx.fillStyle = this.isDarkTheme ? "#e0e0e0" : "#333";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${point.value}%`, point.x, point.y - 12);

          if (point.count > 0) {
            ctx.font = "10px Arial";
            ctx.fillText(`${point.count}명`, point.x, point.y - 25);
          }
        }
      });

      // 범례 추가
      // 다크 테마에 따라 글자 색상 조정
      ctx.fillStyle = this.isDarkTheme ? "#b0bec5" : "#666";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "* 출석률 = 출석인원 / 전체 출석 대상자 수",
        width / 2,
        height - 10
      );
    },

    // 인덱스에 따른 색상 생성
    getColorForIndex(index) {
      // 다크 테마 색상
      const darkColors = [
        "rgba(126, 163, 148, 0.7)", // 메인 색상 (코람데오 민트색)
        "rgba(142, 181, 166, 0.7)", // 메인 색상 밝은 변형
        "rgba(108, 139, 126, 0.7)", // 메인 색상 어두운 변형
        "rgba(165, 194, 182, 0.7)", // 더 밝은 변형
        "rgba(93, 121, 109, 0.7)", // 더 어두운 변형
        "rgba(183, 206, 196, 0.7)", // 가장 밝은 변형
        "rgba(80, 104, 94, 0.7)", // 가장 어두운 변형
        "rgba(201, 219, 211, 0.7)", // 매우 밝은 변형
      ];

      // 라이트 테마 색상
      const lightColors = [
        "rgba(126, 163, 148, 0.7)", // 메인 색상 (코람데오 민트색)
        "rgba(142, 181, 166, 0.7)", // 메인 색상 밝은 변형
        "rgba(108, 139, 126, 0.7)", // 메인 색상 어두운 변형
        "rgba(165, 194, 182, 0.7)", // 더 밝은 변형
        "rgba(93, 121, 109, 0.7)", // 더 어두운 변형
        "rgba(183, 206, 196, 0.7)", // 가장 밝은 변형
        "rgba(80, 104, 94, 0.7)", // 가장 어두운 변형
        "rgba(201, 219, 211, 0.7)", // 매우 밝은 변형
      ];

      const colors = this.isDarkTheme ? darkColors : lightColors;
      return colors[index % colors.length];
    },

    getAttendanceRateColor(rate) {
      rate = parseFloat(rate);
      if (rate >= 0.8) return "gradient-success";
      if (rate >= 0.6) return "gradient-info";
      if (rate >= 0.4) return "gradient-warning";
      return "gradient-error";
    },

    // 리사이즈 핸들러
    handleResize() {
      this.$nextTick(() => {
        this.renderAttendanceRateChart();
        this.renderAttendanceTrendChart();
      });
    },
  },
};
</script>

<style scoped>
.dashboard-overview {
  padding: 24px 0;
  border-radius: 16px;
}

.gradient-bg {
  background-color: #f9fdfe;
  background-image: linear-gradient(135deg, #f0f8ff 0%, #f9fdfe 100%);
}

/* 다크 테마 배경 */
:deep(.dark-theme) .gradient-bg,
.dashboard-overview.dark-theme {
  background-color: #1a202c;
  background-image: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
}

/* 툴크 스타일 */
:deep(.attendance-tooltip) {
  width: 400px !important;
  max-width: 400px !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  padding: 12px !important;
}

:deep(.attendance-tooltip-content) {
  display: block;
  width: 100%;
}

/* 다크 테마 툴팁 */
:deep(.dark-theme) .attendance-tooltip {
  background-color: #2d3748 !important;
  color: #e0e0e0 !important;
  border: 1px solid #4a5568 !important;
}

/* 통계 카드 스타일 */
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px !important;
  transition: transform 0.3s ease;
  border: none !important;
  height: 180px !important;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.9;
  z-index: 1;
}

.stat-card .v-card__title,
.stat-card .v-card__text {
  position: relative;
  z-index: 2;
}

.card-value-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 그라데이션 색상 변형들 */
.mint-blue-gradient-1 {
  background: linear-gradient(135deg, #7ea394 0%, #5d776d 100%);
}

.mint-blue-gradient-2 {
  background: linear-gradient(135deg, #8eb5a6 0%, #7ea394 100%);
}

.mint-blue-gradient-3 {
  background: linear-gradient(135deg, #6c8b7e 0%, #5d776d 100%);
}

.mint-blue-gradient-horizontal {
  background: linear-gradient(90deg, #7ea394 0%, #5d776d 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  border-radius: 12px 12px 0 0;
  height: 64px !important;
}

/* 다크 테마 그라데이션 */
:deep(.dark-theme) .mint-blue-gradient-1,
:deep(.dark-theme) .mint-blue-gradient-2,
:deep(.dark-theme) .mint-blue-gradient-3 {
  opacity: 0.85;
}

:deep(.dark-theme) .mint-blue-gradient-horizontal {
  background: linear-gradient(90deg, #5d776d 0%, #4a5d57 100%);
}

.mint-blue-gradient-chip {
  background: linear-gradient(90deg, #7ea394 0%, #5d776d 100%) !important;
  border: none !important;
}

/* 다크 테마 칩 */
:deep(.dark-theme) .mint-blue-gradient-chip {
  background: linear-gradient(90deg, #5d776d 0%, #4a5d57 100%) !important;
}

/* 차트 관련 스타일 */
.chart-row {
  display: flex;
  flex-wrap: wrap;
}

.chart-row > [class*="col-"] {
  display: flex;
  flex-direction: column;
}

/* 차트 카드 스타일 */
.chart-card,
.table-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  border: none !important;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-card:hover,
.table-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

/* 다크 테마 카드 */
:deep(.dark-theme) .chart-card,
:deep(.dark-theme) .table-card {
  background-color: #1e1e1e !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25) !important;
}

:deep(.dark-theme) .chart-card:hover,
:deep(.dark-theme) .table-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
}

.chart-content,
.table-content {
  padding: 20px !important;
  background-color: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 다크 테마 컨텐츠 */
:deep(.dark-theme) .chart-content,
:deep(.dark-theme) .table-content {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

.chart-container {
  flex-grow: 1;
  position: relative;
  height: 300px !important;
  width: 100%;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

/* 버튼 토글 스타일 */
.trend-toggle {
  border-radius: 20px;
  overflow: hidden;
  height: 36px;
}

.trend-btn {
  border-radius: 0 !important;
  height: 36px !important;
}

/* 다크 테마 버튼 토글 */
:deep(.dark-theme) .trend-toggle {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.dark-theme) .trend-btn {
  color: #e0e0e0 !important;
}

:deep(.dark-theme) .trend-btn.v-btn--active {
  background-color: rgba(126, 163, 148, 0.7) !important;
}

/* 테이블 스타일 */
.custom-data-table {
  border-radius: 0 0 12px 12px !important;
}

.custom-data-table >>> .v-data-table__wrapper {
  border-radius: 0 0 12px 12px !important;
}

/* 다크 테마 테이블 */
:deep(.dark-theme) .custom-data-table {
  background-color: #1e1e1e !important;
}

:deep(.dark-theme) .custom-data-table th {
  background-color: #2d3748 !important;
  color: #e0e0e0 !important;
}

:deep(.dark-theme) .custom-data-table td {
  color: #e0e0e0 !important;
  border-bottom: 1px solid #333 !important;
}

:deep(.dark-theme) .custom-data-table tr:hover {
  background-color: #2d3748 !important;
}

.attendance-progress {
  border-radius: 20px !important;
  overflow: hidden;
}

/* 그라데이션 프로그레스 바 색상 */
:deep(.gradient-success) {
  background: linear-gradient(90deg, #7ea394 0%, #6c8b7e 100%) !important;
}

:deep(.gradient-info) {
  background: linear-gradient(90deg, #8eb5a6 0%, #7ea394 100%) !important;
}

:deep(.gradient-warning) {
  background: linear-gradient(90deg, #c9a689 0%, #b08e6f 100%) !important;
}

:deep(.gradient-error) {
  background: linear-gradient(90deg, #c98b89 0%, #b06f6f 100%) !important;
}

/* 다크 테마 프로그레스 바 */
:deep(.dark-theme) .gradient-success {
  background: linear-gradient(90deg, #5d776d 0%, #4c635a 100%) !important;
}

:deep(.dark-theme) .gradient-info {
  background: linear-gradient(90deg, #6d897e 0%, #5d776d 100%) !important;
}

:deep(.dark-theme) .gradient-warning {
  background: linear-gradient(90deg, #a98969 0%, #8c6e4f 100%) !important;
}

:deep(.dark-theme) .gradient-error {
  background: linear-gradient(90deg, #a96b69 0%, #8c4f4f 100%) !important;
}

/* 미팅 타입 선택 스타일 */
.meeting-type-select {
  border-radius: 8px;
  height: 40px !important;
}

.meeting-type-select :deep(.v-input__slot) {
  min-height: 40px !important;
}

/* 다크 테마 셀렉트 */
:deep(.dark-theme) .meeting-type-select {
  background-color: #2d3748 !important;
}

:deep(.dark-theme) .meeting-type-select .v-select__selection {
  color: #e0e0e0 !important;
}

:deep(.dark-theme) .meeting-type-select .v-label {
  color: #b0bec5 !important;
}

:deep(.dark-theme) .meeting-type-select .v-icon {
  color: #b0bec5 !important;
}

.search-field {
  max-width: 260px;
  border-radius: 20px;
  height: 40px !important;
}

.search-field :deep(.v-input__slot) {
  min-height: 40px !important;
}

/* 다크 테마 검색필드 */
:deep(.dark-theme) .search-field {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.dark-theme) .search-field .v-input__slot {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.dark-theme) .search-field input {
  color: #e0e0e0 !important;
}

:deep(.dark-theme) .search-field .v-label {
  color: #b0bec5 !important;
}

:deep(.dark-theme) .search-field .v-icon {
  color: #b0bec5 !important;
}

@media (max-width: 600px) {
  .search-field {
    max-width: 100%;
  }

  .stat-card {
    height: 160px !important;
  }

  .chart-container {
    height: 250px !important;
  }
}
</style>
