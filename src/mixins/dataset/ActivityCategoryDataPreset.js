// activityCategoryDataPreset
import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';

export const ActivityCategoryDataPreset = {
  mixins: [MasterCtrl],
  data() {
    return {
      activity_category: [
        {
          // id: 1,
          name: '예배',
          description: '하나님께 경배하고 말씀을 듣는 시간입니다.',
          activityCategory: 'spiritual',
          is_deleted: 'N',
          created_at: '2023-05-31 10:00:00',
          updated_at: '2023-05-31 10:00:00',
          creator_id: 1,
          updater_id: 1,
          creator_ip: '192.168.0.1',
          updater_ip: '192.168.0.1',
          access_service_id: '1',
        },
        {
          // id: 2,
          name: '모임',
          description: '신앙 성장과 교제를 위한 소그룹 모임입니다.',
          activityCategory: 'fellowship',
          is_deleted: 'N',
          created_at: '2023-05-31 10:00:00',
          updated_at: '2023-05-31 10:00:00',
          creator_id: 1,
          updater_id: 1,
          creator_ip: '192.168.0.1',
          updater_ip: '192.168.0.1',
          access_service_id: '1',
        },
      ],
    };
  },
  methods: {
    async saveActivityCategoryToDatabase() {
      console.log(
        `[ Mixin : MasterCtrl ] saveActivityCategoryToDatabase() activity_category:`
      );

      // 각 ActivityCategory 데이터를 순회하며 저장
      for (const activityCategory of this.activity_category) {
        // ActivityCategory 데이터 생성 API 호출
        const createdActivityCategory = await this.openCreateData(
          this.ActivityCategory,
          activityCategory
        );

        console.log(createdActivityCategory);
      }
    },
  },
};
