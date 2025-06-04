/* eslint-disable no-unused-vars */
import moment from "moment";
/* eslint-enable no-unused-vars */

export const DataLoaderMixin = {
  data() {
    return {
      // 조직 정보 관련 변수
      organizations: [],
      cachedOrganizations: null,
      organizationCacheExpiry: null,
      organizationCacheDuration: 30 * 60 * 1000, // 30분 캐시 지속 시간

      // 캐시 관련 추가 변수
      meetingsCache: {},
      meetingsCacheExpiry: null,
      attendanceCache: {},
      attendanceCacheExpiry: null,
      cacheDuration: 15 * 60 * 1000, // 15분 캐시 지속 시간

      // 데이터 로딩 상태
      isLoading: false,
      loadingProgress: 0,
      loadingOperations: 0,
      completedOperations: 0,
      loadingError: null,
      loadingStepText: "데이터 로딩 중...",
      loadingDetails: null,
    };
  },
  methods: {
    // 대시보드 초기화 - 병렬 로딩으로 변경
    async initializeDashboard() {
      this.isLoading = true;
      this.loadingProgress = 0;
      this.loadingOperations = 3; // 주요 작업 3개
      this.completedOperations = 0;
      this.loadingError = null; // 오류 메시지 초기화
      this.loadingStepText = "데이터 초기화...";
      this.loadingDetails = null;

      try {
        // 각 작업을 순차적으로 처리하여 더 자세한 진행 상황 제공

        // 1. 조직 정보 로딩 (0% ~ 33%)
        this.loadingStepText = "조직 정보 불러오는 중...";
        this.loadingDetails = "교회 조직 구조를 불러오고 있습니다";
        this.loadingProgress = 0;
        await this.fetchOrganizationsOnly();
        this.loadingProgress = 33; // 조직 정보 로딩 완료

        // 2. 모임 정보 로딩 (33% ~ 66%)
        this.loadingStepText = "모임 정보 불러오는 중...";
        this.loadingDetails = "각 조직의 모임 정보를 불러오고 있습니다";
        // fetchAllMeetings 내부에서 33%에서 66%까지 진행률 업데이트
        await this.loadMeetingsWithCache();
        this.loadingProgress = 66; // 모임 정보 로딩 완료

        // 3. 출석 데이터 로딩 (66% ~ 100%)
        this.loadingStepText = "출석 데이터 불러오는 중...";
        this.loadingDetails = "모임별 출석 정보를 처리하고 있습니다";
        await this.loadAttendanceWithCache();

        // 데이터 로딩 완료
        this.loadingStepText = "데이터 로딩 완료!";
        this.loadingDetails = "대시보드를 준비하고 있습니다";

        // 전체 통계가 비어있으면 다시 계산
        if (this.attendanceData.summary.totalMeetings === 0) {
          this.updateGlobalStatistics();
        }
      } catch (error) {
        console.error("대시보드 초기화 중 오류 발생:", error);
        this.loadingError =
          "데이터 로딩 중 오류가 발생했습니다. 다시 시도해주세요.";
      } finally {
        // 모든 작업이 완료되었음을 보장
        this.completedOperations = this.loadingOperations;
        this.loadingProgress = 100;

        // 로딩 완료 메시지 잠시 보여주기
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },

    // 조직 정보만 불러오는 메서드
    async fetchOrganizationsOnly() {
      try {
        // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
        const now = new Date().getTime();
        if (
          this.cachedOrganizations &&
          this.organizationCacheExpiry &&
          now < this.organizationCacheExpiry
        ) {
          this.organizations = this.cachedOrganizations;
          return;
        }

        // API에서 조직 정보 가져오기
        const response = await this.getAllOrganizations(true);

        // API 응답 구조 확인 및 데이터 추출
        let organizations = [];
        if (response && response.data && Array.isArray(response.data)) {
          // API 응답에서 data 배열을 추출
          organizations = response.data;
        } else if (Array.isArray(response)) {
          // 응답이 직접 배열인 경우
          organizations = response;
        } else {
          // 더미 데이터 사용
          organizations = this.getDummyOrganizations();
        }

        // 유효한 조직 데이터가 있는지 확인
        if (!organizations || organizations.length === 0) {
          organizations = this.getDummyOrganizations();
        }

        // 모든 조직 데이터 사용
        this.organizations = organizations;

        // 조직 데이터 캐싱
        this.cachedOrganizations = JSON.parse(JSON.stringify(organizations)); // 깊은 복사
        this.organizationCacheExpiry =
          new Date().getTime() + this.organizationCacheDuration;

        this.updateLoadingProgress();
      } catch (error) {
        console.error("조직 정보 가져오기 오류:", error);
        // 오류 발생 시 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();
        this.updateLoadingProgress();
      }
    },

    // 더미 조직 데이터 생성 메서드
    getDummyOrganizations() {
      return [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          organization_code: "CORAMDEO",
          description:
            "코람데오 청년선교회는 청년들의 신앙과 교제를 위한 조직입니다.",
          upper_organization_id: null,
          memberCount: 0,
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          organization_code: "CORAMDEO_DEPT1",
          description: "코람데오 청년선교회 1국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          organization_code: "CORAMDEO_DEPT2",
          description: "코람데오 청년선교회 2국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 4,
          organization_name: "코람데오_3국",
          organization_code: "CORAMDEO_DEPT3",
          description: "코람데오 청년선교회 3국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 5,
          organization_name: "코람데오_1국_1팀",
          organization_code: "CORAMDEO_DEPT1_TEAM1",
          description: "코람데오 청년선교회 1국 1팀입니다.",
          upper_organization_id: 2,
          memberCount: 0,
        },
      ];
    },

    // 캐시를 활용하여 모임 정보 로딩
    async loadMeetingsWithCache() {
      // 캐시 확인
      const now = new Date().getTime();
      const cacheKey = `${this.dateRange.start}_${this.dateRange.end}`;

      if (
        this.meetingsCache[cacheKey] &&
        this.meetingsCacheExpiry &&
        now < this.meetingsCacheExpiry
      ) {
        // 캐시된 데이터 사용
        this.loadingDetails = "캐시된 모임 정보를 사용합니다";
        this.attendanceData.meetings = this.meetingsCache[cacheKey];
        this.structureData();
        this.updateLoadingProgress();
        return;
      }

      // 캐시가 없으면 데이터 로딩
      this.loadingDetails = "모임 정보를 서버에서 가져오는 중...";
      await this.fetchAllMeetings();

      // 데이터 캐싱
      this.meetingsCache[cacheKey] = [...this.attendanceData.meetings];
      this.meetingsCacheExpiry = now + this.cacheDuration;
    },

    // 캐시를 활용하여 출석 데이터 로딩
    async loadAttendanceWithCache() {
      // 모임 데이터가 있는지 확인
      if (this.attendanceData.meetings.length === 0) {
        this.loadingDetails =
          "모임 데이터가 없습니다. 모임 정보를 먼저 로드합니다.";
        await this.loadMeetingsWithCache();
      }

      // 캐시 확인
      const now = new Date().getTime();
      const cacheKey = `${this.dateRange.start}_${this.dateRange.end}`;

      if (
        this.attendanceCache[cacheKey] &&
        this.attendanceCacheExpiry &&
        now < this.attendanceCacheExpiry
      ) {
        // 캐시된 데이터 사용
        this.loadingDetails = "캐시된 출석 정보를 사용합니다";
        this.attendanceData.statistics = this.attendanceCache[cacheKey];
        this.updateGlobalStatistics();
        this.updateLoadingProgress();
        return;
      }

      // 캐시가 없으면 데이터 로딩
      this.loadingDetails = "출석 데이터를 처리하는 중...";
      await this.fetchAllAttendanceData();

      // 데이터 캐싱
      this.attendanceCache[cacheKey] = { ...this.attendanceData.statistics };
      this.attendanceCacheExpiry = now + this.cacheDuration;
    },

    // 로딩 진행 상태 업데이트 메서드
    updateLoadingProgress() {
      this.completedOperations++;
      this.loadingProgress = Math.round(
        (this.completedOperations / this.loadingOperations) * 100
      );
    },

    // 로딩 재시도 메서드
    retryLoading() {
      this.isLoading = true;
      this.loadingProgress = 0;
      this.loadingError = null;
      this.loadingStepText = "데이터 로딩 중...";
      this.loadingDetails = null;
      this.initializeDashboard();
    },
  },
};
