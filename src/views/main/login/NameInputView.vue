<template>
  <v-container fill-height fluid>
    <!-- 전체 컨테이너를 수직으로 정렬하기 위한 설정 -->
    <v-row class="fill-height" align="center" justify="space-between">
      <!-- 상단 컨텐츠 -->
      <v-col cols="12" class="text-center mt-16 px-15">
        <!-- 아이콘 -->
        <v-icon size="150" class="mb-10 fadeIn" color="#262626">
          mdi-account-circle
        </v-icon>
        <!-- {{ name }} -->
        <!-- 입력 필드 -->
        <v-text-field
          v-model="name"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          label="터치해서 이름을 입력하세요"
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>
        <!-- 안내 텍스트 -->
        <div class="ma-auto grey--text mb-0 fadeIn">
          <strong>믿음의 눈</strong>으로 <strong>약속의 땅</strong>을 차지할
          <br />
          <strong>하나님 나라의 청년!</strong>
        </div>

        <!-- 중복 체크 결과 메시지 -->
        <div
          v-if="userNameCheckMessage"
          class="ma-auto"
          :class="userNameCheckClass"
        >
          {{ userNameCheckMessage }}
        </div>
      </v-col>
      <!-- 공간을 채우기 위한 스페이서 -->
      <v-spacer></v-spacer>
      <!-- 하단 컨텐츠 -->
      <v-col cols="12" class="pa-15 pb-0">
        <!-- 버튼 -->
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="checkUserName()"
        >
          <span class="wc-h3">다음으로</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// "@/styles/overrides.scss" 파일을 import합니다.
// 이 파일은 스타일 오버라이드를 위한 SCSS 파일입니다.
import "@/styles/overrides.scss";

// Vuex의 mapState와 mapActions를 import합니다.
// mapState는 Vuex 저장소의 상태를 컴포넌트의 computed 속성에 매핑하는 데 사용됩니다.
// mapActions는 Vuex 저장소의 액션을 컴포넌트의 methods에 매핑하는 데 사용됩니다.
import { mapActions, mapState } from "vuex";

// DataSetting 믹신을 "@/mixins/dataset/DataSetting"에서 import합니다.
// 이 믹신은 데이터 CRUD(Create, Read, Update, Delete) 작업을 위한 메서드를 제공합니다.
import { DataSetting } from "@/mixins/dataset/DataSetting";

// AuthCtrl 믹신을 "@/mixins/apis_v2/internal/AuthCtrl"에서 import합니다.
// 이 믹신은 계정 관련 API 호출을 위한 메서드를 제공합니다.
import { AuthCtrl } from "@/mixins/apis_v2/internal/domainCtrl/AuthCtrl";

// FileBins 믹신을 "@/mixins/apis_v2/internal/FileBins"에서 import합니다.
// 이 믹신은 파일 제어를 위한 메서드를 제공합니다.
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";

// Utility 믹신을 "@/mixins/apis_v2/utility/Utility"에서 import합니다.
// 이 믹신은 유틸리티 메서드를 제공합니다.
import { Utility } from "@/mixins/apis_v2/utility/Utility";

// Vue 컴포넌트를 정의합니다.
export default {
  // 컴포넌트의 이름을 "NameInputView"로 설정합니다.
  name: "NameInputView",

  // 컴포넌트의 데이터 속성을 정의합니다.
  data() {
    return {
      // 검색 키워드를 저장할 변수입니다.
      keyword: "",
      // 사용자 프로필 이미지를 저장할 배열입니다.
      userProfileImage: [],
      // 프로필 이미지의 파일 경로를 저장할 변수입니다.
      profileFilepath: "",
      // 사용자 이름을 저장할 변수입니다.
      name: "",
      // 사용자 이름 중복 체크 결과 메시지를 저장할 변수입니다.
      userNameCheckMessage: "",
      // 사용자 이름 중복 체크 결과에 따른 CSS 클래스를 저장할 변수입니다.
      userNameCheckClass: "",
    };
  },

  // 컴포넌트의 computed 속성을 정의합니다.
  computed: {
    // Vuex 저장소의 "auth" 모듈에서 "userName" 상태를 매핑합니다.
    ...mapState("auth", ["userName"]),
  },

  // 컴포넌트에서 사용할 믹신을 정의합니다.
  mixins: [DataSetting, AuthCtrl, FileBins, Utility],

  // 컴포넌트가 마운트될 때 호출되는 라이프사이클 훅입니다.
  mounted() {
    // 유저 프로필 이미지를 불러오는 로직을 여기에 추가할 수 있습니다.
  },

  // 컴포넌트의 메서드를 정의합니다.
  methods: {
    // Vuex 저장소의 "auth" 모듈에서 "setUserName" 액션을 매핑합니다.
    ...mapActions("auth", ["setUserName", "setUserList", "setUserData"]),

    // 사용자 이름 중복 체크를 수행하는 비동기 메서드입니다.
    async checkUserName() {
      console.log("checkUserName");

      // 사용자 이름이 비어있는 경우 알림을 표시하고 함수를 종료합니다.
      if (this.name.trim() === "") {
        this.userNameCheckMessage = "";
        this.userNameCheckClass = "";
        alert("이름을 입력해주세요.");
        return;
      }

      console.log("사용자 이름:", this.name);
      // 사용자 이름 중복 체크를 위해 API를 호출합니다.
      const response = await this.authCheckUserName(this.name, true);

      // API 응답에 따라 결과 메시지와 CSS 클래스를 설정합니다.
      if (response.message === "이름이 있습니다.") {
        // 동명이인 처리
        if (response.hasDuplicates && response.userList) {
          console.log("동명이인 발견:", response.userList);
          // 동명이인 리스트를 Vuex 스토어에 저장
          this.setUserName(this.name);
          this.setUserList(response.userList);
        }
        // 단일 사용자 처리
        else if (!response.hasDuplicates && response.userData) {
          console.log("단일 사용자:", response.userData);
          // 사용자 정보를 Vuex 스토어에 저장
          this.setUserName(this.name);
          this.setUserData(response.userData);
        }
        // 기존 로직 (하위 호환성 유지)
        else {
          console.log("사용자 이름:", this.name);
          this.setUserName(this.name);
          console.log("스토어에 저장된 이름:", this.userName);
          // 전화번호 입력을 위한 페이지로 이동합니다.
        }
        // 전화번호 입력 화면으로 이동
        this.$router.push({ name: "PhoneInputView" });
      } else if (response.message === "이름이 없습니다.") {
        // 이름이 데이터베이스에 없음. 관리자에게 문의하세요 알럿을 띄웁니다.
        this.userNameCheckMessage = "이름이 없습니다. 관리자에게 문의하세요.";
        this.userNameCheckClass = "error--text";
      }
    },
  },
};
</script>

<style scoped>
/* 스타일은 Vuetify 클래스를 사용하여 이미 정의되어 있으므로 추가적인 스타일링이 필요하지 않을 수 있습니다. 필요하다면 여기에 추가하세요. */
</style>
