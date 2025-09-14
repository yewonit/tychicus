// for Data CRUD
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";

// 같은 디랙토리 내부에있는 믹스인들을 임포트함
// usersDataPreset
import { UsersDataPreset } from "@/mixins/dataset/UsersDataPreset";
// organizationsDataPreset
import { OrganizationsDataPreset } from "@/mixins/dataset/OrganizationsDataPreset";
// roleDataPreset
import { RolesDataPreset } from "@/mixins/dataset/RolesDataPreset";
// userHasRoleDataPreset
import { UserHasRoleDataPreset } from "@/mixins/dataset/UserHasRoleDataPreset";
// activityCategoryDataPreset
import { ActivityCategoryDataPreset } from "@/mixins/dataset/ActivityCategoryDataPreset";
// // activityDataPreset
import { ActivityDataPreset } from "@/mixins/dataset/ActivityDataPreset";

export const DataSetting = {
  // 믹스인 임포트
  mixins: [
    MasterCtrl,
    UsersDataPreset,
    OrganizationsDataPreset,
    RolesDataPreset,
    UserHasRoleDataPreset,
    ActivityCategoryDataPreset,
    ActivityDataPreset,
  ],
  data() {
    return {};
  },
  created() {
    console.log("check");
    // console.log(this.roles);
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
