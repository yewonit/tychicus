<template>
  <div class="dashboard-container">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>데이터를 불러오고 있습니다...</p>
    </div>

    <!-- 메인 컨텐츠 -->
    <template v-else>
      <!-- 상단 헤더 영역 -->
      <div class="dashboard-header">
        <div class="header-left">
          <div class="header-title">
            <span class="chart-icon">📊</span>
            <span>{{ organizations.organization_name }} 대시보드</span>
          </div>
          <div class="breadcrumb">
            <span>
              청년2국 > 송강욱그룹 | 그룹장: 송강욱 | 부그룹장: 허효진
            </span>
          </div>
        </div>
        <div class="header-right">
          <div class="user-profile">
            <div class="profile-avatar">
              {{ userInfo.name ? userInfo.name.charAt(0) : ' ' }}
            </div>
            <div class="profile-info">
              <span class="profile-name">{{ userInfo.name }}</span>
              <span class="profile-role">{{ userInfo.roles[0].roleName }}</span>
            </div>
          </div>
          <div class="hamburger-menu-container">
            <button
              @click="toggleHamburgerMenu"
              class="hamburger-menu"
              :class="{ active: isHamburgerMenuOpen }"
            >
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>

            <!-- 햄버거 드롭다운 메뉴 -->
            <div
              v-if="isHamburgerMenuOpen"
              class="hamburger-dropdown"
              @click.stop
            >
              <div class="menu-item active">
                <span class="menu-icon">📅</span>
                <span>출석 현황</span>
              </div>
              <div class="menu-item" @click="navigateToGroupManagement">
                <span class="menu-icon">👥</span>
                <span>그룹원 관리</span>
              </div>
              <div class="menu-item" @click="navigateToRewardsPenalties">
                <span class="menu-icon">🗂️</span>
                <span>심방보고</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 날짜 검색 영역 -->
      <div class="date-search-section">
        <div class="date-search-container">
          <div class="date-input-group">
            <label class="date-label">시작일</label>
            <div class="date-input-wrapper">
              <input
                type="date"
                v-model="startDate"
                class="date-input-styled"
              />
            </div>
          </div>

          <div class="date-separator">~</div>

          <div class="date-input-group">
            <label class="date-label">종료일</label>
            <div class="date-input-wrapper">
              <input type="date" v-model="endDate" class="date-input-styled" />
            </div>
          </div>

          <button @click="onSearch" class="search-button-styled">조회</button>
        </div>
      </div>

      <!-- 주요 지표 카드들 -->
      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-number">79.2%</div>
          <div class="metric-label">그룹 평균 출석률</div>
          <div class="metric-trend positive">
            <span class="trend-icon">▲</span>
            <span>3.7% 이전 대비 기간 대비</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-number">24명</div>
          <div class="metric-label">그룹 재적 인원</div>
          <div class="metric-subtitle">번몸 없음</div>
        </div>

        <div class="metric-card">
          <div class="metric-number green-text">19명</div>
          <div class="metric-label">평균 출석 인원</div>
          <div class="metric-subtitle">최근 1주 평균</div>
        </div>

        <div class="metric-card">
          <div class="metric-number-with-icon">
            <span class="warning-icon">⚠</span>
            <span class="metric-number yellow-text">3명</span>
          </div>
          <div class="metric-label">연속 결석 순원</div>
          <div class="metric-subtitle">2주 이상 연속 결석</div>
        </div>
      </div>

      <!-- 출석률 추이 차트 -->
      <div class="chart-section">
        <div class="section-header">
          <div class="section-title">
            <span class="icon">📊</span>
            출석률 동향
          </div>
          <div class="section-subtitle">최근 5주간 순별 출석률 변화 추이</div>
        </div>

        <div class="chart-controls">
          <div class="chart-tabs">
            <button
              @click="chartTab = 'combined'"
              :class="['tab-btn', { active: chartTab === 'combined' }]"
            >
              그룹 출석률
            </button>
            <button
              @click="chartTab = 'individual'"
              :class="['tab-btn', { active: chartTab === 'individual' }]"
            >
              예비별 출석률
            </button>
          </div>

          <div class="chart-legend">
            <div class="legend-title">예배 종류 선택</div>
            <div class="legend-items">
              <div
                v-for="(type, key) in worshipTypes"
                :key="key"
                class="worship-checkbox-item"
                @click="toggleWorshipType(key)"
              >
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    :checked="type.selected"
                    @click.stop="toggleWorshipType(key)"
                    class="worship-checkbox"
                  />
                  <span
                    class="checkmark"
                    :style="{
                      backgroundColor: type.selected
                        ? type.color
                        : 'transparent',
                    }"
                  >
                    <span v-if="type.selected" class="check-icon">✓</span>
                  </span>
                </div>
                <span class="worship-label">{{ type.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <canvas ref="attendanceChart"></canvas>
        </div>
      </div>

      <!-- 순별 출석 현황 -->
      <div class="subgroup-section">
        <div class="section-header">
          <div class="section-title">
            <span class="icon">📋</span>
            순별 출석 현황
          </div>
        </div>
        <div class="subgroup-cards">
          <div
            v-for="subgroup in groupData.subgroups"
            :key="subgroup.name"
            class="subgroup-card"
          >
            <!-- 큰 바 차트 -->
            <div class="main-chart">
              <div
                class="chart-bar-large"
                :style="{
                  height: `${(subgroup.attendanceRate / 100) * 120}px`,
                  width: '60px',
                  background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
                }"
              ></div>
              <div class="chart-label">{{ subgroup.name }}</div>
            </div>

            <!-- 하단 정보 -->
            <div class="subgroup-info">
              <div class="subgroup-name">{{ subgroup.name }}</div>
              <div class="member-count">재적: {{ subgroup.members }}명</div>
              <div class="attendance-rate">{{ subgroup.attendanceRate }}%</div>
              <div class="rate-label">출석률</div>
              <div class="rate-change">
                <span
                  :class="[
                    'change-indicator',
                    subgroup.attendanceRate > subgroup.previousRate
                      ? 'positive'
                      : 'negative',
                  ]"
                >
                  {{
                    subgroup.attendanceRate > subgroup.previousRate ? '▲' : '▼'
                  }}
                  {{
                    Math.abs(subgroup.attendanceRate - subgroup.previousRate)
                  }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 관심 순원 목록 -->
      <div class="members-section">
        <div class="section-header">
          <div class="section-header-left">
            <div class="section-title">
              <span class="icon">⚠</span>
              관심 순원 목록
            </div>
            <div class="section-subtitle">
              출석율이 낮거나 연속 결석 중인 순원
            </div>
          </div>
          <div class="filter-controls">
            <select v-model="selectedSubgroup" class="filter-select">
              <option value="all">전체 순</option>
              <option
                v-for="subgroup in groupData.subgroups"
                :key="subgroup.name"
                :value="subgroup.name"
              >
                {{ subgroup.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="members-list">
          <div
            v-for="member in filteredMembers"
            :key="member.name"
            class="member-card"
          >
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-details">
                <span class="member-subgroup">{{ member.subgroup }}</span>
                <span class="detail-separator">|</span>
                <span class="detail-text">
                  마지막 출석: {{ member.lastAttendance }}
                </span>
                <span class="detail-separator">|</span>
                <span class="detail-text">
                  출석 횟수: {{ member.attendanceCount }}
                </span>
              </div>
            </div>
            <div class="member-actions">
              <button @click="showMemberDetail(member)" class="detail-btn">
                📋 상세
              </button>
              <div
                class="absence-badge"
                :class="{
                  'weeks-1': member.consecutiveAbsences === 1,
                  'weeks-2': member.consecutiveAbsences === 2,
                  'weeks-3': member.consecutiveAbsences === 3,
                  'weeks-4': member.consecutiveAbsences >= 4,
                }"
              >
                {{ member.consecutiveAbsences }}주 결석
              </div>
              <div class="phone-number">{{ member.phone }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 순원 상세 정보 모달 -->
    <MemberDetailModal
      :member="selectedMember"
      @close="selectedMember = null"
    />
  </div>
</template>

<script>
  import Chart from 'chart.js/auto';
  import { OrganizationCtrl } from '@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl';
  import { mapState } from 'vuex';
  import { format } from 'date-fns';
  import MemberDetailModal from '@/components/MemberDetailModal.vue';

  export default {
    name: 'AttendanceDashboardView',
    components: {
      MemberDetailModal,
    },
    mixins: [OrganizationCtrl],
    data() {
      return {
        loading: true,
        selectedSubgroup: 'all',
        selectedMember: null,
        chartTab: 'combined',
        organizations: {},
        worshipTypes: {
          all: { name: '전체', selected: true, color: '#6b7280' },
          sunday: { name: '대예배', selected: true, color: '#a855f7' },
          youth: { name: '청년대예배', selected: true, color: '#10b981' },
          wednesday: { name: '수요예배', selected: true, color: '#3b82f6' },
          newbie: { name: '수요새자리모임', selected: true, color: '#f59e0b' },
          friday: { name: '금요예배', selected: true, color: '#8b5cf6' },
          healing: { name: '현장치유팀사역', selected: true, color: '#ec4899' },
        },
        groupData: {
          name: '믿음 그룹',
          totalMembers: 24,
          averageAttendance: 19,
          attendanceRate: 79.2,
          previousAttendanceRate: 75.5,
          consecutiveAbsentees: 3,
          weeklyData: [
            { week: '06/01(월)', attendanceRate: 85 },
            { week: '06/04(수)', attendanceRate: 75 },
            { week: '06/06(금)', attendanceRate: 82 },
            { week: '06/08(일)', attendanceRate: 88 },
            { week: '06/11(수)', attendanceRate: 78 },
          ],
          subgroups: [
            {
              name: '충선제순',
              members: 8,
              attendanceRate: 85,
              previousRate: 80,
              consecutiveAbsentees: 1,
            },
            {
              name: '허들러순',
              members: 9,
              attendanceRate: 72,
              previousRate: 81,
              consecutiveAbsentees: 1,
            },
            {
              name: '린덴션순',
              members: 7,
              attendanceRate: 68,
              previousRate: 65,
              consecutiveAbsentees: 1,
            },
          ],
          membersOfConcern: [
            {
              name: '김성실',
              subgroup: '충선제순',
              lastAttendance: '2024-04-26',
              consecutiveAbsences: 2,
              attendanceCount: '2/4',
              phone: '010-1234-5678',
            },
            {
              name: '이믿음',
              subgroup: '허들러순',
              lastAttendance: '2024-04-21',
              consecutiveAbsences: 3,
              attendanceCount: '1/4',
              phone: '010-2345-6789',
            },
            {
              name: '박소망',
              subgroup: '린덴션순',
              lastAttendance: '2024-05-05',
              consecutiveAbsences: 1,
              attendanceCount: '3/4',
              phone: '010-3456-7890',
            },
            {
              name: '최사랑',
              subgroup: '린덴션순',
              lastAttendance: '2024-04-14',
              consecutiveAbsences: 4,
              attendanceCount: '0/4',
              phone: '010-4567-8901',
            },
          ],
        },
        groupPath: '청년2국 > 송강욱그룹 | 그룹장: 송강욱 | 부그룹장: 허효진',
        today: new Date(),
        lineChartInstance: null,
        barChartInstance: null,
        isHamburgerMenuOpen: false,
      };
    },
    computed: {
      ...mapState('auth', ['userInfo']),
      filteredMembers() {
        return this.selectedSubgroup === 'all'
          ? this.groupData.membersOfConcern
          : this.groupData.membersOfConcern.filter(
              (member) => member.subgroup === this.selectedSubgroup
            );
      },
      startDate: {
        get() {
          const date = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            1
          );
          return format(date, 'yyyy-MM-dd');
        },
        set() {
          // 사용자가 날짜를 변경할 수 있도록 처리
        },
      },
      endDate: {
        get() {
          const date = new Date(
            this.today.getFullYear(),
            this.today.getMonth() + 1,
            0
          );
          return format(date, 'yyyy-MM-dd');
        },
        set() {
          // 사용자가 날짜를 변경할 수 있도록 처리
        },
      },
    },
    methods: {
      callMember(phone) {
        window.location.href = `tel:${phone}`;
      },
      toggleWorshipType(type) {
        if (type === 'all') {
          // 전체 선택/해제
          const newState = !this.worshipTypes.all.selected;
          Object.keys(this.worshipTypes).forEach((key) => {
            this.worshipTypes[key].selected = newState;
          });
        } else {
          // 개별 선택/해제
          this.worshipTypes[type].selected = !this.worshipTypes[type].selected;

          // 모든 개별 항목이 선택되면 전체도 선택
          const individualTypes = Object.keys(this.worshipTypes).filter(
            (key) => key !== 'all'
          );
          const allSelected = individualTypes.every(
            (key) => this.worshipTypes[key].selected
          );
          this.worshipTypes.all.selected = allSelected;
        }

        // 차트 업데이트
        this.$nextTick(() => {
          this.createLineChart();
        });
      },
      showMemberDetail(member) {
        this.selectedMember = member;
      },
      createLineChart() {
        console.log('Creating chart with tab:', this.chartTab);
        if (this.lineChartInstance) {
          this.lineChartInstance.destroy();
        }

        if (!this.$refs.attendanceChart) {
          console.log('Chart canvas not found, retrying...');
          this.$nextTick(() => {
            this.createLineChart();
          });
          return;
        }

        const ctx = this.$refs.attendanceChart.getContext('2d');

        let datasets = [];

        if (this.chartTab === 'combined') {
          // 그룹 출석률 - 전체 그룹의 통합 데이터
          const allDatasets = [
            {
              type: 'bar',
              label: '대예배',
              data: [40, 15, 35, 45, 25],
              backgroundColor: '#a855f7',
              order: 2,
              key: 'sunday',
            },
            {
              type: 'bar',
              label: '청년대예배',
              data: [50, 38, 42, 65, 40],
              backgroundColor: '#10b981',
              order: 2,
              key: 'youth',
            },
            {
              type: 'bar',
              label: '수요예배',
              data: [15, 35, 30, 40, 20],
              backgroundColor: '#3b82f6',
              order: 2,
              key: 'wednesday',
            },
            {
              type: 'bar',
              label: '수요제자기도회',
              data: [20, 25, 30, 35, 28],
              backgroundColor: '#f59e0b',
              order: 2,
              key: 'newbie',
            },
            {
              type: 'bar',
              label: '금요예배',
              data: [18, 22, 25, 30, 24],
              backgroundColor: '#8b5cf6',
              order: 2,
              key: 'friday',
            },
            {
              type: 'bar',
              label: '현장치유팀사역',
              data: [25, 40, 45, 35, 42],
              backgroundColor: '#ec4899',
              order: 2,
              key: 'healing',
            },
          ];

          // 선택된 예배 종류만 필터링
          datasets = allDatasets.filter(
            (dataset) => this.worshipTypes[dataset.key].selected
          );

          // 그룹 전체 출석률 라인 추가 (전체가 선택된 경우에만)
          if (this.worshipTypes.all.selected) {
            datasets.push({
              type: 'line',
              label: '그룹 전체 출석률',
              data: [65, 58, 70, 75, 62],
              borderColor: '#1f2937',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#1f2937',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              order: 1,
              yAxisID: 'y1',
            });
          }
        } else {
          // 예비별 출석률 - 각 순별 데이터
          datasets = [
            {
              type: 'line',
              label: '충선제순',
              data: [85, 80, 88, 90, 82],
              borderColor: '#6366f1',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#6366f1',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              type: 'line',
              label: '허들러순',
              data: [72, 75, 68, 78, 70],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#10b981',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              type: 'line',
              label: '린덴션순',
              data: [68, 65, 72, 70, 66],
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#f59e0b',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              yAxisID: 'y',
            },
          ];
        }

        this.lineChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              '06/01(일)',
              '06/04(수)',
              '06/06(금)',
              '06/08(일)',
              '06/11(수)',
            ],
            datasets: datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                max: this.chartTab === 'combined' ? 80 : 100,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  callback: function (value) {
                    return value + '%';
                  },
                },
              },
              y1: {
                type: 'linear',
                display: this.chartTab === 'combined',
                position: 'right',
                beginAtZero: true,
                max: this.chartTab === 'combined' ? 80 : 100,
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  color: '#10b981',
                  callback: function (value) {
                    return value + '%';
                  },
                },
              },
            },
          },
        });
      },
      createBarChart() {
        if (this.barChartInstance) {
          this.barChartInstance.destroy();
        }
        const ctx = this.$refs.attendanceBarChart.getContext('2d');
        this.barChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.groupData.weeklyData.map((d) => d.week),
            datasets: [
              {
                label: '충선제순',
                data: [80, 70, 75, 85, 75],
                backgroundColor: '#6366f1',
              },
              {
                label: '허들러순',
                data: [85, 80, 90, 95, 85],
                backgroundColor: '#10b981',
              },
              {
                label: '린덴션순',
                data: [75, 85, 80, 70, 80],
                backgroundColor: '#f59e0b',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      },
      async getGroupData(groupId) {
        try {
          const response = await this.getOrganizationById(groupId, true);
          this.organizations = response.data;
          console.log('organizations', this.organizations);

          // 조직 데이터를 받아온 후 그룹패스 업데이트
          if (this.organizations && this.organizations.organization_name) {
            this.groupPath = `${
              this.organizations.organization_name
            } | 그룹장: ${
              this.organizations.leader_name || '미지정'
            } | 부그룹장: ${this.organizations.sub_leader_name || '미지정'}`;
          }

          // API에서 받은 실제 데이터로 groupData 업데이트 (실제 API 응답 구조에 맞게 조정 필요)
          // 현재는 목 데이터를 유지하되, API 데이터가 있으면 일부 필드를 업데이트
          if (this.organizations.total_members) {
            this.groupData.totalMembers = this.organizations.total_members;
          }
          if (this.organizations.attendance_rate) {
            this.groupData.attendanceRate = this.organizations.attendance_rate;
          }
        } catch (error) {
          console.error('조직 정보 가져오기 오류:', error);
          this.organizations = {};
          // 에러 발생 시 기본값 유지
          this.groupPath =
            '청년2국 > 송강욱그룹 | 그룹장: 송강욱 | 부그룹장: 허효진';
        }
      },
      onSearch() {
        // 조회 버튼 클릭 시 동작
        console.log('검색 실행:', this.startDate, this.endDate);
      },
      toggleHamburgerMenu() {
        this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
      },
      navigateToGroupManagement() {
        // 그룹별 관리 페이지로 이동
        console.log('그룹별 관리 페이지로 이동');
        this.isHamburgerMenuOpen = false;
      },
      navigateToRewardsPenalties() {
        // 상벌내역 페이지로 이동
        console.log('상벌내역 페이지로 이동');
        this.isHamburgerMenuOpen = false;
      },
      handleClickOutside(event) {
        if (
          this.isHamburgerMenuOpen &&
          !event.target.closest('.hamburger-menu-container')
        ) {
          this.isHamburgerMenuOpen = false;
        }
      },
    },
    async created() {
      if (!this.userInfo) {
        this.$router.push({ name: 'LoginView' });
        return;
      }

      // 조직 데이터를 먼저 로드
      if (this.userInfo?.roles?.[0]?.organizationId) {
        await this.getGroupData(this.userInfo.roles[0].organizationId);
      }

      this.loading = false;

      // 로딩 완료 후 차트 생성
      this.$nextTick(() => {
        this.createLineChart();
      });
    },
    mounted() {
      // 외부 클릭 이벤트 리스너 추가
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
      // 이벤트 리스너 제거
      document.removeEventListener('click', this.handleClickOutside);
    },
    watch: {
      chartTab() {
        this.$nextTick(() => {
          this.createLineChart();
        });
      },
      loading(newVal) {
        if (!newVal) {
          // 로딩이 완료되면 차트 생성
          this.$nextTick(() => {
            this.createLineChart();
          });
        }
      },
    },
  };
