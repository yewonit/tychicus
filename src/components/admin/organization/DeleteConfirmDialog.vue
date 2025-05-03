<template>
  <v-dialog v-model="visible" max-width="400px">
    <v-card rounded="lg">
      <v-card-title class="text-h5 wc-bold-600"
        >정말 삭제하시겠습니까?</v-card-title
      >
      <v-card-text>
        {{ text }}
        <div class="red--text mt-2">이 작업은 되돌릴 수 없습니다.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#7EA394" text @click="cancel">취소</v-btn>
        <v-btn color="red" text @click="confirm">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteConfirmDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "선택된 항목을 삭제하시겠습니까?",
    },
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

  methods: {
    confirm() {
      this.$emit("confirm");
    },

    cancel() {
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.wc-bold-600 {
  font-weight: 600;
}
</style>
