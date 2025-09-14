/* eslint-disable no-console */

import { register } from "register-service-worker";

// 업데이트 알림 상태 저장용 변수
let refreshing = false;

// 앱 버전 체크 함수
function checkForUpdates() {
  // 캐시 방지를 위해 쿼리 파라미터 추가
  fetch(`${process.env.BASE_URL}version.json?_=${new Date().getTime()}`)
    .then((response) => response.json())
    .then((data) => {
      // 로컬 저장소에 저장된 버전과 비교
      const currentVersion = localStorage.getItem("appVersion");
      if (currentVersion && currentVersion !== data.version) {
        console.log(`새 버전 발견: ${data.version} (현재: ${currentVersion})`);

        // 업데이트 알림 이벤트 발생
        window.dispatchEvent(
          new CustomEvent("updateAvailable", {
            detail: {
              currentVersion,
              newVersion: data.version,
            },
          })
        );

        // 버전 변경 시 즉시 서비스 워커 업데이트 요청
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      }
      // 현재 버전 저장
      localStorage.setItem("appVersion", data.version);
    })
    .catch((error) => {
      console.error("버전 확인 중 오류 발생:", error);
    });
}

if (process.env.NODE_ENV === "production") {
  // 서비스 워커 등록
  // 기본 service-worker.js는 빌드 중에 Workbox에 의해 생성됨
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );

      // 앱 로드 시 버전 체크
      checkForUpdates();
    },
    registered(registration) {
      console.log("Service worker has been registered.");

      // 주기적으로 서비스 워커 업데이트 확인 (5분마다)
      setInterval(() => {
        registration.update();
        checkForUpdates();
      }, 5 * 60 * 1000);
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; please refresh.");

      // 업데이트 알림 이벤트 발생
      window.dispatchEvent(
        new CustomEvent("swUpdated", { detail: registration })
      );

      // 서비스 워커 변경 시 자동 새로고침
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });

  // 서비스 워커 컨트롤러 변경 시 페이지 새로고침
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    console.log("Controller changed, refreshing...");
    window.location.reload();
  });
}
