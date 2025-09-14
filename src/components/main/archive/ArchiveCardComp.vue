<template>
  <v-card :loading="loading" class="mx-auto">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img height="500" src="@/assets/demo3.jpg"></v-img>

    <v-card-title>행사 타이틀</v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0"> </v-row>

      <div class="my-4 text-subtitle-1 mx-0">
        <v-icon>mdi-calendar-check</v-icon>
        2022.00.00
      </div>

      <div>
        Small plates, salads & sandwiches - an intimate setting with 12 indoor
        seats plus patio seating.
      </div>
    </v-card-text>
    <v-card-actions class="ml-0">
      <v-btn color="deep-purple lighten-2" text @click="reserve">
        보러가기
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "BizCard",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
