<template>
  <v-navigation-drawer
    v-model="localDrawer"
    app
    class="admin-sidebar"
    color="grey lighten-4"
  >
    <!-- 상단 프로필 영역 -->
    <v-list-item class="px-4 py-6">
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{
            userInfo && userInfo.roles && userInfo.roles.length > 0
              ? userInfo.roles[0].organizationName
              : '조직 정보 로딩 중...'
          }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{
            userInfo && userInfo.roles && userInfo.roles.length > 0
              ? userInfo.roles[0].roleName
              : '역할 정보 로딩 중...'
          }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <!-- 메뉴 리스트 -->
    <v-list nav dense class="py-0">
      <!-- 대시보드 -->
      <v-list-item link :to="{ name: 'AdminDashboard' }" exact>
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>대시보드</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- 회원 관리 그룹 -->
      <v-list-group prepend-icon="mdi-account-group" :value="false">
        <template v-slot:activator>
          <v-list-item-title>회원 관리</v-list-item-title>
        </template>

        <v-list-item link :to="{ name: 'AdminOrganizationManagement' }">
          <v-list-item-title class="pl-2">조직 및 멤버 관리</v-list-item-title>
        </v-list-item>

        <!-- 임시 비활성화: 해당 라우트가 구현되지 않음 -->
        <!-- <v-list-item link :to="{ name: 'AdminMemberList' }">
          <v-list-item-title class="pl-2">회원 목록</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="{ name: 'AdminNewMembers' }">
          <v-list-item-title class="pl-2">새가족 관리</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="{ name: 'AdminAbsentMembers' }">
          <v-list-item-title class="pl-2">장기결석자</v-list-item-title>
        </v-list-item> -->
      </v-list-group>

      <!-- 출석 관리 그룹 -->
      <v-list-group prepend-icon="mdi-calendar-check" :value="false">
        <template v-slot:activator>
          <v-list-item-title>출석 관리</v-list-item-title>
        </template>

        <!-- 임시 비활성화: 해당 라우트가 구현되지 않음 -->
        <!-- <v-list-item link :to="{ name: 'AdminAttendanceList' }">
          <v-list-item-title class="pl-2">출석 현황</v-list-item-title>
        </v-list-item> -->

        <v-list-item link :to="{ name: 'AdminAttendanceStats' }">
          <v-list-item-title class="pl-2">출석 통계</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <!-- 임시 비활성화: 해당 라우트들이 구현되지 않음 -->
      <!-- 심방 관리 -->
      <!-- <v-list-item link :to="{ name: 'AdminVisitation' }">
        <v-list-item-icon>
          <v-icon>mdi-home-heart</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>심방 관리</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <!-- 통계 -->
      <!-- <v-list-item link :to="{ name: 'AdminStatistics' }">
        <v-list-item-icon>
          <v-icon>mdi-chart-bar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>통계</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <!-- 설정 -->
      <!-- <v-list-item link :to="{ name: 'AdminSettings' }">
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>설정</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'AdminSidebar',

    props: {
      value: {
        type: Boolean,
        default: true,
      },
    },

    computed: {
      ...mapState('auth', ['userInfo']),

      localDrawer: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },

    data: () => ({
      // 필요한 데이터 정의
    }),

    methods: {
      // 필요한 메서드 정의
    },
  };
</script>

<style scoped>
  .admin-sidebar {
    border-right: 1px solid #e0e0e0;
  }

  .v-list-item {
    min-height: 44px;
  }

  .v-list-group__header {
    min-height: 44px;
  }

  .v-list-item__icon {
    margin: 12px 0;
  }

  .v-list-group__header.v-list-item--active:before {
    opacity: 0.12;
  }

  .theme--light.v-list-item--active:hover::before,
  .theme--light.v-list-item--active::before {
    opacity: 0.12;
  }
</style>
