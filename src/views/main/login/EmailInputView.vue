<template>
  <v-container fill-height fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-card flat class="pa-6 transparent">
          <v-icon size="150" class="mb-10" color="#262626"
            >mdi-email-open-outline</v-icon
          >
          <v-text-field
            v-model="userInputEmail"
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            dense
            type="email"
            label="터치해서 이메일을 입력하세요"
            hide-details="auto"
            class="mb-7 mx-auto bg-transparent"
            style="max-width: 400px"
            @input="formatEmail"
            :disabled="isPasswordRecovery"
          ></v-text-field>

          <transition name="slide">
            <div v-if="sendedVerifyCode">
              <v-text-field
                v-model="verifyCode"
                background-color="#edeef3"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                type="tel"
                label="터치해서 인증코드를 입력하세요"
                hide-details="auto"
                class="mb-7 mx-auto bg-transparent"
                style="max-width: 400px"
              ></v-text-field>
            </div>
          </transition>

          <div v-if="userName" class="ma-auto black--text mb-7">
            <span class="wc-bold-900">{{ userName }}</span
            >님, 반갑습니다!
          </div>

          <!-- 이메일 일치 여부 메시지 -->
          <div
            v-if="emailCheckMessage"
            class="ma-auto"
            :class="emailCheckClass"
          >
            {{ emailCheckMessage }}
          </div>

          <div
            v-if="!emailCheckMessage && !isPasswordRecovery"
            class="ma-auto grey--text mb-7"
          >
            이메일을 입력해주세요.
          </div>

          <v-btn
            v-if="!sendedVerifyCode"
            class="mx-auto wc-btn mt-8"
            rounded
            block
            large
            style="max-width: 400px"
            @click="sendVerifyCode"
          >
            <span class="wc-h3">인증코드 전송하기</span>
          </v-btn>

          <v-btn
            v-if="sendedVerifyCode"
            class="mx-auto wc-btn mt-8"
            rounded
            block
            large
            style="max-width: 400px"
            @click="verifyCodeCheck"
          >
            <span class="wc-h3">인증코드 확인</span>
          </v-btn>

          <v-btn
            v-if="sendedVerifyCode"
            class="mx-auto wc-btn mt-8"
            rounded
            block
            large
            style="max-width: 400px"
            @click="sendVerifyCode"
          >
            <span class="wc-h3">인증코드 재전송</span>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/styles/overrides.scss";
import { mapState, mapActions } from "vuex";

// Mixins
import { AuthCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AuthCtrl";
import { Utility } from "@/mixins/apis_v2/utility/Utility";

export default {
  name: "PhoneInputView",
  mixins: [AuthCtrl, Utility],
  data: () => ({
    userInputEmail: "",
    verifyCode: "",
    emailCheckMessage: "",
    emailCheckClass: "",
    sendedVerifyCode: false,
    isPasswordRecovery: false,
  }),
  computed: {
    ...mapState("auth", ["userName", "userEmail"]),
  },
  created() {
    if (!this.userName) {
      this.$router.push({ name: "NameInputView" });
    }
    console.log("사용자 이름:", this.userName);
    console.log("사용자 이메일:", this.userEmail);

    // 테스트 주석
    if (this.userEmail) {
      this.isPasswordRecovery = true;
      console.log("저장된 이메일:", this.userEmail);
      this.userInputEmail = this.userEmail;
    }
  },
  methods: {
    ...mapActions("auth", ["setUserInfo"]),

    formatEmail() {
      this.userInputEmail = this.userInputEmail.replace(
        /[^a-zA-Z0-9@._-]/g,
        ""
      );
    },

    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.userInputEmail);
    },

    async checkEmailDuplication(email) {
      try {
        const response = await this.authCheckEmailDuplication(email);
        if (response) {
          return { isDuplicate: response.result, message: response.message };
        } else {
          return {
            isDuplicate: true,
            message: "이메일 중복 체크 오류입니다.",
          };
        }
      } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        return {
          isDuplicate: true,
          message: error.message,
        };
      }
    },

    async sendVerifyCode() {
      console.log("sendVerifyCode called");
      // 이메일 유효성 검사
      if (!this.isValidEmail()) {
        this.emailCheckMessage = "유효한 이메일을 입력해주세요.";
        this.emailCheckClass = "error--text";
        return;
      }

      if (!this.isPasswordRecovery) {
        // 이메일 중복 체크
        const duplicateCheck = await this.checkEmailDuplication(
          this.userInputEmail
        );
        if (duplicateCheck.isDuplicate) {
          this.emailCheckMessage = duplicateCheck.message;
          this.emailCheckClass = "error--text";
          return;
        }
      }

      try {
        this.emailCheckMessage = "이메일 인증 코드 전송중...";
        this.emailCheckClass = "";
        const response = await this.authCheckEmail(this.userInputEmail);
        console.log("response : " + response);

        if (response.result === 1) {
          this.emailCheckMessage = "이메일 인증 코드 전송 완료";
          this.emailCheckClass = "success--text";
          this.sendedVerifyCode = true;
        } else if (response.result === 0) {
          this.emailCheckMessage = "오류가 발생했습니다. 다시 시도해주세요.";
          this.emailCheckClass = "error--text";
        }
      } catch (error) {
        console.error("이메일 인증 코드 발송 오류:", error);
        this.emailCheckMessage = "오류가 발생했습니다. 다시 시도해주세요.";
        this.emailCheckClass = "error--text";
      }
    },

    async verifyCodeCheck() {
      try {
        const response = await this.authVerifyCode(
          this.userInputEmail,
          this.verifyCode
        );

        if (response.result) {
          this.emailCheckMessage = "인증이 완료되었습니다.";
          this.emailCheckClass = "success--text";
          // alert("인증이 완료되었습니다.");
          // this.$router.push({ name: "LoginView" });
          setTimeout(() => {
            this.$router.push({
              name: "PasswordInputView",
              query: { isPasswordRecovery: this.isPasswordRecovery },
            });
          }, 2000);
        } else {
          this.emailCheckMessage = "인증 코드가 일치하지 않습니다.";
          this.emailCheckClass = "error--text";
        }
      } catch (error) {
        console.error("검증 오류:", error);
        this.emailCheckMessage = "검증 오류가 발생했습니다. 다시 시도해주세요.";
        this.emailCheckClass = "error--text";
      }
    },
  },
};
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 100px;
  opacity: 1;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
