<template>
  <v-container class="meeting-detail-view" v-if="isDataLoaded">
    <!-- 이미지 카드 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6 wc-card wc-card-hover">
          <v-img
            :src="meetingImageUrl"
            height="200"
            class="meeting-image"
          ></v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- 기본 정보 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6 wc-card wc-card-hover">
          <v-card-title class="wc-h2 wc-card-title">기본 정보</v-card-title>
          <v-card-text>
            <p class="wc-body-1 wc-text-primary">
              <strong>모임 이름:</strong> {{ meetingData.activityName }}
            </p>
            <p class="wc-body-1 wc-text-secondary">
              <strong>설명:</strong> {{ meetingData.activityDescription }}
            </p>
            <p class="wc-body-1 wc-text-secondary">
              <strong>날짜:</strong> {{ formatDate(meetingData.startDateTime) }}
            </p>
            <p class="wc-body-1 wc-text-secondary">
              <strong>시간:</strong>
              {{ formatTime(meetingData.startDateTime) }} -
              {{ formatTime(meetingData.endDateTime) }}
            </p>
            <p class="wc-body-1 wc-text-secondary">
              <strong>장소:</strong> {{ meetingData.location }}
            </p>
            <p class="wc-body-1 wc-text-secondary">
              <strong>모임상세:</strong> {{ meetingData.notes }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 참석자 정보 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6 wc-card wc-card-hover">
          <v-card-title class="wc-h2 wc-card-title">
            참석자 정보
            <v-spacer></v-spacer>
            <p class="pt-3 pb-0 mb-0 wc-body2">
              총 인원: {{ totalMembers }}명 | 참석:
              {{ presentMembers.length }}명 | 불참: {{ absentMembers.length }}명
            </p>
          </v-card-title>
          <v-divider class="wc-divider"></v-divider>

          <!-- 참석자 목록 -->
          <v-list-group value="true">
            <template v-slot:activator>
              <v-list-item-title>참석자 목록</v-list-item-title>
            </template>
            <v-list class="wc-list">
              <v-list-item
                v-for="member in sortedPresentMembers"
                :key="member.id"
                class="wc-list-item"
              >
                <v-list-item-avatar>
                  <v-avatar :color="getRoleColor(member.roleName)" size="40">
                    <span class="wc-avatar-text">{{
                      member.userName?.charAt(0) || ""
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="wc-body-1 wc-text-primary">
                    {{ member.userName }}
                  </v-list-item-title>
                  <v-list-item-subtitle :class="getRoleClass(member.roleName)">
                    {{ member.roleName || "일반 회원" }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip color="green" text-color="white" small class="wc-chip"
                    >참석</v-chip
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-list-group>

          <!-- 불참자 목록 -->
          <v-list-group>
            <template v-slot:activator>
              <v-list-item-title>불참자 목록</v-list-item-title>
            </template>
            <v-list class="wc-list">
              <v-list-item
                v-for="member in sortedAbsentMembers"
                :key="member.id"
                class="wc-list-item"
              >
                <v-list-item-avatar>
                  <v-avatar :color="getRoleColor(member.roleName)" size="40">
                    <span class="wc-avatar-text">{{
                      member.userName?.charAt(0) || ""
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="wc-body-1 wc-text-primary">
                    {{ member.userName }}
                  </v-list-item-title>
                  <v-list-item-subtitle :class="getRoleClass(member.roleName)">
                    {{ member.roleName || "일반 회원" }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip
                    color="grey lighten-1"
                    text-color="black"
                    small
                    class="wc-chip"
                    >불참</v-chip
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-list-group>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";
import moment from "moment-timezone";

export default {
  name: "MeetingDetailView",
  mixins: [AttendanceCtrl],
  props: {
    organizationId: {
      type: [String, Number],
      required: true,
    },
    activityId: {
      type: [String, Number],
      required: true,
    },
    activityInstanceId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      meetingData: null,
      allMembers: [],
      presentMembers: [],
      absentMembers: [],
      isDataLoaded: false,
      meetingImageUrl: "",
      internalTotalMembers: 0,
      organizationMembers: [], // 조직 멤버 목록을 저장할 배열
    };
  },

  computed: {
    totalMembers: {
      get() {
        return this.internalTotalMembers;
      },
      set(value) {
        this.internalTotalMembers = value;
      },
    },
    sortedPresentMembers() {
      return [...this.presentMembers]
        .map((member) => this.addRoleInfo(member))
        .sort((a, b) => this.compareRoles(a.roleName, b.roleName));
    },
    sortedAbsentMembers() {
      return [...this.absentMembers]
        .map((member) => this.addRoleInfo(member))
        .sort((a, b) => this.compareRoles(a.roleName, b.roleName));
    },
  },

  created() {
    this.fetchMeetingData();
    this.fetchAllMembers();
  },

  methods: {
    async fetchMeetingData() {
      try {
        const response = await this.getActivityInstanceDetails(
          this.organizationId,
          this.activityId,
          this.activityInstanceId,
          true
        );

        if (response && response.activityInstance) {
          this.meetingData = response.activityInstance;
          this.presentMembers = this.meetingData.attendances.filter(
            (a) => a.status === "출석"
          );
          this.absentMembers = this.meetingData.attendances.filter(
            (a) => a.status === "결석"
          );
          this.totalMembers = this.meetingData.attendances.length;

          if (this.meetingData.images && this.meetingData.images.length > 0) {
            this.meetingImageUrl = this.meetingData.images[0].filePath;
          } else {
            this.meetingImageUrl = require("@/assets/images/basic_image.png");
          }

          await this.fetchOrganizationMembers(); // 조직 멤버 정보 가져오기
          this.isDataLoaded = true;
        } else {
          console.error("활동 인스턴스 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("미팅 데이터 가져오기 실패:", error);
      }
    },

    async fetchAllMembers() {
      try {
        const response = await this.getOrganizationMembers(
          this.organizationId,
          true
        );
        if (response && response.members) {
          this.allMembers = response.members;
        }
      } catch (error) {
        console.error("조직 멤버 목록 가져오기 실패:", error);
      }
    },

    formatDate(dateString) {
      return moment(dateString).format("YYYY년 MM월 DD일");
    },
    formatTime(dateString) {
      return moment(dateString).format("HH:mm");
    },
    getRoleColor(roleName) {
      switch (roleName) {
        case "회장":
          return "indigo darken-3";
        case "부회장":
          return "blue lighten-2";
        case "총무":
          return "green lighten-1";
        default:
          return "wc-avatar-bg";
      }
    },
    getRoleClass(roleName) {
      switch (roleName) {
        case "회장":
          return "wc-body-2 wc-text-president";
        case "부회장":
          return "wc-body-2 wc-text-vice-president";
        case "총무":
          return "wc-body-2 wc-text-secretary";
        default:
          return "wc-body-2 wc-text-secondary";
      }
    },
    compareRoles(roleA, roleB) {
      const roleOrder = { 회장: 1, 부회장: 2, 총무: 3 };
      return (roleOrder[roleA] || 4) - (roleOrder[roleB] || 4);
    },

    async fetchOrganizationMembers() {
      try {
        const response = await this.getOrganizationMembers(this.organizationId);
        if (response && response.members) {
          this.organizationMembers = response.members;
          console.log("조직 멤버 정보:", this.organizationMembers); // 디버깅용
        }
      } catch (error) {
        console.error("조직 멤버 정보를 가져오는 중 오류 발생:", error);
      }
    },

    addRoleInfo(member) {
      const orgMember = this.organizationMembers.find(
        (m) => m.id === member.userId
      );
      const roleName = orgMember ? orgMember.roleName : "일반 회원";
      console.log(`${member.userName}의 역할: ${roleName}`); // 디버깅용
      return {
        ...member,
        roleName: roleName,
      };
    },
  },
};
</script>

<style scoped>
.meeting-detail-view {
  padding-bottom: 60px;
}

.meeting-image {
  object-fit: cover;
  width: 100%;
  height: 200px;
}

.wc-card {
  border-radius: 15px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1),
    -5px -5px 15px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.wc-card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.15),
    -8px -8px 20px rgba(255, 255, 255, 0.7);
}

.wc-card-title {
  background-color: #f0f0f0;
  padding: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.wc-divider {
  margin: 0;
}

.wc-list {
  background-color: transparent;
}

.wc-list-item {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

.wc-list-item:last-child {
  border-bottom: none;
}

.wc-list-item:hover {
  background-color: #f5f5f5;
}

.wc-avatar-bg {
  background-color: #7ea394;
}

.wc-avatar-text {
  color: white;
  font-weight: bold;
}

.wc-chip {
  font-weight: bold;
}

.wc-text-error {
  color: #f44336;
}

.wc-text-info {
  color: #2196f3;
}

.wc-text-president {
  color: #1a237e;
}

.wc-text-vice-president {
  color: #64b5f6;
}

.wc-text-secretary {
  color: #4caf50;
}
</style>
