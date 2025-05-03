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
            outlined
            dense
            class="password-input"
            prepend-inner-icon="mdi-key"
            @click:append="showPassword = !showPassword"
            @keyup.enter="verifyPassword"
            autofocus
            :error="passwordError"
            :error-messages="passwordErrorMessage"
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

              <div v-if="lastDataUpdateTime" class="update-time">
                <v-icon small class="mr-1">mdi-update</v-icon>
                마지막 갱신: {{ lastDataUpdateTime }}
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
                    <div class="font-weight-medium">{{ item.memberName }}</div>
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
import AttendanceChartSection from "@/components/admin/dashboard/AttendanceChartSection.vue";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

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
      loadingOperations: 4, // 주요 작업 4개로 변경
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

      // 데이터 캐싱 관련
      isDataCached: false,
      cachedMeetings: [], // 전체 모임 데이터 캐시
      lastDataUpdateTime: null, // 마지막 데이터 업데이트 시간

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
      this.loadingOperations = 4; // 주요 작업 4개로 변경
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
        this.loadingProgress = 25;

        // 데이터가 캐시되어 있지 않거나 새로고침 요청인 경우만 API에서 데이터 가져오기
        if (
          !this.isDataCached ||
          !this.cachedMeetings ||
          this.cachedMeetings.length === 0
        ) {
          // 2. 모임 정보 로딩
          this.loadingStepText = "모임 정보 불러오는 중...";
          this.loadingDetails = "각 조직의 모임 정보를 불러오고 있습니다";
          await this.fetchAllMeetings();
          this.loadingProgress = 50;

          // 3. 출석 데이터 로딩
          this.loadingStepText = "출석 데이터 불러오는 중...";
          this.loadingDetails = "모임별 출석 정보를 처리하고 있습니다";
          await this.fetchAllAttendanceData();
          this.loadingProgress = 75;

          // 캐시 저장
          this.cachedMeetings = JSON.parse(
            JSON.stringify(this.attendanceData.meetings)
          );
          this.isDataCached = true;
          this.lastDataUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          console.log("캐시 데이터 저장 완료:", this.cachedMeetings.length);
        } else {
          // 캐시된 데이터 사용
          this.loadingStepText = "캐시된 데이터 처리 중...";
          this.loadingDetails = "저장된 데이터를 필터링하고 있습니다";
          console.log("캐시 데이터 사용:", this.cachedMeetings.length);
          this.attendanceData.meetings = JSON.parse(
            JSON.stringify(this.cachedMeetings)
          );
          this.loadingProgress = 75;
        }

        // 4. 데이터 테이블 준비
        this.loadingStepText = "데이터 테이블 생성 중...";
        this.loadingDetails = "출석 데이터 테이블을 준비하고 있습니다";
        this.filterData();

        // 기본 조직 선택 (filterData에서 처리되므로 여기선 생략)
        this.loadingStepText = "데이터 로딩 완료!";
        this.loadingDetails = "대시보드를 준비하고 있습니다";
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

        // 모든 조직 데이터 사용
        this.organizations = organizations;
        this.updateLoadingProgress();
      } catch (error) {
        console.error("조직 정보 가져오기 오류:", error);
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
      this.attendanceData.meetings = []; // 기존 데이터 초기화

      const totalOrganizations = this.organizations.length;
      let processedCount = 0;

      // 세부 진행률 계산 함수
      const updateDetailedProgress = (current, total) => {
        // 25%에서 50%까지의 진행률 계산
        const baseProgress = 25;
        const maxProgress = 50;
        const additionalProgress = Math.round(
          (current / total) * (maxProgress - baseProgress)
        );
        this.loadingProgress = baseProgress + additionalProgress;
      };

      // 모든 조직의 모임 데이터를 하나씩 가져오기
      for (const org of this.organizations) {
        try {
          processedCount++;
          const progressPercent = Math.round(
            (processedCount / totalOrganizations) * 100
          );
          this.loadingDetails = `조직 정보 처리 중 (${processedCount}/${totalOrganizations}, ${progressPercent}%): ${org.organization_name}`;

          // 세부 진행률 업데이트
          updateDetailedProgress(processedCount, totalOrganizations);

          // 조직 경로 찾기
          const orgPath = this.findOrganizationPath(org.id);

          // API에서 모임 정보 가져오기
          const response = await this.getOrganizationActivities(org.id, true);

          // 응답 데이터 처리
          let activities = [];
          if (
            response &&
            response.activities &&
            Array.isArray(response.activities)
          ) {
            activities = response.activities;
          } else if (Array.isArray(response)) {
            activities = response;
          } else {
            continue; // 처리할 수 없는 형식일 경우 건너뜀
          }

          // 활동 개수 로깅
          console.log(
            `조직 ${org.organization_name}의 활동 수: ${activities.length}`
          );

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
                `활동 "${
                  activity.name || "이름 없음"
                }"의 인스턴스 날짜: ${instanceDates.join(", ")}`
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
          }
        } catch (error) {
          console.error(
            `${org.organization_name}의 모임 정보 가져오기 실패:`,
            error
          );
        }
      }

      this.loadingDetails = "모임 데이터 구조화 중...";
      this.updateLoadingProgress();
    },

    // 모든 모임의 출석 데이터 가져오기
    async fetchAllAttendanceData() {
      const totalOrgs = this.attendanceData.meetings.length;
      let processedOrgs = 0;

      // 출석 데이터 로딩의 세부 진행률 계산 (50%에서 시작하여 75%까지 진행)
      const updateDetailedProgress = (current, total) => {
        const baseProgress = 50;
        const maxProgress = 75;
        const additionalProgress = Math.round(
          (current / total) * (maxProgress - baseProgress)
        );
        this.loadingProgress = baseProgress + additionalProgress;
      };

      // 모든 모임을 순회하며 출석 데이터 처리
      for (const orgData of this.attendanceData.meetings) {
        processedOrgs++;
        const progressPercent = Math.round((processedOrgs / totalOrgs) * 100);
        this.loadingDetails = `출석 데이터 처리 중 (${processedOrgs}/${totalOrgs}, ${progressPercent}%): ${orgData.organizationName}`;

        // 세부 진행률 업데이트
        updateDetailedProgress(processedOrgs, totalOrgs);

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

      this.updateLoadingProgress();
      console.log("모든 출석 데이터 로딩 완료");
    },

    // 조직 선택 드롭다운 아이템 준비
    prepareOrganizationSelectItems() {
      this.organizationSelectItems = this.flattenedOrganizations.map((org) => {
        // 들여쓰기를 위한 공백 추가
        const indent = "　".repeat(org.level);
        return {
          text: `${indent}${org.organization_name}`,
          value: org.id,
        };
      });
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
    prepareMemberAttendanceData() {
      console.log("인원별 출결 데이터 준비 시작");
      const memberMap = new Map();

      try {
        // 모든 조직의 모든 활동을 순회하며 인원 정보 수집
        if (
          !this.attendanceData.meetings ||
          this.attendanceData.meetings.length === 0
        ) {
          console.warn("출결 데이터를 준비할 모임 정보가 없습니다.");
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          return;
        }

        console.log(
          `조직 수: ${this.attendanceData.meetings.length}, 모임 날짜 수: ${this.meetingDates.length}`
        );

        // 모임 날짜 정보 확인
        if (this.meetingDates.length === 0) {
          console.warn("표시할 모임 날짜 정보가 없습니다.");
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          return;
        }

        // 모든 조직 순회
        this.attendanceData.meetings.forEach((orgData) => {
          if (!orgData.activities || orgData.activities.length === 0) {
            return;
          }

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
                !Array.isArray(instance.attendances)
              ) {
                return;
              }

              const instanceDate = moment(instance.start_datetime).format(
                "YYYY-MM-DD"
              );

              // 해당 인스턴스가 meetingDates에 있는지 확인
              const meetingIndex = this.meetingDates.findIndex(
                (m) =>
                  m.date === instanceDate && m.type === activity.meetingType
              );

              if (meetingIndex === -1) {
                return; // 매칭되는 모임이 없으면 건너뜀
              }

              // 각 출석 정보 처리
              instance.attendances.forEach((attendance) => {
                if (!attendance.userId || !attendance.userName) {
                  return;
                }

                const userId = attendance.userId;
                const memberKey = `${userId}_${orgData.organizationId}`;

                // 새 멤버 정보 생성 또는 기존 정보 가져오기
                let memberData = memberMap.get(memberKey);

                if (!memberData) {
                  memberData = {
                    userId,
                    memberName: attendance.userName,
                    organizationId: orgData.organizationId,
                    organizationName: orgData.organizationName,
                  };

                  // 모든 모임 날짜에 대해 기본값 'X' 설정
                  this.meetingDates.forEach((_, idx) => {
                    memberData[`meeting_${idx}`] = "X";
                  });
                }

                // 해당 모임의 출석 상태 설정
                memberData[`meeting_${meetingIndex}`] =
                  attendance.status === "출석" ? "O" : "X";

                // 멤버 맵에 저장
                memberMap.set(memberKey, memberData);
              });
            });
          });
        });

        // 맵에서 배열로 변환
        this.memberAttendanceData = Array.from(memberMap.values());

        console.log(
          `인원별 출결 데이터 준비 완료: ${this.memberAttendanceData.length}명`
        );

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
      console.log("조직 선택 변경:", this.selectedOrganization);

      // 선택된 조직이 없으면 필터링된 데이터 초기화
      if (!this.selectedOrganization) {
        console.log("선택된 조직 없음, 모든 데이터 표시");
        this.filteredMemberAttendanceData = [...this.memberAttendanceData];
        return;
      }

      // 선택된 조직과 모든 하위 조직의 ID 목록 가져오기
      const selectedOrgIds = this.getSelectedAndChildOrganizationIds(
        this.selectedOrganization
      );
      console.log("선택된 조직 및 하위 조직 IDs:", selectedOrgIds);

      // 전체 회원 데이터 확인
      console.log("전체 회원 데이터:", this.memberAttendanceData.length);

      // 데이터가 없으면 빈 배열 반환
      if (
        !this.memberAttendanceData ||
        this.memberAttendanceData.length === 0
      ) {
        this.filteredMemberAttendanceData = [];
        return;
      }

      // 선택된 조직과 하위 조직에 속한 인원만 필터링
      const filtered = this.memberAttendanceData.filter((member) =>
        selectedOrgIds.includes(member.organizationId)
      );

      // 반응성을 위해 새 배열로 할당
      this.filteredMemberAttendanceData = filtered;

      console.log(
        "필터링된 회원 데이터:",
        this.filteredMemberAttendanceData.length
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

      // 캐싱된 데이터 필터링
      if (
        this.isDataCached &&
        this.cachedMeetings &&
        this.cachedMeetings.length > 0
      ) {
        // 로딩 상태 표시
        this.isLoading = true;
        this.loadingStepText = "데이터 필터링 중...";

        // 비동기 처리로 UI 업데이트 및 데이터 필터링 분리
        setTimeout(() => {
          try {
            console.log(
              `캐시된 데이터 복원: ${this.cachedMeetings.length}개 조직`
            );

            // 깊은 복사로 캐시된 데이터 복원 (Vue의 반응성 유지)
            this.attendanceData.meetings = JSON.parse(
              JSON.stringify(this.cachedMeetings)
            );

            // 캐시 복원 후 데이터 확인
            let totalInstances = 0;
            this.attendanceData.meetings.forEach((org) => {
              if (org.activities) {
                org.activities.forEach((act) => {
                  if (act.instances) {
                    totalInstances += act.instances.length;
                  }
                });
              }
            });
            console.log(`복원된 데이터의 총 인스턴스 수: ${totalInstances}`);

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
        // 캐시가 없으면 전체 데이터 로드
        console.log("캐시된 데이터 없음, 초기화 진행");
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
    filterData() {
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

        // 데이터가 있는지 확인
        if (
          !this.attendanceData.meetings ||
          this.attendanceData.meetings.length === 0
        ) {
          console.warn("필터링할 미팅 데이터가 없습니다.");
          this.memberAttendanceData = [];
          this.filteredMemberAttendanceData = [];
          this.meetingDates = [];
          return;
        }

        // 날짜 범위에 맞게 필터링
        let totalInstancesBefore = 0;
        let totalInstancesAfter = 0;
        let filteredDates = [];

        this.attendanceData.meetings.forEach((orgData) => {
          if (orgData.activities && orgData.activities.length > 0) {
            orgData.activities.forEach((activity) => {
              if (activity.instances && activity.instances.length > 0) {
                // 필터링 전 인스턴스 수 집계
                totalInstancesBefore += activity.instances.length;

                // 날짜 범위 내 인스턴스만 필터링
                activity.instances = activity.instances.filter((instance) => {
                  if (!instance.start_datetime) return false;

                  // 날짜 파싱 - 여러 형식 지원
                  let instanceDate = moment(instance.start_datetime);

                  // 파싱 실패 체크
                  if (!instanceDate.isValid()) {
                    console.warn(
                      "유효하지 않은 날짜:",
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
        this.attendanceData.meetings = this.attendanceData.meetings.filter(
          (orgData) => orgData.activities && orgData.activities.length > 0
        );

        // 필터링 결과 요약
        console.log(
          `필터링 결과: 전체 ${totalInstancesBefore}개 중 ${totalInstancesAfter}개 인스턴스 포함`
        );
        console.log(
          `포함된 날짜: ${[...new Set(filteredDates)].sort().join(", ")}`
        );

        // 테이블 데이터 재구성 (중요)
        this.prepareMeetingDates();
        this.prepareOrganizationSelectItems();
        this.prepareMemberAttendanceData();

        // 조직 선택 적용
        if (
          this.selectedOrganization &&
          this.organizationSelectItems.some(
            (item) => item.value === this.selectedOrganization
          )
        ) {
          // 이전 선택 유지
          this.handleOrganizationChange();
        } else if (this.organizationSelectItems.length > 0) {
          // 기본 조직 선택
          this.selectedOrganization = this.organizationSelectItems[0].value;
          this.handleOrganizationChange();
        }

        console.log(
          `필터링 결과: ${this.memberAttendanceData.length}명 중 ${this.filteredMemberAttendanceData.length}명 표시`
        );
      } catch (error) {
        console.error("데이터 필터링 중 오류 발생:", error);
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

<style>
/* 민트 & 스카이블루 그라데이션 기반 색상 시스템 */
:root {
  --mint-color: #4ecdc4;
  --mint-light: #a6e7e2;
  --mint-dark: #3aa39b;
  --skyblue-color: #38b6ff;
  --skyblue-light: #8cd6ff;
  --skyblue-dark: #0096ee;
  --gradient-primary: linear-gradient(
    135deg,
    var(--mint-color) 0%,
    var(--skyblue-color) 100%
  );
  --gradient-secondary: linear-gradient(
    135deg,
    var(--skyblue-color) 0%,
    var(--mint-color) 100%
  );
  --background-color: #f8fafb;
  --card-color: #f9fbfd;
  --text-primary: #2c3e50;
  --text-secondary: #455a64;
  --text-tertiary: #78909c;
  --border-color: #e0f2f1;
}

/* Vuetify 테마 오버라이드 */
.v-application .primary {
  background-color: var(--mint-color) !important;
  border-color: var(--mint-color) !important;
}

.v-application .secondary {
  background-color: var(--skyblue-color) !important;
  border-color: var(--skyblue-color) !important;
}

.v-application .accent {
  background-color: var(--mint-light) !important;
  border-color: var(--mint-light) !important;
}

/* 주요 데이터 영역 배경색 강화 */
.attendance-data-card .v-card-text,
.attendance-chart-card .v-card-text {
  background-color: var(--card-color);
}

.search-btn {
  margin-left: 4px;
  min-width: 80px;
  font-weight: 500;
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%) !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(76, 175, 180, 0.25) !important;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  height: 40px;
}

.search-btn:hover {
  box-shadow: 0 6px 12px rgba(76, 175, 180, 0.35) !important;
  transform: translateY(-2px);
}

.update-btn {
  background-color: #8cd6ff !important;
  color: #2c3e50 !important;
  box-shadow: 0 4px 8px rgba(56, 182, 255, 0.25) !important;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.3px;
  height: 40px;
}

.update-btn:hover {
  box-shadow: 0 6px 12px rgba(56, 182, 255, 0.35) !important;
  transform: translateY(-2px);
}

.excel-download-btn {
  background-color: #a6e7e2 !important;
  color: #2c3e50 !important;
  box-shadow: 0 4px 8px rgba(78, 205, 196, 0.25) !important;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.3px;
  height: 40px;
}

.excel-download-btn:hover {
  box-shadow: 0 6px 12px rgba(78, 205, 196, 0.35) !important;
  transform: translateY(-2px);
}

/* 카드 디자인 개선 */
/* 데이터 표시 카드 */
.attendance-data-card,
.attendance-chart-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
  margin-bottom: 24px;
  background-color: #ffffff !important;
  border: 1px solid rgba(78, 205, 196, 0.2) !important;
  transition: all 0.3s ease;
}

/* 필터링 및 컨트롤 카드 */
.dashboard-header-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 24px;
  background-color: #ffffff !important;
  border: 1px solid rgba(224, 242, 241, 0.7) !important;
  transition: all 0.3s ease;
}

.dashboard-cards-container {
  margin-top: 32px;
}

.dashboard-cards-container .v-row {
  margin-bottom: 32px;
}

.card-section-divider {
  height: 1px;
  background: rgba(224, 242, 241, 0.7);
  margin: 16px 0 24px;
  width: 100%;
}

.dashboard-header-card:hover,
.attendance-chart-card:hover,
.attendance-data-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-icon {
  font-size: 32px;
  color: var(--primary-color);
  margin-right: 8px;
}

.dashboard-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
  position: relative;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 251, 0.8)
  );
}

.header-controls-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: nowrap;
}

.date-controls-wrapper {
  display: flex;
  align-items: flex-end;
  min-width: 360px;
  gap: 12px;
}

.action-buttons-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-field-container {
  min-width: 160px;
  max-width: 180px;
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 12px;
  margin-bottom: 6px;
  color: #666;
  font-weight: 500;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  padding: 0 8px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.date-input-wrapper:hover {
  border-color: #aaa;
}

.date-input-icon {
  font-size: 18px !important;
  color: #666;
  margin-right: 8px;
}

.date-input {
  flex: 1;
}

.date-input .v-input__control {
  min-height: 40px !important;
}

.date-input .v-input__slot {
  padding: 0 !important;
  margin-bottom: 0 !important;
  min-height: 40px !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.date-input .v-input__slot:before,
.date-input .v-input__slot:after {
  display: none !important;
}

.date-input .v-text-field__slot input {
  padding: 0 !important;
  font-size: 14px;
  color: #333;
}

.date-separator {
  margin: 0 8px;
  font-weight: 500;
  color: #666;
  align-self: flex-end;
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: 8px;
}

.search-btn {
  min-width: 80px;
}

.update-btn {
  min-width: 150px;
}

.excel-download-btn {
  min-width: 120px;
}

.period-summary {
  padding: 12px 24px;
  background-color: rgba(248, 250, 251, 0.7);
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  border-top: 1px solid rgba(224, 242, 241, 0.5);
  overflow-x: auto;
}

.period-chip {
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%) !important;
  color: white !important;
  font-weight: 500;
  min-width: fit-content;
}

.period-text {
  white-space: nowrap;
  font-weight: 500;
  min-width: fit-content;
}

.quick-filter-section {
  display: flex;
  min-width: fit-content;
}

.quick-filter-buttons {
  background-color: rgba(245, 249, 252, 0.8) !important;
  border-radius: 6px !important;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03) !important;
  display: flex;
}

.quick-filter-buttons .v-btn {
  min-width: 70px;
  height: 36px;
  text-transform: none;
  letter-spacing: 0;
  font-size: 12px;
  font-weight: 500;
}

.quick-filter-buttons .v-btn--active {
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%) !important;
  color: white !important;
}

.update-time {
  white-space: nowrap;
  font-size: 12px;
  color: var(--text-tertiary);
  min-width: fit-content;
}

/* 반응형 스타일 - 스크린 크기에 따라 조정 */
@media (max-width: 1400px) {
  .update-btn {
    min-width: 36px;
    padding: 0 8px;
  }

  .update-btn .v-btn__content span {
    display: none;
  }

  .excel-download-btn {
    min-width: 36px;
    padding: 0 8px;
  }

  .excel-download-btn .v-btn__content span {
    display: none;
  }
}

@media (max-width: 1200px) {
  .header-controls-wrapper {
    flex-wrap: wrap;
    gap: 8px;
  }

  .date-field-container {
    min-width: 150px;
    max-width: 180px;
  }

  .search-btn {
    min-width: 70px;
  }

  .quick-filter-buttons .v-btn {
    min-width: 60px;
    font-size: 11px;
  }
}

@media (max-width: 960px) {
  .dashboard-header {
    flex-wrap: wrap;
    gap: 16px;
  }

  .dashboard-title {
    width: 100%;
    margin-bottom: 8px;
  }

  .header-controls-wrapper {
    width: 100%;
  }

  .date-field-container {
    min-width: 160px;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .period-summary {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding: 12px 16px;
  }

  .date-input-wrapper {
    width: 100%;
  }
}

.dashboard {
  background-color: var(--background-color);
  min-height: 100vh;
  color: var(--text-primary);
}

/* 로딩 컨테이너 스타일 향상 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(38, 50, 56, 0.92);
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  width: 420px;
  max-width: 90vw;
  text-align: center;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.4s ease-out;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-spinner-wrapper {
  position: relative;
  margin-bottom: 16px;
  z-index: 1;
  width: 80px;
  height: 80px;
}

.loading-spinner {
  filter: drop-shadow(0 0 8px rgba(78, 205, 196, 0.5));
}

.loading-spinner::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(78, 205, 196, 0.3) 0%,
    rgba(78, 205, 196, 0.1) 40%,
    transparent 70%
  );
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes glowing {
  from {
    box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(56, 182, 255, 0.8);
  }
}

.loading-content {
  width: 100%;
}

.loading-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.loading-progress-bar {
  margin-bottom: 12px;
  border-radius: 100px;
  overflow: hidden;
}

.loading-percentage {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.loading-details {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
}

.loading-error {
  background-color: rgba(244, 67, 54, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  color: rgba(255, 255, 255, 0.9);
  border-left: 4px solid #f44336;
}

.retry-btn {
  margin-top: 12px;
  align-self: flex-end;
}

/* 대시보드 헤더 스타일 개선 */
.dashboard-header-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md) !important;
  margin-bottom: var(--spacing-lg);
  background-color: var(--card-color) !important;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.dashboard-header-card:hover {
  box-shadow: var(--shadow-lg) !important;
}

.dashboard-header {
  padding: 20px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  position: relative;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 251, 0.9)
  );
}

.dashboard-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0.7;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  white-space: nowrap;
}

.dashboard-icon {
  font-size: 32px !important;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: var(--spacing-xs);
}

.header-controls-container {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-direction: column;
}

.date-picker-container {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
  width: 100%;
}

.control-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 12px;
}

.date-field-container {
  display: flex;
  flex-direction: column;
  width: 140px;
}

.date-label {
  font-size: 12px;
  margin-bottom: var(--spacing-xs);
  color: var(--text-tertiary);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.date-input {
  background-color: white !important;
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all 0.3s ease;
}

.date-input:hover {
  box-shadow: var(--shadow-sm);
}

.date-input .v-input__prepend-inner {
  margin-top: 10px !important;
}

.date-separator {
  margin: 0 8px;
  font-weight: 500;
  color: var(--text-tertiary);
  align-self: center;
  margin-bottom: 10px;
}

.search-btn {
  margin-left: var(--spacing-xs);
  min-width: 90px;
  font-weight: 500;
  letter-spacing: 0.3px;
  background: var(--gradient-primary) !important;
  color: white !important;
  box-shadow: 0 3px 6px rgba(76, 175, 180, 0.2) !important;
  transition: all 0.3s ease;
}

.search-btn:hover {
  box-shadow: 0 5px 10px rgba(76, 175, 180, 0.3) !important;
  transform: translateY(-1px);
}

.update-btn {
  background-color: var(--skyblue-light) !important;
  color: var(--text-primary) !important;
  min-width: 170px;
  font-weight: 500;
  box-shadow: 0 3px 6px rgba(56, 182, 255, 0.15) !important;
  transition: all 0.3s ease;
}

.update-btn:hover {
  box-shadow: 0 5px 10px rgba(56, 182, 255, 0.25) !important;
  transform: translateY(-1px);
}

.excel-download-btn {
  background-color: var(--mint-light) !important;
  color: var(--text-primary) !important;
  min-width: 140px;
  font-weight: 500;
  box-shadow: 0 3px 6px rgba(78, 205, 196, 0.15) !important;
  transition: all 0.3s ease;
}

.excel-download-btn:hover {
  box-shadow: 0 5px 10px rgba(78, 205, 196, 0.25) !important;
  transform: translateY(-1px);
}

.quick-filters {
  display: flex;
  align-items: center;
  overflow-x: auto;
  margin-top: 12px;
  width: 100%;
}

.quick-filter-buttons {
  background-color: rgba(245, 249, 252, 0.8) !important;
  border-radius: 6px !important;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  width: 100%;
}

.quick-filter-buttons .v-btn {
  flex: 1;
  min-width: 80px;
  height: 36px !important;
  text-transform: none;
  letter-spacing: 0;
  font-size: 13px;
  font-weight: 500;
}

.quick-filter-buttons .v-btn--active {
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%) !important;
  color: white !important;
  box-shadow: 0 2px 5px rgba(56, 182, 255, 0.2);
}

.period-summary {
  padding: 12px 24px;
  background-color: rgba(248, 250, 251, 0.7);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid rgba(224, 242, 241, 0.5);
}

.period-chip {
  font-size: 11px !important;
  height: 22px !important;
  background: var(--gradient-primary) !important;
  color: white !important;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 4px rgba(56, 182, 255, 0.15);
}

.period-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.2px;
}

.update-time {
  font-size: 12px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.update-time:hover {
  opacity: 1;
}

/* 빈 데이터 카드 스타일 */
.empty-data-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  background-color: #ffffff !important;
  padding: 32px 0;
  text-align: center;
  border: 1px dashed rgba(78, 205, 196, 0.3) !important;
  animation: fadeIn 0.5s ease-out;
}

.empty-data-card .v-icon {
  color: #e0f2f1 !important;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.empty-data-card:hover .v-icon {
  color: #4ecdc4 !important;
  transform: scale(1.05);
}

.empty-data-card .text-h6 {
  color: #546e7a !important;
  font-weight: 500 !important;
  margin-bottom: 16px !important;
}

.empty-data-card .v-btn {
  background: linear-gradient(135deg, #4ecdc4 0%, #38b6ff 100%) !important;
  color: white !important;
  box-shadow: 0 3px 6px rgba(76, 175, 180, 0.2) !important;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: all 0.3s ease;
}

.empty-data-card .v-btn:hover {
  box-shadow: 0 5px 10px rgba(76, 175, 180, 0.3) !important;
  transform: translateY(-1px);
}

/* 출석 데이터 카드 스타일 */
.attendance-data-card {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md) !important;
  background-color: var(--card-color) !important;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.attendance-data-card:hover {
  box-shadow: var(--shadow-lg) !important;
}

.filter-header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 251, 0.9)
  );
}

.filter-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0.5;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  white-space: nowrap;
  font-weight: 600;
}

