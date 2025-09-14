import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";

export const UserOrganizationsAndRolesCtrl = {
  mixins: [MasterCtrl],

  methods: {
    /**
     * 📊 모든 사용자의 조직과 역할 정보를 분석하고 로그로 출력합니다.
     */
    async logAllUsersOrganizationsAndRoles() {
      console.log("📊 모든 사용자의 조직 및 역할 정보 분석 시작");

      try {
        console.log("1️⃣ 필요 데이터 로드 중...");
        const loadedData = await this.loadRequiredData();
        console.log("✅ 데이터 로드 완료");

        console.log("2️⃣ 사용자별 조직 및 역할 정보 분석");
        const userOrganizationRoles = this.groupRolesByUser(loadedData);

        console.log("3️⃣ 사용자별 조직 및 역할 정보 출력");
        this.logUserOrganizationRoles(userOrganizationRoles, loadedData);
      } catch (error) {
        console.error("❌ 사용자 조직 및 역할 정보 분석 중 오류 발생:", error);
      }

      console.log("📊 모든 사용자의 조직 및 역할 정보 분석 완료");
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
        console.log(`\n👤 사용자 ID: ${userId}`);

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

          console.log("%c" + logMessage, `color: ${color}`);
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
      console.log("🔀 역할 그룹화 시작");
      console.log("📥 입력된 userRoles:", userRoles);
      const organizationRoles = {};

      for (const userRole of userRoles) {
        console.log(`🔍 처리 중인 userRole:`, userRole);
        const role = loadedData.Role.find((r) => r.id === userRole.role_id);
        console.log("🏷️ 매칭된 역할 정보:", role);

        if (role) {
          if (!organizationRoles[userRole.organization_id]) {
            organizationRoles[userRole.organization_id] = [];
            console.log(`➕ 새 조직 추가: ${userRole.organization_id}`);
          }
          organizationRoles[userRole.organization_id].push({
            role_name: role.role_name,
            role_start_date: userRole.role_start_date,
            role_end_date: userRole.role_end_date,
          });
          console.log(
            `✅ 역할 추가: ${role.role_name} (조직 ID: ${userRole.organization_id})`
          );
        } else {
          console.log(
            `⚠️ 경고: role_id ${userRole.role_id}에 해당하는 역할을 찾을 수 없습니다.`
          );
        }
      }

      console.log("📤 그룹화 결과:", organizationRoles);
      return organizationRoles;
    },

    /**
     * 필요한 데이터를 로드합니다.
     * @returns {Promise<Object>} 로드된 데이터 객체
     */
    async loadRequiredData() {
      const tables = ["User", "Organization", "Role", "UserHasRole"];
      const loadedData = {};

      console.log("데이터 로딩 시작...");

      for (const table of tables) {
        console.log(`${table} 데이터 로드 중...`);
        const response = await this.openReadDataList(this[table]);
        loadedData[table] = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log(
          `${table} 데이터 로드 완료. 레코드 수: ${loadedData[table].length}`
        );
        this.logLoadedDataSummary(table, loadedData[table]);
      }

      console.log("모든 데이터 로딩 완료");
      return loadedData;
    },

    /**
     * 로드된 데이터의 요약 정보를 콘솔에 출력합니다.
     * @param {string} tableName - 테이블 이름
     * @param {Array} data - 로드된 데이터 배열
     */
    logLoadedDataSummary(tableName, data) {
      console.log(`${tableName} 데이터 요약:`);
      console.log(`  - 총 ${data.length}개의 레코드 로드됨`);

      if (data.length > 0) {
        console.log("  - 첫 번째 레코드 샘플:");
        console.log(JSON.stringify(data[0], null, 2));
      }

      if (tableName === "Organization") {
        console.log("  - 조직 목록:");
        data.forEach((org) =>
          console.log(`    ID: ${org.id}, 이름: ${org.organization_name}`)
        );
      }

      if (tableName === "UserHasRole") {
        const uniqueUsers = new Set(data.map((uhr) => uhr.user_id)).size;
        const uniqueOrgs = new Set(data.map((uhr) => uhr.organization_id)).size;
        console.log(`  - 고유 사용자 수: ${uniqueUsers}`);
        console.log(`  - 고유 조직 수: ${uniqueOrgs}`);
      }

      console.log("  ---");
    },
  },
};
