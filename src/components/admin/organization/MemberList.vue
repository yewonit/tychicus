<template>
  <v-card flat>
    <v-card-title class="pb-0">
      <span class="subtitle-1 font-weight-bold">
        {{
          selectedOrganization
            ? selectedOrganization.organization_name
            : "조직을 선택하세요"
        }}
        <span v-if="selectedOrganization" class="text-caption ml-2">
          (총 {{ members.length }}명)
        </span>
      </span>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-alert
        v-if="selectedOrganization && !selectedOrganization.isLeafNode"
        type="info"
        dense
        text
        class="ma-2"
      >
        최하위 조직만 멤버를 관리할 수 있습니다. 최하위 조직을 선택해주세요.
      </v-alert>
      <v-data-table
        :headers="memberHeaders"
        :items="members"
        :items-per-page="-1"
        :loading="loading"
        class="elevation-0"
        :footer-props="{
          'items-per-page-options': [10, 20, 50, 100, -1],
          'items-per-page-text': 'Rows per page:',
          'items-per-page-all-text': 'All',
        }"
        :no-data-text="
          selectedOrganization
            ? selectedOrganization.isLeafNode
              ? '멤버가 없습니다'
              : '최하위 조직만 멤버를 조회할 수 있습니다'
            : '조직을 선택하세요'
        "
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-2 name-avatar">
                  <span class="white--text">{{ item.name.charAt(0) }}</span>
                </v-avatar>
                <div>
                  <div class="member-name">{{ item.name }}</div>
                  <div class="member-suffix">
                    {{ item.nameSuffix || "구분자 없음" }}
                  </div>
                </div>
              </div>
            </td>
            <td>{{ item.phoneNumber || "번호 없음" }}</td>
            <td>{{ item.email || "이메일 없음" }}</td>
            <td>{{ item.genderType === "M" ? "남성" : "여성" }}</td>
            <td>
              <!-- 역할 칩 렌더링 단순화 -->
              <v-chip
                v-if="
                  ['그룹장', '부그룹장', '순장', 'EBS'].includes(item.roleName)
                "
                small
                :color="getRoleColor(item.roleName)"
                text-color="black"
                class="mr-1"
              >
                {{ item.roleName }}
              </v-chip>
              <v-chip
                v-if="item.isNewMember === 'Y'"
                small
                color="orange"
                text-color="black"
                class="mr-1"
              >
                새가족
              </v-chip>
              <v-chip
                v-if="item.isLongTermAbsentee === 'Y'"
                small
                color="red"
                text-color="black"
                class="mr-1"
              >
                장기결석
              </v-chip>
              <v-chip
                v-if="['순원', '회원'].includes(item.roleName)"
                small
                :color="getRoleColor(item.roleName)"
                text-color="black"
              >
                {{ item.roleName }}
              </v-chip>
            </td>
            <td class="text-right">
              <v-btn icon small @click="$emit('edit-member', item)">
                <v-icon small color="#7EA394">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="$emit('delete-member', item)">
                <v-icon small color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MemberList",

  props: {
    selectedOrganization: {
      type: Object,
      default: null,
    },
    members: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      memberHeaders: [
        { text: "이름", value: "name", sortable: true },
        { text: "전화번호", value: "phoneNumber", sortable: true },
        { text: "이메일", value: "email", sortable: true },
        { text: "성별", value: "genderType", sortable: true },
        { text: "상태/역할", value: "status", sortable: false },
        { text: "관리", value: "actions", sortable: false, align: "right" },
      ],
    };
  },

  methods: {
    // 역할에 따른 색상 지정
    getRoleColor(roleName) {
      const colorMap = {
        그룹장: "#B3C6FF", // 파스텔 블루
        부그룹장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
        순장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
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
/* 이름 아바타 스타일 */
.name-avatar {
  background: linear-gradient(135deg, #7ea394, #c2e0c2) !important;
  font-weight: bold;
}

/* 멤버 정보 표시 스타일 */
.member-name {
  font-weight: 600;
}

.member-suffix {
  opacity: 0.7;
  font-size: 0.85em;
}
</style>
