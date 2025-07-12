<template>
  <v-app-bar app flat color="white" elevation="1">
    <!-- 좌측: 메뉴 토글 버튼 & 로고 -->
    <v-app-bar-nav-icon
      @click="$emit('toggle-drawer')"
      :disabled="isOrganizationManagementView || isMenuDisabled"
      :class="{
        'grey--text text--lighten-1':
          isOrganizationManagementView || isMenuDisabled,
      }"
    ></v-app-bar-nav-icon>

    <v-toolbar-title class="ml-2">
      <span class="font-weight-bold primary--text">예원 관리자</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- 우측: 사용자 메뉴 -->
    <div class="d-flex align-center">
      <!-- 알림 아이콘 -->
      <v-badge
        :content="notificationCount"
        :value="notificationCount"
        color="error"
        overlap
      >
        <v-btn icon @click="showNotifications">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>

      <!-- 사용자 프로필 메뉴 -->
      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="ml-2" v-bind="attrs" v-on="on">
            <v-avatar size="32" class="mr-2">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ userInfo.name }}
            <v-icon small class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="goToProfile">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>프로필</v-list-item-title>
          </v-list-item>

          <v-list-item @click="goToSettings">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>설정</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AdminHeader",

  props: {
    isMenuDisabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    notificationCount: 0,
  }),

  computed: {
    ...mapState("auth", ["userInfo"]),

    // 현재 라우트가 조직관리 화면인지 확인
    isOrganizationManagementView() {
      return this.$route.name === "AdminOrganizationManagement";
    },
  },

  methods: {
    showNotifications() {
      // 알림 목록 표시 로직
      console.log("Show notifications");
    },

    goToProfile() {
      // 임시 대안: 대시보드로 이동 (AdminProfile 라우트가 구현되지 않음)
      this.$router.push({ name: "AdminDashboard" });
    },

    goToSettings() {
      // 임시 대안: 대시보드로 이동 (AdminSettings 라우트가 구현되지 않음)
      this.$router.push({ name: "AdminDashboard" });
    },

    async logout() {
      try {
        // 로그아웃 로직 구현
        await this.$store.dispatch("auth/logout");
        // 임시 대안: 홈으로 이동 (Login 라우트가 구현되지 않음)
        this.$router.push({ name: "HelloView" });
      } catch (error) {
        // 로그아웃 중 오류 발생 시에도 홈으로 이동
        this.$router.push({ name: "HelloView" });
      }
    },
  },

  async created() {
    // 알림 개수 가져오기
    try {
      // API 호출 등을 통해 알림 개수를 가져오는 로직
      this.notificationCount = 0; // 임시
    } catch (error) {
      console.error("알림 개수를 가져오는 중 오류 발생:", error);
    }
  },
};
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid #e0e0e0;
}

.v-btn {
  text-transform: none;
}

.v-list-item {
  min-height: 35px;
}
</style>

<!-- 전역 스타일 -->
<style>
/* 대시보드 화면일 때 햄버거 메뉴 버튼 숨김 */
body.dashboard-active .v-app-bar-nav-icon {
  display: none !important;
}

body.dashboard-active .v-toolbar-title {
  margin-left: 0 !important;
  padding-left: 16px !important;
}
</style>
