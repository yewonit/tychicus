<template>
  <v-container class="visit-report-view">
    <!-- 그룹 통계 대시보드 -->
    <v-row>
      <v-col cols="12">
        <div class="text-center mb-4">
          <div class="d-flex align-center justify-center mb-2">
            <v-icon color="deep-purple" class="mr-2">mdi-account-group</v-icon>
            <div class="wc-h3">그룹원</div>
          </div>
          <div class="wc-info-light">
            승강욱그룹 · 청년2구 · 재적 {{ totalMembers }}명
          </div>
        </div>

        <v-row
          justify-center
          class="mx-0"
          style="max-width: 1000px; margin: 0 auto !important"
        >
          <v-col
            cols="auto"
            sm="auto"
            md="auto"
            lg="auto"
            xl="auto"
            class="px-1"
            v-for="(stat, index) in groupStats"
            :key="index"
          >
            <v-card
              class="stat-card pa-3 text-center"
              :class="stat.colorClass"
              elevation="1"
              style="min-width: 160px"
            >
              <div class="stat-number">{{ stat.count }}명</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-sublabel">{{ stat.sublabel }}</div>
              <div v-if="stat.trend" class="stat-trend">
                <v-icon small :color="stat.trendColor">
                  {{ stat.trendIcon }}
                </v-icon>
                <span :class="stat.trendColor + '--text'">
                  {{ stat.trend }}
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="px-4">
          <div class="d-flex align-center mb-3 filter-bar pt-4">
            <div class="wc-h3 ml-2">그룹원 목록</div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="이름으로 검색..."
              clearable
              dense
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="search-input mr-3"
              style="max-width: 200px"
            />
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              dense
              hide-details
              clearable
              class="status-select mr-3"
              style="max-width: 150px"
            />
          </div>
          <v-data-table
            :headers="headers"
            :items="filteredMembers"
            class="elevation-1"
            :items-per-page="10"
            :loading="loading"
            loading-text="그룹원 정보를 불러오는 중..."
            style="width: 100%"
          >
            <template slot="item.role" slot-scope="{ item }">
              <v-chip
                :color="getRoleColor(item.role)"
                text-color="white"
                small
                class="role-badge"
              >
                {{ item.role }}
              </v-chip>
            </template>
            <template slot="item.status" slot-scope="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark>{{
                item.status
              }}</v-chip>
            </template>
            <template slot="item.actions" slot-scope="{ item }">
              <v-btn icon @click="viewVisitHistory(item)" color="info">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon @click="addVisitRecord(item)" color="success">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn icon @click="editVisitRecord(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">안내</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "VisitReportView",
  data() {
    return {
      loading: false,
      dialog: false,
      dialogMessage: "",
      search: "",
      statusFilter: null,
      statusOptions: [
        { text: "전체 상태", value: null },
        { text: "정상 출석", value: "정상 출석" },
        { text: "1주 결석", value: "1주 결석" },
        { text: "3주 결석", value: "3주 결석" },
      ],
      headers: [
        { text: "이름", value: "name", align: "start" },
        { text: "역할", value: "role" },
        { text: "연락처", value: "phone" },
        { text: "출석 상태", value: "status" },
        { text: "마지막 심방일", value: "lastVisitDate" },
        { text: "심방 횟수", value: "visitCount" },
        { text: "심방 관리", value: "actions", sortable: false },
      ],
      members: [
        {
          name: "허효진",
          role: "순장",
          phone: "010-2222-2222",
          status: "정상 출석",
          lastVisitDate: "2024-06-05",
          visitCount: 3,
        },
        {
          name: "이민용",
          role: "순원",
          phone: "010-2345-6789",
          status: "3주 결석",
          lastVisitDate: "2024-05-15",
          visitCount: 1,
        },
        {
          name: "김하영",
          role: "EBS",
          phone: "010-3456-7890",
          status: "정상 출석",
          lastVisitDate: "2024-06-08",
          visitCount: 2,
        },
        {
          name: "박세진",
          role: "순원",
          phone: "010-4567-8901",
          status: "정상 출석",
          lastVisitDate: "2024-06-01",
          visitCount: 4,
        },
        {
          name: "최예린",
          role: "순원",
          phone: "010-5678-9012",
          status: "정상 출석",
          lastVisitDate: "2024-06-07",
          visitCount: 2,
        },
        {
          name: "이동현",
          role: "순원",
          phone: "010-6789-0123",
          status: "1주 결석",
          lastVisitDate: "2024-05-20",
          visitCount: 1,
        },
        {
          name: "정수민",
          role: "순원",
          phone: "010-7890-1234",
          status: "정상 출석",
          lastVisitDate: "2024-06-06",
          visitCount: 3,
        },
        {
          name: "한지우",
          role: "순원",
          phone: "010-8901-2345",
          status: "정상 출석",
          lastVisitDate: "2024-06-04",
          visitCount: 5,
        },
        {
          name: "김준영",
          role: "순원",
          phone: "010-9012-3456",
          status: "정상 출석",
          lastVisitDate: "2024-06-09",
          visitCount: 2,
        },
        {
          name: "오유진",
          role: "NEW",
          phone: "010-0123-4567",
          status: "정상 출석",
          lastVisitDate: "2024-06-03",
          visitCount: 1,
        },
      ],
    };
  },
  computed: {
    totalMembers() {
      return this.members.length;
    },
    groupStats() {
      const totalCount = this.members.length;
      const normalAttendance = this.members.filter(
        (m) => m.status === "정상 출석"
      ).length;
      const oneWeekAbsent = this.members.filter(
        (m) => m.status === "1주 결석"
      ).length;
      const threeWeekAbsent = this.members.filter(
        (m) => m.status === "3주 결석"
      ).length;
      const newMembers = this.members.filter((m) => m.role === "NEW").length;

      return [
        {
          count: totalCount,
          label: "총 재적 인원",
          sublabel: "변동 없음",
          colorClass: "stat-total",
        },
        {
          count: normalAttendance,
          label: "정상 출석",
          sublabel: "",
          trend: "2명",
          trendIcon: "mdi-trending-up",
          trendColor: "success",
          colorClass: "stat-normal",
        },
        {
          count: oneWeekAbsent,
          label: "관심 순원",
          sublabel: "1-2주 결석",
          colorClass: "stat-attention",
        },
        {
          count: threeWeekAbsent,
          label: "장기 결석",
          sublabel: "3주 이상",
          colorClass: "stat-absent",
        },
        {
          count: newMembers,
          label: "새가족",
          sublabel: "이번 달 등록",
          colorClass: "stat-new",
        },
      ];
    },
    filteredMembers() {
      return this.members.filter((m) => {
        const nameMatch = !this.search || m.name.includes(this.search);
        const statusMatch =
          !this.statusFilter || m.status === this.statusFilter;
        return nameMatch && statusMatch;
      });
    },
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "정상 출석":
          return "success";
        case "3주 결석":
          return "error";
        case "1주 결석":
          return "info";
        default:
          return "grey";
      }
    },
    getRoleColor(role) {
      switch (role) {
        case "순장":
          return "primary";
        case "순원":
          return "blue lighten-2";
        case "EBS":
          return "green";
        case "NEW":
          return "deep-purple accent-2";
        default:
          return "grey";
      }
    },
    viewVisitHistory(item) {
      this.dialogMessage = `${item.name}님의 심방 기록을 조회합니다.`;
      this.dialog = true;
      // TODO: 심방 기록 조회 로직 구현
    },
    addVisitRecord(item) {
      this.dialogMessage = `${item.name}님의 새로운 심방 기록을 추가합니다.`;
      this.dialog = true;
      // TODO: 심방 기록 추가 폼 열기
    },
    editVisitRecord(item) {
      this.dialogMessage = `${item.name}님의 심방 기록을 수정합니다.`;
      this.dialog = true;
      // TODO: 심방 기록 수정 폼 열기
    },
  },
};
</script>

