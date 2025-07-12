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
          <v-col class="ma-0 mt-3 pa-3" cols="7" lg="2" xl="2" md="2" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469"
                  aspect-ratio="1"
                  rounded
                ></v-img>
              </v-card>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col class="ma-0 pa-4 pl-5 pb-10" cols="12">
            <div class="mt-3 wc-h2 text-center">정회원 등록</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 5
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pa-4 pb-0" cols="12" xl="8" lg="8" md="8" sm="12">
            <v-text-field
              v-model="bank_account_name"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="예금주를 입력하세요"
              readonly
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="은행을 선택하세요"
              :items="bank_table"
              v-model="bank_idx"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="계죄번호를 입력하세요( - 포함 )"
              v-model="bank_account_number"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-combobox
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="월 후원금을 선택하세요"
              :items="donation_amount_table"
              v-model="donation_amount_object"
              hide-details="auto"
              class="mb-8"
            ></v-combobox>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-3 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
              @click="saveDonation()"
            >
              <span class="wc-h5 white--text">정회원 등록</span>
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
          <v-col class="ma-0 mt-16 pa-3" cols="5" lg="2" xl="2" md="2" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469"
                  aspect-ratio="1"
                  rounded
                ></v-img>
              </v-card>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col class="ma-0 pa-4 pl-5 pb-5" cols="12">
            <div class="mt-3 wc-h2 text-center">정회원 등록</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 5
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pa-10 pb-0" cols="12" xl="8" lg="8" md="8" sm="12">
            <v-text-field
              v-model="bank_account_name"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="예금주를 입력하세요"
              readonly
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="은행을 선택하세요"
              :items="bank_table"
              v-model="bank_idx"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="계죄번호를 입력하세요( - 포함 )"
              v-model="bank_account_number"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-combobox
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="월 후원금을 선택하세요"
              :items="donation_amount_table"
              v-model="donation_amount_object"
              hide-details="auto"
              class="mb-8"
            ></v-combobox>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-10 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
              @click="saveDonation()"
            >
              <span class="wc-h5 white--text">정회원 등록</span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import '@/styles/overrides.scss';

  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';

  export default {
    data() {
      return {
        // CREAT DATA
        // System input
        donation_type: 'YB',
        donation_name: '예원비즈정회원후원',
        user_id: 0,
        bank_account_name: '',
        // User input
        bank_idx: 0,
        bank_account_number: '',
        donation_amount: '',
        donation_amount_object: '',

        // Data For Component Controls -----------------------------------------

        // Data Control : DB저장형식 & 사용자 표현형식 치환을 위한 데이터 테이블
        bank_table: [
          { text: '산업은행', value: 2 },
          { text: '기업은행', value: 3 },
          { text: '국민은행', value: 4 },
          { text: '하나은행', value: 81 },
          { text: '신한은행', value: 88 },
          { text: '씨티은행', value: 27 },
          { text: '우리은행', value: 20 },
          { text: '케이뱅크', value: 89 },
          { text: '스탠다드차타드은행', value: 23 },
          { text: '카카오뱅크', value: 90 },
          { text: '농협은행', value: 11 },
          { text: '지역농∙축협', value: 12 },
          { text: '수협은행', value: 7 },
          { text: '수출입은행', value: 8 },
          { text: '지식경제부우체국', value: 71 },
          { text: '새마을금고중앙회', value: 45 },
          { text: '산림조합중앙회', value: 64 },
          { text: '대구은행', value: 31 },
          { text: '부산은행', value: 32 },
          { text: '광주은행', value: 34 },
          { text: '제주은행', value: 35 },
          { text: '전북은행', value: 37 },
          { text: '경남은행', value: 39 },
          { text: '산업중앙회', value: 48 },
          { text: '상호저축은행', value: 50 },
          { text: '모간스탠리은행', value: 52 },
          { text: 'HSBC은행', value: 54 },
          { text: '도이치은행', value: 55 },
          { text: '알비스은행', value: 56 },
          { text: '제이피모간체이스은행', value: 57 },
          { text: '미즈호코러레이트은행', value: 58 },
          { text: 'BOA은행', value: 60 },
        ],

        donation_amount_table: [
          { text: '월 30,000 원', value: 30000 },
          { text: '월 50,000 원', value: 50000 },
          { text: '월 70,000 원', value: 70000 },
          { text: '월 100,000 원', value: 100000 },
          { text: '직접입력(숫자로 입력)', value: 0 },
        ],
      };
    },
    computed: {},
    watch: {
      donation_amount_object(val) {
        console.log(typeof val);
        if (typeof val === 'string') {
          const tempValue = parseInt(val);
          if (!isNaN(tempValue)) {
            this.donation_amount = tempValue;
          } else {
            alert('숫자만 입력해주세요.');
            this.donation_amount_object = {
              text: '직접입력(숫자로 입력)',
              value: 0,
            };
          }
        } else if (typeof val === 'object') {
          this.donation_amount = val.value;
        } else {
          alert('잘못된 값을 입력하였습니다.');
        }
      },
    },
    created() {
      this.setUserName();
    },
    mixins: [MasterCtrl, FileBins, Utility],
    methods: {
      async saveDonation() {
        console.log(
          `%c[ Comp: SignUpRequler ] saveDonation()`,
          `color:#BFFF00;`
        );
        // 1. 빈 데이터 체크
        console.log(
          `%c[ Comp: SignUpRequler ] saveDonation() > 빈데이터 체크`,
          `color:#BFFF00;`
        );
        const blankCheck = await this.checkEmptyData();
        console.log('blankCheck', blankCheck);
        if (!blankCheck) {
          return;
        }

        // 2. 도네이션 모델 생성
        console.log(
          `%c[ Comp: SignUpRequler ] saveDonation() > 도네이션 모델 생성`,
          `color:#BFFF00;`
        );
        // 2.1. 로그인된 유저정보 가져오기
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        // 2.2. 모델 생성
        const donationModel = {
          donation_type: this.donation_type,
          donation_name: this.donation_name,
          user_id: userInfo.id,
          bank_idx: this.bank_idx,
          bank_account_name: this.donation_amount,
          bank_account_number: this.bank_account_number,
          donation_amount: this.donation_amount,
        };
        // 3. 도네이션 생성
        const newDonation = await this.authCreateData(
          this.Donation,
          donationModel,
          true
        );
        console.log(`%c[ Data ] newDonation`, 'color: #E3DAC9;', newDonation);

        // 4. 다음 페이지로 이동
        console.log(
          `%c[ Comp: SignUpRequler ] saveDonation() > 다음페이지로 이동`,
          `color:#BFFF00;`
        );
        this.$emit('goToNextStep');
      },

      // 빈 데이터 체크
      async checkEmptyData() {
        console.log(
          `%c[ Comp: SignUpRequler ] checkEmptyData()`,
          `color:#BFFF00;`
        );
        if (this.bank_idx == 0) {
          alert('은행을 선택하세요.');
          return false;
        }
        if (this.bank_account_number == '') {
          alert('계좌번호를 입력하세요.');
          return false;
        } else {
          // 입력된 문자열이 -를 포함하고 있지 않다면 -를 입력하세요 라고 출력
          if (this.bank_account_number.indexOf('-') == -1) {
            alert('계좌번호를 - 로 구분하여 입려하세요.');
            return false;
          }
        }
        if (this.donation_amount == '') {
          alert('월 후원금액을 선택 또는 입력해주세요.');
          return false;
        } else {
          // 숫자만 입력
          if (isNaN(this.donation_amount)) {
            alert('숫자만 입력해주세요.');
            return false;
          }
        }
        return true;
      },

      setUserName() {
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        console.log(userInfo);
        if (userInfo.name) {
          this.bank_account_name = userInfo.name;
        } else {
          alert('로그인 이후에 사용해주세요.');
          this.$router.push('/');
        }
      },
    },
  };
</script>

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
