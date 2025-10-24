<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <v-col class="text-center">
        <div class="wc-direction-text wc-bold-600">모임 정보 수정</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center mt-5 px-15">
        <!-- 모임 사진 업로드 -->
        <v-card class="wc-card mb-7">
          <v-overlay :value="isUploading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
            <div class="mt-3">이미지 업로드 중...</div>
          </v-overlay>
          <v-img
            :src="meetingImageUrl || require('@/assets/images/basic_image.png')"
            height="220px"
            class="mx-auto full-size"
          ></v-img>
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
          @change="onFileChange"
        ></v-file-input>

        <!-- 모임 종류 표시 (수정 불가) -->
        <v-text-field
          v-model="meetingName"
          label="모임 종류"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          readonly
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>

        <!-- 모임 일정 -->
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
            @input="updateDates"
          ></v-date-picker>
        </v-menu>

        <!-- 시작 날짜 및 시간 -->
        <div class="date-time-section mb-4">
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

        <!-- 장소, 메모 입력 -->
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
        ></v-text-field>
        <v-textarea
          v-model="meetingNotes"
          label="모임 메모"
          background-color="#edeef3"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-textarea>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" class="pa-15 pt-4 pb-15">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="updateMeeting"
        >
          <span class="wc-h3">모임 정보 수정</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl.js';
  import { AttendanceCtrl } from '@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl';
  import { CurrentMemberCtrl } from '@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  import { dateTimeUtils } from '@/utils/dateTimeUtils';
  import { mapState } from 'vuex';

  // 유틸리티 함수 import
  import { getMemberStatus, getMemberStatusColor } from '@/utils/memberUtils';
  import { generateS3FileName, getFileExtension } from '@/utils/imageUtils';
  import {
    updateDateTime,
    validateTimes,
    updateMeetingDates,
    openParticipantsDialog,
    closeParticipantsDialog,
  } from '@/utils/vueComponentHelpers';

  export default {
    name: 'AttendanceUpdateView',
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
      // 자정을 넘어가는 모임인지 확인
      isOvernightMeeting() {
        return dateTimeUtils.isOvernightMeeting(
          this.meetingStartTime,
          this.meetingEndTime
        );
      },
    },
    data() {
      return {
        menu: false,
        photos: null,
        meetingImageUrl: null,
        meetingName: '',
        meetingDate: '',
        meetingDateMenu: false,
        numberOfParticipants: null,
        participantsDialog: false,
        memberList: [],
        meetingStartTime: '',
        meetingEndTime: '',
        meetingLocation: '',
        meetingNotes: '',
        activityId: null,
        activityInstanceId: null,
        originalImageInfo: null,
        isUploading: false,
        // 내부 DateTime 객체
        meetingStartDateTime: null,
        meetingEndDateTime: null,
        startDateMenu: false,
        meetingStartDate: '',
        endDateMenu: false,
        meetingEndDate: '',
      };
    },
    mixins: [Utility, CurrentMemberCtrl, AttendanceCtrl, AWSS3Ctrl],
    async created() {
      try {
        await this.fetchMemberList();
        await this.fetchMeetingData();
      } catch (error) {
        console.error('초기화 중 오류 발생:', error);
      }
    },
    methods: {
      /**
       * 내부 DateTime 객체 업데이트
       * @description vueComponentHelpers의 updateDateTime 함수 사용
       */
      updateDateTime() {
        updateDateTime(this);
      },

      /**
       * 모임 날짜 변경 시 시작/종료 날짜 업데이트
       * @description vueComponentHelpers의 updateMeetingDates 함수 사용
       */
      updateDates() {
        updateMeetingDates(this);
      },

      async fetchMeetingData() {
        const { organizationId, activityId, activityInstanceId } =
          this.$route.params;

        try {
          const response = await this.getActivityInstanceDetails(
            organizationId,
            activityId,
            activityInstanceId
          );

          if (response && response.data) {
            const activityInstance = response.data;
            this.activityId = activityId;
            this.activityInstanceId = activityInstanceId;
            this.meetingName = activityInstance.name || '';

            // UTC 문자열을 한국 시간대의 DateTime 객체로 변환
            const startDateTime = dateTimeUtils.fromUTCString(
              activityInstance.startDateTime
            );
            const endDateTime = dateTimeUtils.fromUTCString(
              activityInstance.endDateTime
            );

            // 내부 DateTime 객체 설정
            this.meetingStartDateTime = startDateTime.clone();
            this.meetingEndDateTime = endDateTime.clone();

            // UI 표시용 필드 업데이트
            this.meetingDate = startDateTime.format('YYYY-MM-DD'); // 모임 날짜
            this.meetingStartDate = startDateTime.format('YYYY-MM-DD');
            this.meetingStartTime = startDateTime.format('HH:mm');
            this.meetingEndDate = endDateTime.format('YYYY-MM-DD');
            this.meetingEndTime = endDateTime.format('HH:mm');
            this.meetingLocation = activityInstance.location || '';
            this.meetingNotes = activityInstance.notes || '';

            if (
              Array.isArray(this.memberList) &&
              Array.isArray(activityInstance.attendances)
            ) {
              this.memberList.forEach((member) => {
                member.isParticipating = false;
              });

              activityInstance.attendances.forEach((attendance) => {
                const member = this.memberList.find(
                  (m) => m.id === attendance.userId
                );
                if (member && attendance.status === '출석') {
                  member.isParticipating = true;
                }
              });

              this.numberOfParticipants = activityInstance.attendances.filter(
                (attendance) => attendance.status === '출석'
              ).length;
            }

            // 이미지 정보 설정
            if (activityInstance.images && activityInstance.images.length > 0) {
              this.meetingImageUrl = activityInstance.images[0].filePath;
              this.originalImageInfo = activityInstance.images[0];
            }
          } else {
            console.error('API 응답이 없거나 유효하지 않습니다.');
          }
        } catch (error) {
          console.error('모임 데이터 조회 중 오류 발생:', error);
          alert('모임 정보를 불러오는데 실패했습니다.');
        }
      },

      async updateMeeting() {
        if (!this.meetingDate) {
          alert('필수 정보를 모두 입력해주세요.');
          return;
        }

        // 내부 DateTime 객체 업데이트
        this.updateDateTime();

        // 인스턴스 데이터 준비 (UTC ISO 형식으로 변환)
        const activityData = {
          startDateTime: dateTimeUtils.toUTCString(this.meetingStartDateTime),
          endDateTime: dateTimeUtils.toUTCString(this.meetingEndDateTime),
          location: this.meetingLocation || '',
          notes: this.meetingNotes || '',
        };

        const attendances = this.memberList.map((member) => ({
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

        try {
          // 이미지 처리
          let imageInfo = null;
          if (this.photos) {
            this.isUploading = true; // 업로드 시작
            // 기존 이미지 삭제
            if (this.originalImageInfo) {
              await this.s3DeleteFile(this.originalImageInfo.fileName, true);
            }

            // 새 이미지 업로드
            const uploadResult = await this.uploadImageToS3();
            if (uploadResult) {
              imageInfo = {
                url: uploadResult.url,
                fileName: uploadResult.fileName,
                fileSize: this.photos.size,
                fileType: this.photos.type,
              };
            }
          }

          const response = await this.updateAttendance(
            this.currentOrganizationId,
            this.activityId,
            this.activityInstanceId,
            activityData,
            attendances,
            imageInfo
          );

          if (response) {
            alert('모임 정보가 성공적으로 업데이트되었습니다.');
            this.$router.push({ name: 'MeetingHistoryView' });
          } else {
            throw new Error('모임 정보 업데이트에 실패했습니다.');
          }
        } catch (error) {
          console.error('❌ 모임 정보 수정 중 오류 발생:', error);
          alert('모임 정보 수정에 실패했습니다. 다시 시도해 주세요.');
        } finally {
          this.isUploading = false; // 업로드 완료 또는 실패 시
        }
      },

      /**
       * 회원 목록 조회
       * @async
       * @returns {Promise<void>}
       */
      async fetchMemberList() {
        try {
          const response = await this.getOrganizationMembers(
            this.currentOrganizationId
          );
          if (response && response.members) {
            this.memberList = response.members.map((member) => ({
              ...member,
              isParticipating: false,
            }));
          }
        } catch (error) {
          console.error('멤버 목록 조회 중 오류 발생:', error);
        }
      },

      /**
       * 시간 입력값 변경 시 유효성 검증
       * @description vueComponentHelpers의 validateTimes 함수 사용
       */
      validateTimes() {
        validateTimes(this);
      },
      onFileChange(file) {
        if (file) {
          // file이 File 객체인 경우
          if (file instanceof File) {
            this.meetingImageUrl = URL.createObjectURL(file);
          }
          // file이 배열인 경우 (multiple 속성이 true일 때)
          else if (
            Array.isArray(file) &&
            file.length > 0 &&
            file[0] instanceof File
          ) {
            this.meetingImageUrl = URL.createObjectURL(file[0]);
          }
          // file이 null인 경우 (파일 선택이 취소되었을 때)
          else if (file === null) {
            this.meetingImageUrl = null;
          }
          // 그 외의 경우
          else {
            console.error('Unexpected file format:', file);
            this.meetingImageUrl = null;
          }
        } else {
          this.meetingImageUrl = null;
        }
      },
      /**
       * 참가자 다이얼로그 열기
       * @description vueComponentHelpers의 openParticipantsDialog 함수 사용
       */
      openParticipantsDialog() {
        openParticipantsDialog(this);
      },

      /**
       * 참가자 다이얼로그 닫기
       * @description vueComponentHelpers의 closeParticipantsDialog 함수 사용
       */
      closeParticipantsDialog() {
        closeParticipantsDialog(this);
      },
      /**
       * 멤버 상태 조회
       * @param {Object} member - 멤버 객체
       * @returns {string} 상태명
       */
      getMemberStatus(member) {
        return getMemberStatus(member);
      },

      /**
       * 멤버 상태 색상 조회
       * @param {Object} member - 멤버 객체
       * @returns {string} 색상 코드
       */
      getMemberStatusColor(member) {
        return getMemberStatusColor(member);
      },
      /**
       * 이미지를 S3에 업로드하는 함수
       * @description imageUtils의 generateS3FileName을 사용하여 파일명 생성
       */
      async uploadImageToS3() {
        if (!this.photos) {
          return null;
        }

        const file = this.photos;

        // imageUtils의 generateS3FileName 사용
        const { fileName, filePath } = generateS3FileName({
          organizationId: this.currentOrganizationId,
          activityId: this.activityId,
          activityName: this.meetingName,
          fileExtension: getFileExtension(file.name),
          prefix: 'meetings/',
        });

        try {
          const result = await this.s3CreateFile(filePath, file, true);
          if (result) {
            return { url: result.filePath, fileName };
          } else {
            throw new Error('이미지 업로드 결과가 없습니다.');
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          return null;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  // 모듈 스타일 import
  @import '@/styles/modules/attendance.scss';
  @import '@/styles/modules/toggle-switch.scss';
  @import '@/styles/modules/date-group.scss';
</style>
