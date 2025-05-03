<template>
  <v-app class="background-color">
    <v-app-bar
      absolute
      color="transparent"
      elevation="0"
      style="height: 84px"
      fixed
      app
    >
      <v-app-bar-nav-icon>
        <v-icon @click="goBack()">mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <!-- {{ this.$vuetify.breakpoint.name }} -->

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "SubLayout",
  data() {
    return {};
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
      [2];
    },
  },
};
</script>

<style></style>
