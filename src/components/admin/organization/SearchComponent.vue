<template>
  <div class="search-component">
    <!-- 검색 바 -->
    <v-card flat elevation="0" class="pa-2 search-card">
      <v-text-field
        v-model="query"
        prepend-inner-icon="mdi-magnify"
        label="그룹명, 순명, 이름으로 검색"
        solo
        rounded
        dense
        hide-details
        clearable
        background-color="#f5f5f5"
        @input="onQueryChange"
      >
        <template v-slot:append>
          <v-chip-group v-model="type" mandatory column @change="onTypeChange">
            <v-chip small outlined value="all">전체</v-chip>
            <v-chip small outlined value="group">그룹</v-chip>
            <v-chip small outlined value="order">순</v-chip>
            <v-chip small outlined value="name">이름</v-chip>
          </v-chip-group>
        </template>
      </v-text-field>
    </v-card>

    <!-- 검색 결과 -->
    <v-expand-transition>
      <v-card v-if="query && hasResults" flat class="mt-2 mb-4">
        <v-tabs v-model="activeTab" background-color="#edeef3" grow>
          <v-tab v-if="groupResults.length > 0">
            그룹 ({{ groupResults.length }})
          </v-tab>
          <v-tab v-if="memberResults.length > 0">
            멤버 ({{ memberResults.length }})
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <!-- 그룹 검색 결과 -->
          <v-tab-item v-if="groupResults.length > 0">
            <v-list dense>
              <v-list-item
                v-for="org in groupResults"
                :key="org.id"
                @click="$emit('select-organization', org)"
              >
                <v-list-item-icon>
                  <v-icon small color="#7EA394">mdi-folder-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ org.organization_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    코드: {{ org.organization_code }} | 멤버:
                    {{ org.memberCount || 0 }}명
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    small
                    @click.stop="$emit('edit-organization', org)"
                  >
                    <v-icon small color="#7EA394">mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-tab-item>

          <!-- 멤버 검색 결과 -->
          <v-tab-item v-if="memberResults.length > 0">
            <v-list dense>
              <v-list-item
                v-for="member in memberResults"
                :key="member.userId"
                @click="$emit('select-member', member)"
                :data-member-id="member.userId"
              >
                <v-list-item-avatar size="32" class="name-avatar">
                  <span class="white--text">{{ member.name.charAt(0) }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ member.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ member.phoneNumber || '번호 없음' }} |
                    {{ member.roleName }}
                    <span
                      v-if="member.organizationName"
                      class="grey--text text--darken-1"
                    >
                      | {{ member.organizationName }}
                    </span>
                    <v-chip
                      v-if="member.isNewMember === 'Y'"
                      x-small
                      color="orange"
                      text-color="black"
                      class="ml-1"
                    >
                      새가족
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click.stop="$emit('edit-member', member)">
                    <v-icon small color="#7EA394">mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
  export default {
    name: 'SearchComponent',

    props: {
      organizations: {
        type: Array,
        default: () => [],
      },
      getMembers: {
        type: Function,
        required: true,
      },
    },

    data() {
      return {
        query: '',
        type: 'all', // 'all', 'group', 'order', 'name'
        activeTab: 0,
        groupResults: [],
        memberResults: [],
        searchTimer: null,
      };
    },

    computed: {
      hasResults() {
        return this.groupResults.length > 0 || this.memberResults.length > 0;
      },
    },

    methods: {
      onQueryChange() {
        // 디바운스 적용해서 타이핑 완료 후 검색 실행
        clearTimeout(this.searchTimer);

        if (!this.query || this.query.trim().length < 2) {
          this.groupResults = [];
          this.memberResults = [];
          return;
        }

        this.searchTimer = setTimeout(() => {
          this.performSearch();
        }, 300);
      },

      onTypeChange() {
        if (this.query && this.query.trim().length >= 2) {
          this.performSearch();
        }
      },

      async performSearch() {
        const query = this.query.toLowerCase().trim();

        // 그룹 검색
        if (this.type === 'all' || this.type === 'group') {
          this.searchOrganizations(query);
        } else {
          this.groupResults = [];
        }

        // 멤버 검색
        if (
          this.type === 'all' ||
          this.type === 'name' ||
          this.type === 'order'
        ) {
          await this.searchMembers(query);
        } else {
          this.memberResults = [];
        }

        // 검색 결과가 있는 탭으로 활성화
        this.$nextTick(() => {
          if (this.hasResults) {
            if (this.groupResults.length > 0) {
              this.activeTab = 0;
            } else if (this.memberResults.length > 0) {
              this.activeTab = this.groupResults.length > 0 ? 1 : 0;
            }
          }
        });
      },

      searchOrganizations(query) {
        this.groupResults = this.organizations.filter((org) => {
          return (
            org.organization_name.toLowerCase().includes(query) ||
            (org.organization_code &&
              org.organization_code.toLowerCase().includes(query))
          );
        });
      },

      async searchMembers(query) {
        this.memberResults = [];
        this.$emit('search-start');

        try {
          // 최하위 조직들 찾기
          const leafOrgs = this.organizations.filter(
            (org) =>
              !this.organizations.some(
                (other) => other.upper_organization_id === org.id
              )
          );

          // 개별 조직의 멤버를 모두 가져와서 통합 검색
          for (const org of leafOrgs) {
            try {
              const members = await this.getMembers(org.id);

              if (members && Array.isArray(members)) {
                const filteredMembers = members.filter((member) => {
                  // 모든 검색은 이름을 기반으로 합니다
                  const nameMatches = member.name.toLowerCase().includes(query);

                  if (!nameMatches) return false; // 이름이 일치하지 않으면 항상 제외

                  // 검색 타입에 따른 추가 필터링
                  if (this.type === 'all') {
                    return true; // 이름이 일치하면 모든 멤버 포함
                  } else if (this.type === 'name') {
                    return true; // 이름 검색은 이미 위에서 필터링됨
                  } else if (this.type === 'order') {
                    // 순 검색: 순장이나 순원인 멤버만 포함 (이름 일치 조건 포함)
                    return (
                      member.roleName === '순장' || member.roleName === '순원'
                    );
                  }

                  return false;
                });

                // 검색 결과에 조직 정보 추가
                filteredMembers.forEach((member) => {
                  member.organizationId = org.id;
                  member.organizationName = org.organization_name;
                });

                this.memberResults = [
                  ...this.memberResults,
                  ...filteredMembers,
                ];
              }
            } catch (error) {
              console.error(
                `${org.organization_name} 멤버 검색 중 오류`,
                error
              );
            }
          }
        } finally {
          this.$emit('search-end');
        }
      },

      clearSearch() {
        this.query = '';
        this.groupResults = [];
        this.memberResults = [];
      },
    },
  };
</script>

<style scoped>
  /* 검색 카드 스타일 */
  .search-card {
    border-radius: 8px;
    background-color: transparent !important;
    transition: all 0.3s;
  }

  .search-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }

  /* 이름 아바타 스타일 */
  .name-avatar {
    background: linear-gradient(135deg, #7ea394, #c2e0c2) !important;
    font-weight: bold;
  }
</style>
