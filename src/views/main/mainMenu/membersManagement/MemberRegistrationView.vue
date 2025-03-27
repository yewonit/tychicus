<template>
  <v-container fluid>
    <v-row align="center" justify="space-between">
      <v-col class="text-center">
        <v-icon size="130" class="ma-3 mt-6 fadeIn" color="#262626">
          mdi-account-plus
        </v-icon>
        <div class="wc-direction-text wc-bold-600">새로운 인원 등록</div>
      </v-col>
    </v-row>
    <!-- 카카오톡 단톡방 참여여부 -->
    <!-- 
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
          <input type="checkbox" v-model="kakaoChatJoined" />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>
    -->

    <!-- 장결자 여부 -->
    <v-row class="ma-0 pa-0 pt-15 pb-5 px-10">
      <v-col cols="2" class="ma-0 pa-0 pl-3">
        <!-- mdi 아이콘 총 징원에 대한 아이콘 -->
        <v-icon size="25" class="ma-0 pa-0" color="#262626"
          >mdi-account-check</v-icon
        >
      </v-col>
      <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
        장결자 여부
      </v-col>

      <v-spacer></v-spacer>

      <!-- 토글 -->
      <v-col cols="auto" class="ma-0 pa-0">
        <label class="switch">
          <input type="checkbox" v-model="isAbsent" />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>

    <!-- 새가족 여부 -->
    <v-row class="ma-0 pa-0 pb-7 px-10">
      <v-col cols="2" class="ma-0 pa-0 pl-3">
        <!-- mdi 아이콘 총 징원에 대한 아이콘 -->
        <v-icon size="25" class="ma-0 pa-0" color="#262626"
          >mdi-account-multiple-plus</v-icon
        >
      </v-col>
      <v-col class="ma-0 pa-0 wc-fs-18 wc-bold-600" cols="auto">
        새가족 여부
      </v-col>

      <v-spacer></v-spacer>

      <!-- 토글 -->
      <v-col cols="auto" class="ma-0 pa-0">
        <label class="switch">
          <input type="checkbox" v-model="isNewMember" />
          <span class="slider round"></span>
        </label>
      </v-col>
    </v-row>
    <!-- 정보입력 -->
    <v-row>
      <v-col cols="12" class="text-center mt-5 px-15">
        <!-- 이름 입력 -->
        <v-text-field
          v-model="nameOfNewMember"
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
          v-model="distinguisher"
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
          v-model="phone"
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
          v-model="gender"
          :items="['남성', '여성']"
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

        <v-text-field
          v-model="email"
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
              v-model="birthDate"
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
            v-model="birthDate"
            no-title
            @input="menu = false"
          ></v-date-picker>
        </v-menu>

        <!-- 
        <v-text-field
          v-model="memberNumber"
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
              v-model="registrationDate"
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
            v-model="registrationDate"
            no-title
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>

        <v-select
          v-model="countryCode"
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

        <v-text-field
          v-model="address"
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
          v-model="addressDetail"
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
          v-model="postcode"
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

        <v-text-field
          v-model="hobby"
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
        -->
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" class="pa-15 pt-4 pb-0">
        <v-btn
          class="mx-auto wc-btn"
          rounded
          block
          large
          @click="submitMemberData"
        >
          <span class="wc-h3">데이터 저장</span>
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
  name: "MemberRegistrationView",
  computed: {
    ...mapState("auth", ["userInfo"]),
  },
  data() {
    return {
      menu: false,
      menu2: false,
      nameOfNewMember: "",
      distinguisher: "",
      phone: "",
      gender: null,
      // kakaoChatJoined: false,
      isAbsent: false,
      isNewMember: false,
      email: "",
      birthDate: null,
      memberNumber: "",
      registrationDate: null,
      countryCode: "KOR",
      countryItems: Object.entries(countries)
        .map(([code, name]) => ({
          text: name,
          value: code,
        }))
        .sort((a, b) => a.text.localeCompare(b.text)),
      address: "",
      addressDetail: "",
      postcode: "",
      hobby: "",
    };
  },
  mixins: [MasterCtrl, CurrentMemberCtrl, FileBins, Utility],
  methods: {
    async submitMemberData() {
      // 필수 입력값 검증
      if (
        !this.nameOfNewMember ||
        !this.distinguisher ||
        !this.phone ||
        !this.gender
      ) {
        alert("필수 정보를 모두 입력해주세요.");
        return;
      }

      // 임의의 데이터 생성
      const randomData = this.generateRandomData();

      // 유저 데이터 객체 생성
      const userData = {
        name: this.nameOfNewMember,
        name_suffix: this.distinguisher,
        email: randomData.email,
        phone_number: this.phone,
        password: this.phone,
        gender_type: this.gender === "남성" ? "M" : "F",
        birth_date: randomData.birthDate,
        church_member_number: randomData.memberNumber,
        church_registration_date: randomData.registrationDate,
        country: this.countryCode,
        address: randomData.address,
        address_detail: randomData.addressDetail,
        zip_postal_code: randomData.postcode,
        hobby: randomData.hobby,
        // is_kakaotalk_chat_member: this.kakaoChatJoined ? "Y" : "N",
        is_long_term_absentee: this.isAbsent ? "Y" : "N",
        is_new_member: this.isNewMember ? "Y" : "N",
      };

      try {
        // 조직 ID와 역할 ID를 적절한 값으로 변경해주세요.
        const organizationId = this.userInfo.roles[0].organizationId;
        const organizationCode = this.userInfo.roles[0].organizationCode;

        const response = await this.createMember(
          userData,
          organizationId,
          organizationCode,
          this.userInfo.id,
          true
        );

        if (response && response.id) {
          // 성공 시 /member-list 화면으로 이동
          this.$router.push("/member-list");
        } else {
          // 실패 시 알럿창 표시
          alert(
            "멤버 생성에 실패했습니다. 관리자에게 문의해주세요.\n관리자 연락처: admin@example.com"
          );
        }
      } catch (error) {
        console.error("멤버 생성 중 오류 발생:", error);
        alert(
          "멤버 생성 중 오류가 발생했습니다. 관리자에게 문의해주세요.\n관리자 연락처: admin@example.com"
        );
      }
    },

    generateRandomData() {
      return {
        email: `${this.nameOfNewMember
          .toLowerCase()
          .replace(" ", "")}@example.com`,
        birthDate: "1990-01-01",
        memberNumber: "12345",
        registrationDate: "2020-01-01",
        country: "대한민국",
        address: "서울특별시 강남구",
        addressDetail: "123번지",
        postcode: "12345",
        hobby: "독서",
      };
    },

    // execDaumPostcode 메서드는 유지
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

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
