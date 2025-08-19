<template>
  <v-container class="mt-0 pt-0" fluid grid-list-xs>
    <v-row>
      <v-spacer></v-spacer>
      <!-- 실질적인 컨테이너 영역 -->
      <v-col class="mt-16 pt-0 mb-0" cols="11" xl="6" lg="8" md="8" sm="11">
        <!-- 본문 -->
        <v-row class="mt-0 pt-0">
          <!-- 매인 타이틀 -->
          <v-col class="ma-0 pt-0 pl-5 pb-5" cols="12">
            <div class="wc-h2 text-center">예원비즈</div>
            <div class="mt-1 wc-info-light text-center">
              The spectacle before us was indeed sublime.
            </div>
          </v-col>
          <!-- 포토박스 -->
          <v-col class="mb-5" cols="12" xl="12" lg="12" md="12" sm="12">
            <PotoBox
              :imgUrl="'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1544'"
              :maxHeight="'400'"
            ></PotoBox>
          </v-col>
          <!-- 섹션 1 : 설명  -->
          <v-col class="ma-0 pt-16 pl-5 pb-5" cols="12">
            <div class="mt-1 wc-h2 text-center">예원비즈를 소개합니다.</div>
            <div class="mt-1 wc-info-light text-center">
              Introducing Yewon Biz.
            </div>
            <div class="ma-3 mt-7 wc-body1 text-center">
              예원비즈는 예원교회 산업위원회에서 운영하는 산업인 전용 온라인
              플랫폼입니다. 사업자는 물론, 직장인, 프리랜서, 단기 알바 등
              경제활동을 하는 모든 성도들이 활용 가능한 온라인 서비스입니다. 1만
              예원 성도들의 사업자 정보를 조회할 수 있고 사업제휴와 업무지원,
              산업 홍보 등을 지원해드립니다. 예원비즈를 통해 예원의 모든
              산업인들이 교회와 목회자를 살리고 237나라 5,000종족 빈 곳을 살리는
              식주인, 보호자, 동역자의 증인으로 세워지기를 기도합니다.
            </div>
          </v-col>
          <v-col class="ma-0 pt-16 pl-5 pb-5" cols="12">
            <div class="mt-1 wc-h2 text-center">산업위원회 사업영역</div>
            <div class="mt-1 wc-info-light text-center">
              Industry Committee Business Area
            </div>
            <v-row class="mt-16 mb-16">
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'문화 플랫폼'"
                  :TopicSubTitle="'Cultural Platform'"
                  :TopicDescription="'이디야 카페 운영'"
                  :TopicInfo="'렘넌트 문화센터 2층'"
                  :imgUrl="'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'온라인 플랫폼'"
                  :TopicSubTitle="'Online Platform'"
                  :TopicDescription="'예원비즈 운영'"
                  :TopicInfo="'www.yewonbiz.com'"
                  :imgUrl="'https://images.unsplash.com/photo-1562575214-da9fcf59b907?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aW50ZXJuZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=400'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'예원교회 서점 & 공간 운영'"
                  :TopicSubTitle="'Space Operation'"
                  :TopicDescription="'커버넌트홀 1층 서점 & 문화센터 내 공유오피스 등'"
                  :TopicInfo="'커버넌트홀 1층, 문화센터 0층'"
                  :imgUrl="'https://images.unsplash.com/photo-1513001900722-370f803f498d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'산업분야별 컨퍼런스 진행'"
                  :TopicSubTitle="'Conference'"
                  :TopicDescription="'각 산업별 세미나, 인턴십 기획 및 진행'"
                  :TopicInfo="'원네스홀 등'"
                  :imgUrl="'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'문화행사 진행'"
                  :TopicSubTitle="'Conference'"
                  :TopicDescription="'커피데이, 이디야 경품행사, 독서 클래스 등'"
                  :TopicInfo="'이디야, 원네스홀 등'"
                  :imgUrl="'https://images.unsplash.com/photo-1464047736614-af63643285bf?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'식주인 역할 담당'"
                  :TopicSubTitle="'Conference'"
                  :TopicDescription="'렘넌트,다민족 등들을 위한 먹거리 나눔 행사'"
                  :TopicInfo="'떡볶이 데이, 커피차 등'"
                  :imgUrl="'https://images.unsplash.com/photo-1621188988909-fbef0a88dc04?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'각종 지원사업'"
                  :TopicSubTitle="'Various support projects'"
                  :TopicDescription="'교회관련 기관 및 지역사회 대상 각종 지원사업'"
                  :TopicInfo="'후원금 지원, 장학사업지원 등'"
                  :imgUrl="'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c3VwcG9ydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60'"
                ></TopicBox>
              </v-col>
              <v-col class="mb-0" cols="12" xl="3" lg="3" md="4" sm="12">
                <TopicBox
                  :TopicTitle="'예원 온라인 몰'"
                  :TopicSubTitle="'Various support projects'"
                  :TopicDescription="'운영 예정'"
                  :TopicInfo="'Comming Soon'"
                  :imgUrl="'https://images.unsplash.com/photo-1539278383962-a7774385fa02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG9ubGluZSUyMHNob3BwaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60'"
                ></TopicBox>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="ma-0 pt-16 pl-5 pb-5" cols="12">
            <div class="mt-1 wc-h2 text-center">CONTACT US</div>
            <div class="mt-1 wc-info-light text-center">We Are Always Open</div>
            <div class="mt-10 wc-h4 text-center">yewonbiz@gmail.com</div>
            <div class="mt-1 wc-h4 text-center">010-7590-0237</div>
            <v-row class="mt-10 mb-0">
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <People
                  :imgUrl="'people1.png'"
                  :peopleName="'권영흠 위원장'"
                  :peoplePosition="'산업선교위원회 총괄'"
                ></People>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <People
                  :imgUrl="'people2.png'"
                  :peopleName="'정현 총무'"
                  :peoplePosition="'정회원 가입 및 회원정책 문의'"
                ></People>
              </v-col>
              <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
                <People
                  :imgUrl="'people3.png'"
                  :peopleName="'장세진 기획국장'"
                  :peoplePosition="'사업제휴 및 행사기획'"
                ></People>
              </v-col>
              <v-col class="mb-0" cols="12" xl="3" lg="3" md="4" sm="12">
                <People
                  :imgUrl="'people4.png'"
                  :peopleName="'김지영 대리'"
                  :peoplePosition="'산업선교위원회 간사'"
                ></People>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  // import axios from "axios";
  import PotoBox from '@/components/basic/PotoBoxComp.vue';
  import TopicBox from '@/components/basic/TopicBoxComp.vue';
  import People from '@/components/basic/PeopleComp.vue';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'HomeView',
    components: {
      PotoBox,
      TopicBox,
      People,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo',
        'workList',
        'userList',
        'whfileList',
        'uhfileList',
        'fileList',
        'businessKeywordList',
      ]),
    },
    created() {
      // this.checkLogin();
      // this.getDatabase();
    },
    mounted() {},
    methods: {
      ...mapActions([
        'login',
        'checkLogin',
        'refreshAccessTokenAtVuex',
        'logout',
        'getDatabase',
      ]),
    },
  };
</script>

<style>
  /* .v-text-field input {
  font-size: 1em;
  line-height: 1em;
}

.v-input .v-label {
  font-size: 1em;
  line-height: 1em;
} */
</style>

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
