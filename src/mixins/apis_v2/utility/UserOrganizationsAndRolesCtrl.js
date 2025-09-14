import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";

export const UserOrganizationsAndRolesCtrl = {
  mixins: [MasterCtrl],

  methods: {
    /**
     * 📊 모든 사용자의 조직과 역할 정보를 분석하고 로그로 출력합니다.
     */
    async logAllUsersOrganizationsAndRoles() {
      try {
        const loadedData = await this.loadRequiredData();

        const userOrganizationRoles = this.groupRolesByUser(loadedData);

        this.logUserOrganizationRoles(userOrganizationRoles, loadedData);
      } catch (error) {}
    },

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
     * 📝 사용자별 조직 및 역할 정보를 콘솔에 출력합니다.
     * @param {Object} userOrganizationRoles - 사용자별 조직 및 역할 정보
     * @param {Object} loadedData - 로드된 데이터 객체
     */
    logUserOrganizationRoles(userOrganizationRoles, loadedData) {
      for (const [userId, organizations] of Object.entries(
        userOrganizationRoles
      )) {
        const organizationCount = Object.keys(organizations).length;
        let color = "green"; // 기본 색상 (1개 조직, 1개 역할)

        if (organizationCount > 1) {
          color = "red"; // 2개 이상의 조직에 소속된 경우
        } else {
          // 1개 조직에서 2개 이상의 역할을 가진 경우 확인
          const roles = Object.values(organizations)[0];
          if (roles.length > 1) {
            color = "yellow";
          }
        }

        for (const [orgId, roles] of Object.entries(organizations)) {
          const organization = loadedData.Organization.find(
            (org) => org.id === parseInt(orgId)
          );
          const orgName = organization
            ? organization.organization_name
            : "알 수 없는 조직";

          const logMessage = `  🏢 조직: ${orgName} (ID: ${orgId}) - 역할: ${roles.join(
            ", "
          )}`;
        }
      }
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
          // ✅ 역할 추가: ${role.role_name} (조직 ID: ${userRole.organization_id})
        } else {
          // ⚠️ 경고: role_id ${userRole.role_id}에 해당하는 역할을 찾을 수 없습니다.
        }
      }

      return organizationRoles;
    },

    /**
     * 필요한 데이터를 로드합니다.
     * @returns {Promise<Object>} 로드된 데이터 객체
     */
    async loadRequiredData() {
      const tables = ["User", "Organization", "Role", "UserHasRole"];
      const loadedData = {};

      for (const table of tables) {
        await this.openReadDataList(this[table]);
      }

      return loadedData;
    },
  },
};
