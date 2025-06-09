<template>
  <v-container fluid>
    <!-- 상단 헤더 -->
    <v-card class="dashboard-header" flat>
      <div class="header-content d-flex align-center justify-space-between">
        <div>
          <div class="d-flex align-center mb-2">
            <v-icon large color="white" class="mr-2">mdi-chart-bar</v-icon>
            <span class="dashboard-title font-weight-bold">
              {{ organizations.organization_name }} 대시보드
            </span>
          </div>
          <div class="dashboard-path grey--text text--lighten-4">
            {{ groupPath }}
          </div>
        </div>
        <!-- (프로필/알림 등은 생략 또는 필요시 추가) -->
      </div>
    </v-card>

    <!-- 기간 선택 -->
    <v-card class="period-card mt-4" flat>
      <v-row align="center" no-gutters>
        <v-col cols="12" md="4" class="pr-md-2">
          <v-menu
            ref="startDateMenu"
            v-model="startDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="시작일"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                class="date-input"
              />
            </template>
            <v-date-picker v-model="startDate" @input="startDateMenu = false" />
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          md="1"
          class="text-center py-0 d-flex align-center justify-center"
        >
          <span class="date-separator">~</span>
        </v-col>
        <v-col cols="12" md="4" class="pl-md-2">
          <v-menu
            ref="endDateMenu"
            v-model="endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                label="종료일"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                class="date-input"
              />
            </template>
            <v-date-picker v-model="endDate" @input="endDateMenu = false" />
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-end justify-end">
          <v-btn
            color="primary"
            @click="onSearch"
            class="ml-2 period-search-btn"
            large
          >
            조회
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- 핵심 현황 카드 -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-sm font-medium text-grey mb-2">그룹 평균 출석률</div>
          <div class="d-flex align-center justify-space-between">
            <div class="text-h5 font-weight-bold">
              {{ groupData.attendanceRate }}%
            </div>
            <div :class="attendanceRateChangeClass">
              <v-icon
                small
                class="mr-1"
                :color="
                  groupData.attendanceRate > groupData.previousAttendanceRate
                    ? 'success'
                    : 'error'
                "
              >
                {{
                  groupData.attendanceRate > groupData.previousAttendanceRate
                    ? "mdi-arrow-up"
                    : "mdi-arrow-down"
                }}
              </v-icon>
              <span class="text-sm font-medium">
                {{
                  Math.abs(
                    groupData.attendanceRate - groupData.previousAttendanceRate
                  ).toFixed(1)
                }}%
              </span>
            </div>
          </div>
          <div class="text-caption text-grey mt-1">이전 동일 기간 대비</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-sm font-medium text-grey mb-2">그룹 재적 인원</div>
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="grey">mdi-account-group</v-icon>
            <div class="text-h5 font-weight-bold">
              {{ groupData.totalMembers }}명
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-sm font-medium text-grey mb-2">평균 출석 인원</div>
          <div class="text-h5 font-weight-bold">
            {{ groupData.averageAttendance }}명
          </div>
          <div class="text-caption text-grey mt-1">
            최근 {{ period }}주 평균
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-sm font-medium text-grey mb-2">연속 결석 순원</div>
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="amber">mdi-alert</v-icon>
            <div class="text-h5 font-weight-bold">
              {{ groupData.consecutiveAbsentees }}명
            </div>
          </div>
          <div class="text-caption text-grey mt-1">2주 이상 연속 결석</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 출석률 주간 추이 차트 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 mb-6">
          <div class="mb-4">
            <span class="text-h6 font-weight-medium">
              우리 그룹 출석률 주간 추이
            </span>
            <div class="text-caption text-grey">
              최근 {{ period }}주간 출석률 변화 추이
            </div>
          </div>
          <div style="height: 320px">
            <canvas ref="weeklyChart"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 순별 비교 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 mb-6">
          <div class="mb-4">
            <span class="text-h6 font-weight-medium">
              우리 그룹 내 순별 비교
            </span>
            <div class="text-caption text-grey">
              최근 {{ period }}주간 순별 출석 현황
            </div>
          </div>
          <v-btn-toggle v-model="chartTab" class="mb-4" mandatory>
            <v-btn value="bar">순별 평균 출석률</v-btn>
            <v-btn value="line">순별 주간 추이</v-btn>
          </v-btn-toggle>
          <div style="height: 320px">
            <canvas v-if="chartTab === 'bar'" ref="subgroupBarChart"></canvas>
            <canvas v-if="chartTab === 'line'" ref="subgroupLineChart"></canvas>
          </div>
          <v-data-table
            :headers="subgroupTableHeaders"
            :items="groupData.subgroups"
            class="mt-6"
            dense
            hide-default-footer
          >
            <template slot="item.attendanceRate" slot-scope="{ item }">
              {{ item.attendanceRate }}%
            </template>
            <template slot="item.previousRate" slot-scope="{ item }">
              <span
                :class="
                  item.attendanceRate > item.previousRate
                    ? 'text-success'
                    : 'text-error'
                "
              >
                <v-icon
                  small
                  class="mr-1"
                  :color="
                    item.attendanceRate > item.previousRate
                      ? 'success'
                      : 'error'
                  "
                >
                  {{
                    item.attendanceRate > item.previousRate
                      ? "mdi-arrow-up"
                      : "mdi-arrow-down"
                  }}
                </v-icon>
                {{ Math.abs(item.attendanceRate - item.previousRate) }}%
              </span>
            </template>
            <template slot="item.consecutiveAbsentees" slot-scope="{ item }">
              {{ item.consecutiveAbsentees }}명
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 관심 순원 목록 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 mb-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-h6 font-weight-medium">관심 순원 목록</span>
              <div class="text-caption text-grey">
                출석률이 낮거나 연속 결석 중인 순원
              </div>
            </div>
            <v-select
              v-model="selectedSubgroup"
              :items="subgroupSelectOptions"
              item-text="text"
              item-value="value"
              dense
              outlined
              hide-details
              style="max-width: 120px"
            />
          </div>
          <v-data-table
            :headers="memberTableHeaders"
            :items="filteredMembers"
            dense
            hide-default-footer
          >
            <template slot="item.consecutiveAbsences" slot-scope="{ item }">
              <v-chip
                :color="getBadgeColor(item.consecutiveAbsences)"
                small
                dark
              >
                {{ item.consecutiveAbsences }}주
              </v-chip>
            </template>
            <template slot="item.actions" slot-scope="{ item }">
              <v-btn icon @click="callMember(item.phone)" title="전화하기">
                <v-icon>mdi-phone</v-icon>
              </v-btn>
              <v-btn small outlined @click="showMemberDetail(item)">
                상세
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 순원 상세 모달 -->
    <v-dialog v-model="selectedMember" max-width="500">
      <v-card v-if="selectedMember">
        <v-card-title>
          <span class="text-h6">{{ selectedMember.name }} 순원 정보</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="font-weight-medium">최근 출석일</div>
              <div>{{ selectedMember.lastAttendance }}</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-medium">연속 결석</div>
              <div>{{ selectedMember.consecutiveAbsences }}주</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-medium">출석 횟수</div>
              <div>{{ selectedMember.attendanceCount }}</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-medium">연락처</div>
              <div>{{ selectedMember.phone }}</div>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-medium">메모</div>
              <div class="text-caption text-grey">
                최근 건강 문제로 교회 참석이 어려운 상황입니다. 지난 심방 시
                기도 요청이 있었습니다.
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined @click="selectedMember = null">닫기</v-btn>
          <v-btn color="primary" @click="callMember(selectedMember.phone)">
            연락하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Chart from "chart.js/auto";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import { mapState } from "vuex";

