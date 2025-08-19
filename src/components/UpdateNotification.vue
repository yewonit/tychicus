<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    bottom
    right
    color="primary"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">mdi-update</v-icon>
      <span>새 버전이 있습니다. 업데이트하시겠습니까?</span>
      <v-spacer></v-spacer>
      <v-btn text color="white" @click="refreshApp">업데이트</v-btn>
      <v-btn text color="white" @click="snackbar = false">나중에</v-btn>
    </div>
  </v-snackbar>
</template>

<script>
  export default {
    name: 'UpdateNotification',
    data() {
      return {
        snackbar: false,
        timeout: -1, // 무제한 표시
        refreshing: false,
        registration: null,
        updateVersion: null,
      };
    },
    created() {
      // 서비스 워커 업데이트 이벤트 리스너
      window.addEventListener('swUpdated', this.showRefreshUI, { once: true });

      // 버전 업데이트 이벤트 리스너
      window.addEventListener('updateAvailable', this.showUpdateUI);

      // 이미 이벤트가 발생했을 경우 (컴포넌트 생성 후 이벤트 발생한 경우)
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.onstatechange = (e) => {
          if (e.target.state === 'redundant') {
            this.showRefreshUI();
          }
        };
      }
    },
    methods: {
      // 서비스 워커 업데이트 알림 표시
      showRefreshUI(e) {
        if (e) {
          this.registration = e.detail;
        }
        this.snackbar = true;
      },

      // 버전 업데이트 알림 표시
      showUpdateUI(e) {
        if (e && e.detail) {
          this.updateVersion = e.detail.newVersion;
          console.log(`업데이트 가능: ${this.updateVersion}`);
        }
        this.snackbar = true;
      },

      // 앱 새로고침
      refreshApp() {
        this.snackbar = false;

        if (this.registration && this.registration.waiting) {
          // service worker에 스킵 대기 메시지 전송
          this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
          // 일반 새로고침
          window.location.reload();
        }
      },
    },
  };
</script>
