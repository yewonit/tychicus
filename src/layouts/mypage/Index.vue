<template>
  <v-app class="background-color">
    <v-app-bar
      absolute
      color="transparent"
      elevation="0"
      style="height: 84px"
      fixed
      app
    >
      <v-app-bar-nav-icon class="mt-5">
        <v-icon @click="goBack()">mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <div class="mt-5">
        <!-- <span class="wc-h4">Title</span> -->
      </div>

      <!-- {{ this.$vuetify.breakpoint.name }} -->

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-5 pr-0 mr-0" plain v-bind="attrs" v-on="on">
            <!-- <span class="mr-2"> Menu </span> -->
            <v-icon> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>

        <v-list class="nm-card-plain">
          <v-list-item
            class="nm-card-plain"
            v-for="(item, i) in items"
            :key="i"
          >
            <v-list-item-title class="">
              <router-link
                style="text-decoration: none; color: inherit"
                :to="item.path"
              >
                <span class="wc-h5">
                  {{ item.title }}
                </span>
              </router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "SubLayout",
  data() {
    return {
      items: [
        { title: "내 정보 수정", path: "/mypage/user-info" },
        { title: "비밀번호 재설정", path: "/mypage/reset-pw" },
        { title: "내 산업정보 수정", path: "/mypage/work-info" },
        // { title: "정회원 정보 수정", path: "/mypage/cms-info" },
      ],
    };
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
      [2];
    },
  },
};
</script>

<style></style>
