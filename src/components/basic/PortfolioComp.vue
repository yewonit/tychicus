<template>
  <v-card class="wc-card">
    <v-img
      @click="dialog = true"
      lazy-src=""
      :src="imgUrl"
      aspect-ratio="1"
      rounded
    ></v-img>
    <v-card-text>
      <div class="mt-1 wc-h4">{{ portfolioTitle }}</div>
      <div class="mt-1 wc-info-light">{{ portfolioDescription }}</div>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-img aspect-ratio="" lazy-src="" :src="imgUrl" rounded></v-img>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<script>
import "@/styles/overrides.scss";
export default {
  props: {
    imgUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1561016444-14f747499547?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80",
    },
    portfolioTitle: {
      type: String,
      default: "Portfolio Title",
    },
    portfolioDescription: {
      type: String,
      default: "Portfolio Description",
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style></style>
