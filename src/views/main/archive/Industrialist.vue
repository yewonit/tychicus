<template>
  <v-container fluid grid-list-xs class="mt-0">
    <v-row class="mt-0">
      <v-spacer></v-spacer>
      <v-col :class="search_bar_class" cols="11" sm="11" md="10" lg="11" xl="7">
        <!-- {{ this.$vuetify.breakpoint.name }} -->
        <v-text-field
          v-model="searchKeyword"
          @keyup="searchWork()"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          label="검색하실 회사를 입력하세요"
          hide-details="auto"
          class="mt-0 mb-5"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row class="mt-4">
      <v-spacer></v-spacer>
      <v-col :class="search_bar_class" cols="11" sm="11" md="10" lg="11" xl="7">
        <!-- {{ this.$vuetify.breakpoint.name }} -->
        <v-select
          v-model="searchBusinessCode"
          :items="items"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          label="검색하실 카테고리를 선택하세요"
          hide-details="auto"
          class="mt-0 mb-5"
          @change="searchWorkByBusinessCode()"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11" sm="11" md="10" lg="11" xl="7">
        <v-container class="mt-0" fluid>
          <v-row>
            <v-col
              class="pb-7"
              v-for="(item, i) in workList"
              :key="i"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="3"
            >
              <WorkListItem
                :userProfile="item.user_profile_path"
                :workImgUrl="item.file_path"
                :userName="item.user_name"
                :userInfo="item.user_authority"
                :companyName="item.company_name"
                :workDescription="item.work_description"
                :tel="item.tel"
                :workId="item.id"
                :workType="item.work_type"
              ></WorkListItem>
            </v-col>
            <v-col
              v-if="isLoding"
              class="mt-16 pt-16 pl-0 text-center"
              cols="12"
            >
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <div class="mt-10 wc-h2">DATA IS LOADING</div>
              <div class="mt-1 wc-info">Data is being loaded. Please wait.</div>
            </v-col>
            <v-col
              v-if="!isSearchResult"
              class="mt-16 pt-16 pl-0 text-center"
              cols="12"
            >
              <div class="mt-10 wc-h2">검색결과가 없습니다</div>
              <div class="mt-1 wc-info">No results found for your query.</div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  // COMPONENTS
  import WorkListItem from '@/components/basic/WorkListItemComp.vue';
  // VUEX
  import { mapState } from 'vuex';
  // MIXINS
  // for Data CRUD
  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  // for File Control
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  // for Utility
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  import { XLSX } from '@/mixins/apis_v2/utility/XLSX';

  // 산업인 정보 엑셀파일 변환을 위한 라이브러리 xlsx 사용

  export default {
    name: 'HomeView',
    components: {
      WorkListItem,
    },
    mixins: [MasterCtrl, FileBins, Utility, XLSX],
    data() {
      return {
        // Axios Instance
        axios: null,
        // Database
        workList: [],
        workListCopy: [],
        userList: [],
        whfileList: [],
        uhfileList: [],
        fileList: [],
        businessKeywordList: [],
        isSearchResult: true,
        isLoding: true,
        // --------------
        search: '',
        searchKeyword: '',
        searchBusinessCode: '',
        items: [
          { text: '미선택', value: '' },
          { text: '서비스업', value: '100' },
          { text: '금융∙은행업', value: '200' },
          { text: 'IT∙정보통신업', value: '300' },
          { text: '판매유통업', value: '400' },
          { text: '제조∙생산∙화학업', value: '500' },
          { text: '교육업', value: '600' },
          { text: '건설업', value: '700' },
          { text: '의료∙제약업', value: '800' },
          { text: '미디어∙광고업', value: '900' },
          { text: '문화∙예술∙디자인업', value: '1000' },
          { text: '기관∙협회', value: '1100' },
        ],
        cruds: [
          ['Create', 'mdi-plus-outline'],
          ['Read', 'mdi-file-outline'],
          ['Update', 'mdi-update'],
          ['Delete', 'mdi-delete'],
        ],
        right: null,
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo', 'yewonbizAxios']),
      keywordFromHome() {
        return this.$route.params.keyword;
      },
      search_bar_class() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return 'mt-0 mb-0 px-6 pt-0 pb-0';
          case 'sm':
            return 'mt-0 mb-0 px-6';
          case 'md':
            return 'mt-0 mb-0 px-6';
          case 'lg':
            return 'mt-0 mb-0 px-6';
          case 'xl':
            return 'mt-0 mb-0 px-6';
          default:
            return '';
        }
      },
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      /**
       * @description 초기화
       */
      async init() {
        this.isLoding = true;
        // 로컬 스토리지에 this.workListCopy가 있으면 로컬 스토리지에서 가져오고 없으면 서버에서 가져온다.
        if (localStorage.getItem('workListCopy')) {
          const tempWorkList = await this.openReadDataList(this.Work);
          this.workListCopy = JSON.parse(localStorage.getItem('workListCopy'));
          // 만약 tempWorkList 가 workListCopy 의 길이가 같으면 workListCopy 를 사용하고, 아니면 서버에서 가져온다.
          if (tempWorkList.length === this.workListCopy.length) {
            this.workList = this.workListCopy;
            this.lv1_Case('워킹카피 사용');
          } else {
            this.lv1_Case('서버데이터 사용');
            // 데이터 조회
            await this.readWork(); // 산업리스트 조회
            await this.readUser(); // 유저리스트 조회
            await this.readWHFile(); // 산업파일리스트 조회
            await this.readUHFile(); // 유저파일리스트 조회
            await this.readFile(); // 파일리스트 조회
            await this.readBusinessKeyword(); // 업종키워드리스트 조회
            // 데이터 정제
            await this.setFilePathInWorkList(); // 산업과련 파일경로를 산업리스트에 추가
            await this.setUserProfileInWorkList(); // 유저 프로필을 산업리스트에 추가
            await this.setUserNameInWorkList(); // 유저이름을 산업리스트에 추가
            await this.setBusinessKeywordInWorkList(); // 업종키워드를 산업리스트에 추가
            await this.copyWorkList(); // 산업리스트를 복사
          }
        } else {
          // 데이터 조회
          await this.readWork(); // 산업리스트 조회
          await this.readUser(); // 유저리스트 조회
          await this.readWHFile(); // 산업파일리스트 조회
          await this.readUHFile(); // 유저파일리스트 조회
          await this.readFile(); // 파일리스트 조회
          await this.readBusinessKeyword(); // 업종키워드리스트 조회
          // 데이터 정제
          await this.setFilePathInWorkList(); // 산업과련 파일경로를 산업리스트에 추가
          await this.setUserProfileInWorkList(); // 유저 프로필을 산업리스트에 추가
          await this.setUserNameInWorkList(); // 유저이름을 산업리스트에 추가
          await this.setBusinessKeywordInWorkList(); // 업종키워드를 산업리스트에 추가
          await this.copyWorkList(); // 산업리스트를 복사
        }

        // 데이터 재정렬
        await this.setListHavingPhotoFirst(); // 산업리스트에서 사진이 있는 산업을 맨 앞으로 정렬
        if (this.keywordFromHome !== undefined) {
          console.log('this.keywordFromHome');
          console.log(this.keywordFromHome);
          this.searchKeyword = this.keywordFromHome;
          this.searchWork();
        }
        this.isLoding = false;
        // this.downloadExcel(this.workList, "산업인정보", "산업인정보");
      },
      // Reading Data
      // Work Read
      async readWork() {
        console.log(`%c[ View: Industrialist ] readWork()`, `color:#BFFF00;`);
        this.workList = await this.openReadDataList(this.Work);
        this.workList.forEach((work) => {
          console.log(work.business_domain_lv1_idx);
          work.business_domain_lv1_idx =
            work.business_domain_lv1_idx.toString();
        });
        this.workList.reverse();
        console.log(
          `%c[ Data ] this.workList`,
          'color: #E3DAC9;',
          this.workList
        );
      },
      //User Read
      async readUser() {
        console.log(`%c[ View: Industrialist ] readUser()`, `color:#BFFF00;`);
        this.userList = await this.openReadDataList(this.User);
        console.log(
          `%c[ Data ] this.userList`,
          'color: #E3DAC9;',
          this.userList
        );
      },
      // WHFile Read
      async readWHFile() {
        console.log(`%c[ View: Industrialist ] readWHFile()`, `color:#BFFF00;`);
        this.whfileList = await this.openReadDataList(this.WHFile);

        console.log(
          `%c[ Data ] this.whfileList`,
          'color: #E3DAC9;',
          this.whfileList
        );
      },
      // UHFile Read
      async readUHFile() {
        console.log(`%c[ View: Industrialist ] readUHFile()`, `color:#BFFF00;`);
        this.uhfileList = await this.openReadDataList(this.UHFile);
        // 최신순으로 검색하도록 순서 뒤집음
        this.uhfileList.reverse();
        console.log(
          `%c[ Data ] this.uhfileList`,
          'color: #E3DAC9;',
          this.uhfileList
        );
      },
      // File Read
      async readFile() {
        console.log(`%c[ View: Industrialist ] readFile()`, `color:#BFFF00;`);
        this.fileList = await this.openReadDataList(this.File);
        this.fileList.reverse();
        console.log(
          `%c[ Data ] this.fileList`,
          'color: #E3DAC9;',
          this.fileList
        );
      },
      // Business Keywords Read
      async readBusinessKeyword() {
        console.log(
          `%c[ View: Industrialist ] readBusinessKeyword()`,
          `color:#BFFF00;`
        );
        this.businessKeywordList = await this.openReadDataList(
          this.BusinessKeyword
        );
        console.log(
          `%c[ Data ] this.businessKeywordList`,
          'color: #E3DAC9;',
          this.businessKeywordList
        );
      },

      // Processing Data
      async setFilePathInWorkList() {
        this.lv1_Func('view:Industrialist', 'setFilePathInWorkList()');
        // this.lv1_Act("각각의 ")
        this.workList.forEach((work) => {
          this.whfileList.forEach((whfile) => {
            if (work.id === whfile.work_id) {
              this.fileList.forEach((file) => {
                if (whfile.file_id === file.id) {
                  if (file.file_for == 'WR') {
                    this.$set(work, 'file_path', file.file_path);
                  }
                }
              });
            }
          });
        });
      },
      async setUserProfileInWorkList() {
        console.log('[Function] setUserProfileInWorkList()');
        this.workList.forEach((work) => {
          this.uhfileList.forEach((uhfile) => {
            if (work.user_id === uhfile.user_id) {
              this.fileList.forEach((file) => {
                if (uhfile.file_id === file.id) {
                  // console.log(file.file_path);
                  this.$set(work, 'user_profile_path', file.file_path);
                }
              });
            }
          });
        });
      },
      async setUserNameInWorkList() {
        console.log('[Function] setUserNameInWorkList()');
        this.workList.forEach((work) => {
          work.user_name = '';
          this.userList.forEach((user) => {
            if (work.user_id === user.id) {
              this.$set(work, 'user_name', user.name);
              switch (user.authority_idx) {
                case 0:
                  this.$set(work, 'user_authority', '비즈니스회원');
                  break;
                case 1:
                  this.$set(work, 'user_authority', '일반회원');
                  break;
                case 2:
                  this.$set(work, 'user_authority', '비즈니스회원');
                  break;
                case 3:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 4:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 5:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 6:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 7:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 8:
                  this.$set(work, 'user_authority', '정회원');
                  break;
                case 9:
                  break;

                default:
                  break;
              }
            }
          });
        });
      },
      async setBusinessKeywordInWorkList() {
        console.log('[Function] setBusinessKeywordInWorkList()');

        this.workList.forEach((work) => {
          this.$set(work, 'business_keywords', '');
          this.businessKeywordList.forEach((businessKeyword) => {
            let tempString = '';
            if (work.id === businessKeyword.work_id) {
              tempString = tempString + ',' + businessKeyword.keyword_name;
              this.$set(work, 'business_keywords', tempString);
            }
          });
        });
      },
      // this.workList 를 복사해 새로운 배열을 만드는 함수
      async copyWorkList() {
        console.log('[Function] copyWorkList()');
        this.workListCopy = [];
        this.workList.forEach((work) => {
          const tempWork = work;

          tempWork.user_name_search = tempWork.user_name.toLowerCase();
          tempWork.business_keywords_search =
            tempWork.business_keywords.toLowerCase();
          tempWork.work_description_search =
            tempWork.work_description.toLowerCase();
          tempWork.working_place_address_search =
            tempWork.working_place_address.toLowerCase();
          tempWork.working_place_address_detail_search =
            tempWork.working_place_address_detail.toLowerCase();
          tempWork.company_name_search = tempWork.company_name.toLowerCase();

          this.workListCopy.push(work);
        });
        // this.workListCopy를 로컬스토리지에 저장
        localStorage.setItem('workListCopy', JSON.stringify(this.workListCopy));
      },

      // Search
      // 검색어 - 사용자 이름
      // 검색어 - 비즈니스 키워드
      // 검색어 - 비즈니스 제목
      searchWork() {
        this.searchBusinessCode = '';
        console.log('[Function] searchWork()');
        console.log(this.searchKeyword);

        this.searchKeyword.toLowerCase();

        this.workList = this.workListCopy.filter((work) => {
          console.log(
            'business_keywords_search',
            this.business_keywords_search
          );
          return (
            work.user_name_search.indexOf(this.searchKeyword) !== -1 ||
            // work.tel.indexOf(this.searchKeyword) !== -1 ||
            work.business_keywords_search.indexOf(this.searchKeyword) !== -1 ||
            work.work_description_search.indexOf(this.searchKeyword) !== -1 ||
            work.working_place_address_search.indexOf(this.searchKeyword) !==
              -1 ||
            work.working_place_address_detail_search.indexOf(
              this.searchKeyword
            ) !== -1 ||
            work.company_name_search.indexOf(this.searchKeyword) !== -1
          );
        });

        console.log(this.workList);
        if (this.workList.length === 0) {
          this.isSearchResult = false;
        } else {
          this.isSearchResult = true;
        }

        this.setListHavingPhotoFirst();
      },
      searchWorkByBusinessCode() {
        this.searchKeyword = '';
        console.log('[Function] searchWork()');
        console.log(this.searchBusinessCode);
        this.workList = this.workListCopy.filter((work) => {
          return (
            work.business_domain_lv1_idx.indexOf(this.searchBusinessCode) !== -1
          );
        });
        console.log(this.workList);
        if (this.workList.length === 0) {
          this.isSearchResult = false;
        } else {
          this.isSearchResult = true;
        }
      },
      async setListHavingPhotoFirst() {
        if (this.workList.length !== 0) {
          // this.workList 를 순회하면서 this.workList.file_path 가 있는 요소를 앞쪽에 배치합니다.
          const frontArray = [];
          const backArray = [];
          await this.workList.forEach((work) => {
            if (work.file_path) {
              frontArray.push(work);
            } else {
              backArray.push(work);
            }
          });
          this.lv1_Data('frontArray', frontArray);
          this.lv1_Data('backArray', backArray);
          this.workList = [];
          await frontArray.forEach((work) => this.workList.push(work));
          await backArray.forEach((work) => this.workList.push(work));

          this.lv1_Data('this.workList', this.workList);

          // this.workListCopy 를 로컬 스토리지에 저장
          localStorage.setItem(
            'workListCopy',
            JSON.stringify(this.workListCopy)
          );
        } else {
          return;
        }
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
