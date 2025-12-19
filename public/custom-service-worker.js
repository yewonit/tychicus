/* eslint-env serviceworker */

/**
 * Custom Service Worker
 * @description
 * Workbox에 의해 자동 생성되는 service-worker.js에 추가되는 커스텀 로직
 * 주요 기능:
 * - 즉시 활성화 (skipWaiting)
 * - 오래된 캐시 자동 삭제
 * - 버전 관리
 */

// Service Worker 버전 관리 (배포 시마다 버전 업데이트 권장)
const CACHE_VERSION = 'v1.0.2';
const CACHE_NAMES = {
  API: `api-cache-${CACHE_VERSION}`,
  IMAGE: `image-cache-${CACHE_VERSION}`,
};

/**
 * 메시지 이벤트 리스너
 * @description 클라이언트로부터 SKIP_WAITING 메시지를 받으면 즉시 활성화
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * 설치 이벤트 리스너
 * @description Service Worker 설치 시 즉시 대기 상태를 건너뛰고 활성화
 */
self.addEventListener('install', () => {
  console.log('🔧 Service Worker 설치 중...', CACHE_VERSION);
  self.skipWaiting();
});

/**
 * 활성화 이벤트 리스너
 * @description
 * Service Worker 활성화 시 수행되는 작업:
 * 1. 오래된 버전의 캐시 삭제
 * 2. members API 관련 캐시 강제 삭제 (데이터 최신화)
 * 3. 모든 클라이언트 제어 획득
 */
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker 활성화 중...', CACHE_VERSION);

  event.waitUntil(
    Promise.all([
      // 1. 오래된 버전의 모든 캐시 삭제
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // 현재 버전이 아닌 캐시 삭제
              const isOldCache =
                (cacheName.startsWith('api-cache-') ||
                  cacheName.startsWith('image-cache-')) &&
                !Object.values(CACHE_NAMES).includes(cacheName);

              if (isOldCache) {
                console.log('🗑️ 오래된 캐시 삭제:', cacheName);
              }
              return isOldCache;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      }),

      // 2. members API 관련 캐시 강제 삭제 (항상 최신 데이터 보장)
      caches.open('api-cache').then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests
              .filter((request) => {
                const isMembersAPI = request.url.includes('/members');
                if (isMembersAPI) {
                  console.log('🗑️ Members API 캐시 삭제:', request.url);
                }
                return isMembersAPI;
              })
              .map((request) => cache.delete(request))
          );
        });
      }),
    ])
      .then(() => {
        console.log('✨ Service Worker 활성화 완료:', CACHE_VERSION);
        return clients.claim();
      })
      .catch((error) => {
        console.error('❌ Service Worker 활성화 중 오류:', error);
      })
  );
});
