<template>
  <v-row>
    <v-col class="mb-5" cols="12" xl="8" lg="8" md="8" sm="12">
      <PotoBox
        :imgUrl="'https://images.unsplash.com/photo-1561016444-14f747499547?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80'"
      ></PotoBox>
    </v-col>
    <v-col class="mb-5" cols="12" xl="4" lg="4" md="4" sm="12">
      <UserProfileBox
        :userProfile="'userProfile'"
        :userName="'userName'"
        :jopPosition="'직급명'"
        :churchOffice="'직분명'"
        :organization="'기관명'"
        :phoneNumber="'phoneNumber'"
        :address="'address'"
      ></UserProfileBox>
    </v-col>
  </v-row>
</template>

<script>
  import '@/styles/overrides.scss';
  import PotoBox from '@/components/basic/PotoBox.vue';
  import UserProfileBox from '@/components/basic/UserProfileBox.vue';
  export default {
    components: {
      PotoBox,
      UserProfileBox,
    },
    props: {
      userProfile: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470',
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
        type: String,
        default: 'workId',
      },
    },
    computed: {
      fwdUserProfile() {
        if (this.userProfile == '') {
          return 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470';
        } else {
          return this.userProfile;
        }
      },
      fwdWorkImgUrl() {
        if (this.workImgUrl == '') {
          return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500';
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
