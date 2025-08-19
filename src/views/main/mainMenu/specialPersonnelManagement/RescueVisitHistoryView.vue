<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col class="text-center">
        <v-icon size="140" class="ma-3 mt-6 fadeIn" color="#262626">
          mdi-account
        </v-icon>
        <div class="wc-h3 ma-3 pa-0">{{ absentee.name }}</div>
        <div class="wc-info-light ma-0 pa-1">
          최근출석일자: {{ absentee.last_attendance_day }}
        </div>
        <div class="wc-info-light ma-0 pa-1">
          교회등록일자: {{ absentee.church_registration_date }}
        </div>
      </v-col>
      <v-col cols="12" class="mt-9 px-20" v-if="visits.length > 0">
        <v-card
          v-for="visit in visits"
          :key="visit.id"
          :class="{ 'wc-card': true, 'mb-12': true, 'pa-4': true }"
        >
          <v-card-title primary-title>
            <v-icon class="mr-2">mdi-calendar</v-icon>
            {{ visit.visitation_date }}
          </v-card-title>
          <v-card-text>{{ visit.visitation_content }}</v-card-text>
          <v-card-actions class="ma-0 pa-0">
            <v-btn
              icon
              class="ma-0 ml-3 pa-0"
              @click.stop="editVisit(visit.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon class="ma-0 pa-0" @click.stop="deleteVisit(visit.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" class="text-center mt-9 px-20" v-else>
        <v-card class="wc-card">
          <v-card-text>심방 이력이 없습니다.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      fab
      dark
      large
      color="primary"
      fixed
      bottom
      right
      class="ma-4"
      @click="openAddVisitDialog"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <!-- Add Visit Dialog -->
    <v-dialog v-model="addVisitDialog" max-width="500px">
      <v-card class="add-visit-history-dialog pa-3 pt-5 pb-5">
        <v-card-title class="justify-space-between pb-5">
          <span class="headline">심방 정보 추가</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newVisit.visitation_date"
                  background-color="#edeef3"
                  color="#7EA394"
                  label="심방 날짜"
                  type="date"
                  solo
                  flat
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="ma-0 pa-3 custom-cols">
                <v-textarea
                  v-model="newVisit.visitation_content"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  label="심방 내용"
                  hide-details="auto"
                  class="mt-5 mb-5 custom-textarea"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeAddVisitDialog">
            취소
          </v-btn>
          <v-btn color="green darken-1" text @click="saveVisit">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Visit Dialog -->
    <v-dialog v-model="editVisitDialog" max-width="500px">
      <v-card class="edit-visit-history-dialog pa-3 pt-5 pb-5">
        <v-card-title class="justify-space-between pb-5">
          <span class="headline">심방 정보 수정</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="currentVisit.visitation_date"
                  background-color="#edeef3"
                  color="#7EA394"
                  label="심방 날짜"
                  type="date"
                  solo
                  flat
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="ma-0 pa-3 custom-cols">
                <!--v텍스트에어리어말고 일반 택스트에어리어 -->
                <v-textarea
                  v-model="currentVisit.visitation_content"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  label="레이블이 입력됩니다"
                  hide-details="auto"
                  class="mt-5 mb-5 custom-textarea"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="editVisitDialog = false">
            취소
          </v-btn>
          <v-btn color="green darken-1" text @click="saveEditedVisit">
            저장
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { VisitManagementCtrl } from '@/mixins/apis_v2/internal/domainCtrl/VisitManagementCtrl';
  import { mapState } from 'vuex';

  export default {
    name: 'RescueVisitHistoryView',
    mixins: [MasterCtrl, VisitManagementCtrl],
    computed: {
      ...mapState('auth', ['userInfo']),
    },
    data() {
      return {
        // 데이트 피커
        date: null,
        menu: false,
        modal: false,
        menu2: false,
        activePicker: null,
        absentee: {},
        visits: [],
        addVisitDialog: false,
        newVisit: {
          visitor_id: null,
          visitee_id: null,
          visitation_date: '',
          visitation_content: '',
          is_deleted: 'N',
          creator_id: null,
          updater_id: null,
          creator_ip: '127.0.0.1',
          updater_ip: '127.0.0.1',
          access_service_id: 'web',
        },
        // existing properties
        editVisitDialog: false,
        currentVisit: {
          id: null,
          visitation_date: '',
          visitation_content: '',
        },
      };
    },
    created() {
      const absenteeId = this.$route.params.id;
      console.log('🔥absenteeId:', absenteeId);
      this.fetchAbsentee(absenteeId);
      this.fetchVisits(absenteeId);
    },
    methods: {
      async fetchAbsentee(absenteeId) {
        console.log('🔥URL:', this.User);

        try {
          const res = await this.openReadDataItemById(this.User, absenteeId);
          this.absentee = res.data;
          //absentee.church_registration_date 날짜 형식 변경
          this.absentee.church_registration_date =
            this.absentee.church_registration_date.substr(0, 10);
          console.log('🔥absentee:', this.absentee);
        } catch (error) {
          console.error('Error fetching absentee:', error);
        }
      },
      async fetchVisits(absenteeId) {
        console.log('🔥absenteeId:', absenteeId);
        //

        try {
          const res = await this.getVisitPost(absenteeId, true);
          console.log('🔥res:', res);
          if (res.data) {
            this.visits = res.data;
          } else {
            this.visits = res;
          }

          //this.visits 순서 앞뒤로 바꾸기
          this.visits.reverse();

          console.log('🔥visits여기인가?:', this.visits);
        } catch (error) {
          this.visits = [];
          console.error('Error fetching visits:', error);
        }
      },
      openAddVisitDialog() {
        this.newVisit.visitor_id = this.userInfo.id;
        this.newVisit.visitee_id = this.absentee.id;
        this.newVisit.creator_id = this.userInfo.id;
        this.newVisit.updater_id = this.userInfo.id;
        this.newVisit.visitation_date = new Date().toISOString().substr(0, 10); // Set today's date in YYYY-MM-DD format
        this.addVisitDialog = true;
      },
      closeAddVisitDialog() {
        this.addVisitDialog = false;
        this.resetNewVisit();
      },
      async saveVisit() {
        try {
          const res = await this.openCreateData(
            this.Visitation,
            this.newVisit,
            true
          );
          if (res.id) {
            this.visits.unshift(res);
            this.closeAddVisitDialog();
          }
        } catch (error) {
          console.error('Error adding visit:', error);
        }
        // 다이얼로그 닫기
        this.closeAddVisitDialog();
        // 화면 새로고침
        window.location.reload();
      },
      resetNewVisit() {
        this.newVisit.visitation_date = '';
        this.newVisit.visitation_content = '';
      },
      // edit visit
      async editVisit(visitId) {
        const visit = this.visits.find((v) => v.id === visitId);
        if (visit) {
          this.openEditVisitDialog(visit);
        }
      },
      // existing methods
      openEditVisitDialog(visit) {
        this.currentVisit.id = visit.id;
        this.currentVisit.visitation_date = visit.visitation_date;
        this.currentVisit.visitation_content = visit.visitation_content;
        this.editVisitDialog = true;
      },
      async saveEditedVisit() {
        try {
          const res = await this.openUpdateData(
            this.Visitation,
            this.currentVisit.id,
            this.currentVisit,
            true
          );
          if (res) {
            this.fetchVisits(this.absentee.id);
            this.editVisitDialog = false;
          }
        } catch (error) {
          console.error('Error updating visit:', error);
        }
      },

      async deleteVisit(visitId) {
        if (confirm('정말 삭제하시겠습니까?')) {
          try {
            const res = await this.openDeleteData(
              this.Visitation,
              visitId,
              true
            );
            if (res === 1) {
              this.visits = this.visits.filter((v) => v.id !== visitId);
            }
          } catch (error) {
            console.error('Error deleting visit:', error);
          }
          // 윈도우 자체를 새로고침
          window.location.reload();
        }
      },
    },
  };
</script>
<style scoped>
  .service-card {
    padding: 20px;
    margin-bottom: 20px;
  }

  .headline {
    color: #1976d2; /* Adding a blue color for headlines */
  }
  .edit-visit-history-dialog {
    max-width: 500px;
    background-color: #edeef3;
    min-height: 500px;
  }

  .add-visit-history-dialog {
    max-width: 500px;
    background-color: #edeef3;
    min-height: 500px;
  }

  .custom-cols {
    padding: 0px;
    /* min-height: 300px; */
  }

  .v-input__slot {
    border-radius: 5px;
    padding: 0px;
  }
</style>
