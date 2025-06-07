<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col class="text-center">
        <div
          class="wc-direction-text wc-bold-900 wc-fs-28 blue--text organization-name"
        >
          {{ formatOrganizationName(userData.roles[0].organizationName) }}
        </div>
        <!-- <div class="wc-direction-text mt-1">사용할 서비스를 선택하세요</div> -->
      </v-col>

      <v-col cols="12" class="text-center mt-9 px-20">
        <v-card
          :class="{
            'wc-card': true,
            'mb-12': true,
            'disabled-card': !service.isActive,
          }"
          v-for="service in services"
          :key="service.id"
        >
          <v-icon size="130" class="ma-3 mt-6 fadeIn" color="#262626">{{
            service.icon
          }}</v-icon>
          <div class="wc-h3 ma-0 pa-0">{{ service.name }}</div>
          <div class="wc-info-light ma-0 pa-1 pb-7">
            {{ service.nameEn }}
          </div>
          <div class="wc-fs-16 ma-0 pa-0 px-15 pb-7">
            {{ service.description }}
          </div>
          <v-card-actions class="ma-0 pa-0">
            <v-btn
              class="wc-card-btn"
              block
              large
              @click="$router.push(service.path)"
              :disabled="!service.isActive"
            >
              <span class="wc-h3">선택하기</span>
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- <v-btn
          color="primary"
          @click="startDataUpdate"
          class="wc-bold-900 ml-4"
        >
          <v-icon left>mdi-database-sync</v-icon>
          데이터 업데이트
        </v-btn> -->

        <!-- 새로운 버튼 추가 -->
        <!-- <v-btn
          color="info"
          @click="showUserOrganizationsAndRoles"
          class="wc-bold-900 ml-4"
        >
          <v-icon left>mdi-account-details</v-icon>
          사용자 조직/역할 정보 보기
        </v-btn> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { NewExcelDataUpload } from "@/mixins/apis_v2/utility/NewExcelDataUpload";
import { UserOrganizationsAndRolesCtrl } from "@/mixins/apis_v2/utility/UserOrganizationsAndRolesCtrl";

export default {
  name: "ServiceSelectionView",
  mixins: [NewExcelDataUpload, UserOrganizationsAndRolesCtrl],
  computed: {
    ...mapState("auth", ["userData"]),
  },
  data() {
    return {
      services: [
        {
          id: 0,
          name: "출석현황 대시보드",
          nameEn: "Attendance Dashboard",
          description: "출석현항을 확인해보세요",
          icon: "mdi-view-dashboard-variant-outline",
          isActive: true,
          path: "/attendance-dashboard", // path 속성 추가
        },
        // {
        //   id: 1,
        //   name: "기도제목",
        //   nameEn: "Prayer Topics",
        //   description: "전도회의 기도제목을 입력하고 항상 기도해보세요",
        //   icon: "mdi-hands-pray",
        //   isActive: true,
        //   path: "/prayer-topic", // path 속성 추가
        // },
        {
          id: 2,
          name: "재적인원관리",
          nameEn: "Management of members",
          description: "신규인원을 등록하고 인원들의 정보를 수정/관리해보세요",
          icon: "mdi-account-multiple-check",
          isActive: true,
          path: "/member-list", // path 속성 추가
        },
        {
          id: 3,
          name: "모임기록관리",
          nameEn: "Meeting History Management",
          description: "모임 히스토리를 확인하고 관리할 수 있습니다.",
          icon: "mdi-account-group",
          isActive: true,
          path: "/meeting-history", // 모임 히스토리 페이지로 경로 변경
        },
        // {
        //   id: 4,
        //   name: "장결자 및 새가족관리",
        //   nameEn: "Management of deceased and new families",
        //   description: "장결자 및 새가족의 심방정보를 입력하고 관리해보세요",
        //   icon: "mdi-account-supervisor-circle",
        //   isActive: true,
        //   path: "/lost-and-new-management-selection", // path 속성 추가
        // },
      ],
    };
  },
  methods: {
    formatOrganizationName(name) {
      // '_' 기준으로 분리
      const parts = name.split("_");
      // '코람데오'와 '237국' 부분을 제거하고 나머지 부분만 줄바꿈으로 조인
      return parts.slice(2).join("\n");
    },
    /**
     * @description [비상시운용]사용자 데이터를 업데이트하는 비동기 메서드입니다.
     * @async
     * @method startDataUpdate
     * @throws {Error} 데이터 업데이트 중 발생할 수 있는 오류
     * @returns {Promise<void>} 데이터 업데이트 작업이 완료되면 해결되는 Promise
     */
    async startDataUpdate() {
      try {
        // 로딩 표시 시작
        this.$store.commit("SET_LOADING", true);

        await this.newUserDataUpdate();

        // 성공 메시지 표시
        this.$bvToast.toast("데이터 업데이트가 완료되었습니다.", {
          title: "성공",
          variant: "success",
          solid: true,
        });
      } catch (error) {
        // 오류 메시지 표시
        this.$bvToast.toast(
          "데이터 업데이트 중 오류가 발생했습니다: " + error.message,
          {
            title: "오류",
            variant: "danger",
            solid: true,
          }
        );
      } finally {
        // 로딩 표시 종료
        this.$store.commit("SET_LOADING", false);
      }
    },

    /**
     * @description [콘솔확인 / 데이터확인용] 사용자의 조직 및 역할 정보를 콘솔에 출력하는 비동기 메서드입니다.
     * @async
     * @method showUserOrganizationsAndRoles
     * @throws {Error} 사용자 ID를 찾을 수 없거나 정보 출력 중 발생할 수 있는 오류
     * @returns {Promise<void>} 사용자 정보 출력 작업이 완료되면 해결되는 Promise
     */
    async showUserOrganizationsAndRoles() {
      try {
        // 로딩 표시 시작
        this.$store.commit("SET_LOADING", true);

        // userInfo에서 사용자 ID를 가져옵니다.
        const userId = this.userInfo.id;

        if (!userId) {
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }

        // UserOrganizationsAndRolesCtrl의 메서드를 호출합니다.
        await this.logAllUsersOrganizationsAndRoles(userId);

        // 성공 메시지 표시
        this.$bvToast.toast(
          "사용자 조직 및 역할 정보가 콘솔에 출력되었습니다.",
          {
            title: "정보 출력 완료",
            variant: "success",
            solid: true,
          }
        );
      } catch (error) {
        // 오류 메시지 표시
        this.$bvToast.toast(
          "사용자 정보 출력 중 오류가 발생했습니다: " + error.message,
          {
            title: "오류",
            variant: "danger",
            solid: true,
          }
        );
      } finally {
        // 로딩 표시 종료
        this.$store.commit("SET_LOADING", false);
      }
    },
  },
  mounted() {
    if (!this.userData) {
      this.$router.push({ name: "LoginView" });
    }
    console.log("사용자 정보:", this.userInfo);
    // 데이터 업데이트 함수 절대 키지 말것
    // this.newUserDataUpdate();
    // this.createUserHasRoleData();
  },
};
</script>

<style scoped>
.service-card {
  padding: 20px;
  margin-bottom: 20px;
}

.disabled-card {
  opacity: 0.5;
}
/* 커스텀 텍스트 블루 */
.blue--text {
  color: #06a1cc !important;
}

.custom-button {
  background-image: linear-gradient(to right, #cbdaf7, #96f2e4) !important;
  border-radius: 50px;
  color: rgb(83, 83, 83);
}

.organization-name {
  white-space: pre-line;
  line-height: 1.4;
  max-width: 100%;
  padding: 0 20px;
}
</style>
