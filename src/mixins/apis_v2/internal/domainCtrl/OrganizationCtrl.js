import axiosApiClient from "@/utils/axiosApiClient";
import env from "@/config/environments.js";

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
      if (showLog) {
        console.log(
          `%c[ Mixin : OrganizationCtrl ] getAllOrganizations()`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axiosApiClient.get(
          `${env.API_BASE_URL}/${this.Organization_EP}`
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
          console.log(`%c[ 전체 응답 구조 ] :`, `color: #FF5733;`, {
            data: returnData,
            isArray: Array.isArray(returnData),
            dataLength: Array.isArray(returnData) ? returnData.length : 0,
            dataType: typeof returnData,
            firstItemSample:
              Array.isArray(returnData) && returnData.length > 0
                ? returnData[0]
                : null,
          });
        }

        return returnData;
      } catch (error) {
        console.error("조직 조회 중 오류 발생:", error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : OrganizationCtrl ] getOrganizationById() organizationId: ${organizationId}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axiosApiClient.get(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("조직 조회 중 오류 발생:", error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : OrganizationCtrl ] createOrganization() organizationData: ${JSON.stringify(
            organizationData
          )}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axiosApiClient.post(
          `${env.API_BASE_URL}/${this.Organization_EP}`,
          organizationData
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("조직 생성 중 오류 발생:", error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : OrganizationCtrl ] updateOrganization() organizationId: ${organizationId}, organizationData: ${JSON.stringify(
            organizationData
          )}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axiosApiClient.put(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`,
          organizationData
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("조직 수정 중 오류 발생:", error);
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
      if (showLog) {
        console.log(
          `%c[ Mixin : OrganizationCtrl ] deleteOrganization() organizationId: ${organizationId}`,
          `color: #6495ED;`
        );
      }

      try {
        const res = await axiosApiClient.delete(
          `${env.API_BASE_URL}/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        if (showLog) {
          console.log(`%c[ return ] :`, `color: #6495ED;`, returnData);
        }

        return returnData;
      } catch (error) {
        console.error("조직 삭제 중 오류 발생:", error);
        return { error: error.message };
      }
    },
  },
};
