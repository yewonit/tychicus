<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card rounded="lg">
      <v-card-title class="wc-bold-600">
        <span class="text-h5">{{
          editedOrganization.id ? "조직 수정" : "조직 추가"
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedOrganization.organization_name"
                label="조직명"
                required
                background-color="#edeef3"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-4 mx-auto bg-transparent"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedOrganization.organization_code"
                label="조직 코드"
                required
                background-color="#edeef3"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-4 mx-auto bg-transparent"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="editedOrganization.upper_organization_id"
                :items="organizationSelectItems"
                item-text="text"
                item-value="value"
                label="상위 조직"
                hint="상위 조직이 없으면 비워두세요"
                persistent-hint
                clearable
                background-color="#edeef3"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-4 mx-auto bg-transparent"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedOrganization.organization_description"
                label="설명"
                rows="3"
                background-color="#edeef3"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-4 mx-auto bg-transparent"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#7EA394" text @click="close">취소</v-btn>
        <v-btn color="#7EA394" text @click="save">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "OrganizationDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: Object,
      default: null,
    },
    organizationSelectItems: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      editedOrganization: {
        id: null,
        organization_name: "",
        organization_code: "",
        organization_description: "",
        upper_organization_id: null,
      },
    };
  },

  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  watch: {
    organization: {
      handler(newVal) {
        if (newVal) {
          this.editedOrganization = {
            ...newVal,
            organization_description:
              newVal.organization_description || newVal.description || "",
          };
        } else {
          this.editedOrganization = {
            id: null,
            organization_name: "",
            organization_code: "",
            organization_description: "",
            upper_organization_id: null,
          };
        }
      },
      immediate: true,
    },
  },

  methods: {
    save() {
      this.$emit("save", this.editedOrganization);
    },

    close() {
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.bg-transparent {
  background-color: transparent !important;
}
</style>
