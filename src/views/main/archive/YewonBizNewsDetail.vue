<template>
  <v-container grid-list-xs class="mt-6 mb-16 pb-16">
    <!-- {{ this.$vuetify.breakpoint.name }} -->

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11">
        <v-row>
          <v-col
            class="mb-0 text-center"
            cols="12"
            xl="9"
            lg="8"
            md="8"
            sm="12"
          >
            <PotoBox
              :imgUrl="bizNewsItem.file_path"
              :aspectRatio="photoBoxRatio"
              class="mb-12"
            ></PotoBox>
            <span class="mt-10 wc-h2"> {{ bizNewsItem.title }} </span><br />
            <span class="wc-st1"> {{ bizNewsItem.sub_title }} </span><br />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mb-0 pa-10 pt-7" cols="12" xl="9" lg="8" md="8" sm="12">
            <span class="wc-body2"> {{ bizNewsItem.body }} </span><br />
          </v-col>
        </v-row>
        <!-- TEXT ROW 1 -->
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// COMPONENTS
import PotoBox from "@/components/basic/PotoBoxComp.vue";

// VUEX
import { mapState } from "vuex";
// MIXINS
// for Data CRUD
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
// for File Control
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
// for Utility
import { Utility } from "@/mixins/apis_v2/utility/Utility";

export default {
  name: "HomeView",
  components: {
    PotoBox,
  },
  mixins: [MasterCtrl, FileBins, Utility],
  data() {
    return {
      bizNewsItem: {},
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo", "yewonbizAxios"]),
    bizNewsId() {
      return this.$route.params.bizNewsId;
    },
    photoBoxRatio() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 0.9;
        case "sm":
          return 1.75;
        case "md":
          return 1.075;
        case "lg":
          return 1.355;
        case "xl":
          return 2.23;
        default:
          return "font-size: 0.85rem; font-weight: 500; color: #545454;";
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
      await this.getBizFilePath();
    },
    // Reading Data
    // Work Read
    async readData() {
      console.log(this.bizNewsId);
      const bizNewsList = await this.openReadDataItemById(
        this.BizNews,
        this.bizNewsId
      );
      console.log(`%c[ Data ] bizNewsList`, "color: #E3DAC9;", bizNewsList);
      this.bizNewsItem = bizNewsList;
    },
    async getBizFilePath() {
      this.lv1_Func("view: YewonBizNews", "getBizFileList()");
      const bizFileList = await this.readBizNewsFileList(
        this.bizNewsItem.id,
        "BN"
      );
      this.lv1_Data("bizFileList", bizFileList);
      this.$set(this.bizNewsItem, "file_path", bizFileList[0].file_path);
      this.lv1_Data("this.bizNewsItem", this.bizNewsItem);
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
