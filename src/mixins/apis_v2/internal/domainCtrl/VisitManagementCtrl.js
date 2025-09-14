import env from "@/config/environments.js";
import { ModelCtrl } from "@/mixins/apis_v2/internal/core/ModelCtrl";
import axios from "axios";

export const VisitManagementCtrl = {
  data() {
    return {
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
      const res = await axios.get(
        `${env.API_BASE_URL}/get-visit-post/${visiteeId}`
      );
      let returnData = res.data;
      return returnData;
    },
  },
};
