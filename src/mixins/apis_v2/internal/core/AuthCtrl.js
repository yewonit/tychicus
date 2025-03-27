import axios from "axios";

export const AuthCtrl = {
  data() {
    return {
      // 인증이 필요없는 API 요청을 위한 Axios 인스턴스
      OPEN_AXIOS: null,
      // 인증이 필요한 API 요청을 위한 Axios 인스턴스
      AUTH_AXIOS: null,
      // API 서버 기본 URL (개발 서버)
      // BASE_URL: "https://attendance.icoramdeo.com/api/",
      // API 서버 기본 URL (테스트 서버)
      BASE_URL: "https://attendance-dev.icoramdeo.com/api/",
      // API 서버 기본 URL (로컬 서버)
      // BASE_URL: "http://localhost:3000/api/",
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
      const baseAxios = await axios.create({
        baseURL: this.BASE_URL,
        headers: {
          authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      return baseAxios;
    },
    // 로그인이 필요 없는 API를 호출할 때 사용
    async getOpenAxios() {
      const baseAxios = await axios.create({
        baseURL: this.BASE_URL,
      });
      return baseAxios;
    },
    // Access Token 재발급
    refreshAccessToken: () => {
      // console.log("[mixins: TokenCtrl ]refreshAccessToken");
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refreshToken", refreshToken);
      if (refreshToken) {
        axios
          .post(this.BASE_URL_ + "refresh", {
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
