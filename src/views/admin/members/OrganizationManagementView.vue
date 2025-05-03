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
                <v-subheader v-if="filteredOrganizationResults.length > 0"
                  >조직</v-subheader
                >
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
                    <v-list-item-title>{{
                      org.organization_name
                    }}</v-list-item-title>
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

                <v-subheader v-if="filteredMemberResults.length > 0"
                  >멤버</v-subheader
                >
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
                      {{ member.organizationName || "소속 정보 없음" }}
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
                  @tree-input="(val) => console.log('트리뷰 입력 이벤트:', val)"
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
                      <span class="font-weight-medium mr-4"
                        >날짜별 그룹핑:</span
                      >
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
                        <span class="text-subtitle-1 font-weight-bold"
                          >{{ groupKey }} ({{ group.length }}명)</span
                        >
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
                          {{ item.genderType === "M" ? "남성" : "여성" }}
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
                      {{ item.genderType === "M" ? "남성" : "여성" }}
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
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import moment from "moment-timezone";

// 분리된 컴포넌트 import
import DeleteConfirmDialog from "@/components/admin/organization/DeleteConfirmDialog.vue";
import MemberForm from "@/components/admin/organization/MemberForm.vue";
import MemberList from "@/components/admin/organization/MemberList.vue";
import OrganizationDialog from "@/components/admin/organization/OrganizationDialog.vue";
import OrganizationTree from "@/components/admin/organization/OrganizationTree.vue";

