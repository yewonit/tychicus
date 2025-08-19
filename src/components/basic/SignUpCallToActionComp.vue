<template>
  <div>
    <v-container fill-height v-if="this.$vuetify.breakpoint.xs">
      <v-row class="mt-7">
        <v-spacer />
        <v-col class="pt-0 mb-5" cols="9">
          <v-card class="pa-2 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img lazy-src="" :src="imgUrl" aspect-ratio="1" rounded></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-spacer />
        <v-col class="ma-0 pa-4 pl-5" cols="12">
          <div class="mt-3 wc-h2 text-center">{{ title }}</div>
          <div class="mt-1 wc-info-light text-center">
            {{ subTitle }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col class="mt-5" cols="10" xl="7" lg="7" md="8" sm="10">
          <!--Element : Basic Button -->
          <v-btn
            class="wc-btn wc-btn-green"
            color="#fff"
            rounded
            block
            @click="$emit('goToNextStep')"
          >
            <span class="wc-h5 white--text">{{ btnTitle1 }}</span>
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row>
        <v-spacer />
        <v-col class="mb-16 pb-16" cols="10" xl="7" lg="7" md="8" sm="10">
          <!--Element : Basic Button -->
          <v-btn
            class="wc-btn wc-btn-grey"
            color="#fff"
            rounded
            block
            @click="$emit('goToHome')"
          >
            <span class="wc-h5 white--text">{{ btnTitle2 }}</span>
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
    <v-container v-if="!this.$vuetify.breakpoint.xs">
      <v-row>
        <v-spacer />
        <v-col class="pt-0 mb-5" cols="6">
          <v-card class="pa-3 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img lazy-src="" :src="imgUrl" aspect-ratio="1" rounded></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-spacer />
        <v-col class="ma-0 pa-4 pl-5" cols="12">
          <div class="mt-3 wc-h2 text-center">{{ title }}</div>
          <div class="mt-1 wc-info-light text-center">
            {{ subTitle }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col class="mx-5 mt-5" cols="12" xl="7" lg="7" md="8" sm="10">
          <!--Element : Basic Button -->
          <v-btn
            class="wc-btn wc-btn-green"
            color="#fff"
            rounded
            block
            @click="$emit('goToNextStep')"
          >
            <span class="wc-h5 white--text">{{ btnTitle1 }}</span>
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row>
        <v-spacer />
        <v-col class="mx-5 mb-16 pb-16" cols="12" xl="7" lg="7" md="8" sm="10">
          <!--Element : Basic Button -->
          <v-btn
            class="wc-btn wc-btn-grey"
            color="#fff"
            rounded
            block
            @click="$emit('goToHome')"
          >
            <span class="wc-h5 white--text">{{ btnTitle2 }}</span>
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    props: {
      imgUrl: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1487284122274-e864e9dec2bf?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472',
      },
      title: {
        type: String,
        default: 'Title',
      },
      subTitle: {
        type: String,
        default: 'SubTitle',
      },
      btnTitle1: {
        type: String,
        default: '다음으로',
      },
      btnTitle2: {
        type: String,
        default: '홈으로 이동',
      },
    },
  };
</script>

<style></style>
