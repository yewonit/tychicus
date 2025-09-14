import env from "@/config/environments.js";
import axios from "axios";

export const OrganizationCtrl = {
  data() {
    return {
      // URL List
      Organization_EP: "organizations",
    };
  },
  created() {},
  methods: {
    /**
     * @description 모든 조직 정보를 조회하는 API
     * @param {Boolean} showLog 조회 결과를 로그에 표시할지 여부
     * @returns {Array} 조회 결과 (조직 정보 배열)
     */
    async getAllOrganizations(showLog) {
      try {
        const res = await axios.get(
          `${env.API_BASE_URL}/${this.Organization_EP}`
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * @description 특정 조직 정보를 조회하는 API
     * @param {Number} organizationId 조직 ID
     * @param {Boolean} showLog 조회 결과를 로그에 표시할지 여부
     * @returns {Object} 조회 결과 (조직 정보)
     */
    async getOrganizationById(organizationId, showLog) {
      try {
        const res = await axios.get(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * @description 새로운 조직을 생성하는 API
     * @param {Object} organizationData 조직 데이터
     * @param {Boolean} showLog 생성 결과를 로그에 표시할지 여부
     * @returns {Object} 생성된 조직 정보
     */
    async createOrganization(organizationData, showLog) {
      try {
        const res = await axios.post(
          `${env.API_BASE_URL}/${this.Organization_EP}`,
          organizationData
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * @description 조직 정보를 수정하는 API
     * @param {Number} organizationId 조직 ID
     * @param {Object} organizationData 수정할 조직 데이터
     * @param {Boolean} showLog 수정 결과를 로그에 표시할지 여부
     * @returns {Object} 수정된 조직 정보
     */
    async updateOrganization(organizationId, organizationData, showLog) {
      try {
        const res = await axios.put(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`,
          organizationData
        );

        let returnData = res.data;

        if (showLog) {
        }

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * @description 조직을 삭제하는 API
     * @param {Number} organizationId 조직 ID
     * @param {Boolean} showLog 삭제 결과를 로그에 표시할지 여부
     * @returns {Object} 삭제 결과
     */
    async deleteOrganization(organizationId, showLog) {
      try {
        const res = await axios.delete(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        return { error: error.message };
      }
    },
  },
};
