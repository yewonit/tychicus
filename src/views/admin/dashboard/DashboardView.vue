<template>
  <div class="dashboard">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4 neumorphic">
          <v-card-title class="headline d-flex align-center">
            <v-icon left size="36" class="mr-2 primary--text"
              >mdi-view-dashboard</v-icon
            >
            출결 현황
          </v-card-title>
          <v-card-subtitle>코람데오 출결플랫폼 대시보드</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- 총 재적 인원 -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4 neumorphic">
          <v-card-title class="subtitle-1 font-weight-bold d-flex align-center">
            <v-icon left class="primary--text">mdi-account-group</v-icon>
            총 재적 인원
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <div class="text-center neumorphic-inset pa-4 rounded-lg">
                  <div class="text-subtitle-1 font-weight-bold mb-2">총원</div>
                  <div class="text-h2 primary--text">{{ totalMembers }}</div>
                  <div class="text-caption">
                    전주 대비 <span class="success--text">+5명</span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center neumorphic-inset pa-4 rounded-lg">
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    새가족
                  </div>
                  <div class="text-h2 primary--text">{{ newMembers }}</div>
                  <div class="text-caption">
                    전주 대비 <span class="success--text">+2명</span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center neumorphic-inset pa-4 rounded-lg">
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    단결자(2주 이내)
                  </div>
                  <div class="text-h2 warning--text">
                    {{ shortTermAbsentees }}
                  </div>
                  <div class="text-caption">
                    전주 대비 <span class="error--text">+3명</span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center neumorphic-inset pa-4 rounded-lg">
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    장결자(3주 이상)
                  </div>
                  <div class="text-h2 error--text">{{ longTermAbsentees }}</div>
                  <div class="text-caption">
                    전주 대비 <span class="warning--text">-1명</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mb-4 neumorphic h-100">
          <v-card-title class="subtitle-1 font-weight-bold d-flex align-center">
            <v-icon left class="warning--text">mdi-account-alert</v-icon>
            단결자 리스트
            <v-spacer></v-spacer>
            <v-btn small text color="primary" class="px-0">
              전체보기 <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="(member, index) in absenteesList"
                :key="index"
                class="neumorphic-inset rounded-lg mb-2"
              >
                <v-list-item-avatar class="my-0">
                  <v-img :src="member.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{
                    member.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    최종출석일자: {{ member.lastAttendance }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    small
                    outlined
                    rounded
                    color="primary"
                    class="neumorphic-btn"
                  >
                    심방기록
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 금주 출석률 통계 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4 neumorphic">
          <v-card-title class="subtitle-1 font-weight-bold d-flex align-center">
            <v-icon left class="success--text">mdi-chart-bar</v-icon>
            금주 출석률 통계
            <v-spacer></v-spacer>
            <v-chip small outlined color="primary" class="mr-2"
              >2024년 3월 1주</v-chip
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      금주 대예배 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ weeklyAttendance.mainService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      전주 대비 <span class="success--text">+5%</span>
                    </div>
                    <v-progress-linear
                      :value="weeklyAttendance.mainService"
                      color="primary"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      금주 청년예배 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ weeklyAttendance.youthService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      전주 대비 <span class="success--text">+3%</span>
                    </div>
                    <v-progress-linear
                      :value="weeklyAttendance.youthService"
                      color="primary"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      금주 수제기 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ weeklyAttendance.wednesdayService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      전주 대비 <span class="error--text">-2%</span>
                    </div>
                    <v-progress-linear
                      :value="weeklyAttendance.wednesdayService"
                      color="primary"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      금주 전체일 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ weeklyAttendance.total }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      전주 대비 <span class="success--text">+2%</span>
                    </div>
                    <v-progress-linear
                      :value="weeklyAttendance.total"
                      color="primary"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-6">
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      평균 대예배 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ averageAttendance.mainService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      지난달 대비 <span class="success--text">+2%</span>
                    </div>
                    <v-progress-linear
                      :value="averageAttendance.mainService"
                      color="success"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      평균 청년예배 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ averageAttendance.youthService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      지난달 대비 <span class="success--text">+1%</span>
                    </div>
                    <v-progress-linear
                      :value="averageAttendance.youthService"
                      color="success"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      평균 수제기 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ averageAttendance.wednesdayService }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      지난달 대비 <span class="warning--text">0%</span>
                    </div>
                    <v-progress-linear
                      :value="averageAttendance.wednesdayService"
                      color="success"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="text-center">
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      평균 전체 출석률
                    </div>
                    <div class="d-flex align-center justify-center">
                      <span class="text-h2 primary--text"
                        >{{ averageAttendance.total }}%</span
                      >
                    </div>
                    <div class="text-caption">
                      지난달 대비 <span class="success--text">+1%</span>
                    </div>
                    <v-progress-linear
                      :value="averageAttendance.total"
                      color="success"
                      height="8"
                      rounded
                      class="mt-2"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 출석지표 및 재적인원 추이 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4 neumorphic">
          <v-card-title class="subtitle-1 font-weight-bold d-flex align-center">
            <v-icon left class="info--text">mdi-chart-line</v-icon>
            출석지표 및 재적인원 추이
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="chartPeriod"
              mandatory
              dense
              class="neumorphic-toggle"
            >
              <v-btn small value="week">주간</v-btn>
              <v-btn small value="month">월간</v-btn>
              <v-btn small value="year">연간</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="text-center text-subtitle-1 font-weight-bold mb-2">
                  최근 기록
                </div>
                <div class="neumorphic-inset rounded-lg pa-4">
                  <v-simple-table class="transparent">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">구분</th>
                          <th class="text-left">날짜</th>
                          <th class="text-center">인원</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(record, index) in recentRecords"
                          :key="index"
                        >
                          <td>{{ record.category }}</td>
                          <td>{{ record.date }}</td>
                          <td class="text-center">
                            <span
                              :class="
                                record.change > 0
                                  ? 'success--text'
                                  : record.change < 0
                                  ? 'error--text'
                                  : ''
                              "
                            >
                              {{ record.count }}
                              <v-icon
                                x-small
                                v-if="record.change > 0"
                                class="success--text"
                                >mdi-arrow-up</v-icon
                              >
                              <v-icon
                                x-small
                                v-if="record.change < 0"
                                class="error--text"
                                >mdi-arrow-down</v-icon
                              >
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-col>
              <v-col cols="12" md="8">
                <div class="text-center text-subtitle-1 font-weight-bold mb-2">
                  재적인원 추이
                </div>
                <div class="neumorphic-inset rounded-lg pa-4">
                  <div class="d-flex align-center mb-2">
                    <div class="d-flex align-center mr-4">
                      <v-icon small color="primary" class="mr-1"
                        >mdi-checkbox-blank</v-icon
                      >
                      <span class="caption">총원</span>
                    </div>
                    <div class="d-flex align-center mr-4">
                      <v-icon small color="success" class="mr-1"
                        >mdi-checkbox-blank</v-icon
                      >
                      <span class="caption">출석</span>
                    </div>
                    <div class="d-flex align-center mr-4">
                      <v-icon small color="info" class="mr-1"
                        >mdi-checkbox-blank</v-icon
                      >
                      <span class="caption">새가족</span>
                    </div>
                    <div class="d-flex align-center mr-4">
                      <v-icon small color="warning" class="mr-1"
                        >mdi-checkbox-blank</v-icon
                      >
                      <span class="caption">단결자</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon small color="error" class="mr-1"
                        >mdi-checkbox-blank</v-icon
                      >
                      <span class="caption">장결자</span>
                    </div>
                  </div>
                  <v-sheet height="300" class="transparent">
                    <v-chart :option="chartOption" autoresize />
                  </v-sheet>
                  <div class="d-flex justify-space-between mt-2">
                    <span
                      class="caption"
                      v-for="(label, index) in chartLabels"
                      :key="index"
                      >{{ label }}</span
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
]);

