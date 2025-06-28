/**
 * @fileoverview 메인 라우터 설정 파일
 * @author MarkLee
 * @version 1.0.0
 */

import store from '@/store';
import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * @section 레이아웃 컴포넌트
 * @description 애플리케이션의 기본 레이아웃 구조를 정의하는 컴포넌트들
 */
import AdminLayout from '@/layouts/admin/AdminLayout.vue';
import BizLayout from '@/layouts/biz/Index.vue';
import CleanLayout from '@/layouts/clean/Index.vue';
import MainLayout from '@/layouts/main/Index.vue';
import MyPageLayout from '@/layouts/mypage/Index.vue';
import SubLayout from '@/layouts/sub/Index.vue';

/**
 * @section 메인 레이아웃 뷰 컴포넌트
 * @description 메인 레이아웃에서 사용되는 핵심 뷰 컴포넌트
 */
import HelloView from '@/views/main/HelloView.vue';

/**
 * @section 핵심 네비게이션
 * @description 서비스 진입점 및 기본 네비게이션 관련 컴포넌트
 */
import ServiceSelectionView from '@/views/main/coreNavigation/ServiceSelectionView.vue';

/**
 * @section 인증 관련 뷰
 * @description 사용자 인증 및 정보 입력 관련 컴포넌트
 */
import EmailInputView from '@/views/main/login/EmailInputView.vue';
import LoginView from '@/views/main/login/LoginView.vue';
import NameInputView from '@/views/main/login/NameInputView.vue';
import PasswordInputView from '@/views/main/login/PasswordInputView.vue';
import PhoneInputView from '@/views/main/login/PhoneInputView.vue';

/**
 * @section 교회 관리 시스템
 * @description 교회 운영을 위한 각종 관리 기능 컴포넌트
 */

//** 출석현황 대시보드 */
import AttendanceDashboardView from '@/views/main/mainMenu/attendanceDashboard/AttendanceDashboardView.vue';

/** 기도제목 관리 */
import PrayerTopicView from '@/views/main/mainMenu/prayerTopic/prayerTopicView.vue';

/** 교인 관리 */
import MemberListView from '@/views/main/mainMenu/membersManagement/MemberListView.vue';
import MemberRegistrationView from '@/views/main/mainMenu/membersManagement/MemberRegistrationView.vue';
import MemberUpdateView from '@/views/main/mainMenu/membersManagement/MemberUpdateView.vue';

/** 출석 관리 */
import AttendanceAggregationView from '@/views/main/mainMenu/attendanceManagement/AttendanceAggregationView.vue';
import AttendanceInputView from '@/views/main/mainMenu/attendanceManagement/AttendanceInputView.vue';
import AttendanceUpdateView from '@/views/main/mainMenu/attendanceManagement/AttendanceUpdateView.vue';
import MeetingDetailView from '@/views/main/mainMenu/attendanceManagement/MeetingDetailView.vue';
import MeetingHistoryView from '@/views/main/mainMenu/attendanceManagement/MeetingHistoryView.vue';
import VisitReportView from '@/views/main/mainMenu/attendanceManagement/VisitReportView.vue';
import WorshipSelectionView from '@/views/main/mainMenu/attendanceManagement/WorshipSelectionView.vue';

/** 특별 관리 대상자 */
import LongTermAbsenteeListView from '@/views/main/mainMenu/specialPersonnelManagement/LongTermAbsenteeListView.vue';
import LostAndNewManagementSelectionView from '@/views/main/mainMenu/specialPersonnelManagement/LostAndNewManagementSelectionView.vue';
import NewFamilyListView from '@/views/main/mainMenu/specialPersonnelManagement/NewFamilyListView.vue';
import RescueVisitHistoryView from '@/views/main/mainMenu/specialPersonnelManagement/RescueVisitHistoryView.vue';

/** 시스템 관리 */
import DataManagementView from '@/views/main/DataManagementView.vue';
import AWSImageCRUDTest from '@/views/main/mainMenu/attendanceManagement/AWSImageCRUDTest.vue';

/**
 * @section 관리자 뷰 컴포넌트
 */

