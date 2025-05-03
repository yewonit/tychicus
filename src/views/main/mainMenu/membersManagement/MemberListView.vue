<template>
  <v-container fluid>
    <v-row class="mt-3 mb-4">
      <v-col cols="12" class="text-center">
        <div class="wc-direction-text wc-bold-700">
          {{ this.userInfo.roles[0].organizationName }}
        </div>
        <div class="wc-direction-text mt-1">인원을 관리하세요</div>
      </v-col>
    </v-row>
    <v-row align="center" justify="space-between">
      <v-col>
        <v-container class="ma-0 pa-0 px-10">
          <v-divider></v-divider>
          <v-row class="ma-0 pa-0 pt-5 pb-5">
            <v-col cols="2" class="ma-0 pa-0 pl-3">
              <v-icon size="25" class="ma-0 pa-0" color="#262626">
                mdi-account-group
              </v-icon>
            </v-col>
            <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
              총 재적인원
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="ma-0 pa-0 pt-1 wc-h3" cols="auto">
              {{ memberList.length }}
            </v-col>
            <v-col
              class="ma-0 pa-0 wc-sidemenu-active pt-2 pl-2 pr-3"
              cols="auto"
            >
              명
            </v-col>
          </v-row>

          <v-row class="ma-0 pa-0 pb-5">
            <v-col cols="2" class="ma-0 pa-0 pl-3">
              <v-icon size="25" class="ma-0 pa-0" color="#262626"
                >mdi-account-plus</v-icon
              >
            </v-col>
            <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
              새가족 수
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="ma-0 pa-0 pt-1 wc-h3" cols="auto">
              {{ newFamilyMembersCount }}
            </v-col>
            <v-col
              class="ma-0 pa-0 wc-sidemenu-active pt-2 pl-2 pr-3"
              cols="auto"
            >
              명
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 pb-5">
            <v-col cols="2" class="ma-0 pa-0 pl-3">
              <v-icon size="25" class="ma-0 pa-0" color="#262626"
                >mdi-account-check</v-icon
              >
            </v-col>
            <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
              장단결자 수
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="ma-0 pa-0 pt-1 wc-h3" cols="auto">
              {{ longTermAbsenteeCount }}
            </v-col>
            <v-col
              class="ma-0 pa-0 wc-sidemenu-active pt-2 pl-2 pr-3"
              cols="auto"
            >
              명
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="mt-7 mb-7 pa-10 pt-0 pb-0">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          disabled
          v-show="false"
          @click="addNewMember"
        >
          <span class="wc-h3">신규 인원 등록</span>
        </v-btn>
      </v-col>
    </v-row>
    <!-- 여기 -->
    <v-row>
      <v-col
        v-for="member in memberList"
        :key="member.id"
        cols="12"
        class="px-10 pa-1 pt-6 pb-0"
      >
        <v-card class="wc-card-for-itme-list">
          <v-container>
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0 pr-4" cols="auto">
                <v-img
                  src="https://plus.unsplash.com/premium_photo-1675826774815-35b8a48ddc2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D"
                  rounded
                  aspectRatio="1"
                  position="bottom"
                  class="custom-image"
                ></v-img>
              </v-col>
              <v-col class="ma-0 pa-0">
                <div class="wc-fs-20 wc-bold-600 pt-1">
                  {{ member.name }}
                  <v-chip
                    v-if="member.isNewMember === 'Y'"
                    small
                    density="compact"
                    class="ml-1 mt-n2"
                    color="orange"
                  >
                    새가족
                  </v-chip>
                  <v-chip
                    v-if="member.isLongTermAbsentee === 'Y'"
                    small
                    density="compact"
                    class="ml-1 mt-n2"
                    color="red"
                  >
                    장단결자
                  </v-chip>
                  <v-chip
                    v-if="member.roleName"
                    small
                    density="compact"
                    class="ml-1 mt-n2"
                    :color="getRoleColor(member.roleName)"
                  >
                    {{ member.roleName === "회원" ? "순원" : member.roleName }}
                  </v-chip>
                </div>
                <div class="wc-fs-12 wc-bold-300">
                  {{ member.phone_number }}
                </div>
              </v-col>
              <v-col class="ma-0 pa-0 pt-1" cols="auto">
                <v-icon size="25" class="ma-0 mr-3 pt-1" color="#BDBDBD">
                  mdi-delete
                </v-icon>
                <v-icon size="25" class="ma-0 pa-0 pt-1 pr-3" color="#BDBDBD">
                  mdi-pen
                </v-icon>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
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

