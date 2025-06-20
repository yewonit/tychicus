<template>
  <v-container fill-height>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" xl="5" lg="5" md="9" sm="10">
        <!-- SignUpComfirm 1-->
        <SignUpComfirm
          v-if="signupStep === 1"
          :title="'회원가입약관'"
          :subTitle="'membership registration step 1'"
          :bodyTitle="'회원가입약관'"
          :bodyText="'제1장 총 칙 제1조(목적) 이 약관은 (주)예원비즈는 홈페이지에서 제공하는 모든 서비스(이하 서비스라 한다)의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다. 제2조(정의) 이 약관에서 사용하는 용어의 정의는 다음 각 호와 같습니다. 1. 이용자 : 본 약관에 따라 (주)예원비즈가 제공하는 서비스를 받는 자 2. 이용계약 : 서비스 이용과 관련하여 (주)예원비즈와 이용자간에 체결하는 계약 3. 가입 : (주)예원비즈가 제공하는 신청서 양식에 해당 정보를 기입하고, 본 약관에 동의하여 서비스 이용계약을 완료시키는 행위 4. 회원 : 당 사이트에 회원가입에 필요한 개인정보를 제공하여 회원 등록을 한 자'"
          :buttonText="'확인'"
          @goToNextStep="goToNextStep()"
        />

        <!-- SignUpComfirm 2 -->
        <SignUpComfirm
          v-if="signupStep === 2"
          :title="'개인정보 처리방침'"
          :subTitle="'membership registration step 2'"
          :bodyTitle="'개인정보처리방침'"
          :bodyText="'수집항목1 항목 : 아이디, 이름, 비밀번호 목적 : 이용자식별 및 본인확인 여부 확인 보유기간 : 회원 탈퇴시 까지 수집항목2 항목 : 연락처 (Email, 휴대전화번호)목적 : 이용자식별 및 본인확인 여부 확인 보유기간 : 회원 탈퇴시 까지'"
          :buttonText="'확인'"
          @goToNextStep="goToNextStep()"
        />

        <!-- SignUpUser -->
        <SignUpUser
          v-if="signupStep === 3"
          @goToNextStep="signupStep = $event"
        ></SignUpUser>

        <!-- SignUpCallToAction -->
        <SignUpCallToAction
          v-if="signupStep === 4"
          :imgUrl="'https://images.unsplash.com/photo-1601933470198-75ebdfa8e740?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470'"
          :title="'비즈니스 정보를 등록하세요!'"
          :subTitle="'비즈니스 정보를 입력해야 예원비즈의 다양한 혜택을 누릴 수 있습니다.'"
          :btnTitle1="'예, 비즈니스 정보를 등록합니다'"
          @goToNextStep="goToNextStep()"
          @goToHome="goToHome()"
        />

        <!-- SignUpWork -->
        <SignUpWork
          v-if="signupStep === 5"
          @goToNextStep="signupStep = $event"
        />

        <!-- SignUpCallToAction -->
        <!-- <SignUpCallToAction
          v-if="signupStep === 6"
          :imgUrl="'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469'"
          :title="'정회원 가입하기'"
          :subTitle="'정회원 회원가입으로 다양한 혜택을 누리세요!'"
          :btnTitle1="'정회원 회원가입'"
          @goToNextStep="goToNextStep()"
          @goToHome="goToHome()"
        /> -->

        <!-- SignUpReguler -->
        <!-- <SignUpReguler v-if="signupStep === 7" @goToNextStep="goToNextStep()" /> -->

        <!-- SignUpCallToAction -->
        <SignUpCallToAction
          v-if="signupStep === 6"
          :imgUrl="'https://images.unsplash.com/photo-1531686264889-56fdcabd163f?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470'"
          :title="'축하드립니다!'"
          :subTitle="'예원비즈 회원가입이 완료되었습니다.'"
          @goToNextStep="goToHome()"
          @goToHome="goToHome()"
        />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  import SignUpComfirm from '@/components/basic/SignUpComfirmComp.vue';
  import SignUpUser from '@/components/basic/SignUpUserComp.vue';
  import SignUpCallToAction from '@/components/basic/SignUpCallToActionComp.vue';
  import SignUpWork from '@/components/basic/SignUpWorkComp.vue';
  // import SignUpReguler from "@/components/basic/SignUpReguler.vue";

  export default {
    name: 'SignUp',
    components: {
      SignUpComfirm,
      SignUpUser,
      SignUpCallToAction,
      SignUpWork,
      // SignUpReguler,
    },
    data() {
      return {
        signupStep: 1,
      };
    },
    methods: {
      goToNextStep() {
        this.signupStep++;
      },
      goToThisStep(val) {
        this.lv1_Data('val', val);
        alert('여기왔네');
        alert(val);
        this.signupStep = val;
      },

      goToHome() {
        this.$router.push('/');
      },
    },
  };
</script>

<style></style>
