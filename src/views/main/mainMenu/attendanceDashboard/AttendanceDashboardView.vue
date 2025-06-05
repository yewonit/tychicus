<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- 헤더 -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          [나의 그룹] 출석 현황 대시보드
        </h1>
        <p class="text-gray-500 mt-1">{{ groupData.name }} 그룹장님</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-base font-medium text-gray-700">기간:</span>
        <select
          v-model="period"
          class="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
        >
          <option value="1">최근 1주</option>
          <option value="2">최근 2주</option>
          <option value="3">최근 3주</option>
          <option value="4">최근 4주</option>
        </select>
      </div>
    </div>

    <!-- 핵심 현황 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <div class="text-sm font-medium text-gray-600 mb-2">
          그룹 평균 출석률
        </div>
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">{{ groupData.attendanceRate }}%</div>
          <div :class="attendanceRateChangeClass">
            <svg
              v-if="groupData.attendanceRate > groupData.previousAttendanceRate"
              class="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              class="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M12 5v14M19 12l-7 7-7-7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-sm font-medium">
              {{
                Math.abs(
                  groupData.attendanceRate - groupData.previousAttendanceRate
                ).toFixed(1)
              }}%
            </span>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">이전 동일 기간 대비</p>
      </div>

      <div
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <div class="text-sm font-medium text-gray-600 mb-2">그룹 재적 인원</div>
        <div class="flex items-center">
          <svg
            class="h-5 w-5 mr-2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="9"
              cy="7"
              r="4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23 21v-2a4 4 0 0 0-3-3.87"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="16"
              cy="3"
              r="4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="text-2xl font-bold">{{ groupData.totalMembers }}명</div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <div class="text-sm font-medium text-gray-600 mb-2">평균 출석 인원</div>
        <div class="text-2xl font-bold">
          {{ groupData.averageAttendance }}명
        </div>
        <p class="text-xs text-gray-500 mt-1">최근 {{ period }}주 평균</p>
      </div>

      <div
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <div class="text-sm font-medium text-gray-600 mb-2">연속 결석 순원</div>
        <div class="flex items-center">
          <svg
            class="h-5 w-5 mr-2 text-amber-500"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="16"
              r="1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="text-2xl font-bold">
            {{ groupData.consecutiveAbsentees }}명
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">2주 이상 연속 결석</p>
      </div>
    </div>

    <!-- 출석률 주간 추이 차트 -->
    <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div class="mb-4">
        <h3 class="text-lg font-semibold">우리 그룹 출석률 주간 추이</h3>
        <p class="text-gray-600">최근 {{ period }}주간 출석률 변화 추이</p>
      </div>
      <div class="h-80">
        <canvas ref="weeklyChart"></canvas>
      </div>
    </div>

    <!-- 순별 비교 -->
    <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div class="mb-4">
        <h3 class="text-lg font-semibold">우리 그룹 내 순별 비교</h3>
        <p class="text-gray-600">최근 {{ period }}주간 순별 출석 현황</p>
      </div>

      <div class="mb-4">
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            @click="chartTab = 'bar'"
            :class="chartTab === 'bar' ? 'bg-white shadow' : ''"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
          >
            순별 평균 출석률
          </button>
          <button
            @click="chartTab = 'line'"
            :class="chartTab === 'line' ? 'bg-white shadow' : ''"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
          >
            순별 주간 추이
          </button>
        </div>
      </div>

      <div class="h-80 mb-6">
        <canvas v-if="chartTab === 'bar'" ref="subgroupBarChart"></canvas>
        <canvas v-if="chartTab === 'line'" ref="subgroupLineChart"></canvas>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="py-3 px-4 font-semibold">순 이름</th>
              <th class="py-3 px-4 font-semibold">재적인원</th>
              <th class="py-3 px-4 font-semibold">평균 출석률</th>
              <th class="py-3 px-4 font-semibold">이전 대비</th>
              <th class="py-3 px-4 font-semibold">연속 결석자</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="subgroup in groupData.subgroups"
              :key="subgroup.name"
              @click="selectedSubgroup = subgroup.name"
              class="border-b hover:bg-gray-100 cursor-pointer"
            >
              <td class="py-3 px-4 font-medium">{{ subgroup.name }}</td>
              <td class="py-3 px-4">{{ subgroup.members }}명</td>
              <td class="py-3 px-4">{{ subgroup.attendanceRate }}%</td>
              <td class="py-3 px-4">
                <div
                  :class="
                    subgroup.attendanceRate > subgroup.previousRate
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  "
                  class="flex items-center"
                >
                  <svg
                    v-if="subgroup.attendanceRate > subgroup.previousRate"
                    class="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 19V5M5 12l7-7 7 7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 5v14M19 12l-7 7-7-7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>
                    {{
                      Math.abs(subgroup.attendanceRate - subgroup.previousRate)
                    }}%
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">{{ subgroup.consecutiveAbsentees }}명</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 관심 순원 목록 -->
    <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div class="flex flex-row items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold">관심 순원 목록</h3>
          <p class="text-gray-600">출석률이 낮거나 연속 결석 중인 순원</p>
        </div>
        <select
          v-model="selectedSubgroup"
          class="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
        >
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

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="py-3 px-4 font-semibold">순원 이름</th>
              <th class="py-3 px-4 font-semibold">소속 순</th>
              <th class="py-3 px-4 font-semibold">최근 출석일</th>
              <th class="py-3 px-4 font-semibold">연속 결석</th>
              <th class="py-3 px-4 font-semibold">출석 횟수</th>
              <th class="py-3 px-4 font-semibold">연락처</th>
              <th class="py-3 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in filteredMembers"
              :key="member.name"
              class="border-b hover:bg-gray-100 cursor-pointer"
            >
              <td class="py-3 px-4 font-medium">{{ member.name }}</td>
              <td class="py-3 px-4">{{ member.subgroup }}</td>
              <td class="py-3 px-4">{{ member.lastAttendance }}</td>
              <td class="py-3 px-4">
                <span
                  :class="getBadgeClass(member.consecutiveAbsences)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ member.consecutiveAbsences }}주
                </span>
              </td>
              <td class="py-3 px-4">{{ member.attendanceCount }}</td>
              <td class="py-3 px-4">{{ member.phone }}</td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button
                    @click="callMember(member.phone)"
                    class="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    title="전화하기"
                  >
                    <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.73 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.36 2.01.6 3.06.73A2 2 0 0 1 22 16.92z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    @click="showMemberDetail(member)"
                    class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  >
                    상세
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 순원 상세 모달 -->
    <div
      v-if="selectedMember"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      @click="selectedMember = null"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold">
            {{ selectedMember.name }} 순원 정보
          </h3>
          <p class="text-gray-600">{{ selectedMember.subgroup }} 소속</p>
        </div>
        <div class="space-y-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-1">
                최근 출석일
              </h4>
              <p>{{ selectedMember.lastAttendance }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-1">연속 결석</h4>
              <p>{{ selectedMember.consecutiveAbsences }}주</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-1">출석 횟수</h4>
              <p>{{ selectedMember.attendanceCount }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-1">연락처</h4>
              <p>{{ selectedMember.phone }}</p>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-600 mb-1">메모</h4>
            <p class="text-sm text-gray-600">
              최근 건강 문제로 교회 참석이 어려운 상황입니다. 지난 심방 시 기도
              요청이 있었습니다.
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            심방 기록
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            연락하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import Chart from "chart.js/auto";

// 반응형 데이터
const period = ref("1");
const selectedSubgroup = ref("all");
const selectedMember = ref(null);
const chartTab = ref("bar");

// 차트 참조
const weeklyChart = ref(null);
const subgroupBarChart = ref(null);
const subgroupLineChart = ref(null);

// 차트 인스턴스
let weeklyChartInstance = null;
let barChartInstance = null;
let lineChartInstance = null;

// 샘플 데이터
const groupData = {
  name: "믿음 그룹",
  totalMembers: 24,
  averageAttendance: 19,
  attendanceRate: 79.2,
  previousAttendanceRate: 75.5,
  consecutiveAbsentees: 3,
  weeklyData: [
    { week: "1주 전", attendanceRate: 75 },
    { week: "2주 전", attendanceRate: 79 },
    { week: "3주 전", attendanceRate: 83 },
    { week: "4주 전", attendanceRate: 80 },
  ],
  subgroups: [
    {
      name: "순1",
      members: 8,
      attendanceRate: 85,
      previousRate: 80,
      consecutiveAbsentees: 1,
      weeklyData: [
        { week: "1주 전", attendanceRate: 81 },
        { week: "2주 전", attendanceRate: 88 },
        { week: "3주 전", attendanceRate: 88 },
        { week: "4주 전", attendanceRate: 83 },
      ],
    },
    {
      name: "순2",
      members: 9,
      attendanceRate: 78,
      previousRate: 81,
      consecutiveAbsentees: 1,
      weeklyData: [
        { week: "1주 전", attendanceRate: 78 },
        { week: "2주 전", attendanceRate: 78 },
        { week: "3주 전", attendanceRate: 83 },
        { week: "4주 전", attendanceRate: 73 },
      ],
    },
    {
      name: "순3",
      members: 7,
      attendanceRate: 74,
      previousRate: 65,
      consecutiveAbsentees: 1,
      weeklyData: [
        { week: "1주 전", attendanceRate: 65 },
        { week: "2주 전", attendanceRate: 71 },
        { week: "3주 전", attendanceRate: 79 },
        { week: "4주 전", attendanceRate: 81 },
      ],
    },
  ],
  membersOfConcern: [
    {
      name: "김성실",
      subgroup: "순1",
      lastAttendance: "2024-04-28",
      consecutiveAbsences: 2,
      attendanceCount: "2/4",
      phone: "010-1234-5678",
    },
    {
      name: "이믿음",
      subgroup: "순2",
      lastAttendance: "2024-04-21",
      consecutiveAbsences: 3,
      attendanceCount: "1/4",
      phone: "010-2345-6789",
    },
    {
      name: "박소망",
      subgroup: "순3",
      lastAttendance: "2024-05-05",
      consecutiveAbsences: 1,
      attendanceCount: "3/4",
      phone: "010-3456-7890",
    },
    {
      name: "최사랑",
      subgroup: "순3",
      lastAttendance: "2024-04-14",
      consecutiveAbsences: 4,
      attendanceCount: "0/4",
      phone: "010-4567-8901",
    },
  ],
};

// 계산된 속성
const attendanceRateChangeClass = computed(() => {
  return groupData.attendanceRate > groupData.previousAttendanceRate
    ? "flex items-center text-emerald-500"
    : "flex items-center text-rose-500";
});

const filteredMembers = computed(() => {
  return selectedSubgroup.value === "all"
    ? groupData.membersOfConcern
    : groupData.membersOfConcern.filter(
        (member) => member.subgroup === selectedSubgroup.value
      );
});

// 메서드
const getBadgeClass = (consecutiveAbsences) => {
  if (consecutiveAbsences >= 3) {
    return "bg-red-100 text-red-800";
  } else if (consecutiveAbsences >= 2) {
    return "bg-amber-100 text-amber-800";
  } else {
    return "bg-gray-100 text-gray-800";
  }
};

const callMember = (phone) => {
  window.location.href = `tel:${phone}`;
};

const showMemberDetail = (member) => {
  selectedMember.value = member;
};

const createWeeklyChart = () => {
  if (weeklyChartInstance) {
    weeklyChartInstance.destroy();
  }

  const ctx = weeklyChart.value.getContext("2d");
  weeklyChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: groupData.weeklyData.map((d) => d.week),
      datasets: [
        {
          label: "그룹 전체",
          data: groupData.weeklyData.map((d) => d.attendanceRate),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          borderWidth: 3,
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
        },
      },
    },
  });
};