export default {
  name: "AdminDashboard",
  components: {
    VChart,
  },
  mixins: [MasterCtrl, OrganizationCtrl],
  data() {
    return {
      // 더미 데이터
      totalMembers: 120,
      newMembers: 8,
      shortTermAbsentees: 12,
      longTermAbsentees: 15,
      chartPeriod: "month",

      // 출석률 데이터
      weeklyAttendance: {
        mainService: 78,
        youthService: 65,
        wednesdayService: 52,
        total: 65,
      },

      averageAttendance: {
        mainService: 75,
        youthService: 62,
        wednesdayService: 50,
        total: 62,
      },

      // 단결자 리스트
      absenteesList: [
        {
          name: "홍길동",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          lastAttendance: "2024.02.25",
        },
        {
          name: "김철수",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          lastAttendance: "2024.02.18",
        },
        {
          name: "이영희",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          lastAttendance: "2024.02.25",
        },
      ],

      // 최근 기록
      recentRecords: [
        { category: "총원", date: "24.3.7 (일)", count: 120, change: 5 },
        { category: "새가족", date: "24.3.7 (일)", count: 8, change: 2 },
        { category: "단결자", date: "24.3.7 (일)", count: 12, change: 3 },
        { category: "장결자", date: "24.3.7 (일)", count: 15, change: -1 },
      ],

      // 차트 라벨
      chartLabels: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
      ],

      // 조직 정보 관련 변수 추가
      organizations: [],
      organizationTree: [],
      cachedOrganizations: null,
      organizationCacheExpiry: null,
      organizationCacheDuration: 30 * 60 * 1000, // 30분 캐시 지속 시간
    };
  },
  computed: {
    chartOption() {
      return {
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br/>{a}: {c}",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.chartLabels,
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            color: "#666",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            color: "#666",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0,0,0,0.05)",
            },
          },
        },
        series: [
          {
            name: "총원",
            type: "line",
            data: [100, 105, 110, 115, 120, 118, 120, 125, 130],
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#1976d2",
            },
            itemStyle: {
              color: "#1976d2",
            },
          },
          {
            name: "출석",
            type: "line",
            data: [80, 85, 88, 90, 95, 92, 94, 98, 100],
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#4caf50",
            },
            itemStyle: {
              color: "#4caf50",
            },
          },
          {
            name: "새가족",
            type: "line",
            data: [2, 4, 6, 5, 8, 7, 8, 9, 10],
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#2196f3",
            },
            itemStyle: {
              color: "#2196f3",
            },
          },
          {
            name: "단결자",
            type: "line",
            data: [10, 12, 14, 13, 12, 14, 13, 12, 10],
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#ff9800",
            },
            itemStyle: {
              color: "#ff9800",
            },
          },
          {
            name: "장결자",
            type: "line",
            data: [18, 17, 16, 17, 15, 16, 15, 14, 15],
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#f44336",
            },
            itemStyle: {
              color: "#f44336",
            },
          },
        ],
      };
    },
  },
  created() {
    // 페이지 로드 시 조직 정보 가져오기
    this.fetchOrganizationsOnly();
  },
  methods: {
    // 조직 정보만 불러오는 메서드
    async fetchOrganizationsOnly() {
      try {
        console.log("조직 정보를 가져오는 중...");

        // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
        const now = new Date().getTime();
        if (
          this.cachedOrganizations &&
          this.organizationCacheExpiry &&
          now < this.organizationCacheExpiry
        ) {
          this.organizations = this.cachedOrganizations;
          console.log("캐시된 조직 정보 사용:", this.organizations);

          // 조직 트리 구성
          this.organizationTree = this.buildOrganizationTree(
            this.organizations
          );
          console.log("조직 트리:", this.organizationTree);

          return;
        }

        // API에서 조직 정보 가져오기
        const response = await this.getAllOrganizations(true);
        console.log("API 응답:", response);

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

        // 각 조직의 멤버 수 초기화
        organizations.forEach((org) => {
          org.memberCount = 0;
        });

        // 모든 조직 데이터 사용
        this.organizations = organizations;
        console.log("조직 정보:", this.organizations);

        // 조직 데이터 캐싱
        this.cachedOrganizations = JSON.parse(JSON.stringify(organizations)); // 깊은 복사
        this.organizationCacheExpiry =
          new Date().getTime() + this.organizationCacheDuration;

        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);
        console.log("조직 트리:", this.organizationTree);
      } catch (error) {
        console.error("조직 정보 가져오기 오류:", error);
        // 오류 발생 시 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();
        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);
        console.log("더미 조직 정보 사용:", this.organizations);
      }
    },

    // 조직 트리 구성 메서드
    buildOrganizationTree(organizations) {
      if (
        !organizations ||
        !Array.isArray(organizations) ||
        organizations.length === 0
      ) {
        return [];
      }

      const tree = [];
      const organizationMap = new Map();

      // 조직 객체를 맵에 저장
      for (const org of organizations) {
        try {
          if (!org || !org.id) {
            continue;
          }

          // API 응답 필드 매핑 (organization_description -> description)
          const mappedOrg = {
            ...org,
            description: org.organization_description || org.description || "",
            children: [],
            // 최하위 조직 여부를 저장할 속성 추가
            isLeafNode: true,
          };
          organizationMap.set(org.id, mappedOrg);
        } catch (error) {
          console.error("조직 데이터 매핑 중 오류 발생:", error);
        }
      }

      // 조직 객체를 트리 구조로 변환
      for (const org of organizations) {
        try {
          if (!org || !org.id) continue;

          if (!org.upper_organization_id) {
            // 상위 조직이 없는 경우 최상위 조직으로 추가
            tree.push(organizationMap.get(org.id));
          } else {
            // 상위 조직이 있는 경우
            const parent = organizationMap.get(org.upper_organization_id);
            if (parent) {
              // 부모 조직이 있으면 부모는 최하위 노드가 아님
              parent.isLeafNode = false;
              parent.children.push(organizationMap.get(org.id));
            } else {
              // 상위 조직ID가 있지만 맵에 없는 경우 최상위로 처리
              tree.push(organizationMap.get(org.id));
            }
          }
        } catch (error) {
          console.error("조직 트리 구성 중 오류 발생:", error);
        }
      }

      // 트리가 비어있으면 모든 조직을 최상위로 처리
      if (tree.length === 0) {
        for (const [, org] of organizationMap.entries()) {
          tree.push(org);
        }
      }

      return tree;
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
  },
};
</script>

<style scoped>
.dashboard {
  padding: 16px;
  background-color: #f0f2f5;
}

.neumorphic {
  border-radius: 16px;
  background: #f0f2f5;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  border: none;
}

.neumorphic-inset {
  border-radius: 16px;
  background: #f0f2f5;
  box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
  border: none;
}

.neumorphic-btn {
  border-radius: 8px;
  background: #f0f2f5;
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
  border: none;
  transition: all 0.2s ease;
}

.neumorphic-btn:hover {
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
}

.neumorphic-toggle {
  border-radius: 8px;
  background: #f0f2f5;
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
  overflow: hidden;
}

.transparent {
  background-color: transparent !important;
}

.v-card__title {
  padding: 20px 24px;
}

.v-card__text {
  padding: 24px;
}

.primary--text {
  color: #1976d2 !important;
}

.success--text {
  color: #4caf50 !important;
}

.warning--text {
  color: #ff9800 !important;
}

.error--text {
  color: #f44336 !important;
}

.info--text {
  color: #2196f3 !important;
}

.v-divider {
  margin: 0 24px;
}

.v-progress-linear {
  border-radius: 4px;
}
</style>
