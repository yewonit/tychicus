<template>
  <v-app>
    <v-app-bar app color="#FFFFFF">
      <v-spacer></v-spacer>
      <v-tabs v-model="value" right color="primary" slider-color="primary">
        <v-spacer></v-spacer>
        <v-tab>
          <router-link tag="a" :to="'/biz'">예원산업인</router-link>
        </v-tab>
        <v-tab>
          <router-link tag="a" :to="'/biz'">예원비즈</router-link>
        </v-tab>
        <v-tab>
          <router-link tag="a" :to="'/biz'">아카이브</router-link>
        </v-tab>
        <v-tab>
          <router-link tag="a" :to="'/biz'">공지사항</router-link>
        </v-tab>
        <v-tab>
          <router-link tag="a" :to="'/biz'">로그인</router-link>
        </v-tab>
        <!-- <v-tab> 아카이브 </v-tab>
        <v-tab> 공지사항 </v-tab>
        <v-tab> 로그인 </v-tab> -->
        <v-tab>
          <v-btn href="" target="_blank" text>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'MainIndex',

    data: () => ({
      icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
    }),
  };
</script>

<style></style>
