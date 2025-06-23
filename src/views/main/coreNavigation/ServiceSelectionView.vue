<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col class="text-center">
        <div
          class="wc-direction-text wc-bold-900 wc-fs-28 blue--text organization-name"
        >
          {{ formatOrganizationName(userInfo.roles[0].organizationName) }}
        </div>
      </v-col>

      <v-col cols="12" class="text-center mt-9 px-20">
        <v-card
          :class="{
            'wc-card': true,
            'mb-12': true,
            'disabled-card': !service.isActive,
          }"
          v-for="service in filteredServices"
          :key="service.id"
        >
          <v-icon size="130" class="ma-3 mt-6 fadeIn" color="#262626">
            {{ service.icon }}
          </v-icon>
          <div class="wc-h3 ma-0 pa-0">{{ service.name }}</div>
          <div class="wc-info-light ma-0 pa-1 pb-7">
            {{ service.nameEn }}
          </div>
          <div class="wc-fs-16 ma-0 pa-0 px-15 pb-7">
            {{ service.description }}
          </div>
          <v-card-actions class="ma-0 pa-0">
            <v-btn
              class="wc-card-btn"
              block
              large
              @click="$router.push(service.path)"
              :disabled="!service.isActive"
            >
              <span class="wc-h3">선택하기</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { NewExcelDataUpload } from '@/mixins/apis_v2/utility/NewExcelDataUpload';
  import { UserOrganizationsAndRolesCtrl } from '@/mixins/apis_v2/utility/UserOrganizationsAndRolesCtrl';
  import { mapState } from 'vuex';

  export default {
    name: 'ServiceSelectionView',
    mixins: [NewExcelDataUpload, UserOrganizationsAndRolesCtrl],
    computed: {
      ...mapState('auth', ['userInfo']),

      // 사용자 권한에 따라 필터링된 서비스 목록을 반환
      filteredServices() {
        if (
          !this.userInfo ||
          !this.userInfo.roles ||
          this.userInfo.roles.length === 0
        ) {
          return [];
        }

        const userPermissionName = this.userInfo.roles[0].permissionName;

        return this.services.filter((service) =>
          this.hasPermissionForService(service, userPermissionName)
        );
      },
    },
    data() {
      return {
        services: [
          {
            id: 1,
            name: '출석현황 대시보드',
            nameEn: 'Attendance Dashboard',
            description: '출석현항을 확인해보세요',
            icon: 'mdi-view-dashboard-variant-outline',
            isActive: true,
            path: '/attendance-dashboard',
            permissions: {
              roles: ['admin', '그룹장'],
            },
          },
          // {
          //   id: 1,
          //   name: "기도제목",
          //   nameEn: "Prayer Topics",
          //   description: "전도회의 기도제목을 입력하고 항상 기도해보세요",
          //   icon: "mdi-hands-pray",
          //   isActive: true,
          //   path: "/prayer-topic", // path 속성 추가
          // },
          {
            id: 2,
            name: '재적인원관리',
            nameEn: 'Management of members',
            description:
              '신규인원을 등록하고 인원들의 정보를 수정/관리해보세요',
            icon: 'mdi-account-multiple-check',
            isActive: true,
            path: '/member-list',
          },
          {
            id: 3,
            name: '모임기록관리',
            nameEn: 'Meeting History Management',
            description: '모임 히스토리를 확인하고 관리할 수 있습니다.',
            icon: 'mdi-account-group',
            isActive: true,
            path: '/meeting-history',
            permissions: {
              roles: ['admin', '순장', '부그룹장', '그룹장'],
            },
          },
          {
            id: 4,
            name: '심방 보고서',
            nameEn: 'Visit Report',
            description: '심방 보고서를 확인하고 작성할 수 있습니다.',
            icon: 'mdi-account-group',
            isActive: true,
            path: '/visit-report',
            permissions: {
              roles: ['admin', 'EBS', '순장', '부그룹장', '그룹장'],
            },
          },
          // {
          //   id: 4,
          //   name: "장결자 및 새가족관리",
          //   nameEn: "Management of deceased and new families",
          //   description: "장결자 및 새가족의 심방정보를 입력하고 관리해보세요",
          //   icon: "mdi-account-supervisor-circle",
          //   isActive: true,
          //   path: "/lost-and-new-management-selection", // path 속성 추가
          // },
        ],
      };
    },
    methods: {
      formatOrganizationName(name) {
        // '_' 기준으로 분리
        const parts = name.split('_');
        // '코람데오'와 '237국' 부분을 제거하고 나머지 부분만 줄바꿈으로 조인
        return parts.slice(2).join('\n');
      },

      /**
       * 사용자가 특정 서비스에 접근할 권한이 있는지 확인합니다.
       * @param {Object} service - 확인할 서비스 객체
       * @param {string} userPermissionName - 사용자의 역할
       * @param {string} organizationName - 사용자의 조직명
       * @returns {boolean} 접근 권한 여부
       */
      hasPermissionForService(service, userPermissionName) {
        // 권한 설정이 없는 서비스는 모든 사용자에게 허용
        if (
          !service.permissions ||
          userPermissionName === 'admin' ||
          this.userInfo.name === '임예원'
        ) {
          return true;
        }

        const roles = service.permissions.roles;

        if (roles && roles.length > 0) {
          if (roles.includes(userPermissionName)) {
            return true;
          }
          return false;
        }

        return false;
      },
    },
    mounted() {
      if (!this.userInfo) {
        this.$router.push({ name: 'LoginView' });
      }
    },
  };
</script>

<style scoped>
  .service-card {
    padding: 20px;
    margin-bottom: 20px;
  }

  .disabled-card {
    opacity: 0.5;
  }
  /* 커스텀 텍스트 블루 */
  .blue--text {
    color: #06a1cc !important;
  }

  .custom-button {
    background-image: linear-gradient(to right, #cbdaf7, #96f2e4) !important;
    border-radius: 50px;
    color: rgb(83, 83, 83);
  }

  .organization-name {
    white-space: pre-line;
    line-height: 1.4;
    max-width: 100%;
    padding: 0 20px;
  }
</style>
