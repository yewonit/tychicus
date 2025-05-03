<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <v-col class="text-center">
        <v-icon size="130" class="ma-3 mt-6 fadeIn" color="#262626">
          mdi-account-edit
        </v-icon>
        <div class="wc-direction-text wc-bold-600">인원 정보 수정</div>
      </v-col>
    </v-row>
    <!-- 카카오톡 단톡방 참여여부 -->
    <v-row class="ma-0 pa-0 pt-15 pb-5 px-10">
      <v-col cols="2" class="ma-0 pa-0 pl-3">
        <v-icon size="25" class="ma-0 pa-0" color="#262626">mdi-chat</v-icon>
      </v-col>
      <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
        카톡방 참여여부
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="ma-0 pa-0">
        <label class="switch">
          <input
            type="checkbox"
            v-model="member.is_kakaotalk_chat_member"
            true-value="Y"
            false-value="N"
          />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>

    <!-- 장결자 여부 -->
    <v-row class="ma-0 pa-0 pb-5 px-10">
      <v-col cols="2" class="ma-0 pa-0 pl-3">
        <v-icon size="25" class="ma-0 pa-0" color="#262626"
          >mdi-account-check</v-icon
        >
      </v-col>
      <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
        장결자 여부
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="ma-0 pa-0">
        <label class="switch">
          <input
            type="checkbox"
            v-model="member.is_long_term_absentee"
            true-value="Y"
            false-value="N"
          />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>

    <!-- 새가족 여부 -->
    <v-row class="ma-0 pa-0 pb-7 px-10">
      <v-col cols="2" class="ma-0 pa-0 pl-3">
        <v-icon size="25" class="ma-0 pa-0" color="#262626"
          >mdi-account-multiple-plus</v-icon
        >
      </v-col>
      <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
        새가족 여부
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="ma-0 pa-0">
        <label class="switch">
          <input
            type="checkbox"
            v-model="member.is_new_member"
            true-value="Y"
            false-value="N"
          />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>

    <!-- 정보입력 -->
    <v-row>
      <v-col cols="12" class="text-center mt-5 px-15">
        <!-- 이름 입력 -->
        <v-text-field
          v-model="member.name"
          label="이름 입력 (필수)"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          required
        ></v-text-field>

        <!-- 동명이인 구분자 -->
        <v-text-field
          v-model="member.name_suffix"
          label="구분자 ex) A AA (필수)"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          required
        ></v-text-field>

        <!-- 전화번호 -->
        <v-text-field
          v-model="member.phone_number"
          label="전화번호 (필수)"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          required
        ></v-text-field>

        <!-- 성별(드롭다운) -->
        <v-select
          v-model="member.gender_type"
          :items="[
            { text: '남성', value: 'M' },
            { text: '여성', value: 'F' },
          ]"
          item-text="text"
          item-value="value"
          label="성별"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-select>

        <!-- 이메일 추가 -->
        <v-text-field
          v-model="member.email"
          label="이메일 (필수)"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          required
        ></v-text-field>

        <!-- 생년월일 추가 -->
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
              v-model="member.birth_date"
              label="생년월일"
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
            v-model="member.birth_date"
            no-title
            @input="menu = false"
          ></v-date-picker>
        </v-menu>

        <!-- 교인번호 추가 -->
        <v-text-field
          v-model="member.church_member_number"
          label="교인번호"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>

        <!-- 교회 등록일 추가 -->
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="member.church_registration_date"
              label="교회 등록일"
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
            v-model="member.church_registration_date"
            no-title
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>

        <!-- 국적 추가 -->
        <v-select
          v-model="member.country"
          :items="countryItems"
          item-text="text"
          item-value="value"
          label="국적"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-select>

        <!-- 주소 관련 필드 추가 -->
        <v-text-field
          v-model="member.address"
          label="주소를 검색하세요"
          @click="execDaumPostcode()"
          class="mb-7 mx-auto bg-transparent"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="member.address_detail"
          label="세부주소를 입력하세요"
          class="mb-7 mx-auto bg-transparent"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="member.zip_postal_code"
          label="우편번호"
          class="mb-7 mx-auto bg-transparent"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
        ></v-text-field>

        <!-- 취미 추가 -->
        <v-text-field
          v-model="member.hobby"
          label="취미"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
        ></v-text-field>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" class="pa-15 pt-4 pb-0">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="updateMemberData"
          :disabled="!isDataChanged"
        >
          <span class="wc-h3">데이터 수정</span>
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
import countries from "@/assets/data/countries.json";

