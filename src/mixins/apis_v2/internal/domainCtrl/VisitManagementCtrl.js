import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";
<<<<<<< HEAD
=======
import env from "@/config/environments.js";
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b

export const VisitManagementCtrl = {
  data() {
    return {
<<<<<<< HEAD
      // Base URL
      BASIC_URL: "https://attendance.icoramdeo.com/api/",
      // BASIC_URL: "https://attendance-dev.icoramdeo.com/api/",
      // BASIC_URL: "http://localhost:3001/api/",
      // BASIC_URL: "http://27#.117.185.240:3001/api/",
      // Endpoint for Visitation information
=======
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
      Visitation_EP: "visitation",
    };
  },
  mixins: [ModelCtrl],
  methods: {
    /**
     * @description 특정 사용자의 심방 정보를 조회하는 API
     * @param {Number} visiteeId 조회할 피심방자 ID
     * @param {Boolean} showLog 결과를 콘솔 로그에 표시할지 여부
     * @returns {Array} 조회된 심방 정보 배열
     */
    async getVisitPost(visiteeId, showLog) {
      if (showLog) {
        console.log(
          `%c[ Mixin : VisitManagementCtrl ] getVisitPost() visiteeId: ${visiteeId}`,
          "color: #6495ED;"
        );
      }
      const res = await axios.get(
<<<<<<< HEAD
        `${this.BASIC_URL}get-visit-post/${visiteeId}`
=======
        `${env.API_BASE_URL}/get-visit-post/${visiteeId}`
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
      );
      let returnData = res.data;
      if (showLog) {
        console.log(`%c[ return ] :`, "color: #6495ED;", returnData);
      }
      return returnData;
    },
  },
};
