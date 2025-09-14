<template>
  <v-container class="mt-0 pt-0" fill-height fluid grid-list-xs>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="mb-5" cols="12" xl="2" lg="3" md="4" sm="12">
        <!-- 컴포넌트파트 -->
        <div>
          <v-card
            flat
            v-if="this.$vuetify.breakpoint.smAndDown"
            class="nm-card-plain"
          >
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-col
                  class="ma-0 mt-10 pa-3"
                  cols="6"
                  lg="5"
                  xl="5"
                  md="5"
                  sm="5"
                >
                  <v-card class="ma-1 pa-1 ih-layer-1">
                    <v-card class="ih-layer-2">
                      <v-img
                        lazy-src=""
                        src="https://images.unsplash.com/photo-1634979149798-e9a118734e93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
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
                  <div class="mt-3 wc-h2 text-center">비밀번호 재설정</div>
                  <div class="mt-1 wc-info-light text-center">
                    Reset Password
                  </div>
                </v-col>
              </v-row>
              <v-row class="pb-3">
                <v-spacer></v-spacer>
                <v-col class="pa-10 pb-8" cols="12" sm="7">
                  <v-text-field
                    v-model="userPassword"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="새로운 비밀번호 입력"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    hide-details="auto"
                    class="mb-7"
                  ></v-text-field>

                  <v-text-field
                    v-model="userPasswordConfirm"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="비밀번호 확인"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    @keyup.enter="
                      resetAccountPasswordLocal(
                        userPassword,
                        userPasswordConfirm,
                        true
                      )
                    "
                    hide-details="auto"
                  ></v-text-field>
                  <!--Element : Basic Button -->
                  <v-btn
                    @click="
                      resetAccountPasswordLocal(
                        userPassword,
                        userPasswordConfirm,
                        true
                      )
                    "
                    class="mt-10 wc-btn wc-btn-green"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text"> 비밀번호 재설정 </span>
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
                <v-col
                  class="ma-0 mt-10 pa-3"
                  cols="5"
                  lg="5"
                  xl="5"
                  md="5"
                  sm="5"
                >
                  <v-card class="ma-1 pa-1 ih-layer-1">
                    <v-card class="ih-layer-2">
                      <v-img
                        lazy-src=""
                        src="https://images.unsplash.com/photo-1634979149798-e9a118734e93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
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
                  <div class="mt-3 wc-h2 text-center">비밀번호 재설정</div>
                  <div class="mt-1 wc-info-light text-center">
                    Reset Password
                  </div>
                </v-col>
              </v-row>
              <v-row class="pb-3">
                <v-col class="pa-10 pb-8" cols="12">
                  <v-text-field
                    v-model="userPassword"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="새로운 비밀번호 입력"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    hide-details="auto"
                    class="mb-7"
                  ></v-text-field>
                  <v-text-field
                    v-model="userPasswordConfirm"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="비밀번호 확인"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col class="px-10 pb-16" cols="12">
                  <!--Element : Basic Button -->
                  <v-btn
                    @click="
                      resetAccountPasswordLocal(
                        userPassword,
                        userPasswordConfirm,
                        true
                      )
                    "
                    class="wc-btn wc-btn-green"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text"> 비밀번호 재설정 </span>
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
        </div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
/**
 * @description 커스텀 CSS
 */
import "@/styles/overrides.scss";
/**
 * @description NEO CORE 라이브러리
 */
import { mapState, mapActions } from "vuex";
import { AccountUtil } from "@/mixins/apis_v2/internal/AccountUtil";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
import { Utility } from "@/mixins/apis_v2/utility/Utility";
import { TokenCtrl } from "@/mixins/apis_v2/utility/TokenCtrl";
/**
 * @description 컴포넌트
 */

/**
 * @description 카카오맵 관련 임포트
 */
/**
 * @description 가상 API 데이터
 */
/**
 * @description 상태체크
 */

export default {
  mixins: [TokenCtrl, Utility, FileBins, MasterCtrl, AccountUtil],
  props: {},
  data() {
    return {
      userPassword: "138",
      userPasswordConfirm: "138",
      show1: false,
      show2: false,
      checkbox: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo", "yewonbizAxios"]),
    userEmail() {
      return this.$route.params.userEmail;
    },
    userId() {
      return this.$route.params.userId;
    },
  },
  methods: {
    ...mapActions(["login", "refreshAccessTokenAtVuex", "logout"]),

    async resetAccountPasswordLocal(userPassword, userPasswordConfirm) {
      if (this.userEmail == null || this.userEmail == "") {
        alert("잘못된 접근입니다.");
        this.$router.push({ name: "Login" });
        return;
      }
      if (!userPassword || !userPasswordConfirm) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      if (userPassword !== userPasswordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      const tempUser = await this.resetAccountPassword(
        this.userId,
        this.userEmail,
        userPassword,
        userPasswordConfirm
      );

      this.lv1_Data("tempUser", tempUser);

      if (tempUser.message == "존재하지 않는 번호입니다.") {
        alert("존재하지 않는 정보입니다.");
        this.userPassword = "";
        this.userPasswordConfirm = "";
        return;
      }
      // 로그인 페이지로 이동
      alert("정상적으로 비밀번호가 변경되었습니다.");
      this.$router.push({ name: "Login" });
    },
  },
  mounted() {
    console.log(this.$route.params.userId);
    console.log(this.$route.params.userEmail);
  },
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
