<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <v-col class="text-center">
        <div class="wc-direction-text wc-bold-600">모임 정보 수정</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center mt-5 px-15">
        <!-- 모임 사진 업로드 -->
        <v-card class="wc-card mb-7">
          <v-overlay :value="isUploading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
            <div class="mt-3">이미지 업로드 중...</div>
          </v-overlay>
          <v-img
            :src="meetingImageUrl || require('@/assets/images/basic_image.png')"
            height="220px"
            class="mx-auto full-size"
          ></v-img>
        </v-card>
        <v-file-input
          v-model="photos"
          label="터치해서 사진 업로드"
          accept="image/*"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          prepend-icon=""
          class="mb-7 mx-auto"
          @change="onFileChange"
        ></v-file-input>

        <!-- 모임 종류 표시 (수정 불가) -->
        <v-text-field
          v-model="meetingName"
          label="모임 종류"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          readonly
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>

        <!-- 모임 날짜 선택 -->
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="meetingDate"
              label="임 날 선택"
              color="#7EA394"
              background-color="#edeef3"
              readonly
              solo
              rounded
              flat
              dense
              v-bind="attrs"
              v-on="on"
              class="mb-7 mx-auto"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="meetingDate"
            no-title
            @input="menu = false"
          ></v-date-picker>
        </v-menu>

        <!-- 모임 참여자 수 입력 -->
        <v-dialog v-model="participantsDialog">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="numberOfParticipants"
              label="모임 참여자 수"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              dense
              hide-details="auto"
              class="mb-7 mx-auto bg-transparent"
              type="number"
              v-bind="attrs"
              v-on="on"
              @click="openParticipantsDialog"
            ></v-text-field>
          </template>
          <v-card class="attendance-custom-dialog pa-3">
            <v-card-title class="headline">모임 참여자 선택</v-card-title>
            <v-card-text>
              <v-list class="attendance-custom-dialog">
                <v-list-item
                  class="mb-2"
                  v-for="member in memberList"
                  :key="member.id"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="wc-bold-600 wc-fs-18 wc-h3 wc-direction-text"
                      >{{ member.name }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="wc-bold-200 wc-fs-12 wc-caption wc-direction-text"
                    >
                      <v-chip x-small :color="getMemberStatusColor(member)">
                        {{ getMemberStatus(member) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <label class="switch">
                      <input type="checkbox" v-model="member.isParticipating" />
                      <span class="slider round"></span>
                    </label>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="wc-fs-16"
                color="primary"
                text
                @click="closeParticipantsDialog"
                >완료</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 시작 시간, 종료 시간, 장소, 메모 입력 -->
        <v-text-field
          v-model="meetingStartTime"
          label="시작 시간"
          type="time"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>
        <v-text-field
          v-model="meetingEndTime"
          label="종료 시간"
          type="time"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>
        <v-text-field
          v-model="meetingLocation"
          label="모임 장소"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>
        <v-textarea
          v-model="meetingNotes"
          label="모임 메모"
          background-color="#edeef3"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-textarea>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" class="pa-15 pt-4 pb-15">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="updateMeeting"
        >
          <span class="wc-h3">모임 정보 수정</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
import { Utility } from "@/mixins/apis_v2/utility/Utility";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";
import { AttendanceCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AttendanceCtrl";
import { AWSS3Ctrl } from "@/mixins/apis_v2/external/AWSS3Ctrl.js";
import moment from "moment-timezone";

export default {
  name: "AttendanceUpdateView",
  computed: {
    ...mapState("auth", ["userInfo"]),
    currentOrganizationId() {
      if (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.length > 0
      ) {
        return this.userInfo.roles[0].organizationId;
      }
      return null;
    },
  },
  data() {
    return {
      menu: false,
      photos: null,
      meetingImageUrl: null,
      meetingName: "",
      meetingDate: "",
      numberOfParticipants: null,
      participantsDialog: false,
      memberList: [],
      meetingStartTime: "",
      meetingEndTime: "",
      meetingLocation: "",
      meetingNotes: "",
      activityId: null,
      activityInstanceId: null,
      originalImageInfo: null,
      isUploading: false,
      roleInfo: {
        그룹장: { color: "#B3C6FF", priority: 1 }, // 파스텔 블루
        순장: { color: "#D6E0FF", priority: 1 }, // 연한 파스텔 블루
        EBS: { color: "#FFF4B3", priority: 2 }, // 파스텔 옐로우
        순원: { color: "#C2E0C2", priority: 3 }, // 파스텔 그린
        회원: { color: "#D6EAD6", priority: 3 }, // 연한 파스텔 그린
      },
    };
  },
  mixins: [
    MasterCtrl,
    FileBins,
    Utility,
    CurrentMemberCtrl,
    AttendanceCtrl,
    AWSS3Ctrl,
  ],
  async created() {
    try {
      await this.fetchMemberList();
      await this.fetchMeetingData();
    } catch (error) {
      console.error("초기화 중 오류 발생:", error);
    }
  },
  methods: {
    async fetchMeetingData() {
      console.log("fetchMeetingData 시작");
      const { organizationId, activityId, activityInstanceId } =
        this.$route.params;

      try {
        console.log("API 호출 시작:", {
          organizationId,
          activityId,
          activityInstanceId,
        });
        const response = await this.getActivityInstanceDetails(
          organizationId,
          activityId,
          activityInstanceId
        );

        console.log("API 응답:", response);

        if (response && response.activityInstance) {
          const activityInstance = response.activityInstance;
          this.activityId = activityId;
          this.activityInstanceId = activityInstanceId;
          this.meetingName = activityInstance.activityName || "";

          const koreaTimeZone = "Asia/Seoul";
          const startDateTime = moment(activityInstance.startDateTime).tz(
            koreaTimeZone
          );
          const endDateTime = moment(activityInstance.endDateTime).tz(
            koreaTimeZone
          );

          this.meetingDate = startDateTime.format("YYYY-MM-DD");
          this.meetingStartTime = startDateTime.format("HH:mm");
          this.meetingEndTime = endDateTime.format("HH:mm");
          this.meetingLocation = activityInstance.location || "";
          this.meetingNotes = activityInstance.notes || "";

          if (
            Array.isArray(this.memberList) &&
            Array.isArray(activityInstance.attendances)
          ) {
            this.memberList.forEach((member) => {
              member.isParticipating = false;
            });

            activityInstance.attendances.forEach((attendance) => {
              const member = this.memberList.find(
                (m) => m.id === attendance.userId
              );
              if (member && attendance.status === "출석") {
                member.isParticipating = true;
              }
            });

            this.numberOfParticipants = activityInstance.attendances.filter(
              (attendance) => attendance.status === "출석"
            ).length;
          }

          // 이미지 정보 설정
          if (activityInstance.images && activityInstance.images.length > 0) {
            this.meetingImageUrl = activityInstance.images[0].filePath;
            this.originalImageInfo = activityInstance.images[0];
          }
        } else {
          console.error("API 응답이 없거나 유효하지 않습니다.");
        }
      } catch (error) {
        console.error("모임 데이터 조회 중 오류 발생:", error);
        alert("모임 정보를 불러오는데 실패했습니다.");
      }
    },
    async fetchMemberList() {
      try {
        const response = await this.getOrganizationMembers(
          this.currentOrganizationId
        );
        if (response && response.members) {
          this.memberList = response.members.map((member) => ({
            ...member,
            isParticipating: false,
          }));
        }
      } catch (error) {
        console.error("멤버 목록 조회 중 오류 발생:", error);
      }
    },
    onFileChange(file) {
      if (file) {
        // file이 File 객체인 경우
        if (file instanceof File) {
          this.meetingImageUrl = URL.createObjectURL(file);
        }
        // file이 배열인 경우 (multiple 속성이 true일 때)
        else if (
          Array.isArray(file) &&
          file.length > 0 &&
          file[0] instanceof File
        ) {
          this.meetingImageUrl = URL.createObjectURL(file[0]);
        }
        // file이 null인 경우 (파일 선택이 취소되었을 때)
        else if (file === null) {
          this.meetingImageUrl = null;
        }
        // 그 외의 경우
        else {
          console.error("Unexpected file format:", file);
          this.meetingImageUrl = null;
        }
      } else {
        this.meetingImageUrl = null;
      }
    },
    openParticipantsDialog() {
      this.participantsDialog = true;
    },
    closeParticipantsDialog() {
      this.participantsDialog = false;
      this.numberOfParticipants = this.memberList.filter(
        (member) => member.isParticipating
      ).length;
    },
    getMemberStatus(member) {
      if (member.isNewMember === "Y") return "새가족";
      if (member.isLongTermAbsentee === "Y") return "장기결석";
      return member.roleName === "회원" ? "순원" : member.roleName || "순원";
    },
    getMemberStatusColor(member) {
      if (member.isNewMember === "Y") return "#FFE0B3"; // 파스텔 주황색 (새가족)
      if (member.isLongTermAbsentee === "Y") return "#FFCCCC"; // 파스텔 빨간색 (장기결석자)

      const roleColors = {
        그룹장: "#B3C6FF", // 파스텔 블루
        순장: "#D6E0FF", // 연한 파스텔 블루
        EBS: "#FFF4B3", // 파스텔 옐로우
        순원: "#C2E0C2", // 파스텔 그린
        회원: "#D6EAD6", // 연한 파스텔 그린
      };

      return roleColors[member.roleName] || "#E0E0E0"; // 기본 연한 회색
    },
    async uploadImageToS3() {
      if (!this.photos) {
        console.log("업로드할 이미지가 없습니다.");
        return null;
      }

      const file = this.photos;
      const fileExtension = file.name.split(".").pop();
      const organizationId = this.currentOrganizationId;
      const activityId = this.activityId;
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];

      const newFileName = `org_${organizationId}_activity_${activityId}_${this.meetingName}_instance_${timestamp}.${fileExtension}`;
      const filePath = `meetings/${newFileName}`;

      try {
        const result = await this.s3CreateFile(filePath, file, true);
        if (result) {
          console.log("이미지 업로드 성공:", result);
          return { url: result.filePath, fileName: newFileName };
        } else {
          throw new Error("이미지 업로드 결과가 없습니다.");
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return null;
      }
    },
    async updateMeeting() {
      console.log("🚀 updateMeeting 함수 시작");

      if (!this.meetingDate) {
        console.warn("⚠️ 필수 정보 누락");
        alert("필수 정보를 모두 입력해주세요.");
        return;
      }

      const selectedParticipants = this.memberList.filter(
        (member) => member.isParticipating
      );

      const koreaTimeZone = "Asia/Seoul";
      const startDateTime = moment.tz(
        `${this.meetingDate} ${this.meetingStartTime || "00:00"}`,
        koreaTimeZone
      );
      const endDateTime = moment.tz(
        `${this.meetingDate} ${this.meetingEndTime || "00:00"}`,
        koreaTimeZone
      );

      const instanceData = {
        startDateTime: startDateTime.utc().format(),
        endDateTime: endDateTime.utc().format(),
        location: this.meetingLocation || "",
        notes: this.meetingNotes || "",
      };

      const attendances = selectedParticipants.map((participant) => ({
        userId: participant.id || participant.userId,
        status: "출석",
        checkInTime: instanceData.startDateTime,
        checkOutTime: instanceData.endDateTime,
        note: "",
      }));

      try {
        // 이미지 처리
        let imageInfo = null;
        if (this.photos) {
          this.isUploading = true; // 업로드 시작
          // 기존 이미지 삭제
          if (this.originalImageInfo) {
            await this.s3DeleteFile(this.originalImageInfo.fileName, true);
          }

          // 새 이미지 업로드
          const uploadResult = await this.uploadImageToS3();
          if (uploadResult) {
            imageInfo = {
              url: uploadResult.url,
              fileName: uploadResult.fileName,
              fileSize: this.photos.size,
              fileType: this.photos.type,
            };
          }
        }

        const response = await this.updateAttendance(
          this.currentOrganizationId,
          this.activityId,
          this.activityInstanceId,
          instanceData,
          attendances,
          imageInfo,
          true // showLog
        );

        if (response && response.result !== 0) {
          console.log("모임 정보 업데이트 성공");
          alert("모임 정보가 성공적으로 업데이트되었습니다.");
          this.$router.push({ name: "MeetingHistoryView" });
        } else {
          throw new Error("모임 정보 업데이트에 실패했습니다.");
        }
      } catch (error) {
        console.error("❌ 모임 정보 수정 중 오류 발생:", error);
        alert("모임 정보 수정에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        this.isUploading = false; // 업로드 완료 또는 실패 시
      }
    },
    async testFetchData() {
      try {
        // Activity 데이터 조회
        console.log("🔍 Activity 데이터 조회 시작");
        const activityData = await this.openReadDataList(this.Activity, true);
        console.log("📊 Activity 데이터:", activityData);

        // 에러 처리를 포함한 안전한 데이터 조회
        try {
          console.log("\n🔍 ActivityChild 데이터 조회 시작");
          const activityChildData = await this.openReadDataList(
            this.ActivityChild,
            true
          );
          console.log("📊 ActivityChild 데이터:", activityChildData);
        } catch (error) {
          console.log("ActivityChild 데이터 조회 실패:", error.message);
        }

        try {
          console.log("\n🔍 Attendance 데이터 조회 시작");
          const attendanceData = await this.openReadDataList(
            this.Attendance,
            true
          );
          console.log("📊 Attendance 데이터:", attendanceData);
        } catch (error) {
          console.log("Attendance 데이터 조회 실패:", error.message);
        }

        // 데이터 요약은 실제 데이터가 있는 경우에만 출력
        console.log("\n📑 데이터 요약");
        if (activityData?.data) {
          console.log(`총 Activity 수: ${activityData.data.length}`);
        }
      } catch (error) {
        console.error("❌ 데이터 조회 중 오류 발생:", error);
      }
    },
  },
};
</script>

<style scoped>
.attendance-custom-dialog {
  max-width: 500px;
  background-color: #edeef3;
}

.full-size {
  width: 100%;
  height: 100%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.new-member-chip {
  background-color: #ffc107;
  color: white;
}

.role-chip {
  background-color: #2196f3;
  color: white;
}

.absentee-chip {
  background-color: #ff9800;
  color: white;
}

.v-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
