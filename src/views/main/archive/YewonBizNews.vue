<template>
  <v-container grid-list-xs class="mt-0">
    <v-row id="instafeed">
      <!-- <v-col cols="12" sm="6" md="4">
        <a style="text-decoration: none" href="여기다가 주소 넣음 됨">
          <v-card class="ma-3 pa-3 wc-card">
            <v-img
              src="https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
            ></v-img>
            <v-card-text class="ma-2">
              여기다가는 텍스트 캡션 넣으면 됨
            </v-card-text>
          </v-card>
        </a>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
  // import axios from "axios";
  // import NewsListItem from "@/components/basic/NewsListItem.vue";
  import { mapState } from 'vuex';

  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  // import instarfeed.js
  import Instafeed from 'instafeed.js';

  export default {
    name: 'HomeView',
    components: {
      // NewsListItem,
    },
    mixins: [MasterCtrl, FileBins, Utility],
    data() {
      return {
        // Axios Instance
        axios: null,
        // Database
        bizNewsList: [],
        // Search
        searchKeyword: '',
        isSearchResult: true,
        isLoding: true,
        // --------------
        search: '',
        right: null,
        feed: null,
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo', 'yewonbizAxios']),
      keywordFromHome() {
        return this.$route.params.keyword;
      },
    },
    created() {
      this.init();
    },
    mounted() {
      this.feed = new Instafeed({
        accessToken:
          'IGQVJYVVpyMEt3LTNEblpHNVdXcThaVFBPQnhnNmtLYnVVVlNXUGhNVGNWczJ3aWZAHZAG5OS3cyYXlRNlQyc1hNdjUya055RFh4M3VzMFEyVmRnSUtQbEhPa19lU2h2d3lpQjFZAOFhaWlp5NXh0V0s0QgZDZD',

        // debug: true,
        get: 'user',
        userId: 'self',
        template:
          '<div data-v-a051d3b0="" class="col-sm-6 col-md-4 col-12"> <a data-v-a051d3b0="" href="{{link}}" style="text-decoration: none;"><div data-v-a051d3b0="" class="ma-3 pa-3 wc-card v-card v-sheet theme--light"><div data-v-a051d3b0="" class="v-image v-responsive theme--light"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><div class="v-image__image v-image__image--cover" style="background-image: url({{image}}); background-position: center center;"></div><div class="v-responsive__content" style="width: 880px;"></div></div><div data-v-a051d3b0="" class="v-card__text ma-2"> {{caption}} </div></div></a></div>',
        sortBy: 'most-recent',
      });
      console.log('this.feed', this.feed);
      this.feed.run();
    },
    methods: {
      async init() {
        await this.getBizNewsList();
        await this.getBizFileList();
        this.isLoding = false;
      },
      async getBizNewsList() {
        this.lv1_Func('view: YewonBizNews', 'getBizNewsList()');
        this.bizNewsList = await this.openReadDataList(this.BizNews);
        this.lv1_Data('bizNewsList', this.bizNewsList);
      },
      async getBizFileList() {
        this.lv1_Func('view: YewonBizNews', 'getBizFileList()');
        this.bizNewsList.forEach(async (bizNews) => {
          this.bizFileList = await this.readBizNewsFileList(bizNews.id, 'BN');
          this.$set(bizNews, 'file_path', this.bizFileList[0].file_path);
          this.lv1_Data('bizFileList', this.bizFileList);
        });
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
