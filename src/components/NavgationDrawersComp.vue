<template>
  <v-navigation-drawer
    v-model="drawerState"
    class="background-color nm-plate"
    app
  >
    <!--  -->
    <v-card flat class="pt-3 pl-5 mx-auto background-color" width="400 ">
      <v-list>
        <v-list-item>
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/'"
            >
              Home
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/yewon-biz'"
            >
              소개
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/yewon-biz-news'"
            >
              예원비즈뉴스
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/industrialist'"
            >
              예원산업인
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isLogin">
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/mypage/user-info'"
            >
              내 정보
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isLogin">
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/sub/login'"
            >
              로그인
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isLogin">
          <v-list-item-title class="nav-drawer-menu-1">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="'/sub/sign-up'"
            >
              회원가입
            </router-link>
          </v-list-item-title>
        </v-list-item>

        <!-- <v-list-group :value="true">
          <template v-slot:activator>
            <v-list-item-title class="nav-drawer-menu-1">
              <router-link
                style="text-decoration: none; color: inherit"
                :to="'/industrialist'"
              >
                산업 & 산업인 분류
              </router-link>
            </v-list-item-title>
          </template>

          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title class="nav-drawer-menu-2"
                  >비즈니스 도메인</v-list-item-title
                >
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title], i) in admins" :key="i" link>
              <v-list-item-title
                class="nav-drawer-menu-3"
                v-text="title"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group> -->
      </v-list>
    </v-card>
    <template v-if="isLogin" v-slot:append>
      <div class="pa-2">
        <v-btn @click="logout(), $emit('closeDrawer')" plain block>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      admins: [
        ["서비스업", 100],
        ["금융∙은행업", 200],
        ["IT∙정보통신업", 300],
        ["판매유통업", 400],
        ["제조∙생산∙화학업", 500],
        ["교육업", 600],
        ["건설업", 700],
        ["의료∙제약업", 800],
        ["미디어∙광고업", 900],
        ["문화∙예술∙디자인업", 1000],
        ["기관∙협회", 1100],
      ],
      drawerState: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo", "yewonbizAxios"]),
  },
  watch: {
    drawer(val) {
      if (val) {
        this.$nextTick(() => {
          this.drawerState = val;
        });
      }
    },
  },

  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style>
.nav-drawer-menu-1 {
  font-size: 0.825rem !important;
  font-weight: 500;
  color: rgb(77, 77, 77);
}

.nav-drawer-menu-2 {
  font-size: 0.825rem !important;
  font-weight: 400;
  color: rgb(91, 91, 91);
}

.nav-drawer-menu-3 {
  font-size: 0.825rem !important;
  font-weight: 300;
  color: rgb(91, 91, 91);
}
</style>