</script>

<style scoped>
  .dashboard-container {
    padding: 20px;
    background-color: #ffffff;
    min-height: 100vh;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #6b7280;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #4f46e5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .dashboard-header {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header-left .header-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .header-left .breadcrumb {
    font-size: 14px;
  }

  .separator {
    margin: 0 8px;
    opacity: 0.7;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }

  .notification-icon {
    position: relative;
  }

  .bell-icon {
    font-size: 20px;
  }

  .notification-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .profile-avatar {
    width: 36px;
    height: 36px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    color: #8b5cf6;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
  }

  .profile-name {
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  .profile-role {
    font-size: 12px;
    color: white;
  }

  .dropdown-arrow {
    font-size: 12px;
    color: white;
  }

  .hamburger-menu-container {
    position: relative;
  }

  .hamburger-menu {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .hamburger-line {
    width: 20px;
    height: 2px;
    background: white;
    display: block;
  }

  .hamburger-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 1000;
    min-width: 160px;
    margin-top: 8px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
  }

  .menu-item.active {
    background: #3b82f6;
    color: white;
  }

  .menu-item:hover:not(.active) {
    background: #f3f4f6;
  }

  .menu-icon {
    font-size: 16px;
  }

  .metrics-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .metric-card {
    background: white;
    padding: 24px 20px;
    border-radius: 12px;
    text-align: center;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  .metric-card.blue .metric-number {
    color: #4285f4;
  }

  .metric-card.green .metric-number {
    color: #34a853;
  }

  .metric-card.yellow {
    position: relative;
  }

  .metric-card.yellow .warning-icon {
    position: absolute;
    top: 16px;
    left: 16px;
    color: #ffc107;
    font-size: 20px;
  }

  .metric-card.yellow .metric-number {
    color: #ffc107;
  }

  .metric-card.orange {
    position: relative;
  }

  .metric-card.orange .warning-icon {
    position: absolute;
    top: 16px;
    left: 16px;
    color: #ff9800;
    font-size: 20px;
  }

  .metric-card.orange .metric-number {
    color: #ff9800;
  }

  .warning-icon {
    display: block;
    text-align: center;
    color: #ffc107;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .metric-number {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #4285f4;
    line-height: 1.2;
  }

  .metric-number.green-text {
    color: #34a853;
  }

  .metric-number.yellow-text {
    color: #ffc107;
  }

  .metric-label {
    font-size: 16px;
    color: #666666;
    margin-bottom: 8px;
    font-weight: 400;
  }

  .metric-subtitle {
    font-size: 14px;
    color: #999999;
    margin-top: 4px;
  }

  .metric-trend {
    font-size: 14px;
    margin-top: 8px;
    font-weight: 400;
  }

  .metric-trend.positive {
    color: #34a853;
  }

  .trend-icon {
    margin-right: 4px;
    font-size: 12px;
  }

  .chart-section,
  .subgroup-section,
  .members-section {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  .section-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .section-header-left {
    flex: 1;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #666666;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .section-subtitle {
    font-size: 14px;
    color: #999999;
    margin: 0;
  }

  .chart-controls {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .chart-tabs {
    display: flex;
    gap: 8px;
  }

  .tab-btn {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    background: white;
    color: #6b7280;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }

  .tab-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .chart-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .legend-title {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
  }

  .chart-container {
    height: 300px;
    margin-top: 20px;
  }

  .subgroup-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .subgroup-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .main-chart {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 160px;
    justify-content: flex-end;
  }

  .chart-bar-large {
    border-radius: 4px;
    overflow: hidden;
    margin: 0 auto;
    transition: all 0.3s ease;
  }

  .chart-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    margin-top: 8px;
    text-align: center;
  }

  .subgroup-info {
    text-align: center;
  }

  .subgroup-name {
    font-size: 16px;
    font-weight: 600;
    color: #666666;
    margin-bottom: 8px;
  }

  .member-count {
    font-size: 14px;
    color: #999999;
    margin-bottom: 8px;
  }

  .attendance-rate {
    font-size: 24px;
    font-weight: bold;
    color: #6366f1;
    margin-bottom: 4px;
  }

  .rate-label {
    font-size: 14px;
    color: #999999;
    margin-bottom: 8px;
  }

  .rate-change {
    margin-top: 8px;
    display: flex;
    justify-content: center;
  }

  .change-indicator.positive {
    color: #10b981;
  }

  .change-indicator.negative {
    color: #ef4444;
  }

  .filter-controls {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .filter-select {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
    background: white;
    min-width: 120px;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .member-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .member-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .member-info {
    flex: 1;
  }

  .member-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .member-details {
    font-size: 14px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .member-subgroup {
    background: #dbeafe;
    color: #1e40af;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .detail-separator {
    color: #d1d5db;
    margin: 0 4px;
  }

  .detail-text {
    color: #6b7280;
  }

  .member-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .detail-btn {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .detail-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  .absence-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .weeks-1 {
    background: #dbeafe;
    color: #1e40af;
  }

  .weeks-2 {
    background: #fef3c7;
    color: #d97706;
  }

  .weeks-3 {
    background: #fed7d7;
    color: #c53030;
  }

  .weeks-4 {
    background: #fecaca;
    color: #dc2626;
  }

  .phone-number {
    font-size: 14px;
    color: #6b7280;
    font-family: monospace;
    min-width: 120px;
    text-align: right;
  }

  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: row;
      align-items: center;
      gap: 0;
    }

    .metrics-row {
      grid-template-columns: repeat(2, 1fr);
    }

    .subgroup-cards {
      grid-template-columns: 1fr;
    }

    .chart-controls {
      flex-direction: column;
      align-items: flex-start;
    }

    .legend {
      justify-content: flex-start;
    }
  }

  .metric-number-with-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .warning-icon {
    color: #ffc107;
    font-size: 20px;
  }

  .metric-number {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #4285f4;
    line-height: 1.2;
  }

  .date-search-section {
    background: white;
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  .date-search-container {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-start;
  }

  .date-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .date-label {
    font-size: 13px;
    color: #666666;
    font-weight: 500;
    white-space: nowrap;
  }

  .date-separator {
    font-size: 16px;
    color: #666666;
    margin: 0 8px;
  }

  .date-input-wrapper {
    position: relative;
  }

  .date-input-styled {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    color: #333333;
    min-width: 150px;
    outline: none;
    transition: all 0.2s ease;
    height: 40px;
  }

  .date-input-styled:focus {
    border-color: #4285f4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
  }

  .search-button-styled {
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 70px;
    height: 40px;
  }

  .search-button-styled:hover {
    background: #3367d6;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }

  .modal-body {
    padding: 20px;
  }

  .member-detail-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-item {
    flex: 1;
  }

  .detail-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
  }

  .detail-value {
    font-size: 14px;
    color: #333333;
  }

  .memo-section {
    display: flex;
    flex-direction: column;
  }

  .memo-content {
    font-size: 14px;
    color: #6b7280;
  }

  /* 예배 종류 체크박스 스타일 */
  .worship-checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .worship-checkbox-item:hover {
    background-color: #f3f4f6;
  }

  .checkbox-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .worship-checkbox {
    display: none;
  }

  .checkmark {
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background-color: transparent;
  }

  .checkmark:hover {
    border-color: #9ca3af;
  }

  .check-icon {
    color: white;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
  }

  .worship-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    user-select: none;
  }

  .legend-items {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
