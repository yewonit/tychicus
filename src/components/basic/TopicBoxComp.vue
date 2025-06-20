<template>
  <v-card min-height="350" class="wc-card pa-1">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="ma-0 pa-2 mt-10" cols="7" lg="7" xl="7" md="8" sm="7">
          <v-card class="ma-1 pa-1 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img lazy-src="" :src="imgUrl" aspect-ratio="1" rounded></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-4 pl-5" cols="12">
          <div class="mt-3 wc-h4 text-center">{{ TopicTitle }}</div>
          <div class="mt-1 wc-info-light text-center">{{ TopicSubTitle }}</div>
        </v-col>
      </v-row>
      <v-row class="px-3 pt-0 pb-5">
        <v-col class="ma-0" cols="12">
          <div class="px-4 wc-body2 text-center">
            {{ TopicDescription }}
          </div>
          <div class="mt-2 wc-caption text-center">{{ TopicInfo }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import '@/styles/overrides.scss';
  export default {
    props: {
      imgUrl: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1638913662252-70efce1e60a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      },
      TopicTitle: {
        type: String,
        default: 'TopicTitle',
      },
      TopicSubTitle: {
        type: String,
        default: 'TopicSubTitle',
      },
      TopicDescription: {
        type: String,
        default: '이 곳에는 해당 토픽에 대한 설명이 들어가게됩니다.',
      },
      TopicInfo: {
        type: String,
        default: 'TopicInfo',
      },
    },
  };
</script>

<style></style>
