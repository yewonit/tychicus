// This file is intentionally left mostly empty
// It will be populated by Workbox during build process
// But we add message listener to handle immediate activation

// 이 파일은 빌드 시 생성되는 service-worker.js와 충돌을 피하기 위해
// custom-service-worker.js로 이름을 변경해야 합니다.
// 파일명을 변경한 후 이 파일을 삭제하거나 다른 경로로 이동하세요.

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 설치 즉시 활성화
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// 활성화 완료 시 모든 클라이언트 제어 획득
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
