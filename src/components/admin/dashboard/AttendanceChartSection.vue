<template>
  <v-card class="attendance-chart-card">
    <v-card-title class="chart-header" @click="toggleExpanded">
      <div class="d-flex align-center filter-title">
        <v-icon left color="primary">mdi-chart-line</v-icon>
        <span class="text-h6">출석률 동향</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>{{ expanded ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-expand-transition>
      <div v-show="expanded">
        <v-divider></v-divider>

        <!-- 필터 및 컨트롤 영역 - 통합 레이아웃 -->
        <div class="filter-controls card-content-padding">
          <v-row class="align-center">
            <!-- 차트 유형 선택 -->
            <v-col cols="12" sm="3" md="2" class="py-0">
              <div class="chart-type-selector mb-2">
                <div class="subtitle-2 font-weight-medium mb-1">차트 유형</div>
                <v-btn-toggle
                  v-model="chartType"
                  dense
                  mandatory
                  color="primary"
                  class="elevation-0"
                  style="width: 100%"
                >
                  <v-btn small value="combo" title="복합 차트" style="flex: 1">
                    <v-icon x-small class="mr-1">mdi-chart-box</v-icon>
                    <span class="caption">복합</span>
                  </v-btn>
                  <v-btn small value="line" title="선 그래프" style="flex: 1">
                    <v-icon x-small class="mr-1">mdi-chart-line</v-icon>
                    <span class="caption">선</span>
                  </v-btn>
                  <v-btn small value="bar" title="막대 그래프" style="flex: 1">
                    <v-icon x-small class="mr-1">mdi-chart-bar</v-icon>
                    <span class="caption">막대</span>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>

            <!-- 예배 종류 필터 (드롭다운 방식) -->
            <v-col cols="12" sm="9" md="10" class="py-0">
              <div class="subtitle-2 font-weight-medium mb-1">
                <v-icon x-small color="primary" class="mr-1"
                  >mdi-filter-variant</v-icon
                >
                예배 종류 선택
              </div>
              <div class="d-flex flex-wrap align-center">
                <v-chip-group
                  v-model="selectedWorshipTypeIndices"
                  multiple
                  column
                  @change="handleChipSelection"
                >
                  <v-chip
                    small
                    filter
                    :input-value="selectAll"
                    @click="toggleSelectAll"
                    class="mr-1 mb-1"
                  >
                    전체
                  </v-chip>
                  <v-chip
                    v-for="(type, i) in availableWorshipTypes"
                    :key="type.value"
                    small
                    filter
                    :color="getWorshipTypeColor(type.value)"
                    text-color="white"
                    :value="i"
                    class="mr-1 mb-1"
                  >
                    {{ type.text }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider></v-divider>

        <!-- 통계 요약 섹션 -->
        <div
          class="stats-summary period-summary"
          v-if="filteredChartData.labels.length > 0"
        >
          <div class="d-flex flex-wrap justify-space-between">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="stat-item" v-bind="attrs" v-on="on">
                  <div class="stat-value primary--text">
                    {{ stats.avgAttendanceRate }}%
                  </div>
                  <div class="stat-label">평균 출석률</div>
                </div>
              </template>
              <span
                >선택된 기간 동안의 모든 모임 출석률의 평균입니다.<br />전체
                인원 대비 출석한 인원의 비율입니다.</span
              >
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="stat-item" v-bind="attrs" v-on="on">
                  <div class="stat-value success--text">
                    {{ stats.maxAttendanceRate }}%
                  </div>
                  <div class="stat-label">최고 출석률</div>
                  <div class="stat-sublabel">
                    {{ stats.maxAttendanceRateLabel }}
                  </div>
                </div>
              </template>
              <span>
                <strong>{{ stats.maxAttendanceRate }}%</strong> - 선택된 기간 내
                가장 높은 출석률을 기록한 날짜입니다.<br />
                <strong>{{ stats.maxAttendanceRateLabel }}</strong>
                {{ stats.maxAttendanceRateDetail }}
              </span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="stat-item" v-bind="attrs" v-on="on">
                  <div class="stat-value error--text">
                    {{ stats.minAttendanceRate }}%
                  </div>
                  <div class="stat-label">최저 출석률</div>
                  <div class="stat-sublabel">
                    {{ stats.minAttendanceRateLabel }}
                  </div>
                </div>
              </template>
              <span>
                <strong>{{ stats.minAttendanceRate }}%</strong> - 선택된 기간 내
                가장 낮은 출석률을 기록한 날짜입니다.<br />
                <strong>{{ stats.minAttendanceRateLabel }}</strong>
                {{ stats.minAttendanceRateDetail }}
              </span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="stat-item" v-bind="attrs" v-on="on">
                  <div class="stat-value deep-purple--text">
                    {{ stats.totalAttendees }}명
                  </div>
                  <div class="stat-label">총 출석인원</div>
                </div>
              </template>
              <span
                >선택된 기간 동안 모든 모임에 출석한 인원의 총합입니다.<br />한
                사람이 여러 모임에 출석한 경우 중복 집계됩니다.</span
              >
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="stat-item" v-bind="attrs" v-on="on">
                  <div class="stat-value orange--text">
                    {{ stats.avgAttendees }}명
                  </div>
                  <div class="stat-label">평균 출석인원</div>
                </div>
              </template>
              <span
                >선택된 기간 동안 모임 당 평균 출석 인원수입니다.<br />총
                출석인원 ÷ 모임 횟수로 계산됩니다.</span
              >
            </v-tooltip>
          </div>
        </div>

        <v-divider></v-divider>
        <v-card-text class="card-content-padding">
          <div
            v-if="filteredChartData.labels.length === 0"
            class="text-center py-5"
          >
            <v-icon size="64" color="grey lighten-1"
              >mdi-chart-timeline-variant</v-icon
            >
            <div class="text-h6 grey--text mt-3">
              표시할 출석 데이터가 없습니다.
            </div>
          </div>
          <div
            v-else
            class="chart-container"
            style="position: relative; height: 400px"
          >
            <canvas ref="attendanceChart"></canvas>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import Chart from "chart.js/auto";
import moment from "moment";

export default {
  name: "AttendanceChartSection",
  props: {
    // 모임 날짜 목록 (X축)
    meetingDates: {
      type: Array,
      required: true,
    },
    // 모든 회원의 출석 데이터
    memberAttendanceData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      expanded: true, // 기본적으로 펼쳐진 상태
      chart: null,
      selectAll: true, // 전체 선택 상태
      selectedWorshipTypes: [], // 선택된 예배 유형 값
      selectedWorshipTypeIndices: [], // 선택된 예배 유형 인덱스
      chartType: "combo", // 차트 유형: 'combo', 'line', 'bar'
      worshipTypeLabels: {
        SUNDAY_SERVICE_2: "주일2부예배",
        SUNDAY_SERVICE_3: "주일3부예배",
        YOUTH_SERVICE: "청년예배",
        WEDNESDAY_SERVICE: "수요예배",
        FRIDAY_SERVICE: "금요예배",
        WEDNESDAY_PRAYER: "수요제자기도회",
        HEALING_MINISTRY: "현장치유팀사역",
        OTHER: "기타",
      },
      // 예배 유형별 색상
      worshipTypeColors: {
        SUNDAY_SERVICE_2: "#4ecdc4", // 민트색 (브랜드 컬러)
        SUNDAY_SERVICE_3: "#38b6ff", // 스카이블루 (브랜드 컬러)
        YOUTH_SERVICE: "#5E72E4", // 인디고블루
        WEDNESDAY_SERVICE: "#11CDEF", // 밝은 시안
        FRIDAY_SERVICE: "#FB6340", // 코랄
        WEDNESDAY_PRAYER: "#8F76F9", // 라벤더
        HEALING_MINISTRY: "#2DCE89", // 에메랄드
        OTHER: "#6c757d", // 세련된 그레이
      },
    };
  },
  computed: {
    // 사용 가능한 예배 유형 목록
    availableWorshipTypes() {
      // 현재 meetingDates에서 사용되는 예배 유형만 추출
      const uniqueTypes = [
        ...new Set(this.meetingDates.map((meeting) => meeting.type)),
      ];

      return uniqueTypes.map((type) => ({
        value: type,
        text: this.worshipTypeLabels[type] || type,
      }));
    },

    // 원본 차트 데이터 계산
    chartData() {
      if (
        !this.meetingDates ||
        this.meetingDates.length === 0 ||
        !this.memberAttendanceData
      ) {
        console.log(
          "차트 데이터 없음 - meetingDates 또는 memberAttendanceData가 없습니다."
        );
        return { labels: [], datasets: [] };
      }

      console.log(
        "차트 데이터 계산 시작 - meetingDates:",
        this.meetingDates.length
      );

      // 각 일자별 출석 정보 집계
      const labels = [];
      const attendanceRates = [];
      const attendanceCounts = [];
      const meetingTypes = [];
      const detailData = [];

      // X축 라벨 준비
      this.meetingDates.forEach((meeting, index) => {
        const meetingKey = `meeting_${index}`;

        // 라벨 형식: MM/DD (요일) 예배명
        try {
          const date = moment(meeting.date).format("MM/DD (ddd)");
          const label = `${date} ${meeting.typeName}`;
          labels.push(label);
          meetingTypes.push(meeting.type);

          // 출석 인원 및 출석률 계산
          let presentCount = 0;
          let totalCount = 0;

          this.memberAttendanceData.forEach((member) => {
            if (member[meetingKey]) {
              totalCount++;
              if (member[meetingKey] === "O") {
                presentCount++;
              }
            }
          });

          // 출석률 (퍼센트) 및 출석 인원 저장
          const attendanceRate =
            totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
          attendanceRates.push(attendanceRate);
          attendanceCounts.push(presentCount);

          // 상세 데이터 저장 (툴팁용)
          detailData.push({
            date: meeting.date,
            formattedDate: date,
            worshipType: meeting.type,
            worshipName: meeting.typeName,
            attendanceRate,
            presentCount,
            totalCount,
          });

          console.log(
            `차트 데이터: ${label} - 출석률: ${attendanceRate}%, 출석인원: ${presentCount}명`
          );
        } catch (error) {
          console.error("차트 데이터 처리 중 오류:", error, meeting);
        }
      });

      console.log("차트 데이터 계산 완료 - 데이터 포인트:", labels.length);

      return {
        labels,
        meetingTypes,
        detailData,
        datasets: [
          {
            label: "출석률 (%)",
            data: attendanceRates,
            backgroundColor: "rgba(78, 205, 196, 0.2)", // 민트색 배경
            borderColor: "rgba(78, 205, 196, 1)", // 민트색 테두리
            borderWidth: 2,
            yAxisID: "y",
            tension: 0.3,
            // 복합 차트 사용 시 타입 지정
            type: "line",
            fill: true, // 영역 채우기
            pointBackgroundColor: attendanceRates.map((rate, i) =>
              this.getPointColorByRate(rate, meetingTypes[i])
            ),
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBorderColor: "#fff",
            pointStyle: "circle",
            pointShadowBlur: 5,
            pointShadowOffsetX: 1,
            pointShadowOffsetY: 1,
            pointShadowColor: "rgba(0,0,0,0.2)",
            // 값 변화에 따른 강조 설정
            segment: {
              borderColor: (ctx) => {
                if (!ctx.p0.skip && !ctx.p1.skip) {
                  // 급격한 변화(10% 이상) 감지 및 표시
                  if (Math.abs(ctx.p0.parsed.y - ctx.p1.parsed.y) > 10) {
                    return "rgba(78, 205, 196, 1)"; // 강조 색상
                  }
                }
                // 기본 색상
                return "rgba(78, 205, 196, 0.8)";
              },
              borderWidth: (ctx) => {
                if (!ctx.p0.skip && !ctx.p1.skip) {
                  // 급격한 변화(10% 이상) 감지 및 표시
                  if (Math.abs(ctx.p0.parsed.y - ctx.p1.parsed.y) > 10) {
                    return 3; // 굵은 선
                  }
                }
                return 2; // 기본 선 두께
              },
            },
          },
          {
            label: "출석 인원",
            data: attendanceCounts,
            backgroundColor: attendanceRates.map((rate, i) =>
              this.getBarColorByType(meetingTypes[i], 0.6)
            ),
            borderColor: attendanceRates.map((rate, i) =>
              this.getBarColorByType(meetingTypes[i], 1)
            ),
            borderWidth: 1,
            yAxisID: "y1",
            // 복합 차트 사용 시 타입 지정
            type: "bar",
          },
        ],
      };
    },

    // 필터링된 차트 데이터
    filteredChartData() {
      const rawData = this.chartData;
      if (rawData.labels.length === 0) {
        return rawData;
      }

      // 선택된 예배 유형이 없거나 전체 선택 상태인 경우 모든 데이터 반환
      if (this.selectAll || this.selectedWorshipTypes.length === 0) {
        return rawData;
      }

      // 선택된 예배 유형에 해당하는 데이터만 필터링
      const filteredIndices = [];
      rawData.meetingTypes.forEach((type, index) => {
        if (this.selectedWorshipTypes.includes(type)) {
          filteredIndices.push(index);
        }
      });

      // 필터링된 데이터 생성
      const filteredLabels = filteredIndices.map((i) => rawData.labels[i]);
      const filteredTypes = filteredIndices.map((i) => rawData.meetingTypes[i]);
      const filteredDetailData = filteredIndices.map(
        (i) => rawData.detailData[i]
      );

      // 데이터셋 필터링
      const filteredDatasets = rawData.datasets.map((dataset) => {
        const newDataset = { ...dataset };

        // 데이터 필터링
        newDataset.data = filteredIndices.map((i) => dataset.data[i]);

        // 포인트 색상이 있는 경우 필터링
        if (dataset.pointBackgroundColor) {
          newDataset.pointBackgroundColor = filteredIndices.map(
            (i) => dataset.pointBackgroundColor[i]
          );
        }

        // 배경색이 배열인 경우 필터링
        if (Array.isArray(dataset.backgroundColor)) {
          newDataset.backgroundColor = filteredIndices.map(
            (i) => dataset.backgroundColor[i]
          );
        }

        // 테두리 색상이 배열인 경우 필터링
        if (Array.isArray(dataset.borderColor)) {
          newDataset.borderColor = filteredIndices.map(
            (i) => dataset.borderColor[i]
          );
        }

        return newDataset;
      });

      return {
        labels: filteredLabels,
        meetingTypes: filteredTypes,
        detailData: filteredDetailData,
        datasets: filteredDatasets,
      };
    },

    // 통계 계산
    stats() {
      const data = this.filteredChartData;
      if (
        !data ||
        !data.datasets ||
        data.datasets.length === 0 ||
        data.datasets[0].data.length === 0
      ) {
        return {
          avgAttendanceRate: 0,
          maxAttendanceRate: 0,
          minAttendanceRate: 0,
          maxAttendanceRateLabel: "-",
          minAttendanceRateLabel: "-",
          maxAttendanceRateDetail: "-",
          minAttendanceRateDetail: "-",
          totalAttendees: 0,
          avgAttendees: 0,
        };
      }

      const attendanceRates = data.datasets[0].data;
      const attendanceCounts = data.datasets[1].data;
      const detailData = data.detailData || [];

      // 평균 출석률
      const avgAttendanceRate = Math.round(
        attendanceRates.reduce((sum, rate) => sum + rate, 0) /
          attendanceRates.length
      );

      // 최대 출석률
      const maxAttendanceRate = Math.max(...attendanceRates);
      const maxIndex = attendanceRates.indexOf(maxAttendanceRate);
      let maxAttendanceRateLabel = "-";
      let maxAttendanceRateDetail = "-";

      if (maxIndex >= 0 && detailData[maxIndex]) {
        const detail = detailData[maxIndex];
        maxAttendanceRateLabel = `${detail.formattedDate}`;
        maxAttendanceRateDetail = `${detail.worshipName} (${detail.presentCount}명/${detail.totalCount}명)`;
      }

      // 최소 출석률
      const minAttendanceRate = Math.min(...attendanceRates);
      const minIndex = attendanceRates.indexOf(minAttendanceRate);
      let minAttendanceRateLabel = "-";
      let minAttendanceRateDetail = "-";

      if (minIndex >= 0 && detailData[minIndex]) {
        const detail = detailData[minIndex];
        minAttendanceRateLabel = `${detail.formattedDate}`;
        minAttendanceRateDetail = `${detail.worshipName} (${detail.presentCount}명/${detail.totalCount}명)`;
      }

      // 총 출석 인원
      const totalAttendees = attendanceCounts.reduce(
        (sum, count) => sum + count,
        0
      );

      // 평균 출석 인원
      const avgAttendees = Math.round(totalAttendees / attendanceCounts.length);

      return {
        avgAttendanceRate,
        maxAttendanceRate,
        minAttendanceRate,
        maxAttendanceRateLabel,
        minAttendanceRateLabel,
        maxAttendanceRateDetail,
        minAttendanceRateDetail,
        totalAttendees,
        avgAttendees,
      };
    },
  },
  watch: {
    // 차트 데이터가 변경되면 차트 업데이트
    filteredChartData: {
      handler() {
        console.log("filteredChartData 변경 감지 - 차트 업데이트");
        this.updateChart();
      },
      deep: true,
    },
    // 차트 유형 변경 감지
    chartType() {
      console.log("차트 유형 변경:", this.chartType);
      this.$nextTick(() => {
        this.updateChartType();
      });
    },
    // meetingDates 변경 감지
    meetingDates: {
      handler(newValue) {
        console.log("meetingDates 변경 감지:", newValue?.length);
        // 초기화 - 모든 예배 유형 선택
        this.initializeWorshipTypes();
        this.$nextTick(() => {
          this.updateChart();
        });
      },
      deep: true,
    },
    // memberAttendanceData 변경 감지
    memberAttendanceData: {
      handler(newValue) {
        console.log("memberAttendanceData 변경 감지:", newValue?.length);
        this.$nextTick(() => {
          this.updateChart();
        });
      },
      deep: true,
    },
    expanded(val) {
      // 펼쳐질 때 차트 다시 렌더링 (크기 조정 문제 해결을 위해)
      if (val) {
        console.log("차트 영역 펼침 - 차트 다시 렌더링");
        this.$nextTick(() => {
          this.updateChart();
        });
      }
    },
  },
  mounted() {
    console.log(
      "AttendanceChartSection mounted - meetingDates:",
      this.meetingDates?.length
    );
    console.log(
      "AttendanceChartSection mounted - memberAttendanceData:",
      this.memberAttendanceData?.length
    );

    // 예배 유형 초기화
    this.initializeWorshipTypes();

    // DOM이 준비된 후 차트 생성 보장
    this.$nextTick(() => {
      this.createChart();
    });
  },
  beforeDestroy() {
    // 차트 인스턴스 정리
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    // 예배 유형별 색상 반환
    getWorshipTypeColor(type) {
      return this.worshipTypeColors[type] || "#757575";
    },

    // 출석률에 따른 포인트 색상 반환
    getPointColorByRate(rate, type) {
      // 기본 색상은 예배 유형 색상
      const baseColor = this.getWorshipTypeColor(type);

      // hex 색상을 rgb로 변환하기 위한 함수
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      };

      const rgb = hexToRgb(baseColor);

      // 출석률에 따라 색상 및 밝기 조정
      if (rate >= 90) {
        // 높은 출석률: 더 강한 색상
        return baseColor;
      } else if (rate >= 70) {
        // 중간 출석률: 기본 색상에 약간 투명도 추가
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85)`;
      } else {
        // 낮은 출석률: 더 투명한 색상
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
      }
    },

    // 예배 유형에 따른 막대 색상 반환
    getBarColorByType(type, alpha = 1) {
      const color = this.worshipTypeColors[type] || "#6c757d";

      // 알파 값 적용
      if (alpha < 1) {
        // hex 색상을 rgba로 변환
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // 밝은 계조 효과를 위해 약간의 밝기 추가
        const lightenFactor = 0.1;
        const adjustedR = Math.min(255, r + (255 - r) * lightenFactor);
        const adjustedG = Math.min(255, g + (255 - g) * lightenFactor);
        const adjustedB = Math.min(255, b + (255 - b) * lightenFactor);

        return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
      }

      return color;
    },

    // 예배 유형 초기화
    initializeWorshipTypes() {
      // 모든 예배 유형 선택
      this.selectedWorshipTypes = this.availableWorshipTypes.map(
        (type) => type.value
      );

      // 인덱스 기반 선택도 모두 선택
      this.selectedWorshipTypeIndices = this.availableWorshipTypes.map(
        (_, index) => index
      );

      this.selectAll = true;
    },

    // 전체 선택/해제 토글
    toggleSelectAll() {
      this.selectAll = !this.selectAll;

      if (this.selectAll) {
        // 모든 예배 유형 선택
        this.selectedWorshipTypes = this.availableWorshipTypes.map(
          (type) => type.value
        );
        this.selectedWorshipTypeIndices = this.availableWorshipTypes.map(
          (_, index) => index
        );
      } else {
        // 모든 예배 유형 해제
        this.selectedWorshipTypes = [];
        this.selectedWorshipTypeIndices = [];
      }
    },

    // 칩 선택 처리
    handleChipSelection() {
      // 칩 인덱스로부터 예배 유형 값으로 변환
      this.selectedWorshipTypes = this.selectedWorshipTypeIndices.map(
        (index) => this.availableWorshipTypes[index].value
      );

      // 전체 선택 여부 체크
      if (
        this.selectedWorshipTypeIndices.length ===
        this.availableWorshipTypes.length
      ) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },

    // 펼침/접기 토글
    toggleExpanded() {
      this.expanded = !this.expanded;
    },

    // 차트 생성
    createChart() {
      console.log(
        "createChart 호출됨, 레퍼런스 확인:",
        this.$refs.attendanceChart
      );

      if (!this.$refs.attendanceChart) {
        console.warn("차트 캔버스 레퍼런스를 찾을 수 없습니다.");
        return;
      }

      // 이미 차트가 있다면 제거
      if (this.chart) {
        console.log("기존 차트 제거");
        this.chart.destroy();
      }

      try {
        const ctx = this.$refs.attendanceChart.getContext("2d");
        const chartData = this.filteredChartData;

        console.log("차트 생성 시도, 데이터셋:", chartData.datasets?.length);

        // 차트 유형에 따른 데이터셋 설정
        const datasets = this.configureDatasetsByChartType(chartData.datasets);

        // 평균 출석률 계산 (가로 참조선용)
        const avgRate = this.stats.avgAttendanceRate;

        this.chart = new Chart(ctx, {
          type: this.chartType === "combo" ? "bar" : this.chartType, // 복합 차트의 경우 기본 타입은 'bar'
          data: {
            ...chartData,
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20, // 상단 여백 추가
              },
            },
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                  display: true,
                  text: "출석률 (%)",
                  color: "#4ecdc4",
                  font: {
                    weight: "bold",
                  },
                },
                min: 0,
                // 데이터에 따라 최대값 동적 조정
                max: Math.max(100, Math.max(...datasets[0].data) + 10),
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                  color: "#4ecdc4",
                  font: {
                    weight: (value) => (value === avgRate ? "bold" : "normal"),
                  },
                },
                grid: {
                  drawBorder: false,
                  color: (context) => {
                    // 평균 출석률 위치에 강조선 표시
                    if (context.tick.value === avgRate) {
                      return "rgba(78, 205, 196, 0.3)";
                    }
                    return "rgba(0, 0, 0, 0.05)";
                  },
                  lineWidth: (context) => {
                    // 평균 출석률 위치에 굵은선 표시
                    if (context.tick.value === avgRate) {
                      return 1.5;
                    }
                    return 0.5;
                  },
                },
              },
              y1: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                  display: true,
                  text: "출석 인원",
                  color: "#DB4437",
                  font: {
                    weight: "bold",
                  },
                },
                min: 0,
                // 데이터에 따라 여유있게 최대값 설정
                suggestedMax: Math.max(...datasets[1].data) * 1.2,
                grid: {
                  drawOnChartArea: false,
                  drawBorder: false,
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  color: "#DB4437",
                  font: {
                    weight: "normal",
                  },
                },
              },
              x: {
                grid: {
                  drawBorder: false,
                  // 격자 강조
                  color: (context) => {
                    // 짝수 인덱스 위치에 배경색 추가
                    return context.index % 2 === 0
                      ? "rgba(0, 0, 0, 0.03)"
                      : "rgba(0, 0, 0, 0.01)";
                  },
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  autoSkip: true,
                  maxTicksLimit: 15, // 최대 표시 레이블 수 제한
                  font: {
                    size: 10,
                  },
                  // 짧은 형식의 레이블로 변환
                  callback: function (value, index, values) {
                    const label = this.getLabelForValue(value);

                    // 전체 레이블 수에 따라 다른 형식 적용
                    if (values.length > 10) {
                      // 많은 레이블이 있을 경우 날짜만 표시
                      const match = label.match(/(\d{2}\/\d{2})/);
                      return match ? match[1] : label;
                    } else {
                      // 레이블이 적을 경우 날짜와 요일 표시
                      const match = label.match(
                        /(\d{2}\/\d{2}\s\([가-힣]{1}\))/
                      );
                      return match ? match[1] : label;
                    }
                  },
                },
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const dataIndex = context[0].dataIndex;
                    const detailData = chartData.detailData?.[dataIndex];

                    if (detailData) {
                      const originalDate = moment(detailData.date).format(
                        "YYYY년 MM월 DD일"
                      );
                      const dayOfWeek = moment(detailData.date).format("dddd");
                      return `${originalDate} (${dayOfWeek}) - ${detailData.worshipName}`;
                    }

                    return context[0].label;
                  },
                  label: (context) => {
                    const label = context.dataset.label || "";
                    const value = context.parsed.y;
                    const dataIndex = context.dataIndex;
                    const detailData = chartData.detailData?.[dataIndex];

                    const lines = [];

                    if (context.datasetIndex === 0) {
                      // 출석률 데이터셋
                      if (detailData) {
                        // 평균과 비교한 출석률 표시
                        const compareAvg =
                          detailData.attendanceRate > avgRate
                            ? `평균보다 ${(
                                detailData.attendanceRate - avgRate
                              ).toFixed(1)}%↑`
                            : detailData.attendanceRate < avgRate
                            ? `평균보다 ${(
                                avgRate - detailData.attendanceRate
                              ).toFixed(1)}%↓`
                            : "평균과 동일";

                        // 이전 데이터 포인트와 비교
                        let comparePrev = "";
                        if (
                          dataIndex > 0 &&
                          chartData.detailData?.[dataIndex - 1]
                        ) {
                          const prevRate =
                            chartData.detailData[dataIndex - 1].attendanceRate;
                          const diff = detailData.attendanceRate - prevRate;
                          if (Math.abs(diff) > 0) {
                            comparePrev =
                              diff > 0
                                ? `이전 대비 ${diff.toFixed(1)}%↑`
                                : `이전 대비 ${Math.abs(diff).toFixed(1)}%↓`;
                          }
                        }

                        lines.push(`📊 출석률: ${value}% (${compareAvg})`);
                        if (comparePrev) lines.push(`📈 ${comparePrev}`);
                        lines.push(
                          `👥 참석인원: ${detailData.presentCount}명/${detailData.totalCount}명`
                        );
                        lines.push(
                          `⚡ 참석비율: ${(
                            (detailData.presentCount / detailData.totalCount) *
                            100
                          ).toFixed(1)}%`
                        );
                      } else {
                        lines.push(`${label}: ${value}%`);
                      }
                    } else {
                      // 출석 인원 데이터셋
                      if (detailData) {
                        lines.push(`👥 출석 인원: ${value}명`);
                        lines.push(`📊 참석률: ${detailData.attendanceRate}%`);
                      } else {
                        lines.push(`${label}: ${value}명`);
                      }
                    }

                    return lines;
                  },
                  footer: (tooltipItems) => {
                    const dataIndex = tooltipItems[0].dataIndex;
                    const detailData = chartData.detailData?.[dataIndex];

                    if (detailData) {
                      // 선택된 날짜의 요일
                      const dayOfWeek = moment(detailData.date).format("dddd");
                      return [`요일: ${dayOfWeek}`];
                    }
                    return null;
                  },
                },
                backgroundColor: "rgba(50, 50, 50, 0.9)",
                titleColor: "white",
                bodyColor: "white",
                footerColor: "rgba(220, 220, 220, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                  size: 14,
                  weight: "bold",
                },
                bodyFont: {
                  size: 13,
                },
                footerFont: {
                  size: 12,
                  style: "italic",
                },
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                boxPadding: 4,
                usePointStyle: true,
                caretSize: 8,
                caretPadding: 6,
              },
              legend: {
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 13,
                    weight: "bold",
                  },
                  generateLabels: (chart) => {
                    const originalLabels =
                      Chart.defaults.plugins.legend.labels.generateLabels(
                        chart
                      );

                    // 첫 번째 라벨(출석률)의 색상을 파란색으로 설정
                    if (originalLabels.length > 0) {
                      originalLabels[0].fillStyle = "rgba(66, 133, 244, 0.2)";
                      originalLabels[0].strokeStyle = "rgba(66, 133, 244, 1)";
                      originalLabels[0].pointStyle = "circle";
                    }

                    return originalLabels;
                  },
                },
                onClick: function (e, legendItem, legend) {
                  // 기본 숨기기/표시 동작 수행
                  Chart.defaults.plugins.legend.onClick.call(
                    this,
                    e,
                    legendItem,
                    legend
                  );

                  // 차트 캔버스 강조
                  const canvas = legend.chart.canvas;
                  canvas.style.transition = "all 0.3s";
                  canvas.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";
                  setTimeout(() => {
                    canvas.style.boxShadow = "none";
                  }, 500);
                },
              },
              // 중요 포인트 하이라이트 및 주석 생성
              annotation: {
                annotations: this.generateAnnotations(chartData, avgRate),
              },
            },
          },
          plugins: [
            {
              // 사용자 정의 배경 하이라이트
              id: "customBackground",
              beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;

                // 차트 영역 엷은 그라데이션 배경
                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, "rgba(78, 205, 196, 0.05)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

                ctx.fillStyle = gradient;
                ctx.fillRect(
                  chartArea.left,
                  chartArea.top,
                  chartArea.right - chartArea.left,
                  chartArea.bottom - chartArea.top
                );

                // 평균선 위치에 하이라이트 영역
                const yScale = chart.scales.y;
                const avgPos = yScale.getPixelForValue(avgRate);

                ctx.fillStyle = "rgba(78, 205, 196, 0.05)";
                ctx.fillRect(
                  chartArea.left,
                  avgPos - 1,
                  chartArea.right - chartArea.left,
                  2
                );
              },
            },
          ],
        });
        console.log("차트 생성 완료");
      } catch (error) {
        console.error("차트 생성 중 오류 발생:", error);
      }
    },

    // 차트 유형에 따른 데이터셋 설정
    configureDatasetsByChartType(datasets) {
      if (!datasets || datasets.length < 2) return datasets;

      const configuredDatasets = JSON.parse(JSON.stringify(datasets));

      switch (this.chartType) {
        case "combo":
          // 출석률은 선 그래프, 출석 인원은 막대 그래프
          configuredDatasets[0].type = "line";
          configuredDatasets[1].type = "bar";
          break;

        case "line":
          // 모두 선 그래프로 설정
          configuredDatasets.forEach((dataset) => {
            dataset.type = "line";
          });
          break;

        case "bar":
          // 모두 막대 그래프로 설정
          configuredDatasets.forEach((dataset) => {
            dataset.type = "bar";
          });
          break;
      }

      return configuredDatasets;
    },

    // 차트 유형 업데이트
    updateChartType() {
      if (!this.chart) return;

      const data = this.chart.data;
      if (!data || !data.datasets) return;

      // 데이터셋 설정 업데이트
      this.chart.data.datasets = this.configureDatasetsByChartType(
        data.datasets
      );
      this.chart.update();
    },

    // 차트 업데이트
    updateChart() {
      try {
        console.log("updateChart 호출됨");

        if (!this.chart) {
          console.log("차트가 없어 새로 생성합니다");
          this.createChart();
          return;
        }

        if (!this.$refs.attendanceChart) {
          console.warn("차트 업데이트 실패: 캔버스 요소를 찾을 수 없습니다");
          return;
        }

        const chartData = this.filteredChartData;
        console.log(
          "차트 데이터 업데이트:",
          chartData.labels?.length,
          "데이터 포인트"
        );

        // 데이터셋 유형 설정
        const datasets = this.configureDatasetsByChartType(chartData.datasets);

        // 평균 출석률 계산
        const avgRate = this.stats.avgAttendanceRate;

        // 차트 데이터 업데이트
        this.chart.data = {
          ...chartData,
          datasets,
        };

        // 주석 업데이트
        if (
          this.chart.options &&
          this.chart.options.plugins &&
          this.chart.options.plugins.annotation
        ) {
          this.chart.options.plugins.annotation.annotations =
            this.generateAnnotations(chartData, avgRate);
        }

        // y축 스케일 업데이트 (데이터 범위에 맞게)
        if (
          this.chart.options &&
          this.chart.options.scales &&
          this.chart.options.scales.y
        ) {
          // 데이터에 맞게 최대값 조정
          const maxValue = Math.max(...datasets[0].data, 100); // 최소 100% 이상
          this.chart.options.scales.y.max = Math.ceil(maxValue / 10) * 10 + 10; // 10 단위로 반올림하고 여유 추가
        }

        // 차트 업데이트
        this.chart.update();
        console.log("차트 업데이트 완료");
      } catch (error) {
        console.error("차트 업데이트 중 오류 발생:", error);
        // 오류 발생 시 차트 재생성 시도
        this.$nextTick(() => {
          try {
            if (this.chart) {
              this.chart.destroy();
              this.chart = null;
            }
            this.createChart();
          } catch (e) {
            console.error("차트 재생성 시도 중 오류:", e);
          }
        });
      }
    },

    // 중요 포인트 하이라이트 및 주석 생성
    generateAnnotations(data, avgRate) {
      const annotations = {
        avgLine: {
          type: "line",
          yMin: avgRate,
          yMax: avgRate,
          borderColor: "rgba(78, 205, 196, 0.7)",
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            display: true,
            content: `평균 출석률: ${avgRate}%`,
            position: "start",
            backgroundColor: "rgba(78, 205, 196, 0.7)",
            font: {
              size: 11,
              weight: "bold",
            },
          },
        },
      };

      // 데이터가 없으면 평균선만 반환
      if (!data || !data.datasets || data.datasets.length === 0) {
        return annotations;
      }

      const attendanceRates = data.datasets[0].data;
      // eslint-disable-next-line no-unused-vars
      const detailData = data.detailData || [];

      // 최고점과 최저점 표시
      if (attendanceRates.length > 0) {
        const maxRate = Math.max(...attendanceRates);
        const maxIndex = attendanceRates.indexOf(maxRate);

        const minRate = Math.min(...attendanceRates);
        const minIndex = attendanceRates.indexOf(minRate);

        // 최고점 주석 추가 (단, 충분히 큰 경우만)
        if (maxIndex >= 0 && maxRate > avgRate + 10) {
          annotations.maxPoint = {
            type: "point",
            xValue: maxIndex,
            yValue: maxRate,
            backgroundColor: "rgba(78, 205, 196, 0.8)",
            borderColor: "white",
            borderWidth: 2,
            radius: 6,
            label: {
              display: true,
              content: `최고 ${maxRate}%`,
              position: "top",
              backgroundColor: "rgba(78, 205, 196, 0.9)",
              color: "white",
              font: {
                size: 11,
                weight: "bold",
              },
              padding: 6,
            },
          };
        }

        // 최저점 주석 추가 (단, 충분히 낮은 경우만)
        if (minIndex >= 0 && minRate < avgRate - 10) {
          annotations.minPoint = {
            type: "point",
            xValue: minIndex,
            yValue: minRate,
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            borderColor: "white",
            borderWidth: 2,
            radius: 6,
            label: {
              display: true,
              content: `최저 ${minRate}%`,
              position: "bottom",
              backgroundColor: "rgba(255, 99, 132, 0.9)",
              color: "white",
              font: {
                size: 11,
                weight: "bold",
              },
              padding: 6,
            },
          };
        }

        // 급격한 변화 감지 및 표시 (10% 이상 변화)
        for (let i = 1; i < attendanceRates.length; i++) {
          const diff = attendanceRates[i] - attendanceRates[i - 1];
          // 큰 폭의 증가 또는 감소가 있는 경우
          if (Math.abs(diff) >= 15) {
            const direction = diff > 0 ? "증가" : "감소";
            const color =
              diff > 0 ? "rgba(46, 204, 113, 0.9)" : "rgba(231, 76, 60, 0.9)";

            annotations[`change_${i}`] = {
              type: "line",
              xMin: i - 1,
              xMax: i,
              yMin: attendanceRates[i - 1],
              yMax: attendanceRates[i],
              borderColor: color,
              borderWidth: 2,
              label: {
                display: true,
                content: `${Math.abs(diff)}% ${direction}`,
                position: diff > 0 ? "top" : "bottom",
                backgroundColor: color,
                color: "white",
                font: {
                  size: 10,
                  weight: "bold",
                },
                padding: 4,
              },
            };
          }
        }
      }

      return annotations;
    },
  },
};
</script>

<style scoped>
.attendance-chart-card {
  margin-bottom: 24px !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

.attendance-chart-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
}

.chart-header {
  padding: 16px 24px !important;
  cursor: pointer;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 251, 0.9)
  );
  position: relative;
}

.chart-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%);
  opacity: 0.5;
}

.filter-controls {
  background-color: rgba(248, 250, 251, 0.5);
  padding: 16px 24px !important;
}

.stats-summary {
  background-color: rgba(248, 250, 251, 0.7);
  padding: 16px 24px !important;
}

.stat-item {
  text-align: center;
  margin: 0 12px;
  min-width: 110px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.stat-item:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.stat-label {
  font-size: 0.85rem;
  color: #546e7a;
  margin-top: 4px;
  font-weight: 500;
}

.stat-sublabel {
  font-size: 0.75rem;
  color: #78909c;
  margin-top: 2px;
}

.chart-container {
  padding: 16px 8px;
  background-color: rgba(255, 255, 255, 0.5);
}

.card-content-padding {
  padding: 16px 24px !important;
}

.v-tooltip__content {
  background-color: rgba(50, 50, 50, 0.95) !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  padding: 10px 14px !important;
  max-width: 280px !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2) !important;
}
</style>
