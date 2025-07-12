<template>
  <v-container fill-height>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" xl="5" lg="5" md="9" sm="10">
        <!-- SignUpUser -->
        <UpdateInfoCMS></UpdateInfoCMS>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  import UpdateInfoCMS from '@/components/basic/UpdateInfoCMSComp.vue';

  export default {
    name: 'SignUp',
    components: {
      UpdateInfoCMS,
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
        if (!JSON.parse(localStorage.getItem('user_info'))) {
          this.$router.push('/');
        }
      },
    },
  };
</script>

<style></style>
