<template>
  <v-card class="wc-card pa-1">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="ma-0 pa-3 mt-10" cols="7" lg="7" xl="7" md="8" sm="7">
          <v-card class="ma-1 pa-1 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img
                lazy-src=""
                :src="userProfile"
                aspect-ratio="1"
                rounded
                @click="dialog = true"
              ></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-4 pl-5" cols="12">
          <div class="mt-3 wc-h4 text-center">{{ userName }}</div>
          <div class="mt-1 wc-info-light text-center">User Name</div>
        </v-col>
      </v-row>
      <v-row class="pa-3">
        <v-col class="ma-0 pa-4" cols="4">
          <div class="mt-3 wc-h5 text-center">{{ jopPosition }}</div>
          <div class="mt-1 wc-info-light text-center">직급</div>
        </v-col>
        <v-col class="ma-0 pa-4" cols="4">
          <div class="mt-3 wc-h5 text-center">{{ churchOffice }}</div>
          <div class="mt-1 wc-info-light text-center">직분</div>
        </v-col>
        <v-col class="ma-0 pa-4" cols="4">
          <div class="mt-3 wc-h5 text-center">{{ org }}</div>
          <div class="mt-1 wc-info-light text-center">기관</div>
        </v-col>
      </v-row>
      <v-row class="pb-7">
        <v-col class="ma-0 pa-4 p7-5" cols="12">
          <div v-if="isLogin" class="mt-1 wc-caption text-center">
            {{ address }}
          </div>
          <div v-if="!isLogin" class="mt-1 wc-caption text-center">
            로그인 후 주소 공개
          </div>
          <div v-if="isLogin" class="mt-1 wc-caption text-center">
            {{ phoneNumber }}
          </div>
          <div v-if="!isLogin" class="mt-1 wc-caption text-center">
            로그인 후 번호 공개
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-img aspect-ratio="" lazy-src="" :src="userProfile" rounded></v-img>
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
import { mapState } from "vuex";
export default {
  props: {
    userProfile: {
      type: String,
      default: "userName",
    },
    userName: {
      type: String,
      default: "userName",
    },
    jopPosition: {
      type: String,
      default: "직급",
    },
    churchOffice: {
      type: String,
      default: "직분",
    },
    organization: {
      type: String,
      default: "기관",
    },
    phoneNumber: {
      type: String,
      default: "000 0000 0000",
    },
    address: {
      type: String,
      default: "서울특별시 강서구 가양동",
    },
  },
  computed: {
    ...mapState(["isLogin", "userInfo", "yewonbizAxios"]),
  },
  watch: {
    churchOffice(val) {
      if (val == "청년") {
        this.org = "청년회";
      } else {
        this.org = "전도회";
      }
    },
  },
  data() {
    return {
      org: "",
      dialog: false,
    };
  },
};
</script>

<style></style>
