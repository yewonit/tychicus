<template>
  <v-container class="meeting-history-view">
    <v-row v-if="loading" justify="center" align="center" class="mt-10">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        ></v-progress-circular>
        <div class="mt-3 wc-h4">미팅 목록을 불러오는 중...</div>
      </v-col>
    </v-row>

    <v-row v-else-if="meetings.length > 0">
      <v-col
        v-for="meeting in meetings"
        :key="meeting.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="wc-card ma-10 mb-5 mt-5 pb-1 fadeIn">
          <v-img
            height="200px"
            class="meeting-image"
            :class="{ 'no-image': !meeting.image }"
            :src="meeting.image || require('@/assets/images/basic_image.png')"
          ></v-img>
          <div class="wc-h3 ma-3 mb-0 pa-0 pl-1 d-flex align-center">
            <v-chip
              x-small
              :color="getWeekTagColor(meeting.date)"
              :dark="needsDarkText(meeting.date)"
              class="week-tag font-weight-bold px-2"
              v-if="meeting.date !== '날짜 미정'"
            >
              {{ getMonthWeekTag(meeting.date) }}
            </v-chip>
            {{ meeting.activityName }}
          </div>
          <div class="wc-h4 ma-3 mt-0 pa-0 pl-1 mt-2">
            <v-icon small class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(meeting.date) }}
          </div>
          <div class="created-at ma-3 mt-0 pa-0 pl-1">
            <v-icon small class="mr-1">mdi-clock-outline</v-icon>
            모임 기록일시: {{ formatDateTime(meeting.createdAt) }}
          </div>
          <v-card-actions class="justify-space-between">
            <div class="action-buttons">
              <v-btn
                icon
                class="mr-1 action-icon"
                @click="editMeeting(meeting)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon class="action-icon" @click="deleteMeeting(meeting)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
            <v-btn
              text
              color="primary"
              class="details-btn"
              @click="viewMeetingDetails(meeting)"
            >
              <v-icon left>mdi-eye</v-icon>
              <span class="wc-h4">상세보기</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-card class="pa-5">
          <v-card-text>
            <p class="wc-h3 mb-3">등록된 미팅이 없습니다.</p>
            <p class="wc-body">새로운 미팅을 등록해 주세요.</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="goToAttendanceInput">
              <v-icon left>mdi-plus</v-icon>
              새 미팅 등록
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      class="wc-floating-btn"
      fab
      dark
      color="primary"
      fixed
      bottom
      right
      @click="goToAttendanceInput"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">안내</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { AttendanceCtrl } from '@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl';
  import { mapGetters } from 'vuex';

  export default {
    name: 'MeetingHistoryView',
    mixins: [AttendanceCtrl],
    data() {
      return {
        meetings: [],
        basicImage: require('@/assets/images/basic_image.png'),
        dialog: false,
        dialogMessage: '',
        loading: false,
      };
    },
    computed: {
      ...mapGetters({
        userInfo: 'auth/userInfo',
      }),
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
    },
    created() {
      if (this.currentOrganizationId) {
        this.fetchMeetings();
      } else {
        console.error('조직 ID를 찾을 수 없습니다.');
      }
    },
    methods: {
      async fetchMeetings() {
        console.log('🚀 미팅 정보 조회를 시작합니다.');
        this.loading = true;
        try {
          console.log(
            `📊 조직 ID ${this.currentOrganizationId}에 대한 활동 정보를 요청합니다.`
          );
          const response = await this.getOrganizationActivities(
            this.currentOrganizationId,
            true
          );
          console.log('✅ 활동 정보 요청 완료:', response);

          if (
            response &&
            response.activities &&
            Array.isArray(response.activities)
          ) {
            console.log(
              `🔍 ${response.activities.length}개의 활동을 처리합니다.`
            );
            this.meetings = response.activities.flatMap((activity) => {
              console.log(`📌 활동 "${activity.name}" 처리 중...`);
              if (activity.instances && activity.instances.length > 0) {
                console.log(
                  `🗓️ ${activity.instances.length}개의 인스턴스를 발견했습니다.`
                );
                return activity.instances.map((instance) => {
                  console.log(`📅 인스턴스 ID ${instance.id} 처리 중...`);
                  return {
                    id: instance.id,
                    activityId: activity.id,
                    activityName: activity.name,
                    date: instance.start_datetime || '날짜 미정',
                    image:
                      instance.images && instance.images.length > 0
                        ? instance.images[0].filePath
                        : this.basicImage,
                    category: activity.category,
                    createdAt:
                      instance.created_at ||
                      instance.createdAt ||
                      new Date().toISOString(),
                  };
                });
              }
              console.log(`⚠️ 활동 "${activity.name}"에 인스턴스가 없습니다.`);
              return [];
            });

            // 최신순으로 정렬 (날짜 기준)
            this.meetings.sort((a, b) => {
              if (a.date === '날짜 미정') return 1;
              if (b.date === '날짜 미정') return -1;
              return new Date(b.date) - new Date(a.date);
            });

            console.log(
              `✅ 총 ${this.meetings.length}개의 미팅 정보를 처리했습니다.`
            );
          } else {
            console.error('❌ 활동 데이터가 예상한 형식이 아닙니다:', response);
            this.meetings = [];
          }
        } catch (error) {
          console.error('🚨 미팅 정보 조회 중 오류 발생:', error);
          this.meetings = [];
        } finally {
          this.loading = false;
          console.log('🏁 미팅 정보 조회를 완료했습니다.');
        }
      },
      getMonthWeekTag(dateString) {
        if (dateString === '날짜 미정') return '';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const weekInfo = this.getWeekOfMonth(date);
        return `${weekInfo.month}월 ${weekInfo.weekNumber}주차`;
      },
      getWeekOfMonth(date) {
        // 현재 날짜의 연, 월 정보
        const year = date.getFullYear();
        const month = date.getMonth();

        // 해당 날짜가 속한 주의 일요일 찾기
        const sundayOfWeek = new Date(date);
        while (sundayOfWeek.getDay() !== 0) {
          sundayOfWeek.setDate(sundayOfWeek.getDate() - 1); // 해당 주의 일요일로 이동
        }

        // 이 날짜의 일요일이 현재 월에 속하는지 확인
        if (sundayOfWeek.getMonth() !== month) {
          // 일요일이 이전 달에 있으면 이전 달의 마지막 주차
          return {
            month: sundayOfWeek.getMonth() + 1, // 월은 0부터 시작하므로 +1
            weekNumber: this.getLastWeekOfMonth(sundayOfWeek),
          };
        }

        // 현재 월의 첫 일요일 찾기
        const firstSundayOfMonth = new Date(year, month, 1);
        while (firstSundayOfMonth.getDay() !== 0) {
          firstSundayOfMonth.setDate(firstSundayOfMonth.getDate() + 1);
        }

        // 첫 일요일부터 몇 주가 지났는지 계산
        const weekNumber =
          Math.floor(
            (sundayOfWeek - firstSundayOfMonth) / (7 * 24 * 60 * 60 * 1000)
          ) + 1;
        return {
          month: month + 1,
          weekNumber: Math.min(weekNumber, 5), // 5주차 상한 적용
        };
      },
      getLastWeekOfMonth(date) {
        // 이전 달의 마지막 주차 계산
        const lastDayOfPrevMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        );

        // 이전 달 마지막 일의 주차 계산
        const lastSundayOfMonth = new Date(lastDayOfPrevMonth);
        while (lastSundayOfMonth.getDay() !== 0) {
          lastSundayOfMonth.setDate(lastSundayOfMonth.getDate() - 1);
        }

        const firstSundayOfMonth = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );
        while (firstSundayOfMonth.getDay() !== 0) {
          firstSundayOfMonth.setDate(firstSundayOfMonth.getDate() + 1);
        }

        const weeksCount =
          Math.floor(
            (lastSundayOfMonth - firstSundayOfMonth) / (7 * 24 * 60 * 60 * 1000)
          ) + 1;
        return Math.min(weeksCount, 5);
      },
      getWeekTagColor(dateString) {
        if (dateString === '날짜 미정') return 'grey';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'grey';

        const weekInfo = this.getWeekOfMonth(date);
        const weekNumber = weekInfo.weekNumber;

        // 주차별로 다른 색상 반환
        const colors = [
          'primary', // 1주차: 기본 색상(파란색)
          'success', // 2주차: 초록색
          'warning', // 3주차: 주황색
          'error', // 4주차: 빨간색
          'purple', // 5주차: 보라색
        ];

        return colors[(weekNumber - 1) % colors.length];
      },
      needsDarkText(dateString) {
        if (dateString === '날짜 미정') return false;

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;

        const weekInfo = this.getWeekOfMonth(date);
        const weekNumber = weekInfo.weekNumber;

        // 2주차, 3주차만 어두운 텍스트 사용 (true는 흰색, false는 검은색 텍스트)
        return !(weekNumber === 2 || weekNumber === 3);
      },
      editMeeting(meeting) {
        this.$router.push({
          name: 'AttendanceUpdateView',
          params: {
            organizationId: this.currentOrganizationId,
            activityId: meeting.activityId,
            activityInstanceId: meeting.id,
          },
        });
      },
      async deleteMeeting(meeting) {
        console.log(`🗑️ 모임 삭제 시도:`, meeting);

        if (
          !confirm(`정말로 "${meeting.activityName}" 모임을 삭제하시겠습니까?`)
        ) {
          console.log('❌ 사용자가 삭제를 취소했습니다.');
          return;
        }

        try {
          console.log(`🔄 모임 삭제 중...`);
          console.log('현재 조직 ID:', this.currentOrganizationId);

          const { id: instanceId, activityId } = meeting;

          if (!activityId) {
            console.error('❌ 활동 ID를 찾을 수 없습니다.');
            this.showDialog(
              '모임 삭제에 실패했습니다. 활동 ID를 찾을 수 없습니다.'
            );
            return;
          }

          const response = await this.deleteActivityInstance(
            this.currentOrganizationId,
            activityId,
            instanceId,
            true
          );

          console.log('삭제 응답:', response);

          if (response && response.deletedActivityInstanceId) {
            console.log(`✅ 모임 ID ${instanceId} 삭제 성공`);
            this.showDialog(
              `모임 "${meeting.activityName}"이(가) 성공적으로 삭제되었습니다.`
            );
            await this.fetchMeetings();
          } else {
            console.error(`❌ 모임 ID ${instanceId} 삭제 실패:`, response);
            this.showDialog(
              `모임 "${meeting.activityName}" 삭제에 실패했습니다. 다시 시도해 주세요.`
            );
          }
        } catch (error) {
          console.error(`🚨 모임 삭제 중 오류 발생:`, error);
          this.showDialog(`모임 삭제 중 오류가 발생했습니다: ${error.message}`);
        }
      },
      async createNewMeeting() {
        console.log('새 모임 생성');
        const newActivity = {
          name: '새 모임',
          description: '새로운 모임 설명',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          organization_id: this.currentOrganizationId,
          category: '목장모임',
        };
        try {
          await this.createActivity(newActivity, true);
          this.fetchMeetings();
        } catch (error) {
          console.error('새 모임 생성 중 오류 발생:', error);
        }
      },
      viewMeetingDetails(meeting) {
        console.log('🔍 미팅 상세 정보 보기 시작');
        console.log('📦 전달할 미팅 데이터:', meeting);

        this.$router.push({
          name: 'MeetingDetailView',
          params: {
            organizationId: this.currentOrganizationId,
            activityId: meeting.activityId,
            activityInstanceId: meeting.id,
          },
        });

        console.log('✅ 미팅 상세 정보 페이지로 이동 완료');
      },
      goToAttendanceInput() {
        this.$router.push({ name: 'AttendanceInputView' });
      },
      showDialog(message) {
        this.dialogMessage = message;
        this.dialog = true;
      },
      formatDate(dateString) {
        if (dateString === '날짜 미정') return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '날짜 오류';
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        });
      },
      formatDateTime(dateString) {
        if (!dateString) return '등록일 정보 없음';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '날짜 오류';
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .meeting-history-view {
    padding-bottom: 80px;

    .wc-card {
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-5px);
      }
    }

    .meeting-image {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;

      &.no-image {
        background-color: #f0f0f0;
      }
    }

    .wc-floating-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100;
    }

    .wc-h4 {
      font-weight: bold;
    }

    .action-buttons {
      .v-btn.action-icon {
        margin: 0 2px;
        height: 40px;
        width: 40px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .details-btn {
      padding: 0 16px;
      height: 40px;
    }

    .created-at {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    .week-tag {
      font-size: 12px;
      font-weight: 600;
    }

    @media (max-width: 600px) {
      .action-buttons {
        .v-btn {
          height: 48px;
          width: 48px;
        }
      }

      .week-tag {
        font-size: 10px;
        padding: 0 4px !important;
      }
    }
  }
</style>
