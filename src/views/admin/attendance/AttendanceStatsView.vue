<template>
  <div class="attendance-stats">
    <!-- 조직별 출결 테이블 -->
    <v-card class="neumorphic mb-4">
      <v-card-title>
        <v-icon left color="primary">mdi-account-group</v-icon>
        조직별 출결 현황
      </v-card-title>
      <v-card-subtitle>조직의 출결 데이터를 표시합니다.</v-card-subtitle>
      <v-data-table
        :headers="organizationHeaders"
        :items="attendanceDataByOrg"
        :loading="loading"
        :items-per-page="15"
        class="elevation-0"
      >
        <template v-slot:no-data>
          <div class="text-center pa-5">
            <v-icon large color="info" class="mb-2">mdi-information</v-icon>
            <div>데이터가 없습니다.</div>
          </div>
        </template>
        <template v-slot:loading>
          <div class="text-center pa-5">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
            <div class="mt-2">데이터를 불러오는 중입니다...</div>
          </div>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.organization_name }}</td>
            <td>
              <span
                :class="
                  item.sunday_service_2
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.sunday_service_2 ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.sunday_service_3
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.sunday_service_3 ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.youth_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.youth_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.wednesday_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.wednesday_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.friday_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.friday_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.wednesday_prayer
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.wednesday_prayer ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.healing_ministry
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.healing_ministry ? "O" : "X" }}</span
              >
            </td>
            <td>{{ item.attendance_rate }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- 개인별 출결 테이블 -->
    <v-card class="neumorphic mb-4">
      <v-card-title>
        <v-icon left color="primary">mdi-account</v-icon>
        개인별 출결 현황
      </v-card-title>
      <v-card-subtitle>구성원 개인별 출결 데이터를 표시합니다.</v-card-subtitle>
      <v-data-table
        :headers="memberHeaders"
        :items="attendanceDataByMember"
        :loading="loading"
        :items-per-page="15"
        class="elevation-0"
      >
        <template v-slot:no-data>
          <div class="text-center pa-5">
            <v-icon large color="info" class="mb-2">mdi-information</v-icon>
            <div>데이터가 없습니다.</div>
          </div>
        </template>
        <template v-slot:loading>
          <div class="text-center pa-5">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
            <div class="mt-2">데이터를 불러오는 중입니다...</div>
          </div>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.member_name }}</td>
            <td>{{ item.organization_name }}</td>
            <td>
              <span
                :class="
                  item.sunday_service_2
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.sunday_service_2 ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.sunday_service_3
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.sunday_service_3 ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.youth_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.youth_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.wednesday_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.wednesday_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.friday_service
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.friday_service ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.wednesday_prayer
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.wednesday_prayer ? "O" : "X" }}</span
              >
            </td>
            <td>
              <span
                :class="
                  item.healing_ministry
                    ? 'attendance-present'
                    : 'attendance-absent'
                "
                >{{ item.healing_ministry ? "O" : "X" }}</span
              >
            </td>
            <td>{{ item.attendance_rate }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";

export default {
  name: "AdminAttendanceStats",
  mixins: [MasterCtrl, OrganizationCtrl, AttendanceCtrl],
  data() {
    return {
      loading: false,
      selectedOrganization: null,

      // 조직별 출결 헤더 (O/X 표시용)
      organizationHeaders: [
        { text: "조직명", value: "organization_name", align: "start" },
        { text: "주일2부예배", value: "sunday_service_2" },
        { text: "주일3부예배", value: "sunday_service_3" },
        { text: "청년예배", value: "youth_service" },
        { text: "수요예배", value: "wednesday_service" },
        { text: "금요예배", value: "friday_service" },
        { text: "수요제자기도회", value: "wednesday_prayer" },
        { text: "현장치유팀사역", value: "healing_ministry" },
        { text: "출석률", value: "attendance_rate" },
      ],

      // 개인별 출결 헤더
      memberHeaders: [
        { text: "이름", value: "member_name", align: "start" },
        { text: "소속", value: "organization_name" },
        { text: "주일2부예배", value: "sunday_service_2" },
        { text: "주일3부예배", value: "sunday_service_3" },
        { text: "청년예배", value: "youth_service" },
        { text: "수요예배", value: "wednesday_service" },
        { text: "금요예배", value: "friday_service" },
        { text: "수요제자기도회", value: "wednesday_prayer" },
        { text: "현장치유팀사역", value: "healing_ministry" },
        { text: "출석률", value: "attendance_rate" },
      ],

      // 테스트 데이터
      attendanceDataByOrg: [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          sunday_service_2: true,
          sunday_service_3: false,
          youth_service: true,
          wednesday_service: true,
          friday_service: false,
          wednesday_prayer: true,
          healing_ministry: false,
          attendance_rate: "71.4%",
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          sunday_service_2: true,
          sunday_service_3: true,
          youth_service: false,
          wednesday_service: true,
          friday_service: true,
          wednesday_prayer: false,
          healing_ministry: true,
          attendance_rate: "71.4%",
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          sunday_service_2: false,
          sunday_service_3: true,
          youth_service: true,
          wednesday_service: false,
          friday_service: true,
          wednesday_prayer: true,
          healing_ministry: false,
          attendance_rate: "57.1%",
        },
      ],

      attendanceDataByMember: [
        {
          id: 1,
          member_name: "홍길동",
          organization_name: "코람데오_1국_1팀",
          sunday_service_2: true,
          sunday_service_3: false,
          youth_service: true,
          wednesday_service: true,
          friday_service: false,
          wednesday_prayer: true,
          healing_ministry: false,
          attendance_rate: "57.1%",
        },
        {
          id: 2,
          member_name: "김철수",
          organization_name: "코람데오_1국_1팀",
          sunday_service_2: true,
          sunday_service_3: true,
          youth_service: false,
          wednesday_service: true,
          friday_service: true,
          wednesday_prayer: false,
          healing_ministry: true,
          attendance_rate: "71.4%",
        },
        {
          id: 3,
          member_name: "이영희",
          organization_name: "코람데오_2국",
          sunday_service_2: false,
          sunday_service_3: true,
          youth_service: true,
          wednesday_service: false,
          friday_service: true,
          wednesday_prayer: true,
          healing_ministry: false,
          attendance_rate: "57.1%",
        },
        {
          id: 4,
          member_name: "박지성",
          organization_name: "코람데오_3국",
          sunday_service_2: true,
          sunday_service_3: false,
          youth_service: true,
          wednesday_service: true,
          friday_service: false,
          wednesday_prayer: false,
          healing_ministry: true,
          attendance_rate: "57.1%",
        },
      ],
    };
  },
  created() {
    // 기본 테스트 데이터 사용
  },
};
</script>

<style scoped>
.attendance-stats {
  padding: 16px;
}

.neumorphic {
  border-radius: 16px;
  background: #f0f2f5;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  border: none;
}

/* O/X 표시 스타일 */
.v-data-table ::v-deep tbody tr td:not(:first-child) {
  text-align: center;
}

/* O 표시 스타일 */
.attendance-present {
  color: #4caf50;
  font-weight: bold;
}

/* X 표시 스타일 */
.attendance-absent {
  color: #f44336;
  font-weight: bold;
}

/* 헤더 스타일 */
.v-data-table ::v-deep th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: bold;
}

/* 테이블 짝수/홀수 행 스타일 */
.v-data-table ::v-deep tbody tr:nth-child(even) {
  background-color: #f9fafc;
}

/* 카드 스타일 */
.v-card-title {
  font-weight: bold;
  color: #2c3e50;
}

.v-card-subtitle {
  color: #7f8c8d;
}

/* 버튼 스타일링 */
.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 600;
}
</style>
