<template>
  <v-card class="ma-0 pa-0 background-color nm-card text-center">
    <h1 class="contant-title mt-15">회원가입</h1>
    <h2 class="contant-subtitle">membership registration step 1</h2>

    <v-text-field
      v-model="name"
      label="name"
      hide-details="auto"
    ></v-text-field>

    <v-btn class="mt-10 mb-16">
      위의 <strong>"회원가입약관"</strong>에 동의합니다.
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: "SignInCompT1",
  props: {
    name: String,
    email: String,
    password: String,
    passwordComfirme: String,
    gender: String,
    birthDate: String,
    address: String,
    addressDetails: String,
    phoneNumber: String,
    churchMemberNomber: String,
  },
  data: () => ({
    // Organization
    // Role
    // Users
    newUsers: {
      name: "",
      email: "",
      password: "",
      passwordComfirme: "",
      gender: "",
      birthDate: "",
      address: "",
      addressDetails: "",
      phoneNumber: "",
      churchMemberNomber: "",
    },
  }),
};
</script>

<style></style>
