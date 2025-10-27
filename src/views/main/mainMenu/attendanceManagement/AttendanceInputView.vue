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
              <v-list-item-title>
                {{ item.name.split(' (')[0] }}
              </v-list-item-title>
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
          <span>
            {{ getActivityName() }}은(는) {{ getRecommendedDayOfWeekText() }}에
            진행되는 모임입니다.
          </span>
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
            <v-icon small color="warning" class="mr-2">
              mdi-clock-alert-outline
            </v-icon>
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
                    >
                      {{ member.name }}
                    </v-list-item-title>
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
              >
                완료
              </v-btn>
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
          진행되는 모임입니다.
          <br />
          <br />
          선택한 날짜 {{ selectedDate }}는 {{ selectedDayOfWeekText }}입니다.
          <br />
          <br />
          권장되는 모임 날짜({{ recommendedDate }})로 변경하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="keepSelectedDate">
            아니오, 유지합니다
          </v-btn>
          <v-btn text color="primary" @click="changeDateToRecommended">
            예, 변경합니다
          </v-btn>
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

            <v-stepper-step step="5">완료</v-stepper-step>
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
                <v-icon small color="amber darken-2">
                  mdi-clock-alert-outline
                </v-icon>
                평소보다 시간이 더 소요되고 있습니다. 잠시만 기다려주세요.
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="loadingState.hasLongDelay">
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="cancelOperation">취소</v-btn>
          <v-btn text color="primary" @click="continueWaiting">
            계속 기다리기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl.js';
  import { AttendanceCtrl } from '@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl';
  import { CurrentMemberCtrl } from '@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  import { dateTimeUtils } from '@/utils/dateTimeUtils';
  import { mapState } from 'vuex';

  // 리팩토링된 유틸리티 함수들 import
  import {
    processImageFile,
    generateS3FileName,
    getFileExtension,
    validateImageSize,
    validateSingleFile,
  } from '@/utils/imageUtils';
  import {
    ACTIVITY_DEFAULTS,
    formatActivitiesForDisplay,
  } from '@/utils/activityDefaults';
  import {
    updateDateTime,
    validateTimes,
    updateMeetingDates,
    openParticipantsDialog,
    closeParticipantsDialog,
    initLoadingState,
    updateLoadingState,
    startEditingField,
    finishEditingField,
    resetMeetingForm,
    getFileUploadStatus,
  } from '@/utils/vueComponentHelpers';
  import {
    validateActivityDate,
    getActivityDefaults,
    getRecommendedDayOfWeek,
    getRecommendedDayOfWeekText,
    getActivityName,
  } from '@/utils/activityValidation';
  import { fetchMembersWithRoles } from '@/services/memberService';
  import { getMemberStatus, getMemberStatusColor } from '@/utils/memberUtils';

  export default {
    name: 'MeetingRegistrationView',
    computed: {
      ...mapState('auth', ['userInfo']),
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
      /**
       * 표시용으로 포맷팅된 활동 목록
       * @returns {Array} 필터링되고 포맷된 활동 목록
       */
      formattedActivities() {
        return formatActivitiesForDisplay(this.activities);
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
        meetingName: '',
        // 날짜 관련 필드
        meetingStartDate: today,
        meetingEndDate: today,
        startDateMenu: false,
        endDateMenu: false,
        meetingStartTime: '',
        meetingEndTime: '',
        // 내부 DateTime 객체
        meetingStartDateTime: null,
        meetingEndDateTime: null,
        numberOfParticipants: null,
        activities: [], // 조직의 모든 활동 목록
        participantsDialog: false,
        memberList: [],
        meetingLocation: '',
        meetingNotes: '',
        finalData: null,
        // 로딩 상태 관리
        loadingState: {
          isLoading: false,
          currentStep: 0,
          totalSteps: 5,
          currentStepText: '',
          progressPercent: 0,
          startTime: null,
          estimatedTimeLeft: null,
          hasLongDelay: false,
        },
        // 활동별 기본값 정의 (activityDefaults.js에서 import)
        activityDefaults: ACTIVITY_DEFAULTS,
        editingField: null,
        rules: {
          fileCount: validateSingleFile,
          fileSize: (value) => validateImageSize(value, 3),
        },
        isUploading: false,
        isSubmitting: false,
        // 요일 경고 대화상자 관련 상태
        dayOfWeekWarningDialog: false,
        selectedActivityName: '',
        recommendedDayOfWeekText: '',
        selectedDayOfWeekText: '',
        recommendedDate: '',
        selectedDate: '',
      };
    },
    mixins: [CurrentMemberCtrl, Utility, AttendanceCtrl, AWSS3Ctrl],
    created() {
      // 내부 DateTime 객체 초기화
      this.meetingStartDateTime = dateTimeUtils.createDateTime(
        this.meetingStartDate
      );
      this.meetingEndDateTime = dateTimeUtils.createDateTime(
        this.meetingEndDate
      );

      this.fetchMemberList();
      this.fetchActivities();
    },
    methods: {
      // 1. 초기화 및 데이터 로딩 (페이지 진입 시 실행되는 기능들)
      /**
       * 회원 목록 조회
       * @description memberService를 사용하여 정렬된 회원 목록 조회
       */
      async fetchMemberList() {
        const organizationId = this.userInfo.roles[0].organizationId;
        this.memberList = await fetchMembersWithRoles(organizationId);
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
          const response = await this.getActivityTemplate(true);

          if (response && response.data && Array.isArray(response.data)) {
            this.activities = response.data.map((activity) => ({
              id: activity.id,
              name: activity.name,
              description: activity.description,
              category: activity.activityCategory,
            }));
          } else {
            this.activities = [];
          }
        } catch (error) {
          console.error('❌ 활동 정보 조회 중 오류 발생:', error);
          this.activities = [];
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
          this.updateLoadingState(1, '입력 정보 검증 중...', 10);

          // 필수 입력값 검증
          if (!this.selectedActivity || !this.meetingDate) {
            console.warn('⚠️ 필수 정보 누락');
            alert('모임 종류와 날짜를 입력해주세요.');
            this.isSubmitting = false;
            this.loadingState.isLoading = false;
            return;
          }

          // 내부 DateTime 객체 최종 업데이트
          this.updateDateTime();

          // 이미지 업로드 단계로 진행
          this.updateLoadingState(2, '이미지 업로드 준비 중...', 20);

          // 이미지 업로드
          let imageInfo = null;
          if (this.photos) {
            try {
              this.updateLoadingState(2, '이미지 업로드 중...', 30);
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
                this.updateLoadingState(2, '이미지 업로드 완료', 40);
              } else {
                throw new Error('이미지 업로드 실패');
              }
            } catch (error) {
              console.error('❌ 이미지 업로드 중 오류 발생:', error);
              alert(
                '이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.'
              );
              this.isSubmitting = false;
              this.isUploading = false;
              this.loadingState.isLoading = false;
              return;
            } finally {
              this.isUploading = false;
            }
          } else {
            this.updateLoadingState(2, '이미지 없음, 다음 단계로 진행', 40);
          }

          // 참여자 정보 준비 단계로 진행
          this.updateLoadingState(3, '참여자 정보 준비 중...', 60);

          // UTC 시간으로 변환
          const activityData = {
            startDateTime: dateTimeUtils.toUTCString(this.meetingStartDateTime),
            endDateTime: dateTimeUtils.toUTCString(this.meetingEndDateTime),
            location: this.meetingLocation || '',
            notes: this.meetingNotes || '',
          };

          // 전체 멤버 목록에 대한 출석 정보 생성
          const allAttendances = this.memberList.map((member) => ({
            userId: member.id || member.userId,
            status: member.isParticipating ? '출석' : '결석',
            checkInTime: member.isParticipating
              ? activityData.startDateTime
              : null,
            checkOutTime: member.isParticipating
              ? activityData.endDateTime
              : null,
            note: '',
          }));

          // 최종 데이터 준비
          this.finalData = {
            organizationId: this.currentOrganizationId,
            activityTemplateId: this.selectedActivity,
            activityData,
            attendances: allAttendances,
            imageInfo: imageInfo,
          };

          // 모임 정보 저장 단계로 진행
          this.updateLoadingState(4, '모임 정보 저장 중...', 80);

          // 개발 환경 체크 제거하고 바로 데이터 저장
          await this.recordAttendance(
            this.finalData.organizationId,
            this.finalData.activityTemplateId,
            this.finalData.activityData,
            this.finalData.attendances,
            this.finalData.imageInfo
          );

          // 완료 단계로 진행
          this.updateLoadingState(5, '모임 정보 저장 완료', 100);

          // 지연 후 로딩 다이얼로그 종료
          setTimeout(() => {
            this.loadingState.isLoading = false;
            alert('모임 정보가 성공적으로 저장되었습니다.');
            this.resetForm();
            this.$router.push({ name: 'ServiceSelectionView' });
          }, 1000);
        } catch (error) {
          console.error('❌ 모임 정보 저장 중 오류 발생:', error);
          this.loadingState.isLoading = false;
          alert('모임 정보 저장에 실패했습니다. 다시 시도해 주세요.');
        } finally {
          this.isSubmitting = false;
        }
      },

      /**
       * 이미지를 AWS S3에 업로드하는 함수
       * @async
       * @returns {Promise<{url: string, fileName: string}|null>} 업로드된 이미지의 URL과 파일명 또는 null
       * @description imageUtils의 generateS3FileName을 사용하여 파일명 생성
       */
      async uploadImageToS3() {
        if (!this.photos) {
          return null;
        }

        const file = Array.isArray(this.photos) ? this.photos[0] : this.photos;
        const activityTemplateId = this.selectedActivity;
        const activityName =
          this.activities.find((a) => a.id === activityTemplateId)?.name ||
          'unknown';

        // imageUtils의 generateS3FileName 사용
        const { fileName, filePath } = generateS3FileName({
          organizationId: this.currentOrganizationId,
          activityId: activityTemplateId,
          activityName: activityName,
          fileExtension: getFileExtension(file.name),
          prefix: 'meetings/',
        });

        try {
          console.log('🔄 S3 업로드 시작:', {
            filePath,
            fileName,
            fileSize: file.size,
            fileType: file.type,
          });

          const result = await this.s3CreateFile(filePath, file);

          console.log('✅ S3 업로드 결과:', result);

          if (result && result.filePath) {
            return { url: result.filePath, fileName };
          } else {
            console.error('❌ S3 업로드 결과가 없습니다:', result);
            throw new Error(
              '이미지 업로드 결과가 없습니다. S3 업로드에 실패했습니다.'
            );
          }
        } catch (error) {
          console.error('❌ 이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          return null;
        }
      },

      /**
       * 폼을 초기화하는 함수
       * @description vueComponentHelpers의 resetMeetingForm 함수 사용
       */
      resetForm() {
        resetMeetingForm(this);
      },

      // 3. 참가자 관리 (참석자 선택 다이얼로그 관련 기능들)
      /**
       * 참가자 선택 다이얼로그 표시
       * @description vueComponentHelpers의 openParticipantsDialog 함수 사용
       */
      openParticipantsDialog() {
        openParticipantsDialog(this);
      },

      /**
       * 참가자 선택 다이얼로그를 닫고 참가자 수를 업데이트하는 함수
       * @description vueComponentHelpers의 closeParticipantsDialog 함수 사용
       */
      closeParticipantsDialog() {
        closeParticipantsDialog(this);
      },

      /**
       * 회원의 상태를 반환하는 함수
       * @description memberUtils의 getMemberStatus 사용
       */
      getMemberStatus(member) {
        return getMemberStatus(member);
      },

      /**
       * 회원의 상태에 따른 색상을 반환하는 함수
       * @description memberUtils의 getMemberStatusColor 사용
       */
      getMemberStatusColor(member) {
        return getMemberStatusColor(member);
      },

      // 4. UI 이벤트 핸들러 (사용자 인터랙션 처리)
      /**
       * 이미지 파일 선택 처리
       * @description imageUtils의 processImageFile 함수를 사용하여 자동 압축 처리
       */
      async onFileChange() {
        if (this.photos) {
          const file = Array.isArray(this.photos)
            ? this.photos[0]
            : this.photos;
          if (file) {
            try {
              this.isUploading = true;

              // imageUtils의 processImageFile 사용 (자동 압축 포함)
              const result = await processImageFile(file, 3);

              this.photos = result.file;
              this.meetingImageUrl = result.url;
            } catch (error) {
              console.error('이미지 처리 중 오류 발생:', error);
              alert(error.message || '이미지 처리 중 오류가 발생했습니다.');
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
       * 내부 DateTime 객체 업데이트
       * @returns {void}
       * @description vueComponentHelpers의 updateDateTime 함수 사용
       */
      updateDateTime() {
        updateDateTime(this);
      },

      /**
       * 모임 날짜 변경 시 시작/종료 날짜 업데이트
       * @returns {void}
       * @description 날짜 변경 시 요일 검증 추가
       */
      updateDates() {
        // 날짜 선택 시 요일 검증
        this.validateSelectedDate();
        // 공통 날짜 업데이트 로직
        updateMeetingDates(this);
      },

      /**
       * 선택된 모임 유형에 따라 모임 이름과 날짜를 설정하는 함수
       * @description activityValidation의 getActivityDefaults 사용
       */
      setMeetingName() {
        const defaults = getActivityDefaults(
          this.selectedActivity,
          this.activities,
          this.activityDefaults
        );

        if (defaults) {
          Object.assign(this, defaults);
          this.updateDateTime();
        }
      },

      /**
       * 시간 입력값 변경 시 유효성 검증
       * @description vueComponentHelpers의 validateTimes 함수 사용
       */
      validateTimes() {
        validateTimes(this);
      },

      /**
       * 필드 수정 시작
       * @param {string} field - 수정할 필드명
       * @description vueComponentHelpers의 startEditingField 함수 사용
       */
      startEditing(field) {
        startEditingField(this, field);
      },

      /**
       * 필드 수정 완료
       * @description vueComponentHelpers의 finishEditingField 함수 사용
       */
      finishEditing() {
        finishEditingField(this);
      },

      /**
       * 날짜의 요일이 활동의 권장 요일과 일치하는지 검증하는 함수
       * @description activityValidation의 validateActivityDate 사용
       */
      validateSelectedDate() {
        const result = validateActivityDate(
          this.meetingDate,
          this.selectedActivity,
          this.activities,
          this.activityDefaults
        );

        if (!result.isValid) {
          // 검증 실패 - 경고 대화상자 정보 설정
          this.selectedActivityName = result.selectedActivityName;
          this.recommendedDayOfWeekText = result.recommendedDayOfWeekText;
          this.selectedDayOfWeekText = result.selectedDayOfWeekText;
          this.selectedDate = result.selectedDate;
          this.recommendedDate = result.recommendedDate;

          // date-picker가 열려있지 않을 때만 경고 표시
          if (!this.meetingDateMenu) {
            this.dayOfWeekWarningDialog = true;
          }
        }

        return result.isValid;
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
          this.meetingEndDate = dateTimeUtils.getNextDay(this.recommendedDate);
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
       * @description activityValidation의 getRecommendedDayOfWeek 사용
       */
      getRecommendedDayOfWeek() {
        return getRecommendedDayOfWeek(
          this.selectedActivity,
          this.activities,
          this.activityDefaults
        );
      },

      /**
       * 권장 요일 텍스트를 반환하는 함수
       * @description activityValidation의 getRecommendedDayOfWeekText 사용
       */
      getRecommendedDayOfWeekText() {
        return getRecommendedDayOfWeekText(
          this.selectedActivity,
          this.activities,
          this.activityDefaults
        );
      },

      /**
       * 선택된 활동 이름을 반환하는 함수
       * @description activityValidation의 getActivityName 사용
       */
      getActivityName() {
        return getActivityName(this.selectedActivity, this.activities);
      },

      /**
       * 로딩 상태 초기화 함수
       * @description vueComponentHelpers의 initLoadingState 함수 사용
       */
      initLoadingState() {
        initLoadingState(this);
      },

      /**
       * 로딩 상태 업데이트 함수
       * @param {number} step - 현재 단계 (1~5)
       * @param {string} text - 현재 단계 설명 텍스트
       * @param {number} progress - 진행률 (0~100)
       * @description vueComponentHelpers의 updateLoadingState 함수 사용
       */
      updateLoadingState(step, text, progress) {
        updateLoadingState(this, step, text, progress);
      },

      /**
       * 파일 업로드 상태 텍스트 반환 함수
       * @returns {string} 업로드 상태 설명 텍스트
       * @description vueComponentHelpers의 getFileUploadStatus 함수 사용
       */
      getFileUploadStatus() {
        return getFileUploadStatus(this);
      },

      /**
       * 작업 취소 함수
       */
      cancelOperation() {
        if (
          confirm(
            '정말 작업을 취소하시겠습니까?\n입력한 정보는 저장되지 않습니다.'
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

<style lang="scss" scoped>
  @import '@/styles/modules/attendance-input.scss';
</style>
