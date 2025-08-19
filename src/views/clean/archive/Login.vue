<template>
  <v-container class="mt-0 pt-0" fill-height fluid grid-list-xs>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="mb-5" cols="12" xl="2" lg="3" md="4" sm="12">
        <LoginComp></LoginComp>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  import LoginComp from '@/components/basic/LoginComp.vue';
  export default {
    name: 'LoginView',
    components: {
      LoginComp,
    },
    data() {
      return {};
    },
  };
</script>

<style></style>