.filter-title .v-icon {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-filter-controls {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--spacing-lg);
}

.search-field {
  background-color: white !important;
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 250px;
}

.organization-select {
  background-color: white !important;
  border-radius: var(--radius-sm);
  overflow: hidden;
  width: 250px;
}

.attendance-cell {
  font-weight: bold;
  padding: 4px;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.2s ease;
}

.attendance-present {
  background-color: rgba(166, 231, 226, 0.7);
  color: #155724;
  border: 1px solid rgba(78, 205, 196, 0.4);
  font-weight: 600;
}

.attendance-present:hover {
  background-color: rgba(166, 231, 226, 0.8);
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(78, 205, 196, 0.15);
}

.attendance-absent {
  background-color: rgba(248, 215, 218, 0.7);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.4);
  font-weight: 600;
}

.attendance-absent:hover {
  background-color: rgba(248, 215, 218, 0.8);
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.15);
}

.attendance-table {
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm) !important;
}

.v-data-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(224, 242, 241, 0.5);
}

.v-data-table thead {
  background: linear-gradient(to right, #f8fbfc, #ecf7fa) !important;
}

.v-data-table tbody tr:nth-child(even) {
  background-color: rgba(248, 250, 251, 0.5);
}

.v-data-table tbody tr:hover {
  background-color: rgba(166, 231, 226, 0.1) !important;
}

.v-data-table thead th {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
  background: linear-gradient(to right, #f8fbfc, #ecf7fa) !important;
  line-height: 1.3 !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  border-bottom: 2px solid rgba(78, 205, 196, 0.3) !important;
}

.v-data-table tbody tr:hover {
  background-color: rgba(245, 249, 255, 0.7) !important;
}

/* Vuetify Override Styles */
.v-btn {
  letter-spacing: 0;
  text-transform: none;
  font-weight: 500;
}

.v-btn.v-btn--contained {
  box-shadow: none;
}

.v-btn.v-btn--contained:hover {
  box-shadow: var(--shadow-sm);
}

.v-text-field--outlined >>> fieldset {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* 대시보드에서 사이드바와 메뉴 버튼 숨김 처리를 위한 전역 스타일 */
.dashboard-active .v-navigation-drawer {
  transform: translateX(-100%) !important;
  visibility: hidden !important;
}

.dashboard-active .v-main {
  padding-left: 0 !important;
}

/* 햄버거 메뉴 버튼 숨김 처리 */
.dashboard-active .v-app-bar-nav-icon {
  display: none !important;
}

/* 햄버거 메뉴 버튼이 사라진 공간 재조정 */
.dashboard-active .v-toolbar-title {
  margin-left: 0 !important;
  padding-left: 16px !important;
}

/* 카드 내부 패딩 통일 */
.dashboard-header,
.filter-header,
.chart-header,
.v-card-text,
.v-card-actions {
  padding: 16px 24px !important;
}

/* 버튼 간격 통일 */
.header-actions .v-btn + .v-btn,
.table-filter-controls .v-btn + .v-btn {
  margin-left: 12px;
}

/* 반응형 스타일 */
@media (max-width: 1280px) {
  .header-controls-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  .date-picker-container {
    width: 100%;
    justify-content: space-between;
  }

  .quick-filters {
    width: 100%;
  }
}

@media (max-width: 960px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .header-controls-container {
    width: 100%;
  }

  .control-buttons {
    margin-top: var(--spacing-md);
    width: 100%;
    flex-wrap: wrap;
  }

  .control-buttons .v-btn {
    flex: 1;
    min-width: 0;
  }

  .date-picker-container {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .date-field-container {
    flex: 1;
    min-width: 120px;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacing-lg);
  }

  .table-filter-controls {
    width: 100%;
    margin-top: var(--spacing-lg);
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .organization-select,
  .search-field {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
  }

  .date-separator {
    align-self: center;
    margin: 0;
  }

  .search-btn {
    width: 100%;
    margin-left: 0;
  }

  .quick-filters {
    justify-content: flex-start;
    width: 100%;
    overflow-x: auto;
  }

  .quick-filter-buttons {
    width: 100%;
  }

  .period-summary {
    padding: var(--spacing-md) var(--spacing-lg);
  }
}

@media (max-width: 600px) {
  .dashboard-header {
    padding: var(--spacing-md);
  }

  .date-picker-container {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .date-field-container {
    width: 100%;
  }

  .date-separator {
    align-self: center;
    margin: var(--spacing-sm) 0;
  }

  .control-buttons {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-sm);
  }

  .control-buttons .v-btn {
    width: 100%;
    margin-left: 0 !important;
  }

  .update-btn,
  .excel-download-btn {
    margin-top: var(--spacing-sm);
  }

  .quick-filter-buttons {
    width: 100%;
    overflow-x: auto;
    max-width: 100%;
    display: flex;
  }

  .quick-filter-buttons .v-btn {
    flex: 1;
    min-width: 70px;
    font-size: 12px;
    padding: 0 var(--spacing-sm);
  }

  .filter-header {
    padding: var(--spacing-md);
  }

  .table-filter-controls {
    gap: var(--spacing-sm);
  }

  .organization-select,
  .search-field {
    width: 100%;
  }

  .v-data-table th {
    font-size: 0.75rem !important;
    padding: var(--spacing-sm) var(--spacing-xs) !important;
  }

  .period-summary {
    padding: var(--spacing-sm) var(--spacing-lg);
    flex-direction: column;
    align-items: flex-start;
  }

  .update-time {
    margin-top: var(--spacing-xs);
  }

  .attendance-table .v-data-table__wrapper {
    max-width: 100%;
    overflow-x: auto;
  }
}

/* 스크롤바 스타일 개선 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    rgba(78, 205, 196, 0.7),
    rgba(56, 182, 255, 0.7)
  );
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    to bottom,
    rgba(78, 205, 196, 0.8),
    rgba(56, 182, 255, 0.8)
  );
}

/* 폰트 스타일 개선 */
.dashboard {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  letter-spacing: 0.2px;
}

.text-h5 {
  font-size: 22px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  color: var(--text-primary) !important;
}

.text-h6 {
  font-size: 18px !important;
  font-weight: 600 !important;
  letter-spacing: 0.2px !important;
  color: var(--text-primary) !important;
}

/* 본문 텍스트 */
.v-data-table tbody td {
  font-size: 14px !important;
  color: var(--text-secondary) !important;
}

/* 테이블 헤더 */
.v-data-table thead th {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
  letter-spacing: 0.2px !important;
  border-bottom: 2px solid rgba(78, 205, 196, 0.3) !important;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-header-card,
.attendance-data-card {
  animation: fadeIn 0.5s ease-out;
}

.v-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.v-btn:active {
  transform: scale(0.95);
}

/* 여백과 마진 시스템 */
.dashboard-header-card,
.attendance-chart-card,
.attendance-data-card,
.empty-data-card {
  margin-bottom: 24px !important; /* 카드 간 간격 통일 */
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

.card-content-padding {
  padding: 16px !important; /* 카드 내용 패딩 통일 */
}

.filter-header,
.chart-header,
.dashboard-header {
  padding: 16px 24px !important; /* 헤더 패딩 통일 */
}

.period-summary {
  padding: 12px 24px !important; /* 요약 영역 패딩 통일 */
}

/* v-col 패딩 제거하여 일관된 간격 유지 */
.v-col {
  padding: 12px 12px !important;
}

/* 대시보드 주요 컴포넌트 영역 */
.dashboard-main-content {
  margin-top: 16px;
  animation: fadeIn 0.5s ease-out;
}

.dashboard-main-content .v-row {
  margin-bottom: 24px;
}

.dashboard-main-content .v-row:last-child {
  margin-bottom: 0;
}

.card-content-padding {
  padding: 16px 24px;
}

.filter-header {
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: rgba(248, 250, 251, 0.7);
}

@media (max-width: 959px) {
  .filter-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-filter-controls {
    width: 100%;
  }
}

.table-filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.organization-select {
  min-width: 180px;
  max-width: 300px;
}

.organization-select.v-input,
.search-field.v-input {
  border-radius: 6px;
  overflow: hidden;
}

.organization-select .v-input__slot,
.search-field .v-input__slot {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
}

.search-field {
  min-width: 200px;
  max-width: 300px;
}

@media (max-width: 599px) {
  .table-filter-controls {
    flex-direction: column;
    gap: 8px;
  }

  .organization-select,
  .search-field {
    width: 100%;
    max-width: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 새로운 스타일 추가 */
.dashboard-card-section {
  margin-top: 24px;
}

.dashboard-card-section .v-row {
  margin-bottom: 24px;
}

.dashboard-card-section .v-row:last-child {
  margin-bottom: 0;
}

.filter-header {
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: rgba(248, 250, 251, 0.7);
}

.card-content-padding {
  padding: 16px 24px;
}

.date-controls-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
}

.action-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 12px;
}

.table-filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.organization-select {
  min-width: 180px;
  max-width: 280px;
}

.search-field {
  min-width: 200px;
  max-width: 280px;
}

@media (max-width: 1264px) {
  .action-buttons-container {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }

  .action-buttons-container .v-btn {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .date-controls-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .date-separator {
    align-self: center;
    margin: 4px 0;
  }

  .date-field-container {
    width: 100%;
  }

  .table-filter-controls {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .organization-select,
  .search-field {
    width: 100%;
    max-width: none;
  }
}

.attendance-chart-card,
.attendance-data-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  background-color: #ffffff !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

/* 기본 대시보드 레이아웃 */
.dashboard-container {
  padding: 16px !important;
}

/* 카드 간격 일관성 유지 */
.dashboard-container .v-row {
  margin-bottom: 24px;
}

.dashboard-container .v-row:last-child {
  margin-bottom: 0;
}

/* 헤더 카드 스타일 */
.dashboard-header-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 24px;
  background-color: #ffffff !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

/* 출석률 그래프 카드 스타일 */
.attendance-chart-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 24px;
  background-color: #ffffff !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

/* 출석 데이터 카드 스타일 */
.attendance-data-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  background-color: #ffffff !important;
  border: 1px solid #e0f2f1 !important;
  transition: all 0.3s ease;
}

/* 카드 헤더 패딩 통일 */
.dashboard-header,
.chart-header,
.filter-header {
  padding: 16px 24px;
}

/* 카드 내용 패딩 통일 */
.card-content-padding {
  padding: 16px 24px;
}

/* 기간 요약 패딩 통일 */
.period-summary {
  padding: 12px 24px;
  background-color: rgba(248, 250, 251, 0.7);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid rgba(224, 242, 241, 0.5);
}

/* 빈 데이터 카드 여백 통일 */
.empty-data-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  background-color: #ffffff !important;
  padding: 32px 0;
  text-align: center;
  border: 1px dashed rgba(78, 205, 196, 0.3) !important;
}

/* 반응형 레이아웃 개선 */
@media (max-width: 959px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .control-buttons {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
    justify-content: space-between;
  }

  .quick-filters {
    overflow-x: auto;
  }
}

@media (max-width: 599px) {
  .dashboard-container {
    padding: 12px !important;
  }

  .dashboard-header,
  .chart-header,
  .filter-header {
    padding: 16px;
  }

  .card-content-padding {
    padding: 16px;
  }

  .period-summary {
    padding: 12px 16px;
  }

  .date-field-container {
    width: 100%;
  }

  .date-separator {
    margin: 8px auto;
  }

  .control-buttons {
    flex-direction: column;
    width: 100%;
  }

  .control-buttons .v-btn {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 8px;
  }

  .control-buttons .v-btn:first-child {
    margin-top: 0;
  }

  .table-filter-controls {
    flex-direction: column;
    width: 100%;
  }

  .organization-select,
  .search-field {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* 비밀번호 대화상자 스타일 */
.password-dialog {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
  animation: fadeInAndSlideDown 0.4s ease-out;
}

@keyframes fadeInAndSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-header {
  display: flex;
  align-items: center;
  padding: 28px 24px;
  background: linear-gradient(
    135deg,
    var(--mint-color) 0%,
    var(--skyblue-color) 100%
  );
  color: white;
  position: relative;
  overflow: hidden;
}

.password-header::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent);
  z-index: 1;
}

.password-header .lock-icon {
  font-size: 36px;
  margin-right: 18px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.password-header .headline {
  font-weight: 600;
  font-size: 22px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.password-content {
  padding: 36px 28px !important;
}

.password-message {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background-color: rgba(56, 182, 255, 0.12);
  border-radius: 8px;
  margin-bottom: 28px;
  border-left: 4px solid var(--skyblue-color);
  box-shadow: 0 2px 6px rgba(56, 182, 255, 0.08);
}

.password-input {
  margin-top: 16px;
}

.password-input .v-input__prepend-inner {
  margin-top: 12px !important;
  margin-right: 8px !important;
}

.password-input .v-input__prepend-inner i {
  color: var(--mint-color);
}

.password-alert {
  margin-top: 16px;
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}

.password-actions {
  padding: 16px 24px;
  background-color: rgba(248, 250, 251, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.cancel-btn {
  margin-right: 8px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.cancel-btn:hover {
  opacity: 1;
}

.login-btn {
  padding: 0 24px !important;
  height: 40px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 5px rgba(56, 182, 255, 0.2);
  transition: all 0.3s;
}

.login-btn:hover {
  box-shadow: 0 5px 10px rgba(56, 182, 255, 0.3);
  transform: translateY(-1px);
}

/* 단기 결석자 위험군 스타일 */
.absence-risk-card {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.08) !important;
  margin-bottom: 24px;
  background-color: #ffffff !important;
  border: 1px solid rgba(244, 67, 54, 0.2) !important;
  transition: all 0.3s ease;
}

.absence-risk-card:hover {
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.1) !important;
}

.absence-header {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.9),
    rgba(255, 243, 240, 0.9)
  );
  position: relative;
}

.absence-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
  opacity: 0.5;
}

.v-tabs-slider {
  height: 3px !important;
}

.risk-table .v-data-table__wrapper {
  padding: 0 !important;
}

.v-tab {
  text-transform: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  letter-spacing: 0.3px !important;
}

/* 아이콘 크기 및 색상 일관성 */
.dashboard-header .v-icon,
.filter-header .v-icon,
.absence-header .v-icon {
  font-size: 24px !important;
}

.dashboard-title .v-icon {
  color: var(--mint-color) !important;
}

.filter-header .v-icon {
  color: var(--skyblue-color) !important;
}

.absence-header .v-icon {
  color: #f44336 !important;
}

/* 버튼 내 아이콘 일관성 */
.v-btn .v-icon {
  font-size: 20px !important;
  margin-right: 6px !important;
}

/* 로딩 인디케이터 스타일 */
.loading-overlay {
  backdrop-filter: blur(8px);
  transition: all 0.3s ease-in-out !important;
}

.v-overlay__scrim {
  transition: opacity 0.3s ease-in-out !important;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(30, 40, 50, 0.85);
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
  max-width: 420px;
  width: 90%;
  animation: fadeIn 0.4s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
}

.loading-spinner-wrapper {
  position: relative;
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
}

.loading-spinner {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.5));
}

.loading-spinner::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(78, 205, 196, 0.4) 0%,
    rgba(78, 205, 196, 0.2) 40%,
    transparent 70%
  );
  animation: pulse 2s infinite;
  z-index: 1;
}

.loading-content {
  width: 100%;
  text-align: center;
}

.loading-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.loading-progress-bar {
  position: relative;
  overflow: hidden;
  border-radius: 10px !important;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) inset;
}

.loading-percentage {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
}

.loading-details {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.85);
  text-align: left;
  display: flex;
  align-items: flex-start;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
  border-left: 3px solid rgba(78, 205, 196, 0.7);
}

.loading-error {
  background-color: rgba(244, 67, 54, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
  border-left: 3px solid #f44336;
}

.retry-btn {
  margin-left: auto;
  margin-top: 8px;
  border-color: rgba(255, 255, 255, 0.7) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

/* 다크 테마에서 로딩 인디케이터 스타일 */
.dashboard-container.dark-theme .loading-container {
  background-color: rgba(20, 25, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.dashboard-container.dark-theme .loading-details {
  background-color: rgba(255, 255, 255, 0.07);
  border-left: 3px solid rgba(78, 205, 196, 0.6);
}

.dashboard-container.dark-theme .loading-error {
  background-color: rgba(244, 67, 54, 0.1);
}
</style>