export default {
  name: "AttendanceInputView",
  data() {
    return {
      menu: false,
      entryDate: null,

      memberList: [],
      // kakaoTalkMembersCount: 0, // 주석처리
      longTermAbsenteeCount: 0,
      newFamilyMembersCount: 0,
    };
  },
  mixins: [MasterCtrl, FileBins, Utility, CurrentMemberCtrl],
  computed: {
    ...mapState("auth", ["userInfo"]),
  },
  created() {
    // 컴포넌트가 생성될 때 멤버 목록을 가져옵니다
    this.fetchMemberList();
  },
  methods: {
    // ...mapActions("tempUsers", ["deleteUser"]),
    /**
     * @description [신규인원등록 btn | 페이지 이동] 신규 회원 등록 페이지로 이동하는 메서드입니다.
     * @method addNewMember
     * @returns {void}
     */
    addNewMember() {
      this.$router.push("/member-registration");
    },
    /**
     * @description [회원정보수정 btn | 페이지 이동] 회원 정보 수정 페이지로 이동하는 메서드입니다.
     * @method editMember
     * @param {Object} member - 수정할 회원 정보
     * @returns {void}
     */
    editMember(member) {
      this.$router.push({
        name: "MemberUpdateView",
        params: { id: member.userId },
      });
    },

    /**
     * @description 멤버 리스트를 조회하고 정렬하여 상태를 업데이트하는 비동기 메서드
     * @async
     * @method fetchMemberList
     * @returns {Promise<void>} 멤버 리스트 조회 및 정렬이 완료되면 해결되는 Promise
     */
    async fetchMemberList() {
      // 멤버 리스트 조회 프로세스 시작을 로깅
      console.log("🚀 Process #1: 멤버 리스트 조회 시작");
      let processCount = 1;

      // 현재 로그인한 사용자의 조직 ID를 가져옴
      const organizationId = this.userInfo.roles[0].organizationId;
      console.log(`📦 Process #${++processCount}: 조직 ID - ${organizationId}`);

      // 해당 조직의 모든 멤버와 그들의 역할 정보를 조회
      // getMembersWithRoles는 CurrentMemberCtrl mixin에서 제공되는 메서드
      let memberList = await this.getMembersWithRoles(organizationId, true);
      console.log(
        `👥 Process #${++processCount}: 초기 멤버 리스트 조회 완료`,
        memberList
      );

      /**
       * @description 멤버 리스트 정렬 로직
       * @details
       * 1. 새가족(isNewMember='Y')이 최상위로 정렬됨
       * 2. 그 다음으로 장기결석자(isLongTermAbsentee='Y')가 정렬됨
       * 3. 마지막으로 역할 우선순위에 따라 정렬
       *    - roleOrder 객체에 정의된 순서:
       *      8: 1순위
       *      9: 2순위
       *      10: 3순위
       *      11: 6순위
       *      5: 3순위
       *      기타: 6순위
       */
      console.log(`🔄 Process #${++processCount}: 멤버 정렬 시작`);
      memberList.sort((a, b) => {
        // 역할별 우선순위 정의
        const roleOrder = { 8: 1, 9: 2, 10: 3, 11: 6, 5: 3 };
        const roleA = roleOrder[a.roleId] || 6;
        const roleB = roleOrder[b.roleId] || 6;

        // 정렬 과정 로깅
        console.log(
          `📊 Process #${processCount}.1: 역할 비교 - ${a.name}(${roleA}) vs ${b.name}(${roleB})`
        );

        // 새가족 우선 정렬
        if (a.isNewMember === "Y" && b.isNewMember !== "Y") return -1;
        if (a.isNewMember !== "Y" && b.isNewMember === "Y") return 1;

        // 장기결석자 정렬
        if (a.isLongTermAbsentee === "Y" && b.isLongTermAbsentee !== "Y")
          return -1;
        if (a.isLongTermAbsentee !== "Y" && b.isLongTermAbsentee === "Y")
          return 1;

        // 역할 우선순위에 따른 정렬
        return roleA - roleB;
      });
      console.log(`✅ Process #${++processCount}: 멤버 정렬 완료`, memberList);

      // 정렬된 멤버 리스트를 컴포넌트의 상태값으로 저장
      this.memberList = memberList;
      console.log(`💾 Process #${++processCount}: 멤버 리스트 저장 완료`);

      // 멤버 통계 업데이트 (새가족 수, 장기결석자 수 등)
      this.updateCounts();
    },

    /**
     * @description 멤버 리스트의 통계 데이터를 계산하고 업데이트하는 메서드
     * @method updateCounts
     * @input {Array<Object>} this.memberList - 멤버 객체 배열
     *   - member.isLongTermAbsentee: 'Y'|'N' - 장기결석자 여부
     *   - member.isNewMember: 'Y'|'N' - 새가족 여부
     * @output {void}
     *   - this.longTermAbsenteeCount: 장기결석자 수가 업데이트됨
     *   - this.newFamilyMembersCount: 새가족 수가 업데이트됨
     */
    updateCounts() {
      // 통계 계산 시작 로그
      console.log("📊 Process #7: 통계 계산 시작");

      // 1. 장기결석자 수 계산
      // - memberList 배열을 순회하며 isLongTermAbsentee가 'Y'인 멤버만 필터링
      // - 필터링된 배열의 길이가 장기결석자 수
      this.longTermAbsenteeCount = this.memberList.filter(
        (member) => member.isLongTermAbsentee === "Y"
      ).length;
      console.log(
        `⏸️ Process #7.2: 장기 결석자 수 - ${this.longTermAbsenteeCount}명`
      );

      // 2. 새가족 수 계산
      // - memberList 배열을 순회하며 isNewMember가 'Y'인 멤버만 필터링
      // - 필터링된 배열의 길이가 새가족 수
      this.newFamilyMembersCount = this.memberList.filter(
        (member) => member.isNewMember === "Y"
      ).length;
      console.log(
        `🆕 Process #7.3: 새가족 수 - ${this.newFamilyMembersCount}명`
      );

      // 통계 계산 완료 로그
      console.log("✅ Process #8: 통계 계산 완료");
    },
    /**
     * @description 멤버의 프로필 이미지 URL을 생성하는 메서드
     * @method getProfileImage
     * @param {Object} member - 멤버 객체
     * @param {string} member.snsUrl - 멤버의 SNS URL
     * @returns {string} 프로필 이미지 URL 또는 빈 문자열
     */
    getProfileImage(member) {
      return member.snsUrl
        ? member.snsUrl.replace("https://www.", "") + "/profile.jpg"
        : "";
    },

    /**
     * @description 사용자를 삭제하는 비동기 메서드
     * @method deleteUser
     * @async
     * @param {string|number} id - 삭제할 사용자의 ID
     * @throws {Error} 사용자 삭제 중 발생할 수 있는 오류
     * @returns {Promise<void>} 삭제 작업이 완료되면 해결되는 Promise
     */
    async deleteUser(id) {
      console.log(`❌ Process #9: 사용자 삭제 시작 - ID: ${id}`);
      if (confirm("정말 삭제하시겠습니까?")) {
        console.log(`🗑️ Process #10: 삭제 확인됨`);
        await this.openDeleteData(this.User, id, true);
        console.log(`✅ Process #11: 삭제 완료`);
        this.fetchMemberList();
        console.log(`🔄 Process #12: 멤버 리스트 새로고침`);
      } else {
        console.log(`⚠️ Process #10: 삭제 취소됨`);
      }
    },

    /**
     * @description 역할 이름에 따른 색상을 반환하는 메서드
     * @method getRoleColor
     * @param {string} roleName - 역할 이름
     * @returns {string} 색상 코드
     */
    getRoleColor(roleName) {
      const colorMap = {
        그룹장: "#B3C6FF", // 파스텔 블루
        순장: "#D6E0FF", // 연한 파스텔 블루
        EBS: "#FFF4B3", // 파스텔 옐로우
        순원: "#C2E0C2", // 파스텔 그린
        회원: "#D6EAD6", // 연한 파스텔 그린
      };
      return colorMap[roleName] || "#E0E0E0"; // 기본 연한 회색
    },
  },
};
</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}

.custom-image {
  cursor: pointer;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
