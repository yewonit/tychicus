<template>
  <div class="dashboard-organization-tab">
    <!-- 조직 선택 및 상세 영역 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="deep-purple">mdi-domain</v-icon>
            조직 목록
          </v-card-title>
          <v-card-text class="pa-0">
            <v-treeview
              v-model="selectedTreeItems"
              :items="organizationTree"
              item-key="id"
              return-object
              dense
              selection-type="independent"
              activatable
              hoverable
              open-all
              class="organization-tree"
              @update:active="handleOrganizationSelect"
            >
              <template v-slot:prepend="{ item }">
                <v-icon small :color="getOrgColor(item.id)">
                  {{
                    item.isLeafNode ? "mdi-account-group" : "mdi-folder-account"
                  }}
                </v-icon>
              </template>
              <template v-slot:label="{ item }">
                <div class="org-tree-label">
                  <span>{{ item.organization_name }}</span>
                  <span class="ml-2 caption">
                    ({{ item.memberCount || 0 }}명)
                  </span>
                </div>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="pb-0">
            <v-icon left color="deep-purple">mdi-information-outline</v-icon>
            {{
              selectedOrganization
                ? selectedOrganization.organization_name
                : "조직"
            }}
            상세 정보
          </v-card-title>

          <v-card-text v-if="selectedOrganization">
            <!-- 조직 요약 정보 -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">총 모임 수</v-card-subtitle>
                  <v-card-text
                    class="text-h5 font-weight-bold primary--text pt-0"
                  >
                    {{ selectedOrgStats.meetingCount || 0 }}회
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">총 출석 인원</v-card-subtitle>
                  <v-card-text
                    class="text-h5 font-weight-bold success--text pt-0"
                  >
                    {{ selectedOrgStats.attendeeCount || 0 }}명
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined class="text-center">
                  <v-card-subtitle class="pb-0">평균 출석률</v-card-subtitle>
                  <v-card-text class="text-h5 font-weight-bold info--text pt-0">
                    {{ (selectedOrgStats.attendanceRate || 0).toFixed(1) }}%
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 조직 정보 상세 -->
            <v-card outlined class="mt-4">
              <v-card-subtitle>
                <v-icon left small>mdi-card-account-details-outline</v-icon>
                기본 정보
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <v-simple-table dense>
                  <tbody>
                    <tr>
                      <td width="120" class="text-right font-weight-bold">
                        코드
                      </td>
                      <td>{{ selectedOrganization.organization_code }}</td>
                    </tr>
                    <tr>
                      <td class="text-right font-weight-bold">설명</td>
                      <td>
                        {{ selectedOrganization.description || "설명 없음" }}
                      </td>
                    </tr>
                    <tr v-if="selectedOrganization.path">
                      <td class="text-right font-weight-bold">조직 경로</td>
                      <td>{{ selectedOrganization.path.join(" > ") }}</td>
                    </tr>
                    <tr>
                      <td class="text-right font-weight-bold">회원 수</td>
                      <td>{{ selectedOrganization.memberCount || 0 }}명</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-card-text v-else class="text-center py-5">
            <v-icon size="64" color="grey lighten-1">mdi-domain-off</v-icon>
            <div class="text-h6 grey--text mt-3">조직을 선택해주세요.</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 예배 유형별 출석률 (선택된 조직) -->
    <v-row v-if="selectedOrganization">
      <v-col cols="12" lg="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="primary">mdi-chart-bar</v-icon>
            예배 유형별 출석률
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="includeChildOrgs"
              dense
              mandatory
              color="primary"
            >
              <v-btn :value="false" small>
                <v-icon left small>mdi-domain</v-icon>본 조직만
              </v-btn>
              <v-btn :value="true" small>
                <v-icon left small>mdi-domain-plus</v-icon>하위 포함
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <canvas id="orgAttendanceRateChart"></canvas>
            </div>
            <div v-if="!hasAttendanceData" class="text-center grey--text mt-3">
              <v-icon small color="grey">mdi-alert-circle-outline</v-icon>
              이 조직의 출석 데이터가 없습니다.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 출석 추이 -->
      <v-col cols="12" lg="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="info">mdi-chart-line</v-icon>
            출석 추이
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="timeRangeType"
              dense
              mandatory
              color="primary"
            >
              <v-btn value="weekly" small>
                <v-icon left small>mdi-calendar-week</v-icon>주간
              </v-btn>
              <v-btn value="monthly" small>
                <v-icon left small>mdi-calendar-month</v-icon>월간
              </v-btn>
              <v-btn value="quarterly" small>
                <v-icon left small>mdi-calendar-text</v-icon>분기
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <canvas id="orgAttendanceTrendChart"></canvas>
            </div>
            <div v-if="!hasAttendanceData" class="text-center grey--text mt-3">
              <v-icon small color="grey">mdi-alert-circle-outline</v-icon>
              이 조직의 출석 데이터가 없습니다.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 하위 조직 비교 차트 -->
    <v-row v-if="selectedOrganization && hasChildOrgs">
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title>
            <v-icon left color="deep-purple">mdi-chart-bar-stacked</v-icon>
            하위 조직 출석률 비교
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="childOrgChartType"
              dense
              mandatory
              color="primary"
            >
              <v-btn value="rate" small>
                <v-icon left small>mdi-percent</v-icon>출석률
              </v-btn>
              <v-btn value="attendance" small>
                <v-icon left small>mdi-account-group</v-icon>출석 인원
              </v-btn>
              <v-btn value="meetings" small>
                <v-icon left small>mdi-calendar-multiple</v-icon>모임 수
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <canvas id="childOrgsComparisonChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 모임 목록 테이블 -->
    <v-row v-if="selectedOrganization">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon left color="deep-orange">mdi-format-list-bulleted</v-icon>
            모임 목록
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

            <!-- 예배 유형 -->
            <template v-slot:[`item.meetingTypeName`]="{ item }">
              <v-chip
                small
                :color="getMeetingTypeColor(item.meetingType)"
                text-color="white"
              >
                {{ item.meetingTypeName }}
              </v-chip>
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
          {{ selectedMeeting ? selectedMeeting.name : "모임 상세 정보" }}
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
                    <v-list-item-subtitle>{{
                      formatDate(selectedMeeting.date)
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-church</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>예배 유형</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedMeeting.meetingTypeName
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>장소</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedMeeting.location || "정보 없음"
                    }}</v-list-item-subtitle>
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
                    <v-list-item-subtitle
                      >{{
                        selectedMeeting.presentCount || 0
                      }}명</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="error">mdi-account-cancel</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>결석자 수</v-list-item-title>
                    <v-list-item-subtitle
                      >{{
                        selectedMeeting.absentCount || 0
                      }}명</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="warning">mdi-clock-alert</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>지각자 수</v-list-item-title>
                    <v-list-item-subtitle
                      >{{
                        selectedMeeting.lateCount || 0
                      }}명</v-list-item-subtitle
                    >
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
              {{ selectedMeeting.notes || "노트 정보가 없습니다." }}
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
  name: "DashboardOrganizationTab",
  props: {
    organizationTree: {
      type: Array,
      default: () => [],
    },
    flattenedOrganizations: {
      type: Array,
      default: () => [],
    },
    hierarchyStats: {
      type: Object,
      default: () => ({}),
    },
    meetings: {
      type: Array,
      default: () => [],
    },
    meetingTypes: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedTreeItems: [],
      selectedOrganization: null,
      search: "",
      includeChildOrgs: true,
      timeRangeType: "weekly",
      childOrgChartType: "rate",
      detailsDialog: false,
      selectedMeeting: null,
      meetingHeaders: [
        { text: "날짜", value: "date", width: "120px" },
        { text: "모임명", value: "name" },
        { text: "예배 유형", value: "meetingTypeName" },
        { text: "출석자", value: "presentCount", width: "80px" },
        { text: "결석자", value: "absentCount", width: "80px" },
        { text: "지각자", value: "lateCount", width: "80px" },
        { text: "출석률", value: "attendanceRate", width: "150px" },
        {
          text: "상세",
          value: "actions",
          sortable: false,
          width: "60px",
          align: "center",
        },
      ],
      orgColors: {},
      meetingTypeColors: {
        SUNDAY_SERVICE_2: "deep-orange",
        SUNDAY_SERVICE_3: "orange",
        YOUTH_SERVICE: "amber",
        WEDNESDAY_SERVICE: "blue",
        FRIDAY_SERVICE: "indigo",
        WEDNESDAY_PRAYER: "deep-purple",
        HEALING_MINISTRY: "pink",
        OTHER: "grey",
      },
    };
  },
  computed: {
    selectedOrgStats() {
      if (!this.selectedOrganization) return {};

      const orgId = this.selectedOrganization.id.toString();
      const statsData = this.hierarchyStats[orgId];

      if (!statsData) return {};

      // 하위 포함 여부에 따라 다른 통계 반환
      const stats = this.includeChildOrgs
        ? statsData.aggregated
        : statsData.own;

      return {
        meetingCount: stats.meetingCount || 0,
        attendeeCount: stats.attendeeCount || 0,
        attendanceRate: stats.attendanceRate ? stats.attendanceRate * 100 : 0,
      };
    },
    hasChildOrgs() {
      if (!this.selectedOrganization) return false;
      const orgId = this.selectedOrganization.id.toString();
      const statsData = this.hierarchyStats[orgId];

      return (
        statsData &&
        statsData.aggregated &&
        statsData.aggregated.childOrgs &&
        statsData.aggregated.childOrgs.length > 0
      );
    },
    hasAttendanceData() {
      return this.selectedOrgStats.meetingCount > 0;
    },
    filteredMeetings() {
      if (!this.selectedOrganization) return [];

      const orgId = this.selectedOrganization.id.toString();

      if (this.includeChildOrgs) {
        // 하위 조직 ID 목록 가져오기
        const statsData = this.hierarchyStats[orgId];
        if (
          !statsData ||
          !statsData.aggregated ||
          !statsData.aggregated.childOrgs
        ) {
          return this.meetings.filter(
            (meeting) => meeting.organizationId == orgId
          );
        }

        // 현재 조직과 하위 조직 모두 포함
        const childOrgIds = [...statsData.aggregated.childOrgs, orgId];
        return this.meetings.filter((meeting) =>
          childOrgIds.includes(meeting.organizationId.toString())
        );
      } else {
        // 현재 조직만
        return this.meetings.filter(
          (meeting) => meeting.organizationId == orgId
        );
      }
    },
  },
  methods: {
    handleOrganizationSelect(item) {
      if (item && item.length > 0) {
        this.selectedOrganization = item[0];

        // 차트 업데이트
        this.$nextTick(() => {
          // 차트 업데이트 로직 (실제 구현에서는 차트 라이브러리 사용)
        });
      } else {
        this.selectedOrganization = null;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });
    },
    getAttendanceRateColor(rate) {
      rate = parseFloat(rate);
      if (rate >= 0.8) return "success";
      if (rate >= 0.6) return "info";
      if (rate >= 0.4) return "warning";
      return "error";
    },
    getOrgColor(orgId) {
      // 조직 ID별로 고유한 색상 반환
      if (!this.orgColors[orgId]) {
        const colors = [
          "primary",
          "purple",
          "deep-purple",
          "indigo",
          "blue",
          "teal",
          "green",
          "light-green",
          "amber",
          "orange",
          "deep-orange",
        ];
        this.orgColors[orgId] =
          colors[Object.keys(this.orgColors).length % colors.length];
      }
      return this.orgColors[orgId];
    },
    getMeetingTypeColor(type) {
      return this.meetingTypeColors[type] || "grey";
    },
    showMeetingDetails(meeting) {
      this.selectedMeeting = meeting;
      this.detailsDialog = true;

      // 다이얼로그가 열린 후 차트 초기화
      this.$nextTick(() => {
        // 차트 초기화 로직
      });
    },
  },
};
</script>

<style scoped>
.search-field {
  max-width: 200px;
}

.organization-tree {
  max-height: 500px;
  overflow-y: auto;
}

.org-tree-label {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .search-field {
    max-width: 100%;
  }
}
</style>
