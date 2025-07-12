<template>
  <v-app class="background-color">
    <!-- <v-app-bar
      absolute
      color="transparent"
      style="height: 84px"
      elevate-on-scroll
      app
    > -->
    <!-- <v-spacer></v-spacer> -->
    <!-- </v-app-bar> -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'CleanLayout',
    data() {
      return {};
    },
    computed: {},
    methods: {},
  };
</script>

<style></style>
