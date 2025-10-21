import axiosClient from '@/utils/axiosClient';

export const OrganizationCtrl = {
  data() {
    return {
      // URL List
      Organization_EP: 'organizations',
    };
  },
  created() {},
  methods: {
    /**
     * @description 모든 조직 정보를 조회하는 API
     * @returns {Array} 조회 결과 (조직 정보 배열)
     */
    async getAllOrganizations() {
      try {
        const res = await axiosClient.api.get(`/${this.Organization_EP}`);

        let returnData = res.data;

        return returnData;
      } catch (error) {
        console.error('조직 조회 중 오류 발생:', error);
        return { error: error.message };
      }
    },

    /**
     * @description 특정 조직 정보를 조회하는 API
     * @param {Number} organizationId 조직 ID
     * @returns {Object} 조회 결과 (조직 정보)
     */
    async getOrganizationById(organizationId) {
      try {
        const res = await axiosClient.api.get(
          `/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        console.error('조직 조회 중 오류 발생:', error);
        return { error: error.message };
      }
    },

    /**
     * @description 새로운 조직을 생성하는 API
     * @param {Object} organizationData 조직 데이터
     * @returns {Object} 생성된 조직 정보
     */
    async createOrganization(organizationData) {
      try {
        const res = await axiosClient.api.post(
          `/${this.Organization_EP}`,
          organizationData
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        console.error('조직 생성 중 오류 발생:', error);
        return { error: error.message };
      }
    },

    /**
     * @description 조직 정보를 수정하는 API
     * @param {Number} organizationId 조직 ID
     * @param {Object} organizationData 수정할 조직 데이터
     * @returns {Object} 수정된 조직 정보
     */
    async updateOrganization(organizationId, organizationData) {
      try {
        const res = await axiosClient.api.put(
          `/${this.Organization_EP}/${organizationId}`,
          organizationData
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        console.error('조직 수정 중 오류 발생:', error);
        return { error: error.message };
      }
    },

    /**
     * @description 조직을 삭제하는 API
     * @param {Number} organizationId 조직 ID
     * @returns {Object} 삭제 결과
     */
    async deleteOrganization(organizationId) {
      try {
        const res = await axiosClient.api.delete(
          `/${this.Organization_EP}/${organizationId}`
        );

        let returnData = res.data;

        return returnData;
      } catch (error) {
        console.error('조직 삭제 중 오류 발생:', error);
        return { error: error.message };
      }
    },
  },
};
