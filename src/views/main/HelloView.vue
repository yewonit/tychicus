<template>
  <v-container fill-height fluid>
    <v-row class="fill-height" align="center">
      <v-col cols="12" class="text-center mt-0 px-15">
        <v-img
          :src="require('@/assets/intro.png')"
          height="220px"
          class="mx-auto fadeIn"
          contain
        ></v-img>
      </v-col>
      <v-col class="text-center">
        <span
          class="wc-h3"
          v-if="!welcomeShown"
          v-bind:class="{ fadeIn: !welcomeShown, fadeOut: welcomeShown }"
        >
          코람데오 청년선교회 출결 플랫폼에 <br />잘 오셨습니다~
        </span>
        <span
          class="wc-h3"
          v-if="welcomeShown"
          v-bind:class="{ fadeIn: welcomeShown, fadeOut: !welcomeShown }"
        >
          환영합니다.
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { AuthCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AuthCtrl";

export default {
  name: "HelloView",
  data() {
    return {
      photoUrl: "path/to/your/image",
      welcomeShown: false,
    };
  },
  computed: {
    ...mapGetters({
      userAccessToken: "auth/userAccessToken",
      userRefreshToken: "auth/userRefreshToken",
    }),
  },

  mixins: [AuthCtrl],
  // 나머지 코드...
  async created() {
    // 테스트 주석
    //this.logout();

    setTimeout(() => {
      this.welcomeShown = true;
    }, 2000); // 2초 후에 '환영합니다.' 텍스트를 표시

    console.log("1. AccessToken, RefreshToken이 있나요?");
    if (this.userAccessToken && this.userRefreshToken) {
      console.log("1-1. 네 토큰들 있어요. 사용가능한 토큰인지 확인해볼게요.");
      const result = await this.isAvailableToken();

      if (result) {
        console.log("2-1. 사용 가능한 토큰이래요. 메인 페이지로 이동합니다.");
        setTimeout(() => {
          // 메인 페이지로 이동
          this.$router.push({ name: "ServiceSelectionView" });
        }, 4000);
      } else {
        console.log("2-2, 3-2. 토큰 조회, 생성 오류 로그인 창으로 이동할게요.");
        setTimeout(() => {
          this.$router.push("/login");
        }, 4000);
      }
    } else {
      console.log("1-2. 토큰 없어요. 로그인 창으로 이동할게요.");
      setTimeout(() => {
        this.$router.push("/login");
      }, 4000);
    }
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    async isAvailableToken() {
      try {
        console.log("authTokenCheck 함수 호출");
        const response = await this.authTokenCheck(
          this.userAccessToken,
          this.userRefreshToken
        );

        if (response) {
          return response.success;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}

.fadeIn {
  animation: fadeIn 1.5s ease-in-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeOut {
  animation: fadeOut 1s ease-in-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
