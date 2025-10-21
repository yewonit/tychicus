<template>
  <div class="organization-management-page">
    <!-- 비밀번호 입력 화면 -->
    <v-card
      v-if="!isAuthenticated"
      rounded="lg"
      elevation="3"
      max-width="500px"
      class="mx-auto my-12"
    >
      <v-card-title class="text-center wc-bold-600 pt-8">
        <span class="text-h5">코람데오 두기고 인원관리 시스템</span>
        <div class="text-subtitle-1 mt-2 grey--text">
          Coramdeo Dugigo Member Management System
        </div>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form @submit.prevent="checkPassword">
          <v-text-field
            v-model="password"
            label="비밀번호를 입력하세요"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            background-color="#FFFFFF"
            color="#7EA394"
            solo
            rounded
            flat
            dense
            hide-details="auto"
            class="mb-7"
            :error-messages="passwordError"
            @input="passwordError = ''"
            @keyup.enter="checkPassword"
          ></v-text-field>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              color="#7EA394"
              dark
              rounded
              @click="checkPassword"
              :loading="loading"
            >
              확인
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 기존 조직관리 페이지 -->
    <v-card v-else rounded="lg" elevation="0">
      <v-card-title class="d-flex flex-column align-start">
        <span class="wc-bold-600 text-h5 mb-4">조직 및 멤버 관리</span>

        <div class="d-flex justify-space-between align-center w-100">
          <!-- 검색 기능 추가 -->
          <div class="search-container d-flex align-center">
            <v-text-field
              v-model="searchQuery"
              placeholder="조직/멤버 검색"
              prepend-inner-icon="mdi-magnify"
              background-color="#FFFFFF"
              color="#7EA394"
              solo
              rounded
              flat
              dense
              hide-details="auto"
              class="search-input"
              @input="debounceSearch"
              @focus="showSearchResults = true"
              @blur="hideSearchResultsDelayed"
              @keyup.esc="showSearchResults = false"
            ></v-text-field>
            <v-btn-toggle
              v-model="searchType"
              mandatory
              dense
              color="#7EA394"
              class="search-toggle rounded-lg ml-4"
            >
              <v-btn small value="all">전체</v-btn>
              <v-btn small value="organization">조직</v-btn>
              <v-btn small value="member">멤버</v-btn>
            </v-btn-toggle>

            <!-- 검색 결과 표시 영역 -->
            <v-card
              v-show="showSearchResults && searchResults.length > 0"
              class="search-results elevation-5"
              rounded
            >
              <v-list dense>
                <v-subheader v-if="filteredOrganizationResults.length > 0">
                  조직
                </v-subheader>
                <v-list-item
                  v-for="org in filteredOrganizationResults"
                  :key="`org-${org.id}`"
                  @click="selectSearchedOrganization(org)"
                  dense
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon small>mdi-folder</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ org.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      멤버: {{ org.memberCount || 0 }}명
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider
                  v-if="
                    filteredOrganizationResults.length > 0 &&
                    filteredMemberResults.length > 0
                  "
                ></v-divider>

                <v-subheader v-if="filteredMemberResults.length > 0">
                  멤버
                </v-subheader>
                <v-list-item
                  v-for="member in filteredMemberResults"
                  :key="`member-${member.userId}`"
                  @click="selectSearchedMember(member)"
                  dense
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon small>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ member.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ member.organizationName || '소속 정보 없음' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="searchResults.length === 0">
                  <v-list-item-content class="text-center">
                    <v-list-item-title>검색 결과가 없습니다.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>

          <div>
            <v-btn
              color="#7EA394"
              small
              rounded
              class="mr-2 white--text"
              @click="openOrganizationDialog()"
            >
              <v-icon left small>mdi-folder-plus</v-icon>
              조직 추가
            </v-btn>
            <v-btn
              color="#7EA394"
              small
              rounded
              :disabled="
                !selectedOrganization || !selectedOrganization.isLeafNode
              "
              @click="openMemberDialog()"
              class="white--text"
            >
              <v-icon left small>mdi-account-plus</v-icon>
              신규 인원 등록
            </v-btn>
            <v-btn
              color="grey darken-1"
              small
              rounded
              class="ml-2 white--text"
              @click="logout"
            >
              <v-icon left small>mdi-logout</v-icon>
              로그아웃
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs
          v-model="activeTab"
          background-color="transparent"
          color="#7EA394"
          grow
        >
          <v-tab>조직 & 멤버 관리</v-tab>
          <v-tab>새가족 관리(개발중)</v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <!-- 조직 & 멤버 관리 탭 -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" md="4">
                <organization-tree
                  :organization-tree="organizationTree"
                  @organization-selected="handleOrganizationSelect"
                  @edit-organization="openOrganizationDialog"
                  @delete-organization="confirmDeleteOrganization"
                  :expanded-org-ids="expandedOrganizationIds"
                />
              </v-col>
              <v-col cols="12" md="8">
                <member-list
                  :selected-organization="selectedOrganization"
                  :members="members"
                  :loading="loadingMembers"
                  @edit-member="openMemberDialog"
                  @delete-member="confirmDeleteMember"
                />
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- 새가족 관리 탭 -->
          <v-tab-item>
            <v-row>
              <v-col cols="12">
                <v-card flat>
                  <v-card-title>
                    <div class="d-flex align-center w-100">
                      <span class="text-h6">새가족 목록</span>
                      <v-spacer></v-spacer>

                      <!-- 날짜 필터 개선 -->
                      <div class="d-flex align-center">
                        <!-- 시작일 -->
                        <v-menu
                          v-model="startDatePickerMenu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="startDate"
                              label="시작일"
                              prepend-icon="mdi-calendar-start"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              background-color="#FFFFFF"
                              color="#7EA394"
                              solo
                              rounded
                              flat
                              dense
                              hide-details="auto"
                              class="max-width-150 mr-2"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="startDate"
                            @input="startDatePickerMenu = false"
                          ></v-date-picker>
                        </v-menu>

                        <!-- 종료일 -->
                        <v-menu
                          v-model="endDatePickerMenu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="endDate"
                              label="종료일"
                              prepend-icon="mdi-calendar-end"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              background-color="#FFFFFF"
                              color="#7EA394"
                              solo
                              rounded
                              flat
                              dense
                              hide-details="auto"
                              class="max-width-150"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="endDate"
                            @input="endDatePickerMenu = false"
                          ></v-date-picker>
                        </v-menu>

                        <v-btn
                          text
                          small
                          color="#7EA394"
                          class="ml-3"
                          @click="clearDateFilter"
                        >
                          전체 보기
                        </v-btn>
                      </div>
                    </div>
                  </v-card-title>

                  <!-- 그룹화 선택 -->
                  <v-card-subtitle>
                    <div class="d-flex align-center mb-2">
                      <span class="font-weight-medium mr-4">
                        날짜별 그룹핑:
                      </span>
                      <v-btn-toggle
                        v-model="dateGrouping"
                        mandatory
                        dense
                        color="#7EA394"
                        class="rounded-lg"
                      >
                        <v-btn small value="none">그룹화 없음</v-btn>
                        <v-btn small value="week">주차별</v-btn>
                        <v-btn small value="day">일별</v-btn>
                        <v-btn small value="month">월별</v-btn>
                        <v-btn small value="year">년도별</v-btn>
                      </v-btn-toggle>
                    </div>
                  </v-card-subtitle>

                  <!-- 날짜별 그룹화된 새가족 목록 -->
                  <div v-if="dateGrouping !== 'none'">
                    <div
                      v-for="(group, groupKey) in groupedNewMembers"
                      :key="groupKey"
                      class="mb-6"
                    >
                      <v-divider></v-divider>
                      <div class="group-header pa-2 pl-4">
                        <span class="text-subtitle-1 font-weight-bold">
                          {{ groupKey }} ({{ group.length }}명)
                        </span>
                      </div>
                      <v-data-table
                        :headers="newMembersHeaders"
                        :items="group"
                        hide-default-footer
                        disable-pagination
                        class="elevation-0"
                      >
                        <template #[`item.registrationDate`]="{ item }">
                          {{ formatDate(item.registrationDate) }}
                        </template>
                        <template #[`item.genderType`]="{ item }">
                          {{ item.genderType === 'M' ? '남성' : '여성' }}
                        </template>
                        <template #[`item.actions`]="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="openMemberDialog(item)"
                          >
                            mdi-pencil
                          </v-icon>
                          <v-icon small @click="confirmDeleteMember(item)">
                            mdi-delete
                          </v-icon>
                        </template>
                      </v-data-table>
                    </div>
                  </div>

                  <!-- 기존 테이블 (그룹화 없을 때) -->
                  <v-data-table
                    v-else
                    :headers="newMembersHeaders"
                    :items="filteredNewMembers"
                    :loading="loadingAllMembers"
                    :items-per-page="10"
                    :footer-props="{
                      'items-per-page-options': [10, 20, 50, 100],
                    }"
                    class="elevation-1"
                  >
                    <template #[`item.registrationDate`]="{ item }">
                      {{ formatDate(item.registrationDate) }}
                    </template>
                    <template #[`item.genderType`]="{ item }">
                      {{ item.genderType === 'M' ? '남성' : '여성' }}
                    </template>
                    <template #[`item.actions`]="{ item }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="openMemberDialog(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon small @click="confirmDeleteMember(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <template #no-data>
                      <div class="text-center pa-4">
                        <p v-if="loadingAllMembers">
                          새가족 정보를 불러오는 중입니다...
                        </p>
                        <p v-else>등록된 새가족이 없습니다.</p>
                      </div>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>

    <!-- 조직 추가/수정 다이얼로그 -->
    <organization-dialog
      v-model="organizationDialog"
      :organization="editedOrganization"
      :organization-select-items="organizationSelectItems"
      @save="saveOrganization"
    />

    <!-- 멤버 추가/수정 다이얼로그 -->
    <member-form
      v-model="memberDialog"
      :member="editedMember"
      :saving-member="savingMember"
      @save="saveMember"
      @validation-failed="handleValidationFailure"
    />

    <!-- 삭제 확인 다이얼로그 -->
    <delete-confirm-dialog
      v-model="deleteDialog"
      :text="deleteDialogText"
      @confirm="deleteConfirm"
    />
  </div>