export default {
  name: "MemberUpdateView",
  computed: {
    ...mapState("auth", ["userInfo"]),
    isDataChanged() {
      return (
        JSON.stringify(this.member) !== JSON.stringify(this.originalMember)
      );
    },
  },
  data() {
    return {
      menu: false,
      menu2: false,
      member: {
        id: null,
        name: "",
        name_suffix: "",
        phone_number: "",
        gender_type: null,
        is_kakaotalk_chat_member: "N",
        is_long_term_absentee: "N",
        is_new_member: "N",
        email: "",
        birth_date: null,
        church_member_number: "",
        church_registration_date: null,
        country: "KOR",
        address: "",
        address_detail: "",
        zip_postal_code: "",
        hobby: "",
      },
      originalMember: null,
      countryItems: Object.entries(countries)
        .map(([code, name]) => ({
          text: name,
          value: code,
        }))
        .sort((a, b) => a.text.localeCompare(b.text)),
    };
  },
  mixins: [MasterCtrl, CurrentMemberCtrl, FileBins, Utility],
  created() {
    console.log("UpdateView created");
    const memberId = this.$route.params.id;
    this.member.id = memberId;
    console.log("memberId", memberId);
  },
  mounted() {
    this.getMemberData();
  },
  methods: {
    /**
     * @description 멤버 상세 정보를 조회하는 비동기 메서드
     * @method getMemberData
     * @async
     * @returns {Promise<void>} 멤버 정보 조회가 완료되면 해결되는 Promise
     * @throws {Error} 멤버 정보 조회 실패 시 발생하는 오류
     */
    async getMemberData() {
      const memberId = this.$route.params.id;
      const response = await this.openReadDataItemById(
        this.User,
        memberId,
        true
      );
      console.log("response", response);

      if (response && response.data) {
        this.member = response.data;
        this.originalMember = { ...response.data };
        console.log("member", this.member);
      } else {
        alert(
          "멤버 정보 조회에 실패했습니다. 관리자에게 문의해주세요.\n관리자 연락처: 010-1234-5678"
        );
      }
    },

    /**
     * @description 멤버 정보를 업데이트하는 비동기 메서드
     * @method updateMemberData
     * @async
     * @returns {Promise<void>} 멤버 정보 업데이트가 완료되면 해결되는 Promise
     * @throws {Error} 멤버 정보 업데이트 실패 시 발생하는 오류
     */
    async updateMemberData() {
      console.log("🛠️ [Update Member Data] 멤버 정보 업데이트를 시작합니다.");

      // 필수 입력값 검증
      const requiredFields = {
        name: "이름",
        name_suffix: "구분자",
        phone_number: "전화번호",
        gender_type: "성별",
        email: "이메일",
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !this.member[key])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        console.warn("⚠️ [Validation] 필수 정보가 누락되었습니다.");
        alert(`다음 필수 항목을 입력해주세요:\n\n${missingFields.join("\n")}`);
        return;
      }

      try {
        // 멤버 정보 업데이트 API 호출
        console.log("🔄 [Update Member Data] 멤버 정보를 업데이트합니다.");
        const response = await this.openUpdateData(
          this.User,
          this.member.id,
          this.member,
          true
        );
        console.log("✅ [Update Member Data] 업데이트 응답:", response);

        // 업데이트 결과 처리
        if (response.message === "업데이트 완료") {
          console.log(
            "🚀 [Update Member Data] 멤버 정보 업데이트가 완료되었습니다. 회원 목록 페이지로 이동합니다."
          );
          this.$router.push("/member-list");
        } else {
          console.error(
            "❌ [Update Member Data] 멤버 정보 수정에 실패했습니다."
          );
          alert(
            "멤버 정보 수정에 실패했습니다. 관리자에게 문의해주세요.\n관리자 연락처: admin@example.com"
          );
        }
      } catch (error) {
        console.error(
          "🚨 [Update Member Data] 멤버 정보 수정 중 오류 발생:",
          error
        );
        alert(
          "멤버 정보 수정 중 오류가 발생했습니다. 관리자에게 문의해주세요.\n관리자 연락처: admin@example.com"
        );
      }
    },
  },
};
</script>

<style scoped>
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
</style>
