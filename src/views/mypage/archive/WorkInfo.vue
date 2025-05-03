<template>
  <v-container fill-height>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" xl="5" lg="5" md="9" sm="10">
        <!-- SignUpUser -->
        <UpdateInfoWork></UpdateInfoWork>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import UpdateInfoWork from "@/components/basic/UpdateInfoWorkComp.vue";

export default {
  name: "SignUp",
  components: {
    UpdateInfoWork,
  },
  data() {
    return {
      signupStep: 1,
    };
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
