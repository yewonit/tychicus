<template>
  <div>
    <v-card
      flat
      v-if="this.$vuetify.breakpoint.smAndDown"
      class="nm-card-plain"
    >
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="ma-0 mt-10 pa-3" cols="6" lg="5" xl="5" md="5" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1638913662252-70efce1e60a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  aspect-ratio="1"
                  rounded
                ></v-img>
              </v-card>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col class="ma-0 pa-4 pl-5 pb-1" cols="12">
            <div class="mt-3 wc-h2 text-center">로그인</div>
            <div class="mt-1 wc-info-light text-center">
              Log in to Yewon Biz
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pa-10 pb-8" cols="12" sm="7">
            <v-text-field
              v-model="userEmail"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
              class="mb-7"
              label="Email 계정을 입력하세요"
              :rules="[rules.requiredId]"
            ></v-text-field>

            <v-text-field
              v-model="userPw"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="비밀번호를 입력하세요"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.requiredPw]"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              hide-details="auto"
            ></v-text-field>
            <!--Element : Basic Button -->
            <v-btn
              @click="login({ userEmail, userPw })"
              class="mt-10 wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
            >
              <span class="wc-h5 white--text"> Log In </span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-if="!this.$vuetify.breakpoint.smAndDown" class="wc-card">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="ma-0 mt-10 pa-3" cols="5" lg="5" xl="5" md="5" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1638913662252-70efce1e60a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  aspect-ratio="1"
                  rounded
                ></v-img>
              </v-card>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col class="ma-0 pa-4 pl-5 pb-1" cols="12">
            <div class="mt-3 wc-h2 text-center">로그인</div>
            <div class="mt-1 wc-info-light text-center">
              Log in to Yewon Biz
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-col class="pa-10 pb-8" cols="12">
            <v-text-field
              v-model="userEmail"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="Email 계정을 입력하세요"
              :rules="[rules.requiredId]"
              hide-details="auto"
              class="mb-7"
            ></v-text-field>

            <v-text-field
              v-model="userPw"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.requiredPw]"
              :type="show1 ? 'text' : 'password'"
              label="비밀번호를 입력하세요"
              @click:append="show1 = !show1"
              @keyup.enter="login({ userEmail, userPw })"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col class="px-10 pb-16" cols="12">
            <!--Element : Basic Button -->
            <v-btn
              @click="login({ userEmail, userPw })"
              class="wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
            >
              <span class="wc-h5 white--text"> Log In </span>
            </v-btn>
            <!-- <v-btn
            @click="refreshAccessTokenAtVuex()"
            class="wc-btn mt-8 wc-btn-green"
            color="#fff"
            rounded
            block
          >
            <span class="wc-h5 white--text"> Refresh </span>
          </v-btn>
          <v-btn
            @click="logout()"
            class="wc-btn mt-8 wc-btn-green"
            color="#fff"
            rounded
            block
          >
            <span class="wc-h5 white--text"> Logout </span>
          </v-btn> -->
            <!-- <v-checkbox v-model="checkbox" label="로그인 상태 유지"></v-checkbox> -->
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <p class="text-center wc-info mt-6">
      <span>
        <router-link
          :to="{ path: '/sub/find-email' }"
          class="text-decoration-none grey--text text--darken-1"
        >
          아이디 찾기
        </router-link>
      </span>
      |
      <span>
        <router-link
          :to="{ path: '/sub/find-pw' }"
          class="text-decoration-none grey--text text--darken-1"
        >
          비밀번호 재설정
        </router-link>
      </span>
    </p>
  </div>
</template>

<script>
import "@/styles/overrides.scss";

import { TokenCtrl } from "@/mixins/apis_v2/utility/TokenCtrl";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [TokenCtrl],
  props: {
    // userEmail: {
    //   type: String,
    //   default: "userName",
    // },
    // userPW: {
    //   type: String,
    //   default: "userName",
    // },
  },
  data() {
    return {
      userEmail: "",
      userPw: "",
      show1: false,
      checkbox: false,
      rules: {
        requiredId: (value) => !!value || "Required.",
        requiredPw: (value) => !!value || "Required.",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo", "yewonbizAxios"]),
  },
  methods: {
    ...mapActions(["login", "refreshAccessTokenAtVuex", "logout"]),
  },
  mounted() {},
};
</script>

<style></style>

<style scoped>
/* Element : v-text-field */
.v-text-field--outlined >>> fieldset {
  /* border-color: rgba(192, 0, 250, 0.986); */
  border: solid 1.5px rgba(236, 237, 245, 0.3);
  border-radius: 24px;
  background-image: #edeef3 !important;
  box-shadow: 15px 15px 15px #00000012, -15px -15px 15px #ffffff !important;
}

::v-deep .v-label {
  font-family: NotoSansKR;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.09px;
  color: #b7bbcc;
}

.fb-btn .v-btn--outlined {
  border: thin solid #cccccc;
}
</style>
