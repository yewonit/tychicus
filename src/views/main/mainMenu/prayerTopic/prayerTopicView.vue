<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col class="text-center">
        <div class="wc-direction-text wc-bold-700">00전도회 기도제목</div>
        <div class="wc-direction-text mt-1"></div>
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
          <div class="wc-info-light ma-0 pa-1 pt-7 pb-7">
            <v-icon size="10" class="ma-0 mr-3 fadeIn" color="#262626">
              mdi-hands-pray
            </v-icon>
            PrayerTopic
          </div>
          <div class="wc-h3 ma-0 pa-0">{{ service.name }}</div>

          <div class="wc-fs-16 ma-0 pa-0 px-15 pb-7">
            여기에 기도제목을 입력하세요.
          </div>
          <v-card-actions class="ma-0 pa-5">
            <v-btn icon>
              <v-icon
                size="20"
                class="ma-0 pa-0"
                @click="deleteService(service.id)"
              >
                mdi-delete
              </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon
                size="20"
                class="ma-0 pa-0"
                @click="editService(service.id)"
              >
                mdi-pencil
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ServiceSelectionView',
    data() {
      return {
        services: [
          {
            id: 1,
            groupName: '00전도회',
            prayerTopic: '전도회의 기도제목을 입력하고 항상 기도해보세요',
          },
          {
            id: 2,
            groupName: '01전도회',
            prayerTopic: '전도회의 기도제목을 입력하고 항상 기도해보세요',
          },
          {
            id: 3,
            groupName: '02전도회',
            prayerTopic: '전도회의 기도제목을 입력하고 항상 기도해보세요',
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
