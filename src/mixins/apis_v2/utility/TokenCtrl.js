import axios from 'axios';

export const TokenCtrl = {
  data() {
    return {
      TokenCtrlmixinData: ' TokenCtrlmixinData',
    };
  },
  methods: {
    // CRUD Access Token
    saveAccessToken: (accessToken) => {
      // console.log("[mixins: TokenCtrl ]saveAccessToken", accessToken);
      localStorage.setItem('access_token', accessToken);
    },
    getAccessToken: () => {
      // console.log("[mixins: TokenCtrl ]getAccessToken");
      return localStorage.getItem('access_token');
    },
    updateAccessToken: (accessToken) => {
      // console.log("[mixins: TokenCtrl ]updateAccessToken", accessToken);
      this.saveAccessToken(accessToken);
    },
    deleteAccessToken: () => {
      // console.log("[mixins: TokenCtrl ]deleteAccessToken");
      localStorage.removeItem('access_token');
    },

    // CRUD Refresh Token
    saveRefreshToken: (refreshToken) => {
      // console.log("[mixins: TokenCtrl ]saveRefreshToken", refreshToken);
      localStorage.setItem('refresh_token', refreshToken);
    },
    getRefreshToken: () => {
      // console.log("[mixins: TokenCtrl ]getRefreshToken");
      return localStorage.getItem('refresh_token');
    },
    updateRefreshToken: (refreshToken) => {
      // console.log("[mixins: TokenCtrl ]updateRefreshToken", refreshToken);
      this.saveRefreshToken(refreshToken);
    },
    deleteRefreshToken: () => {
      // console.log("[mixins: TokenCtrl ]deleteRefreshToken");
      localStorage.removeItem('refresh_token');
    },

    // Refresh Access Token
    refreshAccessToken: () => {
      // console.log("[mixins: TokenCtrl ]refreshAccessToken");
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        axios
          .post('https://www.yewon-remnant.net/api/refresh', {
            refreshToken: localStorage.getItem('refresh_token'),
          })
          .then((res) => {
            // console.log("refresh res", res);
            localStorage.removeItem('access_token');
            localStorage.setItem('access_token', res.data.accessToken);
          })
          .catch((err) => {
            console.log('refresh err', err);
          });
      }
    },
  },
};
