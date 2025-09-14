// for Data CRUD
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";

export const DataSetting = {
  // 믹스인 임포트
  mixins: [MasterCtrl],
  data() {
    return {};
  },
  created() {
    // this.startDatabaseSetting();
  },
  methods: {
    async startDatabaseSetting() {
      await this.saveUsersToDatabase();
      await this.saveOrganizationsToDatabase();
      await this.saveRolesToDatabase();
      await this.saveUserHasRoleToDatabase();
      await this.saveActivityCategoryToDatabase();
      await this.saveActivityToDatabase();
    },
  },
};
