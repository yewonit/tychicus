<template>
  <v-container fill-height fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-card flat class="pa-6 transparent">
          <v-icon size="150" class="mb-10" color="#262626"
            >mdi-lock-outline</v-icon
          >
          <v-text-field
            v-model="password"
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            dense
            label="터치해서 비밀번호를 입력하세요"
            hide-details="auto"
            class="mb-4 mx-auto bg-transparent"
            style="max-width: 400px"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            dense
            label="터치해서 비밀번호를 다시 입력하세요"
            hide-details="auto"
            class="mb-4 mx-auto bg-transparent"
            style="max-width: 400px"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <div>
            {{ passwordDefault }}
          </div>
          <div
            v-if="passwordMessage"
            class="ma-auto mb-7"
            :class="messageClass"
          >
            {{ passwordMessage }}
          </div>

          <v-btn
            class="mx-auto wc-btn mt-8"
            rounded
            block
            large
            style="max-width: 400px"
            @click="setNewPassword"
          >
            <span class="wc-h3">다음으로</span>
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
  name: "PasswordInputView",
  mixins: [AuthCtrl, Utility],
  data: () => ({
    password: "",
    confirmPassword: "",
    showPassword: false,
    passwordDefault: "8자리 이상, 특수문자, 영어 소문자, 숫자 포함",
    passwordMessage: "",
    messageClass: "",
    isPasswordRecovery: false,
  }),
  computed: {
    ...mapState("auth", ["userName", "userEmail", "userInfo", "userData"]),
  },
  created() {
    if (!this.userName) {
      this.$router.push({ name: "NameInputView" });
    }
    console.log("사용자 이름:", this.userName);

    if (this.$route.query.isPasswordRecovery) {
      this.isPasswordRecovery = this.$route.query.isPasswordRecovery;
    }
  },
  watch: {
    password() {
      this.checkPasswordMatch();
    },
    confirmPassword() {
      this.checkPasswordMatch();
    },
  },
  methods: {
    ...mapActions("auth", ["setUserInfo"]),

    checkPasswordMatch() {
      if (this.password !== this.confirmPassword) {
        this.passwordMessage = "비밀번호가 일치하지 않습니다.";
        this.messageClass = "error--text";
        return;
      }

      this.passwordMessage = "비밀번호가 일치합니다.";
      this.messageClass = "success--text";
    },

    isValidPassword(password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      return passwordRegex.test(password);
    },

    async setNewPassword() {
      if (!this.password || !this.confirmPassword) {
        this.passwordMessage = "비밀번호를 입력해주세요.";
        this.messageClass = "error--text";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.passwordMessage = "비밀번호가 일치하지 않습니다.";
        this.messageClass = "error--text";
        return;
      }

      if (!this.isValidPassword(this.password)) {
        this.passwordMessage =
          "비밀번호는 8자리 이상, 특수문자, 영어 소문자, 숫자를 포함해야 합니다.";
        this.messageClass = "error--text";
        return;
      }

      try {
        if (this.isPasswordRecovery) {
          // 비밀번호만 재설정
          const registerData = {
            id: this.userInfo.id,
            password: this.password,
          };
          const response = await this.authResetPassword(registerData);
          if (response.result) {
            // "비밀번호가 설정되었습니다."
            this.passwordMessage = response.message;
            this.messageClass = "success--text";
            setTimeout(() => {
              this.$router.push({ name: "LoginView" });
            }, 2000);
          } else {
            this.passwordMessage = "비밀번호 설정 오류입니다.";
            this.messageClass = "error--text";
          }
        } else {
          const registerData = {
            id: this.userInfo.id,
            email: this.userEmail,
            password: this.password,
          };

          const response = await this.authRegister(registerData);
          if (response.success) {
            // "사용자 등록이 완료되었습니다."
            this.passwordMessage = response.message;
            this.messageClass = "success--text";
            setTimeout(() => {
              this.$router.push({ name: "LoginView" });
            }, 2000);
          } else {
            this.passwordMessage = response.message;
            this.messageClass = "error--text";
          }
        }
      } catch (error) {
        console.error("비밀번호 설정 오류:", error);
        this.passwordMessage = "비밀번호 설정 중 오류가 발생했습니다.";
        this.messageClass = "error--text";
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
