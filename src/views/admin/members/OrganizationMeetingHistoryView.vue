<template>
  <v-container fluid class="organization-meeting-history-view pa-0">
    <!-- 메인 컨텐츠 -->
    <div class="d-flex flex-column h-100">
      <!-- 필터 섹션 -->
      <v-card class="mb-4 filter-section">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="searchKeyword"
                label="모임명 검색"
                prepend-icon="mdi-magnify"
                outlined
                dense
                clearable
                @input="applyFilters"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-menu
                ref="startDateMenu"
                v-model="startDateMenu"
                :close-on-content-click="false"
                :return-value.sync="startDate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="시작일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    clearable
                    @click:clear="startDate = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  no-title
                  scrollable
                  @input="
                    $refs.startDateMenu.save(startDate);
                    applyFilters();
                  "
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="4">
              <v-menu
                ref="endDateMenu"
                v-model="endDateMenu"
                :close-on-content-click="false"
                :return-value.sync="endDate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    clearable
                    @click:clear="endDate = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  scrollable
                  @input="
                    $refs.endDateMenu.save(endDate);
                    applyFilters();
                  "
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-btn color="primary" outlined block @click="selectCurrentWeek">
                이번 주 선택 (일-토)
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn color="primary" outlined block @click="selectPreviousWeek">
                지난 주 선택 (일-토)
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn color="primary" outlined block @click="selectNextWeek">
                다음 주 선택 (일-토)
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 메인 콘텐츠 영역 -->
      <div class="d-flex flex-grow-1">
        <!-- 왼쪽 조직 트리 -->
        <v-card class="organization-tree mr-4" width="300">
          <v-card-title class="d-flex">
            <span>조직 구조</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="refreshOrganizations"
              :loading="loadingOrganizations"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-treeview
              v-model="selectedOrganizationIds"
              :items="organizationTree"
              item-key="id"
              item-text="organization_name"
              return-object
              selectable
              selected-color="primary"
              open-all
              @input="onOrganizationSelect"
            >
              <template #label="{ item }">
                <div class="d-flex align-center">
                  <span>{{ item.organization_name }}</span>
                  <v-chip
                    v-if="item.meetingCount"
                    x-small
                    class="ml-2"
                    color="primary"
                  >
                    {{ item.meetingCount }}
                  </v-chip>
                </div>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>

        <!-- 오른쪽 모임 목록 -->
        <v-card class="flex-grow-1 meeting-list">
          <v-card-title class="d-flex">
            <span>모임 목록</span>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="viewMode" mandatory>
              <v-btn small value="meetings">
                <v-icon small>mdi-format-list-bulleted</v-icon>
                모임별 보기
              </v-btn>
              <v-btn small value="summary">
                <v-icon small>mdi-chart-box</v-icon>
                요약 보기
              </v-btn>
            </v-btn-toggle>
            <v-btn
              color="success"
              small
              class="ml-2"
              @click="exportToExcel"
              :disabled="!meetings || meetings.length === 0"
            >
              <v-icon left>mdi-file-excel</v-icon>
              엑셀 내보내기
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="viewMode === 'meetings'">
              <v-data-table
                :headers="meetingHeaders"
                :items="meetings"
                :loading="loadingMeetings"
                :search="searchKeyword"
                :footer-props="{
                  itemsPerPageText: '페이지당 항목 수',
                  itemsPerPageOptions: [10, 20, 50, 100],
                }"
                class="elevation-1"
                :no-data-text="'모임 정보가 없습니다.'"
                :no-results-text="'검색 결과가 없습니다.'"
              >
                <template #[`item.meeting_date`]="{ item }">
                  {{ formatDateTime(item.meeting_date) }}
                </template>
                <template #[`item.meeting_time`]="{ item }">
                  {{ formatTime(item.meeting_time) }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    small
                    outlined
                    color="primary"
                    @click="viewMeetingDetails(item)"
                  >
                    상세보기
                  </v-btn>
                </template>
              </v-data-table>
            </div>

            <div v-else-if="viewMode === 'summary'">
              <v-data-table
                :headers="summaryHeaders"
                :items="meetingSummary"
                :loading="loadingMeetings"
                :search="searchKeyword"
                :footer-props="{
                  itemsPerPageText: '페이지당 항목 수',
                  itemsPerPageOptions: [10, 20, 50],
                }"
                class="elevation-1"
                :no-data-text="'요약 정보가 없습니다.'"
                :no-results-text="'검색 결과가 없습니다.'"
              >
                <template #[`item.totalPresent`]="{ item }">
                  <v-badge
                    :content="item.totalPresent"
                    color="success"
                    inline
                  ></v-badge>
                </template>
                <template #[`item.totalAbsent`]="{ item }">
                  <v-badge
                    :content="item.totalAbsent"
                    color="error"
                    inline
                  ></v-badge>
                </template>
                <template #[`item.totalLate`]="{ item }">
                  <v-badge
                    :content="item.totalLate"
                    color="warning"
                    inline
                  ></v-badge>
                </template>
                <template #[`item.avgAttendance`]="{ item }">
                  <v-chip
                    small
                    :color="getAttendanceColor(item.avgAttendanceRate)"
                    dark
                  >
                    {{ item.avgAttendance }} ({{ item.avgAttendanceRate }}%)
                  </v-chip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- 모임 상세 정보 다이얼로그 -->
    <v-dialog v-model="meetingDetailsDialog" max-width="800">
      <v-card>
        <v-card-title class="headline">
          {{
            selectedMeeting ? selectedMeeting.activity_name : "모임 상세 정보"
          }}
        </v-card-title>
        <v-card-text v-if="selectedMeeting">
          <v-row>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>날짜</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatDateTime(selectedMeeting.meeting_date)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-clock-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>시간</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatTime(selectedMeeting.meeting_time)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>장소</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedMeeting.location || "-"
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>조직</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedMeeting.organization_name || "-"
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <h3 class="mb-3">출석 명단</h3>
          <v-data-table
            :headers="attendanceHeaders"
            :items="selectedMeeting.attendances || []"
            :footer-props="{
              itemsPerPageText: '페이지당 항목 수',
              itemsPerPageOptions: [5, 10, 20],
            }"
            class="elevation-1"
            :no-data-text="'출석 정보가 없습니다.'"
          >
            <template #[`item.status`]="{ item }">
              <v-chip
                small
                :color="
                  item.status === '출석'
                    ? 'success'
                    : item.status === '결석'
                    ? 'error'
                    : 'warning'
                "
                dark
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="meetingDetailsDialog = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 알림 다이얼로그 -->
    <v-dialog v-model="dialog.show" max-width="500">
      <v-card>
        <v-card-title>{{ dialog.title }}</v-card-title>
        <v-card-text>{{ dialog.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog.show = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import "moment/locale/ko";
import { API_BASE_URL } from "@/config/constants";
import { mapGetters } from "vuex";

// OrganizationManagementView.vue에서 사용하는 믹스인 참조
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";

// 추가: ExcelJS 라이브러리 import
import { saveAs } from "file-saver";

export default {
  name: "OrganizationMeetingHistoryView",
  mixins: [MasterCtrl, CurrentMemberCtrl, OrganizationCtrl, AttendanceCtrl],
  data() {
    return {
      // 조직 관련
      organizationTree: [],
      organizations: [],
      selectedOrganizationIds: [],
      selectedOrganization: null,
      loadingOrganizations: false,

      // 조직 구조 캐싱
      cachedOrganizations: null,
      organizationCacheExpiry: null,
      organizationCacheDuration: 30 * 60 * 1000, // 30분 캐시 지속 시간

      // 뷰 모드 (모임별 또는 요약)
      viewMode: "meetings",

      // 모임 관련
      meetings: [],
      loadingMeetings: false,
      meetingHeaders: [
        { text: "모임명", value: "activity_name", align: "start" },
        { text: "날짜", value: "meeting_date" },
        { text: "시간", value: "meeting_time" },
        { text: "출석자 수", value: "present_count" },
        { text: "결석자 수", value: "absent_count" },
        { text: "지각자 수", value: "late_count" },
        { text: "작업", value: "actions", sortable: false },
      ],

      // 요약 테이블 헤더
      summaryHeaders: [
        { text: "모임명", value: "activityName", align: "start" },
        { text: "모임 횟수", value: "meetingCount" },
        { text: "총 출석자", value: "totalPresent" },
        { text: "총 결석자", value: "totalAbsent" },
        { text: "총 지각자", value: "totalLate" },
        { text: "평균 참석률", value: "avgAttendance" },
        { text: "요일", value: "dayOfWeek" },
      ],

      // 출석 명단 관련
      attendanceHeaders: [
        { text: "이름", value: "userName", align: "start" },
        { text: "전화번호", value: "phone" },
        { text: "상태", value: "status" },
        { text: "메모", value: "note" },
      ],

      // 필터 관련
      searchKeyword: "",
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,

      // 모임 상세 다이얼로그
      meetingDetailsDialog: false,
      selectedMeeting: null,

      // 알림 다이얼로그
      dialog: {
        show: false,
        title: "",
        message: "",
      },

      // API 엔드포인트
      API_BASE_URL: API_BASE_URL,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "auth/userInfo",
    }),

    // 모임명별 요약 정보
    meetingSummary() {
      if (!this.meetings || this.meetings.length === 0) return [];

      // 모임명으로 그룹화
      const groupedMeetings = {};

      this.meetings.forEach((meeting) => {
        const activityName = meeting.activity_name;

        if (!groupedMeetings[activityName]) {
          groupedMeetings[activityName] = {
            activityName: activityName,
            meetingCount: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalLate: 0,
            dayOfWeek: this.getMeetingDayOfWeek(activityName),
          };
        }

        groupedMeetings[activityName].meetingCount++;
        groupedMeetings[activityName].totalPresent +=
          meeting.present_count || 0;
        groupedMeetings[activityName].totalAbsent += meeting.absent_count || 0;
        groupedMeetings[activityName].totalLate += meeting.late_count || 0;
      });

      // 계산된 값 추가하여 배열로 변환
      return Object.values(groupedMeetings)
        .map((item) => {
          const totalAttendees =
            item.totalPresent + item.totalAbsent + item.totalLate;
          const avgAttendance =
            totalAttendees > 0
              ? Math.round((item.totalPresent / item.meetingCount) * 10) / 10
              : 0;
          const avgAttendanceRate =
            totalAttendees > 0
              ? Math.round((item.totalPresent / totalAttendees) * 100)
              : 0;

          return {
            ...item,
            avgAttendance,
            avgAttendanceRate,
            totalAttendees,
          };
        })
        .sort((a, b) => b.meetingCount - a.meetingCount);
    },
  },
  mounted() {
    // 조직 정보 로드
    this.fetchOrganizationsOnly();
  },
  methods: {
    // 조직 관련 메소드 - OrganizationManagementView.vue 참고
    async fetchOrganizationsOnly() {
      try {
        this.loadingOrganizations = true;
        // console.log("조직 데이터 가져오기 시작...");

        // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
        const now = new Date().getTime();
        if (
          this.cachedOrganizations &&
          this.organizationCacheExpiry &&
          now < this.organizationCacheExpiry
        ) {
          // console.log("캐시된 조직 데이터 사용 중...");
          this.organizations = this.cachedOrganizations;

          // 조직 트리 구성
          this.buildOrganizationTree();

          // 조직 정보를 가져온 후 멤버 수 계산
          this.calculateMemberCounts();
          this.loadingOrganizations = false;
          return;
        }

        // API에서 데이터 가져오기
        // console.log("API에서 조직 데이터 가져오기...");
        const response = await this.getAllOrganizations(true);

        // API 응답 구조 확인 및 데이터 추출
        let organizations = [];
        if (response && response.data && Array.isArray(response.data)) {
          // API 응답에서 data 배열을 추출
          organizations = response.data;
          // console.log("API 응답에서 data 배열 추출:", organizations.length);
        } else if (Array.isArray(response)) {
          // 응답이 직접 배열인 경우
          organizations = response;
          // console.log("API 응답이 직접 배열인 경우:", organizations.length);
        } else {
          console.error("API 응답 형식이 예상과 다릅니다:", response);
          // 더미 데이터 사용
          organizations = this.getDummyOrganizations();
          // console.log("더미 데이터 사용:", organizations.length);
        }

        // 유효한 조직 데이터가 있는지 확인
        if (!organizations || organizations.length === 0) {
          // console.log("조직 데이터가 없습니다. 더미 데이터를 사용합니다.");
          organizations = this.getDummyOrganizations();
        }

        // 각 조직의 멤버 수 초기화
        organizations.forEach((org) => {
          org.memberCount = 0;
          org.meetingCount = 0; // 모임 카운트 초기화
        });

        this.organizations = organizations;

        // 조직 데이터 캐싱
        this.cachedOrganizations = JSON.parse(JSON.stringify(organizations)); // 깊은 복사
        this.organizationCacheExpiry = now + this.organizationCacheDuration;

        // 조직 트리 구성
        this.buildOrganizationTree();

        // 모든 조직의 모임 가져오기
        await this.fetchAllOrganizationsMeetings();
      } catch (error) {
        console.error("조직 데이터 로딩 중 오류 발생:", error);
        this.showDialog(
          "오류 발생",
          "조직 정보를 불러오는 중 오류가 발생했습니다."
        );

        // 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();
        this.buildOrganizationTree();
        this.generateSampleMeetings();
      } finally {
        this.loadingOrganizations = false;
      }
    },

    getDummyOrganizations() {
      return [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          organization_code: "CORAMDEO",
          description:
            "코람데오 청년선교회는 청년들의 신앙과 교제를 위한 조직입니다.",
          upper_organization_id: null,
          memberCount: 16,
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          organization_code: "CORAMDEO_DEPT1",
          description: "코람데오 청년선교회 1국입니다.",
          upper_organization_id: 1,
          memberCount: 8,
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          organization_code: "CORAMDEO_DEPT2",
          description: "코람데오 청년선교회 2국입니다.",
          upper_organization_id: 1,
          memberCount: 5,
        },
        {
          id: 4,
          organization_name: "코람데오_3국",
          organization_code: "CORAMDEO_DEPT3",
          description: "코람데오 청년선교회 3국입니다.",
          upper_organization_id: 1,
          memberCount: 3,
        },
        {
          id: 5,
          organization_name: "코람데오_1국_1팀",
          organization_code: "CORAMDEO_DEPT1_TEAM1",
          description: "코람데오 청년선교회 1국 1팀입니다.",
          upper_organization_id: 2,
          memberCount: 8,
        },
      ];
    },

    buildOrganizationTree() {
      try {
        // 배열을 맵으로 변환하여 더 빠른 검색 가능
        const orgMap = new Map();
        this.organizations.forEach((org) => {
          // 각 조직 객체에 children 배열 추가
          org.children = [];
          org.meetingCount = org.meetingCount || 0; // 모임 카운트 초기화
          org.isLeafNode = true; // 기본적으로 리프 노드로 설정
          orgMap.set(org.id, org);
        });

        // 트리 구조 구성
        const rootOrgs = [];
        this.organizations.forEach((org) => {
          if (org.upper_organization_id === null) {
            rootOrgs.push(org);
          } else {
            const parent = orgMap.get(org.upper_organization_id);
            if (parent) {
              parent.children.push(org);
              parent.isLeafNode = false; // 자식이 있으므로 리프 노드가 아님
            }
          }
        });

        this.organizationTree = rootOrgs;
        // console.log("조직 트리 구성 완료:", this.organizationTree);
      } catch (error) {
        console.error("조직 트리 구성 중 오류 발생:", error);
        this.showDialog(
          "오류 발생",
          "조직 구조를 구성하는 중 오류가 발생했습니다."
        );
        this.organizationTree = [];
      }
    },

    // 각 조직의 멤버 수 계산 (OrganizationManagementView.vue 참고)
    async calculateMemberCounts() {
      try {
        // console.log("멤버 수 계산 시작");

        // 1. 리프 노드(하위 조직이 없는 노드) 찾기
        const leafOrgs = this.organizations.filter((org) => {
          const hasChildren = this.organizations.some(
            (child) => child.upper_organization_id === org.id
          );
          return !hasChildren;
        });

        // console.log(`리프 노드 찾음: ${leafOrgs.length}개`);

        // 2. 리프 노드의 멤버 수 가져오기
        for (const leafOrg of leafOrgs) {
          try {
            const members = await this.getOrganizationMembers(leafOrg.id, true);

            if (Array.isArray(members)) {
              leafOrg.memberCount = members.length;
            } else if (
              members &&
              members.members &&
              Array.isArray(members.members)
            ) {
              leafOrg.memberCount = members.members.length;
            } else {
              leafOrg.memberCount = 0;
            }

            // console.log(
            //   `조직 ID ${leafOrg.id} (${leafOrg.organization_name}): 멤버 ${leafOrg.memberCount}명`
            // );
          } catch (err) {
            console.error(`조직 ID ${leafOrg.id}의 멤버 수 조회 중 오류:`, err);
            leafOrg.memberCount = 0;
          }
        }

        // 3. 조직 레벨 계산 (상향식 계산을 위해)
        const orgLevels = [];
        let currentLevelOrgs = [...leafOrgs];

        while (currentLevelOrgs.length > 0) {
          orgLevels.unshift(currentLevelOrgs);

          // 현재 레벨의 부모 조직 찾기
          const parentIds = currentLevelOrgs
            .map((org) => org.upper_organization_id)
            .filter((id) => id !== null);

          // 중복 제거
          const uniqueParentIds = [...new Set(parentIds)];

          // 다음 레벨의 조직 찾기
          currentLevelOrgs = this.organizations.filter((org) =>
            uniqueParentIds.includes(org.id)
          );
        }

        // 4. 상향식으로 멤버 수 합산 (리프 노드부터 루트 노드까지)
        // console.log(`조직 레벨 수: ${orgLevels.length}`);

        // 첫 번째 레벨(리프 노드)은 이미 계산됨
        // 상위 레벨부터 시작하여 하위 조직의 멤버 수 합산
        for (let i = 1; i < orgLevels.length; i++) {
          const currentLevelOrgs = orgLevels[i];

          for (const org of currentLevelOrgs) {
            // 하위 조직 찾기
            const childOrgs = this.organizations.filter(
              (child) => child.upper_organization_id === org.id
            );

            // 하위 조직의 멤버 수 합산
            let totalMembers = 0;
            childOrgs.forEach((child) => {
              totalMembers += child.memberCount || 0;
            });

            org.memberCount = totalMembers;
            // console.log(
            //   `상위 조직 ID ${org.id} (${org.organization_name}): 멤버 ${org.memberCount}명 (하위 조직 ${childOrgs.length}개)`
            // );
          }
        }

        // 5. 트리 다시 구성 (멤버 수 정보 반영)
        this.buildOrganizationTree();
        // console.log("멤버 수 계산 완료");
      } catch (error) {
        console.error("멤버 수 계산 중 오류 발생:", error);
      }
    },

    async fetchAllOrganizationsMeetings() {
      // console.log("모든 조직의 모임 데이터 가져오기 시작");
      // 모든 조직에 대해 병렬로 모임 데이터 가져오기
      const promises = this.organizations.map((org) =>
        this.fetchOrganizationMeetings(org.id)
      );
      await Promise.all(promises);

      // 하위 조직의 모임 카운트를 상위 조직에 반영
      this.updateParentMeetingCounts();
    },

    updateParentMeetingCounts() {
      // 상향식으로 모임 카운트 업데이트
      const updateChildCounts = (org) => {
        let totalCount = org.meetingCount || 0;

        // 자식 조직의 카운트 합산
        if (org.children && org.children.length > 0) {
          org.children.forEach((child) => {
            totalCount += updateChildCounts(child);
          });
        }

        org.meetingCount = totalCount;
        return totalCount;
      };

      // 루트 조직부터 재귀적으로 업데이트
      this.organizationTree.forEach(updateChildCounts);
      // console.log("모임 카운트 업데이트 완료");
    },

    async fetchOrganizationMeetings(orgId) {
      try {
        // console.log(`조직 ID ${orgId}의 모임 데이터 로딩 시작`);

        // MeetingHistoryView.vue 참고: 활동 및 인스턴스 가져오기
        const response = await this.getOrganizationActivities(orgId, true);
        let meetings = [];

        if (
          response &&
          response.activities &&
          Array.isArray(response.activities)
        ) {
          // console.log(`${response.activities.length}개의 활동을 처리합니다.`);

          // 각 활동에서 인스턴스(모임) 가져오기
          meetings = response.activities.flatMap((activity) => {
            // console.log(`활동 "${activity.name}" 처리 중...`);
            if (activity.instances && activity.instances.length > 0) {
              // console.log(
              //   `${activity.instances.length}개의 인스턴스를 발견했습니다.`
              // );

              return activity.instances.map((instance) => {
                // 출석 및 결석 인원 계산
                const attendances = instance.attendances || [];
                const presentCount = attendances.filter(
                  (a) => a.status === "출석"
                ).length;
                const absentCount = attendances.filter(
                  (a) => a.status === "결석"
                ).length;
                const lateCount = attendances.filter(
                  (a) => a.status === "지각"
                ).length;

                // 출석한 사람들의 check_in_time 중 하나를 가져옴
                const presentAttendance = attendances.find(
                  (a) => a.status === "출석" && a.check_in_time
                );
                const checkInTime = presentAttendance
                  ? presentAttendance.check_in_time
                  : null;

                return {
                  id: instance.id,
                  activityId: activity.id,
                  organization_id: orgId,
                  organization_name: this.getOrganizationName(orgId),
                  activity_name: activity.name,
                  meeting_date:
                    checkInTime ||
                    instance.start_datetime ||
                    instance.startDateTime ||
                    instance.created_at ||
                    instance.date,
                  meeting_time: this.formatMeetingTime(
                    checkInTime ||
                      instance.start_datetime ||
                      instance.startDateTime
                  ),
                  location: instance.location || "-",
                  present_count: presentCount,
                  absent_count: absentCount,
                  late_count: lateCount,
                  attendances: this.formatAttendances(attendances),
                  image:
                    instance.images && instance.images.length > 0
                      ? instance.images[0].filePath
                      : require("@/assets/images/basic_image.png"),
                };
              });
            }
            return [];
          });
        }

        // 해당 조직의 모임 카운트 업데이트
        const org = this.organizations.find((o) => o.id === orgId);
        if (org) {
          org.meetingCount = meetings.length;
          // console.log(`조직 ID ${orgId}의 모임 수: ${meetings.length}`);

          // 현재 선택된 조직이라면 미팅 목록 업데이트
          if (
            this.selectedOrganization &&
            this.selectedOrganization.id === orgId
          ) {
            this.meetings = meetings;
          }
        }

        return meetings;
      } catch (error) {
        console.error(
          `조직 ID ${orgId}의 모임 데이터 로딩 중 오류 발생:`,
          error
        );
        return [];
      }
    },

    getOrganizationName(orgId) {
      const org = this.organizations.find((o) => o.id === orgId);
      return org ? org.organization_name : "-";
    },

    formatMeetingTime(dateTimeString) {
      return this.format(dateTimeString, "time");
    },

    // MeetingDetailView.vue 참고: 출결 정보 포맷팅
    formatAttendances(attendances) {
      if (!attendances || !Array.isArray(attendances)) {
        console.warn("유효하지 않은 출석 데이터:", attendances);
        return [];
      }

      const result = attendances.map((attendance) => {
        // 출결 상태 한글화
        let status = attendance.status;
        if (status === "present") status = "출석";
        else if (status === "absent") status = "결석";
        else if (status === "late") status = "지각";
        else if (!(status === "출석" || status === "결석" || status === "지각"))
          status = "미정";

        // MeetingDetailView.vue 참고: 출결 정보 포맷 통일
        return {
          id: attendance.id,
          userId: attendance.userId || attendance.user_id,
          userName:
            attendance.userName ||
            attendance.user_name ||
            attendance.name ||
            "이름 없음",
          status: status,
          note: attendance.note || "",
          phone: attendance.phone || "",
          roleName: attendance.roleName || attendance.role_name || "일반 회원",
        };
      });

      // console.log("포맷팅된 출석 데이터:", result);
      return result;
    },

    // 모임 상세 정보 보기
    async viewMeetingDetails(meeting) {
      try {
        this.loadingMeetings = true;
        // console.log("모임 상세 정보 가져오기:", meeting);

        // 먼저 기본 정보로 selectedMeeting 설정
        this.selectedMeeting = {
          ...meeting,
          attendances: meeting.attendances || [],
        };

        // 다이얼로그 먼저 표시하여 UX 개선
        this.meetingDetailsDialog = true;

        // MeetingDetailView.vue 참고: 모임 상세 정보 가져오기
        let response;
        try {
          response = await this.getActivityInstanceDetails(
            meeting.organization_id,
            meeting.activityId,
            meeting.id,
            true
          );
          // console.log("모임 상세 정보 응답:", response);
        } catch (error) {
          console.warn(
            "상세 정보를 가져오는 중 오류 발생, 기존 데이터 사용:",
            error
          );
        }

        if (response && response.activityInstance) {
          // 출석 데이터 가져오기 및 처리
          const attendances = response.activityInstance.attendances || [];
          // console.log("원본 출석 데이터:", attendances);
          const formattedAttendances = this.formatAttendances(attendances);
          // console.log("포맷된 출석 데이터:", formattedAttendances);

          // MeetingDetailView.vue 참고: 상세 데이터 포맷
          this.selectedMeeting = {
            ...meeting,
            activityDescription: response.activityInstance.description || "",
            notes: response.activityInstance.notes || "",
            startDateTime:
              response.activityInstance.start_datetime ||
              response.activityInstance.startDateTime,
            endDateTime:
              response.activityInstance.end_datetime ||
              response.activityInstance.endDateTime,
            attendances: formattedAttendances,
          };
        } else {
          // console.log("상세 정보를 가져오지 못해 기존 데이터 사용");
          // 출석 데이터가 없는 경우 샘플 데이터 생성
          if (
            !this.selectedMeeting.attendances ||
            this.selectedMeeting.attendances.length === 0
          ) {
            const totalCount =
              meeting.present_count + meeting.absent_count + meeting.late_count;
            if (totalCount > 0) {
              this.selectedMeeting.attendances =
                this.generateSampleAttendances(totalCount);
              // console.log("샘플 출석 데이터 생성:", this.selectedMeeting.attendances);
            }
          }
        }
      } catch (error) {
        console.error("모임 상세 정보 로딩 중 오류 발생:", error);
        this.showDialog(
          "오류 발생",
          "모임 상세 정보를 불러오는 중 오류가 발생했습니다."
        );
        // 샘플 데이터로 복구
        const totalCount =
          meeting.present_count + meeting.absent_count + meeting.late_count;
        this.selectedMeeting = {
          ...meeting,
          attendances:
            totalCount > 0 ? this.generateSampleAttendances(totalCount) : [],
        };
      } finally {
        this.loadingMeetings = false;
      }
    },

    // 필터 관련 메소드
    applyFilters() {
      if (this.selectedOrganization) {
        this.loadAllMeetingsForSelectedOrganization();
      }
    },

    refreshOrganizations() {
      // 캐시 무효화
      this.cachedOrganizations = null;
      this.organizationCacheExpiry = null;

      // 조직 정보 다시 로드
      this.fetchOrganizationsOnly();
    },

    // 샘플 데이터 생성 메소드
    generateSampleMeetings() {
      // 각 조직에 대해 샘플 모임 데이터 생성 (백엔드 API가 없을 때 사용)
      this.organizations.forEach((org) => {
        const meetingCount = Math.floor(Math.random() * 5) + 1; // 1~5개의 모임
        org.meetingCount = meetingCount;

        // 샘플 모임 생성
        for (let i = 0; i < meetingCount; i++) {
          const meeting = {
            id: `${org.id}-${i}`,
            activityId: `activity-${org.id}-${i}`,
            organization_id: org.id,
            organization_name: org.organization_name,
            activity_name: `${org.organization_name} ${
              ["주일예배", "금요예배", "새벽기도회", "셀모임", "성경공부"][
                i % 5
              ]
            }`,
            meeting_date: moment()
              .subtract(i * 7, "days")
              .format("YYYY-MM-DD"),
            meeting_time: `${Math.floor(Math.random() * 12) + 10}:${
              Math.floor(Math.random() * 6) * 10
            }`,
            location: ["본당", "소예배실", "교육관", "카페", "온라인"][i % 5],
            present_count: Math.floor(Math.random() * 10) + 5,
            absent_count: Math.floor(Math.random() * 5),
            late_count: Math.floor(Math.random() * 3),
            attendances: this.generateSampleAttendances(
              Math.floor(Math.random() * 10) + 5
            ),
            image: require("@/assets/images/basic_image.png"),
          };
          this.meetings.push(meeting);
        }
      });

      // 모임 카운트 업데이트
      this.updateParentMeetingCounts();
    },

    generateSampleAttendances(count) {
      // 샘플 출석 데이터 생성
      const attendances = [];
      const statuses = ["출석", "결석", "지각"];
      const names = [
        "김성실",
        "이믿음",
        "박소망",
        "최사랑",
        "정기쁨",
        "한평화",
        "조온유",
        "윤충성",
        "강인내",
        "장화평",
      ];
      const roles = ["회장", "부회장", "총무", "일반 회원", "일반 회원"];

      for (let i = 0; i < count; i++) {
        const statusIndex = Math.floor(Math.random() * 3);
        attendances.push({
          id: i,
          userId: i,
          userName: names[i % names.length],
          phone: `010-${1000 + Math.floor(Math.random() * 9000)}-${
            1000 + Math.floor(Math.random() * 9000)
          }`,
          status: statuses[statusIndex],
          note:
            statusIndex === 0
              ? ""
              : ["개인사정", "병가", "출장", "학업", "가족행사"][
                  Math.floor(Math.random() * 5)
                ],
          roleName: roles[i % roles.length],
        });
      }

      return attendances;
    },

    // 출석률에 따른 색상 반환
    getAttendanceColor(rate) {
      if (rate >= 80) return "success";
      if (rate >= 60) return "info";
      if (rate >= 40) return "warning";
      return "error";
    },

    // 엑셀 내보내기
    async exportToExcel() {
      try {
        this.loadingMeetings = true;

        // 필터링된 미팅 데이터 준비
        if (!this.meetings || this.meetings.length === 0) {
          this.showDialog("알림", "내보낼 모임 정보가 없습니다.");
          return;
        }

        // 날짜 범위 문자열 생성
        const dateRange =
          this.startDate && this.endDate
            ? `${moment(this.startDate).format("YYYY-MM-DD")} ~ ${moment(
                this.endDate
              ).format("YYYY-MM-DD")}`
            : moment().format("YYYY-MM-DD");

        // 파일명 설정
        const fileName = `모임_출결_현황_${dateRange}.xlsx`;

        // 동적으로 ExcelJS 라이브러리 로드 (필요시에만 로드)
        const ExcelJS = await import("exceljs");
        const workbook = new ExcelJS.Workbook();

        // 워크시트 생성
        const worksheet = workbook.addWorksheet("모임 출결 현황");

        // 헤더 설정
        worksheet.columns = [
          { header: "모임명", key: "activityName", width: 30 },
          { header: "날짜", key: "date", width: 15 },
          { header: "요일", key: "dayOfWeek", width: 10 },
          { header: "시간", key: "time", width: 10 },
          { header: "장소", key: "location", width: 20 },
          { header: "출석", key: "present", width: 10 },
          { header: "결석", key: "absent", width: 10 },
          { header: "지각", key: "late", width: 10 },
          { header: "총인원", key: "total", width: 10 },
        ];

        // 제목 행 스타일 설정
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        // 데이터 추가
        this.meetings.forEach((meeting) => {
          const meetingDate = moment(meeting.meeting_date).format("YYYY-MM-DD");
          const dayOfWeek = this.getMeetingDayOfWeek(meeting.activity_name);
          const totalMembers =
            meeting.present_count + meeting.absent_count + meeting.late_count;

          worksheet.addRow({
            activityName: meeting.activity_name,
            date: meetingDate,
            dayOfWeek: dayOfWeek,
            time: meeting.meeting_time,
            location: meeting.location,
            present: meeting.present_count,
            absent: meeting.absent_count,
            late: meeting.late_count,
            total: totalMembers,
          });
        });

        // 요약 워크시트 추가 - 모임명별 통계
        const summarySheet = workbook.addWorksheet("모임명별 요약");

        // 헤더 설정
        summarySheet.columns = [
          { header: "모임명", key: "activityName", width: 30 },
          { header: "요일", key: "dayOfWeek", width: 10 },
          { header: "총 모임 수", key: "meetingCount", width: 12 },
          { header: "총 출석인원", key: "totalPresent", width: 12 },
          { header: "총 결석인원", key: "totalAbsent", width: 12 },
          { header: "총 지각인원", key: "totalLate", width: 12 },
          { header: "평균 출석인원", key: "avgPresent", width: 12 },
          { header: "출석률", key: "attendanceRate", width: 12 },
        ];

        // 제목 행 스타일 설정
        summarySheet.getRow(1).font = { bold: true };
        summarySheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        // meetingSummary 계산된 값 사용
        this.meetingSummary.forEach((item) => {
          const totalAttendees =
            item.totalPresent + item.totalAbsent + item.totalLate;
          const attendanceRate =
            totalAttendees > 0
              ? `${Math.round((item.totalPresent / totalAttendees) * 100)}%`
              : "0%";

          summarySheet.addRow({
            activityName: item.activityName,
            dayOfWeek: item.dayOfWeek,
            meetingCount: item.meetingCount,
            totalPresent: item.totalPresent,
            totalAbsent: item.totalAbsent,
            totalLate: item.totalLate,
            avgPresent:
              Math.round((item.totalPresent / item.meetingCount) * 10) / 10,
            attendanceRate: attendanceRate,
          });
        });

        // 출석자 명단 워크시트 추가
        const attendeesSheet = workbook.addWorksheet("출석자 명단");

        // 헤더 설정
        attendeesSheet.columns = [
          { header: "모임명", key: "activityName", width: 30 },
          { header: "날짜", key: "date", width: 15 },
          { header: "이름", key: "name", width: 15 },
          { header: "전화번호", key: "phone", width: 15 },
          { header: "출결상태", key: "status", width: 10 },
          { header: "메모", key: "note", width: 20 },
        ];

        // 제목 행 스타일 설정
        attendeesSheet.getRow(1).font = { bold: true };
        attendeesSheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        // 출석자 데이터 추가
        this.meetings.forEach((meeting) => {
          const meetingDate = moment(meeting.meeting_date).format("YYYY-MM-DD");

          if (meeting.attendances && meeting.attendances.length > 0) {
            meeting.attendances.forEach((attendee) => {
              attendeesSheet.addRow({
                activityName: meeting.activity_name,
                date: meetingDate,
                name: attendee.userName,
                phone: attendee.phone,
                status: attendee.status,
                note: attendee.note,
              });
            });
          }
        });

        // 엑셀 파일 생성 및 다운로드
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), fileName);

        this.showDialog("완료", "모임 출결 정보가 엑셀 파일로 저장되었습니다.");
      } catch (error) {
        console.error("엑셀 내보내기 중 오류 발생:", error);
        this.showDialog("오류 발생", "엑셀 파일 생성 중 오류가 발생했습니다.");
      } finally {
        this.loadingMeetings = false;
      }
    },

    // 유틸리티 메소드
    format(value, type = "dateTime") {
      if (!value) return "-";
      try {
        switch (type) {
          case "dateTime":
            return moment(value).format("YYYY년 MM월 DD일");
          case "time":
            if (value.includes(":")) {
              const [hours, minutes] = value.split(":");
              const time = new Date();
              time.setHours(parseInt(hours));
              time.setMinutes(parseInt(minutes));
              return time.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
            } else {
              return moment(value).format("HH:mm");
            }
          default:
            return value;
        }
      } catch (error) {
        return "-";
      }
    },

    formatDateTime(dateTimeString) {
      return this.format(dateTimeString, "dateTime");
    },

    formatTime(timeString) {
      return this.format(timeString, "time");
    },

    showDialog(title, message) {
      this.dialog = {
        show: true,
        title,
        message,
      };
    },

    onOrganizationSelect() {
      if (
        this.selectedOrganizationIds &&
        this.selectedOrganizationIds.length > 0
      ) {
        this.selectedOrganization = this.selectedOrganizationIds[0];

        // 선택된 조직과 그 하위 조직의 모든 모임 데이터를 로드
        // console.log("선택된 조직:", this.selectedOrganization);
        this.loadAllMeetingsForSelectedOrganization();
      } else {
        this.selectedOrganization = null;
        this.meetings = [];
      }
    },

    // 선택된 조직과 그 하위 조직의 모든 모임 데이터 로드
    async loadAllMeetingsForSelectedOrganization() {
      try {
        this.loadingMeetings = true;
        const selectedOrg = this.selectedOrganization;

        if (!selectedOrg) {
          this.meetings = [];
          return;
        }

        // console.log(
        //   `조직 ID ${selectedOrg.id}(${selectedOrg.organization_name})의 모임 데이터 로드 시작`
        // );

        // 선택된 조직과 그 하위의 모든 조직 ID 찾기
        const allOrgIds = this.findAllChildOrganizationIds(selectedOrg);
        // console.log(
        //   `총 ${allOrgIds.length}개 조직의 모임 데이터를 로드합니다:`,
        //   allOrgIds
        // );

        // 모든 조직의 모임 데이터 로드
        const allMeetingsPromises = allOrgIds.map((orgId) =>
          this.fetchOrganizationMeetings(orgId)
        );

        // 모든 조직의 모임 데이터 병합
        const allMeetingsArrays = await Promise.all(allMeetingsPromises);
        let allMeetings = [].concat(...allMeetingsArrays);

        // 날짜 필터 적용
        if (this.startDate) {
          allMeetings = allMeetings.filter((m) =>
            moment(m.meeting_date).isSameOrAfter(this.startDate)
          );
        }

        if (this.endDate) {
          allMeetings = allMeetings.filter((m) =>
            moment(m.meeting_date).isSameOrBefore(this.endDate)
          );
        }

        // 키워드 필터 적용
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase();
          allMeetings = allMeetings.filter(
            (m) =>
              m.activity_name.toLowerCase().includes(keyword) ||
              (m.location && m.location.toLowerCase().includes(keyword))
          );
        }

        // 날짜순 정렬
        allMeetings.sort((a, b) => {
          return moment(b.meeting_date).diff(moment(a.meeting_date));
        });

        this.meetings = allMeetings;
        // console.log(`총 ${this.meetings.length}개의 모임 데이터 로드 완료`);
      } catch (error) {
        console.error(`모임 데이터 로딩 중 오류 발생:`, error);
        this.showDialog(
          "오류 발생",
          "모임 정보를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        this.loadingMeetings = false;
      }
    },

    // 선택된 조직과 그 하위의 모든 조직 ID 찾기
    findAllChildOrganizationIds(organization) {
      if (!organization) return [];

      const orgIds = [organization.id];

      const findChildIds = (org) => {
        if (org.children && org.children.length > 0) {
          org.children.forEach((child) => {
            orgIds.push(child.id);
            findChildIds(child);
          });
        }
      };

      findChildIds(organization);
      return orgIds;
    },

    async loadOrganizationMeetings(orgId) {
      try {
        this.loadingMeetings = true;
        console.log(`조직 ID ${orgId}의 모임 데이터 로드 시작`);

        // MeetingHistoryView.vue 참고: API 호출 패턴 적용
        const response = await this.getOrganizationActivities(orgId, true);
        let meetings = [];

        if (
          response &&
          response.activities &&
          Array.isArray(response.activities)
        ) {
          console.log(`${response.activities.length}개의 활동을 처리합니다.`);

          // 각 활동에서 인스턴스(모임) 가져오기
          meetings = response.activities.flatMap((activity) => {
            console.log(`활동 "${activity.name}" 처리 중...`);
            if (activity.instances && activity.instances.length > 0) {
              console.log(
                `${activity.instances.length}개의 인스턴스를 발견했습니다.`
              );

              return activity.instances.map((instance) => {
                // 출석 및 결석 인원 계산
                const attendances = instance.attendances || [];
                const presentCount = attendances.filter(
                  (a) => a.status === "출석"
                ).length;
                const absentCount = attendances.filter(
                  (a) => a.status === "결석"
                ).length;
                const lateCount = attendances.filter(
                  (a) => a.status === "지각"
                ).length;

                // 출석한 사람들의 check_in_time 중 하나를 가져옴
                const presentAttendance = attendances.find(
                  (a) => a.status === "출석" && a.check_in_time
                );
                const checkInTime = presentAttendance
                  ? presentAttendance.check_in_time
                  : null;

                return {
                  id: instance.id,
                  activityId: activity.id,
                  organization_id: orgId,
                  organization_name: this.getOrganizationName(orgId),
                  activity_name: activity.name,
                  meeting_date:
                    checkInTime ||
                    instance.start_datetime ||
                    instance.startDateTime ||
                    instance.created_at ||
                    instance.date,
                  meeting_time: this.formatMeetingTime(
                    checkInTime ||
                      instance.start_datetime ||
                      instance.startDateTime
                  ),
                  location: instance.location || "-",
                  present_count: presentCount,
                  absent_count: absentCount,
                  late_count: lateCount,
                  attendances: this.formatAttendances(attendances),
                  image:
                    instance.images && instance.images.length > 0
                      ? instance.images[0].filePath
                      : require("@/assets/images/basic_image.png"),
                };
              });
            }
            return [];
          });
        }

        // 날짜 필터 적용
        if (this.startDate) {
          meetings = meetings.filter((m) =>
            moment(m.meeting_date).isSameOrAfter(this.startDate)
          );
        }

        if (this.endDate) {
          meetings = meetings.filter((m) =>
            moment(m.meeting_date).isSameOrBefore(this.endDate)
          );
        }

        // 키워드 필터 적용
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase();
          meetings = meetings.filter(
            (m) =>
              m.activity_name.toLowerCase().includes(keyword) ||
              (m.location && m.location.toLowerCase().includes(keyword))
          );
        }

        this.meetings = meetings;
        console.log(
          `조직 ID ${orgId}의 모임 데이터 로드 완료:`,
          meetings.length
        );
      } catch (error) {
        console.error(
          `조직 ID ${orgId}의 모임 데이터 로딩 중 오류 발생:`,
          error
        );
        this.showDialog(
          "오류 발생",
          "모임 정보를 불러오는 중 오류가 발생했습니다."
        );

        // API가 실패한 경우 샘플 데이터 사용
        this.meetings = this.generateSampleMeetingsForOrg(orgId);
      } finally {
        this.loadingMeetings = false;
      }
    },

    generateSampleMeetingsForOrg(orgId) {
      const org = this.organizations.find((o) => o.id === orgId);
      if (!org) return [];

      const meetings = [];
      const meetingCount = Math.floor(Math.random() * 10) + 5; // 5~15개의 모임

      for (let i = 0; i < meetingCount; i++) {
        const meeting_date = moment()
          .subtract(i * 3, "days")
          .format("YYYY-MM-DD");

        // 날짜 필터 적용
        if (this.startDate && moment(meeting_date).isBefore(this.startDate))
          continue;
        if (this.endDate && moment(meeting_date).isAfter(this.endDate))
          continue;

        const activity_name = `${org.organization_name} ${
          ["주일예배", "금요예배", "새벽기도회", "셀모임", "성경공부"][i % 5]
        }`;

        // 키워드 필터 적용
        if (
          this.searchKeyword &&
          !activity_name
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase())
        )
          continue;

        const present_count = Math.floor(Math.random() * 10) + 5;
        const absent_count = Math.floor(Math.random() * 5);
        const late_count = Math.floor(Math.random() * 3);

        const meeting = {
          id: `${orgId}-${i}`,
          organization_id: orgId,
          organization_name: org.organization_name,
          activity_name,
          meeting_date,
          meeting_time: `${Math.floor(Math.random() * 12) + 10}:${
            Math.floor(Math.random() * 6) * 10
          }`,
          location: ["본당", "소예배실", "교육관", "카페", "온라인"][i % 5],
          present_count,
          absent_count,
          late_count,
          attendances: this.generateSampleAttendances(
            present_count + absent_count + late_count
          ),
        };

        meetings.push(meeting);
      }

      return meetings;
    },

    // 주간 선택 함수들
    selectCurrentWeek() {
      const now = moment();
      this.selectWeek(now);
    },

    selectPreviousWeek() {
      const lastWeek = moment().subtract(1, "week");
      this.selectWeek(lastWeek);
    },

    selectNextWeek() {
      const nextWeek = moment().add(1, "week");
      this.selectWeek(nextWeek);
    },

    selectWeek(date) {
      // 해당 주의 일요일 찾기
      const sunday = moment(date).day(0);
      // 해당 주의 토요일 찾기
      const saturday = moment(date).day(6);

      this.startDate = sunday.format("YYYY-MM-DD");
      this.endDate = saturday.format("YYYY-MM-DD");

      this.applyFilters();
    },

    // 모임명에 따른 요일 정보 가져오기
    getMeetingDayOfWeek(activityName) {
      const lowerName = activityName.toLowerCase();
      if (lowerName.includes("주일")) return "일요일";
      if (lowerName.includes("수요")) return "수요일";
      if (lowerName.includes("현장치유")) return "금요일";
      if (lowerName.includes("금요")) return "금요일";
      return "-";
    },
  },
};
</script>

<style scoped>
.organization-meeting-history-view {
  height: calc(100vh - 64px);
  padding: 16px;
}

.filter-section {
  z-index: 1;
}

.organization-tree,
.meeting-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

@media (max-width: 960px) {
  .organization-meeting-history-view {
    padding: 8px;
  }
}
</style>
