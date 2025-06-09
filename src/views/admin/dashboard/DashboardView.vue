<template>
  <div class="dashboard admin-dashboard">
    <!-- 비밀번호 인증 대화상자 -->
    <v-dialog
      v-model="showPasswordDialog"
      persistent
      max-width="450"
      :overlay="true"
      :no-click-animation="true"
      :retain-focus="false"
      transition="dialog-top-transition"
    >
      <v-card class="password-dialog">
        <div class="password-header">
          <v-icon class="lock-icon">mdi-shield-lock</v-icon>
          <h2 class="headline">코람데오 관리자 인증</h2>
        </div>
        <v-card-text class="password-content">
          <div class="password-message">
            <v-icon left color="info">mdi-information-outline</v-icon>
            <span>대시보드에 접근하려면 비밀번호를 입력하세요.</span>
          </div>

          <v-text-field
            v-model="inputPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="비밀번호"
            color="primary"
            class="password-input"
            prepend-inner-icon="mdi-key"
            @click:append="showPassword = !showPassword"
            @keyup.enter="verifyPassword"
            autofocus
            :error="passwordError"
            :error-messages="passwordErrorMessage"
            background-color="white"
            solo
            flat
            hide-details="auto"
            single-line
          ></v-text-field>

          <v-alert
            v-if="passwordError"
            dense
            type="error"
            class="password-alert mt-2"
            border="left"
          >
            {{ passwordErrorMessage }}
          </v-alert>
        </v-card-text>
        <v-card-actions class="password-actions">
          <v-spacer></v-spacer>
          <v-btn text class="cancel-btn" @click="cancelPasswordDialog">
            <v-icon left small>mdi-close</v-icon>
            취소
          </v-btn>
          <v-btn
            color="primary"
            class="login-btn"
            :loading="loggingIn"
            @click="verifyPassword"
          >
            <v-icon left small>mdi-login</v-icon>
            인증하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 로딩 인디케이터 -->
    <v-fade-transition>
      <v-overlay v-if="isLoading" opacity="0.85" class="loading-overlay">
        <div class="loading-container">
          <div class="loading-spinner-wrapper">
            <v-progress-circular
              indeterminate
              size="80"
              width="5"
              color="primary"
              class="loading-spinner"
            >
              <v-icon size="36" color="white">mdi-database-sync</v-icon>
            </v-progress-circular>
          </div>

          <div class="loading-content">
            <div class="loading-title">{{ loadingStepText }}</div>

            <v-progress-linear
              :value="loadingProgress"
              height="8"
              rounded
              striped
              color="primary"
              background-color="rgba(255, 255, 255, 0.2)"
              class="loading-progress-bar"
            ></v-progress-linear>

            <div class="loading-percentage">{{ loadingProgress }}% 완료</div>

            <div v-if="loadingDetails" class="loading-details">
              <v-icon small color="white" class="mr-1"
                >mdi-information-outline</v-icon
              >
              {{ loadingDetails }}
            </div>

            <div v-if="loadingError" class="loading-error">
              <v-icon color="error" small class="mr-1">mdi-alert-circle</v-icon>
              {{ loadingError }}
              <v-btn
                small
                color="error"
                outlined
                class="retry-btn"
                @click="retryLoading"
              >
                <v-icon small left>mdi-refresh</v-icon>
                다시 시도
              </v-btn>
            </div>
          </div>
        </div>
      </v-overlay>
    </v-fade-transition>

    <!-- 대시보드 메인 컨텐츠 -->
    <v-container fluid class="dashboard-container pa-4">
      <!-- 헤더 및 날짜 선택 -->
      <v-row>
        <v-col cols="12" class="pa-2">
          <v-card class="dashboard-header-card" elevation="3">
            <div class="dashboard-header">
              <div class="dashboard-title">
                <v-icon class="dashboard-icon">mdi-chart-box</v-icon>
                <span class="text-h5 font-weight-medium"
                  >출석 데이터 대시보드</span
                >
              </div>

              <div class="header-controls-wrapper">
                <div class="date-field-container">
                  <label class="date-label">시작일</label>
                  <v-menu
                    ref="startDateMenu"
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div class="date-input-wrapper">
                        <v-icon class="date-input-icon">mdi-calendar</v-icon>
                        <v-text-field
                          v-model="formattedStartDateShort"
                          readonly
                          dense
                          v-bind="attrs"
                          v-on="on"
                          class="date-input"
                          hide-details
                          height="40"
                        ></v-text-field>
                      </div>
                    </template>
                    <v-date-picker
                      v-model="dateRange.start"
                      no-title
                      @input="startDateMenu = false"
                      :max="dateRange.end"
                      locale="ko"
                      color="primary"
                      header-color="primary"
                    ></v-date-picker>
                  </v-menu>
                </div>

                <div class="date-separator">~</div>

                <div class="date-field-container">
                  <label class="date-label">종료일</label>
                  <v-menu
                    ref="endDateMenu"
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div class="date-input-wrapper">
                        <v-icon class="date-input-icon">mdi-calendar</v-icon>
                        <v-text-field
                          v-model="formattedEndDateShort"
                          readonly
                          dense
                          v-bind="attrs"
                          v-on="on"
                          class="date-input"
                          hide-details
                          height="40"
                        ></v-text-field>
                      </div>
                    </template>
                    <v-date-picker
                      v-model="dateRange.end"
                      no-title
                      @input="endDateMenu = false"
                      :min="dateRange.start"
                      locale="ko"
                      color="primary"
                      header-color="primary"
                    ></v-date-picker>
                  </v-menu>
                </div>

                <div class="header-actions">
                  <v-btn
                    class="search-btn"
                    @click="applyDateRange"
                    :loading="isLoading"
                    height="40"
                  >
                    <v-icon left>mdi-magnify</v-icon>
                    조회
                  </v-btn>
                  <v-btn
                    class="update-btn"
                    @click="refreshDashboardData"
                    :loading="isLoading"
                    height="40"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    전체 데이터 업데이트
                  </v-btn>
                  <v-btn
                    class="excel-download-btn"
                    @click="downloadExcelData"
                    :loading="isExporting"
                    :disabled="
                      isLoading || filteredMemberAttendanceData.length === 0
                    "
                    height="40"
                  >
                    <v-icon left>mdi-file-excel</v-icon>
                    엑셀 다운로드
                  </v-btn>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="period-summary">
              <v-chip small class="mr-2 period-chip">조회 기간</v-chip>
              <span class="period-text"
                >{{ formattedStartDate }} ~ {{ formattedEndDate }}</span
              >
              <v-spacer></v-spacer>

              <div class="quick-filter-section">
                <v-btn-toggle
                  v-model="selectedDateRangeOption"
                  class="quick-filter-buttons"
                  mandatory
                  height="36"
                >
                  <v-btn value="last7Days" @click="setDateRange('last7Days')"
                    >최근 7일</v-btn
                  >
                  <v-btn value="last30Days" @click="setDateRange('last30Days')"
                    >최근 30일</v-btn
                  >
                  <v-btn value="lastWeek" @click="setDateRange('lastWeek')"
                    >지난 주</v-btn
                  >
                  <v-btn value="lastMonth" @click="setDateRange('lastMonth')"
                    >지난 달</v-btn
                  >
                </v-btn-toggle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div
        v-if="attendanceData.meetings.length > 0"
        class="dashboard-cards-container"
      >
        <!-- 출석률 그래프 영역 -->
        <v-row>
          <v-col cols="12" class="pa-2">
            <AttendanceChartSection
              :meetingDates="meetingDates"
              :memberAttendanceData="filteredMemberAttendanceData"
              :isDarkTheme="isDarkTheme"
              :absenceRiskStats="getAbsenteeStats()"
            />
          </v-col>
        </v-row>

        <!-- 출석 테이블 -->
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-card class="attendance-data-card">
              <v-card-title class="filter-header pa-4">
                <div class="d-flex align-center flex-grow-1">
                  <v-icon left color="primary">mdi-account-multiple</v-icon>
                  <span class="text-h6">인원별 출결 현황</span>
                  <v-spacer></v-spacer>

                  <!-- 조직 선택 드롭다운 추가 -->
                  <v-select
                    v-model="selectedOrganization"
                    :items="organizationSelectItems"
                    item-text="text"
                    item-value="value"
                    label="조직 선택"
                    dense
                    outlined
                    class="organization-select mx-2"
                    @change="handleOrganizationChange"
                    prepend-inner-icon="mdi-file-tree"
                    hide-details
                    height="40"
                    style="max-width: 220px"
                  ></v-select>

                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="검색"
                    single-line
                    hide-details
                    dense
                    outlined
                    class="search-field"
                    clearable
                    height="40"
                    style="max-width: 200px"
                  ></v-text-field>
                </div>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pa-4">
                <v-data-table
                  :headers="memberTableHeaders"
                  :items="filteredMemberAttendanceData"
                  :search="search"
                  :items-per-page="20"
                  :footer-props="{
                    itemsPerPageOptions: [10, 20, 50, 100, -1],
                    itemsPerPageText: '페이지당 행 수',
                  }"
                  dense
                  class="elevation-1 attendance-table"
                  :loading="isLoading"
                  loading-text="데이터 로딩 중..."
                  no-data-text="표시할 출결 데이터가 없습니다"
                  no-results-text="검색 결과가 없습니다"
                  mobile-breakpoint="0"
                >
                  <template v-slot:[`item.memberName`]="{ item }">
                    <div
                      :class="{
                        'font-weight-medium': !item.isPlaceholder,
                        'placeholder-member': item.isPlaceholder,
                      }"
                    >
                      {{ item.memberName }}
                      <v-chip
                        v-if="item.isPlaceholder"
                        x-small
                        color="orange"
                        text-color="white"
                        class="ml-2"
                      >
                        데이터 없음
                      </v-chip>
                    </div>
                  </template>

                  <template v-slot:[`item.organizationName`]="{ item }">
                    <div>{{ item.organizationName }}</div>
                  </template>

                  <!-- 각 예배 일자별 출석 여부 표시 -->
                  <template
                    v-for="(meeting, index) in meetingDates"
                    v-slot:[`item.meeting_${index}`]="{ item }"
                  >
                    <div
                      :key="meeting.date + '_' + meeting.type"
                      :class="{
                        'attendance-present':
                          getMemberMeetingAttendance(item, meeting) === 'O',
                        'attendance-absent':
                          getMemberMeetingAttendance(item, meeting) === 'X',
                      }"
                      class="text-center attendance-cell"
                    >
                      {{ getMemberMeetingAttendance(item, meeting) }}
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 단기 결석자 위험군 추가 -->
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-expansion-panels v-model="absencePanelExpanded" :flat="false">
              <v-expansion-panel>
                <v-expansion-panel-header class="absence-header pa-4">
                  <div class="d-flex align-center">
                    <v-icon left color="error">mdi-account-alert</v-icon>
                    <span class="text-h6">단기 결석자 위험군</span>
                    <v-chip small color="light-blue" class="ml-2" outlined
                      >1주 결석</v-chip
                    >
                    <v-chip small color="amber darken-2" class="ml-2" outlined
                      >2주 결석</v-chip
                    >
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="absence-risk-card elevation-0">
                    <v-tabs
                      v-model="activeRiskTab"
                      background-color="white"
                      slider-color="error"
                      show-arrows
                    >
                      <v-tab v-for="type in riskTabTypes" :key="type.value">
                        {{ type.text }}
                      </v-tab>
                    </v-tabs>

                    <v-divider></v-divider>

                    <v-tabs-items v-model="activeRiskTab">
                      <v-tab-item
                        v-for="type in riskTabTypes"
                        :key="type.value"
                      >
                        <v-card flat>
                          <v-card-text class="pa-4">
                            <div
                              v-if="
                                getAbsenceRiskMembers(type.value).length === 0
                              "
                              class="text-center pa-5"
                            >
                              <v-icon large color="grey lighten-1" class="mb-2"
                                >mdi-account-check</v-icon
                              >
                              <div>
                                {{ type.text }}에 위험군 인원이 없습니다.
                              </div>
                            </div>

                            <v-data-table
                              v-else
                              :headers="absenceRiskHeaders"
                              :items="getAbsenceRiskMembers(type.value)"
                              :items-per-page="10"
                              dense
                              class="elevation-1 risk-table"
                            >
                              <template
                                v-slot:[`item.organizationName`]="{ item }"
                              >
                                <div>{{ item.organizationName }}</div>
                              </template>
                              <template v-slot:[`item.memberName`]="{ item }">
                                <div class="font-weight-medium">
                                  {{ item.memberName }}
                                </div>
                              </template>
                              <template
                                v-slot:[`item.continuousAbsence`]="{ item }"
                              >
                                <v-chip
                                  small
                                  :color="
                                    getAbsenceColor(item.continuousAbsence)
                                  "
                                  dark
                                >
                                  {{ item.continuousAbsence }}주 연속 결석
                                </v-chip>
                              </template>
                              <template
                                v-slot:[`item.lastAttendance`]="{ item }"
                              >
                                <div>{{ item.lastAttendance }}</div>
                              </template>
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-btn
                                  x-small
                                  text
                                  color="primary"
                                  @click="contactMember(item)"
                                >
                                  <v-icon small>mdi-phone</v-icon>
                                </v-btn>
                                <v-btn
                                  x-small
                                  text
                                  color="info"
                                  @click="sendMessage(item)"
                                >
                                  <v-icon small>mdi-message-text</v-icon>
                                </v-btn>
                              </template>
                            </v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </div>

      <!-- 데이터가 없을 경우 표시 -->
      <v-row v-if="attendanceData.meetings.length === 0 && !isLoading">
        <v-col cols="12" class="pa-2">
          <v-card class="empty-data-card text-center py-5">
            <v-card-text>
              <v-icon size="64" color="grey lighten-1"
                >mdi-calendar-blank</v-icon
              >
              <div class="text-h6 grey--text mt-3">
                선택한 기간에 모임 데이터가 없습니다.
              </div>
              <v-btn
                color="primary"
                class="mt-4"
                @click="setDateRange('thisWeek')"
              >
                이번 주 데이터 조회
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";
import moment from "moment";
import AttendanceChartSection from "@/components/admin/dashboard/AttendanceChartSection.vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default {
  name: "AdminDashboard",
  components: {
    AttendanceChartSection,
  },
  mixins: [MasterCtrl, OrganizationCtrl, AttendanceCtrl],
  data() {
    // 기본 조회 기간을 오늘부터 최근 7일로 설정
    const today = moment();
    const sevenDaysAgo = moment().subtract(7, "days");

    return {
      // 비밀번호 인증 관련
      showPasswordDialog: true, // 초기 로드 시 대화상자 표시
      inputPassword: "",
      showPassword: false,
      passwordError: false,
      passwordErrorMessage: "",
      isAuthenticated: false, // 인증 여부
      loggingIn: false, // 로그인 진행 중 상태

      // 테마 관련
      isDarkTheme: true, // 기본 테마는 다크 테마로 변경

      // 기본 UI 상태
      activeTab: 0,
      isLoading: false,
      search: "",
      selectedDateRangeOption: "last7Days",

      // 로딩 상태
      loadingProgress: 0,
      loadingOperations: 3, // 주요 작업 3개로 변경 (캐싱 제거)
      completedOperations: 0,
      loadingError: null,
      loadingStepText: "데이터 로딩 중...",
      loadingDetails: null,
      isExporting: false, // 엑셀 내보내기 진행중 상태

      // 날짜 선택 관련
      dateRange: {
        start: sevenDaysAgo.format("YYYY-MM-DD"),
        end: today.format("YYYY-MM-DD"),
      },
      startDateMenu: false,
      endDateMenu: false,

      // 조직 정보
      organizations: [],
      selectedOrganization: null,
      organizationSelectItems: [],

      // 출석 데이터
      attendanceData: {
        meetings: [], // 모든 조직의 모임 정보
        statistics: {}, // 조직별 출석 통계
        summary: {
          totalMeetings: 0,
          totalAttendees: 0,
          averageAttendanceRate: 0,
        },
      },

      // 원본 데이터 보존을 위한 변수 (필터링용)
      originalMeetingsData: [],

      // 예배 유형 정의
      meetingTypes: {
        SUNDAY_SERVICE_2: "주일2부예배",
        SUNDAY_SERVICE_3: "주일3부예배",
        YOUTH_SERVICE: "청년예배",
        WEDNESDAY_SERVICE: "수요예배",
        FRIDAY_SERVICE: "금요예배",
        WEDNESDAY_PRAYER: "수요제자기도회",
        HEALING_MINISTRY: "현장치유팀사역",
      },

      // 테이블 데이터
      attendanceTableData: [],
      meetingTypeData: [],

      // 모임 일자 목록
      meetingDates: [],

      // 인원별 출결 데이터
      memberAttendanceData: [],
      filteredMemberAttendanceData: [],

      // 테이블 헤더
      memberTableHeaders: [
        { text: "조직명", value: "organizationName", width: "280px" },
        { text: "인원명", value: "memberName", width: "150px" },
      ],

      // 단기 결석자 위험군 관련
      activeRiskTab: 0,
      absencePanelExpanded: null, // null(-1)이면 패널이 접힌 상태, 0이면 펼쳐진 상태
      riskTabTypes: [
        { text: "청년예배", value: "YOUTH_SERVICE" },
        { text: "주일2부예배", value: "SUNDAY_SERVICE_2" },
        { text: "주일3부예배", value: "SUNDAY_SERVICE_3" },
        { text: "수요제자기도회", value: "WEDNESDAY_PRAYER" },
        { text: "현장치유팀사역", value: "HEALING_MINISTRY" },
      ],
      absenceRiskHeaders: [
        { text: "조직명", value: "organizationName", width: "280px" },
        { text: "인원명", value: "memberName", width: "150px" },
        { text: "연속 결석", value: "continuousAbsence", width: "150px" },
        { text: "마지막 출석일", value: "lastAttendance", width: "150px" },
        { text: "액션", value: "actions", width: "100px", sortable: false },
      ],
      absenceRiskData: {}, // 예배 유형별 결석자 데이터 캐시
    };
  },
  created() {
    // 페이지 로드 시 데이터 초기화
    this.loadSavedTheme(); // 저장된 테마 설정 불러오기

    // 다크 테마가 기본값인지 확인하고, 로컬 스토리지에 없으면 저장
    if (localStorage.getItem("dashboardTheme") === null) {
      localStorage.setItem("dashboardTheme", "dark");
      this.isDarkTheme = true;
    }

    this.initializeDashboard();
  },
  mounted() {
    // 햄버거 버튼 비활성화 및 사이드바 닫기 (약간의 지연으로 실행)
    setTimeout(() => {
      // 대시보드 활성화 클래스 추가
      document.body.classList.add("dashboard-active");

      // 이벤트 발생
      this.$root.$emit("dashboard-menu-state", {
        disabled: true,
        closed: true,
      });

      // 300ms 후 한번 더 확인 (타이밍 이슈 방지)
      setTimeout(() => {
        // 클래스가 제대로 적용되었는지 확인
        if (!document.body.classList.contains("dashboard-active")) {
          document.body.classList.add("dashboard-active");
        }

        // 이벤트 다시 발생
        this.$root.$emit("dashboard-menu-state", {
          disabled: true,
          closed: true,
        });
      }, 300);
    }, 100);
  },
  computed: {
    // 날짜 포맷팅
    formattedStartDate() {
      return moment(this.dateRange.start).format("YYYY년 MM월 DD일");
    },
    formattedEndDate() {
      return moment(this.dateRange.end).format("YYYY년 MM월 DD일");
    },
    // 간략한 날짜 포맷 (입력 필드용)
    formattedStartDateShort() {
      return moment(this.dateRange.start).format("YYYY.MM.DD");
    },
    formattedEndDateShort() {
      return moment(this.dateRange.end).format("YYYY.MM.DD");
    },

    // 테이블 헤더 생성
    tableHeaders() {
      const headers = [
        { text: "조직명", value: "organizationName", width: "250px" },
      ];

      // 각 예배 유형에 대한 헤더 추가
      Object.entries(this.meetingTypes).forEach(([type, name]) => {
        headers.push({
          text: name,
          value: type,
          align: "center",
          width: "120px",
          sortable: false,
        });
      });

      return headers;
    },

    // 조직 트리 구조 생성
    organizationTree() {
      // 조직 데이터가 없으면 빈 배열 반환
      if (!this.organizations || this.organizations.length === 0) {
        return [];
      }

      // 조직 맵 생성 (ID로 빠르게 접근하기 위함)
      const orgMap = {};
      this.organizations.forEach((org) => {
        // 깊은 복사하여 트리 구성을 위한 추가 속성 설정
        orgMap[org.id] = {
          ...org,
          children: [],
          level: 0,
          isLeafNode: true, // 기본적으로 리프 노드로 설정
          path: [org.organization_name], // 조직 경로 (이름 기반)
          pathIds: [org.id], // 조직 경로 (ID 기반)
        };
      });

      // 트리 구성 - 각 조직의 상위 조직에 자식으로 추가
      const rootNodes = [];

      this.organizations.forEach((org) => {
        const node = orgMap[org.id];

        if (org.upper_organization_id && orgMap[org.upper_organization_id]) {
          // 상위 조직이 있는 경우
          const parentNode = orgMap[org.upper_organization_id];
          parentNode.children.push(node);
          parentNode.isLeafNode = false; // 자식이 있으므로 리프 노드가 아님

          // 레벨과 경로 설정
          node.level = parentNode.level + 1;
          node.path = [...parentNode.path, node.organization_name];
          node.pathIds = [...parentNode.pathIds, node.id];
        } else {
          // 최상위 조직인 경우
          rootNodes.push(node);
        }
      });

      return rootNodes;
    },

    // 모든 조직을 평면화된 배열로 반환
    flattenedOrganizations() {
      const result = [];

      // 조직 트리를 순회하며 평면화
      const flattenTree = (nodes, level = 0) => {
        nodes.forEach((node) => {
          result.push({
            ...node,
            level,
          });

          if (node.children && node.children.length > 0) {
            flattenTree(node.children, level + 1);
          }
        });
      };

      flattenTree(this.organizationTree);
      return result;
    },
  },
  methods: {
    // 비밀번호 확인
    verifyPassword() {
      const correctPassword = "CoramDeo"; // 정확한 비밀번호

      // 로딩 효과 시작
      this.loggingIn = true;

      // 약간의 지연으로 로딩 효과 표시 (사용자 경험 향상)
      setTimeout(() => {
        if (this.inputPassword === correctPassword) {
          // 비밀번호 일치
          this.isAuthenticated = true;
          this.passwordError = false;
          this.passwordErrorMessage = "";

          // 로딩 효과 완료 후 대화상자 닫기
          setTimeout(() => {
            this.showPasswordDialog = false;
            this.loggingIn = false;
            this.initializeDashboard(); // 비밀번호 확인 후 데이터 로딩 시작
          }, 300);
        } else {
          // 비밀번호 불일치
          this.passwordError = true;
          this.passwordErrorMessage = "비밀번호가 일치하지 않습니다.";
          this.inputPassword = ""; // 입력 필드 초기화
          this.loggingIn = false; // 로딩 효과 종료
        }
      }, 500);
    },

    // 비밀번호 대화상자 취소
    cancelPasswordDialog() {
      // 사용자가 취소를 누르면 메인 페이지로 리다이렉트하거나 다른 조치 취하기
      this.$router.push({ name: "Home" }); // 홈으로 리다이렉트 (라우터 설정에 맞게 수정 필요)
    },

    // 대시보드 초기화
    async initializeDashboard() {
      // 인증되지 않았으면 초기화 중단
      if (!this.isAuthenticated) {
        return;
      }
      this.isLoading = true;
      this.loadingProgress = 0;
      this.loadingOperations = 3; // 주요 작업 3개로 변경 (캐싱 제거)
      this.completedOperations = 0;
      this.loadingError = null;
      this.loadingStepText = "데이터 초기화...";
      this.loadingDetails = null;

      try {
        // 1. 조직 정보 로딩
        this.loadingStepText = "조직 정보 불러오는 중...";
        this.loadingDetails = "교회 조직 구조를 불러오고 있습니다";
        this.loadingProgress = 0;
        await this.fetchOrganizationsOnly();
        this.updateLoadingProgress();

        // 2. 모임 정보 로딩
        this.loadingStepText = "모임 정보 불러오는 중...";
        this.loadingDetails = "각 조직의 모임 정보를 불러오고 있습니다";
        await this.fetchAllMeetings();
        this.updateLoadingProgress();

        // 3. 출석 데이터 로딩 및 테이블 준비
        this.loadingStepText = "출석 데이터 처리 중...";
        this.loadingDetails = "모임별 출석 정보를 처리하고 있습니다";
        await this.fetchAllAttendanceData();
        this.updateLoadingProgress();

        // 데이터 테이블 준비
        this.loadingStepText = "데이터 테이블 생성 중...";
        this.loadingDetails = "출석 데이터 테이블을 준비하고 있습니다";
        await this.filterData();

        this.loadingStepText = "데이터 로딩 완료!";
        this.loadingDetails = "대시보드를 준비하고 있습니다";

        // 🔴🎉 최종 완료 로그
        console.log(
          "%c🔴🎉 === 대시보드 초기화 완전히 완료! ===",
          "color: red; font-size: 18px; font-weight: bold; background: lightgreen;"
        );
        console.log(
          `%c🔴📊 최종 상태 요약:`,
          "color: red; font-size: 16px; font-weight: bold;"
        );
        console.log(
          `%c🔴🏢   조직 수: ${this.organizations.length}개`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴📅   모임 날짜: ${this.meetingDates.length}개`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴🎭   attendanceData.meetings: ${this.attendanceData.meetings.length}개`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴👤   전체 회원: ${this.memberAttendanceData.length}명`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴🎯   화면 표시 회원: ${this.filteredMemberAttendanceData.length}명`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴📋   드롭다운 조직: ${this.organizationSelectItems.length}개`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴✅   선택된 조직: ${this.selectedOrganization}`,
          "color: red; font-size: 14px;"
        );

        // 각 조직별 상태 확인
        console.log(
          "%c🔴📋 드롭다운에 표시되는 조직들:",
          "color: red; font-size: 15px; font-weight: bold;"
        );
        this.organizationSelectItems.forEach((item, index) => {
          const hasMembers = this.memberAttendanceData.some(
            (member) => member.organizationId === item.value
          );
          const memberCount = this.memberAttendanceData.filter(
            (member) => member.organizationId === item.value
          ).length;
          console.log(
            `%c🔴🏢 [${index + 1}] ID:${item.value} "${
              item.text
            }" → 회원 ${memberCount}명 ${hasMembers ? "✅" : "❌"}`,
            "color: red; font-size: 12px;"
          );
        });
      } catch (error) {
        console.error("대시보드 초기화 중 오류 발생:", error);
        this.loadingError =
          "데이터 로딩 중 오류가 발생했습니다. 다시 시도해주세요.";
      } finally {
        this.completedOperations = this.loadingOperations;
        this.loadingProgress = 100;
        this.loadingStepText = "데이터 로딩 완료!";

        // 데이터를 전부 표시한 후 로딩 화면을 천천히 사라지게 합니다
        setTimeout(() => {
          // 로딩 화면이 페이드 아웃되도록 설정
          this.isLoading = false;
        }, 800);
      }
    },

    // 조직 정보만 불러오는 메서드
    async fetchOrganizationsOnly() {
      try {
        // API에서 조직 정보 가져오기
        const response = await this.getAllOrganizations(true);

        // API 응답 구조 확인 및 데이터 추출
        let organizations = [];
        if (response && response.data && Array.isArray(response.data)) {
          organizations = response.data;
        } else if (Array.isArray(response)) {
          organizations = response;
        } else {
          organizations = this.getDummyOrganizations();
        }

        // 유효한 조직 데이터가 있는지 확인
        if (!organizations || organizations.length === 0) {
          organizations = this.getDummyOrganizations();
        }

        // 🔴🏢 조직 정보 로딩 완료 로그
        console.log(
          "%c🔴🏢 === 조직 정보 로딩 완료 ===",
          "color: red; font-size: 16px; font-weight: bold;"
        );
        console.log(
          `%c🔴📊 전체 조직 수: ${organizations.length}개`,
          "color: red; font-size: 14px; font-weight: bold;"
        );

        organizations.forEach((org, index) => {
          console.log(
            `%c🔴🏢 조직 ${index + 1}: ID=${org.id}, 이름="${
              org.organization_name
            }", 상위조직=${org.upper_organization_id || "없음"}`,
            "color: red; font-size: 12px;"
          );
        });

        // 모든 조직 데이터 사용
        this.organizations = organizations;
        this.updateLoadingProgress();

        // 🔴✅ 조직 저장 완료 로그
        console.log(
          "%c🔴✅ 조직 정보 this.organizations에 저장 완료!",
          "color: red; font-size: 14px; font-weight: bold;"
        );
      } catch (error) {
        console.error(
          "%c🔴❌ 조직 정보 가져오기 오류:",
          "color: red; font-size: 14px; font-weight: bold;",
          error
        );
        // 오류 발생 시 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();
        this.updateLoadingProgress();
      }
    },

    // 더미 조직 데이터 생성 메서드
    getDummyOrganizations() {
      return [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          organization_code: "CORAMDEO",
          description:
            "코람데오 청년선교회는 청년들의 신앙과 교제를 위한 조직입니다.",
          upper_organization_id: null,
          memberCount: 0,
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          organization_code: "CORAMDEO_DEPT1",
          description: "코람데오 청년선교회 1국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          organization_code: "CORAMDEO_DEPT2",
          description: "코람데오 청년선교회 2국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 4,
          organization_name: "코람데오_3국",
          organization_code: "CORAMDEO_DEPT3",
          description: "코람데오 청년선교회 3국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 5,
          organization_name: "코람데오_1국_1팀",
          organization_code: "CORAMDEO_DEPT1_TEAM1",
          description: "코람데오 청년선교회 1국 1팀입니다.",
          upper_organization_id: 2,
          memberCount: 0,
        },
      ];
    },

    // 모든 조직의 모임 정보 가져오기
    async fetchAllMeetings() {
      console.log(
        "%c🔴🎯 === 모임 정보 로딩 시작 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );

      this.attendanceData.meetings = []; // 기존 데이터 초기화
      const failedOrganizations = []; // 실패한 조직 추적

      const totalOrganizations = this.organizations.length;
      let processedCount = 0;

      console.log(
        `%c🔴📋 처리할 조직 수: ${totalOrganizations}개`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      // 모든 조직의 모임 데이터를 하나씩 가져오기
      for (const org of this.organizations) {
        try {
          processedCount++;
          const progressPercent = Math.round(
            (processedCount / totalOrganizations) * 100
          );

          console.log(
            `%c🔴🏢 [${processedCount}/${totalOrganizations}] 조직 처리 중: "${org.organization_name}" (ID: ${org.id})`,
            "color: red; font-size: 13px; font-weight: bold;"
          );

          this.loadingDetails = `조직 정보 처리 중 (${processedCount}/${totalOrganizations}, ${progressPercent}%): ${org.organization_name}`;

          // 조직 경로 찾기
          const orgPath = this.findOrganizationPath(org.id);

          // API에서 모임 정보 가져오기
          const response = await this.getOrganizationActivities(org.id, true);

          // 응답 데이터 처리 - 더 유연한 처리
          let activities = [];
          if (response) {
            if (response.activities && Array.isArray(response.activities)) {
              activities = response.activities;
            } else if (Array.isArray(response)) {
              activities = response;
            } else if (response.data && Array.isArray(response.data)) {
              activities = response.data;
            }
          }

          console.log(
            `%c🔴📊 조직 "${org.organization_name}"의 활동 수: ${activities.length}개`,
            "color: red; font-size: 12px;"
          );

          // 각 활동 상세 정보 로그
          if (activities.length > 0) {
            activities.forEach((activity, idx) => {
              const instanceCount = activity.instances
                ? activity.instances.length
                : 0;
              console.log(
                `%c🔴🎪   활동 ${idx + 1}: "${
                  activity.name || "이름없음"
                }" (인스턴스: ${instanceCount}개)`,
                "color: red; font-size: 11px;"
              );
            });
          } else {
            console.log(
              `%c🔴⚠️   조직 "${org.organization_name}"에 활동이 없습니다!`,
              "color: red; font-size: 12px; background: yellow;"
            );
          }

          // 모든 활동을 가공 (날짜 필터링은 나중에 수행)
          const processedActivities = activities.map((activity) => {
            // 모임 유형 식별 및 분류
            const meetingType = this.identifyMeetingType(
              activity.name || activity.type || ""
            );

            // 인스턴스 정보가 있는지 확인
            const hasInstances =
              activity.instances &&
              Array.isArray(activity.instances) &&
              activity.instances.length > 0;

            // 인스턴스 날짜 정보 로깅
            if (hasInstances) {
              const instanceDates = activity.instances.map((instance) => {
                if (instance.start_datetime) {
                  return moment(instance.start_datetime).format("YYYY-MM-DD");
                }
                return "날짜 없음";
              });
              console.log(
                `%c🔴📅     인스턴스 날짜: ${instanceDates.join(", ")}`,
                "color: red; font-size: 10px;"
              );
            }

            // 각 활동에 필요한 정보 추가
            return {
              ...activity,
              instance_id: hasInstances
                ? activity.instances[0].id
                : activity.latest_instance_id || activity.id,
              meetingType: meetingType,
              meetingTypeName: this.meetingTypes[meetingType] || "기타",
              organizationId: org.id,
              organizationName: org.organization_name,
              organizationPath: orgPath,
              // 인스턴스가 있을 경우 해당 정보로 date 설정 (없으면 기존 date 사용)
              date: hasInstances
                ? moment(activity.instances[0].start_datetime).format(
                    "YYYY-MM-DD"
                  )
                : activity.date,
            };
          });

          // 유효한 활동이 있으면 추가
          if (processedActivities.length > 0) {
            this.attendanceData.meetings.push({
              organizationId: org.id,
              organizationName: org.organization_name,
              organizationPath: orgPath,
              activities: processedActivities,
            });
            console.log(
              `%c🔴✅ 조직 "${org.organization_name}" 추가 완료 (활동 ${processedActivities.length}개)`,
              "color: red; font-size: 12px;"
            );
          } else {
            // 활동이 없는 조직도 빈 배열로 추가하여 추적
            this.attendanceData.meetings.push({
              organizationId: org.id,
              organizationName: org.organization_name,
              organizationPath: orgPath,
              activities: [],
            });
            console.log(
              `%c🔴⚠️ 조직 "${org.organization_name}" 추가 (활동 없음)`,
              "color: red; font-size: 12px; background: yellow;"
            );
          }
        } catch (error) {
          console.error(
            `%c🔴❌ 조직 "${org.organization_name}"의 모임 정보 가져오기 실패:`,
            "color: red; font-size: 12px; font-weight: bold;",
            error
          );
          // 실패한 조직 추가
          failedOrganizations.push(org.organization_name);

          // 실패해도 빈 조직 정보는 추가하여 구조 유지
          this.attendanceData.meetings.push({
            organizationId: org.id,
            organizationName: org.organization_name,
            organizationPath: this.findOrganizationPath(org.id),
            activities: [],
          });
        }
      }

      // 최종 결과 로그
      console.log(
        "%c🔴🎯 === 모임 정보 로딩 완료 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );
      console.log(
        `%c🔴📊 최종 attendanceData.meetings 수: ${this.attendanceData.meetings.length}개`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      // 각 조직별 최종 상태 로그
      this.attendanceData.meetings.forEach((orgData, index) => {
        console.log(
          `%c🔴🏢 [${index + 1}] "${orgData.organizationName}": 활동 ${
            orgData.activities.length
          }개`,
          "color: red; font-size: 12px;"
        );
      });

      // 실패한 조직이 있으면 경고 표시
      if (failedOrganizations.length > 0) {
        console.warn(
          `%c🔴❌ 일부 조직의 모임 정보 로딩 실패: ${failedOrganizations.join(
            ", "
          )}`,
          "color: red; font-size: 14px; background: yellow;"
        );
        this.loadingDetails = `모임 데이터 구조화 중... (${failedOrganizations.length}개 조직 실패)`;
      } else {
        this.loadingDetails = "모임 데이터 구조화 중...";
      }

      // 원본 데이터 보존
      this.originalMeetingsData = JSON.parse(
        JSON.stringify(this.attendanceData.meetings)
      );
      console.log(
        "%c🔴💾 원본 데이터 백업 완료!",
        "color: red; font-size: 14px; font-weight: bold;"
      );
    },

    // 모든 모임의 출석 데이터 가져오기
    async fetchAllAttendanceData() {
      const totalOrgs = this.attendanceData.meetings.length;
      let processedOrgs = 0;

      // 모든 모임을 순회하며 출석 데이터 처리
      for (const orgData of this.attendanceData.meetings) {
        processedOrgs++;
        const progressPercent = Math.round((processedOrgs / totalOrgs) * 100);
        this.loadingDetails = `출석 데이터 처리 중 (${processedOrgs}/${totalOrgs}, ${progressPercent}%): ${orgData.organizationName}`;

        // 각 활동의 출석 정보 처리 - 날짜 범위 필터링은 하지 않음
        for (const activity of orgData.activities) {
          // 활동에 인스턴스가 있는 경우
          if (
            activity.instances &&
            Array.isArray(activity.instances) &&
            activity.instances.length > 0
          ) {
            console.log(
              `활동 "${activity.name || "이름 없음"}"의 인스턴스 수: ${
                activity.instances.length
              }`
            );

            // 모든 인스턴스에 대해 출석 정보 처리
            for (const instance of activity.instances) {
              // 출석 데이터가 없는 경우 빈 배열로 초기화
              if (!instance.attendances) {
                instance.attendances = [];
              }

              // 날짜 정보 확인
              if (instance.start_datetime) {
                const instanceDate = moment(instance.start_datetime).format(
                  "YYYY-MM-DD"
                );
                console.log(
                  `인스턴스 날짜 ${instanceDate}의 출석 정보: ${instance.attendances.length}명`
                );
              }

              // 출석 상태 계산
              const presentCount = instance.attendances.filter(
                (a) => a.status === "출석"
              ).length;
              const totalCount = instance.attendances.length;

              // 인스턴스에 출석 정보 추가
              instance.presentCount = presentCount;
              instance.totalCount = totalCount;
              instance.attendanceRate =
                totalCount > 0 ? presentCount / totalCount : 0;
            }

            // 모든 인스턴스의 출석 상태 합산
            const totalPresent = activity.instances.reduce(
              (sum, inst) => sum + (inst.presentCount || 0),
              0
            );
            const totalMembers = activity.instances.reduce(
              (sum, inst) => sum + (inst.totalCount || 0),
              0
            );

            // 모임 정보 객체에 출석 정보 추가
            activity.presentCount = totalPresent;
            activity.totalCount = totalMembers;
            activity.attendanceRate =
              totalMembers > 0 ? totalPresent / totalMembers : 0;
          }
        }
      }

      console.log("모든 출석 데이터 로딩 완료");
    },

    // 조직 선택 드롭다운 아이템 준비
    prepareOrganizationSelectItems() {
      console.log(
        "%c🔴🎯 === 조직 선택 아이템 준비 시작 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );
      console.log(
        `%c🔴📊 flattenedOrganizations 수: ${this.flattenedOrganizations.length}개`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      this.organizationSelectItems = this.flattenedOrganizations.map((org) => {
        // 들여쓰기를 위한 공백 추가
        const indent = "　".repeat(org.level);
        return {
          text: `${indent}${org.organization_name}`,
          value: org.id,
        };
      });

      console.log(
        "%c🔴📋 조직 선택 아이템 목록:",
        "color: red; font-size: 14px; font-weight: bold;"
      );
      this.organizationSelectItems.forEach((item, index) => {
        console.log(
          `%c🔴🏢 [${index + 1}] ID: ${item.value}, 텍스트: "${item.text}"`,
          "color: red; font-size: 12px;"
        );
      });

      console.log(
        `%c🔴✅ 조직 선택 아이템 준비 완료! 총 ${this.organizationSelectItems.length}개`,
        "color: red; font-size: 14px; font-weight: bold;"
      );
    },

    // 예배 일자 목록 준비
    prepareMeetingDates() {
      console.log("모임 일자 목록 준비 시작");

      // 모든 모임에서 고유한 날짜와 예배 유형 조합을 추출
      const meetingDateMap = new Map();

      // 정해진 날짜 범위
      const startDate = moment(this.dateRange.start).startOf("day");
      const endDate = moment(this.dateRange.end).endOf("day");
      console.log(
        `모임 일자 준비 - 날짜 범위: ${startDate.format(
          "YYYY-MM-DD"
        )} ~ ${endDate.format("YYYY-MM-DD")}`
      );

      // 각 조직의 모임 날짜 확인
      this.attendanceData.meetings.forEach((orgData) => {
        // 조직 확인
        console.log(`조직 ${orgData.organizationName}의 모임 일자 처리`);

        orgData.activities.forEach((activity) => {
          if (activity.instances && activity.instances.length > 0) {
            console.log(
              `모임 '${
                activity.name || activity.meetingType || "알 수 없음"
              }'의 인스턴스 수: ${activity.instances.length}`
            );

            activity.instances.forEach((instance) => {
              // 인스턴스의 시작 날짜 추출
              if (!instance.start_datetime) {
                console.warn("날짜 정보가 없는 인스턴스 발견");
                return;
              }

              // 날짜 파싱
              const instanceDate = moment(instance.start_datetime);
              if (!instanceDate.isValid()) {
                console.warn(
                  `유효하지 않은 날짜 형식: ${instance.start_datetime}`
                );
                return;
              }

              // 날짜 형식 통일
              const formattedDate = instanceDate.format("YYYY-MM-DD");
              const instanceStartDate = moment(formattedDate).startOf("day");

              // 날짜가 범위 내에 있는지 확인
              if (
                !instanceStartDate.isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
              ) {
                console.log(
                  `범위 밖 모임 제외: ${formattedDate}, 모임타입: ${activity.meetingType}`
                );
                return; // 날짜 범위 밖이면 건너뜀
              }

              // 날짜와 모임 유형의 고유 키
              const key = `${formattedDate}_${activity.meetingType}`;

              // 새로운 날짜-모임 조합이면 추가
              if (!meetingDateMap.has(key)) {
                meetingDateMap.set(key, {
                  date: formattedDate,
                  type: activity.meetingType,
                  typeName: activity.meetingTypeName || "알 수 없는 모임",
                  instanceId: instance.id,
                });
                console.log(
                  `모임 일자 추가: ${formattedDate} (${
                    activity.meetingTypeName || "알 수 없는 모임"
                  })`
                );
              }
            });
          }
        });
      });

      // 추출된 모임 일자가 있는지 확인
      if (meetingDateMap.size === 0) {
        console.warn("선택한 날짜 범위에 모임 일자가 없습니다!");
        this.meetingDates = [];
        return;
      }

      // 날짜 기준으로 정렬된 배열로 변환
      this.meetingDates = Array.from(meetingDateMap.values()).sort((a, b) => {
        // 날짜로 먼저 정렬
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;

        // 날짜가 같으면 예배 유형 순서로 정렬
        const typeOrder = {
          SUNDAY_SERVICE_2: 1,
          SUNDAY_SERVICE_3: 2,
          YOUTH_SERVICE: 3,
          WEDNESDAY_SERVICE: 4,
          FRIDAY_SERVICE: 5,
          WEDNESDAY_PRAYER: 6,
          HEALING_MINISTRY: 7,
        };

        return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      });

      // 최종 모임 일자 목록 로깅
      console.log(
        `모임 일자 목록 준비 완료: ${this.meetingDates.length}개 일자`
      );
      this.meetingDates.forEach((meeting) => {
        console.log(`- ${meeting.date} (${meeting.typeName})`);
      });

      // 헤더 업데이트
      this.updateMemberTableHeaders();
    },

    // 인원별 테이블 헤더 업데이트
    updateMemberTableHeaders() {
      // 기본 헤더
      const headers = [
        { text: "조직명", value: "organizationName", width: "280px" }, // 너비 40% 증가
        { text: "인원명", value: "memberName", width: "150px" },
      ];

      // 모임 일자별 헤더 추가
      this.meetingDates.forEach((meeting, index) => {
        const dateObj = moment(meeting.date);
        const dateFormatted = dateObj.format("MM/DD (ddd)");
        headers.push({
          text: `${dateFormatted}\n${meeting.typeName}`,
          value: `meeting_${index}`,
          align: "center",
          width: "120px",
          sortable: false,
        });
      });

      this.memberTableHeaders = headers;
    },

    // 인원별 출결 데이터 준비
    async prepareMemberAttendanceData() {
      console.log(
        "%c🔴🎯 === 인원별 출결 데이터 준비 시작 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );
      const memberMap = new Map();

      try {
        // 모든 조직의 모든 활동을 순회하며 인원 정보 수집
        if (
          !this.attendanceData.meetings ||
          this.attendanceData.meetings.length === 0
        ) {
          console.warn(
            "%c🔴❌ 출결 데이터를 준비할 모임 정보가 없습니다!",
            "color: red; font-size: 14px; background: yellow;"
          );
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          return;
        }

        console.log(
          `%c🔴📊 처리할 조직 수: ${this.attendanceData.meetings.length}개, 모임 날짜 수: ${this.meetingDates.length}개`,
          "color: red; font-size: 14px; font-weight: bold;"
        );

        // 모임 날짜 정보 확인
        if (this.meetingDates.length === 0) {
          console.warn(
            "%c🔴❌ 표시할 모임 날짜 정보가 없습니다!",
            "color: red; font-size: 14px; background: yellow;"
          );
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          return;
        }

        // 출석 데이터가 있는 조직들과 없는 조직들 추적
        const organizationsWithAttendance = new Set();
        const organizationsWithoutAttendance = [];

        // 1단계: 출석 데이터가 있는 조직들 처리
        this.attendanceData.meetings.forEach((orgData) => {
          console.log(
            `조직 ${orgData.organizationName} 처리 시작 - 활동 수: ${
              orgData.activities?.length || 0
            }`
          );

          if (!orgData.activities || orgData.activities.length === 0) {
            console.log(`조직 ${orgData.organizationName}에 활동이 없습니다.`);
            organizationsWithoutAttendance.push(orgData);
            return;
          }

          let orgHasData = false;

          // 각 활동 순회
          orgData.activities.forEach((activity) => {
            if (!activity.instances || activity.instances.length === 0) {
              return;
            }

            // 각 인스턴스 순회
            activity.instances.forEach((instance) => {
              if (
                !instance.start_datetime ||
                !instance.attendances ||
                !Array.isArray(instance.attendances) ||
                instance.attendances.length === 0
              ) {
                return;
              }

              const instanceDate = moment(instance.start_datetime).format(
                "YYYY-MM-DD"
              );

              // 해당 인스턴스가 meetingDates에 있는지 확인 - 더 유연한 매칭
              let meetingIndex = this.meetingDates.findIndex(
                (m) =>
                  m.date === instanceDate && m.type === activity.meetingType
              );

              // 정확한 매칭이 안되면 날짜만으로 매칭 시도
              if (meetingIndex === -1) {
                meetingIndex = this.meetingDates.findIndex(
                  (m) => m.date === instanceDate
                );

                if (meetingIndex !== -1) {
                  console.log(
                    `날짜만으로 매칭됨: ${instanceDate}, 예상 타입: ${activity.meetingType}, 실제 타입: ${this.meetingDates[meetingIndex].type}`
                  );
                }
              }

              // 여전히 매칭되지 않으면 건너뜀
              if (meetingIndex === -1) {
                console.log(
                  `매칭되지 않는 인스턴스 (건너뜀): ${instanceDate}, 타입: ${activity.meetingType}`
                );
                return;
              }

              // 각 출석 정보 처리 - 더 유연한 처리
              instance.attendances.forEach((attendance) => {
                // userId나 userName 중 하나라도 있으면 처리
                const userId =
                  attendance.userId || attendance.user_id || attendance.id;
                const userName =
                  attendance.userName ||
                  attendance.user_name ||
                  attendance.name ||
                  "이름없음";

                if (!userId && !userName) {
                  console.log(
                    "유효한 사용자 정보가 없는 출석 데이터 건너뜀:",
                    attendance
                  );
                  return;
                }

                // userId가 없으면 userName을 키로 사용
                const memberKey = userId
                  ? `${userId}_${orgData.organizationId}`
                  : `${userName}_${orgData.organizationId}`;

                // 새 멤버 정보 생성 또는 기존 정보 가져오기
                let memberData = memberMap.get(memberKey);

                if (!memberData) {
                  memberData = {
                    userId: userId || userName, // userId가 없으면 userName 사용
                    memberName: userName,
                    organizationId: orgData.organizationId,
                    organizationName: orgData.organizationName,
                  };

                  // 모든 모임 날짜에 대해 기본값 'X' 설정
                  this.meetingDates.forEach((_, idx) => {
                    memberData[`meeting_${idx}`] = "X";
                  });
                }

                // 해당 모임의 출석 상태 설정 - 문법 오류 수정
                const status =
                  attendance.status || attendance.attendance_status || "";
                memberData[`meeting_${meetingIndex}`] =
                  status === "출석" ||
                  status === "PRESENT" ||
                  status === "present"
                    ? "O"
                    : "X";

                // 멤버 맵에 저장
                memberMap.set(memberKey, memberData);
                orgHasData = true;
              });
            });
          });

          if (orgHasData) {
            organizationsWithAttendance.add(orgData.organizationId);
            console.log(
              `조직 ${orgData.organizationName}에서 출석 데이터 발견`
            );
          } else {
            console.log(
              `조직 ${orgData.organizationName}에 활동은 있지만 출석 데이터가 없습니다.`
            );
            organizationsWithoutAttendance.push(orgData);
          }
        });

        // 2단계: 출석 데이터가 없는 조직들 처리 - 조직 정보만이라도 표시
        console.log(
          `출석 데이터가 없는 조직 수: ${organizationsWithoutAttendance.length}`
        );

        for (const orgData of organizationsWithoutAttendance) {
          console.log(
            `출석 데이터 없는 조직 처리: ${orgData.organizationName}`
          );

          // 해당 조직에 대한 기본 멤버 정보 생성 (조직 표시용)
          const placeholderKey = `placeholder_${orgData.organizationId}`;

          // 이미 해당 조직의 데이터가 있는지 확인
          const hasExistingMembers = Array.from(memberMap.values()).some(
            (member) => member.organizationId === orgData.organizationId
          );

          if (!hasExistingMembers) {
            // 조직의 회원 목록을 가져오려고 시도
            try {
              console.log(
                `조직 ${orgData.organizationName}의 회원 목록 조회 시도...`
              );

              // 회원 목록 API 호출 시도 (있다면)
              let members = [];
              if (
                this.getOrganizationMembers &&
                typeof this.getOrganizationMembers === "function"
              ) {
                try {
                  const membersResponse = await this.getOrganizationMembers(
                    orgData.organizationId
                  );
                  if (
                    membersResponse &&
                    membersResponse.data &&
                    Array.isArray(membersResponse.data)
                  ) {
                    members = membersResponse.data;
                  } else if (Array.isArray(membersResponse)) {
                    members = membersResponse;
                  }
                  console.log(
                    `조직 ${orgData.organizationName}의 회원 수: ${members.length}명`
                  );
                } catch (memberError) {
                  console.warn(
                    `조직 ${orgData.organizationName}의 회원 목록 조회 실패:`,
                    memberError
                  );
                }
              }

              if (members.length > 0) {
                // 실제 회원이 있는 경우, 각 회원을 추가
                members.forEach((member, index) => {
                  const memberKey = `${
                    member.user_id ||
                    member.id ||
                    `${orgData.organizationId}_${index}`
                  }_${orgData.organizationId}`;
                  const memberName =
                    member.user_name ||
                    member.name ||
                    member.username ||
                    `회원${index + 1}`;

                  const memberData = {
                    userId:
                      member.user_id ||
                      member.id ||
                      `${orgData.organizationId}_${index}`,
                    memberName: memberName,
                    organizationId: orgData.organizationId,
                    organizationName: orgData.organizationName,
                    hasNoAttendanceData: true, // 출석 데이터가 없음을 표시
                  };

                  // 모든 모임 날짜에 대해 'X' 설정
                  this.meetingDates.forEach((_, idx) => {
                    memberData[`meeting_${idx}`] = "X";
                  });

                  memberMap.set(memberKey, memberData);
                });

                console.log(
                  `조직 ${orgData.organizationName}: ${members.length}명의 회원 추가 (출석 데이터 없음)`
                );
              } else {
                // 회원 목록도 없는 경우 플레이스홀더 생성
                const placeholderMember = {
                  userId: `placeholder_${orgData.organizationId}`,
                  memberName: `${orgData.organizationName}`,
                  organizationId: orgData.organizationId,
                  organizationName: orgData.organizationName,
                  isPlaceholder: true, // 플레이스홀더임을 표시
                };

                // 모든 모임 날짜에 대해 'X' 설정
                this.meetingDates.forEach((_, idx) => {
                  placeholderMember[`meeting_${idx}`] = "X";
                });

                memberMap.set(placeholderKey, placeholderMember);
                console.log(`플레이스홀더 생성: ${orgData.organizationName}`);
              }
            } catch (error) {
              console.warn(
                `조직 ${orgData.organizationName} 처리 중 오류:`,
                error
              );

              // 오류 발생 시에도 플레이스홀더는 생성
              const placeholderMember = {
                userId: `placeholder_${orgData.organizationId}`,
                memberName: `${orgData.organizationName}`,
                organizationId: orgData.organizationId,
                organizationName: orgData.organizationName,
                isPlaceholder: true,
              };

              this.meetingDates.forEach((_, idx) => {
                placeholderMember[`meeting_${idx}`] = "X";
              });

              memberMap.set(placeholderKey, placeholderMember);
              console.log(
                `오류로 인한 플레이스홀더 생성: ${orgData.organizationName}`
              );
            }
          }
        }

        // 맵에서 배열로 변환
        this.memberAttendanceData = Array.from(memberMap.values());

        console.log(
          `인원별 출결 데이터 준비 완료: ${this.memberAttendanceData.length}명`
        );
        console.log(
          `출석 데이터가 있는 조직 수: ${organizationsWithAttendance.size}개`
        );

        // 데이터가 있는 조직들 로깅
        const orgNames = this.attendanceData.meetings
          .filter((org) => organizationsWithAttendance.has(org.organizationId))
          .map((org) => org.organizationName);
        console.log("출석 데이터가 있는 조직들:", orgNames);

        // 데이터가 없는 조직들 로깅
        const orgNamesWithoutData = organizationsWithoutAttendance.map(
          (org) => org.organizationName
        );
        console.log("출석 데이터가 없는 조직들:", orgNamesWithoutData);

        // 필터링된 데이터도 초기화 (조직 필터링은 handleOrganizationChange에서 수행)
        this.filteredMemberAttendanceData = [...this.memberAttendanceData];
      } catch (error) {
        console.error("인원별 출결 데이터 준비 중 오류 발생:", error);
        this.memberAttendanceData = [];
        this.filteredMemberAttendanceData = [];
      }
    },

    // 조직 선택 변경 처리
    handleOrganizationChange() {
      console.log(
        "%c🔴🎯 === 조직 선택 변경 처리 시작 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );
      console.log(
        `%c🔴🏢 선택된 조직 ID: ${this.selectedOrganization}`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      // 선택된 조직이 없으면 필터링된 데이터 초기화
      if (!this.selectedOrganization) {
        console.log(
          "%c🔴🔄 선택된 조직 없음, 모든 데이터 표시",
          "color: red; font-size: 14px;"
        );
        this.filteredMemberAttendanceData = [...this.memberAttendanceData];
        console.log(
          `%c🔴📊 필터링된 데이터 수: ${this.filteredMemberAttendanceData.length}명`,
          "color: red; font-size: 14px; font-weight: bold;"
        );
        return;
      }

      // 선택된 조직과 모든 하위 조직의 ID 목록 가져오기
      const selectedOrgIds = this.getSelectedAndChildOrganizationIds(
        this.selectedOrganization
      );
      console.log(
        "%c🔴📋 선택된 조직 및 하위 조직 IDs:",
        "color: red; font-size: 14px; font-weight: bold;",
        selectedOrgIds
      );

      // 선택된 조직 이름 찾기
      const selectedOrgItem = this.organizationSelectItems.find(
        (item) => item.value === this.selectedOrganization
      );
      console.log(
        `%c🔴🏢 선택된 조직 이름: "${selectedOrgItem?.text || "이름 없음"}"`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      // 전체 회원 데이터 확인
      console.log(
        `%c🔴👤 전체 회원 데이터 수: ${this.memberAttendanceData.length}명`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      // 전체 회원 데이터에서 조직별 분포 확인
      const orgDistribution = {};
      this.memberAttendanceData.forEach((member) => {
        if (!orgDistribution[member.organizationId]) {
          orgDistribution[member.organizationId] = {
            name: member.organizationName,
            count: 0,
          };
        }
        orgDistribution[member.organizationId].count++;
      });
      console.log(
        "%c🔴📊 조직별 회원 분포:",
        "color: red; font-size: 14px; font-weight: bold;",
        orgDistribution
      );

      // 데이터가 없으면 빈 배열 반환
      if (
        !this.memberAttendanceData ||
        this.memberAttendanceData.length === 0
      ) {
        console.warn(
          "%c🔴❌ 전체 회원 데이터가 없습니다!",
          "color: red; font-size: 14px; background: yellow;"
        );
        this.filteredMemberAttendanceData = [];
        return;
      }

      // 선택된 조직과 하위 조직에 속한 인원만 필터링
      const filtered = this.memberAttendanceData.filter((member) => {
        const isIncluded = selectedOrgIds.includes(member.organizationId);
        if (isIncluded) {
          console.log(
            `%c🔴✅ 포함된 회원: "${member.memberName}" (조직: ${member.organizationName})`,
            "color: red; font-size: 12px;"
          );
        }
        return isIncluded;
      });

      // 반응성을 위해 새 배열로 할당
      this.filteredMemberAttendanceData = filtered;

      // 최종 결과 로그
      console.log(
        "%c🔴🎯 === 조직 선택 변경 처리 완료 ===",
        "color: red; font-size: 16px; font-weight: bold;"
      );
      console.log(
        `%c🔴📊 필터링된 회원 수: ${this.filteredMemberAttendanceData.length}명`,
        "color: red; font-size: 14px; font-weight: bold;"
      );

      const includedOrgs = [
        ...new Set(filtered.map((m) => m.organizationName)),
      ];
      console.log(
        "%c🔴🏢 포함된 조직들:",
        "color: red; font-size: 14px; font-weight: bold;",
        includedOrgs
      );

      console.log(
        "%c🔴🎉 조직 선택 변경 처리 완전히 완료!",
        "color: red; font-size: 16px; font-weight: bold; background: lightgreen;"
      );
    },

    // 선택된 조직과 모든 하위 조직의 ID 목록 가져오기
    getSelectedAndChildOrganizationIds(orgId) {
      const result = [orgId];

      // 해당 조직 노드 찾기
      const findOrgNode = (nodes, targetId) => {
        for (const node of nodes) {
          if (node.id === targetId) {
            return node;
          }

          if (node.children && node.children.length > 0) {
            const found = findOrgNode(node.children, targetId);
            if (found) return found;
          }
        }

        return null;
      };

      const orgNode = findOrgNode(this.organizationTree, orgId);

      // 하위 조직의 모든 ID 수집
      const collectChildIds = (node) => {
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => {
            result.push(child.id);
            collectChildIds(child);
          });
        }
      };

      if (orgNode) {
        collectChildIds(orgNode);
      }

      return result;
    },

    // 특정 인원의 특정 모임에 대한 출석 여부 반환
    getMemberMeetingAttendance(member, meeting) {
      const meetingKey = `meeting_${this.meetingDates.indexOf(meeting)}`;
      return member[meetingKey] || "X";
    },

    // 특정 조직과 예배 유형에 대한 출석 여부 반환 (테이블 셀용)
    getAttendanceStatus(item, meetingType) {
      return item[meetingType] || "X";
    },

    // 로딩 재시도 메서드
    retryLoading() {
      this.isLoading = true;
      this.loadingProgress = 0;
      this.loadingError = null;
      this.loadingStepText = "데이터 로딩 중...";
      this.loadingDetails = null;
      this.initializeDashboard();
    },

    // 날짜 범위 적용 메서드
    applyDateRange() {
      // 날짜 범위 유효성 검사
      const startDate = moment(this.dateRange.start);
      const endDate = moment(this.dateRange.end);

      if (!startDate.isValid() || !endDate.isValid()) {
        alert("유효한 날짜를 입력해주세요.");
        return;
      }

      if (startDate.isAfter(endDate)) {
        alert("시작일은 종료일보다 이전이어야 합니다.");
        return;
      }

      // 날짜 범위 로깅
      console.log(
        `선택된 날짜 범위: ${startDate.format("YYYY-MM-DD")} ~ ${endDate.format(
          "YYYY-MM-DD"
        )}`
      );

      // 범위가 너무 큰 경우 경고 (선택사항)
      const daysDiff = endDate.diff(startDate, "days");
      if (daysDiff > 60) {
        console.warn(
          `주의: 선택한 날짜 범위가 매우 큽니다 (${daysDiff}일). 성능에 영향을 줄 수 있습니다.`
        );
      }

      // 기간 선택 알림
      this.$root.$emit("showSnackbar", {
        text: `${startDate.format("YYYY년 MM월 DD일")}부터 ${endDate.format(
          "YYYY년 MM월 DD일"
        )}까지의 데이터를 필터링합니다.`,
        color: "info",
        timeout: 3000,
      });

      // 원본 데이터가 있으면 필터링만 수행, 없으면 전체 데이터 로드
      if (this.originalMeetingsData && this.originalMeetingsData.length > 0) {
        // 로딩 상태 표시
        this.isLoading = true;
        this.loadingStepText = "데이터 필터링 중...";

        // 비동기 처리로 UI 업데이트 및 데이터 필터링 분리
        setTimeout(() => {
          try {
            console.log(
              `원본 데이터에서 필터링: ${this.originalMeetingsData.length}개 조직`
            );

            // 필터링 수행
            this.filterData();

            // 약간의 지연 후 로딩 상태 해제 (UI 업데이트 보장)
            setTimeout(() => {
              this.isLoading = false;

              // 결과 확인
              if (this.meetingDates.length === 0) {
                console.warn(
                  "필터링 후 표시할 모임 날짜가 없습니다. 날짜 범위를 확인해주세요."
                );
                this.$root.$emit("showSnackbar", {
                  text: "선택한 기간에 해당하는 모임 데이터가 없습니다.",
                  color: "warning",
                  timeout: 3000,
                });
              }
            }, 100);
          } catch (error) {
            console.error("데이터 필터링 중 오류 발생:", error);
            this.isLoading = false;
            this.$root.$emit("showSnackbar", {
              text: "데이터 필터링 중 오류가 발생했습니다.",
              color: "error",
              timeout: 3000,
            });
          }
        }, 0);
      } else {
        // 원본 데이터가 없으면 전체 데이터 로드
        console.log("원본 데이터 없음, 전체 데이터 로드 진행");
        this.initializeDashboard();
      }
    },

    // 대시보드 데이터 새로 불러오기 (전체 데이터 업데이트)
    refreshDashboardData() {
      console.log("전체 데이터 업데이트 시작");
      this.isLoading = true;
      this.isDataCached = false; // 캐시 무효화
      this.cachedMeetings = []; // 캐시 데이터 초기화
      this.loadingStepText = "전체 데이터 새로 불러오는 중...";
      this.initializeDashboard();
    },

    // 클라이언트 측 필터링 및 테이블 재생성
    async filterData() {
      console.log("데이터 필터링 시작");

      // 단기 결석자 위험군 데이터 초기화
      this.absenceRiskData = {};

      try {
        // 선택된 날짜 범위 확인 - 정확한 시작/종료일 설정
        const startDate = moment(this.dateRange.start).startOf("day");
        const endDate = moment(this.dateRange.end).endOf("day"); // 종료일은 해당 일의 끝(23:59:59)까지 포함
        console.log(
          `필터링 날짜 범위: ${startDate.format(
            "YYYY-MM-DD HH:mm:ss"
          )} ~ ${endDate.format("YYYY-MM-DD HH:mm:ss")}`
        );

        // 원본 데이터가 있는지 확인
        if (
          !this.originalMeetingsData ||
          this.originalMeetingsData.length === 0
        ) {
          console.warn("필터링할 원본 데이터가 없습니다.");
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          this.meetingDates = [];
          return;
        }

        // 원본 데이터를 깊은 복사하여 필터링 수행 (원본 보존)
        const filteredMeetings = JSON.parse(
          JSON.stringify(this.originalMeetingsData)
        );

        // 날짜 범위에 맞게 필터링
        let totalInstancesBefore = 0;
        let totalInstancesAfter = 0;
        let filteredDates = [];

        filteredMeetings.forEach((orgData) => {
          if (orgData.activities && orgData.activities.length > 0) {
            orgData.activities.forEach((activity) => {
              if (activity.instances && activity.instances.length > 0) {
                // 필터링 전 인스턴스 수 집계
                totalInstancesBefore += activity.instances.length;

                // 날짜 범위 내 인스턴스만 필터링
                activity.instances = activity.instances.filter((instance) => {
                  if (!instance.start_datetime) {
                    console.log("날짜 정보가 없는 인스턴스 건너뜀");
                    return false;
                  }

                  // 날짜 파싱 - 여러 형식 지원하고 오류 허용
                  let instanceDate = moment(instance.start_datetime);

                  // 파싱 실패 시 다른 형식으로 시도
                  if (!instanceDate.isValid()) {
                    instanceDate = moment(instance.start_datetime, [
                      "YYYY-MM-DD",
                      "YYYY-MM-DD HH:mm:ss",
                      "YYYY/MM/DD",
                      "MM/DD/YYYY",
                    ]);
                  }

                  // 여전히 유효하지 않으면 건너뜀 (하지만 경고만 표시)
                  if (!instanceDate.isValid()) {
                    console.warn(
                      "유효하지 않은 날짜 (건너뜀):",
                      instance.start_datetime
                    );
                    return false;
                  }

                  // 정확한 비교를 위해 날짜만 비교
                  instanceDate = instanceDate.startOf("day");
                  const dateStr = instanceDate.format("YYYY-MM-DD");

                  // 날짜 범위 비교 - inclusive
                  const isInRange =
                    instanceDate.isSameOrAfter(startDate) &&
                    instanceDate.isSameOrBefore(endDate);

                  if (isInRange) {
                    filteredDates.push(dateStr);
                    if (instance.attendances) {
                      console.log(
                        `포함된 인스턴스: ${dateStr}, 참석자: ${instance.attendances.length}명`
                      );
                    }
                  }

                  return isInRange;
                });

                // 필터링된 인스턴스 수 집계
                totalInstancesAfter += activity.instances.length;
              }
            });

            // 인스턴스가 없는 활동 제거
            orgData.activities = orgData.activities.filter(
              (activity) => activity.instances && activity.instances.length > 0
            );
          }
        });

        // 활동이 없는 조직 제거
        const finalFilteredMeetings = filteredMeetings.filter(
          (orgData) => orgData.activities && orgData.activities.length > 0
        );

        // 필터링된 데이터를 attendanceData에 설정
        this.attendanceData.meetings = finalFilteredMeetings;

        // 필터링 결과 요약
        console.log(
          `필터링 결과: 전체 ${totalInstancesBefore}개 중 ${totalInstancesAfter}개 인스턴스 포함`
        );
        console.log(
          `포함된 날짜: ${[...new Set(filteredDates)].sort().join(", ")}`
        );

        // 테이블 데이터 재구성 (중요)
        console.log(
          "%c🔴🎯 === 테이블 데이터 재구성 시작 ===",
          "color: red; font-size: 16px; font-weight: bold;"
        );

        this.prepareMeetingDates();
        console.log(
          "%c🔴✅ prepareMeetingDates 완료",
          "color: red; font-size: 14px;"
        );

        this.prepareOrganizationSelectItems();
        console.log(
          "%c🔴✅ prepareOrganizationSelectItems 완료",
          "color: red; font-size: 14px;"
        );

        await this.prepareMemberAttendanceData();
        console.log(
          "%c🔴✅ prepareMemberAttendanceData 완료",
          "color: red; font-size: 14px;"
        );

        console.log(
          "%c🔴🎯 === 테이블 데이터 재구성 완료 ===",
          "color: red; font-size: 16px; font-weight: bold;"
        );
        console.log(
          `%c🔴📊 재구성 후 상태:`,
          "color: red; font-size: 14px; font-weight: bold;"
        );
        console.log(
          `%c🔴📅   meetingDates: ${this.meetingDates.length}개`,
          "color: red; font-size: 13px;"
        );
        console.log(
          `%c🔴🏢   organizationSelectItems: ${this.organizationSelectItems.length}개`,
          "color: red; font-size: 13px;"
        );
        console.log(
          `%c🔴👤   memberAttendanceData: ${this.memberAttendanceData.length}명`,
          "color: red; font-size: 13px;"
        );

        // 조직 선택 적용 - 더 안전한 처리
        console.log(
          "%c🔴🎯 === 조직 선택 초기화 시작 ===",
          "color: red; font-size: 15px; font-weight: bold;"
        );
        console.log(
          `%c🔴🏢 현재 선택된 조직: ${this.selectedOrganization}`,
          "color: red; font-size: 14px;"
        );
        console.log(
          `%c🔴📊 사용 가능한 조직 수: ${this.organizationSelectItems.length}개`,
          "color: red; font-size: 14px;"
        );

        if (this.organizationSelectItems.length > 0) {
          // 현재 선택된 조직이 유효한지 확인
          const isCurrentSelectionValid =
            this.selectedOrganization &&
            this.organizationSelectItems.some(
              (item) => item.value === this.selectedOrganization
            );

          if (isCurrentSelectionValid) {
            // 이전 선택 유지
            console.log(
              `%c🔴✅ 이전 조직 선택 유지: ${this.selectedOrganization}`,
              "color: red; font-size: 14px;"
            );
            this.handleOrganizationChange();
          } else {
            // 기본 조직 선택 (첫 번째 조직)
            this.selectedOrganization = this.organizationSelectItems[0].value;
            console.log(
              `%c🔴🔄 기본 조직 선택: ${this.selectedOrganization} (${this.organizationSelectItems[0].text})`,
              "color: red; font-size: 14px;"
            );
            this.handleOrganizationChange();
          }
        } else {
          console.warn(
            "%c🔴❌ 선택 가능한 조직이 없습니다!",
            "color: red; font-size: 14px; background: yellow;"
          );
          this.selectedOrganization = null;
          this.filteredMemberAttendanceData = [];
        }

        console.log(
          `%c🔴🎉 필터링 완료: 전체 ${this.memberAttendanceData.length}명 중 ${this.filteredMemberAttendanceData.length}명 표시`,
          "color: red; font-size: 14px; font-weight: bold; background: lightgreen;"
        );
      } catch (error) {
        console.error(
          "%c🔴💥 데이터 필터링 중 치명적 오류:",
          "color: red; font-size: 14px; font-weight: bold; background: pink;",
          error
        );
        // 오류 발생 시 원본 데이터라도 사용
        if (this.originalMeetingsData && this.originalMeetingsData.length > 0) {
          console.log(
            "%c🔴🔄 오류로 인해 원본 데이터 사용 시도",
            "color: red; font-size: 14px;"
          );
          this.attendanceData.meetings = JSON.parse(
            JSON.stringify(this.originalMeetingsData)
          );
          this.prepareMeetingDates();
          this.prepareOrganizationSelectItems();
          await this.prepareMemberAttendanceData();
        }
      }
    },

    // 조직 ID에 대한 경로 찾기
    findOrganizationPath(orgId) {
      // flattenedOrganizations에서 해당 ID를 찾아 경로 반환
      const org = this.flattenedOrganizations.find((o) => o.id === orgId);
      if (org) {
        return {
          pathNames: org.path || [],
          pathIds: org.pathIds || [],
          level: org.level || 0,
        };
      }

      // 찾지 못한 경우 기본값 반환
      return {
        pathNames: [],
        pathIds: [],
        level: 0,
      };
    },

    // 모임 유형 식별 함수
    identifyMeetingType(activityName) {
      activityName = activityName.toLowerCase();

      // 모임 유형 분류 로직
      if (
        activityName.includes("주일") &&
        (activityName.includes("2부") || activityName.includes("2 부"))
      ) {
        return "SUNDAY_SERVICE_2";
      } else if (
        activityName.includes("주일") &&
        (activityName.includes("3부") || activityName.includes("3 부"))
      ) {
        return "SUNDAY_SERVICE_3";
      } else if (
        activityName.includes("청년") &&
        activityName.includes("예배")
      ) {
        return "YOUTH_SERVICE";
      } else if (
        activityName.includes("수요") &&
        activityName.includes("예배")
      ) {
        return "WEDNESDAY_SERVICE";
      } else if (
        activityName.includes("금요") &&
        activityName.includes("예배")
      ) {
        return "FRIDAY_SERVICE";
      } else if (
        activityName.includes("수요") &&
        (activityName.includes("기도") || activityName.includes("제자"))
      ) {
        return "WEDNESDAY_PRAYER";
      } else if (
        activityName.includes("치유") &&
        (activityName.includes("팀") || activityName.includes("사역"))
      ) {
        return "HEALING_MINISTRY";
      } else {
        return "OTHER";
      }
    },

    // 로딩 진행 상태 업데이트 메서드
    updateLoadingProgress() {
      this.completedOperations++;
      this.loadingProgress = Math.round(
        (this.completedOperations / this.loadingOperations) * 100
      );

      // 로딩이 완료되면 잠시 후 로딩 인디케이터를 닫음
      if (this.completedOperations >= this.loadingOperations) {
        // 100%에 도달한 후 0.5초 후에 로딩 상태 해제
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },

    // 빠른 날짜 범위 설정 메서드
    setDateRange(rangeType) {
      const today = moment();
      let startDate = null;
      let endDate = null;

      this.selectedDateRangeOption = rangeType;

      switch (rangeType) {
        case "today":
          startDate = today.clone();
          endDate = today.clone();
          break;
        case "thisWeek":
          // 일요일부터 토요일까지를 한 주로 설정
          startDate = today.clone().startOf("week"); // 일요일
          endDate = startDate.clone().add(6, "days"); // 토요일
          break;
        case "lastWeek":
          // 지난 주 일요일부터 토요일까지
          startDate = today.clone().subtract(1, "week").startOf("week"); // 지난 주 일요일
          endDate = startDate.clone().add(6, "days"); // 지난 주 토요일
          break;
        case "last7Days":
          startDate = today.clone().subtract(6, "days");
          endDate = today.clone();
          break;
        case "last30Days":
          startDate = today.clone().subtract(29, "days");
          endDate = today.clone();
          break;
        case "thisMonth":
          startDate = today.clone().startOf("month");
          endDate = today.clone().endOf("month");
          break;
        case "lastMonth":
          startDate = today.clone().subtract(1, "month").startOf("month");
          endDate = today.clone().subtract(1, "month").endOf("month");
          break;
        default:
          // 기본값: 최근 7일
          startDate = today.clone().subtract(6, "days");
          endDate = today.clone();
      }

      // 날짜 설정
      this.dateRange.start = startDate.format("YYYY-MM-DD");
      this.dateRange.end = endDate.format("YYYY-MM-DD");

      // 정보 메시지 출력
      this.$root.$emit("showSnackbar", {
        text: `${startDate.format("YYYY년 MM월 DD일")}부터 ${endDate.format(
          "YYYY년 MM월 DD일"
        )}까지의 데이터를 필터링합니다.`,
        color: "info",
        timeout: 3000,
      });

      // 자동으로 데이터 조회 실행
      this.applyDateRange();
    },

    // 엑셀 내보내기 함수
    async downloadExcelData() {
      if (this.isExporting || this.filteredMemberAttendanceData.length === 0) {
        return;
      }

      try {
        this.isExporting = true;

        // 1. 새 워크북 생성
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "코람데오 출결 시스템";
        workbook.lastModifiedBy = "관리자";
        workbook.created = new Date();
        workbook.modified = new Date();

        // 2. 출석 데이터 시트 생성
        const attendanceSheet = workbook.addWorksheet("인원별 출결 현황", {
          properties: { tabColor: { argb: "4285F4" } },
        });

        // 3. 헤더 추가
        const headers = this.memberTableHeaders.map((header) => header.text);
        attendanceSheet.addRow(headers);

        // 헤더 스타일 설정
        attendanceSheet.getRow(1).font = { bold: true, size: 12 };
        attendanceSheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E0E0E0" },
        };
        attendanceSheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        // 4. 데이터 추가
        this.filteredMemberAttendanceData.forEach((member) => {
          const rowData = [];

          // 기본 정보 (인원명, 조직명)
          rowData.push(member.memberName);
          rowData.push(member.organizationName);

          // 출석 정보 추가
          this.meetingDates.forEach((_, index) => {
            const meetingKey = `meeting_${index}`;
            rowData.push(member[meetingKey] || "");
          });

          attendanceSheet.addRow(rowData);
        });

        // 5. 열 너비 자동 조정
        attendanceSheet.columns.forEach((column, i) => {
          if (i < 2) {
            // 이름과 조직명은 적당한 너비로 설정
            column.width = i === 0 ? 15 : 25;
          } else {
            // 출석 데이터는 좀 더 좁게 설정
            column.width = 12;
          }

          // 데이터 정렬 설정
          if (i >= 2) {
            // 출석 데이터 열은 중앙 정렬
            column.alignment = { horizontal: "center" };
          }
        });

        // 6. 셀 스타일 적용
        for (
          let i = 2;
          i <= this.filteredMemberAttendanceData.length + 1;
          i++
        ) {
          const row = attendanceSheet.getRow(i);

          // 각 출석 셀에 배경색 설정
          for (let j = 3; j <= headers.length; j++) {
            const cell = row.getCell(j);
            if (cell.value === "O") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "DDFFDD" }, // 연한 녹색 (출석)
              };
            } else if (cell.value === "X") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDDDD" }, // 연한 빨강색 (결석)
              };
            }
          }
        }

        // 7. 통계 시트 추가
        const statsSheet = workbook.addWorksheet("출석 통계", {
          properties: { tabColor: { argb: "DB4437" } },
        });

        // 기본 통계 정보
        statsSheet.addRow([
          "조회 기간",
          `${this.formattedStartDate} ~ ${this.formattedEndDate}`,
        ]);
        statsSheet.addRow([
          "데이터 생성 시간",
          moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
        ]);
        statsSheet.addRow([
          "전체 인원 수",
          this.filteredMemberAttendanceData.length + "명",
        ]);
        statsSheet.addRow(["모임 일자 수", this.meetingDates.length + "회"]);
        statsSheet.addRow([]);

        // 각 모임별 출석률 통계
        statsSheet.addRow(["모임 날짜별 출석 현황"]);
        statsSheet.addRow([
          "날짜",
          "모임명",
          "출석 인원",
          "전체 인원",
          "출석률",
        ]);

        // 모임별 통계 계산
        this.meetingDates.forEach((meeting, index) => {
          const meetingKey = `meeting_${index}`;
          let presentCount = 0;
          let totalCount = 0;

          this.filteredMemberAttendanceData.forEach((member) => {
            if (member[meetingKey]) {
              totalCount++;
              if (member[meetingKey] === "O") {
                presentCount++;
              }
            }
          });

          const dateFormatted = moment(meeting.date).format("YYYY-MM-DD");
          const attendanceRate =
            totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

          statsSheet.addRow([
            dateFormatted,
            meeting.typeName,
            presentCount + "명",
            totalCount + "명",
            attendanceRate + "%",
          ]);
        });

        // 통계 시트 스타일링
        statsSheet.getRow(1).font = { bold: true };
        statsSheet.getRow(2).font = { bold: true };
        statsSheet.getRow(3).font = { bold: true };
        statsSheet.getRow(4).font = { bold: true };
        statsSheet.getRow(6).font = { bold: true };
        statsSheet.getRow(7).font = { bold: true };
        statsSheet.getRow(7).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E0E0E0" },
        };

        // 통계 시트 열 너비 설정
        statsSheet.columns.forEach((column, i) => {
          if (i === 0) column.width = 20;
          else if (i === 1) column.width = 25;
          else column.width = 15;
        });

        // 8. 엑셀 파일 생성 및 다운로드
        const buffer = await workbook.xlsx.writeBuffer();
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const fileName = `코람데오_출결현황_${moment().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;

        const blob = new Blob([buffer], { type: fileType });
        saveAs(blob, fileName);

        console.log("엑셀 파일 생성 완료:", fileName);
      } catch (error) {
        console.error("엑셀 파일 생성 중 오류 발생:", error);
        // 오류 알림 표시 (선택적)
        alert("엑셀 파일 생성 중 오류가 발생했습니다.");
      } finally {
        this.isExporting = false;
      }
    },

    // 단기 결석자 위험군 목록 가져오기 (예배 유형별)
    getAbsenceRiskMembers(worshipType) {
      // 캐시된 데이터가 있으면 반환
      if (this.absenceRiskData[worshipType]) {
        return this.absenceRiskData[worshipType];
      }

      // 결과를 저장할 배열
      const riskMembers = [];

      // 데이터가 준비되지 않았으면 빈 배열 반환
      if (
        !this.memberAttendanceData ||
        this.memberAttendanceData.length === 0 ||
        !this.meetingDates ||
        this.meetingDates.length === 0
      ) {
        return [];
      }

      try {
        // 해당 예배 유형의 모임 날짜 필터링
        const typeMeetings = this.meetingDates
          .filter((meeting) => meeting.type === worshipType)
          .sort((a, b) => moment(a.date).diff(moment(b.date))); // 날짜순 정렬

        if (typeMeetings.length < 2) {
          // 모임이 2회 미만이면 연속 결석 판단 불가
          return [];
        }

        // 각 인원별 출석 패턴 분석
        this.memberAttendanceData.forEach((member) => {
          // 각 모임별 출석 여부 추출
          const attendanceHistory = typeMeetings.map((meeting, idx) => {
            const meetingKey = `meeting_${this.meetingDates.indexOf(meeting)}`;
            return {
              date: meeting.date,
              attended: member[meetingKey] === "O",
              index: idx,
            };
          });

          // 마지막 출석 및 연속 결석 계산
          let lastAttendanceIdx = -1;
          for (let i = attendanceHistory.length - 1; i >= 0; i--) {
            if (attendanceHistory[i].attended) {
              lastAttendanceIdx = i;
              break;
            }
          }

          // 연속 결석 판단
          const consecutiveAbsences =
            lastAttendanceIdx === -1
              ? attendanceHistory.length // 모든 모임 결석
              : attendanceHistory.length - 1 - lastAttendanceIdx; // 마지막 출석 이후 결석 횟수

          // 마지막 출석일 계산
          let lastAttendanceDate = "없음";
          if (lastAttendanceIdx >= 0) {
            lastAttendanceDate = moment(
              attendanceHistory[lastAttendanceIdx].date
            ).format("YYYY-MM-DD");
          }

          // 한 번이라도 참석한 기록이 있고, 최근 1주 또는 2주 연속 결석한 경우만 추가 (3주 이상은 장기결석자)
          if (
            lastAttendanceIdx >= 0 &&
            consecutiveAbsences >= 1 &&
            consecutiveAbsences <= 2
          ) {
            riskMembers.push({
              memberName: member.memberName,
              organizationName: member.organizationName,
              userId: member.userId,
              organizationId: member.organizationId,
              continuousAbsence: consecutiveAbsences,
              lastAttendance: lastAttendanceDate,
              totalMeetings: attendanceHistory.length,
            });
          }
        });

        // 연속 결석 기간이 긴 순서대로 정렬
        riskMembers.sort((a, b) => b.continuousAbsence - a.continuousAbsence);

        // 결과 캐싱
        this.absenceRiskData[worshipType] = riskMembers;

        return riskMembers;
      } catch (error) {
        console.error(`위험군 계산 중 오류 발생 (${worshipType}):`, error);
        return [];
      }
    },

    // 결석 기간에 따른 색상 반환
    getAbsenceColor(weeks) {
      if (weeks > 2) return "deep-orange"; // 장기결석자 (3주 이상) - 주황색(경고)
      if (weeks == 2) return "amber darken-2"; // 2주 결석자 - 노란색(주의)
      return "light-blue"; // 1주 결석자 - 파란색(정보)
    },

    // 인원 연락처 호출 핸들러
    contactMember(member) {
      console.log("인원 연락:", member);
      // 실제 구현에서는 연락처 정보 표시 또는 전화 연결 기능 구현
      alert(`${member.memberName} 인원에게 연락하기`);
    },

    // 인원 메시지 전송 핸들러
    sendMessage(member) {
      console.log("인원 메시지:", member);
      // 실제 구현에서는 메시지 작성 및 전송 기능 구현
      alert(`${member.memberName} 인원에게 메시지 보내기`);
    },

    // 위험군 데이터 초기화 (데이터 업데이트 시 호출)
    resetAbsenceRiskData() {
      this.absenceRiskData = {};
    },

    // 예배 유형별 단기결석자 수 반환 (1주, 2주 별도)
    getAbsenceRiskCount(worshipType) {
      const riskMembers = this.getAbsenceRiskMembers(worshipType);
      const oneWeekAbsent = riskMembers.filter(
        (member) => member.continuousAbsence === 1
      ).length;
      const twoWeekAbsent = riskMembers.filter(
        (member) => member.continuousAbsence === 2
      ).length;

      return {
        oneWeekAbsent,
        twoWeekAbsent,
        total: oneWeekAbsent + twoWeekAbsent,
      };
    },

    // 출석률 차트에 표시할 전체 단기결석자 통계 반환
    getAbsenteeStats() {
      if (this.meetingDates.length === 0) {
        return { oneWeekAbsent: 0, twoWeekAbsent: 0, total: 0 };
      }

      // 현재 표시 중인 예배 유형들
      const displayedTypes = [...new Set(this.meetingDates.map((m) => m.type))];

      // 각 예배 유형별 집계 합산
      let oneWeekTotal = 0;
      let twoWeekTotal = 0;

      displayedTypes.forEach((type) => {
        const stats = this.getAbsenceRiskCount(type);
        oneWeekTotal += stats.oneWeekAbsent;
        twoWeekTotal += stats.twoWeekAbsent;
      });

      return {
        oneWeekAbsent: oneWeekTotal,
        twoWeekAbsent: twoWeekTotal,
        total: oneWeekTotal + twoWeekTotal,
      };
    },

    // 저장된 테마 설정 불러오기
    loadSavedTheme() {
      const savedTheme = localStorage.getItem("dashboardTheme");
      if (savedTheme) {
        this.isDarkTheme = savedTheme === "dark";
      } else {
        // 저장된 설정이 없으면 다크 테마를 기본값으로 설정하고 저장
        localStorage.setItem("dashboardTheme", "dark");
      }
    },
  },
  beforeDestroy() {
    // 컴포넌트 제거 시 햄버거 버튼 원래 상태로 복원
    this.$root.$emit("dashboard-menu-state", {
      disabled: false,
      closed: false,
    });

    // 대시보드 활성화 클래스 제거
    document.body.classList.remove("dashboard-active");

    // 모든 이벤트 처리가 완료될 시간을 주기 위해 짧은 타임아웃 설정
    setTimeout(() => {
      // 클래스가 여전히 남아있는지 확인
      if (document.body.classList.contains("dashboard-active")) {
        document.body.classList.remove("dashboard-active");
      }
    }, 100);
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/dashboard.scss";
</style>
