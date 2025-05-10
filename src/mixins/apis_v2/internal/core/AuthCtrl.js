import axiosClient from "@/utils/axiosClient";

export const AuthCtrl = {
  data() {
    return {
      // 인증이 필요없는 API 요청을 위한 Axios 인스턴스
      OPEN_AXIOS: null,
      // 인증이 필요한 API 요청을 위한 Axios 인스턴스
      AUTH_AXIOS: null,
    };
  },
  methods: {
    // Axios 인스턴스를 생성
    async setAxios(authorization, showLog) {
      if (showLog) {
        console.log(
          "%c[ mixins: AuthCtrl ]setAxios authorization : ",
          `color: #505050;`,
          authorization
        );
      }

      switch (authorization) {
        case "auth":
          if (!localStorage.getItem("access_token")) {
            // alert("로그인이 필요합니다");
            return { data: "NEED LOGIN" };
          } else {
            this.AUTH_AXIOS = await this.getAuthAxios();
            // return { success: "AUTH_AXIOS" };
            break;
          }
        case "open":
          this.OPEN_AXIOS = await this.getOpenAxios();
          // return { success: "OPEN_AXIOS" };
          break;
        default:
          this.OPEN_AXIOS = await this.getOpenAxios();
          // return { success: "OPEN_AXIOS" };
          break;
      }
      if (showLog) {
        console.log(
          "%c[ mixins: AuthCtrl ]setAxios this.AUTH_AXIOS : ",
          `color: #505050;`,
          this.AUTH_AXIOS
        );
        console.log(
          "%c[ mixins: AuthCtrl ]setAxios this.OPEN_AXIOS : ",
          `color: #505050;`,
          this.OPEN_AXIOS
        );
      }
    },
    // Axios 인스턴스를 삭제
    clearAxios(showLog) {
      if (showLog) {
        // console.log("%c[ mixins: AuthCtrl ]clearAxios", `color: #505050;`);
      }
      this.AUTH_AXIOS = null;
      this.OPEN_AXIOS = null;
    },
    // 로그인이 필요한 API 를 호출할 때 사용
    async getAuthAxios() {
      return axiosClient.auth;
    },
    // 로그인이 필요 없는 API를 호출할 때 사용
    async getOpenAxios() {
      return axiosClient.api;
    },
    // Access Token 재발급
    refreshAccessToken: () => {
      // console.log("[mixins: TokenCtrl ]refreshAccessToken");
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refreshToken", refreshToken);
      if (refreshToken) {
        axiosClient.auth
          .post("/refresh", {
            refreshToken: localStorage.getItem("refresh_token"),
          })
          .then((res) => {
            console.log("refresh res", res);
            localStorage.removeItem("access_token");
            localStorage.setItem("access_token", res.data.accessToken);
          })
          .catch((err) => {
            console.log("refresh err", err);
          });
      }
    },
  },
};
