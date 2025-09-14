<template>
  <v-footer app padless class="admin-footer">
    <v-container fluid class="pa-2">
      <v-row no-gutters align="center" justify="space-between">
        <!-- 좌측: 저작권 정보 -->
        <v-col cols="auto">
          <span class="text-caption grey--text">
            &copy; {{ new Date().getFullYear() }} 예원교회. All rights reserved.
          </span>
        </v-col>

        <!-- 중앙: 버전 정보 -->
        <v-col cols="auto" class="mx-4">
          <span class="text-caption grey--text"> Version {{ version }} </span>
        </v-col>

        <!-- 우측: 링크들 -->
        <v-col cols="auto">
          <v-btn
            v-for="link in links"
            :key="link.text"
            text
            small
            class="px-2"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="text-caption grey--text">
              {{ link.text }}
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AdminFooter",

  data: () => ({
    version: process.env.VUE_APP_VERSION || "1.0.0",
    links: [
      {
        text: "이용약관",
        href: "#",
      },
      {
        text: "개인정보처리방침",
        href: "#",
      },
      {
        text: "문의하기",
        href: "#",
      },
    ],
  }),
};
</script>

<style scoped>
.admin-footer {
  border-top: 1px solid #e0e0e0;
  background-color: #f5f5f5 !important;
}

.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
}

.v-btn::before {
  background-color: transparent;
}

.v-btn:hover {
  background-color: transparent !important;
}

.v-btn:hover .text-caption {
  color: #1976d2 !important;
}

/* 반응형 스타일 */
@media (max-width: 600px) {
  .v-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .v-col {
    margin: 4px 0;
  }
}
</style>
