<template>
  <v-card class="wc-card ma-3">
    <v-img
      lazy-src=""
      :src="require(`@/assets/images/${imgUrl}`)"
      aspect-ratio="1"
      rounded
    ></v-img>
    <v-card-text class="pa-5">
      <div class="mt-1 wc-h4">{{ peopleName }}</div>
      <div class="mt-1 wc-info-light">{{ peoplePosition }}</div>
      <!-- <div class="mt-2 wc-caption">{{ contect }}</div> -->
    </v-card-text>
  </v-card>
</template>

<script>
import "@/styles/overrides.scss";
export default {
  props: {
    imgUrl: {
      type: String,
      default: "people1.png",
    },
    peopleName: {
      type: String,
      default: "people Name",
    },
    peoplePosition: {
      type: String,
      default: "people Position",
    },
    // contect: {
    //   type: String,
    //   default: "contect info",
    // },
  },
};
</script>

<style></style>