</template>

<script>
  import { CurrentMemberCtrl } from '@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl';
  import { OrganizationCtrl } from '@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl';
  import { mapState } from 'vuex';

  // 분리된 컴포넌트 import
  import DeleteConfirmDialog from '@/components/admin/organization/DeleteConfirmDialog.vue';
  import MemberForm from '@/components/admin/organization/MemberForm.vue';
  import MemberList from '@/components/admin/organization/MemberList.vue';
  import OrganizationDialog from '@/components/admin/organization/OrganizationDialog.vue';
  import OrganizationTree from '@/components/admin/organization/OrganizationTree.vue';

  // 메서드 모듈 import (유틸리티 함수들은 메서드 모듈에서 import함)
  import searchMethods from './methods/searchMethods';
  import authMethods from './methods/authMethods';
  import organizationMethods from './methods/organizationMethods';
  import memberMethods from './methods/memberMethods';
  import utilMethods from './methods/utilMethods';

  export default {
    name: 'OrganizationManagementView',
    mixins: [CurrentMemberCtrl, OrganizationCtrl],

    components: {
      OrganizationTree,
      MemberList,
      MemberForm,
      OrganizationDialog,
      DeleteConfirmDialog,
    },

    data() {
      return {
        // 검색 관련 데이터 추가
        searchQuery: '',
        searchType: 'all',
        searchResults: [],
        showSearchResults: false,
        searchDebounceTimeout: null,
        searchResultsTimeout: null,
        highlightedMemberId: null,
        expandedOrganizationIds: [],

        // 전체 멤버 캐싱
        memberCache: {},
        allMembersLoaded: false,

        // 비밀번호 인증 관련
        isAuthenticated: false,
        password: '',
        showPassword: false,
        passwordError: '',
        loading: false,
        correctPassword: 'coramdeo', // 하드코딩된 비밀번호

        // 조직 관련
        organizations: [],
        organizationTree: [], // 빈 배열로 초기화
        selectedOrganizationIndex: -1,
        selectedOrganization: null,
        organizationDialog: false,
        editedOrganization: {
          id: null,
          name: '',
          organization_code: '',
          description: '',
        },
        // 조직 구조 캐싱
        cachedOrganizations: null,
        organizationCacheExpiry: null,
        organizationCacheDuration: 30 * 60 * 1000, // 30분 캐시 지속 시간

        // 멤버 관련
        members: [],
        loadingMembers: false,
        memberDialog: false,
        birthDateMenu: false,
        registrationDateMenu: false,
        savingMember: false, // 멤버 저장 중 상태 추가
        editedMember: {
          userId: null,
          name: '',
          nameSuffix: '',
          phoneNumber: '',
          genderType: 'M',
          email: '',
          birthDate: null,
          isNewMember: 'N',
          isLongTermAbsentee: 'N',
          isKakaotalkChatMember: 'N',
          roleId: 74,
          roleName: '순원',
          memberNumber: '',
          registrationDate: null,
          countryCode: 'KOR',
          address: '',
          addressDetail: '',
          postcode: '',
          hobby: '',
          city: null,
          stateProvince: null,
          isAddressPublic: 'N',
          isPhoneNumberPublic: 'N',
          snsUrl: null,
        },
        originalMember: null, // 원본 멤버 데이터 저장용

        // 역할 정보
        roleItems: [
          { text: '그룹장', value: 72 },
          { text: '부순장', value: 73 },
          { text: '순원', value: 74 },
        ],

        // 데이터 테이블 헤더
        memberHeaders: [
          { text: '이름', value: 'name', sortable: true },
          { text: '전화번호', value: 'phoneNumber', sortable: true },
          { text: '이메일', value: 'email', sortable: true },
          { text: '성별', value: 'genderType', sortable: true },
          { text: '상태/역할', value: 'status', sortable: false },
          { text: '관리', value: 'actions', sortable: false, align: 'right' },
        ],

        // 삭제 다이얼로그
        deleteDialog: false,
        deleteDialogText: '',
        deleteType: '', // "organization" 또는 "member"
        deleteItem: null,

        // 탭 관련
        activeTab: 0,
        newMembersHeaders: [
          { text: '이름', value: 'name' },
          { text: '성별', value: 'genderType' },
          { text: '조직', value: 'organizationName' },
          { text: '등록일', value: 'registrationDate' },
          { text: '관리', value: 'actions', sortable: false, align: 'right' },
        ],
        allNewMembers: [], // 모든 새가족 데이터
        loadingAllMembers: false,
        startDatePickerMenu: false,
        startDate: null,
        endDatePickerMenu: false,
        endDate: null,
        dateGrouping: 'week',
      };
    },

    computed: {
      ...mapState('auth', ['userInfo']),

      // 필터링된 검색 결과
      filteredOrganizationResults() {
        if (this.searchType === 'member') return [];
        return this.searchResults.filter(
          (item) => item.type === 'organization'
        );
      },

      filteredMemberResults() {
        if (this.searchType === 'organization') return [];
        return this.searchResults.filter((item) => item.type === 'member');
      },

      // 조직 선택 드롭다운 아이템
      organizationSelectItems() {
        return this.organizations.map((org) => ({
          text: `${org.name} (ID: ${org.id})`,
          value: org.id,
        }));
      },

      // 데이터 변경 감지
      isDataChanged() {
        if (!this.originalMember) return true; // 새로 추가하는 경우는 항상 변경됨으로 간주
        return (
          JSON.stringify(this.editedMember) !==
          JSON.stringify(this.originalMember)
        );
      },

      // 날짜별 필터링된 새가족 목록
      filteredNewMembers() {
        if (!this.allNewMembers || !Array.isArray(this.allNewMembers)) {
          return [];
        }

        // 날짜 필터가 설정된 경우
        if (this.startDate && this.endDate) {
          return this.allNewMembers.filter((member) => {
            if (!member.registrationDate) return false;

            // YYYY-MM-DD 형식으로 변환
            let memberDate = member.registrationDate;
            if (memberDate.length === 8) {
              // YYYYMMDD 형식을 YYYY-MM-DD로 변환
              memberDate = `${memberDate.substring(
                0,
                4
              )}-${memberDate.substring(4, 6)}-${memberDate.substring(6, 8)}`;
            }

            return memberDate >= this.startDate && memberDate <= this.endDate;
          });
        }

        // 날짜 필터가 없는 경우 모든 새가족 목록 반환
        return this.allNewMembers;
      },

      // 날짜별 그룹화된 새가족 목록
      groupedNewMembers() {
        const members = this.filteredNewMembers;
        if (
          !members ||
          !Array.isArray(members) ||
          !this.dateGrouping ||
          this.dateGrouping === 'none'
        ) {
          return {};
        }

        const grouped = {};

        // 주차별 그룹핑을 위한 날짜 계산 함수
        const getWeekGroup = (dateStr) => {
          const today = new Date();
          const targetDate = new Date(dateStr);

          // 현재 날짜의 주의 시작일(일요일)과 종료일(토요일) 구하기
          const currentWeekStart = new Date(today);
          const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
          currentWeekStart.setDate(today.getDate() - dayOfWeek); // 이번주 일요일

          const oneWeekAgo = new Date(currentWeekStart);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // 저번주 일요일

          const twoWeeksAgo = new Date(oneWeekAgo);
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7); // 저저번주 일요일

          const threeWeeksAgo = new Date(twoWeeksAgo);
          threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 7); // 3주 전 일요일

          const fourWeeksAgo = new Date(threeWeeksAgo);
          fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 7); // 4주 전 일요일

          // 어느 주차에 속하는지 확인
          if (targetDate >= currentWeekStart) {
            return { key: 'thisWeek', label: '이번 주' };
          } else if (targetDate >= oneWeekAgo) {
            return { key: 'lastWeek', label: '지난 주' };
          } else if (targetDate >= twoWeeksAgo) {
            return { key: 'twoWeeksAgo', label: '2주 전' };
          } else if (targetDate >= threeWeeksAgo) {
            return { key: 'threeWeeksAgo', label: '3주 전' };
          } else if (targetDate >= fourWeeksAgo) {
            return { key: 'fourWeeksAgo', label: '4주 전' };
          } else {
            // 4주 이전의 날짜는 월별로 그룹화
            const month = targetDate.getMonth() + 1;
            const year = targetDate.getFullYear();
            return {
              key: `${year}-${month.toString().padStart(2, '0')}`,
              label: `${year}년 ${month}월`,
            };
          }
        };

        for (const member of members) {
          if (!member.registrationDate) continue;

          // YYYY-MM-DD 형식으로 변환
          let dateStr = member.registrationDate;
          if (dateStr.length === 8) {
            // YYYYMMDD 형식을 YYYY-MM-DD로 변환
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            dateStr = `${year}-${month}-${day}`;
          }

          // 그룹화 기준에 따라 키 생성
          let groupKey = '';

          if (this.dateGrouping === 'week') {
            // 주차별 그룹화
            const weekGroup = getWeekGroup(dateStr);
            groupKey = weekGroup.key;
          } else if (this.dateGrouping === 'day') {
            // 일별 그룹화: YYYY-MM-DD
            groupKey = dateStr;
          } else if (this.dateGrouping === 'month') {
            // 월별 그룹화: YYYY-MM
            groupKey = dateStr.substring(0, 7);
          } else if (this.dateGrouping === 'year') {
            // 연별 그룹화: YYYY
            groupKey = dateStr.substring(0, 4);
          }

          if (!groupKey) continue;

          // 그룹에 추가
          if (!grouped[groupKey]) {
            grouped[groupKey] = [];
          }
          grouped[groupKey].push(member);
        }

        // 그룹 키 정렬 및 표시 이름 설정
        const sortedGrouped = {};

        // 주차별 그룹핑인 경우 특별 처리
        if (this.dateGrouping === 'week') {
          // 주차 순서 정의
          const weekOrder = [
            'thisWeek',
            'lastWeek',
            'twoWeeksAgo',
            'threeWeeksAgo',
            'fourWeeksAgo',
          ];

          // 먼저 주차 그룹 정렬
          weekOrder.forEach((weekKey) => {
            if (grouped[weekKey]) {
              // 주차별 라벨 설정
              let label;
              switch (weekKey) {
                case 'thisWeek':
                  label = '이번 주';
                  break;
                case 'lastWeek':
                  label = '지난 주';
                  break;
                case 'twoWeeksAgo':
                  label = '2주 전';
                  break;
                case 'threeWeeksAgo':
                  label = '3주 전';
                  break;
                case 'fourWeeksAgo':
                  label = '4주 전';
                  break;
                default:
                  label = weekKey;
              }

              sortedGrouped[label] = grouped[weekKey];
            }
          });

          // 그 다음 기타 월별 그룹 추가 (4주 이전 데이터)
          const otherKeys = Object.keys(grouped)
            .filter((key) => !weekOrder.includes(key))
            .sort((a, b) => b.localeCompare(a));

          otherKeys.forEach((key) => {
            // 월별 포맷인 경우
            if (key.match(/^\d{4}-\d{2}$/)) {
              const [year, month] = key.split('-');
              sortedGrouped[`${year}년 ${month}월`] = grouped[key];
            } else {
              sortedGrouped[key] = grouped[key];
            }
          });
        } else {
          // 기존 정렬 로직
          Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a))
            .forEach((key) => {
              // 그룹 표시용 라벨 형식화
              let displayKey = key;
              if (this.dateGrouping === 'month') {
                const [year, month] = key.split('-');
                displayKey = `${year}년 ${month}월`;
              } else if (this.dateGrouping === 'year') {
                displayKey = `${key}년`;
              } else if (this.dateGrouping === 'day') {
                const [year, month, day] = key.split('-');
                displayKey = `${year}년 ${month}월 ${day}일`;
              }

              sortedGrouped[displayKey] = grouped[key];
            });
        }

        return sortedGrouped;
      },
    },

    watch: {
      // 활성 탭 변경을 감지
      activeTab(newVal) {
        // 새가족 탭이 선택된 경우(index 1)
        if (newVal === 1) {
          this.loadAllNewMembers();
        }
      },

      // 날짜 필터 변경 감지
      startDate() {
        // 시작일만 설정된 경우 종료일도 자동으로 설정
        if (this.startDate && !this.endDate) {
          this.endDate = this.startDate;
        }
      },

      endDate() {
        // 종료일만 설정된 경우 시작일도 자동으로 설정
        if (this.endDate && !this.startDate) {
          this.startDate = this.endDate;
        }

        // 종료일이 시작일보다 이전이면 시작일을 종료일로 조정
        if (this.startDate && this.endDate && this.endDate < this.startDate) {
          this.startDate = this.endDate;
        }
      },

      // 날짜 그룹화 옵션 변경 감지
      dateGrouping() {},
    },

    created() {
      try {
        // 로컬 스토리지에서 인증 상태 확인
        const storedAuth = localStorage.getItem('coramdeoAuth');
        if (storedAuth === 'true') {
          this.isAuthenticated = true;
        }

        // 사용자 정보 확인
        if (this.userInfo && this.userInfo.id) {
          // 사용자 정보 확인
        } else {
          // 사용자 정보가 없습니다
        }

        // 조직 트리 초기화
        this.organizationTree = [];

        // 인증된 상태인 경우에만 조직 데이터 초기화
        if (this.isAuthenticated) {
          // 조직 데이터 초기화
          this.$nextTick(() => {
            // 조직 데이터 로드 및 멤버 수 계산
            this.fetchOrganizationsOnly()
              .then(() => {
                this.calculateMemberCounts();
              })
              .catch(() => {
                // 조직 데이터 로드 중 오류
              });
          });
        }
      } catch {
        // 초기화 중 오류 발생
        this.organizations = [];
        this.organizationTree = [];
      }
    },

    mounted() {
      // 인증된 상태인 경우에만 조직 데이터 로드
      if (this.isAuthenticated) {
        // 조직 데이터가 없으면 다시 로드
        if (!this.organizations || this.organizations.length === 0) {
          this.fetchOrganizationsOnly()
            .then(() => {
              // 첫 번째 조직 자동 선택
              this.$nextTick(() => {
                if (this.organizationTree && this.organizationTree.length > 0) {
                  this.selectFirstLeafNode(this.organizationTree);
                }
              });
            })
            .catch(() => {
              // 마운트 후 조직 데이터 로드 중 오류
            });
        } else {
          // 첫 번째 조직 자동 선택
          this.$nextTick(() => {
            if (this.organizationTree && this.organizationTree.length > 0) {
              this.selectFirstLeafNode(this.organizationTree);
            }
          });
        }

        // Daum 우편번호 서비스 스크립트 로드
        if (!window.daum || !window.daum.Postcode) {
          const script = document.createElement('script');
          script.src =
            '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
          script.async = true;
          document.head.appendChild(script);
        }
      }
    },

    methods: {
      // 분리된 메서드 모듈 병합
      ...searchMethods,
      ...authMethods,
      ...organizationMethods,
      ...memberMethods,
      ...utilMethods,

      // 기존 메서드들은 모두 위 모듈 파일들로 이동되었습니다.
      // searchMethods.js: debounceSearch, searchItems, searchOrganizations, searchMembers, etc.
      // authMethods.js: checkPassword, logout
      // organizationMethods.js: fetchOrganizationsOnly, selectOrganization, saveOrganization, etc.
      // memberMethods.js: fetchMembers, saveMember, deleteMember, etc.
      // utilMethods.js: showMessage, formatDate, etc.
    },
  };
</script>

<style lang="scss" scoped>
  // 모듈 스타일 import
  @import '@/styles/modules/table.scss';
  @import '@/styles/modules/member.scss';
  @import '@/styles/modules/form.scss';
  @import '@/styles/modules/toggle-switch.scss';
  @import '@/styles/modules/search.scss';
  @import '@/styles/modules/date-group.scss';
  @import '@/styles/modules/tree.scss';

  // 텍스트 스타일 (공통 스타일로 이동 가능)
  .wc-bold-600 {
    font-weight: 600;
  }

  .wc-fs-18 {
    font-size: 18px;
  }

  .wc-direction-text {
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
