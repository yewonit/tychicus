<template>
  <div>
    <!-- Mobile -->
    <v-card
      flat
      v-if="this.$vuetify.breakpoint.smAndDown"
      class="nm-card-plain"
    >
      <v-container>
        <v-row class="mt-0">
          <v-col class="ma-0 pa-4 pl-5 pb-1" cols="12">
            <div class="mt-0 wc-h2 text-center">{{ title }}</div>
            <div class="mt-1 wc-info-light text-center">{{ subTitle }}</div>
          </v-col>
        </v-row>
        <v-row class="pb-14">
          <v-col class="pt-10 px-1 pb-1" cols="12">
            <div class="wc-dark-box pa-10">
              <span class="wc-h5">{{ bodyTitle }}</span>
              <br />
              <span class="wc-body2">{{ bodyText }}</span>
              <br />
            </div>
          </v-col>

          <v-col class="mt-10 px-3 mb-3" cols="12">
            <!--Element : Basic Button -->
            <v-btn
              @click="$emit('goToNextStep')"
              class="wc-btn wc-btn-green mt-5"
              color="#fff"
              rounded
              block
            >
              <span class="wc-h5 white--text">{{ buttonText }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- Desktop -->
    <v-card v-if="!this.$vuetify.breakpoint.smAndDown" class="nm-card">
      <v-container>
        <v-row class="mt-10">
          <v-col class="ma-0 pa-4 pl-5 pb-1" cols="12">
            <div class="mt-3 wc-h2 text-center">{{ title }}</div>
            <div class="mt-1 wc-info-light text-center">{{ subTitle }}</div>
          </v-col>
        </v-row>
        <v-row class="pb-14">
          <v-col class="pt-10 px-10 pb-1" cols="12">
            <div class="wc-dark-box pa-10">
              <span class="wc-h5">{{ bodyTitle }}</span>
              <br />
              <span class="wc-body2">{{ bodyText }}</span>
              <br />
            </div>
          </v-col>

          <v-col class="px-10" cols="12">
            <!--Element : Basic Button -->
            <v-btn
              @click="$emit('goToNextStep')"
              class="wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
            >
              <span class="wc-h5 white--text">{{ buttonText }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import '@/styles/overrides.scss';
  export default {
    props: {
      title: {
        type: String,
        default: 'Title',
      },
      subTitle: {
        type: String,
        default: 'SubTitle',
      },
      bodyTitle: {
        type: String,
        default: 'BodyTitle',
      },
      bodyText: {
        type: String,
        default: ``,
      },
      buttonText: {
        type: String,
        default: 'ButtonText',
      },
    },
    data() {
      return {
        checkbox: false,
      };
    },
    computed: {
      card_class() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return 'nm-card-plain';
          case 'sm':
            return 'nm-card-plain';
          case 'md':
            return 'nm-card-plain';
          case 'lg':
            return 'nm-card';
          case 'xl':
            return 'nm-card';
          default:
            return 'font-size: 1.0rem';
        }
      },
    },
  };
</script>

<style></style>

<style scoped>
  /* Element : v-text-field */
  .v-text-field--outlined >>> fieldset {
    /* border-color: rgba(192, 0, 250, 0.986); */
    border: solid 1.5px rgba(236, 237, 245, 0.3);
    border-radius: 24px;
    background-image: #edeef3 !important;
    box-shadow: 15px 15px 15px #00000012, -15px -15px 15px #ffffff !important;
  }

  ::v-deep .v-label {
    font-family: NotoSansKR;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.09px;
    color: #b7bbcc;
  }

  .fb-btn .v-btn--outlined {
    border: thin solid #cccccc;
  }
</style>
