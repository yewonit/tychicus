<template>
  <v-container fill-height>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" xl="5" lg="5" md="9" sm="10">
        <!-- SignUpUser -->
        <ResetPWInfo></ResetPWInfo>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import ResetPWInfo from "@/components/basic/ResetPWInfoComp.vue";

export default {
  name: "ResetPW",
  components: {
    ResetPWInfo,
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
