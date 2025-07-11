<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <v-col class="text-center">
        <div class="wc-direction-text wc-bold-600">새로운 모임 등록</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center mt-5 px-15">
        <!-- 모임 사진 업로드 -->
        <v-card class="wc-card mb-7">
          <v-img
            :src="meetingImageUrl || require('@/assets/images/basic_image.png')"
            height="220px"
            class="mx-auto full-size"
          >
            <!-- 로딩 오버레이 추가 -->
            <v-overlay
              :value="isUploading"
              absolute
              class="d-flex align-center justify-center"
            >
              <div class="text-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                ></v-progress-circular>
                <div class="mt-3 white--text">이미지 업로드 중...</div>
              </div>
            </v-overlay>
          </v-img>
        </v-card>
        <v-file-input
          v-model="photos"
          label="터치해서 사진 업로드"
          accept="image/*"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          prepend-icon=""
          class="mb-7 mx-auto"
          :rules="[rules.fileCount, rules.fileSize]"
          @change="onFileChange"
          :disabled="isUploading"
        ></v-file-input>

        <!-- 모임 종류 선택 -->
        <v-select
          v-model="selectedActivity"
          :items="formattedActivities"
          item-text="name"
          item-value="id"
          label="모임 종류 선택"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          @change="setMeetingName"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }} ({{ item.category }})
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{
                item.name.split(" (")[0]
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.category }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-select>

        <!-- 모임 날짜 선택 -->
        <div class="section-label mb-2">모임 일정</div>

        <!-- 모임 공식 날짜 -->
        <v-menu
          v-model="meetingDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          class="mb-7"
          width="100%"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="meetingDate"
              label="모임 날짜"
              color="#7EA394"
              background-color="#edeef3"
              readonly
              solo
              rounded
              flat
              dense
              v-bind="attrs"
              v-on="on"
              class="mb-7 mx-auto"
              style="width: 100%"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="meetingDate"
            no-title
            @input="onDateSelected"
          ></v-date-picker>
        </v-menu>

        <!-- 권장 요일 안내 표시 -->
        <div
          v-if="selectedActivity && getRecommendedDayOfWeek()"
          class="recommended-day-text mb-4"
        >
          <v-icon small color="info" class="mr-1">mdi-information</v-icon>
          <span
            >{{ getActivityName() }}은(는) {{ getRecommendedDayOfWeekText() }}에
            진행되는 모임입니다.</span
          >
        </div>

        <!-- 시작 날짜 및 시간 -->
        <div class="date-time-section mb-7">
          <div class="section-title mb-1">시작 일시</div>
          <div>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
              class="mb-7"
              width="100%"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="meetingStartDate"
                  label="시작 날짜"
                  color="#7EA394"
                  background-color="#edeef3"
                  readonly
                  solo
                  rounded
                  flat
                  dense
                  v-bind="attrs"
                  v-on="on"
                  class="mb-7"
                  style="width: 100%"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="meetingStartDate"
                no-title
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="meetingStartTime"
              label="시작 시간"
              type="time"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              dense
              hide-details="auto"
              style="width: 100%"
              @change="validateTimes"
              @focus="startEditing('meetingStartTime')"
              @blur="finishEditing"
              ref="meetingStartTime"
            ></v-text-field>
          </div>
        </div>

        <!-- 종료 날짜 및 시간 -->
        <div class="date-time-section mb-7">
          <div class="section-title mb-1">종료 일시</div>
          <div>
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
              class="mb-7"
              width="100%"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="meetingEndDate"
                  label="종료 날짜"
                  color="#7EA394"
                  background-color="#edeef3"
                  readonly
                  solo
                  rounded
                  flat
                  dense
                  v-bind="attrs"
                  v-on="on"
                  class="mb-7"
                  style="width: 100%"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="meetingEndDate"
                no-title
                @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="meetingEndTime"
              label="종료 시간"
              type="time"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              dense
              hide-details="auto"
              style="width: 100%"
              @change="validateTimes"
              @focus="startEditing('meetingEndTime')"
              @blur="finishEditing"
              ref="meetingEndTime"
            ></v-text-field>
          </div>
          <!-- 자정 넘김 알림 추가 -->
          <div v-if="isOvernightMeeting" class="midnight-notice mt-3">
            <v-icon small color="warning" class="mr-2"
              >mdi-clock-alert-outline</v-icon
            >
            <span>이 모임은 다음 날 종료됩니다</span>
          </div>
        </div>

        <!-- 모임 참여자 수 입력 -->
        <v-dialog v-model="participantsDialog">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="numberOfParticipants"
              label="모임 참여자 수"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              dense
              hide-details="auto"
              class="mb-7 mx-auto bg-transparent"
              type="number"
              v-bind="attrs"
              v-on="on"
              @click="openParticipantsDialog"
            ></v-text-field>
          </template>
          <v-card class="attendance-custom-dialog pa-3">
            <v-card-title class="headline">모임 참여자 선택</v-card-title>
            <v-card-text>
              <v-list class="attendance-custom-dialog">
                <v-list-item
                  class="mb-2"
                  v-for="member in memberList"
                  :key="member.id"
                >
                  <v-list-item-content>
                    <!-- 타이틀 글씨크기 굵게 -->
                    <v-list-item-title
                      class="wc-bold-600 wc-fs-18 wc-h3 wc-direction-text"
                      >{{ member.name }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="wc-bold-200 wc-fs-12 wc-caption wc-direction-text"
                    >
                      <v-chip x-small :color="getMemberStatusColor(member)">
                        {{ getMemberStatus(member) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <label class="switch">
                      <input type="checkbox" v-model="member.isParticipating" />
                      <span class="slider round"></span>
                    </label>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="wc-fs-16"
                color="primary"
                text
                @click="closeParticipantsDialog"
                >완료</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 시장소, 메모 입력 -->
        <v-text-field
          v-model="meetingLocation"
          label="모임 장소"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          @focus="startEditing('meetingLocation')"
          @blur="finishEditing"
          ref="meetingLocation"
        ></v-text-field>
        <v-textarea
          v-model="meetingNotes"
          label="모임 메모"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          @focus="startEditing('meetingNotes')"
          @blur="finishEditing"
          ref="meetingNotes"
        ></v-textarea>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" class="pa-15 pt-4 pb-15">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="submitMeeting"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          <template v-if="!isSubmitting">
            <span class="wc-h3">모임 정보 입력</span>
          </template>
          <template v-else>
            <span class="wc-h3">모임 정보 저장 중...</span>
          </template>
        </v-btn>
      </v-col>
    </v-row>

    <!-- 잘못된 요일 선택 경고 대화상자 -->
    <v-dialog v-model="dayOfWeekWarningDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">잘못된 요일 선택</v-card-title>
        <v-card-text>
          {{ selectedActivityName }}은(는) {{ recommendedDayOfWeekText }}에
          진행되는 모임입니다. <br /><br />
          선택한 날짜 {{ selectedDate }}는 {{ selectedDayOfWeekText }}입니다.
          <br /><br />
          권장되는 모임 날짜({{ recommendedDate }})로 변경하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="keepSelectedDate"
            >아니오, 유지합니다</v-btn
          >
          <v-btn text color="primary" @click="changeDateToRecommended"
            >예, 변경합니다</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 모임 정보 저장 로딩 인디케이터 다이얼로그 -->
    <v-dialog v-model="loadingState.isLoading" persistent max-width="400px">
      <v-card>
        <v-card-title class="headline">모임 정보 저장 중...</v-card-title>

        <v-card-text>
          <!-- 단계별 진행 상태 표시 -->
          <v-stepper v-model="loadingState.currentStep" vertical>
            <v-stepper-step step="1" :complete="loadingState.currentStep > 1">
              입력 정보 검증
            </v-stepper-step>

            <v-stepper-step step="2" :complete="loadingState.currentStep > 2">
              이미지 업로드
              <small v-if="loadingState.currentStep === 2">
                {{ getFileUploadStatus() }}
              </small>
            </v-stepper-step>

            <v-stepper-step step="3" :complete="loadingState.currentStep > 3">
              참석자 정보 준비
            </v-stepper-step>

            <v-stepper-step step="4" :complete="loadingState.currentStep > 4">
              모임 정보 저장
            </v-stepper-step>

            <v-stepper-step step="5"> 완료 </v-stepper-step>
          </v-stepper>

          <!-- 현재 진행 상태 및 예상 시간 -->
          <div class="loading-status pa-4">
            <v-progress-linear
              :value="loadingState.progressPercent"
              height="10"
              striped
              color="primary"
            ></v-progress-linear>

            <div class="mt-2 text-center">
              <div class="current-action">
                {{ loadingState.currentStepText }}
              </div>

              <div
                v-if="loadingState.estimatedTimeLeft"
                class="estimated-time grey--text"
              >
                예상 소요 시간: {{ loadingState.estimatedTimeLeft }}초
              </div>

              <div
                v-if="loadingState.hasLongDelay"
                class="delay-notice amber--text text--darken-2 mt-2"
              >
                <v-icon small color="amber darken-2"
                  >mdi-clock-alert-outline</v-icon
                >
                평소보다 시간이 더 소요되고 있습니다. 잠시만 기다려주세요.
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="loadingState.hasLongDelay">
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="cancelOperation"> 취소 </v-btn>
          <v-btn text color="primary" @click="continueWaiting">
            계속 기다리기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
import { Utility } from "@/mixins/apis_v2/utility/Utility";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";
import { AWSS3Ctrl } from "@/mixins/apis_v2/external/AWSS3Ctrl.js";
import moment from "moment-timezone";
import { dateTimeUtils } from "@/utils/dateTimeUtils";

export default {
  name: "MeetingRegistrationView",
  computed: {
    ...mapState("auth", ["userInfo"]),
    currentOrganizationId() {
      if (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.length > 0
      ) {
        return this.userInfo.roles[0].organizationId;
      }
      return null;
    },
    formattedActivities() {
      // 임시로 금요예배, 수요예배, 주일2부예배 제외
      const excludedActivities = ["금요예배", "수요예배", "주일2부예배"];

      // 화면 표시용 이름 매핑
      const displayNameMapping = {
        현장치유팀사역: "두란노사역자모임",
      };

      return this.activities
        .filter((activity) => !excludedActivities.includes(activity.name))
        .map((activity) => ({
          ...activity,
          name:
            displayNameMapping[activity.name.split(" (")[0]] ||
            activity.name.split(" (")[0],
        }));
    },
    // 자정을 넘어가는 모임인지 확인
    isOvernightMeeting() {
      return dateTimeUtils.isOvernightMeeting(
        this.meetingStartTime,
        this.meetingEndTime
      );
    },
  },
  data() {
    // 오늘 날짜를 가져옴
    const today = dateTimeUtils.getTodayString();

    return {
      menu: false,
      meetingDateMenu: false,
      meetingDate: today,
      photos: null,
      meetingImageUrl: null,
      selectedActivity: null,
      meetingName: "",
      // 날짜 관련 필드
      meetingStartDate: today,
      meetingEndDate: today,
      startDateMenu: false,
      endDateMenu: false,
      meetingStartTime: "",
      meetingEndTime: "",
      // 내부 DateTime 객체
      meetingStartDateTime: null,
      meetingEndDateTime: null,
      numberOfParticipants: null,
      activities: [], // 조직의 모든 활동 목록
      participantsDialog: false,
      memberList: [],
      meetingLocation: "",
      meetingNotes: "",
      finalData: null,
      roleInfo: {
        그룹장: { color: "#B3C6FF", priority: 1 }, // 파스텔 블루
        순장: { color: "#D6E0FF", priority: 1 }, // 연한 파스텔 블루
        EBS: { color: "#FFF4B3", priority: 2 }, // 파스텔 옐로우
        순원: { color: "#C2E0C2", priority: 3 }, // 파스텔 그린
        회원: { color: "#D6EAD6", priority: 3 }, // 연한 파스텔 그린
      },
      // 로딩 상태 관리
      loadingState: {
        isLoading: false,
        currentStep: 0,
        totalSteps: 5,
        currentStepText: "",
        progressPercent: 0,
        startTime: null,
        estimatedTimeLeft: null,
        hasLongDelay: false,
      },
      // 활동별 기본값 정의
      activityDefaults: {
        주일2부예배: {
          startTime: "10:00",
          endTime: "11:30",
          location: "커버넌트홀",
          notes: "예원교회 주일 2부예배",
          dayOfWeek: 0, // 일요일
        },
        주일3부예배: {
          startTime: "12:00",
          endTime: "13:20",
          location: "커버넌트홀",
          notes: "예원교회 주일 3부예배",
          dayOfWeek: 0, // 일요일
        },
        청년예배: {
          startTime: "14:30",
          endTime: "16:30",
          location: "커버넌트홀",
          notes: "예원교회 코람데오 청년선교회 예배",
          dayOfWeek: 0, // 일요일
        },
        수요예배: {
          startTime: "20:00",
          endTime: "20:50",
          location: "드림홀",
          notes: "예원교회 수요예배",
          dayOfWeek: 3, // 수요일
        },
        금요예배: {
          startTime: "20:20",
          endTime: "22:10",
          location: "커버넌트홀",
          notes: "예원교회 금요예배",
          dayOfWeek: 5, // 금요일
        },
        수요제자기도회: {
          startTime: "21:20",
          endTime: "22:10",
          location: "스카이아트홀",
          notes: "그리스도의 제자로 복음을 더욱 깊이 각인하는 시간",
          dayOfWeek: 3, // 수요일
        },
        현장치유팀사역: {
          startTime: "22:20",
          endTime: "23:20",
          location: "스카이아트홀",
          notes: "두란노의 응답 받아 성경적 전도운동의 증인으로 서는 시간",
          dayOfWeek: 5, // 금요일
        },
      },
      editingField: null,
      rules: {
        fileCount: (value) => {
          if (Array.isArray(value) && value.length > 1) {
            return "하나의 이미지만 업로드 가능합니다.";
          }
          return true;
        },
        fileSize: (value) => {
          if (!value) return true;
          const file = Array.isArray(value) ? value[0] : value;
          const size = file.size / 1024 / 1024; // MB 단위로 변환
          return size <= 3 || "파일 크기는 3MB를 초과할 수 없습니다.";
        },
      },
      isUploading: false,
      isSubmitting: false,
      // 요일 경고 대화상자 관련 상태
      dayOfWeekWarningDialog: false,
      selectedActivityName: "",
      recommendedDayOfWeekText: "",
      selectedDayOfWeekText: "",
      recommendedDate: "",
      selectedDate: "",
      // 요일 표시 텍스트 매핑
      dayOfWeekTexts: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ],
    };
  },
  mixins: [
    MasterCtrl,
    CurrentMemberCtrl,
    FileBins,
    Utility,
    AttendanceCtrl,
    AWSS3Ctrl,
  ],
  created() {
    // 내부 DateTime 객체 초기화
    this.meetingStartDateTime = dateTimeUtils.createDateTime(
      this.meetingStartDate
    );
    this.meetingEndDateTime = dateTimeUtils.createDateTime(this.meetingEndDate);

    this.fetchMemberList();
    this.fetchActivities();
  },
  methods: {
    // 1. 초기화 및 데이터 로딩 (페이지 진입 시 실행되는 기능들)
    /**
     * 회원 목록 조회
     * @async
     * @returns {Promise<void>}
     * @description
     * - 현재 조직의 모든 회원 정보를 가져옴
     * - 회원들을 역할(회장/부회장/총무/회원)과 상태(새가족/장기결석)에 따라 정렬
     * - memberList 상태를 업데이트하여 화면에 표시
     * @related closeParticipantsDialog에서 선택된 회원 수 계산에 사용
     */
    async fetchMemberList() {
      const organizationId = this.userInfo.roles[0].organizationId;
      let memberList = await this.getMembersWithRoles(organizationId, true);

      // 우선 순위에 따라 정렬
      memberList.sort((a, b) => {
        const getRolePriority = (member) => {
          return this.roleInfo[member.roleName]?.priority || 4;
        };

        if (a.isNewMember === "Y" && b.isNewMember !== "Y") return -1;
        if (a.isNewMember !== "Y" && b.isNewMember === "Y") return 1;
        if (a.isLongTermAbsentee === "Y" && b.isLongTermAbsentee !== "Y")
          return -1;
        if (a.isLongTermAbsentee !== "Y" && b.isLongTermAbsentee === "Y")
          return 1;

        return getRolePriority(a) - getRolePriority(b);
      });

      this.memberList = memberList;
    },

    /**
     * 활동 목록 조회
     * @async
     * @returns {Promise<void>}
     * @description
     * - 현재 조직의 모든 활동 유형을 가져옴 (예: 주일예배, 수요예배 등)
     * - activities 상태를 업데이트하여 모임 종류 선택 드롭다운에 표시
     * @related setMeetingName에서 선택된 활동에 따라 모임 이름 자동 설정에 사용
     */
    async fetchActivities() {
      try {
        console.log("📢 fetchActivities 함수 시작");

        if (!this.currentOrganizationId) {
          console.error("❌ 조직 ID를 찾을 수 없습니다.");
          return;
        }

        console.log("🏢 현재 조직 ID:", this.currentOrganizationId);

        const response = await this.getOrganizationActivities(
          this.currentOrganizationId,
          true
        );

        console.log("📥 API 응답 데이터:", response);

        if (
          response &&
          response.activities &&
          Array.isArray(response.activities)
        ) {
          console.log("✅ 활동 데이터 유효성 검사 통과");
          console.log("📋 원본 활동 데이터:", response.activities);

          this.activities = response.activities.map((activity) => ({
            id: activity.id,
            name: activity.name,
            category: activity.category,
            description: activity.description,
          }));

          console.log("🔄 변환된 활동 데이터:", this.activities);
        } else {
          console.error("❌ 활동 데이터가 예상한 형식이 아닙니다:", response);
          this.activities = [];
        }
      } catch (error) {
        console.error("❌ 활동 정보 조회 중 오류 발생:", error);
        this.activities = [];
      } finally {
        console.log("📢 fetchActivities 함수 종료");
      }
    },

    // 2. 모임 등록 프로세스 (사용자 입력 → 이미지 업로드 → 데이터 저장)
    /**
     * 모임 정보 제출
     * @async
     * @returns {Promise<void>}
     * @description
     * 모임 등록의 메인 프로세스:
     * 1. 필수 입력값 검증 (활동 유형, 날짜)
     * 2. 이미지가 있으면 uploadImageToS3 호출하여 업로드
     * 3. 참여자 정보 수집 (memberList에서 isParticipating이 true인 회원들)
     * 4. 모임 시간, 장소 등 인스턴스 데이터 준비
     * 5. 개발 모드면 확인 다이얼로그 표시, 아니면 바로 저장
     * @related uploadImageToS3
     */
    async submitMeeting() {
      if (this.isSubmitting) return; // 중복 제출 방지

      // 날짜 검증
      if (!this.validateSelectedDate()) {
        // 경고 대화상자가 표시되므로 여기서 함수 종료
        return;
      }

      try {
        this.isSubmitting = true;

        // 로딩 인디케이터 초기화 및 시작
        this.initLoadingState();
        this.updateLoadingState(1, "입력 정보 검증 중...", 10);

        console.log("🚀 submitMeeting 함수 시작");

        // 필수 입력값 검증
        if (!this.selectedActivity || !this.meetingDate) {
          console.warn("⚠️ 필수 정보 누락");
          alert("모임 종류와 날짜를 입력해주세요.");
          this.isSubmitting = false;
          this.loadingState.isLoading = false;
          return;
        }

        // 내부 DateTime 객체 최종 업데이트
        this.updateDateTime();

        // 이미지 업로드 단계로 진행
        this.updateLoadingState(2, "이미지 업로드 준비 중...", 20);

        // 이미지 업로드
        let imageInfo = null;
        if (this.photos) {
          try {
            this.updateLoadingState(2, "이미지 업로드 중...", 30);
            this.isUploading = true;

            // 파일 크기에 따른 예상 시간 계산
            const fileSizeMB = this.photos.size / (1024 * 1024);
            this.loadingState.estimatedTimeLeft = Math.round(fileSizeMB * 5); // 1MB당 약 5초 예상

            const uploadResult = await this.uploadImageToS3();
            if (uploadResult) {
              imageInfo = {
                url: uploadResult.url,
                fileName: uploadResult.fileName,
                fileSize: this.photos.size,
                fileType: this.photos.type,
              };
              console.log("📸 업로드된 이미지 정보:", imageInfo);
              this.updateLoadingState(2, "이미지 업로드 완료", 40);
            } else {
              throw new Error("이미지 업로드 실패");
            }
          } catch (error) {
            console.error("❌ 이미지 업로드 중 오류 발생:", error);
            alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.");
            this.isSubmitting = false;
            this.isUploading = false;
            this.loadingState.isLoading = false;
            return;
          } finally {
            this.isUploading = false;
          }
        } else {
          this.updateLoadingState(2, "이미지 없음, 다음 단계로 진행", 40);
        }

        // 참여자 정보 준비 단계로 진행
        this.updateLoadingState(3, "참여자 정보 준비 중...", 60);

        // 선택된 참여자 목록 가져오기
        const selectedParticipants = this.memberList.filter(
          (member) => member.isParticipating
        );
        console.log("👥 선택된 참여자:", selectedParticipants);

        // UTC 시간으로 변환
        const instanceData = {
          startDateTime: dateTimeUtils.toUTCString(this.meetingStartDateTime),
          endDateTime: dateTimeUtils.toUTCString(this.meetingEndDateTime),
          location: this.meetingLocation || "",
          notes: this.meetingNotes || "",
        };

        console.log(
          "📅 시작 시간:",
          this.meetingStartDateTime.format("YYYY-MM-DD HH:mm:ss")
        );
        console.log(
          "📅 종료 시간:",
          this.meetingEndDateTime.format("YYYY-MM-DD HH:mm:ss")
        );

        // 전체 멤버 목록에 대한 출석 정보 생성
        const allAttendances = this.memberList.map((member) => ({
          userId: member.id || member.userId,
          status: member.isParticipating ? "출석" : "결석",
          checkInTime: member.isParticipating
            ? instanceData.startDateTime
            : null,
          checkOutTime: member.isParticipating
            ? instanceData.endDateTime
            : null,
          note: "",
        }));

        // 최종 데이터 준비
        this.finalData = {
          organizationId: this.currentOrganizationId,
          activityId: this.selectedActivity,
          instanceData,
          attendances: allAttendances,
          imageInfo: imageInfo,
        };

        // 모임 정보 저장 단계로 진행
        this.updateLoadingState(4, "모임 정보 저장 중...", 80);

        // 개발 환경 체크 제거하고 바로 데이터 저장
        const response = await this.recordAttendance(
          this.finalData.organizationId,
          this.finalData.activityId,
          this.finalData.instanceData,
          this.finalData.attendances,
          this.finalData.imageInfo,
          process.env.NODE_ENV === "development" // showLog 파라미터는 유지
        );

        if (response.result === 0) {
          throw new Error("출석 정보 저장에 실패했습니다.");
        }

        // 완료 단계로 진행
        this.updateLoadingState(5, "모임 정보 저장 완료", 100);

        console.log("✅ 모임 정보 저장 성공");

        // 지연 후 로딩 다이얼로그 종료
        setTimeout(() => {
          this.loadingState.isLoading = false;
          alert("모임 정보가 성공적으로 저장되었습니다.");
          this.resetForm();
          this.$router.push({ name: "ServiceSelectionView" });
        }, 1000);
      } catch (error) {
        console.error("❌ 모임 정보 저장 중 오류 발생:", error);
        this.loadingState.isLoading = false;
        alert("모임 정보 저장에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * 이미지를 AWS S3에 업로드하는 함수
     * @async
     * @returns {Promise<{url: string, fileName: string}|null>} 업로드된 이미지의 URL과 파일명 또는 null
     */
    async uploadImageToS3() {
      if (!this.photos) {
        console.log("업로드할 이미지가 없습니다.");
        return null;
      }

      const file = Array.isArray(this.photos) ? this.photos[0] : this.photos;
      const fileExtension = file.name.split(".").pop();
      const organizationId = this.currentOrganizationId;
      const activityId = this.selectedActivity;
      const activityName =
        this.activities.find((a) => a.id === activityId)?.name || "unknown";
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];

      // 새로운 파일 이름 생성
      const newFileName = `org_${organizationId}_activity_${activityId}_${activityName}_instance_${timestamp}.${fileExtension}`;

      // 'meetings/' 폴더를 추가하여 파일 경로를 생성합니다.
      const filePath = `meetings/${newFileName}`;

      try {
        const result = await this.s3CreateFile(filePath, file, true);
        if (result) {
          console.log("이미지 업로드 성공:", result);
          return { url: result.filePath, fileName: newFileName };
        } else {
          throw new Error("이미지 업로드 결과가 없습니다.");
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return null;
      }
    },

    /**
     * 폼을 초기화하는 함수
     * @returns {void}
     * @description 모든 입력 필드와 상태를 기본값으로 재설정합니다
     */
    resetForm() {
      const today = dateTimeUtils.getTodayString();
      this.meetingImageUrl = null;
      this.selectedActivity = null;
      this.meetingName = "";
      this.meetingStartDate = today;
      this.meetingEndDate = today;
      this.meetingStartTime = "";
      this.meetingEndTime = "";
      this.numberOfParticipants = null;
      this.photos = null;
      this.meetingLocation = "";
      this.meetingNotes = "";
      this.memberList.forEach((member) => (member.isParticipating = false));
    },

    // 3. 참가자 관리 (참석자 선택 다이얼로그 관련 기능들)
    /**
     * 참가자 선택 다이얼로그 표시
     * @description
     * - 모임 참여자 수 입력 필드 클릭 시 호출
     * - memberList의 모든 회원을 선택 가능한 형태로 표시
     * - 각 회원의 역할과 상태(새가족/장기결석)를 구분하여 표시
     * @related closeParticipantsDialog, getMemberStatus, getMemberStatusColor
     */
    openParticipantsDialog() {
      this.participantsDialog = true;
    },

    /**
     * 참가자 선택 다이얼로그를 닫고 참가자 수를 업데이트하는 함수
     * @returns {void}
     */
    closeParticipantsDialog() {
      this.participantsDialog = false;
      this.numberOfParticipants = this.memberList.filter(
        (member) => member.isParticipating
      ).length;
      console.log("참여자 선택 후 memberList:", this.memberList);
    },

    /**
     * 회원의 상태를 반환하는 함수
     */
    getMemberStatus(member) {
      if (member.isNewMember === "Y") return "새가족";
      if (member.isLongTermAbsentee === "Y") return "장기결석";
      return member.roleName === "회원" ? "순원" : member.roleName || "순원";
    },

    /**
     * 회원의 상태에 따른 색상을 반환하는 함수
     */
    getMemberStatusColor(member) {
      if (member.isNewMember === "Y") return "#FFE0B3"; // 파스텔 주황색 (새가족)
      if (member.isLongTermAbsentee === "Y") return "#FFCCCC"; // 파스텔 빨간색 (장기결석자)

      const roleColors = {
        그룹장: "#B3C6FF", // 파스텔 블루
        순장: "#D6E0FF", // 연한 파스텔 블루
        EBS: "#FFF4B3", // 파스텔 옐로우
        순원: "#C2E0C2", // 파스텔 그린
        회원: "#D6EAD6", // 연한 파스텔 그린
      };

      return roleColors[member.roleName] || "#E0E0E0"; // 기본 연한 회색
    },

    // 4. UI 이벤트 핸들러 (사용자 인터랙션 처리)
    /**
     * 이미지 파일 선택 처리
     * @description
     * - 사용자가 이미지 파일을 선택하면 미리보기 URL 생성
     * - 선택된 이미지는 나중에 submitMeeting에서 S3에 업로드
     * @related submitMeeting에서 uploadImageToS3 호출 시 사용
     */
    async onFileChange() {
      if (this.photos) {
        const file = Array.isArray(this.photos) ? this.photos[0] : this.photos;
        if (file) {
          try {
            const size = file.size / 1024 / 1024; // MB로 변환

            if (size > 3) {
              // 3MB 초과 시 압축
              console.log(`원본 이미지 크기: ${size.toFixed(2)}MB`);
              this.isUploading = true;

              // 이미지 압축
              const compressedBlob = await this.compressImage(file);
              const compressedSize = compressedBlob.size / 1024 / 1024;
              console.log(`압축된 이미지 크기: ${compressedSize.toFixed(2)}MB`);

              // Blob을 File 객체로 변환
              const compressedFile = new File([compressedBlob], file.name, {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              });

              this.photos = compressedFile;
              this.meetingImageUrl = URL.createObjectURL(compressedFile);

              // 압축 결과 알림
              const compressionRate = (
                ((size - compressedSize) / size) *
                100
              ).toFixed(1);
              console.log(`이미지 압축률: ${compressionRate}%`);

              if (compressedSize > 3) {
                alert(
                  "이미지 압축 후에도 3MB를 초과합니다. 더 작은 이미지를 선택해주세요."
                );
                this.photos = null;
                this.meetingImageUrl = null;
                return;
              }
            } else {
              this.meetingImageUrl = URL.createObjectURL(file);
            }
          } catch (error) {
            console.error("이미지 압축 중 오류 발생:", error);
            alert("이미지 처리 중 오류가 발생했습니다.");
            this.photos = null;
            this.meetingImageUrl = null;
          } finally {
            this.isUploading = false;
          }
        }
      } else {
        this.meetingImageUrl = null;
      }
    },

    /**
     * 이미지 압축 함수
     * @param {File} file - 원본 이미지 파일
     * @param {number} maxSizeMB - 목표 파일 크기 (MB)
     * @returns {Promise<Blob>} 압축된 이미지 Blob
     */
    async compressImage(file, maxSizeMB = 3) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // 초기 품질 설정
            let quality = 0.7; // 초기 품질을 더 낮게 설정
            const maxSize = maxSizeMB * 1024 * 1024; // MB를 bytes로 변환

            // 이미지 크기 조정 (더 작은 최대 크기로 조정)
            const MAX_WIDTH = 1280; // 1920에서 1280으로 감소
            const MAX_HEIGHT = 720; // 1080에서 720으로 감소

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF"; // 배경을 흰색으로 설정
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const compressAndCheck = (currentQuality) => {
              const dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
              const binaryData = atob(dataUrl.split(",")[1]);
              const currentSize = binaryData.length;

              if (currentSize > maxSize && currentQuality > 0.1) {
                // 품질을 더 큰 폭으로 낮춤
                const newQuality =
                  currentQuality > 0.5
                    ? currentQuality - 0.2
                    : currentQuality - 0.1;
                compressAndCheck(Math.max(0.1, newQuality));
              } else {
                // Blob 생성
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                  byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: "image/jpeg" });
                resolve(blob);
              }
            };

            compressAndCheck(quality);
          };

          img.onerror = (error) => {
            reject(error);
          };
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    },

    /**
     * 내부 DateTime 객체 업데이트
     * @returns {void}
     */
    updateDateTime() {
      // 시작 시간 확인 및 기본값 설정
      const startTime = this.meetingStartTime || "00:00";
      const endTime = this.meetingEndTime || "00:00";

      // 내부 DateTime 객체 업데이트
      this.meetingStartDateTime = dateTimeUtils.createDateTime(
        this.meetingStartDate,
        startTime
      );

      this.meetingEndDateTime = dateTimeUtils.createDateTime(
        this.meetingEndDate,
        endTime
      );

      // 종료 시간이 시작 시간보다 이전인 경우 (날짜가 다름에도 불구하고)
      if (this.meetingEndDateTime.isBefore(this.meetingStartDateTime)) {
        // 자정을 넘기는 모임인 경우 (같은 날짜에 시작 시간 > 종료 시간)
        if (
          this.meetingStartDate === this.meetingEndDate &&
          startTime > endTime
        ) {
          // 종료 날짜를 다음날로 자동 설정
          this.meetingEndDateTime = dateTimeUtils
            .createDateTime(this.meetingStartDate, endTime)
            .add(1, "day");

          // UI 필드 업데이트
          this.meetingEndDate = this.meetingEndDateTime.format("YYYY-MM-DD");
        } else {
          // 그 외의 경우 - 종료 시간을 시작 시간 이후로 자동 설정 (1시간 후)
          this.meetingEndDateTime = this.meetingStartDateTime
            .clone()
            .add(1, "hour");

          // UI 필드 업데이트
          this.meetingEndDate = this.meetingEndDateTime.format("YYYY-MM-DD");
          this.meetingEndTime = this.meetingEndDateTime.format("HH:mm");
        }
      }
    },

    /**
     * 모임 날짜 변경 시 시작/종료 날짜 업데이트
     * @returns {void}
     */
    updateDates() {
      this.meetingDateMenu = false;

      // 모임 날짜가 변경되면 시작 날짜도 변경
      this.meetingStartDate = this.meetingDate;

      // 날짜 선택 시 요일 검증
      this.validateSelectedDate();

      // 시작 시간과 종료 시간이 설정되어 있는 경우에만 자정 넘김 확인
      if (this.meetingStartTime && this.meetingEndTime) {
        if (
          dateTimeUtils.isOvernightMeeting(
            this.meetingStartTime,
            this.meetingEndTime
          )
        ) {
          // 자정을 넘기는 모임인 경우 종료일은 다음날로 설정
          this.meetingEndDate = moment(this.meetingDate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        } else {
          // 자정을 넘기지 않는 모임인 경우 종료일 = 시작일
          this.meetingEndDate = this.meetingDate;
        }
      } else {
        // 시간이 설정되지 않은 경우 기본적으로 종료일 = 시작일
        this.meetingEndDate = this.meetingDate;
      }

      // 내부 DateTime 객체 업데이트
      this.updateDateTime();
    },

    /**
     * 주어진 요일에 해당하는 가장 최근 과거 날짜를 반환하는 함수
     * @param {number} dayOfWeek - 요일 (0: 일요일, 1: 월요일, ... 6: 토요일)
     * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
     */
    getNearestPastDate(dayOfWeek) {
      const today = moment();
      const todayDayOfWeek = today.day(); // 현재 요일 (0-6)

      let daysToSubtract;

      if (todayDayOfWeek === dayOfWeek) {
        // 오늘이 해당 요일이면 오늘 날짜 반환
        daysToSubtract = 0;
      } else if (todayDayOfWeek > dayOfWeek) {
        // 찾는 요일이 현재 요일보다 앞에 있으면 (예: 오늘이 수요일이고 일요일을 찾는 경우)
        daysToSubtract = todayDayOfWeek - dayOfWeek;
      } else {
        // 찾는 요일이 현재 요일보다 뒤에 있으면 (예: 오늘이 화요일이고 금요일을 찾는 경우)
        // 이 경우 지난 주의 해당 요일을 계산
        daysToSubtract = 7 - (dayOfWeek - todayDayOfWeek);
      }

      // 지정된 일수만큼 오늘 날짜에서 빼기
      const targetDate = moment().subtract(daysToSubtract, "days");
      return targetDate.format("YYYY-MM-DD");
    },

    /**
     * 선택된 모임 유형에 따라 모임 이름과 날짜를 설정하는 함수
     * @returns {void}
     */
    setMeetingName() {
      const selectedActivity = this.activities.find(
        (a) => a.id === this.selectedActivity
      );

      if (selectedActivity && this.activityDefaults[selectedActivity.name]) {
        const defaults = this.activityDefaults[selectedActivity.name];
        this.meetingStartTime = defaults.startTime;
        this.meetingEndTime = defaults.endTime;
        this.meetingLocation = defaults.location;
        this.meetingNotes = defaults.notes;

        // 요일 정보가 있으면 해당 요일의 가장 최근 과거 날짜로 설정
        if (defaults.dayOfWeek !== undefined) {
          this.meetingDate = this.getNearestPastDate(defaults.dayOfWeek);
          this.meetingStartDate = this.meetingDate;

          // 자정을 넘기는 모임인지 확인
          if (
            dateTimeUtils.isOvernightMeeting(
              defaults.startTime,
              defaults.endTime
            )
          ) {
            // 자정을 넘기는 모임인 경우 종료일은 다음날로 설정
            this.meetingEndDate = moment(this.meetingDate)
              .add(1, "day")
              .format("YYYY-MM-DD");
          } else {
            // 자정을 넘기지 않는 모임인 경우 종료일 = 시작일
            this.meetingEndDate = this.meetingDate;
          }
        }

        // 내부 DateTime 객체 업데이트
        this.updateDateTime();
      }
    },

    /**
     * 시간 입력값 변경 시 유효성 검증
     */
    validateTimes() {
      // 필요한 입력값이 모두 있는지 확인
      if (!this.meetingStartDate || !this.meetingEndDate) {
        return;
      }

      // 시간이 입력되지 않은 경우 기본값 설정
      if (!this.meetingStartTime) this.meetingStartTime = "00:00";
      if (!this.meetingEndTime) this.meetingEndTime = "00:00";

      // 내부 DateTime 객체 업데이트
      this.updateDateTime();
    },

    // 5. 데이터 CRUD 작업 (API 통신 관련 기본 함수들)
    /**
     * 데이터 생성 기본 함수
     * @async
     * @param {string} modelType - 생성할 데이터 모델 (Activity, Member 등)
     * @param {Object} data - 생성할 데이터 객체
     * @returns {Promise<Object|null>} 생성된 데이터 또는 실패 시 null
     * @description
     * - 모든 데이터 생성 작업의 기본 함수
     * - 에러 처리와 로깅을 포함
     * @related submitMeeting, createActivityData에서 사용
     */
    async createData(modelType, data) {
      try {
        console.log(`📝 ${modelType} 생성 시작:`, data);
        const result = await this.openCreateData(this[modelType], data, true);
        console.log(`✅ ${modelType} 생성 완료:`, result);
        return result;
      } catch (error) {
        console.error(`❌ ${modelType} 생성 실패:`, error);
        return null;
      }
    },

    /**
     * 데이터를 조회하는 함수
     * @async
     * @param {string} modelType - 모델 타입
     * @param {number|null} id - 조회할 데이터 ID
     * @returns {Promise<Object|null>} 조회된 데이터 또는 null
     */
    async readData(modelType, id = null) {
      try {
        let result;
        const startTime = performance.now();

        if (id) {
          console.log(`🔍 ${modelType} 상세 데이터 조회 중...`);
          result = await this.openReadDataItemById(modelType, id, true);
          console.log(`✅ ${modelType} 상세 데이터 조회 완료:`, result);
        } else {
          console.log(`🔍 ${modelType} 전체 목록 조회 중...`);
          result = await this.openReadDataList(modelType, true);
          console.log(
            `✅ ${modelType} 목록 조회 완료 (총 ${result?.length || 0}건)`
          );
          console.log(`📊 조회된 데이터:`, result);
        }

        const endTime = performance.now();
        console.log(`⏱️ 수행 시간: ${(endTime - startTime).toFixed(2)}ms`);

        return result;
      } catch (error) {
        console.error(`❌ ${modelType} 조회 중 오류 발생:`, error);
        console.error(`오류 상세 정보:`, {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        return null;
      } finally {
        console.log(`🔚 ${modelType} 데이터 조회 종료\n`);
      }
    },

    /**
     * 데이터를 수정하는 함수
     * @async
     * @param {string} modelType - 모델 타입
     * @param {number} id - 수정할 데이터 ID
     * @param {Object} data - 수정할 데이터
     * @returns {Promise<Object|null>} 수정된 데이터 또는 null
     */
    async updateData(modelType, id, data) {
      try {
        console.log(`📝 ${modelType} 수정 시작 (ID: ${id}):`, data);
        const result = await this.openUpdateData(
          this[modelType],
          id,
          data,
          true
        );
        console.log(`✅ ${modelType} 수정 완료:`, result);
        return result;
      } catch (error) {
        console.error(`❌ ${modelType} 수정 실패:`, error);
        return null;
      }
    },

    /**
     * 데이터를 삭제하는 함수
     * @async
     * @param {string} modelType - 모델 타입
     * @param {number} id - 삭제할 데이터 ID
     * @returns {Promise<boolean>} 삭제 성공 여부
     */
    async deleteData(modelType, id) {
      try {
        console.log(`🗑️ ${modelType} 삭제 시작 (ID: ${id})`);
        const result = await this.openDeleteData(this[modelType], id, true);
        console.log(`✅ ${modelType} 삭제 완료`);
        return result;
      } catch (error) {
        console.error(`❌ ${modelType} 삭제 실패:`, error);
        return null;
      }
    },

    // 6. 활동 데이터 관리 (활동 유형 관련 기능들)
    /**
     * 활동 데이터 생성 테스트
     * @async
     * @returns {Promise<void>}
     * @description
     * - 개발 환경에서 활동 데이터 생성을 테스트
     * - 실제 API 호출을 통해 활동 생성 프로세스 검증
     * - 상세한 로깅으로 문제 발생 시 디버깅 용이
     * @related createData, fetchActivities
     */
    async createActivityDataTest() {
      try {
        console.log("📝 함수 시작");

        const activityData = {
          name: "주일2부 예배",
          description: "주일 2부 예배 참석 및 말씀 나눔",
          activity_category_id: 1,
          organization_id: 117,
          is_recurring: true,
          location_type: "OFFLINE",
          location: "본당",
          online_link: null,
          default_start_time: "10:00:00",
          default_end_time: "11:30:00",
        };

        // 요청 전 데이터 확인
        console.log("📤 요청 데이터:", JSON.stringify(activityData, null, 2));

        const data = await this.openCreateData(
          this.Activity,
          activityData,
          true
        );

        console.log("📥 응답 데이터:", data);
      } catch (error) {
        console.error("❌ 활동 생성 중 오류 발생:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
    },

    /**
     * 활동 데이터를 생성하는 함수
     * @async
     * @returns {Promise<void>}
     */
    async createActivityData() {
      const newActiviyDataSet = await this.createActivityDataSet();
      console.log("🔄 생성된 데이터:", newActiviyDataSet);
      for (const activity of newActiviyDataSet) {
        const data = await this.openCreateData(this.Activity, activity, true);
        console.log("🔄 생성된 데이터:", data);
      }
    },

    /**
     * 필드 수정 시작
     * @param {string} field - 수정할 필드명
     */
    startEditing(field) {
      this.editingField = field;
      this.$nextTick(() => {
        const input = this.$refs[field]?.[0];
        if (input) {
          input.focus();
          input.select();
        }
      });
    },

    /**
     * 필드 수정 완료
     */
    finishEditing() {
      this.editingField = null;
    },

    /**
     * 날짜의 요일이 활동의 권장 요일과 일치하는지 검증하는 함수
     * @returns {boolean} 요일이 일치하면 true, 일치하지 않으면 false
     */
    validateSelectedDate() {
      if (!this.selectedActivity) return true;

      const activity = this.activities.find(
        (a) => a.id === this.selectedActivity
      );
      if (!activity || !this.activityDefaults[activity.name]) return true;

      const defaults = this.activityDefaults[activity.name];
      if (defaults.dayOfWeek === undefined) return true;

      const selectedDate = moment(this.meetingDate);
      const dayOfWeek = selectedDate.day();

      if (dayOfWeek !== defaults.dayOfWeek) {
        // 불일치 - 경고 대화상자 정보 설정
        // 화면 표시용 이름 매핑
        const displayNameMapping = {
          현장치유팀사역: "두란노사역자모임",
        };

        this.selectedActivityName =
          displayNameMapping[activity.name] || activity.name;
        this.recommendedDayOfWeekText = this.dayOfWeekTexts[defaults.dayOfWeek];
        this.selectedDayOfWeekText = this.dayOfWeekTexts[dayOfWeek];
        this.selectedDate = this.meetingDate;
        this.recommendedDate = this.getNearestPastDate(defaults.dayOfWeek);

        // 다이얼로그를 바로 표시하지 않고 UI에만 반영
        // 시각적 피드백을 위해 CSS 클래스 적용 (date-picker가 열려있을 때는 표시하지 않음)
        if (!this.meetingDateMenu) {
          // 잘못된 요일 선택 경고 대화상자 표시
          this.dayOfWeekWarningDialog = true;
        }

        return false;
      }

      return true;
    },

    /**
     * 권장 날짜로 변경하는 함수
     */
    changeDateToRecommended() {
      this.meetingDate = this.recommendedDate;
      this.meetingStartDate = this.recommendedDate;

      // 자정 넘김 처리
      if (
        dateTimeUtils.isOvernightMeeting(
          this.meetingStartTime,
          this.meetingEndTime
        )
      ) {
        this.meetingEndDate = moment(this.recommendedDate)
          .add(1, "day")
          .format("YYYY-MM-DD");
      } else {
        this.meetingEndDate = this.recommendedDate;
      }

      // 내부 DateTime 객체 업데이트
      this.updateDateTime();
      this.dayOfWeekWarningDialog = false;
    },

    /**
     * 선택한 날짜 유지 함수
     */
    keepSelectedDate() {
      this.dayOfWeekWarningDialog = false;
    },

    /**
     * 날짜 선택 시 호출되는 함수
     */
    onDateSelected() {
      this.meetingDateMenu = false;
      this.updateDates();
    },

    /**
     * 선택된 활동의 권장 요일을 반환하는 함수
     * @returns {number|null} 권장 요일 (0-6) 또는 null
     */
    getRecommendedDayOfWeek() {
      if (!this.selectedActivity) return null;

      const activity = this.activities.find(
        (a) => a.id === this.selectedActivity
      );
      if (!activity || !this.activityDefaults[activity.name]) return null;

      return this.activityDefaults[activity.name].dayOfWeek;
    },

    /**
     * 권장 요일 텍스트를 반환하는 함수
     * @returns {string} 요일 텍스트 (예: "일요일")
     */
    getRecommendedDayOfWeekText() {
      const dayOfWeek = this.getRecommendedDayOfWeek();
      return dayOfWeek !== null ? this.dayOfWeekTexts[dayOfWeek] : "";
    },

    /**
     * 선택된 활동 이름을 반환하는 함수
     * @returns {string} 활동 이름
     */
    getActivityName() {
      if (!this.selectedActivity) return "";

      const activity = this.activities.find(
        (a) => a.id === this.selectedActivity
      );

      if (!activity) return "";

      // 화면 표시용 이름 매핑
      const displayNameMapping = {
        현장치유팀사역: "두란노사역자모임",
      };

      return displayNameMapping[activity.name] || activity.name;
    },

    /**
     * 로딩 상태 초기화 함수
     */
    initLoadingState() {
      this.loadingState = {
        isLoading: true,
        currentStep: 0,
        totalSteps: 5,
        currentStepText: "준비 중...",
        progressPercent: 0,
        startTime: Date.now(),
        estimatedTimeLeft: null,
        hasLongDelay: false,
      };
    },

    /**
     * 로딩 상태 업데이트 함수
     * @param {number} step - 현재 단계 (1~5)
     * @param {string} text - 현재 단계 설명 텍스트
     * @param {number} progress - 진행률 (0~100)
     */
    updateLoadingState(step, text, progress) {
      this.loadingState.currentStep = step;
      this.loadingState.currentStepText = text;
      this.loadingState.progressPercent = progress;

      // 단계 전환 시 진동 피드백 (모바일에서만 동작)
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }

      // 장시간 소요 감지
      const currentTime = Date.now();
      const elapsedTime = (currentTime - this.loadingState.startTime) / 1000;

      if (elapsedTime > 15 && !this.loadingState.hasLongDelay) {
        this.loadingState.hasLongDelay = true;

        // 지연 감지 시 더 강한 진동 (모바일에서만 동작)
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 200]);
        }
      }
    },

    /**
     * 파일 업로드 상태 텍스트 반환 함수
     * @returns {string} 업로드 상태 설명 텍스트
     */
    getFileUploadStatus() {
      if (!this.photos) return "이미지 없음";

      const fileSizeMB = (this.photos.size / (1024 * 1024)).toFixed(1);
      return `${fileSizeMB}MB 이미지 업로드 중`;
    },

    /**
     * 작업 취소 함수
     */
    cancelOperation() {
      if (
        confirm(
          "정말 작업을 취소하시겠습니까?\n입력한 정보는 저장되지 않습니다."
        )
      ) {
        this.loadingState.isLoading = false;
        this.isSubmitting = false;
        this.isUploading = false;
      }
    },

    /**
     * 계속 기다리기 함수
     */
    continueWaiting() {
      this.loadingState.hasLongDelay = false;
    },
  },
};
</script>
<style scoped>
.attendance-custom-dialog {
  max-width: 500px;
  background-color: #edeef3;
}

.full-size {
  width: 100%;
  height: 100%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.new-member-chip {
  background-color: #ffc107; /* 노란색 */
  color: white;
}

.role-chip {
  background-color: #2196f3; /* 파란색 */
  color: white;
}

.absentee-chip {
  background-color: #ff9800; /* 주황색 */
  color: white;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.v-overlay__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
}

.v-btn.wc-btn {
  position: relative;
}

.v-btn.wc-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 새로 추가된 스타일 */
.section-label {
  font-weight: 600;
  color: #7ea394;
  font-size: 1.1rem;
  text-align: left;
  padding-left: 8px;
}

.section-title {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
  text-align: left;
  padding-left: 8px;
}

.date-time-section {
  background-color: rgba(126, 163, 148, 0.05);
  border-radius: 12px;
  padding: 12px 16px;
  border-left: 3px solid #7ea394;
}

.midnight-notice {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 8px 12px;
  margin: 10px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

/* 권장 요일 안내 텍스트 스타일 */
.recommended-day-text {
  background-color: rgba(33, 150, 243, 0.1);
  border-left: 3px solid #2196f3;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #555;
  text-align: left;
}

/* 잘못된 요일 선택 시 스타일 */
.wrong-day-warning {
  border: 1px solid #f44336 !important;
}

/* 로딩 상태 관련 스타일 */
.loading-status {
  background-color: rgba(245, 245, 245, 0.5);
  border-radius: 8px;
  margin-top: 16px;
}

.current-action {
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 4px;
}

.estimated-time {
  font-size: 0.85rem;
}

.delay-notice {
  font-size: 0.9rem;
  animation: pulse 2s infinite;
  background-color: rgba(255, 193, 7, 0.1);
  padding: 6px;
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 스텝퍼 사용자 정의 스타일 */
.v-stepper__step--active .v-stepper__step__step {
  background-color: #7ea394 !important;
}

.v-stepper__step--complete .v-stepper__step__step {
  background-color: #4caf50 !important;
}
</style>
