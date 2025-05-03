<template>
  <v-container fill-height fluid>
    <v-row
      class="fill-height px-0 pb-15"
      align="center"
      justify="space-between"
    >
      <v-col cols="12" class="text-center mt-9 px-20">
        <template v-if="absentees.length === 0">
          <v-card class="wc-card mb-12 pa-10">
            <div class="wc-h3 ma-3 pa-0">새가족이 없습니다</div>
            <div class="wc-st2 ma-3 pa-0">No new members</div>
          </v-card>
        </template>
        <template v-else>
          <v-card
            :class="{
              'wc-card': true,
              'mb-12': true,
              // 'pa-3': true,
            }"
            v-for="absentee in absentees"
            :key="absentee.userId"
          >
            <v-icon size="140" class="ma-3 mt-6 fadeIn" color="#262626"
              >mdi-account-check</v-icon
            >
            <div class="wc-h3 ma-3 pa-0">{{ absentee.name }}</div>
            <div class="wc-info-light ma-0 pa-1">
              최종출석일자 : {{ absentee.last_attendance_day }}
            </div>
            <div class="wc-info-light ma-0 pa-1">
              연락처 : {{ absentee.phoneNumber }}
            </div>
            <div class="wc-info-light ma-0 pa-1">
              생년월일 : {{ absentee.birthDate }}
            </div>
            <v-card-actions class="ma-0 pa-0">
              <v-btn
                class="wc-card-btn mt-3"
                block
                large
                @click.stop="goToDetail(absentee.userId)"
              >
                <span class="wc-h3">심방이력</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <!-- {{ absentees }} -->
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";

export default {
  name: "LongTermAbsenteeListView",
  mixins: [CurrentMemberCtrl],
  computed: {
    ...mapState("auth", ["userInfo"]),
    absentees() {
      return this.memberList.filter((member) => member.isNewMember === "Y");
    },
  },
  data() {
    return {
      memberList: [],
    };
  },
  created() {
    this.fetchMemberList();
  },
  methods: {
    goToDetail(id) {
      // 다음 컴포넌트로 이동하는 로직을 여기에 구현하세요.
      this.$router.push({ name: "RescueVisitHistoryView", params: { id: id } });
      console.log(id);
    },
    async fetchMemberList() {
      const organizationId = this.userInfo.roles[0].organizationId;
      let memberList = await this.getMembersWithRoles(organizationId, true);

      // 우선 순위에 따라 정렬
      memberList.sort((a, b) => {
        const roleOrder = { 8: 1, 9: 2, 10: 3, 11: 6 }; // 회장, 부회장, 총무, 일반회원
        const roleA = roleOrder[a.roleId] || 6; // 없는 roleId가 있다면 일반회원으로 간주
        const roleB = roleOrder[b.roleId] || 6;

        if (a.isNewMember === "Y" && b.isNewMember !== "Y") return -1;
        if (a.isNewMember !== "Y" && b.isNewMember === "Y") return 1;
        if (a.isLongTermAbsentee === "Y" && b.isLongTermAbsentee !== "Y")
          return -1;
        if (a.isLongTermAbsentee !== "Y" && b.isLongTermAbsentee === "Y")
          return 1;

        return roleA - roleB;
      });

      this.memberList = memberList;
      console.log(this.memberList);
    },
  },
};
</script>

<style scoped>
.service-card {
  padding: 20px;
  margin-bottom: 20px;
}
</style>
