<template>
  <v-app>
    <!-- 헤더 -->
    <admin-header @toggle-drawer="toggleDrawer" />

    <!-- 사이드바 -->
    <admin-sidebar v-if="!isOrganizationManagementView" v-model="drawer" />

    <!-- 메인 컨텐츠 영역 -->
    <v-main>
      <v-container fluid class="pa-6">
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- 푸터 -->
    <admin-footer />
  </v-app>
</template>

<script>
import AdminHeader from "./AdminHeader.vue";
import AdminSidebar from "./AdminSidebar.vue";
import AdminFooter from "./AdminFooter.vue";

export default {
  name: "AdminLayout",

  components: {
    AdminHeader,
    AdminSidebar,
    AdminFooter,
  },

  data: () => ({
    drawer: true,
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
  },
};
</script>

<style scoped>
.v-main {
  background-color: #f8f9fa;
}

.v-container {
  max-width: 1440px;
}
</style>
