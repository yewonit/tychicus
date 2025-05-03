<template>
  <v-container fill-height fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-card flat class="pa-6 transparent">
          <v-icon size="150" class="mb-10" color="#262626"
            >mdi-phone-dial</v-icon
          >
          <v-text-field
            v-model="userPhoneNumber"
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            dense
            type="tel"
            label="터치해서 전화번호를 입력하세요"
            hide-details="auto"
            class="mb-7 mx-auto bg-transparent"
            style="max-width: 400px"
            @input="formatPhoneNumber"
          ></v-text-field>
          <div v-if="userName" class="ma-auto black--text mb-7">
            <span class="wc-bold-900">{{ userName }}</span
            >님, 반갑습니다!
          </div>
          <!-- 동명이인 안내 메시지 -->
          <div v-if="hasDuplicateUsers" class="ma-auto orange--text mb-7">
            동명이인이 있습니다. 전화번호를 입력해주세요.
          </div>
          <!-- 전화번호 일치 여부 메시지 -->
          <div
            v-if="phoneNumberCheckMessage"
            class="ma-auto"
            :class="phoneNumberCheckClass"
          >
            {{ phoneNumberCheckMessage }}
          </div>
          <div
            v-if="!phoneNumberCheckMessage && !hasDuplicateUsers"
            class="ma-auto grey--text mb-7"
          >
            전화번호를 입력해주세요.
          </div>
          <v-btn
            class="mx-auto wc-btn mt-8"
            rounded
            block
            large
            style="max-width: 400px"
            @click="checkPhoneNumber"
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
import { mapActions, mapState } from "vuex";

// Mixins
import { AuthCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AuthCtrl";
import { Utility } from "@/mixins/apis_v2/utility/Utility";

export default {
  name: "PhoneInputView",
  mixins: [AuthCtrl, Utility],
  data: () => ({
    userPhoneNumber: "",
    phoneNumberCheckMessage: "",
    phoneNumberCheckClass: "",
  }),
  computed: {
    ...mapState("auth", ["userName", "userInfo", "userList", "userData"]),
    // 동명이인 여부 확인
    hasDuplicateUsers() {
      return this.userList && this.userList.length > 1;
    },
  },
  created() {
    if (!this.userName) {
      this.$router.push({ name: "NameInputView" });
    }
    console.log("사용자 이름:", this.userName);

    // 동명이인 리스트가 있는지 확인
    if (this.userList && this.userList.length > 1) {
      console.log("동명이인 리스트:", this.userList);
    }

    // 단일 사용자 데이터가 있는지 확인
    if (this.userData) {
      console.log("단일 사용자 데이터:", this.userData);
    }
  },
  methods: {
    ...mapActions("auth", ["setUserEmail", "setUserInfo"]),
    /**
     * 사용자의 전화번호에서 숫자가 아닌 문자를 제거합니다.
     * 이 함수는 전화번호 입력을 형식화하기 위해 사용되며, 숫자(0-9)가 아닌 문자를 제거합니다.
     *
     * @method formatPhoneNumber
     * @returns {void}
     */
    formatPhoneNumber() {
      this.userPhoneNumber = this.userPhoneNumber.replace(/[^0-9]/g, "");
    },
    /**
     * 사용자의 전화번호가 유효한지 확인합니다.
     * 유효한 전화번호는 10자 또는 11자의 숫자로 이루어져야 합니다.
     *
     * @method isValidPhoneNumber
     * @returns {boolean} 유효한 전화번호인 경우 true를 반환하고, 그렇지 않은 경우 false를 반환합니다.
     */
    isValidPhoneNumber() {
      const phoneNumberRegex = /^\d{10,11}$/;
      return phoneNumberRegex.test(this.userPhoneNumber);
    },
    /**
     * 전화번호의 유효성을 확인하고 해당하는 작업을 수행합니다.
     */
    async checkPhoneNumber() {
      // 전화번호 유효성 검사
      if (!this.isValidPhoneNumber()) {
        this.phoneNumberCheckMessage = "유효한 전화번호를 입력해주세요.";
        this.phoneNumberCheckClass = "error--text";
        return;
      }

      try {
        console.log(this.userList);
        // 동명이인 처리: userList가 있는 경우
        if (this.hasDuplicateUsers) {
          console.log("동명이인 처리 로직 실행");

          // 전화번호와 일치하는 사용자 찾기
          const matchedUser = this.userList.find(
            (user) => user.phone_number === this.userPhoneNumber
          );

          if (matchedUser) {
            console.log("일치하는 사용자 찾음:", matchedUser);
            this.phoneNumberCheckMessage = "전화번호가 일치합니다.";
            this.phoneNumberCheckClass = "success--text";
            this.setUserEmail(matchedUser[0].email);
            this.setUserInfo(matchedUser);
            console.log("스토어에 저장된 유저데이터:", this.matchedUser);
            this.$router.push({ name: "EmailInputView" });
          } else {
            console.log("일치하는 사용자 없음");
            this.phoneNumberCheckMessage = "일치하는 사용자가 없습니다.";
            this.phoneNumberCheckClass = "error--text";
          }
        }
        // 단일 사용자 데이터가 이미 있는 경우
        else if (this.userData) {
          console.log("단일 사용자 처리 로직 실행");

          if (this.userData.phone_number === this.userPhoneNumber) {
            console.log("전화번호 일치");
            this.phoneNumberCheckMessage = "전화번호가 일치합니다.";
            this.phoneNumberCheckClass = "success--text";
            this.setUserEmail(this.userData.email);
            this.setUserInfo(this.userData);
            console.log("스토어에 저장된 유저데이터:", this.userData);
            this.$router.push({ name: "EmailInputView" });
          } else {
            console.log("전화번호 불일치");
            this.phoneNumberCheckMessage = "전화번호가 일치하지 않습니다.";
            this.phoneNumberCheckClass = "error--text";
          }
        }
        // 기존 로직 (하위 호환성 유지)
        else {
          console.log("기존 로직 실행");
          const response = await this.authCheckPhoneNumber(
            {
              name: this.userName,
              phoneNumber: this.userPhoneNumber,
            },
            true
          );

          if (response.isMatched) {
            this.phoneNumberCheckMessage = "전화번호가 일치합니다.";
            this.phoneNumberCheckClass = "success--text";
            console.log("유저데이터:", response.userData);
            this.setUserEmail(response.userData.email);
            this.setUserInfo(response.userData);
            console.log("스토어에 저장된 유저데이터:", response.userData);
            this.$router.push({ name: "EmailInputView" });
          } else {
            this.phoneNumberCheckMessage = "전화번호가 일치하지 않습니다.";
            this.phoneNumberCheckClass = "error--text";
          }
        }
      } catch (error) {
        console.error("전화번호 확인 오류:", error);
        this.phoneNumberCheckMessage =
          "오류가 발생했습니다. 다시 시도해주세요.";
        this.phoneNumberCheckClass = "error--text";
      }
    },
  },
};
</script>

<style></style>