import AdminAttendanceStats from '@/views/admin/attendance/AttendanceStatsView.vue';
import DashboardView from '@/views/admin/dashboard/DashboardView.vue';
import OrganizationManagementView from '@/views/admin/members/OrganizationManagementView.vue';
import OrganizationMeetingHistoryView from '@/views/admin/members/OrganizationMeetingHistoryView.vue';
// import AdminMemberList from "@/views/admin/members/MemberListView.vue";
// import AdminMemberDetail from "@/views/admin/members/MemberDetailView.vue";
// import AdminAttendanceList from "@/views/admin/attendance/AttendanceListView.vue";
// import AdminAttendanceStats from "@/views/admin/attendance/AttendanceStatsView.vue";
// import AdminNewMembers from "@/views/admin/members/MemberHistoryView.vue";
// import AdminAbsentMembers from "@/views/admin/members/MemberHistoryView.vue";
// import AdminVisitation from "@/views/admin/members/MemberHistoryView.vue";
// import AdminStatistics from "@/views/admin/statistics/ReportGeneratorView.vue";
// import AdminSettings from "@/views/admin/settings/SystemSettingsView.vue";

Vue.use(VueRouter);

/**
 * 사용자가 특정 라우트에 접근할 권한이 있는지 확인합니다.
 * @param {Object} route - 확인할 라우트 객체
 * @param {string} userPermissionName - 사용자의 역할
 * @param {string} userName - 사용자 이름
 * @returns {boolean} 접근 권한 여부
 */
function hasPermissionForRoute(route, userPermissionName, userName) {
  // 권한 설정이 없는 라우트는 모든 사용자에게 허용
  if (!route.meta.permissions) {
    return true;
  }

  // 관리자이거나 특정 사용자(임예원)는 모든 권한 허용
  if (userPermissionName === 'admin' || userName === '임예원') {
    return true;
  }

  const roles = route.meta.permissions.roles;

  if (roles && roles.length > 0) {
    return roles.includes(userPermissionName);
  }

  return false;
}

/**
 * @constant routes
 * @type {Array<Object>}
 * @description 애플리케이션의 라우트 구성을 정의합니다.
 */
