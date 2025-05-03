<template>
  <v-app class="background-color">
    <v-card flat :style="main_style" class="overflow-hidden">
      <v-app-bar
        class="pa-3"
        absolute
        color="#edeef3"
        :style="main_style"
        elevate-on-scroll
        fixed
        app
      >
        <!-- 왼쪽 아이콘 -->
        <v-btn
          class="fadeIn"
          icon
          v-if="$route.meta.showBackButton"
          @click="goBack"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <!-- 왼쪽 아이콘과 타이틀 사이의 공간 -->
        <v-spacer></v-spacer>

        <!-- 타이틀 (중앙 정렬) -->
        <v-toolbar-title class="pa-2 wc-tab-title">
          <v-icon size="23" class="mb-1 mr-1" v-if="$route.meta.showIcon">{{
            $route.meta.iconName
          }}</v-icon>
          <router-link
            style="
              text-decoration: none;
              color: inherit;
              font-size: 1.2rem;
              font-weight: bold;
            "
            :to="'/'"
          >
            {{ $route.meta.title || "기본이름" }}
          </router-link>
        </v-toolbar-title>

        <!-- 타이틀과 오른쪽 아이콘 사이의 공간 -->
        <v-spacer></v-spacer>

        <!-- 오른쪽 아이콘 -->
        <v-btn
          class="fadeIn"
          icon
          v-if="$route.meta.showHomeButton"
          @click="goHome"
        >
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn
          class="fadeIn"
          icon
          v-if="$route.meta.showCancelButton"
          @click="cancelAction"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
    </v-card>
    <v-main class="pt-3" app>
      <router-view />
    </v-main>
    <v-footer padless> </v-footer>
  </v-app>
</template>

<script>
import "@/styles/overrides.scss";
import { mapState, mapActions } from "vuex";

// MIXINS
// for Data CRUD
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
// for File Control
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
// for Utility
import { Utility } from "@/mixins/apis_v2/utility/Utility";

export default {
  name: "MainLayout",
  components: {},
  data: () => ({}),
  computed: {
    ...mapState(["isLogin", "userInfo"]),
    main_style() {
      return this.$vuetify.breakpoint.name === "xs"
        ? "height: 74px"
        : "height: 84px";
    },
  },
  mixins: [MasterCtrl, FileBins, Utility],
  created() {
    this.getUserProfileImage();
  },
  methods: {
    ...mapActions(["checkLogin", "refreshAccessTokenAtVuex", "logout"]),
    async getUserProfileImage() {},
    goBack() {
      this.$router.go(-1); // 뒤로 가기
    },
    goHome() {
      this.$router.push("/"); // 홈으로 이동
    },
    cancelAction() {
      this.$router.push("/service-selection");
    },
  },
};
</script>

<style></style>
