<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col class="text-center">
        <span class="wc-direction-text"> 성도 유형을 선택하세요 </span>
      </v-col>
      <v-col cols="12" class="text-center mt-9 px-20">
        <v-card
          :class="{
            'wc-card': true,
            'mb-12': true,
            'disabled-card': !service.isActive,
          }"
          v-for="service in services"
          :key="service.id"
        >
          <v-icon size="140" class="ma-3 mt-6 fadeIn" color="#262626">{{
            service.icon
          }}</v-icon>
          <div class="wc-h3 ma-0 pa-0">{{ service.name }}</div>
          <div class="wc-info-light ma-0 pa-1 pb-7">
            {{ service.description }}
          </div>
          <v-card-actions class="ma-0 pa-0">
            <v-btn
              class="wc-card-btn"
              block
              large
              @click="$router.push(service.path)"
              :disabled="!service.isActive"
            >
              <span class="wc-h3">들어가기</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ServiceSelectionView",
  data() {
    return {
      services: [
        {
          id: 1,
          name: "장기결석자 관리",
          description: "Long-term Absentee Management",
          icon: "mdi-account-check",
          isActive: true,
          path: "/long-term-absentee-list", // path 속성 수정
        },
        {
          id: 2,
          name: "새가족 관리",
          description: "New Family Management",
          icon: "mdi-account-multiple-plus",
          isActive: true,
          path: "/new-family-list", // path 속성 수정
        },
      ],
    };
  },
};
</script>

<style scoped>
.service-card {
  padding: 20px;
  margin-bottom: 20px;
}

.disabled-card {
  opacity: 0.5;
}
</style>
