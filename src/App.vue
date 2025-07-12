<template>
  <div>
    <router-view :class="{ 'admin-route': isAdminRoute }" />
    <update-notification />
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      :top="true"
      :multi-line="true"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">닫기</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  import UpdateNotification from './components/UpdateNotification.vue';

  export default {
    name: 'App',
    components: {
      UpdateNotification,
    },
    data: () => ({
      isAdminRoute: false,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 3000,
      },
    }),
    watch: {
      // path가 변경될 때마다 isAdminRoute 값을 업데이트
      '$route.path': {
        immediate: true,
        handler(path) {
          this.isAdminRoute = path.includes('/admin');
          // body 클래스도 토글
          if (this.isAdminRoute) {
            document.body.classList.add('admin-view');
          } else {
            document.body.classList.remove('admin-view');
          }
        },
      },
    },
    methods: {
      testFunction: () => {},
    },
    created() {
      // 전역 이벤트 리스너 등록
      this.$root.$on('showSnackbar', (data) => {
        this.snackbar.text = data.text || '알림';
        this.snackbar.color = data.color || 'info';
        this.snackbar.timeout = data.timeout || 3000;
        this.snackbar.show = true;
      });
    },
    beforeDestroy() {
      // 이벤트 리스너 정리
      this.$root.$off('showSnackbar');
    },
  };
</script>

<style>
  .admin-route {
    /* 어드민 경로에만 적용되는 스타일 */
  }
</style>
