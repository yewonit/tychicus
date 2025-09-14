import { ArrayCtrl } from "@/mixins/apis_v2/utility/ArrayCtrl";
import { StringCtrl } from "@/mixins/apis_v2/utility/StringCtrl";

import { AWSS3Ctrl } from "@/mixins/apis_v2/external/AWSS3Ctrl";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { Utility } from "@/mixins/apis_v2/utility/Utility";

// XLSX.js 파일을 추가한다.

export const NewExcelDataUpload = {
  mixins: [ArrayCtrl, StringCtrl, MasterCtrl, AWSS3Ctrl, Utility],
  methods: {
    /**
     * 새로운 사용자 데이터를 업데이트하는 메인 함수입니다.
     * 이 함수는 엑셀에서 가져온 새로운 사용자 데이터를 처리하고 데이터베이스에 반영하는 전체 프로세스를 관리합니다.
     *
     * 주요 단계:
     * 1. 필요한 테이블 데이터 로드
     * 2. 새로운 데이터 처리 및 검증
     * 3. 데이터 일관성 검증
     * 4. 처리된 데이터 로깅
     * 5. 사용자 확인 요청
     * 6. 데이터베이스 업데이트 실행
     *
     * @async
     * @function newUserDataUpdate
     * @returns {Promise<void>} 프로세스 완료 시 Promise 반환
     * @throws {Error} 데이터 처리 또는 업데이트 중 발생한 오류
     */
    async newUserDataUpdate() {
      try {
        // 프로세스 시작 로깅
        this.logProcessStart("데이터 업데이트 프로세스");

        // 필요한 테이블 데이터 로드
        const tables = ["Organization", "Role", "User", "UserHasRole"];
        const loadedData = await this.loadTableData(tables);

        // 데이터 처리 및 검증 단계 시작
        this.logProcessStart("데이터 처리 및 검증");

        /**
         * processAndValidateData 메서드를 호출하여 엑셀 데이터를 처리하고 검증합니다.
         * 이 메서드는 다음과 같은 주요 작업을 수행합니다:
         *
         * 1. 각 엑셀 행 데이터를 순회하며 처리합니다.
         * 2. 각 데이터에 대해 조직과 역할 정보를 확인합니다.
         * 3. 사용자 데이터의 유효성을 검사합니다.
         * 4. 기존 사용자인지 새로운 사용자인지 판별합니다.
         * 5. 기존 사용자의 경우, 역할 정보 업데이트가 필요한지 확인합니다.
         * 6. 새로운 사용자의 경우, 생성할 사용자 목록에 추가합니다.
         * 7. 사용자 역할 정보를 생성하거나 업데이트할 목록을 준비합니다.
         *
         * @param {Object} loadedData - 데이터베이스에서 로드한 기존 데이터 (조직, 역할, 사용자, 사용자역할 정보)
         * @param {Array} this.newUserDataByExcel - 엑셀에서 읽어온 새로운 사용자 데이터
         *
         * @returns {Object} 처리 결과를 포함하는 객체
         *   @property {Array} processedData - 모든 처리된 데이터 (기존 + 새로운 사용자)
         *   @property {Array} newUsersToCreate - 새로 생성될 사용자 목록
         *   @property {Array} newUserRolesToCreate - 새로 생성될 사용자 역할 목록
         *   @property {Array} existingUserRolesToUpdate - 업데이트가 필요한 기존 사용자 역할 목록
         */
        const {
          processedData,
          newUsersToCreate,
          newUserRolesToCreate,
          existingUserRolesToUpdate,
        } = await this.processAndValidateData(
          loadedData,
          this.newUserDataByExcel
        );

        // 처리 결과에 대한 요약 정보를 로그로 출력
        // 업데이트될 기존 사용자 역할 수: existingUserRolesToUpdate.length

        // 원본 데이터와 처리된 데이터 간의 일관성 검증
        this.validateDataConsistency(this.newUserDataByExcel, processedData);

        // 최종 처리된 데이터 상세 로깅
        this.logFinalProcessedData(
          processedData,
          newUsersToCreate,
          newUserRolesToCreate,
          existingUserRolesToUpdate
        );

        // 사용자에게 데이터 업데이트 확인 요청
        const userConfirmed = await this.requestUserConfirmation(
          processedData,
          newUsersToCreate,
          newUserRolesToCreate,
          existingUserRolesToUpdate
        );

        if (userConfirmed) {
          // 사용자가 확인한 경우 데이터베이스 업데이트 실행
          this.logProcessStart("데이터베이스 업데이트");
          await this.updateDatabase(
            newUsersToCreate,
            newUserRolesToCreate,
            existingUserRolesToUpdate,
            loadedData.UserHasRole
          );
          this.logProcessEnd("데이터베이스 업데이트");

          // 성공 메시지 표시
          alert("데이터 업데이트가 완료되었습니다.");
        } else {
          // 사용자가 취소한 경우 로그 기록
          this.logInfo("사용자가 업데이트를 취소했습니다.");
        }

        // 전체 프로세스 종료 로깅
        this.logProcessEnd("데이터 업데이트 프로세스");
      } catch (error) {
        // 오류 발생 시 콘솔에 로그 기록 및 사용자에게 알림
        alert("데이터 업데이트 중 오류가 발생했습니다: " + error.message);
      }
    },

    /**
     * 사용자에게 데이터 업데이트 확인을 요청합니다.
     * @async
     * @param {Array} processedData - 처리된 데이터 배열
     * @param {Array} newUsersToCreate - 새로 생성될 사용자 배열
     * @param {Array} newUserRolesToCreate - 새로 생성될 사용자 역할 배열
     * @param {Array} existingUserRolesToUpdate - 업데이트될 기존 사용자 역할 배열
     * @returns {Promise<boolean>} 사용자의 확인 여부
     */
    async requestUserConfirmation(
      processedData,
      newUsersToCreate,
      newUserRolesToCreate,
      existingUserRolesToUpdate
    ) {
      const summary = {
        totalProcessed: processedData.length,
        newUsersToCreate: newUsersToCreate.length,
        newUserRolesToCreate: newUserRolesToCreate.length,
        existingUserRolesToUpdate: existingUserRolesToUpdate.length,
        organizationsAffected: new Set(
          processedData.map((d) => d.organization_name)
        ).size,
        rolesAffected: new Set(processedData.map((d) => d.role)).size,
      };

      const message = `
        데이터베이스 업데이트 요약:
        - 처리된 총 데이터: ${summary.totalProcessed}건
        - 새로 생성될 사용자: ${summary.newUsersToCreate}명
        - 새로 생성될 사용자 역할: ${summary.newUserRolesToCreate}건
        - 업데이트될 기존 사용자 역할: ${summary.existingUserRolesToUpdate}건
        - 영향 받는 조직 수: ${summary.organizationsAffected}개
        - 영향 받는 역할 수: ${summary.rolesAffected}개

        주요 변경 사항:
        - 새로운 사용자 ${summary.newUsersToCreate}명이 시스템에 추가됩니다.
        - 새로운 사용자 역할 ${summary.newUserRolesToCreate}건이 생성됩니다.
        - 기존 사용자의 역할 정보 ${summary.existingUserRolesToUpdate}건이 업데이트됩니다.
        - 일부 사용자는 여러 역할을 가질 수 있습니다.

        주의 사항:
        - 이 작업은 데이터베이스의 User와 UserHasRole 테이블에 직접적인 영향을 미칩니다.
        - 새로운 사용자에게는 기본 비밀번호가 설정됩니다. 보안을 위해 초기 로그인 후 비밀번호 변경을 안내해주세요.
        - 기존 사용자의 역할 변경은 해당 사용자의 시스템 접근 권한에 영향을 줄 수 있습니다.
        - 이 작업은 되돌릴 수 없으므로, 진행 전 데이터를 백업하는 것을 권장합니다.

        이 작업을 진행하시겠습니까?
      `;

      return window.confirm(message);
    },

    /**
     * 지정된 테이블들의 데이터를 로드합니다.
     * @async
     * @param {Array<string>} tables - 로드할 테이블 이름 배열
     * @returns {Promise<Object>} 로드된 테이블 데이터 객체
     */
    async loadTableData(tables) {
      const loadedData = {};
      for (const table of tables) {
        this.logAction(`${table} 데이터 로드 중... 🔄`);
        const response = await this.openReadDataList(this[table]);
        loadedData[table] = Array.isArray(response.data)
          ? response.data
          : [response.data];
        this.logSuccess(`${table} 데이터 로드 완료 ✅`);
        this.logLoadedDataSummary(table, loadedData[table]);
      }
      return loadedData;
    },

    /**
     * 로드된 테이블 데이터의 요약을 로그로 출력합니다.
     * @param {string} tableName - 테이블 이름
     * @param {Array} data - 테이블 데이터 배열
     */
    logLoadedDataSummary(tableName, data) {
      if (data.length > 0) {
        if (data.length > 1) {
        }
      }
    },

    /**
     * 새로운 사용자 데이터를 처리하고 검증합니다.
     * @async
     * @param {Object} loadedData - 로드된 테이블 데이터 객체
     * @param {Array} newUserData - 새로운 사용자 데이터 배열
     * @returns {Promise<Object>} 처리 및 검증된 데이터 객체
     */
    async processAndValidateData(loadedData, newUserData) {
      const processedData = [];
      const newUsersToCreate = [];
      const newUserRolesToCreate = [];
      const existingUserRolesToUpdate = [];

      for (const [index, userData] of newUserData.entries()) {
        try {
          const { organization, role } = this.findOrganizationAndRole(
            loadedData,
            userData
          );
          this.validateUserData(userData);

          const existingUser = this.findExistingUser(loadedData.User, userData);

          const processedUserData = { ...userData };

          if (existingUser) {
            processedUserData.user_id = existingUser.id;
            processedUserData.is_new_user = false;
            const existingRole = this.findExistingUserRole(
              loadedData.UserHasRole,
              existingUser.id,
              role.id,
              organization.id
            );
            if (existingRole) {
              if (this.isRoleDataChanged(existingRole, processedUserData)) {
                existingUserRolesToUpdate.push(
                  this.prepareUserHasRoleData(
                    processedUserData,
                    organization,
                    role
                  )
                );
              } else {
              }
            } else {
              newUserRolesToCreate.push(
                this.prepareUserHasRoleData(
                  processedUserData,
                  organization,
                  role
                )
              );
            }
          } else {
            processedUserData.is_new_user = true;
            newUsersToCreate.push(this.prepareNewUserData(userData));
            newUserRolesToCreate.push(
              this.prepareUserHasRoleData(processedUserData, organization, role)
            );
          }

          processedData.push(processedUserData);
        } catch (error) {
          this.logError(`데이터 ${index + 1} 처리 중 오류`, error);
          processedData.push({ error: error.message, originalData: userData });
        }
      }

      return {
        processedData,
        newUsersToCreate,
        newUserRolesToCreate,
        existingUserRolesToUpdate,
      };
    },

    /**
     * 원본 데이터와 처리된 데이터의 일관성을 검증합니다.
     * @param {Array} originalData - 원본 데이터 배열
     * @param {Array} processedData - 처리된 데이터 배열
     */
    validateDataConsistency(originalData, processedData) {
      if (originalData.length !== processedData.length) {
        this.logError(
          "데이터 일관성 오류",
          new Error("원본 데이터와 처리된 데이터의 길이가 일치하지 않습니다.")
        );
        return;
      }

      for (let i = 0; i < originalData.length; i++) {
        const original = originalData[i];
        const processed = processedData[i];

        if (processed.error) {
          this.logError("데이터 처리 오류", {
            index: i + 1,
            originalData: JSON.stringify(original),
            error: processed.error,
          });
          continue;
        }

        if (!processed.is_new_user && !processed.user_id) {
          this.logError("데이터 일관성 오류", {
            index: i + 1,
            originalData: JSON.stringify(original),
            processedData: JSON.stringify(processed),
            missingField: "user_id",
            message: "기존 사용자에 대한 user_id가 누락되었습니다.",
          });
        }

        // 다른 필수 필드에 대한 검증
        const requiredFields = [
          "name",
          "phone_number",
          "organization_name",
          "role",
        ];
        for (const field of requiredFields) {
          if (!processed[field]) {
            this.logError("데이터 일관성 오류", {
              index: i + 1,
              originalData: JSON.stringify(original),
              processedData: JSON.stringify(processed),
              missingField: field,
              message: `필수 필드 ${field}가 누락되었습니다.`,
            });
          }
        }
      }

      this.logProcessEnd("데이터 일관성 검증");
    },

    /**
     * 데이터베이스를 업데이트합니다.
     * @async
     * @param {Array} newUsersToCreate - 새로 생성될 사용자 배열
     * @param {Array} newUserRolesToCreate - 새로 생성될 사용자 역할 배열
     * @param {Array} existingUserRolesToUpdate - 업데이트될 기존 사용자 역할 배열
     * @param {Array} existingUserHasRoleData - 기존 UserHasRole 데이터 배열
     * @returns {Promise<void>}
     */
    async updateDatabase(
      newUsersToCreate,
      newUserRolesToCreate,
      existingUserRolesToUpdate,
      existingUserHasRoleData
    ) {
      for (const userData of newUsersToCreate) {
        try {
          const createdUser = await this.createUser(userData);
          if (!createdUser || !createdUser.id) {
            throw new Error("사용자 생성 실패: 유효한 ID가 반환되지 않음");
          }
          this.updateUserHasRoleData(newUserRolesToCreate, createdUser);
        } catch (error) {
          // 오류 처리 로직 (예: 실패한 사용자 데이터 별도 저장)
        }
      }

      for (const data of newUserRolesToCreate) {
        try {
          if (!data.user_id) {
            continue;
          }
          await this.createOrUpdateUserHasRole(data, existingUserHasRoleData);
        } catch (error) {
          this.logError(`UserHasRole 데이터 처리 실패`, error);
        }
      }

      for (const data of existingUserRolesToUpdate) {
        try {
          if (!data.user_id) {
            continue;
          }
          await this.createOrUpdateUserHasRole(data, existingUserHasRoleData);
        } catch (error) {
          this.logError(`UserHasRole 데이터 처리 실패`, error);
        }
      }
    },

    /**
     * 조직과 역할 데이터를 찾습니다.
     * @param {Object} loadedData - 로드된 테이블 데이터 객체
     * @param {Object} userData - 사용자 데이터 객체
     * @returns {Object} 찾은 조직과 역할 객체
     * @throws {Error} 조직 또는 역할을 찾지 못한 경우
     */
    findOrganizationAndRole(loadedData, userData) {
      const organization = loadedData.Organization.find(
        (org) =>
          org.organization_name &&
          org.organization_name.trim() === userData.organization_name?.trim()
      );
      const role = loadedData.Role.find(
        (r) => r.role_name && r.role_name.trim() === userData.role?.trim()
      );

      if (!organization)
        throw new Error(
          `'${userData.organization_name}' 조직을 찾을 수 없습니다.`
        );
      if (!role) throw new Error(`'${userData.role}' 역할을 찾을 수 없습니다.`);

      return { organization, role };
    },

    /**
     * 사용자 데이터의 유효성을 검사합니다.
     * @param {Object} userData - 검사할 사용자 데이터
     * @throws {Error} 유효성 검사 실패 시 에러를 발생시킵니다.
     */
    validateUserData(userData) {
      // 필수 필드 검사
      const requiredFields = [
        "name",
        "name_suffix",
        "organization_name",
        "role",
      ];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`필수 필드 ${field}가 누락되었습니다.`);
        }
      }

      // 이름 길이 검사
      if (userData.name.length < 2 || userData.name.length > 50) {
        throw new Error("이름은 2자 이상 50자 이하여야 합니다.");
      }

      // 조직명 유효성 검사 (예: 길이 제한)
      if (userData.organization_name.length > 100) {
        throw new Error("조직명은 100자를 초과할 수 없습니다.");
      }

      // 여기에 추가적인 유효성 검사 로직을 구현할 수 있습니다.
    },

    /**
     * 기존 사용자인지 새로운 사용자인지 판별합니다.
     * @param {Object} loadedData - 데이터베이스에서 로드한 기존 데이터
     * @param {Object} userData - 엑셀에서 읽어온 사용자 데이터
     * @returns {Object} 처리된 사용자 데이터와 상태 정보
     */
    determineUserStatus(loadedData, userData) {
      // 1. 사용자 데이터 정규화
      const normalizedUserData = this.normalizeUserData(userData);

      // 2. 기존 사용자 찾기
      const existingUser = this.findExistingUser(
        loadedData.User,
        normalizedUserData
      );

      // 3. 결과 객체 초기화
      const result = {
        ...normalizedUserData,
        is_new_user: !existingUser,
        user_id: existingUser ? existingUser.id : null,
      };

      // 4. 기존 사용자인 경우 추가 처리
      if (existingUser) {
        result.existing_user_data = existingUser;
        // 기존 사용자의 역할 정보 확인
        const existingRole = this.findExistingUserRole(
          loadedData.UserHasRole,
          existingUser.id,
          this.findRoleId(loadedData.Role, normalizedUserData.role),
          this.findOrganizationId(
            loadedData.Organization,
            normalizedUserData.organization_name
          )
        );
        result.role_needs_update =
          !existingRole ||
          this.isRoleDataChanged(existingRole, normalizedUserData);
      }

      return result;
    },

    /**
     * 사용자 데이터를 정규화합니다.
     * @param {Object} userData - 원본 사용자 데이터
     * @returns {Object} 정규화된 사용자 데이터
     */
    normalizeUserData(userData) {
      return {
        name: (userData.name || "").trim(),
        name_suffix: (userData.name_suffix || "").trim(),
        organization_name: (userData.organization_name || "").trim(),
        role: (userData.role || "").trim(),
        // 다른 필드들도 필요에 따라 정규화
      };
    },

    /**
     * 기존 사용자를 찾습니다.
     * @param {Array} users - 기존 사용자 목록
     * @param {Object} normalizedUserData - 정규화된 사용자 데이터
     * @returns {Object|null} 일치하는 기존 사용자 또는 null
     */
    findExistingUser(users, normalizedUserData) {
      if (!Array.isArray(users)) {
        return null;
      }
      if (!normalizedUserData) {
        return null;
      }
      return users.find(
        (user) =>
          user.name === normalizedUserData.name &&
          user.name_suffix === normalizedUserData.name_suffix
      );
    },

    /**
     * 문자열을 정규화합니다.
     * @param {string} str - 정규화할 문자열
     * @returns {string} 정규화된 문자열
     */
    normalizeString(str) {
      return (str || "").toLowerCase().trim();
    },

    /**
     * 새로운 사용자 데이터를 준비합니다.
     * @param {Object} userData - 원본 사용자 데이터
     * @returns {Object} 준비된 새 사용자 데이터
     */
    prepareNewUserData(userData) {
      return {
        name: userData.name,
        name_suffix: userData.name_suffix || "",
        email: userData.email || `${userData.name}@example.com`,
        password: userData.password || "defaultpassword",
        gender_type: userData.gender_type || "U",
        birth_date: userData.birth_date || "2000-01-01",
        address: userData.address || "Default Address",
        address_detail: userData.address_detail || "",
        city: userData.city || "Default City",
        state_province: userData.state_province || "Default State",
        country: userData.country || "Default Country",
        zip_postal_code: userData.zip_postal_code || "00000",
        is_address_public: userData.is_address_public || "N",
        sns_url: userData.sns_url || "",
        hobby: userData.hobby || "",
        phone_number: this.normalizePhoneNumber(userData.phone_number),
        is_phone_number_public: userData.is_phone_number_public || "N",
        church_member_number: userData.church_member_number || "000000",
        church_registration_date:
          userData.church_registration_date ||
          new Date().toISOString().split("T")[0],
        is_new_member: userData.is_new_member,
        is_long_term_absentee: userData.is_long_term_absentee,
        is_kakaotalk_chat_member: userData.is_kakaotalk_chat_member,
        is_deleted: "N",
        creator_id: 1,
        updater_id: 1,
        creator_ip: "127.0.0.1",
        updater_ip: "127.0.0.1",
        access_service_id: "default_service",
      };
    },

    /**
     * UserHasRole 데이터를 준비합니다.
     * @param {Object} userData - 사용자 데이터
     * @param {Object} organization - 조직 데이터
     * @param {Object} role - 역할 데이터
     * @returns {Object} 준비된 UserHasRole 데이터
     */
    prepareUserHasRoleData(userData, organization, role) {
      return {
        user_id: userData.user_id,
        role_id: role.id,
        organization_id: organization.id,
        organization_code: organization.organization_code,
        role_start_date:
          userData.role_start_date || new Date().toISOString().split("T")[0],
        role_end_date: userData.role_end_date || "9999-12-31", // 예시 종료
        is_deleted: "N",
        creator_id: 1,
        updater_id: 1,
        creator_ip: "127.0.0.1",
        updater_ip: "127.0.0.1",
        access_service_id: "default_service",
      };
    },

    /**
     * 새로운 사용자를 생성합니다.
     * @async
     * @param {Object} newUser - 새 사용자 데이터
     * @returns {Promise<Object>} 생성된 사용자 객체
     * @throws {Error} 사용자 생성 실패 시
     */
    async createUser(newUser) {
      const existingUser = await this.findExistingUser(newUser);
      if (existingUser) {
        return existingUser;
      }
      const createdUser = await this.openCreateData(this.User, newUser, true);
      if (createdUser.result === 0)
        throw new Error(`유저 생성 실패: ${newUser.name}`);
      this.logSuccess(`유저 생성 완료: ID ${createdUser.id} 🎉`);
      return createdUser;
    },

    /**
     * 새로 생성된 사용자의 ID를 UserHasRole 데이터에 연결합니다.
     * 이 함수는 새 사용자가 생성된 후 호출되어, 해당 사용자의 역할 데이터를 업데이트합니다.
     * @param {Array} userHasRoleDataToCreate - 생성 대기 중인 UserHasRole 데이터 배열
     * @param {Object} createdUser - 새로 생성된 사용자 객체
     */
    updateUserHasRoleData(userHasRoleDataToCreate, createdUser) {
      const relatedUserHasRoleData = userHasRoleDataToCreate.find(
        (data) =>
          data.user_id === undefined &&
          data.phone_number === createdUser.phone_number
      );
      if (relatedUserHasRoleData) {
        relatedUserHasRoleData.user_id = createdUser.id;
      }
    },

    /**
     * UserHasRole 데이터를 생성하거나 업데이트합니다.
     * 이 함수는 사용자의 역할 정보를 데이터베이스에 반영하는 핵심 로직을 담당합니다.
     *
     * 1. 기존에 동일한 사용자-역할-조직 조합이 있는지 확인합니다.
     * 2. 존재하면 데이터를 비교하여 변경사항이 있는 경우에만 업데이트합니다.
     * 3. 존재하지 않으면 새로운 UserHasRole 레코드를 생성합니다.
     *
     * @async
     * @param {Object} userHasRoleData - 처리할 UserHasRole 데이터 (사용자 ID, 역할 ID, 조직 ID 등 포함)
     * @param {Array} existingUserHasRoleData - 데이터베이스에 이미 존재하는 UserHasRole 데이터 배열
     * @returns {Promise<Object>} 생성 또는 업데이트된 UserHasRole 데이터
     * @throws {Error} 데이터 처리 중 오류 발생 시
     */
    async createOrUpdateUserHasRole(userHasRoleData, existingUserHasRoleData) {
      try {
        if (!userHasRoleData.user_id) {
          return;
        }

        // 기존 UserHasRole 데이터 찾기
        const existingUserHasRole = existingUserHasRoleData.find(
          (item) =>
            item.user_id === userHasRoleData.user_id &&
            item.role_id === userHasRoleData.role_id &&
            item.organization_id === userHasRoleData.organization_id
        );

        if (existingUserHasRole) {
          // 데이터가 동일한지 확인
          const isDataIdentical = this.compareUserHasRoleData(
            existingUserHasRole,
            userHasRoleData
          );

          if (isDataIdentical) {
            return existingUserHasRole;
          }

          // 데이터가 다르면 업데이트
          const updatedData = await this.openUpdateData(this.UserHasRole, {
            ...userHasRoleData,
            id: existingUserHasRole.id,
          });
          return updatedData;
        } else {
          // 새로운 UserHasRole 생성
          const createdData = await this.openCreateData(
            this.UserHasRole,
            userHasRoleData
          );
          return createdData;
        }
      } catch (error) {
        this.logError(
          `UserHasRole 데이터 처리 실패: ${JSON.stringify(userHasRoleData)}`,
          error
        );
        throw error;
      }
    },

    /**
     * UserHasRole 데이터를 비교합니다.
     * @param {Object} existing - 기존 UserHasRole 데이터
     * @param {Object} newData - 새로운 UserHasRole 데이터
     * @returns {boolean} 데이터가 동일한지 여부
     */
    compareUserHasRoleData(existing, newData) {
      const keysToCompare = [
        "role_id",
        "organization_id",
        "organization_code",
        "role_start_date",
        "role_end_date",
        "is_deleted",
        "access_service_id",
      ];

      return keysToCompare.every((key) => existing[key] === newData[key]);
    },
    normalizePhoneNumber(phoneNumber) {
      return phoneNumber.replace(/\D/g, "");
    },

    /**
     * 기존 사용자 역할을 찾습니다.
     * @param {Array} userHasRoles - UserHasRole 데이터 배열
     * @param {number|string} userId - 사용자 ID
     * @param {number|string} roleId - 역할 ID
     * @param {number|string} organizationId - 조직 ID
     * @returns {Object|undefined} 찾은 UserHasRole 객체 또는 undefined
     */
    findExistingUserRole(userHasRoles, userId, roleId, organizationId) {
      return userHasRoles.find(
        (role) =>
          role.user_id === userId &&
          role.role_id === roleId &&
          role.organization_id === organizationId
      );
    },

    /**
     * 역할 데이터가 변경되었는지 확인합니다.
     * @param {Object} existingRole - 기존 역할 데이터
     * @param {Object} newRoleData - 새로운 역할 데이터
     * @returns {boolean} 역할 데이터가 변경되었는지 여부
     */
    isRoleDataChanged(existingRole, newRoleData) {
      // 실제로 변경이 필요한 필드들을 비교합니다.
      const fieldsToCompare = [
        "role_id",
        "organization_id",
        "organization_code",
        "role_start_date",
        "role_end_date",
        "is_deleted",
      ];

      return fieldsToCompare.some(
        (field) => existingRole[field] !== newRoleData[field]
      );
    },
  },
};