<style scoped>
.visit-report-view {
  padding-bottom: 80px;
}
.wc-h2 {
  font-size: 2rem;
  font-weight: bold;
}
.wc-h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-right: 16px;
}
.wc-info-light {
  color: #888;
  font-size: 1rem;
}
.filter-bar {
  gap: 0;
}
.role-badge {
  font-weight: bold;
  font-size: 13px;
  letter-spacing: 0.5px;
}
/* 직사각형 스타일 강제 적용 */
.no-radius,
.no-radius .v-input,
.no-radius .v-input__control,
.no-radius .v-input__slot,
.no-radius .v-select__slot,
.no-radius .v-text-field__slot,
.no-radius .v-input__slot input,
.no-radius .v-input__slot .v-select__selections,
.no-radius .v-select__selection,
.no-radius fieldset {
  border-radius: 0 !important;
}

/* 페이지네이션 및 모든 셀렉트 박스 직사각형으로 */
.visit-report-view .v-select,
.visit-report-view .v-select .v-input,
.visit-report-view .v-select .v-input__control,
.visit-report-view .v-select .v-input__slot,
.visit-report-view .v-select .v-select__slot,
.visit-report-view .v-text-field,
.visit-report-view .v-text-field .v-input,
.visit-report-view .v-text-field .v-input__control,
.visit-report-view .v-text-field .v-input__slot,
.visit-report-view .v-text-field .v-text-field__slot,
.v-data-footer .v-select,
.v-data-footer .v-select .v-input,
.v-data-footer .v-select .v-input__control,
.v-data-footer .v-select .v-input__slot,
.v-data-footer .v-select .v-select__slot {
  border-radius: 0 !important;
}

