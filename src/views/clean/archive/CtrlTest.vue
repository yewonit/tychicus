<template>
  <v-container>
    <v-card> userById : {{ userById }} </v-card>
    <v-card> userByEmail : {{ userByEmail }} </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      userById: null,
      userByEmail: null,
    };
  },

  created() {
    this.init();
  },
  methods: {
    async init() {
      this.userList = await this.authGetUserList();
      this.userById = await this.authGetUserInfoById(1);
      this.userByEmail = await this.authGetUserInfoByEmail(
        "yglee138@gmail.com"
      );
      // await this.openCreateUser({
      //   name: "MarkLee",
      //   email: "mark.lee@gmail.com",
      //   password: "2dydrjf112435",
      //   gender_type: "m",
      //   birth_date: "1989-10-01",
      //   address: "asdf",
      //   address_detail: "asdf",
      //   is_address_public: "y",
      //   church_office_idx: 1,
      //   sns_url: "asdf",
      //   hobby: "asdf",
      //   phone_number: "01033834177",
      //   is_phone_number_public: "y",
      //   church_member_number: "111111",
      //   internship_field_idx: 1,
      //   authority_idx: 1,
      //   postcode: "23414",
      // });
      // this.authAxios = this.getAuthAxios();
    },
  },
};
</script>

<style></style>
