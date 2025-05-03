<template>
  <v-app class="admin-page">
    <!-- 헤더 -->
    <admin-header
      @toggle-drawer="toggleDrawer"
      :is-menu-disabled="isMenuDisabled"
    />
  <v-app>
    <!-- 헤더 -->
    <admin-header @toggle-drawer="toggleDrawer" />

    <!-- 사이드바 -->
    <admin-sidebar v-if="!isOrganizationManagementView" v-model="drawer" />

    <!-- 메인 컨텐츠 영역 -->
    <v-main>
      <v-container fluid class="admin-container pa-4">
      <v-container fluid class="pa-6">
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- 푸터 -->
    <admin-footer />
  </v-app>
</template>

<script>
import AdminFooter from "./AdminFooter.vue";
import AdminHeader from "./AdminHeader.vue";
import AdminSidebar from "./AdminSidebar.vue";

export default {
  name: "AdminLayout",

  components: {
    AdminHeader,
    AdminSidebar,
    AdminFooter,
  },

  data: () => ({
    drawer: true,
    isMenuDisabled: false, // 메뉴 버튼 비활성화 상태
  }),

  computed: {
    // 현재 라우트가 조직관리 화면인지 확인
    isOrganizationManagementView() {
      return this.$route.name === "AdminOrganizationManagement";
    },
  },

  methods: {
    toggleDrawer() {
      // 조직관리 화면에서는 토글 동작을 무시
      if (!this.isOrganizationManagementView) {
        this.drawer = !this.drawer;
      }
    },
  },

  created() {
    // 화면 크기에 따라 사이드바 초기 상태 설정
    this.drawer = window.innerWidth >= 1264;

    // body에 admin-view 클래스 추가
    document.body.classList.add("admin-view");

    // 대시보드 메뉴 상태 이벤트 수신
    this.$root.$on("dashboard-menu-state", ({ disabled, closed }) => {
      this.isMenuDisabled = disabled;
      if (closed) {
        // 사이드바 강제로 닫기
        this.drawer = false;

        // 즉시 화면 갱신
        this.$forceUpdate();

        // DOM 업데이트 후 다시 확인
        this.$nextTick(() => {
          this.drawer = false;

          // 100ms 후 한번 더 확인 (타이밍 이슈 방지)
          setTimeout(() => {
            this.drawer = false;

            // 사이드바 요소 직접 제어 시도
            const sidebarElement = document.querySelector(
              ".v-navigation-drawer"
            );
            if (sidebarElement) {
              sidebarElement.style.transform = "translateX(-100%)";
              sidebarElement.style.visibility = "hidden";
            }
          }, 100);
        });
      }
    });

    // 현재 경로가 대시보드인지 확인하고 즉시 적용
    if (this.$route.name === "AdminDashboard") {
      this.drawer = false;
      this.isMenuDisabled = true;

      // 타이밍 이슈 방지를 위한 약간의 지연
      setTimeout(() => {
        document.body.classList.add("dashboard-active");
      }, 50);
    }
  },

  beforeDestroy() {
    // 컴포넌트 제거 시 admin-view 클래스 제거
    document.body.classList.remove("admin-view");

    // 이벤트 리스너 제거
    this.$root.$off("dashboard-menu-state");
  },
};
</script>

<style>
/* 전역 스타일 - 어드민 페이지 내에서 스타일 재정의 */
.admin-page .v-main {
  background-color: #f8f9fa;
}

.admin-page .v-container.admin-container {
  max-width: 1440px;
  background-color: #f8f9fa;
}

/* 어드민 페이지에서 특수 마진 클래스 무효화 */
.admin-page .mt-_120,
.admin-dashboard .mt-_120 {
  margin-top: 0 !important;
}

/* 입력 필드 레이아웃 스타일 재정의 */
.admin-page .v-text-field > .v-input__control > .v-input__slot {
  background-color: #fff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

/* 특수 입력 필드 스타일 재정의 */
.admin-page .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
  transform: rotate(180deg);
}

/* 날짜 선택기 스타일 보정 */
.admin-page .v-date-picker-title {
  padding: 10px;
}

/* 버튼 스타일 보정 */
.admin-page .v-btn {
  letter-spacing: 0.5px;
}

/* 대시보드 화면일 때 사이드바 숨김 및 메인 영역 전체 확장 */
body.dashboard-active .v-navigation-drawer {
  transform: translateX(-100%) !important;
  visibility: hidden !important;
}

body.dashboard-active .v-main {
  padding-left: 0 !important;
<style scoped>
.v-main {
  background-color: #f8f9fa;
}

.v-container {
  max-width: 1440px;
}
</style>