/* 전역 스타일 완전 오버라이드 - 검색칸과 필터를 얇게 */
.visit-report-view .search-input.v-text-field,
.visit-report-view .status-select.v-select {
  height: 32px !important;
  min-height: 32px !important;
  font-size: 14px !important;
  font-weight: normal !important;
  border-radius: 4px !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
  animation: none !important;
}

.visit-report-view .search-input .v-input,
.visit-report-view .status-select .v-input {
  height: 32px !important;
  min-height: 32px !important;
  font-size: 14px !important;
  font-weight: normal !important;
  border-radius: 4px !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
  animation: none !important;
}

.visit-report-view .search-input .v-input__slot,
.visit-report-view .search-input .v-text-field__slot,
.visit-report-view .status-select .v-input__slot,
.visit-report-view .status-select .v-select__slot {
  min-height: 32px !important;
  height: 32px !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  box-shadow: none !important;
  padding: 0 12px !important;
}

.visit-report-view .search-input .v-text-field input,
.visit-report-view .status-select .v-select__selections {
  font-size: 14px !important;
  line-height: 30px !important;
  padding: 0 !important;
}

.visit-report-view .search-input .v-input__prepend-inner,
.visit-report-view .status-select .v-input__append-inner {
  margin-top: 4px !important;
  align-self: center !important;
}

.visit-report-view .search-input .v-label,
.visit-report-view .status-select .v-label {
  font-size: 14px !important;
  top: 6px !important;
  width: auto !important;
  text-align: left !important;
  color: rgba(0, 0, 0, 0.6) !important;
  opacity: 1 !important;
  line-height: 1.5 !important;
  padding-top: 0 !important;
  padding-left: 0 !important;
}

.visit-report-view .search-input .v-label--active,
.visit-report-view .status-select .v-label--active {
  transform: translateY(-18px) scale(0.75) !important;
}

/* 그룹 통계 카드 스타일 */
.stat-card {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  min-height: 100px;
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 2px;
  color: #333;
  line-height: 1.2;
}

.stat-sublabel {
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.1;
}

.stat-trend {
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

/* 통계 카드 색상 테마 */
.stat-total {
  border-left-color: #6c5ce7;
}

.stat-total .stat-number {
  color: #6c5ce7;
}

.stat-normal {
  border-left-color: #00b894;
}

.stat-normal .stat-number {
  color: #00b894;
}

.stat-attention {
  border-left-color: #fdcb6e;
}

.stat-attention .stat-number {
  color: #e17055;
}

.stat-absent {
  border-left-color: #e17055;
}

.stat-absent .stat-number {
  color: #e17055;
}

.stat-new {
  border-left-color: #74b9ff;
}

.stat-new .stat-number {
  color: #74b9ff;
}
</style>