export default {
  name: "OrganizationManagementView",
  mixins: [MasterCtrl, CurrentMemberCtrl, OrganizationCtrl],

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
      searchQuery: "",
      searchType: "all",
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
      password: "",
      showPassword: false,
      passwordError: "",
      loading: false,
      correctPassword: "coramdeo", // 하드코딩된 비밀번호

      // 조직 관련
      organizations: [],
      organizationTree: [], // 빈 배열로 초기화
      selectedOrganizationIndex: -1,
      selectedOrganization: null,
      organizationDialog: false,
      editedOrganization: {
        id: null,
        organization_name: "",
        organization_code: "",
        organization_description: "",
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
        name: "",
        nameSuffix: "",
        phoneNumber: "",
        genderType: "M",
        email: "",
        birthDate: null,
        isNewMember: "N",
        isLongTermAbsentee: "N",
        isKakaotalkChatMember: "N",
        roleId: 74,
        roleName: "순원",
        memberNumber: "",
        registrationDate: null,
        countryCode: "KOR",
        address: "",
        addressDetail: "",
        postcode: "",
        hobby: "",
        city: null,
        stateProvince: null,
        isAddressPublic: "N",
        isPhoneNumberPublic: "N",
        snsUrl: null,
      },
      originalMember: null, // 원본 멤버 데이터 저장용

      // 역할 정보
      roleItems: [
        { text: "그룹장", value: 72 },
        { text: "EBS", value: 73 },
        { text: "순원", value: 74 },
      ],

      // 데이터 테이블 헤더
      memberHeaders: [
        { text: "이름", value: "name", sortable: true },
        { text: "전화번호", value: "phoneNumber", sortable: true },
        { text: "이메일", value: "email", sortable: true },
        { text: "성별", value: "genderType", sortable: true },
        { text: "상태/역할", value: "status", sortable: false },
        { text: "관리", value: "actions", sortable: false, align: "right" },
      ],

      // 삭제 다이얼로그
      deleteDialog: false,
      deleteDialogText: "",
      deleteType: "", // "organization" 또는 "member"
      deleteItem: null,

      // 조직 트리 관련
      activeOrganization: [],

      // 국가 정보
      countryItems: [
        { text: "가나", value: "GHA" },
        { text: "가봉", value: "GAB" },
        { text: "가이아나", value: "GUY" },
        { text: "감비아", value: "GMB" },
        { text: "과테말라", value: "GTM" },
        { text: "그레나다", value: "GRD" },
        { text: "그리스", value: "GRC" },
        { text: "기니", value: "GIN" },
        { text: "기니비사우", value: "GNB" },
        { text: "나미비아", value: "NAM" },
        { text: "나우루", value: "NRU" },
        { text: "나이지리아", value: "NGA" },
        { text: "남수단", value: "SSD" },
        { text: "남아프리카공화국", value: "ZAF" },
        { text: "네덜란드", value: "NLD" },
        { text: "네팔", value: "NPL" },
        { text: "노르웨이", value: "NOR" },
        { text: "뉴질랜드", value: "NZL" },
        { text: "니우에", value: "NIU" },
        { text: "니제르", value: "NER" },
        { text: "니카라과", value: "NIC" },
        { text: "대만", value: "TWN" },
        { text: "대한민국", value: "KOR" },
        { text: "덴마크", value: "DNK" },
        { text: "도미니카공화국", value: "DOM" },
        { text: "도미니카연방", value: "DMA" },
        { text: "독일", value: "DEU" },
        { text: "동티모르", value: "TLS" },
        { text: "라오스", value: "LAO" },
        { text: "라이베리아", value: "LBR" },
        { text: "라트비아", value: "LVA" },
        { text: "레바논", value: "LBN" },
        { text: "레소토", value: "LSO" },
        { text: "루마니아", value: "ROU" },
        { text: "룩셈부르크", value: "LUX" },
        { text: "르완다", value: "RWA" },
        { text: "리비아", value: "LBY" },
        { text: "리투아니아", value: "LTU" },
        { text: "리히텐슈타인", value: "LIE" },
        { text: "마다가스카르", value: "MDG" },
        { text: "마셜제도", value: "MHL" },
        { text: "마카오", value: "MAC" },
        { text: "말라위", value: "MWI" },
        { text: "말레이시아", value: "MYS" },
        { text: "말리", value: "MLI" },
        { text: "멕시코", value: "MEX" },
        { text: "모나코", value: "MCO" },
        { text: "모로코", value: "MAR" },
        { text: "모리셔스", value: "MUS" },
        { text: "모리타니아", value: "MRT" },
        { text: "모잠비크", value: "MOZ" },
        { text: "몬테네그로", value: "MNE" },
        { text: "몰도바", value: "MDA" },
        { text: "몰디브", value: "MDV" },
        { text: "몰타", value: "MLT" },
        { text: "몽골", value: "MNG" },
        { text: "미국", value: "USA" },
        { text: "미얀마", value: "MMR" },
        { text: "미크로네시아", value: "FSM" },
        { text: "바누아투", value: "VUT" },
        { text: "바레인", value: "BHR" },
        { text: "바베이도스", value: "BRB" },
        { text: "바티칸시국", value: "VAT" },
        { text: "바하마", value: "BHS" },
        { text: "방글라데시", value: "BGD" },
        { text: "베냉", value: "BEN" },
        { text: "베네수엘라", value: "VEN" },
        { text: "베트남", value: "VNM" },
        { text: "벨기에", value: "BEL" },
        { text: "벨라루스", value: "BLR" },
        { text: "벨리즈", value: "BLZ" },
        { text: "보스니아헤르체고비나", value: "BIH" },
        { text: "보츠와나", value: "BWA" },
        { text: "볼리비아", value: "BOL" },
        { text: "부룬디", value: "BDI" },
        { text: "부르키나파소", value: "BFA" },
        { text: "부탄", value: "BTN" },
        { text: "북마케도니아", value: "MKD" },
        { text: "북한", value: "PRK" },
        { text: "불가리아", value: "BGR" },
        { text: "브라질", value: "BRA" },
        { text: "브루나이", value: "BRN" },
        { text: "사모아", value: "WSM" },
        { text: "사우디아라비아", value: "SAU" },
        { text: "산마리노", value: "SMR" },
        { text: "상투메프린시페", value: "STP" },
        { text: "세네갈", value: "SEN" },
        { text: "세르비아", value: "SRB" },
        { text: "세이셸", value: "SYC" },
        { text: "세인트루시아", value: "LCA" },
        { text: "세인트빈센트그레나딘", value: "VCT" },
        { text: "세인트키츠네비스", value: "KNA" },
        { text: "소말리아", value: "SOM" },
        { text: "솔로몬제도", value: "SLB" },
        { text: "수단", value: "SDN" },
        { text: "수리남", value: "SUR" },
        { text: "스리랑카", value: "LKA" },
        { text: "스웨덴", value: "SWE" },
        { text: "스위스", value: "CHE" },
        { text: "스페인", value: "ESP" },
        { text: "슬로바키아", value: "SVK" },
        { text: "슬로베니아", value: "SVN" },
        { text: "시에라리온", value: "SLE" },
        { text: "싱가포르", value: "SGP" },
        { text: "아랍에미리트", value: "ARE" },
        { text: "아르메니아", value: "ARM" },
        { text: "아르헨티나", value: "ARG" },
        { text: "아이슬란드", value: "ISL" },
        { text: "아이티", value: "HTI" },
        { text: "아일랜드", value: "IRL" },
        { text: "아제르바이잔", value: "AZE" },
        { text: "아프가니스탄", value: "AFG" },
        { text: "안도라", value: "AND" },
        { text: "알바니아", value: "ALB" },
        { text: "알제리", value: "DZA" },
        { text: "앙골라", value: "AGO" },
        { text: "앤티가바부다", value: "ATG" },
        { text: "에리트레아", value: "ERI" },
        { text: "에스토니아", value: "EST" },
        { text: "에스와티니", value: "SWZ" },
        { text: "에콰도르", value: "ECU" },
        { text: "에티오피아", value: "ETH" },
        { text: "엘살바도르", value: "SLV" },
        { text: "영국", value: "GBR" },
        { text: "예멘", value: "YEM" },
        { text: "오만", value: "OMN" },
        { text: "오스트레일리아", value: "AUS" },
        { text: "오스트리아", value: "AUT" },
        { text: "온두라스", value: "HND" },
        { text: "요르단", value: "JOR" },
        { text: "우간다", value: "UGA" },
        { text: "우루과이", value: "URY" },
        { text: "우즈베키스탄", value: "UZB" },
        { text: "우크라이나", value: "UKR" },
        { text: "이라크", value: "IRQ" },
        { text: "이란", value: "IRN" },
        { text: "이스라엘", value: "ISR" },
        { text: "이집트", value: "EGY" },
        { text: "이탈리아", value: "ITA" },
        { text: "인도", value: "IND" },
        { text: "인도네시아", value: "IDN" },
        { text: "일본", value: "JPN" },
        { text: "자메이카", value: "JAM" },
        { text: "잠비아", value: "ZMB" },
        { text: "적도기니", value: "GNQ" },
        { text: "조지아", value: "GEO" },
        { text: "중국", value: "CHN" },
        { text: "중앙아프리카공화국", value: "CAF" },
        { text: "지부티", value: "DJI" },
        { text: "짐바브웨", value: "ZWE" },
        { text: "차드", value: "TCD" },
        { text: "체코", value: "CZE" },
        { text: "칠레", value: "CHL" },
        { text: "카메룬", value: "CMR" },
        { text: "카보베르데", value: "CPV" },
        { text: "카자흐스탄", value: "KAZ" },
        { text: "카타르", value: "QAT" },
        { text: "캄보디아", value: "KHM" },
        { text: "캐나다", value: "CAN" },
        { text: "케냐", value: "KEN" },
        { text: "코모로", value: "COM" },
        { text: "코소보", value: "XKX" },
        { text: "코스타리카", value: "CRI" },
        { text: "코트디부아르", value: "CIV" },
        { text: "콜롬비아", value: "COL" },
        { text: "콩고공화국", value: "COG" },
        { text: "콩고민주공화국", value: "COD" },
        { text: "쿠바", value: "CUB" },
        { text: "쿠웨이트", value: "KWT" },
        { text: "쿡제도", value: "COK" },
        { text: "크로아티아", value: "HRV" },
        { text: "키르기스스탄", value: "KGZ" },
        { text: "키리바시", value: "KIR" },
        { text: "키프로스", value: "CYP" },
        { text: "타지키스탄", value: "TJK" },
        { text: "탄자니아", value: "TZA" },
        { text: "태국", value: "THA" },
        { text: "토고", value: "TGO" },
        { text: "통가", value: "TON" },
        { text: "투르크메니스탄", value: "TKM" },
        { text: "투발루", value: "TUV" },
        { text: "튀니지", value: "TUN" },
        { text: "터키", value: "TUR" },
        { text: "트리니다드토바고", value: "TTO" },
        { text: "파나마", value: "PAN" },
        { text: "파라과이", value: "PRY" },
        { text: "파키스탄", value: "PAK" },
        { text: "파푸아뉴기니", value: "PNG" },
        { text: "팔라우", value: "PLW" },
        { text: "팔레스타인", value: "PSE" },
        { text: "페루", value: "PER" },
        { text: "포르투갈", value: "PRT" },
        { text: "폴란드", value: "POL" },
        { text: "프랑스", value: "FRA" },
        { text: "피지", value: "FJI" },
        { text: "핀란드", value: "FIN" },
        { text: "필리핀", value: "PHL" },
        { text: "헝가리", value: "HUN" },
        { text: "홍콩", value: "HKG" },
        { text: "러시아", value: "RUS" },
        { text: "기타", value: "ETC" },
      ],

      emailRules: [
        (v) => !!v || "이메일을 입력해주세요",
        (v) => /.+@.+\..+/.test(v) || "이메일이 유효하지 않습니다.",
      ],

      validationErrors: {
        name: false,
        phoneNumber: false,
        genderType: false,
        roleId: false,
      },

      activeTab: 0,
      datePickerMenu: false,
      selectedDate: null,
      newMembersHeaders: [
        { text: "이름", value: "name" },
        { text: "성별", value: "genderType" },
        { text: "조직", value: "organizationName" },
        { text: "등록일", value: "registrationDate" },
        { text: "관리", value: "actions", sortable: false, align: "right" },
      ],
      allNewMembers: [], // 모든 새가족 데이터
      loadingAllMembers: false,
      startDatePickerMenu: false,
      startDate: null,
      endDatePickerMenu: false,
      endDate: null,
      dateGrouping: "week",
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),

    // 필터링된 검색 결과
    filteredOrganizationResults() {
      if (this.searchType === "member") return [];
      return this.searchResults.filter((item) => item.type === "organization");
    },

    filteredMemberResults() {
      if (this.searchType === "organization") return [];
      return this.searchResults.filter((item) => item.type === "member");
    },

    // 조직 선택 드롭다운 아이템
    organizationSelectItems() {
      return this.organizations.map((org) => ({
        text: `${org.organization_name} (ID: ${org.id})`,
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
            memberDate = `${memberDate.substring(0, 4)}-${memberDate.substring(
              4,
              6
            )}-${memberDate.substring(6, 8)}`;
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
        this.dateGrouping === "none"
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
          return { key: "thisWeek", label: "이번 주" };
        } else if (targetDate >= oneWeekAgo) {
          return { key: "lastWeek", label: "지난 주" };
        } else if (targetDate >= twoWeeksAgo) {
          return { key: "twoWeeksAgo", label: "2주 전" };
        } else if (targetDate >= threeWeeksAgo) {
          return { key: "threeWeeksAgo", label: "3주 전" };
        } else if (targetDate >= fourWeeksAgo) {
          return { key: "fourWeeksAgo", label: "4주 전" };
        } else {
          // 4주 이전의 날짜는 월별로 그룹화
          const month = targetDate.getMonth() + 1;
          const year = targetDate.getFullYear();
          return {
            key: `${year}-${month.toString().padStart(2, "0")}`,
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
        let groupKey = "";

        if (this.dateGrouping === "week") {
          // 주차별 그룹화
          const weekGroup = getWeekGroup(dateStr);
          groupKey = weekGroup.key;
        } else if (this.dateGrouping === "day") {
          // 일별 그룹화: YYYY-MM-DD
          groupKey = dateStr;
        } else if (this.dateGrouping === "month") {
          // 월별 그룹화: YYYY-MM
          groupKey = dateStr.substring(0, 7);
        } else if (this.dateGrouping === "year") {
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
      if (this.dateGrouping === "week") {
        // 주차 순서 정의
        const weekOrder = [
          "thisWeek",
          "lastWeek",
          "twoWeeksAgo",
          "threeWeeksAgo",
          "fourWeeksAgo",
        ];

        // 먼저 주차 그룹 정렬
        weekOrder.forEach((weekKey) => {
          if (grouped[weekKey]) {
            // 주차별 라벨 설정
            let label;
            switch (weekKey) {
              case "thisWeek":
                label = "이번 주";
                break;
              case "lastWeek":
                label = "지난 주";
                break;
              case "twoWeeksAgo":
                label = "2주 전";
                break;
              case "threeWeeksAgo":
                label = "3주 전";
                break;
              case "fourWeeksAgo":
                label = "4주 전";
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
            const [year, month] = key.split("-");
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
            if (this.dateGrouping === "month") {
              const [year, month] = key.split("-");
              displayKey = `${year}년 ${month}월`;
            } else if (this.dateGrouping === "year") {
              displayKey = `${key}년`;
            } else if (this.dateGrouping === "day") {
              const [year, month, day] = key.split("-");
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
    dateGrouping(newVal) {
      console.log("날짜 그룹화 옵션 변경:", newVal);
    },
  },

  created() {
    try {
      // 로컬 스토리지에서 인증 상태 확인
      const storedAuth = localStorage.getItem("coramdeoAuth");
      if (storedAuth === "true") {
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
        const script = document.createElement("script");
        script.src =
          "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  },

  methods: {
    // 검색 관련 메서드 추가
    debounceSearch() {
      clearTimeout(this.searchDebounceTimeout);
      this.searchDebounceTimeout = setTimeout(() => {
        this.searchItems();
      }, 300); // 300ms 디바운싱
    },

    hideSearchResultsDelayed() {
      clearTimeout(this.searchResultsTimeout);
      this.searchResultsTimeout = setTimeout(() => {
        this.showSearchResults = false;
      }, 200);
    },

    searchItems() {
      // 검색어가 없으면 검색 결과 초기화
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        this.showSearchResults = false;
        return;
      }

      const query = this.searchQuery.toLowerCase().trim();
      const results = [];

      // 검색 타입에 따라 다른 검색 로직 적용
      if (this.searchType === "all" || this.searchType === "organization") {
        // 조직 검색 로직
        this.searchOrganizations(query, results);
      }

      if (this.searchType === "all" || this.searchType === "member") {
        // 멤버 검색 로직
        this.searchMembers(query, results);
      }

      this.searchResults = results;
      this.showSearchResults = results.length > 0;
    },

    searchOrganizations(query, results) {
      const searchInOrganizations = (orgs) => {
        orgs.forEach((org) => {
          if (org.organization_name.toLowerCase().includes(query)) {
            // 최하위 조직(isLeafNode가 true)인 경우에만 결과에 추가
            if (org.isLeafNode) {
              results.push({
                type: "organization",
                id: org.id,
                organization_name: org.organization_name,
                organization_code: org.organization_code,
                memberCount: org.memberCount,
                isLeafNode: org.isLeafNode,
                path: this.getOrganizationPath(org.id),
              });
            }
          }

          if (org.children && org.children.length > 0) {
            searchInOrganizations(org.children);
          }
        });
      };

      searchInOrganizations(this.organizationTree);
    },

    searchMembers(query, results) {
      // 아직 모든 멤버가 로드되지 않았다면 로드
      if (!this.allMembersLoaded) {
        this.loadAllMembers();
      }

      // 모든 멤버 검색
      const allMembers = this.getAllCachedMembers();

      allMembers.forEach((member) => {
        if (
          (member.name && member.name.toLowerCase().includes(query)) ||
          (member.phoneNumber && member.phoneNumber.includes(query)) ||
          (member.email &&
            member.email &&
            member.email.toLowerCase().includes(query))
        ) {
          results.push({
            type: "member",
            userId: member.userId,
            name: member.name,
            phoneNumber: member.phoneNumber,
            organizationId: member.organizationId,
            organizationName: member.organizationName,
          });
        }
      });
    },

    getAllCachedMembers() {
      // 모든 캐시된 멤버를 합쳐서 반환
      let allMembers = [];

      // 현재 선택된 조직의 멤버 추가
      if (this.selectedOrganization && this.members.length > 0) {
        allMembers = this.members.map((member) => ({
          ...member,
          organizationId: this.selectedOrganization.id,
          organizationName: this.selectedOrganization.organization_name,
        }));
      }

      // 캐시된 다른 조직의 멤버들 추가
      Object.entries(this.memberCache).forEach(([orgId, data]) => {
        // 현재 선택된 조직의 멤버는 이미 추가됨
        if (
          this.selectedOrganization &&
          this.selectedOrganization.id === Number(orgId)
        ) {
          return;
        }

        if (data.members && Array.isArray(data.members)) {
          const membersWithOrg = data.members.map((member) => ({
            ...member,
            organizationId: Number(orgId),
            organizationName: data.organization_name,
          }));
          allMembers = allMembers.concat(membersWithOrg);
        }
      });

      return allMembers;
    },

    getOrganizationPath(orgId) {
      // 조직 ID로부터 경로 배열 구하기
      const findPath = (orgs, targetId, currentPath = []) => {
        for (const org of orgs) {
          const newPath = [...currentPath, org.id];
          if (org.id === targetId) {
            return newPath;
          }

          if (org.children && org.children.length > 0) {
            const found = findPath(org.children, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      return findPath(this.organizationTree, orgId) || [];
    },

    selectSearchedOrganization(org) {
      this.showSearchResults = false;
      this.highlightedMemberId = null;

      // 해당 조직의 경로 펼치기
      if (org.path && org.path.length > 0) {
        this.expandedOrganizationIds = org.path;

        // OrganizationTree 컴포넌트에 확장 정보 전달
        this.$nextTick(() => {
          // 선택된 조직으로 이동 및 멤버 로드
          if (org.isLeafNode) {
            this.selectOrganization(org);
          }
        });
      }
    },

    selectSearchedMember(member) {
      this.showSearchResults = false;
      this.highlightedMemberId = member.userId;

      // 해당 멤버의 조직으로 이동
      if (member.organizationId) {
        const org = this.findOrganizationById(member.organizationId);
        if (org) {
          this.selectSearchedOrganization(org);

          // 멤버 목록에서 해당 멤버 하이라이트
          this.$nextTick(() => {
            // 멤버 하이라이트 로직 (CSS 클래스 등으로 구현)
          });
        }
      }
    },

    findOrganizationById(orgId) {
      const findOrg = (orgs) => {
        for (const org of orgs) {
          if (org.id === orgId) {
            return {
              type: "organization",
              id: org.id,
              organization_name: org.organization_name,
              organization_code: org.organization_code,
              memberCount: org.memberCount,
              isLeafNode: org.isLeafNode,
              path: this.getOrganizationPath(org.id),
            };
          }

          if (org.children && org.children.length > 0) {
            const found = findOrg(org.children);
            if (found) return found;
          }
        }
        return null;
      };

      return findOrg(this.organizationTree);
    },

    // 비밀번호 확인 메서드
    checkPassword() {
      this.loading = true;

      // 간단한 비밀번호 확인 (실제 서비스에서는 더 안전한 방법 사용 권장)
      setTimeout(() => {
        if (this.password === this.correctPassword) {
          this.isAuthenticated = true;
          this.passwordError = "";

          // 인증 상태를 로컬 스토리지에 저장
          localStorage.setItem("coramdeoAuth", "true");

          // 인증 성공 후 조직 데이터 로드
          this.$nextTick(() => {
            this.fetchOrganizationsOnly()
              .then(() => {
                this.calculateMemberCounts();
              })
              .catch(() => {
                // 조직 데이터 로드 중 오류
              });
          });
        } else {
          this.passwordError = "비밀번호가 올바르지 않습니다.";
        }
        this.loading = false;
      }, 500); // 0.5초 지연 (UX 향상)
    },

    // 로그아웃 메서드
    logout() {
      // 로컬 스토리지에서 인증 상태 제거
      localStorage.removeItem("coramdeoAuth");

      // 인증 상태 초기화
      this.isAuthenticated = false;
      this.password = "";
      this.passwordError = "";

      // 데이터 초기화
      this.organizations = [];
      this.organizationTree = [];
      this.selectedOrganization = null;
      this.members = [];
    },

    // 조직 정보만 불러오는 메서드 추가
    async fetchOrganizationsOnly() {
      try {
        // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
        const now = new Date().getTime();
        if (
          this.cachedOrganizations &&
          this.organizationCacheExpiry &&
          now < this.organizationCacheExpiry
        ) {
          this.organizations = this.cachedOrganizations;

          // 조직 트리 구성
          this.organizationTree = this.buildOrganizationTree(
            this.organizations
          );

          // 조직 정보를 가져온 후 멤버 수 계산
          this.calculateMemberCounts();

          // 모든 조직 정보를 가져온 후, 멤버 캐시 초기화
          this.memberCache = {};
          this.allMembersLoaded = false;

          return;
        }

        const response = await this.getAllOrganizations(true);

        // API 응답 구조 확인 및 데이터 추출
        let organizations = [];
        if (response && response.data && Array.isArray(response.data)) {
          // API 응답에서 data 배열을 추출
          organizations = response.data;
        } else if (Array.isArray(response)) {
          // 응답이 직접 배열인 경우
          organizations = response;
        } else {
          // 더미 데이터 사용
          organizations = this.getDummyOrganizations();
        }

        // 유효한 조직 데이터가 있는지 확인
        if (!organizations || organizations.length === 0) {
          organizations = this.getDummyOrganizations();
        }

        // 각 조직의 멤버 수 초기화
        organizations.forEach((org) => {
          org.memberCount = 0;
        });

        // 모든 조직 데이터 사용 (특정 ID 필터링 제거)
        this.organizations = organizations;

        // 조직 데이터 캐싱
        this.cachedOrganizations = JSON.parse(JSON.stringify(organizations)); // 깊은 복사
        this.organizationCacheExpiry =
          new Date().getTime() + this.organizationCacheDuration;

        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);

        // 조직 정보를 가져온 후 멤버 수 계산
        this.calculateMemberCounts();

        // 모든 조직 정보를 가져온 후, 멤버 캐시 초기화
        this.memberCache = {};
        this.allMembersLoaded = false;
      } catch {
        // 오류 발생 시 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();

        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);
      }
    },

    // 멤버 수 계산을 별도 메서드로 분리
    async calculateMemberCounts() {
      if (
        !Array.isArray(this.organizations) ||
        this.organizations.length === 0
      ) {
        return;
      }

      try {
        // 1. 먼저 모든 조직의 멤버 수를 0으로 초기화
        this.organizations.forEach((org) => {
          org.memberCount = 0;
        });

        // 2. 최하위 조직(리프 노드)을 찾아서 실제 멤버 수를 API로 가져옴
        const leafOrgs = this.organizations.filter(
          (org) =>
            !this.organizations.some(
              (other) => other.upper_organization_id === org.id
            )
        );

        // 3. 각 최하위 조직의 멤버 수를 API로 가져옴
        for (const org of leafOrgs) {
          try {
            const members = await this.getMembersWithRoles(org.id, false);

            // 유효한 멤버 배열인 경우 멤버 수 설정
            if (members && Array.isArray(members)) {
              org.memberCount = members.length;
            } else {
              org.memberCount = 0;
            }
          } catch {
            org.memberCount = 0;
          }
        }

        // 4. 상위 조직의 멤버 수를 계산 (상향식 접근법)
        // 먼저 조직 간의 계층 구조를 파악
        const orgLevels = [];
        const processedOrgs = new Set();

        // 리프 노드는 이미 처리했으므로 레벨 0으로 설정
        leafOrgs.forEach((org) => {
          processedOrgs.add(org.id);
        });

        // 나머지 조직의 레벨을 결정 (최대 10단계까지 처리)
        for (let level = 1; level <= 10; level++) {
          const currentLevelOrgs = [];

          this.organizations.forEach((org) => {
            // 이미 처리된 조직은 건너뜀
            if (processedOrgs.has(org.id)) {
              return;
            }

            // 이 조직의 모든 하위 조직이 이미 처리되었는지 확인
            const childOrgs = this.organizations.filter(
              (child) => child.upper_organization_id === org.id
            );

            const allChildrenProcessed =
              childOrgs.length === 0 ||
              childOrgs.every((child) => processedOrgs.has(child.id));

            if (allChildrenProcessed) {
              currentLevelOrgs.push(org);
              processedOrgs.add(org.id);
            }
          });

          if (currentLevelOrgs.length > 0) {
            orgLevels.push(currentLevelOrgs);
          } else if (processedOrgs.size === this.organizations.length) {
            // 모든 조직이 처리되었으면 종료
            break;
          }
        }

        // 레벨별로 멤버 수 계산 (낮은 레벨부터)
        orgLevels.forEach((levelOrgs) => {
          levelOrgs.forEach((org) => {
            // 하위 조직 찾기
            const childOrgs = this.organizations.filter(
              (child) => child.upper_organization_id === org.id
            );

            // 하위 조직의 멤버 수 합산
            let totalMembers = 0;
            childOrgs.forEach((child) => {
              totalMembers += child.memberCount || 0;
            });

            org.memberCount = totalMembers;
          });
        });

        // 5. 트리 다시 구성 (멤버 수 정보 반영)
        this.organizationTree = this.buildOrganizationTree(this.organizations);
      } catch {
        // 멤버 수 계산 중 오류 발생
      }
    },

    selectOrganization(organization) {
      this.selectedOrganization = organization;
      this.fetchMembers(organization.id);
    },

    openOrganizationDialog(organization = null) {
      if (organization) {
        this.editedOrganization = {
          ...organization,
          // API 응답 필드 매핑
          organization_description:
            organization.organization_description ||
            organization.description ||
            "",
        };
      } else {
        this.editedOrganization = {
          id: null,
          organization_name: "",
          organization_code: "",
          organization_description: "",
          upper_organization_id: null,
        };
      }
      this.organizationDialog = true;
    },

    closeOrganizationDialog() {
      this.organizationDialog = false;
    },

    async saveOrganization() {
      try {
        // 상위 조직 ID가 문자열인 경우 숫자로 변환
        if (this.editedOrganization.upper_organization_id) {
          this.editedOrganization.upper_organization_id = Number(
            this.editedOrganization.upper_organization_id
          );
        }

        // API 요청 데이터 준비
        const organizationData = {
          ...this.editedOrganization,
          // 필드 매핑 (organization_description -> description)
          description: this.editedOrganization.organization_description,
        };

        let response;
        if (this.editedOrganization.id) {
          // 조직 수정 API 호출
          try {
            response = await this.updateOrganization(
              this.editedOrganization.id,
              organizationData,
              true
            );

            if (response && response.error) {
              console.error("조직 수정 API 오류:", response.error);
              throw new Error(response.error);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 "${organizationData.organization_name}"이(가) 수정되었습니다.`,
                color: "success",
              });
            });
          } catch (error) {
            console.error("조직 수정 중 API 오류 발생:", error);

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 수정 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });

            // 오류가 발생해도 UI 업데이트를 위해 계속 진행
            console.log("조직 수정 UI 업데이트 진행 (API 오류)");
          }
        } else {
          // 조직 추가 API 호출
          try {
            response = await this.createOrganization(organizationData, true);

            if (response && response.error) {
              console.error("조직 추가 API 오류:", response.error);
              throw new Error(response.error);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 "${organizationData.organization_name}"이(가) 추가되었습니다.`,
                color: "success",
              });
            });
          } catch (error) {
            console.error("조직 추가 중 API 오류 발생:", error);

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 추가 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });

            // 오류가 발생해도 UI 업데이트를 위해 계속 진행
            console.log("조직 추가 UI 업데이트 진행 (API 오류)");
          }
        }

        this.closeOrganizationDialog();

        // 조직 정보를 다시 불러오고 멤버 수 계산
        await this.fetchOrganizationsOnly();

        // 조직 정보가 업데이트된 후 멤버 수 다시 계산
        this.$nextTick(() => {
          this.calculateMemberCounts();
        });
      } catch (_) {
        alert("조직 저장 중 오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    },

    confirmDeleteOrganization(organization) {
      this.deleteType = "organization";
      this.deleteItem = organization;
      this.deleteDialogText = `조직 "${organization.organization_name}"을(를) 삭제하시겠습니까? 이 조직에 속한 모든 멤버 정보도 함께 삭제됩니다.`;
      this.deleteDialog = true;
    },

    // 멤버 관련 메서드
    async fetchMembers(organizationId) {
      if (!organizationId) {
        this.members = [];
        return;
      }

      this.loadingMembers = true;
      try {
        let members;

        // 이미 캐시된 데이터가 있으면 사용
        if (
          this.memberCache[organizationId] &&
          this.memberCache[organizationId].members
        ) {
          members = this.memberCache[organizationId].members;
        } else {
          members = await this.getMembersWithRoles(organizationId, true);

          // 유효한 멤버 배열인 경우 캐시에 저장
          if (members && Array.isArray(members)) {
            // 조직 정보 찾기
            const organization = this.findOrganizationById(organizationId);
            this.memberCache[organizationId] = {
              members,
              organization_name: organization
                ? organization.organization_name
                : `조직 ID: ${organizationId}`,
            };
          }
        }

        // 404 에러 처리 - 해당 조직에 소속된 멤버가 없는 경우
        if (
          members &&
          ((members.error && members.error.includes("404")) ||
            (typeof members === "object" &&
              members.error &&
              typeof members.error === "object" &&
              members.error.response &&
              members.error.response.status === 404))
        ) {
          this.members = [];
          return;
        }

        // API 호출 결과가 유효하지 않은 경우 빈 배열 사용 (더미 데이터 대신)
        if (!members || members.error || !Array.isArray(members)) {
          this.members = [];
          return;
        }

        // 멤버 데이터 정렬
        this.members = this.sortMembers(members);

        // 멤버 목록이 로드된 후 하이라이트된 멤버가 있으면 강조 표시
        if (this.highlightedMemberId) {
          this.$nextTick(() => {
            this.highlightMember(this.highlightedMemberId);
          });
        }
      } catch (error) {
        // 404 에러인 경우 - 해당 조직에 소속된 멤버가 없는 경우
        if (error.response && error.response.status === 404) {
          this.members = [];
        } else {
          // 다른 오류 발생 시 빈 배열 사용 (더미 데이터 대신)
          this.members = [];
        }
      } finally {
        this.loadingMembers = false;
      }
    },

    // 멤버 데이터 정렬 메서드
    sortMembers(members) {
      if (!members || !Array.isArray(members)) return [];

      return [...members].sort((a, b) => {
        // 역할 우선순위에 따른 정렬
        const roleOrder = {
          그룹장: 1,
          부그룹장: 2,
          순장: 3,
          EBS: 4,
        };

        // 역할 우선순위 확인 (지정된 역할이 없으면 높은 값 할당)
        const roleA =
          roleOrder[a.roleName] !== undefined ? roleOrder[a.roleName] : 10;
        const roleB =
          roleOrder[b.roleName] !== undefined ? roleOrder[b.roleName] : 10;

        // 역할 우선순위가 다르면 그에 따라 정렬
        if (roleA !== roleB) {
          return roleA - roleB;
        }

        // 역할 우선순위가 같거나 지정되지 않은 역할인 경우
        // 새가족 여부로 정렬 (새가족이 위에)
        if (a.isNewMember === "Y" && b.isNewMember !== "Y") return -1;
        if (a.isNewMember !== "Y" && b.isNewMember === "Y") return 1;

        // 장기결석자 정렬
        if (a.isLongTermAbsentee === "Y" && b.isLongTermAbsentee !== "Y")
          return -1;
        if (a.isLongTermAbsentee !== "Y" && b.isLongTermAbsentee === "Y")
          return 1;

        // 이름 알파벳 순 정렬
        return a.name.localeCompare(b.name);
      });
    },

    openMemberDialog(member = null) {
      if (member) {
        // 기존 멤버 수정
        this.editedMember = { ...member };
        // 원본 데이터 저장
        this.originalMember = { ...member };
        console.log("멤버 수정 모드:", this.editedMember);
      } else {
        // 오늘 날짜를 YYYYMMDD 형식으로 가져오기
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayFormatted = `${year}${month}${day}`;

        // 새 멤버 추가
        console.group("🆕 [Debug] 새 멤버 기본값 설정");
        this.editedMember = {
          userId: null,
          name: "", // 이름은 빈 값으로 시작 (사용자 입력 필요)
          nameSuffix: "FFF", // 기본값 FFF로 설정
          phoneNumber: "00000000000", // 기본값 00000000000으로 설정
          genderType: "M", // 기본값 M으로 설정
          email: "email@email.com", // 기본값 email@email.com으로 설정
          birthDate: null,
          isNewMember: "Y", // 신규 멤버는 자동으로 새가족으로 설정
          isLongTermAbsentee: "N",
          isKakaotalkChatMember: "N",
          roleId: 74, // 기본값 74 (순원)로 설정
          roleName: "순원",
          memberNumber: "",
          registrationDate: todayFormatted, // 오늘 날짜로 설정
          countryCode: "KOR",
          address: "",
          addressDetail: "",
          postcode: "",
          hobby: "",
          city: null,
          stateProvince: null,
          isAddressPublic: "N",
          isPhoneNumberPublic: "N",
          snsUrl: null,
        };
        console.log("신규 멤버 기본값:", this.editedMember);
        console.table({
          name: "빈 값(사용자 입력 필요)",
          nameSuffix: this.editedMember.nameSuffix,
          phoneNumber: this.editedMember.phoneNumber,
          genderType: this.editedMember.genderType,
          isNewMember: this.editedMember.isNewMember,
          roleId: this.editedMember.roleId,
          roleName: this.editedMember.roleName,
          registrationDate: this.editedMember.registrationDate, // 교회 등록일 표시 추가
        });
        console.groupEnd();

        // 새 멤버 추가는 원본 데이터 없음
        this.originalMember = null;
        console.log("새 멤버 추가 모드");
      }
      this.memberDialog = true;
    },

    closeMemberDialog() {
      this.memberDialog = false;
      this.$nextTick(() => {
        this.editedMember = {
          userId: null,
          name: "",
          nameSuffix: "",
          phoneNumber: "",
          genderType: "M",
          email: "",
          birthDate: null,
          isNewMember: "N",
          isLongTermAbsentee: "N",
          isKakaotalkChatMember: "N",
          roleId: 74,
          roleName: "순원",
          memberNumber: "",
          registrationDate: null,
          countryCode: "KOR",
          address: "",
          addressDetail: "",
          postcode: "",
          hobby: "",
          city: null,
          stateProvince: null,
          isAddressPublic: "N",
          isPhoneNumberPublic: "N",
          snsUrl: null,
        };
        // 원본 데이터도 초기화
        this.originalMember = null;
      });
    },

    // 임의의 데이터 생성 메서드 추가
    generateRandomData(name) {
      const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
      const firstChar = name ? name.charAt(0).toUpperCase() : "M";

      return {
        birthDate: "1990-01-01",
        memberNumber: `${firstChar}${randomSuffix}`,
        address: "서울특별시 강남구",
        addressDetail: "123번지",
        postcode: `0${randomSuffix}`,
        hobby: "독서",
      };
    },

    // 필드 유효성 검사 메서드 추가
    validateFields() {
      // 디버깅을 위한 로그 추가
      console.group("필드 유효성 검사 결과");
      console.log("이름:", this.editedMember.name);
      console.log("전화번호:", this.editedMember.phoneNumber);
      console.log("성별:", this.editedMember.genderType);
      console.log("역할ID:", this.editedMember.roleId);

      // 00000000000은 유효한 전화번호로 인정
      this.validationErrors = {
        name: !this.editedMember.name || this.editedMember.name.trim() === "",
        phoneNumber:
          !this.editedMember.phoneNumber ||
          this.editedMember.phoneNumber.trim() === "",
        genderType: !this.editedMember.genderType,
        roleId: !this.editedMember.roleId,
      };

      console.log("유효성 검사 오류:", this.validationErrors);
      console.groupEnd();

      return !Object.values(this.validationErrors).some((v) => v === true);
    },

    async saveMember(memberData) {
      if (this.savingMember) return; // 중복 호출 방지

      this.savingMember = true;

      try {
        // 전달받은 멤버 데이터로 업데이트
        if (memberData) {
          this.editedMember = { ...memberData };
        }

        // 디버깅 로그 추가
        console.group("멤버 저장 시도");
        console.log("멤버 데이터:", JSON.stringify(this.editedMember, null, 2));
        console.groupEnd();

        // 기본 검증
        if (!this.selectedOrganization) {
          this.showErrorMessage(
            "선택된 조직이 없습니다. 조직을 먼저 선택해주세요."
          );
          this.savingMember = false;
          return;
        }

        // 유효성 검사
        if (!this.validateFields()) {
          this.showErrorMessage("모든 필수 항목(*)을 입력해주세요.");
          this.savingMember = false;
          return;
        }

        // 역할 ID 기본값 설정
        if (!this.editedMember.roleId) {
          this.editedMember.roleId = 74; // 기본값: 순원
        }

        // 데이터 변경 감지 (수정 모드)
        if (this.editedMember.userId && !this.isDataChanged) {
          this.showMessage("변경된 데이터가 없습니다.", "info");
          this.closeMemberDialog();
          this.savingMember = false;
          return;
        }

        // API 데이터 준비
        const apiUserData = this.prepareApiUserData();
        const organizationId = this.selectedOrganization.id;
        const organizationCode = this.selectedOrganization.organization_code;
        const creatingUserId = this.userInfo?.id || null;

        // 멤버 수정 또는 추가
        if (this.editedMember.userId) {
          await this.updateExistingMember(apiUserData);
        } else {
          await this.createNewMember(
            apiUserData,
            organizationId,
            organizationCode,
            creatingUserId
          );
        }

        // 목록 정렬 적용
        this.members = this.sortMembers(this.members);
      } catch (error) {
        this.showErrorMessage(
          `멤버 저장 중 오류가 발생했습니다: ${error.message}`
        );
      } finally {
        this.savingMember = false;
      }
    },

    // API 데이터 준비
    prepareApiUserData() {
      // 생년월일 형식 변환
      const birthDate = this.editedMember.birthDate
        ? moment(this.editedMember.birthDate).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      // 등록일 형식 변환
      const registrationDate = this.editedMember.registrationDate
        ? moment(this.editedMember.registrationDate).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      // 랜덤 데이터 생성
      const randomData = this.generateRandomData();

      // API에 전송할 데이터 구성
      return {
        name: this.editedMember.name,
        name_suffix: this.editedMember.nameSuffix || "FFF",
        gender_type: this.editedMember.genderType,
        birth_date: birthDate,
        country: this.editedMember.countryCode || "KOR",
        phone_number: this.editedMember.phoneNumber,
        church_member_number:
          this.editedMember.memberNumber || randomData.memberNumber,
        church_registration_date: registrationDate,
        is_new_member: this.editedMember.isNewMember,
      };
    },

    // 메시지 표시 도우미 메서드들
    showMessage(message, color = "success") {
      try {
        this.$store.dispatch("snackbar/showMessage", { message, color });
      } catch (e) {
        if (color === "error") {
          alert(message);
        }
      }
    },

    showErrorMessage(message) {
      this.showMessage(message, "error");
      alert(message);
    },

    // 멤버 수정 처리
    async updateExistingMember(apiUserData) {
      try {
        await this.openUpdateData(
          this.User,
          this.editedMember.userId,
          apiUserData,
          true
        );

        // UI 업데이트
        const index = this.members.findIndex(
          (m) => m.userId === this.editedMember.userId
        );
        if (index !== -1) {
          const updatedMember = this.convertToUiMember(
            apiUserData,
            this.editedMember.userId
          );
          this.members.splice(index, 1, updatedMember);
        }

        // 성공 메시지
        this.showMessage(
          `멤버 ${this.editedMember.name}님의 정보가 수정되었습니다.`
        );
        this.closeMemberDialog();
      } catch (error) {
        this.showErrorMessage(
          `멤버 수정 중 오류가 발생했습니다: ${error.message}`
        );
      }
    },

    // 새 멤버 생성 처리
    async createNewMember(
      apiUserData,
      organizationId,
      organizationCode,
      creatingUserId
    ) {
      try {
        const response = await this.createMember(
          apiUserData,
          organizationId,
          organizationCode,
          creatingUserId,
          true
        );

        if (!response) {
          throw new Error("API 응답이 없습니다.");
        }

        if (response.error) {
          throw new Error(response.error);
        }

        // 새로 생성된 멤버의 ID 가져오기
        const memberId = response.userId || response.id;
        if (!memberId) {
          throw new Error("API 응답에 사용자 ID가 없습니다.");
        }

        // UI에 멤버 추가
        const newMember = this.convertToUiMember(apiUserData, memberId);
        this.members.push(newMember);

        // 성공 메시지
        this.showMessage(`멤버 ${this.editedMember.name}님이 추가되었습니다.`);
        this.closeMemberDialog();
      } catch (error) {
        // 오류 정보 표시
        if (error.response) {
          const errorMessage = error.response.data?.message || error.message;
          this.showErrorMessage(
            `멤버 추가 실패 (${error.response.status}): ${errorMessage}`
          );
        } else if (error.request) {
          this.showErrorMessage(
            `멤버 추가 요청 후 응답 없음: ${error.message}`
          );
        } else {
          this.showErrorMessage(
            `멤버 추가 요청 설정 중 오류: ${error.message}`
          );
        }
      }
    },

    // API 데이터를 UI 표시용 데이터로 변환
    convertToUiMember(apiData, userId) {
      return {
        userId,
        name: apiData.name,
        nameSuffix: apiData.name_suffix,
        phoneNumber: apiData.phone_number,
        genderType: apiData.gender_type,
        email: apiData.email,
        birthDate: apiData.birth_date,
        isNewMember: apiData.is_new_member,
        isLongTermAbsentee: apiData.is_long_term_absentee,
        isKakaotalkChatMember: apiData.is_kakaotalk_chat_member,
        roleId: apiData.role_id,
        roleName: this.getRoleName(apiData.role_id),
        memberNumber: apiData.church_member_number,
        registrationDate: apiData.church_registration_date,
        countryCode: apiData.country,
        countryName:
          apiData.country_name || this.getCountryNameByCode(apiData.country),
        address: apiData.address,
        addressDetail: apiData.address_detail,
        postcode: apiData.zip_postal_code,
        hobby: apiData.hobby,
      };
    },

    // 국가 코드로 국가명 가져오기
    getCountryNameByCode(code) {
      if (!code) return "";
      const country = this.countryItems.find((item) => item.value === code);
      return country ? country.text : "기타";
    },

    confirmDeleteMember(member) {
      this.deleteType = "member";
      this.deleteItem = member;
      this.deleteDialogText = `멤버 "${member.name}"님을 삭제하시겠습니까?`;
      this.deleteDialog = true;
    },

    // 삭제 확인
    async deleteConfirm() {
      try {
        if (this.deleteType === "organization") {
          await this.deleteOrganization(this.deleteItem.id, true);
          await this.fetchOrganizationsOnly();
          if (
            this.selectedOrganization &&
            this.selectedOrganization.id === this.deleteItem.id
          ) {
            this.selectedOrganization = null;
            this.selectedOrganizationIndex = -1;
            this.members = [];
          }

          // 조직 삭제 후 멤버 수 다시 계산
          this.$nextTick(() => {
            this.calculateMemberCounts();
          });
        } else if (this.deleteType === "member") {
          // 실제 API 호출로 멤버 삭제
          try {
            console.log(
              `❌ 멤버 삭제 시작 - ID: ${this.deleteItem.userId}, 이름: ${this.deleteItem.name}`
            );
            console.log(`✅ 멤버 삭제 완료`);

            // MemberListView.vue 방식으로 변경: openDeleteData 메서드 사용
            await this.openDeleteData(this.User, this.deleteItem.userId, true);
            console.log(`✅ 멤버 삭제 완료`);

            // 성공적으로 삭제된 경우 UI에서 멤버 제거
            const index = this.members.findIndex(
              (m) => m.userId === this.deleteItem.userId
            );
            if (index !== -1) {
              this.members.splice(index, 1);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 ${this.deleteItem.name}님이 삭제되었습니다.`,
                color: "success",
              });
            });

            // 멤버 삭제 후 멤버 수 다시 계산
            this.$nextTick(() => {
              this.calculateMemberCounts();
            });
          } catch (error) {
            console.error("멤버 삭제 중 오류 발생:", error);

            // 오류 발생 시에도 UI에서 멤버 제거 (백엔드 오류 대응)
            const index = this.members.findIndex(
              (m) => m.userId === this.deleteItem.userId
            );
            if (index !== -1) {
              this.members.splice(index, 1);
              console.log(
                `멤버 ${this.deleteItem.name} UI에서만 삭제됨 (API 오류)`
              );

              // 멤버 삭제 후 멤버 수 다시 계산
              this.$nextTick(() => {
                this.calculateMemberCounts();
              });
            }

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 삭제 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });
          }
        }
      } catch (error) {
        console.error("삭제 확인 중 오류 발생:", error);
        this.$store.dispatch("snackbar/showMessage", {
          message: `삭제 중 오류가 발생했습니다: ${error.message}`,
          color: "error",
        });
      } finally {
        this.deleteDialog = false;
      }
    },

    // 조직 트리 관련 메서드
    buildOrganizationTree(organizations) {
      if (
        !organizations ||
        !Array.isArray(organizations) ||
        organizations.length === 0
      ) {
        return [];
      }

      const tree = [];
      const organizationMap = new Map();

      // 조직 객체를 맵에 저장
      for (const org of organizations) {
        try {
          if (!org || !org.id) {
            continue;
          }

          // API 응답 필드 매핑 (organization_description -> description)
          const mappedOrg = {
            ...org,
            description: org.organization_description || org.description || "",
            children: [],
            // 최하위 조직 여부를 저장할 속성 추가
            isLeafNode: true,
          };
          organizationMap.set(org.id, mappedOrg);
        } catch {
          // 조직 데이터 매핑 중 오류 발생
        }
      }

      // 조직 객체를 트리 구조로 변환
      for (const org of organizations) {
        try {
          if (!org || !org.id) continue;

          if (!org.upper_organization_id) {
            // 상위 조직이 없는 경우 최상위 조직으로 추가
            tree.push(organizationMap.get(org.id));
          } else {
            // 상위 조직이 있는 경우
            const parent = organizationMap.get(org.upper_organization_id);
            if (parent) {
              // 부모 조직이 있으면 부모는 최하위 노드가 아님
              parent.isLeafNode = false;
              parent.children.push(organizationMap.get(org.id));
            } else {
              // 상위 조직ID가 있지만 맵에 없는 경우 최상위로 처리
              tree.push(organizationMap.get(org.id));
            }
          }
        } catch {
          // 조직 트리 구성 중 오류 발생
        }
      }

      // 트리가 비어있으면 모든 조직을 최상위로 처리
      if (tree.length === 0) {
        for (const [, org] of organizationMap.entries()) {
          tree.push(org);
        }
      }

      return tree;
    },

    handleOrganizationSelect(active) {
      try {
        if (active && active.length > 0) {
          // 선택된 조직 정보 설정
          const selectedOrg = active[0];
          this.selectedOrganization = selectedOrg;

          // 선택된 조직이 최하위 조직인 경우에만 멤버 목록 조회
          if (selectedOrg && selectedOrg.id) {
            if (selectedOrg.isLeafNode) {
              this.fetchMembers(selectedOrg.id);
            } else {
              // 최하위 조직이 아닌 경우 멤버 목록을 비우고 안내 메시지 표시
              this.members = [];
              this.loadingMembers = false;
              console.log("최하위 조직만 멤버를 조회할 수 있습니다.");
            }
          } else {
            console.warn("선택된 조직에 유효한 ID가 없습니다.");
            this.members = [];
            this.loadingMembers = false;
          }
        } else {
          this.selectedOrganization = null;
          this.members = [];
          this.loadingMembers = false;
        }
      } catch (error) {
        console.error("조직 선택 처리 중 오류 발생:", error);
        // 오류가 발생해도 UI 상태는 유지
        if (!this.selectedOrganization) {
          this.members = [];
        }
        this.loadingMembers = false;
      }
    },

    // 첫 번째 최하위 조직 선택 메서드
    selectFirstLeafNode(tree) {
      if (!tree || !Array.isArray(tree) || tree.length === 0) {
        return;
      }

      // 깊이 우선 탐색으로 최하위 조직 찾기
      const findFirstLeafNode = (nodes) => {
        for (const node of nodes) {
          if (node.isLeafNode) {
            return node;
          }

          if (node.children && node.children.length > 0) {
            const leafNode = findFirstLeafNode(node.children);
            if (leafNode) return leafNode;
          }
        }
        return null;
      };

      // 최하위 조직 찾기
      const leafNode = findFirstLeafNode(tree);

      if (leafNode) {
        this.selectedOrganization = leafNode;

        // 선택된 조직의 멤버 목록 조회
        this.fetchMembers(leafNode.id);
      } else {
        // 최하위 조직이 없으면 첫 번째 조직 선택
        this.selectedOrganization = tree[0];

        // 선택된 조직이 최하위 조직이 아니므로 멤버 목록은 비움
        this.members = [];
      }
    },

    // 더미 데이터 반환 메서드 (API 호출 실패 시 사용)
    getDummyOrganizations() {
      return [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          organization_code: "CORAMDEO",
          description:
            "코람데오 청년선교회는 청년들의 신앙과 교제를 위한 조직입니다.",
          upper_organization_id: null,
          memberCount: 0,
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          organization_code: "CORAMDEO_DEPT1",
          description: "코람데오 청년선교회 1국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          organization_code: "CORAMDEO_DEPT2",
          description: "코람데오 청년선교회 2국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 4,
          organization_name: "코람데오_3국",
          organization_code: "CORAMDEO_DEPT3",
          description: "코람데오 청년선교회 3국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 5,
          organization_name: "코람데오_1국_1팀",
          organization_code: "CORAMDEO_DEPT1_TEAM1",
          description: "코람데오 청년선교회 1국 1팀입니다.",
          upper_organization_id: 2,
          memberCount: 0,
        },
      ];
    },

    // 역할에 따른 색상 지정
    getRoleColor(roleName) {
      const colorMap = {
        그룹장: "#B3C6FF", // 파스텔 블루
        부그룹장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
        순장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
        EBS: "#FFF4B3", // 파스텔 옐로우
        순원: "#C2E0C2", // 파스텔 그린
        회원: "#D6EAD6", // 연한 파스텔 그린
      };
      return colorMap[roleName] || "#E0E0E0"; // 기본 연한 회색
    },

    // 역할 ID로부터 역할 이름 반환
    getRoleName(roleId) {
      const roleMap = {
        72: "그룹장",
        73: "EBS",
        74: "순원",
      };
      return roleMap[roleId] || "회원";
    },

    // 주소 검색 기능 추가
    execDaumPostcode() {
      if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let roadAddr = data.roadAddress; // 도로명 주소 변수
            let extraRoadAddr = ""; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraRoadAddr +=
                extraRoadAddr !== ""
                  ? ", " + data.buildingName
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraRoadAddr !== "") {
              extraRoadAddr = " (" + extraRoadAddr + ")";
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            this.editedMember.postcode = data.zonecode;
            this.editedMember.address = roadAddr;

            // 커서를 상세주소 필드로 이동한다.
            this.$nextTick(() => {
              const addressDetailField = document.querySelector(
                'input[v-model="editedMember.addressDetail"]'
              );
              if (addressDetailField) {
                addressDetailField.focus();
              }
            });
          },
        }).open();
      } else {
        console.error("Daum Postcode 서비스를 로드할 수 없습니다.");
        this.$store.dispatch("snackbar/showMessage", {
          message: "주소 검색 서비스를 로드할 수 없습니다. 직접 입력해주세요.",
          color: "warning",
        });
      }
    },

    // 1156번 라인 근처의 level 변수 오류 수정
    getFilteredOrganizations() {
      if (!this.organizationSearchTerm) {
        return this.organizationTree;
      }

      const searchTerm = this.organizationSearchTerm.toLowerCase();
      const filtered = [];

      const searchInTree = (items) => {
        items.forEach((org) => {
          if (org.name.toLowerCase().includes(searchTerm)) {
            filtered.push(org);
          }
          if (org.children && org.children.length > 0) {
            searchInTree(org.children);
          }
        });
      };

      searchInTree(this.organizationTree);
      return filtered;
    },

    // 모든 최하위 조직의 멤버 로드 메서드 추가
    async loadAllMembers() {
      if (this.allMembersLoaded) return;

      try {
        // 최하위 조직 찾기 (children이 없는 조직)
        const findLeafOrganizations = (orgs) => {
          let leaves = [];
          orgs.forEach((org) => {
            if (!org.children || org.children.length === 0 || org.isLeafNode) {
              leaves.push(org);
            } else if (org.children && org.children.length > 0) {
              leaves = leaves.concat(findLeafOrganizations(org.children));
            }
          });
          return leaves;
        };

        const leafOrgs = findLeafOrganizations(this.organizationTree);

        // 각 최하위 조직의 멤버 캐싱
        for (const org of leafOrgs) {
          await this.cacheOrganizationMembers(org.id);
        }

        this.allMembersLoaded = true;
      } catch (error) {
        console.error("모든 멤버 로드 중 오류:", error);
      }
    },

    // 조직의 멤버 정보를 캐시하는 메서드 추가
    async cacheOrganizationMembers(organizationId) {
      // 이미 캐시된 데이터가 있으면 다시 가져오지 않음
      if (
        this.memberCache[organizationId] &&
        this.memberCache[organizationId].members
      ) {
        return this.memberCache[organizationId].members;
      }

      try {
        const members = await this.getMembersWithRoles(organizationId, false);

        // 유효한 멤버 배열인 경우 캐시에 저장
        if (members && Array.isArray(members)) {
          // 조직 정보 찾기
          const organization = this.findOrganizationById(organizationId);
          this.memberCache[organizationId] = {
            members,
            organization_name: organization
              ? organization.organization_name
              : `조직 ID: ${organizationId}`,
          };
          return members;
        }
        return [];
      } catch {
        return [];
      }
    },

    // 멤버 강조 표시 메서드 추가
    highlightMember(memberId) {
      // 이전 강조 표시 제거
      const previousHighlighted = document.querySelector(".highlighted-member");
      if (previousHighlighted) {
        previousHighlighted.classList.remove("highlighted-member");
      }

      // 새 멤버 강조 표시
      const memberRow = document.querySelector(
        `[data-member-id="${memberId}"]`
      );
      if (memberRow) {
        memberRow.classList.add("highlighted-member");
        // 화면에 보이도록 스크롤
        memberRow.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // 3초 후 강조 표시 제거
      setTimeout(() => {
        const el = document.querySelector(".highlighted-member");
        if (el) {
          el.classList.remove("highlighted-member");
        }
        this.highlightedMemberId = null;
      }, 3000);
    },

    // 검증 실패 처리 메서드 추가
    handleValidationFailure(errors) {
      console.group("검증 실패 처리");
      console.log("필드별 오류:", errors);

      // 어떤 필드가 오류인지 구체적인 메시지 표시
      let errorMessage = "";

      // 필수 입력 필드 오류 확인
      const requiredFieldsErrors = [];
      if (errors.name) requiredFieldsErrors.push("이름");
      if (errors.phoneNumber) requiredFieldsErrors.push("전화번호");
      if (errors.genderType) requiredFieldsErrors.push("성별");
      if (errors.roleId) requiredFieldsErrors.push("역할");

      if (requiredFieldsErrors.length > 0) {
        errorMessage = `다음 필수 항목을 확인해주세요: ${requiredFieldsErrors.join(
          ", "
        )}`;
      }

      // 날짜 형식 오류 확인
      if (errors.dateError) {
        errorMessage = errorMessage
          ? `${errorMessage}. 또한, ${errors.dateErrorMessage}`
          : errors.dateErrorMessage;
      }

      console.log("표시할 오류 메시지:", errorMessage);
      console.groupEnd();

      this.showErrorMessage(errorMessage || "입력 정보를 확인해주세요.");
    },

    formatDate(dateString) {
      if (!dateString) return "-";

      // YYYYMMDD 형식일 경우 변환
      if (dateString.length === 8) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${year}-${month}-${day}`;
      }

      // 이미 YYYY-MM-DD 형식이면 그대로 반환
      return dateString;
    },

    clearDateFilter() {
      this.startDate = null;
      this.endDate = null;
    },

    // 모든 새가족 로드
    async loadAllNewMembers() {
      this.loadingAllMembers = true;

      try {
        // 새가족 데이터가 이미 있는 경우 다시 로드하지 않음
        if (this.allNewMembers && this.allNewMembers.length > 0) {
          this.loadingAllMembers = false;
          return;
        }

        // 새가족 데이터 초기화
        this.allNewMembers = [];

        // 각 조직의 새가족 로드
        await this.loadAllLeafOrganizationsNewMembers();
      } catch (error) {
        console.error("새가족 로드 중 오류 발생:", error);
        this.$store.dispatch("snackbar/showMessage", {
          message: "새가족 정보를 불러오는 중 오류가 발생했습니다.",
          color: "error",
        });
      } finally {
        this.loadingAllMembers = false;
      }
    },

    // 모든 최하위 조직의 새가족 로드
    async loadAllLeafOrganizationsNewMembers() {
      // 최하위 조직 찾기
      const findLeafOrganizations = (orgs) => {
        let leaves = [];
        orgs.forEach((org) => {
          if (!org.children || org.children.length === 0 || org.isLeafNode) {
            leaves.push(org);
          } else if (org.children && org.children.length > 0) {
            leaves = leaves.concat(findLeafOrganizations(org.children));
          }
        });
        return leaves;
      };

      const leafOrgs = findLeafOrganizations(this.organizationTree);

      // 각 최하위 조직의 새가족 멤버 로드
      for (const org of leafOrgs) {
        try {
          const members = await this.getMembersWithRoles(org.id, false);

          if (members && Array.isArray(members)) {
            // 새가족 필터링 (isNewMember === 'Y')
            const newMembers = members.filter(
              (member) => member.isNewMember === "Y"
            );

            // 조직 정보 추가
            newMembers.forEach((member) => {
              member.organizationId = org.id;
              member.organizationName = org.organization_name;
            });

            // 새가족 목록에 추가
            this.allNewMembers = [...this.allNewMembers, ...newMembers];
          }
        } catch (error) {
          console.error(`조직 ${org.id}의 새가족 로드 중 오류:`, error);
        }
      }

      // 등록일 기준으로 정렬
      this.allNewMembers.sort((a, b) => {
        if (!a.registrationDate) return 1;
        if (!b.registrationDate) return -1;
        return b.registrationDate.localeCompare(a.registrationDate);
      });
    },
  },
};
</script>

<style lang="scss">
.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep {
  table {
    border-collapse: collapse;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.87);
  }

  td {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
}

/* 이름 아바타 스타일 */
.name-avatar {
  background: linear-gradient(135deg, #7ea394, #c2e0c2) !important;
  font-weight: bold;
}

/* 텍스트 스타일 */
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

/* 멤버 정보 표시 스타일 */
.member {
  &-name {
    font-weight: 600;
  }

  &-suffix {
    opacity: 0.7;
    font-size: 0.85em;
  }
}

/* 필드 제목 스타일 */
.field-title {
  font-weight: 500;
  font-size: 0.95rem;
  color: #444;
  margin-left: 5px;
}

/* 커스텀 입력 필드 공통 스타일 */
%input-common {
  height: 50px !important;
  border-radius: 20px !important;
  transition: all 0.3s ease;
}

/* 커스텀 입력 필드 스타일 */
.org-custom-input {
  @extend %input-common;
}

/* 커스텀 셀렉트 스타일 */
.org-custom-select .v-input__slot {
  border-radius: 20px !important;
  box-shadow: 5px 5px 15px #00000012, -5px -5px 15px #ffffff !important;
}

/* 토글 스위치 스타일 */
.custom-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.custom-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + & {
    background-color: #7ea394;
  }

  input:focus + & {
    box-shadow: 0 0 1px #7ea394;
  }

  input:checked + &:before {
    transform: translateX(26px);
  }
}

/* 애니메이션 효과 */
.fadeIn {
  animation: fadeIn 0.5s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

.bg-transparent {
  background-color: transparent !important;
}

/* 조직 트리뷰 아이템 간격 조정 */
.v-treeview-node__root {
  margin-bottom: 4px;
}

/* 커스텀 저장 버튼 스타일 */
.custom-save-btn {
  height: 50px !important;
  border-radius: 20px !important;
  background-color: #7ea394 !important;
  color: white !important;
  font-weight: 500 !important;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;

  &:hover {
    background-color: #6a8d82 !important;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  &:disabled {
    background-color: #cccccc !important;
    color: #888888 !important;
  }
}

/* 검색 관련 스타일 */
.search-container {
  position: relative;
  min-width: 500px;
  flex-grow: 1;
  margin-right: 20px;
}

.search-input {
  max-width: 400px;
  width: 100%;
}

.search-toggle {
  height: 40px;
  margin-left: 16px;
}

.search-results {
  position: absolute;
  top: 50px;
  left: 0;
  width: 400px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.highlighted-member {
  background-color: rgba(126, 163, 148, 0.2);
  transition: background-color 0.3s;
}

/* 날짜 그룹 관련 스타일 */
.max-width-150 {
  max-width: 150px !important;
}

.max-width-200 {
  max-width: 200px !important;
}

.group-header {
  background-color: #f5f7f9;
  border-left: 4px solid #7ea394;
}

/* 반응형 스타일 */
@media (max-width: 960px) {
  .search-container {
    margin-bottom: 10px;
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    max-width: 100%;
    width: 100%;
  }

  .search-results {
    width: 100%;
  }
}
</style>
