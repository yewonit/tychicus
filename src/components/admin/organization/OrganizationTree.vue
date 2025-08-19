<template>
  <v-card flat>
    <v-card-title class="pb-0">
      <span class="subtitle-1 font-weight-bold">조직 목록</span>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-treeview
        :items="organizationTree"
        item-key="id"
        open-all
        dense
        :active.sync="activeOrganization"
        return-object
        activatable
        @update:active="handleOrganizationSelect"
        :load-children="() => {}"
        @input="(val) => $emit('tree-input', val)"
      >
        <template v-slot:prepend="{ item }">
          <v-icon small color="#7EA394">
            {{
              item.children && item.children.length > 0
                ? 'mdi-folder'
                : 'mdi-folder-outline'
            }}
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          <div
            class="d-flex align-center justify-space-between"
            style="width: 100%"
          >
            <div>
              <span class="font-weight-bold">{{ item.organization_name }}</span>
              <div class="text-caption grey--text text--darken-1">
                ID: {{ item.id }} | 코드: {{ item.organization_code }} | 멤버:
                {{ item.memberCount || 0 }}명
              </div>
            </div>
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on" @click.stop>
                  <v-icon small>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click.stop="$emit('edit-organization', item)">
                  <v-list-item-title>
                    <v-icon left small color="#7EA394">mdi-pencil</v-icon>
                    수정
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="$emit('delete-organization', item)">
                  <v-list-item-title>
                    <v-icon left small color="red">mdi-delete</v-icon>
                    삭제
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'OrganizationTree',

    props: {
      organizationTree: {
        type: Array,
        default: () => [],
      },
    },

    data() {
      return {
        activeOrganization: [],
      };
    },

    methods: {
      handleOrganizationSelect(active) {
        this.$emit('organization-selected', active);
      },
    },
  };
</script>

<style scoped>
  /* 조직 트리뷰 아이템 간격 조정 */
  .v-treeview-node__root {
    margin-bottom: 4px;
  }
</style>
