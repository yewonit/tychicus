<template>
  <v-card class="wc-card">
    <v-container class="pa-0 pb-3">
      <v-img
        class="rounded-lg rounded-b-0"
        aspect-ratio="1"
        lazy-src=""
        :src="fwdWorkImgUrl"
        rounded
      ></v-img>
      <v-row>
        <v-col class="ma-0 pa-4 pl-7" cols="12" lg="12" xl="12" md="12" sm="12">
          <div class="mt-3 wc-h4">{{ fwdNewsTitle }}</div>
          <div class="mt-1 wc-info-light">{{ fwdSubTitle }}</div>
        </v-col>
      </v-row>
      <v-row class="pb-3">
        <v-col class="ma-0 pa-0 pl-7" cols="7">
          <div class="mt-2 wc-caption">{{ fwdDate }}</div>
        </v-col>
        <v-col class="ma-0 pa-0 pr-5 d-flex justify-end" cols="5">
          <v-btn class="ml-0" color="#8a98a5 wc-tb2" text small plain>
            <router-link style="text-decoration: none" :to="fwdDetailUrl"
              ><span class="wc-tb2"> 보러가기 </span></router-link
            >
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import "@/styles/overrides.scss";
export default {
  props: {
    workImgUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500",
    },
    newsTitle: {
      type: String,
      default: "newsTitle",
    },
    subTitle: {
      type: String,
      default: "subTitle",
    },
    date: {
      type: String,
      default: "date",
    },
    bizNewsId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    fwdWorkImgUrl() {
      if (this.workImgUrl == "") {
        return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500";
      } else {
        console.log("this.workImgUrl", this.workImgUrl);
        return this.workImgUrl;
      }
    },
    fwdNewsTitle() {
      if (this.newsTitle == "") {
        return "newsTitle";
      } else {
        return this.newsTitle;
      }
    },
    fwdSubTitle() {
      if (this.subTitle == "") {
        return "subTitle";
      } else {
        return this.subTitle;
      }
    },
    fwdDate() {
      if (this.date == "") {
        return "conpanydate";
      } else {
        // 앞에서 10자리만 남기고 뒤에서 나머지 자리는 삭제
        return this.date.substring(0, 10);
      }
    },
    fwdDetailUrl() {
      return "/sub/biznews-detail/" + this.bizNewsId;
    },
  },
};
</script>

<style></style>
