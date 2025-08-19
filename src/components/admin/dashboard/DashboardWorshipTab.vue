<template>
  <div class="dashboard-worship-tab">
    <!-- 예배 유형 선택 및 필터 영역 -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="pb-0">
            <v-icon left color="deep-orange">mdi-church</v-icon>
            예배 유형별 출석 현황
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedMeetingType"
              :items="meetingTypeItems"
              label="예배 유형 선택"
              dense
              outlined
              class="mb-2"
              @change="onMeetingTypeChange"
            ></v-select>

            <!-- 선택된 예배 유형 요약 정보 -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">총 모임 수</v-card-subtitle>
                  <v-card-text
                    class="text-h5 font-weight-bold primary--text pt-0"
                  >
                    {{ selectedTypeStats.meetingCount || 0 }}회
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">총 출석 인원</v-card-subtitle>
                  <v-card-text
                    class="text-h5 font-weight-bold success--text pt-0"
                  >
                    {{ selectedTypeStats.attendanceCount || 0 }}명
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">평균 출석률</v-card-subtitle>
                  <v-card-text class="text-h5 font-weight-bold info--text pt-0">
                    {{ (selectedTypeStats.attendanceRate || 0).toFixed(1) }}%
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 기간 요약 카드 -->
      <v-col cols="12" md="4">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="pb-0">
            <v-icon left color="purple">mdi-calendar-range</v-icon>
            기간별 추이
          </v-card-title>
          <v-card-text>
            <v-btn-toggle
              v-model="timeRangeType"
              dense
              mandatory
              color="primary"
              class="mb-2"
              block
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
            </v-btn-toggle>

            <v-card outlined class="text-center mt-2">
              <v-card-subtitle class="pb-0">최근 기간 출석률</v-card-subtitle>
              <v-card-text class="py-0">
                <span
                  class="text-h5 font-weight-bold"
                  :class="getAttendanceRateColorClass(recentPeriodRate)"
                >
                  {{ recentPeriodRate.toFixed(1) }}%
                </span>
                <v-icon
                  small
                  :color="getAttendanceRateTrendColor()"
                  class="ml-1"
                >
                  {{ getAttendanceRateTrendIcon() }}
                </v-icon>
              </v-card-text>
              <v-card-text class="pt-0 caption">
                이전 기간 대비 {{ Math.abs(attendanceRateChange).toFixed(1) }}%
                {{ attendanceRateChange >= 0 ? '증가' : '감소' }}
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 출석 인원 추이 차트 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="blue">mdi-chart-timeline-variant</v-icon>
            {{ meetingTypes[selectedMeetingType] || '예배' }} 출석 추이
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="chartViewType"
              dense
              mandatory
              color="primary"
            >
              <v-btn value="attendance" small>
                <v-icon left small>mdi-account-group</v-icon>
                출석 인원
              </v-btn>
              <v-btn value="rate" small>
                <v-icon left small>mdi-percent</v-icon>
                출석률
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <div style="height: 350px">
              <canvas id="worshipAttendanceChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 모임 목록 테이블 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon left color="deep-orange">mdi-format-list-bulleted</v-icon>
            {{ meetingTypes[selectedMeetingType] || '예배' }} 모임 목록
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
              dense
              outlined
              class="search-field"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="meetingHeaders"
            :items="filteredMeetings"
            :search="search"
            :items-per-page="10"
            class="elevation-0"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 15, -1],
              itemsPerPageText: '페이지당 행 수',
            }"
          >
            <!-- 날짜 포맷 -->
            <template v-slot:[`item.date`]="{ item }">
              {{ formatDate(item.date) }}
            </template>

            <!-- 출석률 -->
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

            <!-- 조직명 -->
            <template v-slot:[`item.organizationName`]="{ item }">
              <v-chip
                small
                :color="getOrgColor(item.organizationId)"
                text-color="white"
              >
                {{ item.organizationName }}
              </v-chip>
            </template>

            <!-- 상세 정보 버튼 -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn small icon @click="showMeetingDetails(item)">
                <v-icon small>mdi-information-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 모임 상세 정보 다이얼로그 -->
    <v-dialog v-model="detailsDialog" max-width="800px">
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="primary">mdi-church</v-icon>
          {{ selectedMeeting ? selectedMeeting.name : '모임 상세 정보' }}
          <v-spacer></v-spacer>
          <v-btn icon @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="selectedMeeting">
          <v-row>
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>날짜</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(selectedMeeting.date) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-domain</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>조직</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedMeeting.organizationName }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>장소</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedMeeting.location || '정보 없음' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="success">mdi-account-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>출석자 수</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedMeeting.presentCount || 0 }}명
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="error">mdi-account-cancel</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>결석자 수</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedMeeting.absentCount || 0 }}명
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="warning">mdi-clock-alert</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>지각자 수</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedMeeting.lateCount || 0 }}명
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <!-- 출석 현황 차트 -->
          <div style="height: 200px" class="mt-3">
            <canvas id="meetingAttendanceDetailChart"></canvas>
          </div>

          <v-divider class="my-3"></v-divider>

          <!-- 노트 -->
          <v-card outlined class="mt-3">
            <v-card-subtitle>
              <v-icon left small>mdi-note-text</v-icon>
              모임 노트
            </v-card-subtitle>
            <v-card-text>
              {{ selectedMeeting.notes || '노트 정보가 없습니다.' }}
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="detailsDialog = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'DashboardWorshipTab',
    props: {
      meetingTypes: {
        type: Object,
        default: () => ({}),
      },
      meetingTypeData: {
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
      meetings: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        search: '',
        selectedMeetingType: null,
        meetingTypeItems: [],
        timeRangeType: 'weekly',
        chartViewType: 'attendance',
        detailsDialog: false,
        selectedMeeting: null,
        meetingHeaders: [
          { text: '날짜', value: 'date', width: '120px' },
          { text: '모임명', value: 'name' },
          { text: '조직', value: 'organizationName' },
          { text: '출석자', value: 'presentCount', width: '80px' },
          { text: '결석자', value: 'absentCount', width: '80px' },
          { text: '지각자', value: 'lateCount', width: '80px' },
          { text: '출석률', value: 'attendanceRate', width: '150px' },
          {
            text: '상세',
            value: 'actions',
            sortable: false,
            width: '60px',
            align: 'center',
          },
        ],
        // 가상 데이터 (실제 구현에서는 props를 통해 전달됨)
        recentPeriodRate: 75.5,
        attendanceRateChange: 5.2,
        orgColors: {
          // 조직 ID별 색상
        },
      };
    },
    computed: {
      selectedTypeStats() {
        if (!this.selectedMeetingType) return {};
        const typeStats =
          this.meetingTypeData.find(
            (item) => item.type === this.selectedMeetingType
          ) || {};
        return {
          meetingCount: typeStats.meetingCount || 0,
          attendanceCount: typeStats.attendanceCount || 0,
          attendanceRate: typeStats.attendanceRate
            ? typeStats.attendanceRate * 100
            : 0,
        };
      },
      filteredMeetings() {
        if (!this.selectedMeetingType) return [];
        return this.meetings.filter(
          (meeting) => meeting.meetingType === this.selectedMeetingType
        );
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
      onMeetingTypeChange() {
        // 예배 유형 변경 시 차트 업데이트
        this.$nextTick(() => {
          // 차트 업데이트 로직 (실제 구현에서는 차트 라이브러리 사용)
        });
      },
      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        });
      },
      getAttendanceRateColor(rate) {
        rate = parseFloat(rate);
        if (rate >= 0.8) return 'success';
        if (rate >= 0.6) return 'info';
        if (rate >= 0.4) return 'warning';
        return 'error';
      },
      getAttendanceRateColorClass(rate) {
        rate = parseFloat(rate);
        if (rate >= 80) return 'success--text';
        if (rate >= 60) return 'info--text';
        if (rate >= 40) return 'warning--text';
        return 'error--text';
      },
      getAttendanceRateTrendColor() {
        return this.attendanceRateChange >= 0 ? 'success' : 'error';
      },
      getAttendanceRateTrendIcon() {
        return this.attendanceRateChange >= 0
          ? 'mdi-arrow-up'
          : 'mdi-arrow-down';
      },
      getOrgColor(orgId) {
        // 조직 ID별로 고유한 색상 반환 (실제 구현에서는 조직별 색상 매핑 사용)
        if (!this.orgColors[orgId]) {
          const colors = [
            'primary',
            'purple',
            'deep-purple',
            'indigo',
            'blue',
            'teal',
            'green',
            'light-green',
            'amber',
            'orange',
            'deep-orange',
          ];
          this.orgColors[orgId] =
            colors[Object.keys(this.orgColors).length % colors.length];
        }
        return this.orgColors[orgId];
      },
      showMeetingDetails(meeting) {
        this.selectedMeeting = meeting;
        this.detailsDialog = true;

        // 다이얼로그가 열린 후 차트 초기화
        this.$nextTick(() => {
          // 차트 초기화 로직 (실제 구현에서는 차트 라이브러리 사용)
        });
      },
    },
  };
</script>

<style scoped>
  .search-field {
    max-width: 200px;
  }

  @media (max-width: 600px) {
    .search-field {
      max-width: 100%;
    }
  }
</style>
