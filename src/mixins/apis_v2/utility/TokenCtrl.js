import axios from "axios";

export const TokenCtrl = {
  data() {
    return {
      TokenCtrlmixinData: " TokenCtrlmixinData",
    };
  },
  methods: {
    // CRUD Access Token
    saveAccessToken: (accessToken) => {
      localStorage.setItem("access_token", accessToken);
    },
    getAccessToken: () => {
      return localStorage.getItem("access_token");
    },
    updateAccessToken: (accessToken) => {
      this.saveAccessToken(accessToken);
    },
    deleteAccessToken: () => {
      localStorage.removeItem("access_token");
    },

    // CRUD Refresh Token
    saveRefreshToken: (refreshToken) => {
      localStorage.setItem("refresh_token", refreshToken);
    },
    getRefreshToken: () => {
      return localStorage.getItem("refresh_token");
    },
    updateRefreshToken: (refreshToken) => {
      this.saveRefreshToken(refreshToken);
    },
    deleteRefreshToken: () => {
      localStorage.removeItem("refresh_token");
    },

    // Refresh Access Token
    refreshAccessToken: () => {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        axios
          .post("https://www.yewon-remnant.net/api/refresh", {
            refreshToken: localStorage.getItem("refresh_token"),
          })
          .then((res) => {
            localStorage.removeItem("access_token");
            localStorage.setItem("access_token", res.data.accessToken);
          })
          .catch((err) => {});
      }
    },
  },
};