const routes = [
  /**
   * @description 메인 레이아웃 라우트
   * @route /
   */
  {
    path: '/',
    name: '',
    component: MainLayout,
    children: [
      /**
       * @description 초기 진입 화면
       * @route /
       */
      {
        path: '/',
        name: 'HelloView',
        component: HelloView,
        meta: {
          title: ' ',
          showIcon: false,
          iconName: '',
          showBackButton: false,
          showHomeButton: false,
          showCancelButton: false,
        },
      },

      /**
       * @section 인증 관련 라우트
       */
      {
        path: '/login',
        name: 'LoginView',
        component: LoginView,
        meta: {
          title: '로그인',
          showIcon: false,
          iconName: 'mdi-account-edit',
          showBackButton: false,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      {
        path: '/name-input',
        name: 'NameInputView',
        component: NameInputView,
        meta: {
          title: '이름 입력',
          showIcon: false,
          iconName: 'mdi-account-edit',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      {
        path: '/phone-input',
        name: 'PhoneInputView',
        component: PhoneInputView,
        meta: {
          title: '전화번호 입력',
          showIcon: false,
          iconName: 'mdi-phone',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      {
        path: '/email-input',
        name: 'EmailInputView',
        component: EmailInputView,
        meta: {
          title: '이메일 입력',
          showIcon: false,
          iconName: 'mdi-email',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      {
        path: '/password-input',
        name: 'PasswordInputView',
        component: PasswordInputView,
        meta: {
          title: '비밀번호 입력',
          showIcon: false,
          iconName: 'mdi-password',
          showBackButton: false,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      {
        path: '/service-selection',
        name: 'ServiceSelectionView',
        component: ServiceSelectionView,
        meta: {
          title: '서비스 선택',
          showIcon: false,
          iconName: 'mdi-handshake',
          showBackButton: false,
          showHomeButton: false,
          showCancelButton: false,
        },
      },

      /**
       * @section 교회 관리 시스템 라우트
       */
      {
        path: '/attendance-dashboard',
        name: 'AttendanceDashboardView',
        component: AttendanceDashboardView,
        meta: {
          title: '출석현황 대시보드',
          showIcon: true,
          iconName: 'mdi-view-dashboard-variant-outline',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: false,
          permissions: {
            roles: ['admin'], // 관리자만 접근 가능
          },
        },
      },
      {
        path: '/prayer-topic',
        name: 'PrayerTopicView',
        component: PrayerTopicView,
        meta: {
          title: '기도제목',
          showIcon: true,
          iconName: 'mdi-praying-hands',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/attendance-aggregation',
        name: 'AttendanceAggregationView',
        component: AttendanceAggregationView,
        meta: {
          title: '출결 집계',
          showIcon: true,
          iconName: 'mdi-account-circle',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/worship-selection',
        name: 'WorshipSelectionView',
        component: WorshipSelectionView,
        meta: {
          title: '예배 선택',
          showIcon: true,
          iconName: 'mdi-church',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/attendance-input',
        name: 'AttendanceInputView',
        component: AttendanceInputView,
        meta: {
          title: '출결 입력',
          showIcon: true,
          iconName: 'mdi-account-group',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/member-registration',
        name: 'MemberRegistrationView',
        component: MemberRegistrationView,
        meta: {
          title: '회원 등록',
          showIcon: true,
          iconName: 'mdi-account-plus',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/member-update/:id',
        name: 'MemberUpdateView',
        component: MemberUpdateView,
        props: true,
        meta: {
          title: '회원 수정',
          showIcon: true,
          iconName: 'mdi-account-edit',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/member-list',
        name: 'MemberListView',
        component: MemberListView,
        meta: {
          title: '회원 명단',
          showIcon: true,
          iconName: 'mdi-account-group',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/lost-and-new-management-selection',
        name: 'LostAndNewManagementSelectionView',
        component: LostAndNewManagementSelectionView,
        meta: {
          title: '신규/이탈 관리',
          showIcon: true,
          iconName: 'mdi-account-group',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/long-term-absentee-list',
        name: 'LongTermAbsenteeListView',
        component: LongTermAbsenteeListView,
        meta: {
          title: '장기 결석자 명단',
          showIcon: true,
          iconName: 'mdi-account-check',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/rescue-visit-history/:id',
        name: 'RescueVisitHistoryView',
        component: RescueVisitHistoryView,
        props: true,
        meta: {
          title: '심방이력',
          showIcon: true,
          iconName: 'mdi-file-document',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/new-family-list',
        name: 'NewFamilyListView',
        component: NewFamilyListView,
        meta: {
          title: '신규 가족 명단',
          showIcon: true,
          iconName: 'mdi-account-multiple-plus',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      {
        path: '/datamanagement',
        name: 'DataManagementView',
        component: DataManagementView,
        meta: {
          title: 'Data Management',
          showIcon: false,
          iconName: '',
          showBackButton: false,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      /**
       * @section 출석 관리 라우트
       * @description 예배 및 모임 출석 관련 기능
       */
      {
        path: '/meeting-history',
        name: 'MeetingHistoryView',
        component: MeetingHistoryView,
        meta: {
          title: '모임 기록',
          showIcon: true,
          iconName: 'mdi-history',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
          permissions: {
            roles: ['admin', 'EBS', '순장', '부그룹장', '그룹장'],
          },
        },
      },
      {
        path: '/visit-report',
        name: 'VisitReportView',
        component: VisitReportView,
        meta: {
          title: '심방 보고서',
          showIcon: true,
          iconName: 'mdi-account-group',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
          permissions: {
            roles: ['admin'],
          },
        },
      },
      {
        path: '/attendance-update/:organizationId/:activityId/:activityInstanceId',
        name: 'AttendanceUpdateView',
        component: AttendanceUpdateView,
        props: true,
        meta: {
          title: '모임 정보 수정',
          showIcon: true,
          iconName: 'mdi-pencil',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
      // MeetingDetailView 라우트 수정
      {
        path: '/meeting-detail/:organizationId/:activityId/:activityInstanceId',
        name: 'MeetingDetailView',
        component: MeetingDetailView,
        props: true,
        meta: {
          title: '모임 상세 정보',
          showIcon: true,
          iconName: 'mdi-information',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: false,
        },
      },
      // AWSImageCRUDTest 라우트를 추가합니다.
      {
        path: '/aws-image-crud-test',
        name: 'AWSImageCRUDTest',
        component: AWSImageCRUDTest,
        meta: {
          title: 'AWS S3 이미지 CRUD 테스트',
          showIcon: true,
          iconName: 'mdi-image',
          showBackButton: true,
          showHomeButton: false,
          showCancelButton: true,
        },
      },
    ],
  },
  /**
   * @section 기타 레이아웃 라우트
   * @description 비즈니스, 서브, 마이페이지, 클린 레이아웃 정의
   */
  {
    path: '/biz',
    name: 'BizLayout',
    component: BizLayout,
    children: [],
  },
  {
    path: '/sub',
    name: 'SubLayout',
    component: SubLayout,
    children: [],
  },
  {
    path: '/mypage',
    name: 'MyPageLayout',
    component: MyPageLayout,
    children: [],
  },
  {
    path: '/clean',
    name: 'CleanLayout',
    component: CleanLayout,
    children: [],
  },
  /**
   * @section 관리자 라우트
   */
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      isAdmin: true,
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: DashboardView,
        meta: {
          title: '대시보드',
          isAdmin: true,
        },
      },
      {
        path: 'AdminDashboard',
        name: 'AdminDashboardAlias',
        component: DashboardView,
        meta: {
          title: '대시보드',
          isAdmin: true,
        },
      },
      {
        path: 'organizations',
        name: 'AdminOrganizationManagement',
        component: OrganizationManagementView,
        meta: { title: '조직 및 멤버 관리' },
      },
      {
        path: 'organization-meetings',
        name: 'AdminOrganizationMeetingHistory',
        component: OrganizationMeetingHistoryView,
        meta: { title: '조직별 모임 관리' },
      },
      {
        path: 'attendance/stats',
        name: 'AdminAttendanceStats',
        component: AdminAttendanceStats,
        meta: { title: '출결 통계' },
      },
      /*
      {
        path: "members",
        name: "AdminMemberList",
        component: AdminMemberList,
        meta: { title: "회원 관리" },
      },
      {
        path: "members/:id",
        name: "AdminMemberDetail",
        component: AdminMemberDetail,
        meta: { title: "회원 상세" },
      },
      {
        path: "members/new",
        name: "AdminNewMembers",
        component: AdminNewMembers,
        meta: { title: "새가족 관리" },
      },
      {
        path: "members/absent",
        name: "AdminAbsentMembers",
        component: AdminAbsentMembers,
        meta: { title: "장기결석자 관리" },
      },
      {
        path: "attendance",
        name: "AdminAttendanceList",
        component: AdminAttendanceList,
        meta: { title: "출석 현황" },
      },
      {
        path: "visitation",
        name: "AdminVisitation",
        component: AdminVisitation,
        meta: { title: "심방 관리" },
      },
      {
        path: "statistics",
        name: "AdminStatistics",
        component: AdminStatistics,
        meta: { title: "통계" },
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: AdminSettings,
        meta: { title: "설정" },
      },
      */
    ],
  },
];

/**
 * @description Vue 라우터 인스턴스 생성 및 설정
 * @type {VueRouter}
 */
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// 대시보드 화면 관련 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  // 대시보드로 진입하는 경우 처리
  if (to.name === 'AdminDashboard' || to.name === 'AdminDashboardAlias') {
    // 대시보드 활성화 클래스 추가 (body 태그에)
    setTimeout(() => {
      document.body.classList.add('dashboard-active');

      // 사이드바 강제 닫기
      const sidebarElement = document.querySelector('.v-navigation-drawer');
      if (sidebarElement) {
        sidebarElement.style.transform = 'translateX(-100%)';
        sidebarElement.style.visibility = 'hidden';
      }
    }, 50);
  }
  // 대시보드에서 나가는 경우 처리
  else if (
    from.name === 'AdminDashboard' ||
    from.name === 'AdminDashboardAlias'
  ) {
    // 대시보드 활성화 클래스 제거
    document.body.classList.remove('dashboard-active');
  }

  // 라우트 이동 허용
  next();
});

// 인증 및 권한 관련 네비게이션 가드
router.beforeEach((to, from, next) => {
  // 로그인 페이지는 인증 없이 접근 가능
  const publicRoutes = ['/login', '/'];
  if (publicRoutes.includes(to.path)) {
    next();
    return;
  }

  const isAuthenticated = store.getters['auth/userAccessToken'];
  console.log('isAuthenticated', isAuthenticated);
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    next('/login');
    return;
  }

  const userInfo = store.getters['auth/userInfo'];

  // 사용자 권한 정보 추출
  const userPermissionName =
    userInfo && userInfo.roles && userInfo.roles.length > 0
      ? userInfo.roles[0].permissionName
      : null;
  const userName = userInfo ? userInfo.name : null;

  console.log('userPermissionName', userPermissionName);
  console.log('userName', userName);

  // 인증된 사용자의 권한 체크
  if (!hasPermissionForRoute(to, userPermissionName, userName)) {
    console.log('권한 없음 - 서비스 선택 페이지로 리다이렉트');
    next('/service-selection');
    return;
  }

  // 모든 조건을 통과하면 정상적으로 이동
  next();
});

export default router;
