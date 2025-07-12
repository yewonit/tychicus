<template>
  <v-container grid-list-xs class="mt-6 mb-16 pb-16">
    <!-- {{ this.$vuetify.breakpoint.name }} -->
    <v-row v-if="this.$vuetify.breakpoint.smAndDown" class="mx-1 text-center">
      <v-col class="mb-5" c cols="12" xl="6" lg="6" md="8" sm="12">
        <span class="wc-h2">{{ workDetail.company_name }}</span>
        <br />
        <span class="wc-st1">{{ workDetail.work_description }}</span>
        <br />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11">
        <!-- workId: {{ workId }} -->
        <!-- {{ this.$vuetify.breakpoint.name }} -->
        <v-row>
          <v-col class="mb-0" cols="12" xl="9" lg="8" md="8" sm="12">
            <PotoBox
              :imgUrl="representativeImage[0].file_path"
              :aspectRatio="photoBoxRatio"
            ></PotoBox>
          </v-col>
          <v-col
            v-if="this.$vuetify.breakpoint.smAndDown"
            class="mb-7 text-center"
            cols="12"
            xl="6"
            lg="6"
            md="8"
            sm="12"
          >
            <span class="wc-st1">{{ workDetail.business_keywords }}</span>
            <br />
          </v-col>

          <v-col class="mb-5" cols="12" xl="3" lg="4" md="4" sm="12">
            <UserProfileBox
              :userProfile="userProfileImage[0].file_path"
              :userName="workDetail.user_name"
              :jopPosition="workDetail.job_position"
              :churchOffice="workDetail.user_church_office"
              :organization="workDetail.organization"
              :phoneNumber="workDetail.user_phone_number"
              :address="workDetail.user_address"
            ></UserProfileBox>
          </v-col>
        </v-row>
        <!-- TEXT ROW 1 -->
        <v-row v-if="!this.$vuetify.breakpoint.smAndDown" class="mx-1 mt-10">
          <v-col class="mb-5" c cols="12" xl="6" lg="6" md="5" sm="12">
            <span class="wc-h2">{{ workDetail.company_name }}</span>
            <br />
            <span class="wc-st1">{{ workDetail.work_description }}</span>
            <br />
          </v-col>
          <v-col
            class="mb-5 d-flex flex-row-reverse"
            cols="6"
            xl="2"
            lg="2"
            md="3"
            sm="12"
          >
            <v-btn
              :href="this.workDetail.uri_homepage"
              target="_blank"
              class="ml-8 wc-btn"
              :color="smRoundBtnColorForHomepage"
              icon
            >
              <v-icon size="24px ">mdi-home</v-icon>
            </v-btn>
            <v-btn
              disabled
              :href="this.workDetail.uri_instagram"
              target="_blank"
              class="ml-8 wc-btn"
              :color="smRoundBtnColorForInstagram"
              icon
            >
              <v-icon size="24px ">mdi-instagram</v-icon>
            </v-btn>
          </v-col>
          <v-col
            class="mb-5 d-flex flex-row-reverse"
            cols="6"
            xl="4"
            lg="4"
            md="4"
            sm="12"
          >
            <v-btn
              target="_blank"
              class="ml-8 wc-btn"
              color="#7D9AA5"
              icon
              @click="copyUrl"
            >
              <v-icon size="24px ">mdi-share</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- TEXT ROW 2 -->
        <v-row v-if="!this.$vuetify.breakpoint.smAndDown" class="mx-1">
          <v-col class="mb-5" cols="12" xl="3" lg="3" md="3" sm="12">
            <span class="wc-h4">{{ workDetail.tel }}</span>
            <br />
            <span class="wc-st1">대표전화</span>
            <br />
          </v-col>
          <v-col class="mb-5" cols="12" xl="5" lg="5" md="5" sm="12">
            <span class="wc-h4">
              {{
                `${workDetail.working_place_address} ${workDetail.working_place_address_detail}`
              }}
            </span>
            <br />
            <span class="wc-st1">산업 위치</span>
            <br />
          </v-col>
          <v-col class="mb-5 pl-5" cols="12" xl="4" lg="4" md="4" sm="12">
            <span class="wc-h4">{{ workDetail.work_description }}</span>
            <br />
            <span class="wc-st1">주요 업무소개</span>
            <br />
          </v-col>
        </v-row>

        <v-row
          v-if="this.$vuetify.breakpoint.smAndDown"
          class="mx-1 text-center"
        >
          <v-col class="mb-5 mt-5" cols="12" xl="3" lg="3" md="8" sm="12">
            <span class="wc-h4">{{ workDetail.tel }}</span>
            <br />
            <span class="wc-st1">대표전화</span>
            <br />
          </v-col>
          <v-col class="mb-5" cols="12" xl="5" lg="5" md="8" sm="12">
            <span class="wc-h4">
              {{
                `${workDetail.working_place_address} ${workDetail.working_place_address_detail}`
              }}
            </span>
            <br />
            <span class="wc-st1">산업 위치</span>
            <br />
          </v-col>
          <v-col class="mb-5 pl-5" cols="12" xl="4" lg="4" md="8" sm="12">
            <span class="wc-h4">{{ workDetail.work_description }}</span>
            <br />
            <span class="wc-st1">주요 업무소개</span>
            <br />
          </v-col>
        </v-row>

        <!-- Portfolio -->
        <v-row class="mx-1 mt-16">
          <v-col class="mt-10 mb-10 text-center" cols="12">
            <span class="wc-h2">제품 & 포트폴리오</span>
            <br />
            <span class="wc-st1">Portfolio</span>
            <br />
          </v-col>
          <v-col
            v-for="(portfolio, i) in portfolios"
            :key="i"
            class="mb-5"
            cols="12"
            xl="4"
            lg="4"
            md="4"
            sm="12"
          >
            <Portfolio
              :imgUrl="portfolio.file_path"
              :portfolioTitle="portfolio.file_title"
              :portfolioDescription="portfolio.file_description"
            ></Portfolio>
          </v-col>
        </v-row>
        <v-row v-if="this.$vuetify.breakpoint.smAndDown" class="mx-1">
          <v-spacer></v-spacer>
          <v-col
            class="mt-12 mb-0 d-flex justify-center"
            cols="2"
            xl="2"
            lg="2"
            md="4"
            sm="12"
          >
            <v-btn
              :href="this.workDetail.uri_homepage"
              target="_blank"
              class="ml-0 wc-btn"
              :color="smRoundBtnColorForHomepage"
              icon
            >
              <v-icon size="24px ">mdi-home</v-icon>
            </v-btn>
          </v-col>
          <v-col
            class="mt-12 mb-0 d-flex justify-center"
            cols="2"
            xl="2"
            lg="2"
            md="4"
            sm="12"
          >
            <v-btn
              :href="this.workDetail.uri_instagram"
              target="_blank"
              class="ml-8 wc-btn"
              :color="smRoundBtnColorForInstagram"
              icon
            >
              <v-icon size="24px ">mdi-instagram</v-icon>
            </v-btn>
          </v-col>
          <v-col
            class="mt-12 mb-0 d-flex justify-center"
            cols="4"
            xl="2"
            lg="2"
            md="4"
            sm="12"
          >
            <v-btn
              target="_blank"
              class="ml-8 wc-btn"
              color="#7D9AA5"
              icon
              @click="copyUrl"
            >
              <v-icon size="24px ">mdi-share</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  // COMPONENTS
  import PotoBox from '@/components/basic/PotoBoxComp.vue';
  import UserProfileBox from '@/components/basic/UserProfileBoxComp.vue';
  import Portfolio from '@/components/basic/PortfolioComp.vue';
  // VUEX
  import { mapState } from 'vuex';
  // MIXINS
  // for Data CRUD
  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  // for File Control
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  // for Utility
  import { Utility } from '@/mixins/apis_v2/utility/Utility';

  export default {
    name: 'HomeView',
    components: {
      PotoBox,
      UserProfileBox,
      Portfolio,
    },
    mixins: [MasterCtrl, FileBins, Utility],
    data() {
      return {
        tempWorkListItem: {},
        // Display Item
        workDetail: {
          // work
          company_name: 'Compnay Name',
          work_description: 'Work Description',
          business_keywords: 'Business Keywords',
          uri_homepage: '',
          uri_instagram: '',
          tel: 'Phone Number',
          working_place_address: 'Working Place Address',
          working_place_address_detail: '',
          job_position_idx: '',
          job_position: '',

          // user
          user_profile_path: '',
          user_name: '',
          user_authority_idx: '',
          user_authority: '',
          user_church_office_idx: '',
          user_church_office: '',
          organization: '',
          user_phone_number: '',
          user_is_phone_number_public: '',
          user_address: '',
          user_is_address_public: '',
        },
        // FILES

        // user
        userProfileImage: [
          {
            file_path:
              'https://images.unsplash.com/photo-1569237616706-9c0969f8899a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80',
          },
        ],
        // work
        representativeImage: [{ file_path: '' }],
        portfolios: [],
        // Business Keywords
        businessKeywordList: [],

        // --------------
        search: '',
        items: [
          '전체',
          '식당 & 카페',
          '도소매',
          '유통 & 무역',
          '제조',
          'IT',
          '디자인 & 광고 & 인쇄',
          '부동산',
          '건설 & 건축',
          '법률 & 세무',
          '의료 & 병원',
          '금융 & 보험',
          '공공행정',
          '여행 & 숙박',
          '미용 & 뷰티',
          '자동차',
          '예체능',
          '서비스 & 기타',
        ],
        cruds: [
          ['Create', 'mdi-plus-outline'],
          ['Read', 'mdi-file-outline'],
          ['Update', 'mdi-update'],
          ['Delete', 'mdi-delete'],
        ],
        right: null,
        // 인스타 홈페이지 관련 변수
        smRoundBtnColorForInstagram: '#7D9AA5',
        smRoundBtnColorForHomepage: '#7D9AA5',
        thisPageUrl: document.location.href,
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo', 'yewonbizAxios']),
      workId() {
        return this.$route.params.workId;
      },
      photoBoxRatio() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return 0.9;
          case 'sm':
            return 1.75;
          case 'md':
            return 1.075;
          case 'lg':
            return 1.355;
          case 'xl':
            return 2.23;
          default:
            return 'font-size: 0.85rem; font-weight: 500; color: #545454;';
        }
      },
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      async init() {
        await this.readData();
        await this.setWorkInfoInWorkList();
        await this.setBusinessKeywordInWorkList();
        await this.setWorkPortfolioImages();
      },

      // Reading Data
      // Work Read
      async readData() {
        // 쿼리로 넘어온 WorkId를 통해 Work 정보를 읽어옴
        this.lv1_Func('View: Industrialist', 'readWork()');
        this.lv1_Act('쿼리로 넘어온 WorkId를 통해 Work 정보를 읽어옴');
        const tempWork = await this.openReadDataItemById(
          this.Work,
          this.workId
        );
        this.lv1_Data('tempWork', tempWork);

        // 받아온 Work 정보를 통해 User 정보를 읽어옴
        this.lv1_Act('받아온 Work 정보를 통해 User 정보를 읽어옴');
        const tempUser = await this.openReadDataItemById(
          this.User,
          tempWork.user_id
        );
        this.lv1_Data('tempUser', tempUser);

        // 받아온 유저정보를 통해 User Profile 정보를 읽어옴
        this.lv1_Act('받아온 유저정보를 통해 User Profile 정보를 읽어옴');
        this.userProfileImage = await this.readUserFileList(
          tempWork.user_id,
          'UP'
        );
        this.lv1_Data('userProfileImage', this.userProfileImage);

        if (this.userProfileImage.length == 0) {
          this.lv1_Case('유저 프로필 이미지 없음');
          this.lv1_Act('디폴트 유저 이미지를 세팅함');
          this.userProfileImage = [
            {
              file_path:
                'https://images.unsplash.com/photo-1612629131312-8f9a21a1b2c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            },
          ];
        }

        // 사업에 등록된 제품 및 포트폴리오 사진을 불러옴
        this.lv1_Act('사업에 등록된 제품 및 포트폴리오 사진을 불러옴');
        this.portfolios = await this.readWorkFileList(tempWork.id, 'WP');
        this.lv1_Data('portfolios', this.portfolios);

        // 사업에 등록된 대표 사진을 불러옴
        this.lv1_Act('사업에 등록된 대표 사진을 불러옴');
        this.representativeImage = await this.readWorkFileList(
          tempWork.id,
          'WR'
        );
        this.lv1_Data('representativeImage', this.representativeImage);

        // 대표이미지가 없을 경우 프로필의 가장 첫 이미지를 대표이미지로 설정합니다.
        if (this.representativeImage.length == 0) {
          this.lv1_Case('사업 대표 이미지 없음');
          if (this.portfolios.length !== 0) {
            this.lv1_Case('프로필 이미지가 있음');
            this.lv1_Act('1번째 프로필 이미지를 대표 이미지로 설정');
            this.portfolios.reverse();
            this.representativeImage = this.portfolios[0];
            this.portfolios.reverse();
          } else {
            this.lv1_Case('프로필 이미지가 없음');
            this.lv1_Act('디폴트 이미지를 대표 이미지로 설정');
            //   { text: "법인사업자", value: "CB" },
            // { text: "개인사업자", value: "PB" },
            // { text: "협회 및 단체", value: "EP" },
            // { text: "정규직 직원", value: "RE" },
            // { text: "계약직 직원", value: "TE" },
            // { text: "아르바이트", value: "AB" },
            // { text: "프리렌서", value: "FR" },
            // { text: "기타", value: "EC" },
            switch (tempWork.work_type) {
              case 'CB':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind1.png'),
                  },
                ];
                break;
              case 'PB':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind2.png'),
                  },
                ];
                break;
              case 'EP':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind3.png'),
                  },
                ];
                break;
              case 'RE':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind4.png'),
                  },
                ];
                break;
              case 'TE':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind5.png'),
                  },
                ];
                break;
              case 'AB':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind6.png'),
                  },
                ];
                break;
              case 'FR':
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind7.png'),
                  },
                ];
                break;

              default:
                this.representativeImage = [
                  {
                    file_path: require('../../assets/images/kind8.png'),
                  },
                ];
                break;
            }
            // this.representativeImage = [
            //   {
            //     file_path:
            //       "https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500",
            //   },
            // ];
          }
        }

        // BUSINDESS KEYWORD
        this.lv1_Act('Work Id로 BUSINDESS KEYWORD 읽어오기');
        this.businessKeywordList =
          await this.openReadBusinessKeywordListByWorkId(tempWork.id);
        this.lv1_Data('businessKeywordList', this.businessKeywordList);

        // SET DATA > workDetail
        this.lv1_Act('데이터 세팅하기');
        // [ Work ] company_name
        if (tempWork.company_name !== null && tempWork.company_name !== '') {
          // this.lv1_Case("회사 이름 있음");
          // this.lv1_Act("회사 이름 세팅");
          this.$set(this.workDetail, 'company_name', tempWork.company_name);
          this.lv1_Data('company_name', this.workDetail.company_name);
        }
        // [ Work ] work_description
        if (
          tempWork.work_description !== null &&
          tempWork.work_description !== ''
        ) {
          // this.lv1_Case("사업 설명 있음");
          // this.lv1_Act("사업 설명 세팅");
          this.$set(
            this.workDetail,
            'work_description',
            tempWork.work_description
          );
          this.lv1_Data('work_description', this.workDetail.work_description);
        }
        // [ Work ] job_position_idx
        if (
          tempWork.job_position_idx !== null &&
          tempWork.job_position_idx !== ''
        ) {
          // this.lv1_Case("직책 있음");
          // this.lv1_Act("직책 세팅");
          this.$set(
            this.workDetail,
            'job_position_idx',
            tempWork.job_position_idx
          );
          this.lv1_Data('job_position_idx', this.workDetail.job_position_idx);
        }
        // [ Work ] uri_homepage
        if (tempWork.uri_homepage !== null && tempWork.uri_homepage !== '') {
          this.$set(this.workDetail, 'uri_homepage', tempWork.uri_homepage);
          this.lv1_Data('uri_homepage', this.workDetail.uri_homepage);
        }
        // [ Work ] uri_instagram
        if (tempWork.uri_instagram !== null && tempWork.uri_instagram !== '') {
          this.$set(this.workDetail, 'uri_instagram', tempWork.uri_instagram);
          this.lv1_Data('uri_instagram', this.workDetail.uri_instagram);
        }
        // [ Work ] tel
        if (tempWork.tel !== null && tempWork.tel !== '') {
          this.$set(this.workDetail, 'tel', tempWork.tel);
          this.lv1_Data('tel', this.workDetail.tel);
        }
        // [ Work ] working_place_address
        if (
          tempWork.working_place_address !== null &&
          tempWork.working_place_address !== ''
        ) {
          this.$set(
            this.workDetail,
            'working_place_address',
            tempWork.working_place_address
          );
          this.lv1_Data(
            'working_place_address',
            this.workDetail.working_place_address
          );
        }
        // [ Work ] working_place_address_detail
        if (
          tempWork.working_place_address_detail !== null &&
          tempWork.working_place_address_detail !== ''
        ) {
          this.$set(
            this.workDetail,
            'working_place_address_detail',
            tempWork.working_place_address_detail
          );
          this.lv1_Data(
            'working_place_address_detail',
            this.workDetail.working_place_address_detail
          );
        }
        // User
        // [ User ] user_name
        if (tempUser.name !== null && tempUser.name !== '') {
          this.$set(this.workDetail, 'user_name', tempUser.name);
          this.lv1_Data('user_name', this.workDetail.user_name);
        }
        // [ User ] user_email
        if (tempUser.email !== null && tempUser.email !== '') {
          this.$set(this.workDetail, 'user_email', tempUser.email);
          this.lv1_Data('user_email', this.workDetail.user_email);
        }
        // [ User ] user_authority_idx
        if (tempUser.authority_idx !== null && tempUser.authority_idx !== '') {
          this.$set(
            this.workDetail,
            'user_authority_idx',
            tempUser.authority_idx
          );
          this.lv1_Data(
            'user_authority_idx',
            this.workDetail.user_authority_idx
          );
        }
        // [ User ] user_church_office_idx
        if (
          tempUser.user_church_office_idx !== null &&
          tempUser.user_church_office_idx !== ''
        ) {
          this.$set(
            this.workDetail,
            'user_church_office_idx',
            tempUser.church_office_idx
          );
          this.lv1_Data(
            'user_church_office_idx',
            this.workDetail.user_church_office_idx
          );
        }
        // [ User ] organization
        if (tempUser.organization !== null && tempUser.organization !== '') {
          this.$set(this.workDetail, 'organization', tempUser.organization);
          this.lv1_Data('organization', this.workDetail.organization);
        }
        // [ User ] user_phone_number
        if (tempUser.phone_number !== null && tempUser.phone_number !== '') {
          this.$set(
            this.workDetail,
            'user_phone_number',
            tempUser.phone_number
          );
          this.lv1_Data('user_phone_number', this.workDetail.user_phone_number);
        }
        // [ User ] user_is_phone_number_public
        if (
          tempUser.is_phone_number_public !== null &&
          tempUser.is_phone_number_public !== ''
        ) {
          this.$set(
            this.workDetail,
            'user_is_phone_number_public',
            tempUser.is_phone_number_public
          );
          this.lv1_Data(
            'user_is_phone_number_public',
            this.workDetail.user_is_phone_number_public
          );
        }
        // [ User ] user_address
        if (tempUser.address !== null && tempUser.address !== '') {
          this.$set(this.workDetail, 'user_address', tempUser.address);
          this.lv1_Data('user_address', this.workDetail.user_address);
        }
        // [ User ] user_is_address_public
        if (
          tempUser.is_address_public !== null &&
          tempUser.is_address_public !== ''
        ) {
          this.$set(
            this.workDetail,
            'user_is_address_public',
            tempUser.is_address_public
          );
          this.lv1_Data(
            'user_is_address_public',
            this.workDetail.user_is_address_public
          );
        }

        this.lv1_Act('최종 세팅값 보기');
        console.log(
          `%c[ Data ] workDetail`,
          'color: #E3DAC9;',
          this.workDetail
        );
        this.lv1_Data('workDetail', this.workDetail);

        // 홈페이지 및 인스타그램 주소 클레스 세팅
        this.lv1_Act('홈페이지 및 인스타그램 주소 클레스 세팅');
        if (this.workDetail.uri_homepage == '') {
          this.lv1_Case('홈페이지 URL 미등록');
          this.lv1_Act('아이콘 회색으로 설정');
          this.smRoundBtnColorForHomepage = 'grey lighten-1';
        }
        if (this.workDetail.uri_instagram == '') {
          this.lv1_Case('인스타그램 URL 미등록');
          this.lv1_Act('아이콘 회색으로 설정');
          this.smRoundBtnColorForInstagram = 'grey lighten-1';
        }
      },

      // Processing Data
      async setWorkInfoInWorkList() {
        this.lv1_Func('view: IndustrialistDetail', 'setWorkInfoInWorkList()');
        this.lv1_Act('this.workDetail.job_position_idx를 통해 직급 입력');
        switch (this.workDetail.job_position_idx) {
          case null:
            this.lv1_Case('null 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '미등록');
            this.lv1_Act('미등록 직급으로 설정');
            break;
          case 0:
            this.lv1_Case('0 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '미등록');
            this.lv1_Act('미등록 직급으로 설정');
            break;
          case 100:
            this.lv1_Case('100 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '대표');
            this.lv1_Act('대표 직급으로 설정');
            break;
          case 200:
            this.lv1_Case('200 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '임원');
            this.lv1_Act('임원 직급으로 설정');
            break;
          case 300:
            this.lv1_Case('300 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '중간관리자(부차과장)');
            this.lv1_Act('중간관리자(부차과장) 직급으로 설정');
            break;
          case 13:
            this.lv1_Case('13 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '대리');
            this.lv1_Act('대리 직급으로 설정');
            break;
          case 14:
            this.lv1_Case('14 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '사원');
            this.lv1_Act('사원 직급으로 설정');
            break;
          case 15:
            this.lv1_Case('15 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '매니저');
            this.lv1_Act('매니저 직급으로 설정');
            break;
          case 16:
            this.lv1_Case('16 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '사원');
            this.lv1_Act('사원 직급으로 설정');
            break;
          case 17:
            this.lv1_Case('17 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '인턴');
            this.lv1_Act('인턴 직급으로 설정');
            break;
          case 18:
            this.lv1_Case('18 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '프리렌서');
            this.lv1_Act('프리렌서 직급으로 설정');
            break;
          default:
            this.lv1_Case('기타 값이 들어옴');
            this.$set(this.workDetail, 'job_position', '직급입력');
            this.lv1_Act('직급입력으로 설정');
            break;
        }
        this.lv1_Data('job_position', this.workDetail.job_position);
        this.lv1_Act('this.workDetail.user_authority_idx를 통해 권한 입력');
        switch (this.workDetail.user_authority_idx) {
          case 0:
            this.lv1_Case('0 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '비즈니스회원');
            this.lv1_Act('비즈니스회원 권한으로 설정');
            break;
          case 1:
            this.lv1_Case('1 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '일반회원');
            this.lv1_Act('일반회원 권한으로 설정');
            break;
          case 2:
            this.lv1_Case('2 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '비즈니스회원');
            this.lv1_Act('비즈니스회원 권한으로 설정');
            break;
          case 3:
            this.lv1_Case('3 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 4:
            this.lv1_Case('4 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 5:
            this.lv1_Case('5 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 6:
            this.lv1_Case('6 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 7:
            this.lv1_Case('7 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 8:
            this.lv1_Case('8 값이 들어옴');
            this.$set(this.workDetail, 'user_authority', '정회원');
            this.lv1_Act('정회원 권한으로 설정');
            break;
          case 9:
            break;
          default:
            break;
        }
        this.lv1_Data('user_authority', this.workDetail.user_authority);
        this.lv1_Act('this.workDetail.user_church_office_idx를 통해 직분 입력');
        switch (this.workDetail.user_church_office_idx) {
          case null:
            this.lv1_Case('null 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '미등록');
            this.lv1_Act('교회직분 미등록으로 설정');
            break;
          case 0:
            this.lv1_Case('0 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '미등록');
            this.lv1_Act('교회직분 미등록으로 설정');
            break;
          case 100:
            this.lv1_Case('100 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '교역자');
            this.lv1_Act('교역자 직분으로 설정');
            break;
          case 200:
            this.lv1_Case('200 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '장로');
            this.lv1_Act('장로 직분으로 설정');
            break;
          case 300:
            this.lv1_Case('300 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '권사');
            this.lv1_Act('권사 직분으로 설정');
            break;
          case 400:
            this.lv1_Case('400 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '집사');
            this.lv1_Act('집사 직분으로 설정');
            break;
          case 401:
            this.lv1_Case('401 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '안수집사');
            this.lv1_Act('안수집사 직분으로 설정');
            break;
          case 500:
            this.lv1_Case('500 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '성도');
            this.lv1_Act('성도 직분으로 설정');
            break;
          case 600:
            this.lv1_Case('600 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '청년');
            this.lv1_Act('청년 직분으로 설정');
            break;
          case 820:
            this.lv1_Case('820 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '렘넌트 기관');
            this.lv1_Act('렘넌트 기관 직분으로 설정');
            break;
          case 900:
            this.lv1_Case('900 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '기타');
            this.lv1_Act('기타 직분으로 설정');
            break;
          default:
            this.lv1_Case('기타 값이 들어옴');
            this.$set(this.workDetail, 'user_church_office', '미등록');
            this.lv1_Act('교회직분 미등록으로 설정');
            break;
        }
        this.lv1_Data('user_church_office', this.workDetail.user_church_office);
      },
      async setBusinessKeywordInWorkList() {
        this.lv1_Func(
          'view:IndustrialistDetail',
          'setBusinessKeywordInWorkList()'
        );
        this.lv1_Act('비즈니스 키워드 배열을 통해 화면에 표현할 스트링을 생성');
        this.businessKeywordList.forEach((businessKeyword) => {
          let tempString = '';
          tempString = tempString + ',' + businessKeyword.keyword_name;
          // tempString 에서 첫번째 쉼표 제거
          tempString = tempString.substring(1);
          this.$set(this.workDetail, 'business_keywords', tempString);
          console.log(tempString);
        });

        if (this.workDetail.business_keywords === '') {
          this.lv1_Case('비즈니스 키워드가 없음');
          this.lv1_Act('비즈니스 키워드 미등록으로 설정');
          this.$set(
            this.workDetail,
            'business_keywords',
            '비즈니스 키워드 미등록'
          );
          this.lv1_Data('business_keywords', this.workDetail.business_keywords);
        }
      },
      // Portfolio
      async setWorkPortfolioImages() {
        this.lv1_Func('view:IndustrialistDetail', 'setWorkPortfolioImages()');
        this.lv1_Act('포트폴리오 이미지 세팅');
        if (this.portfolios.length == 0) {
          this.lv1_Case('포트폴리오가 없음');
          this.lv1_Act('디폴트 포트폴이오 이미지세팅');
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500',
          });
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500',
          });
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1652862730014-3c2e35432108?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500',
          });
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500',
          });
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500',
          });
          this.portfolios.push({
            file_title: '제품 & 서비스 제목',
            file_description: '제품 & 서비스 설명을 입력해 주세요',
            file_path:
              'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHN0b3JlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500',
          });
        }
        this.portfolios;
        this.lv1_Data('포트폴리오 (this.portfolios)', this.portfolios);
      },
    },
  };
</script>

<style scoped>
  /* Element : v-text-field */
  .v-text-field--outlined >>> fieldset {
    /* border-color: rgba(192, 0, 250, 0.986); */
    border: solid 1.5px rgba(236, 237, 245, 0.3);
    border-radius: 24px;
    background-image: #edeef3 !important;
    box-shadow: 15px 15px 15px #00000012, -15px -15px 15px #ffffff !important;
  }

  ::v-deep .v-label {
    font-family: NotoSansKR;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.09px;
    color: #b7bbcc;
  }

  .fb-btn .v-btn--outlined {
    border: thin solid #cccccc;
  }
</style>
