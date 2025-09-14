<template>
  <v-container fill-height>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" xl="5" lg="5" md="9" sm="10">
        <!-- SignUpUser -->
        <UpdateInfoUser></UpdateInfoUser>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import UpdateInfoUser from "@/components/basic/UpdateInfoUserComp.vue";

export default {
  name: "SignUp",
  components: {
    UpdateInfoUser,
  },
  data() {
    return {};
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      if (!JSON.parse(localStorage.getItem("user_info"))) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style></style>
