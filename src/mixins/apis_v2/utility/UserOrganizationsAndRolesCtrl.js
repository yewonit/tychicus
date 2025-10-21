import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';

export const UserOrganizationsAndRolesCtrl = {
  mixins: [MasterCtrl],

  methods: {
    /**
     * 🔀 사용자별로 조직과 역할 정보를 그룹화합니다.
     * @param {Object} loadedData - 로드된 데이터 객체
     * @returns {Object} 사용자별로 그룹화된 조직 및 역할 정보
     */
    groupRolesByUser(loadedData) {
      const userOrganizationRoles = {};

      for (const userRole of loadedData.UserHasRole) {
        const { user_id, organization_id, role_id } = userRole;

        if (!userOrganizationRoles[user_id]) {
          userOrganizationRoles[user_id] = {};
        }

        if (!userOrganizationRoles[user_id][organization_id]) {
          userOrganizationRoles[user_id][organization_id] = [];
        }

        const role = loadedData.Role.find((r) => r.id === role_id);
        if (role) {
          userOrganizationRoles[user_id][organization_id].push(role.role_name);
        }
      }

      return userOrganizationRoles;
    },

    /**
     * 🔀 사용자의 역할을 조직별로 그룹화합니다.
     * @param {Array} userRoles - 사용자의 역할 정보 배열
     * @param {Object} loadedData - 로드된 데이터 객체
     * @returns {Object} 조직별로 그룹화된 역할 정보
     */
    groupRolesByOrganization(userRoles, loadedData) {
      const organizationRoles = {};

      for (const userRole of userRoles) {
        const role = loadedData.Role.find((r) => r.id === userRole.role_id);

        if (role) {
          if (!organizationRoles[userRole.organization_id]) {
            organizationRoles[userRole.organization_id] = [];
          }
          organizationRoles[userRole.organization_id].push({
            role_name: role.role_name,
            role_start_date: userRole.role_start_date,
            role_end_date: userRole.role_end_date,
          });
        }
      }

      return organizationRoles;
    },

    /**
     * 필요한 데이터를 로드합니다.
     * @returns {Promise<Object>} 로드된 데이터 객체
     */
    async loadRequiredData() {
      const tables = ['User', 'Organization', 'Role', 'UserHasRole'];
      const loadedData = {};

      for (const table of tables) {
        const response = await this.openReadDataList(this[table]);
        loadedData[table] = Array.isArray(response.data)
          ? response.data
          : [response.data];
      }

      return loadedData;
    },
  },
};
