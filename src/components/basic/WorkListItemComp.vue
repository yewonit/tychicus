<template>
  <v-card class="wc-card">
    <v-container>
      <v-row>
        <v-col class="ma-0 pa-3" cols="3" lg="4" xl="4" md="4" sm="4">
          <!-- workId: {{ workId }} -->
          <v-card class="ma-2 pa-1 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img
                lazy-src=""
                :src="fwdUserProfile"
                aspect-ratio="1"
                rounded
                @click="dialog2 = true"
              ></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-col class="ma-0 pa-3 pl-0" cols="8">
          <div class="mt-3 wc-h4">{{ fwdUserName }}</div>
          <div class="mt-1 wc-info">{{ fwdUserInfo }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-img
          aspect-ratio="0.95"
          lazy-src=""
          :src="fwdWorkImgUrl"
          rounded
          @click="dialog = true"
        ></v-img>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-4 pl-5" cols="12" lg="12" xl="12" md="12" sm="12">
          <div class="mt-3 wc-h4">{{ fwdCompanyName }}</div>
          <div class="mt-1 wc-info-light">{{ fwdWorkDescription }}</div>
        </v-col>
      </v-row>
      <v-row class="pb-3">
        <v-col class="ma-0 pa-0 pl-5" cols="7">
          <div class="mt-2 wc-caption">{{ fwdTel }}</div>
        </v-col>
        <v-col class="ma-0 pa-0 pr-3 d-flex justify-end" cols="5">
          <v-btn class="ml-0" color="#8a98a5 wc-tb2" text small plain>
            <router-link style="text-decoration: none" :to="fwdDetailUrl">
              <span class="wc-tb2">보러가기</span>
            </router-link>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-img
            aspect-ratio=""
            lazy-src=""
            :src="fwdWorkImgUrl"
            rounded
          ></v-img>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-img
            aspect-ratio=""
            lazy-src=""
            :src="fwdUserProfile"
            rounded
          ></v-img>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog2 = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<script>
  import '@/styles/overrides.scss';
  export default {
    props: {
      userProfile: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1612629131312-8f9a21a1b2c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      },
      workImgUrl: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500',
      },
      userName: {
        type: String,
        default: 'userName',
      },
      userInfo: {
        type: String,
        default: 'userInfo',
      },
      companyName: {
        type: String,
        default: 'companyName',
      },
      workDescription: {
        type: String,
        default: 'workDescription',
      },
      tel: {
        type: String,
        default: 'conpanyTel',
      },
      workId: {
        type: Number,
        default: 0,
      },
      workType: {
        type: String,
        default: 'EC',
      },
    },
    data() {
      return {
        // fwdWorkImgUrl: this.workImgUrl,
        dialog: false,
        dialog2: false,
      };
    },
    mounted() {},
    computed: {
      fwdUserProfile() {
        if (this.userProfile == '') {
          return 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470';
        } else {
          return this.userProfile;
        }
      },
      // workType의 종류에 따라 fwdWorkImgUrl에 다른 이미지 주소를 넣어줍니다.
      fwdWorkImgUrl() {
        if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'CB'
        ) {
          return require('../../assets/images/kind1.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'PB'
        ) {
          return require('../../assets/images/kind2.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'EP'
        ) {
          return require('../../assets/images/kind3.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'RE'
        ) {
          return require('../../assets/images/kind4.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'TE'
        ) {
          return require('../../assets/images/kind4.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'AB'
        ) {
          return require('../../assets/images/kind5.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'FR'
        ) {
          return require('../../assets/images/kind6.png');
        } else if (
          this.workImgUrl ==
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500' &&
          this.workType === 'EC'
        ) {
          return require('../../assets/images/kind7.png');
        } else {
          return this.workImgUrl;
        }
      },
      fwdUserName() {
        if (this.userName == '') {
          return 'userName';
        } else {
          return this.userName;
        }
      },
      fwdUserInfo() {
        if (this.userInfo == 0) {
          return 'userInfo';
        } else {
          return this.userInfo;
        }
      },
      fwdCompanyName() {
        if (this.companyName == '') {
          return 'companyName';
        } else {
          return this.companyName;
        }
      },
      fwdWorkDescription() {
        if (this.workDescription == '') {
          return 'workDescription';
        } else {
          return this.workDescription;
        }
      },
      fwdTel() {
        if (this.tel == '') {
          return 'conpanyTel';
        } else {
          return this.tel;
        }
      },
      fwdDetailUrl() {
        return '/sub/industrialist-detail/' + this.workId;
      },
    },
  };
</script>

<style></style>