export default {
  name: "AttendanceDashboardView",
  mixins: [OrganizationCtrl],
  data() {
    return {
      period: "1",
      periodOptions: [
        { text: "최근 1주", value: "1" },
        { text: "최근 2주", value: "2" },
        { text: "최근 3주", value: "3" },
        { text: "최근 4주", value: "4" },
      ],
      selectedSubgroup: "all",
      selectedMember: null,
      chartTab: "bar",
      weeklyChart: null,
      subgroupBarChart: null,
      subgroupLineChart: null,
      weeklyChartInstance: null,
      barChartInstance: null,
      lineChartInstance: null,
      organizations: {},
      groupData: {
        name: "믿음 그룹",
        totalMembers: 24,
        averageAttendance: 19,
        attendanceRate: 79.2,
        previousAttendanceRate: 75.5,
        consecutiveAbsentees: 3,
        weeklyData: [
          { week: "1주 전", attendanceRate: 75 },
          { week: "2주 전", attendanceRate: 79 },
          { week: "3주 전", attendanceRate: 83 },
          { week: "4주 전", attendanceRate: 80 },
        ],
        subgroups: [
          {
            name: "순1",
            members: 8,
            attendanceRate: 85,
            previousRate: 80,
            consecutiveAbsentees: 1,
            weeklyData: [
              { week: "1주 전", attendanceRate: 81 },
              { week: "2주 전", attendanceRate: 88 },
              { week: "3주 전", attendanceRate: 88 },
              { week: "4주 전", attendanceRate: 83 },
            ],
          },
          {
            name: "순2",
            members: 9,
            attendanceRate: 78,
            previousRate: 81,
            consecutiveAbsentees: 1,
            weeklyData: [
              { week: "1주 전", attendanceRate: 78 },
              { week: "2주 전", attendanceRate: 78 },
              { week: "3주 전", attendanceRate: 83 },
              { week: "4주 전", attendanceRate: 73 },
            ],
          },
          {
            name: "순3",
            members: 7,
            attendanceRate: 74,
            previousRate: 65,
            consecutiveAbsentees: 1,
            weeklyData: [
              { week: "1주 전", attendanceRate: 65 },
              { week: "2주 전", attendanceRate: 71 },
              { week: "3주 전", attendanceRate: 79 },
              { week: "4주 전", attendanceRate: 81 },
            ],
          },
        ],
        membersOfConcern: [
          {
            name: "김성실",
            subgroup: "순1",
            lastAttendance: "2024-04-28",
            consecutiveAbsences: 2,
            attendanceCount: "2/4",
            phone: "010-1234-5678",
          },
          {
            name: "이믿음",
            subgroup: "순2",
            lastAttendance: "2024-04-21",
            consecutiveAbsences: 3,
            attendanceCount: "1/4",
            phone: "010-2345-6789",
          },
          {
            name: "박소망",
            subgroup: "순3",
            lastAttendance: "2024-05-05",
            consecutiveAbsences: 1,
            attendanceCount: "3/4",
            phone: "010-3456-7890",
          },
          {
            name: "최사랑",
            subgroup: "순3",
            lastAttendance: "2024-04-14",
            consecutiveAbsences: 4,
            attendanceCount: "0/4",
            phone: "010-4567-8901",
          },
        ],
      },
      subgroupTableHeaders: [
        { text: "순 이름", value: "name" },
        { text: "재적인원", value: "members" },
        { text: "평균 출석률", value: "attendanceRate" },
        { text: "이전 대비", value: "previousRate" },
        { text: "연속 결석자", value: "consecutiveAbsentees" },
      ],
      memberTableHeaders: [
        { text: "순원 이름", value: "name" },
        { text: "소속 순", value: "subgroup" },
        { text: "최근 출석일", value: "lastAttendance" },
        { text: "연속 결석", value: "consecutiveAbsences" },
        { text: "출석 횟수", value: "attendanceCount" },
        { text: "연락처", value: "phone" },
        { text: "", value: "actions", sortable: false },
      ],
      groupPath: "청년2국 > 송강욱그룹 | 그룹장: 송강욱 | 부그룹장: 허효진",
      startDate: "2024-05-01",
      endDate: "2024-06-01",
      startDateMenu: false,
      endDateMenu: false,
    };
  },
  computed: {
    ...mapState("auth", ["userInfo"]),
    attendanceRateChangeClass() {
      return this.groupData.attendanceRate >
        this.groupData.previousAttendanceRate
        ? "d-flex align-center text-success"
        : "d-flex align-center text-error";
    },
    filteredMembers() {
      return this.selectedSubgroup === "all"
        ? this.groupData.membersOfConcern
        : this.groupData.membersOfConcern.filter(
            (member) => member.subgroup === this.selectedSubgroup
          );
    },
    subgroupSelectOptions() {
      return [
        { text: "전체 순", value: "all" },
        ...this.groupData.subgroups.map((s) => ({
          text: s.name,
          value: s.name,
        })),
      ];
    },
  },
  methods: {
    getBadgeColor(consecutiveAbsences) {
      if (consecutiveAbsences >= 3) {
        return "red";
      } else if (consecutiveAbsences >= 2) {
        return "amber darken-2";
      } else {
        return "grey lighten-1";
      }
    },
    callMember(phone) {
      window.location.href = `tel:${phone}`;
    },
    showMemberDetail(member) {
      this.selectedMember = member;
    },
    createWeeklyChart() {
      if (this.weeklyChartInstance) {
        this.weeklyChartInstance.destroy();
      }
      const ctx = this.$refs.weeklyChart.getContext("2d");
      this.weeklyChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.groupData.weeklyData.map((d) => d.week),
          datasets: [
            {
              label: "그룹 전체",
              data: this.groupData.weeklyData.map((d) => d.attendanceRate),
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              borderWidth: 3,
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 50,
              max: 100,
            },
          },
        },
      });
    },
    createSubgroupBarChart() {
      if (this.barChartInstance) {
        this.barChartInstance.destroy();
      }
      const ctx = this.$refs.subgroupBarChart.getContext("2d");
      this.barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.groupData.subgroups.map((s) => s.name),
          datasets: [
            {
              label: "출석률",
              data: this.groupData.subgroups.map((s) => s.attendanceRate),
              backgroundColor: "#3b82f6",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    },
    createSubgroupLineChart() {
      if (this.lineChartInstance) {
        this.lineChartInstance.destroy();
      }
      const ctx = this.$refs.subgroupLineChart.getContext("2d");
      this.lineChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.groupData.weeklyData.map((d) => d.week),
          datasets: [
            {
              label: "순1",
              data: this.groupData.subgroups[0].weeklyData.map(
                (d) => d.attendanceRate
              ),
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "순2",
              data: this.groupData.subgroups[1].weeklyData.map(
                (d) => d.attendanceRate
              ),
              borderColor: "#10b981",
              backgroundColor: "#10b981",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "순3",
              data: this.groupData.subgroups[2].weeklyData.map(
                (d) => d.attendanceRate
              ),
              borderColor: "#ef4444",
              backgroundColor: "#ef4444",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 50,
              max: 100,
            },
          },
        },
      });
    },
    async fetchOrganizationsOnly(groupId) {
      try {
        const response = await this.getOrganizationById(groupId, true);
        console.log(response.data);
        this.organizations = response.data;
        console.log(this.organizations);
      } catch (error) {
        console.error("조직 정보 가져오기 오류:", error);
        this.organizations = {};
      }
    },
    onSearch() {
      // 조회 버튼 클릭 시 동작
      // this.startDate, this.endDate, this.groupPath 등 활용
      // 필요시 기존 기간 필터링 로직과 연동
    },
  },
  mounted() {
    if (!this.userInfo) {
      this.$router.push({ name: "LoginView" });
    }

    console.log("사용자 정보:", this.userInfo);
    console.log("그룹 아이디:", this.userInfo.roles[0].organizationId);
    this.$nextTick(() => {
      this.createWeeklyChart();
      this.createSubgroupBarChart();
      this.fetchOrganizationsOnly(this.userInfo.roles[0].organizationId);
    });
  },
  watch: {
    chartTab(newTab) {
      this.$nextTick(() => {
        if (newTab === "bar") {
          this.createSubgroupBarChart();
        } else {
          this.createSubgroupLineChart();
        }
      });
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}
.dashboard-header {
  background: linear-gradient(90deg, #7b7ce6 0%, #a084ee 100%);
  color: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 16px;
}
.dashboard-title {
  font-size: 2rem;
}
.dashboard-path {
  font-size: 1rem;
}
.period-card {
  border-radius: 16px;
  background: #f8f9fd;
  box-shadow: 0 2px 8px rgba(120, 120, 200, 0.06);
  padding: 24px 32px 16px 32px;
  margin-bottom: 16px;
}
.date-input {
  font-size: 1.1rem;
}
.date-separator {
  font-size: 1.5rem;
  color: #888;
  font-weight: 600;
  margin: 0 0.5rem;
}
.period-search-btn {
  min-width: 100px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(120, 120, 200, 0.08);
}
@media (max-width: 960px) {
  .period-card {
    padding: 16px 8px 8px 8px;
  }
  .date-separator {
    margin: 0 0.2rem;
  }
}
</style>