const createSubgroupBarChart = () => {
  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const ctx = subgroupBarChart.value.getContext("2d");
  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: groupData.subgroups.map((s) => s.name),
      datasets: [
        {
          label: "출석률",
          data: groupData.subgroups.map((s) => s.attendanceRate),
          backgroundColor: "#3b82f6",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
};

const createSubgroupLineChart = () => {
  if (lineChartInstance) {
    lineChartInstance.destroy();
  }

  const ctx = subgroupLineChart.value.getContext("2d");
  lineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: groupData.weeklyData.map((d) => d.week),
      datasets: [
        {
          label: "순1",
          data: groupData.subgroups[0].weeklyData.map((d) => d.attendanceRate),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "순2",
          data: groupData.subgroups[1].weeklyData.map((d) => d.attendanceRate),
          borderColor: "#10b981",
          backgroundColor: "#10b981",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "순3",
          data: groupData.subgroups[2].weeklyData.map((d) => d.attendanceRate),
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
        },
      },
    },
  });
};

// 라이프사이클
onMounted(async () => {
  await nextTick();
  createWeeklyChart();
  createSubgroupBarChart();
});

// 차트 탭 변경 감시
watch(chartTab, async (newTab) => {
  await nextTick();
  if (newTab === "bar") {
    createSubgroupBarChart();
  } else {
    createSubgroupLineChart();
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
