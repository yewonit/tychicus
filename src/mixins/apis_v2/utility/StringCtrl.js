export const StringCtrl = {
  data() {
    return {};
  },
  methods: {
    // 문자열에서 앞에서 len개를 잘라서 반환하는 함수
    getShortString(str, len) {
      if (str.length > len) {
        return str.substring(0, len);
      } else {
        return str;
      }
    },
  },
};
