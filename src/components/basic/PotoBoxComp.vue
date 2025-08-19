<template>
  <v-card class="wc-card pa-2">
    <v-img
      :min-height="minHeight"
      max-width=""
      lazy-src=""
      :src="imgUrl"
      rounded
      :aspectRatio="aspectRatio"
      position="bottom"
      @click="dialog = true"
    ></v-img>
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
  import '@/styles/overrides.scss';
  export default {
    props: {
      imgUrl: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1561016444-14f747499547?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80',
      },
      minHeight: {
        type: String,
        default: '',
      },
      maxWidth: {
        type: String,
        default: '',
      },
      lazySrc: {
        type: String,
        default: '',
      },
      aspectRatio: {
        type: Number,
        default: 1.7,
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
