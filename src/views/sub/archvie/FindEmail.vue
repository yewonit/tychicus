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
                        src="https://images.unsplash.com/photo-1662037955115-3aed23bba6b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1595&q=80"
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
                  <div class="mt-3 wc-h2 text-center">Email 찾기</div>
                  <div class="mt-1 wc-info-light text-center">Find Email</div>
                </v-col>
              </v-row>
              <v-row class="pb-3">
                <v-spacer></v-spacer>
                <v-col class="pa-10 pb-8" cols="12" sm="7">
                  <v-text-field
                    v-model="userName"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="이름을 입력하세요"
                    hide-details="auto"
                    class="mb-7"
                  ></v-text-field>

                  <v-text-field
                    v-model="userPhoneNumber"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="- 없이 전화번호를 입력하세요"
                    hide-details="auto"
                  ></v-text-field>
                  <!--Element : Basic Button -->
                  <v-btn
                    @click="
                      findAccountEmailLocal(userName, userPhoneNumber, true)
                    "
                    class="mt-10 wc-btn wc-btn-green"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text">Email 계정 찾기</span>
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
                        src="https://images.unsplash.com/photo-1662037955115-3aed23bba6b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1595&q=80"
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
                  <div class="mt-3 wc-h2 text-center">Email 찾기</div>
                  <div class="mt-1 wc-info-light text-center">Find Email</div>
                </v-col>
              </v-row>
              <v-row class="pb-3">
                <v-col class="pa-10 pb-8" cols="12">
                  <v-text-field
                    v-model="userName"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="이름을 입력하세요"
                    hide-details="auto"
                    class="mb-7"
                  ></v-text-field>

                  <v-text-field
                    v-model="userPhoneNumber"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    label="- 없이 전화번호를 입력하세요"
                    @click:append="show1 = !show1"
                    @keyup.enter="
                      findAccountEmailLocal(userName, userPhoneNumber, true)
                    "
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col class="px-10 pb-16" cols="12">
                  <!--Element : Basic Button -->
                  <v-btn
                    @click="
                      findAccountEmailLocal(userName, userPhoneNumber, true)
                    "
                    class="wc-btn wc-btn-green"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text">Email 계정 찾기</span>
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
  import '@/styles/overrides.scss';
  /**
   * @description NEO CORE 라이브러리
   */
  import { mapState, mapActions } from 'vuex';
  import { AccountUtil } from '@/mixins/apis_v2/internal/AccountUtil';
  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  import { TokenCtrl } from '@/mixins/apis_v2/utility/TokenCtrl';
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
    props: {
      // userName: {
      //   type: String,
      //   default: "userName",
      // },
      // userPhoneNumber: {
      //   type: String,
      //   default: "userName",
      // },
    },
    data() {
      return {
        userName: '',
        userPhoneNumber: '',
        show1: false,
        checkbox: false,
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo', 'yewonbizAxios']),
    },
    methods: {
      ...mapActions(['login', 'refreshAccessTokenAtVuex', 'logout']),

      async findAccountEmailLocal(userName, userPhoneNumber) {
        const tempUser = await this.findAccountEmail(userName, userPhoneNumber);
        this.lv1_Data('tempUser', tempUser);
        if (tempUser.message == '존재하지 않는 번호입니다.') {
          alert('존재하지 않는 정보입니다.');
          this.userName = '';
          this.userPhoneNumber = '';
          return;
        }
        // /find-email-result 페이지로 이동
        this.$router.push({ path: `/sub/find-email-result/${tempUser.email}` });
      },
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
