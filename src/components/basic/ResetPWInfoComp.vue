<template>
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
        <div class="mt-3 wc-h2 text-center">비밀번호 재설정</div>
        <div class="mt-1 wc-info-light text-center">Reset Password</div>
      </v-col>
    </v-row>
    <v-row class="pb-14">
      <v-col class="pt-10 px-10 pb-7" cols="12">
        <v-text-field
          v-model="userPw"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          class="mb-7"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.requiredPw]"
          :type="show1 ? 'text' : 'password'"
          label="비밀번호를 입력하세요"
          @click:append="show1 = !show1"
          hide-details="auto"
        ></v-text-field>
        <v-text-field
          v-model="userPwCf"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.requiredPw]"
          :type="show2 ? 'text' : 'password'"
          label="비밀번호를 확인합니다"
          @keyup.enter="resetPw()"
          @click:append="show2 = !show2"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col class="px-10" cols="12">
        <!--Element : Basic Button -->
        <v-btn
          class="wc-btn wc-btn-green"
          color="#fff"
          @click="resetPw()"
          rounded
          block
        >
          <span class="wc-h5 white--text">비밀번호 재설정하기</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import '@/styles/overrides.scss';

  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  export default {
    props: {
      userEmail: {
        type: String,
        default: 'userName',
      },
    },
    data() {
      return {
        userPw: '',
        userPwCf: '',
        show1: false,
        show2: false,
        checkbox: false,

        rules: {
          requiredId: (value) => !!value || 'Required.',
          requiredPw: (value) => !!value || 'Required.',
          emailMatch: () => `The email and password you entered don't match`,
        },
      };
    },
    mixins: [MasterCtrl, FileBins, Utility],
    methods: {
      async resetPw() {
        console.log('checkbox : ');
        if (this.userPw == '') {
          alert('비밀번호를 입력하세요');
          return;
        }
        console.log('checkbox : ');
        this.lv1_Func('view: ResetPWInfo', 'resetPw()');
        // 로컬 스토리지에서 유저 정보를 가져오기
        this.lv1_Act('로컬 스토리지에서 유저 정보를 가져오기');
        const userInfo = await JSON.parse(localStorage.getItem('user_info'));
        const result = await this.authUpdateUserPassword(
          userInfo.id,
          this.userPw,
          true
        );
        this.lv1_Data('비밀번호 재설정 결과', result);
        if (result[0] == 1) {
          alert('비밀번호 재설정 완료');
          this.$router.push('/');
        } else {
          alert('비밀번호 재설정 실패');
        }
      },
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
