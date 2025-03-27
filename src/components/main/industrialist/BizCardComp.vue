<template>
  <v-card :loading="loading" class="mx-auto nm-card mb-10" max-width="100%">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-card-title class="pl-5">
      <v-list-item-avatar color="black">
        <v-img
          alt=""
          src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
        ></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="text-avatar-name">이용걸</v-list-item-title>
        <v-list-item-title class="text-avatar-position"
          >Biz Member</v-list-item-title
        >
      </v-list-item-content>

      <v-btn class="mt-1 pr-0" text fab>
        <v-icon color="#C7CFDB" large dark> mdi-dots-vertical </v-icon>
      </v-btn>
    </v-card-title>
    <v-img
      class="nm-card-img"
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card-title class="card-title pl-5">산업인의 산업 타이틀</v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0"> </v-row>

      <div class="card-text mt-2 pl-1">산업을 설명하는 간단한 디스크립션</div>
    </v-card-text>
    <v-card-actions class="ml-0">
      <v-list-item class="grow ml-0">
        <v-list-item-content>
          <v-list-item-subtitle class="card-contact-info"
            >email@email.com</v-list-item-subtitle
          >
          <v-list-item-subtitle class="card-contact-info"
            >02-000-0000</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-btn color="#003442" text text-right> 보러가기 </v-btn>
      </v-list-item>
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

<style>
.card-title {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #003442 !important;
}

.card-text {
  font-size: 0.9rem !important;
  font-weight: 300 !important;
  color: #5b5b5b !important;
}

.card-contact-info {
  font-size: 0.9rem !important;
  font-weight: 300 !important;
  color: #5b5b5b !important;
}
</style>
