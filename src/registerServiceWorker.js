/* eslint-disable no-console */

import { register } from 'register-service-worker';

/**
 * 캐시 클리어 함수
 * @description
 * 버전 업데이트 시 members API 관련 캐시를 강제로 삭제하여
 * 사용자가 항상 최신 데이터를 받도록 보장
 */
async function clearMembersCache() {
  try {
    const cacheNames = await caches.keys();
    const apiCaches = cacheNames.filter((name) => name.includes('api-cache'));

    for (const cacheName of apiCaches) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        if (request.url.includes('/members')) {
          await cache.delete(request);
          console.log('🗑️ Members 캐시 삭제:', request.url);
        }
      }
    }

    console.log('✅ Members 캐시 클리어 완료');
  } catch (error) {
    console.error('❌ 캐시 클리어 중 오류:', error);
  }
}

/**
 * 앱 버전 체크 함수
 * @description
 * version.json을 확인하여 새 버전이 있으면 Service Worker 업데이트 트리거
 * 버전이 변경되면 members 캐시를 클리어하여 최신 데이터 보장
 */
function checkForUpdates() {
  // 캐시 방지를 위해 쿼리 파라미터 추가
  fetch(`${process.env.BASE_URL}version.json?_=${new Date().getTime()}`)
    .then((response) => response.json())
    .then((data) => {
      // 로컬 저장소에 저장된 버전과 비교
      const currentVersion = localStorage.getItem('appVersion');
      if (currentVersion && currentVersion !== data.version) {
        console.log(
          `🔄 앱 버전 업데이트 감지: ${currentVersion} → ${data.version}`
        );

        // 업데이트 알림 이벤트 발생
        window.dispatchEvent(
          new CustomEvent('updateAvailable', {
            detail: {
              currentVersion,
              newVersion: data.version,
            },
          })
        );

        // members 캐시 강제 삭제
        clearMembersCache();

        // 버전 변경 시 즉시 서비스 워커 업데이트 요청
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      }
      // 현재 버전 저장
      localStorage.setItem('appVersion', data.version);
    })
    .catch((error) => {
      console.error('❌ 버전 체크 중 오류 발생:', error);
    });
}

if (process.env.NODE_ENV === 'production') {
  // 서비스 워커 등록
  // 기본 service-worker.js는 빌드 중에 Workbox에 의해 생성됨
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      // 앱 로드 시 버전 체크
      checkForUpdates();
    },
    registered(registration) {
      // 주기적으로 서비스 워커 업데이트 확인 (5분마다)
      setInterval(() => {
        registration.update();
        checkForUpdates();
      }, 5 * 60 * 1000);
    },
    cached() {},
    updatefound() {},
    updated(registration) {
      // 업데이트 알림 이벤트 발생
      window.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      );

      // 서비스 워커 변경 시 자동 새로고침
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
    offline() {},
    error(error) {
      console.error('❌ 서비스 워커 오류 발생:', error);
    },
  });

  if ('serviceWorker' in navigator) {
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }
}
