<template>
  <div>
    <div class="text-center">
      <v-dialog v-model="logingDialog" class="rounded-circle" width="100">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :value="value"
          color="white"
        >
          {{ value }}
        </v-progress-circular>
      </v-dialog>
    </div>

    <v-card
      flat
      v-if="this.$vuetify.breakpoint.smAndDown"
      class="nm-card-plain"
    >
      <v-container>
        <v-row class="mt-0">
          <v-col class="ma-0 pa-4 pl-5 pb-5" cols="12">
            <div class="mt-3 wc-h2 text-center">회원가입</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 3
            </div>
          </v-col>
        </v-row>

        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pb-8" cols="12" xl="8" lg="8" md="8" sm="7">
            <v-row class="mt-0 mb-7">
              <v-spacer></v-spacer>
              <v-col cols="11" xl="7" lg="7" md="6" sm="8">
                <v-card class="wc-card rounded-circle pa-2 mb-12 ma-16 mt-5">
                  <v-img
                    lazy-src=""
                    :src="userProfile.tempUrl"
                    aspect-ratio="1"
                    style="border-rodius: 50%"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="userProfile.fileObject"
                  :accept="fileAccept"
                  :rules="fileRules"
                  :multiple="false"
                  label="프로필 이미지 업로드"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                  @change="fileHendlerUP()"
                ></v-file-input>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <!-- 텍스트 가운데 정렬 -->
            <div class="pa-5 mb-5 text-center wc-info2">꼭 입력해주세요</div>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="name"
              :rules="rules.name"
              label="이름을 입력하세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="email"
              :rules="rules.email"
              label="Email 계정을 입력하세요"
              hide-details="auto"
              class="mb-8"
              @change="fileHendlerUP()"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="password"
              :rules="rules.password"
              label="비밀번호를 입력하세요"
              hide-details="auto"
              class="mb-8"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="password_confirmation"
              :rules="rules.password_confirmation"
              label="비밀번호를 확인합니다"
              hide-details="auto"
              class="mb-16"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="gender_type"
              :rules="rules.gender_type"
              label="성별을 선택하세요"
              :items="gender_table"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  v-model="birth_date"
                  :rules="rules.birth_date"
                  label="생년월일을 선택하세요"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="birth_date"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
            <!-- Group -->
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="phone_number"
              :rules="rules.phone_number"
              label="휴대폰 번호를 입력하세요 (-제외)"
              hide-details="auto"
              class="mb-8 mt-8"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="is_phone_number_public"
              :rules="rules.is_phone_number_public"
              label="전화번호를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <div class="pa-5 mb-5 text-center wc-info2">
              선택 입력사항입니다
            </div>

            <v-container class="ma-0 pa-3">
              <v-row>
                <v-col class="ma-0 pa-0" cols="7">
                  <v-text-field
                    v-model="postcode"
                    label="우편번호를 검색하세요"
                    @click="execDaumPostcode()"
                    class="mb-8"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col class="ma-0 pl-3 pa-0" cols="5">
                  <v-btn
                    class="wc-btn wc-btn-green"
                    @click="execDaumPostcode()"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text"> 우편번호 검색 </span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-text-field
              v-model="address"
              label="주소를 검색하세요"
              @click="execDaumPostcode()"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="address_detail"
              label="세부주소를 입력하세요"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="is_address_public"
              label="주소를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="church_office_idx"
              label="교회 직분을 선택해주세요"
              :items="church_office_table"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="hobby"
              label="취미와 특기가 있다면 적어주세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="sns_url"
              label="sns주소를 적어주세요"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-10 mb-16" cols="11" xl="7" lg="7" md="6" sm="8">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              @click="saveUser()"
              color="#fff"
              rounded
              block
            >
              <span class="wc-h5 white--text"> 사용자 회원가입 </span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-if="!this.$vuetify.breakpoint.smAndDown" class="wc-card">
      <v-container>
        <v-row class="mt-16">
          <v-col class="ma-0 pa-4 pl-5 pb-1" cols="12">
            <div class="mt-3 wc-h2 text-center">회원가입</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 3
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pb-8" cols="12" xl="8" lg="8" md="8" sm="12">
            <v-row class="mt-0 mb-7">
              <v-spacer></v-spacer>
              <v-col cols="12" xl="7" lg="7" md="6" sm="12">
                <v-card class="wc-card rounded-circle pa-2 mb-12 ma-16 mt-5">
                  <v-img
                    lazy-src=""
                    :src="userProfile.tempUrl"
                    aspect-ratio="1"
                    style="border-rodius: 50%"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="userProfile.fileObject"
                  :accept="fileAccept"
                  :rules="fileRules"
                  :multiple="false"
                  label="프로필 이미지 업로드"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                  @change="fileHendlerUP()"
                ></v-file-input>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <div class="pa-5 mb-5 text-center wc-info2">꼭 입력해주세요</div>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="name"
              :rules="rules.name"
              label="이름을 입력하세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="email"
              :rules="rules.email"
              label="Email 계정을 입력하세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="password"
              :rules="rules.password"
              label="비밀번호를 입력하세요"
              hide-details="auto"
              class="mb-8"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="password_confirmation"
              :rules="rules.password_confirmation"
              label="비밀번호를 확인합니다"
              hide-details="auto"
              class="mb-16"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="gender_type"
              :rules="rules.gender_type"
              label="성별을 선택하세요"
              :items="gender_table"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  v-model="birth_date"
                  :rules="rules.birth_date"
                  label="생년월일을 선택하세요"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="birth_date"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>

            <!-- Group -->
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="phone_number"
              :rules="rules.phone_number"
              label="휴대폰 번호를 입력하세요 (-제외)"
              hide-details="auto"
              class="mb-8 mt-8"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="is_phone_number_public"
              :rules="rules.is_phone_number_public"
              label="전화번호를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <div class="pa-5 mb-5 text-center wc-info2">
              선택 입력사항입니다
            </div>
            <v-container class="ma-0 pa-3">
              <v-row>
                <v-col class="ma-0 pa-0" cols="7">
                  <v-text-field
                    v-model="postcode"
                    label="우편번호를 검색하세요"
                    @click="execDaumPostcode()"
                    class="mb-8"
                    background-color="#edeef3"
                    color="#7EA394"
                    solo
                    rounded
                    flat
                    outlined
                    dense
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col class="ma-0 pl-6 pa-0" cols="5">
                  <v-btn
                    class="wc-btn wc-btn-green"
                    @click="execDaumPostcode()"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text"> 우편번호 검색 </span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-text-field
              v-model="address"
              label="주소를 검색하세요"
              @click="execDaumPostcode()"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="address_detail"
              label="세부주소를 입력하세요"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="is_address_public"
              label="주소를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="church_office_idx"
              label="교회 직분을 선택해주세요"
              :items="church_office_table"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="hobby"
              label="취미와 특기가 있다면 적어주세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="sns_url"
              label="sns주소를 적어주세요"
              hide-details="auto"
              class="mb-6"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-10 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              @click="saveUser()"
              color="#fff"
              rounded
              block
              :disabled="isLock"
            >
              <span class="wc-h5 white--text"> 사용자 회원가입 </span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="isLock" persistent max-width="70">
            <v-progress-circular
              :size="70"
              :width="7"
              color="green"
              indeterminate
            ></v-progress-circular>
          </v-dialog>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import "@/styles/overrides.scss";
import { mapState, mapActions } from "vuex";

import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
import { Utility } from "@/mixins/apis_v2/utility/Utility";

export default {
  props: {},
  data() {
    return {
      // 정체불명
      fileId: "",
      // 중복호출 방지
      isLock: false,
      // 파일 업로드 관련 변수
      fileName: "",
      fileAccept: "image/png, image/jpeg, image/bmp",
      userProfileImageName: "",
      userProfileImageUrl: "",
      // 유저 Model
      userId: "",
      name: "",
      email: "",

      password: "",
      password_confirmation: "",

      gender_type: "",
      birth_date: "",

      phone_number: "",
      is_phone_number_public: "",

      postcode: "",
      address: "",
      address_detail: "",
      is_address_public: "",

      church_office_idx: "",
      hobby: "",
      sns_url: "",

      // User Profile
      userProfile: {
        file_id: 0,
        file_for: "",
        file_name: "",
        file_title: "fileTitle",
        file_description: "fileDescription",
        file_path: "",
        file_size: "",
        file_type: "",
        fileName: "",
        fileObject: null,
        tempUrl: "",
      },

      // Data Control : DB저장형식 & 사용자 표현형식 치환을 위한 데이터 테이블
      gender_table: [
        { text: "남자", value: "m" },
        { text: "여자", value: "f" },
      ],
      is_address_public_table: [
        { text: "공개", value: "y" },
        { text: "비공개", value: "n" },
      ],
      is_phone_number_public_table: [
        { text: "공개", value: "y" },
        { text: "비공개", value: "n" },
      ],
      church_office_table: [
        { text: "장로", value: 200 },
        { text: "권사", value: 300 },
        { text: "집사", value: 400 },
        { text: "안수집사", value: 401 },
        { text: "성도", value: 500 },
        { text: "청년", value: 600 },
        // { text: "렘넌트", value: 700 },
        // { text: "기관", value: 800 },
        { text: "렘넌트 기관", value: 820 },
        { text: "교역자", value: 100 },
        // { text: "목사", value: 101 },
        // { text: "전도사", value: 102 },
        { text: "기타", value: 900 },
      ],

      // 데이트 피커
      date: null,
      menu: false,
      modal: false,
      menu2: false,
      activePicker: null,

      // 비밀번호
      show1: false,
      show2: false,

      // 상단 이미지 홀더
      imageHolderWide: 100,

      // 파일 Rules
      fileRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],

      // 입력정보 Rules
      rules: {
        name: [(val) => (val || "").length > 0 || "This field is required"],
        email: [(val) => (val || "").length > 0 || "This field is required"],
        password: [(val) => (val || "").length > 0 || "This field is required"],
        password_confirmation: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        gender_type: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        birth_date: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        phone_number: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        is_phone_number_public: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        postcode: [(val) => (val || "").length > 0 || "This field is required"],
        address: [(val) => (val || "").length > 0 || "This field is required"],
        address_detail: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
        is_address_public: [
          (val) => (val || "").length > 0 || "This field is required",
        ],
      },

      // Data for Env
      logingDialog: false,
      value: "0",

      // AWS-S3
      albumBucketName: "wisechurch-t-1",
      bucketRegion: "ap-northeast-2",
      IdentityPoolId: "ap-northeast-2:5e8b852b-4649-4451-a8e1-a831049355a1",
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo"]),
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  mixins: [MasterCtrl, FileBins, Utility],
  methods: {
    ...mapActions([
      "hideLogin",
      "login",
      "checkLogin",
      "refreshAccessTokenAtVuex",
      "logout",
    ]),

    // 클라이언트 버튼 클릭 이벤트
    // API 중복호출방지용 플래그 세팅
    async setIsLockTrue() {
      this.isLock = await true;
    },
    // Btn : 데이터 생성
    async saveUser() {
      this.isLock = true;
      await this.lv1_Func("Comp: SignUpUser", "saveUser()");
      await this.lv1_Act("작성된 유저데이터를 DB에 저장합니다.");
      if (!(await this.checkEmptyData())) {
        await this.lv1_Case("입력되지 않은 필수 데이터가 있음");
        await this.lv1_Act("함수를 종료합니다.");
        this.isLock = false;
        return;
      }

      // 작성된 정보를 바탕으로 유저 모델을 생성합니다.
      await this.lv1_Act("작성된 정보를 바탕으로 유저 모델을 생성합니다.");
      const newUserModel = {
        // Group
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        // Group
        gender_type: this.gender_type,
        birth_date: this.birth_date,
        // Group
        phone_number: this.phone_number,
        is_phone_number_public: this.is_phone_number_public,
        // Group
        postcode: this.postcode,
        address: this.address,
        address_detail: this.address_detail,
        is_address_public: this.is_address_public,
        // Group
        church_office_idx: this.church_office_idx,
        hobby: this.hobby,
        sns_url: this.sns_url,
      };
      await this.lv1_Data("newUserModel", newUserModel);

      // 유저 모델을 서버에 전송
      await this.lv1_Act("유저 모델을 서버에 전송합니다.");
      const newUser = await this.openCreateData(this.User, newUserModel);
      await this.lv1_Data("newUser", newUser);

      // 로그인을 위한 유저 정보 생성
      await this.lv1_Act("로그인을 위한 유저 정보 생성");
      const newUserLoginInfo = {
        email: "",
        password: "",
      };
      await this.lv1_Data("newUserLoginInfo", newUserLoginInfo);

      if (newUser.email !== "exist") {
        await this.lv1_Case("동일한 Email이 존재하지 않음");
        await this.lv1_Act("로그인을 위해 Email, Password를 세팅합니다.");
        newUserLoginInfo.email = this.email;
        newUserLoginInfo.password = this.password;
        await this.lv1_Data("newUserLoginInfo", newUserLoginInfo);
      } else {
        await this.lv1_Case("동일한 Email이 존재함");
        await this.lv1_Act("사용자 알림 후 함수 종료");
        this.isLock = false;
        return;
      }

      // 로그인 정보를 통해 하이드 로그인 진행
      this.lv1_Act("로그인 정보를 통해 하이드 로그인 진행");
      const isLoginSuccess = await this.hideLogin(newUserLoginInfo);
      this.lv1_Data("isLoginSuccess", isLoginSuccess);

      // 유저 프로필 이미지 파일이 있는 경우 프로필 업로드
      this.lv1_Act("유저 프로필 이미지 파일이 있는 경우 프로필 업로드");
      if (this.userProfile.fileObject !== null) {
        await this.lv1_Case("업로드된 유저 프로필 있음");
        await this.lv1_Act("유저 프로필 이미지 파일을 서버에 업로드합니다.");
        const userFile = await this.createUserFile(
          newUser.id,
          "UP",
          this.userProfile.fileObject,
          this.userProfile.fileName,
          this.userProfile.file_title,
          this.userProfile.file_description
        );
        await this.lv1_Data("userFile", userFile);
      }
      if (isLoginSuccess) {
        await this.$emit("goToNextStep", 4);
      }
      this.isLock = false;
    },
    // 빈 데이터 체크
    async checkEmptyData() {
      // 빈 데이터방지 확인
      if (this.password !== this.password_confirmation) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
      }
      if (this.name.trim() == "") {
        alert("이름을 입력하세요.");
        return;
      }
      if (this.email.trim() == "") {
        alert("이메일을 입력하세요.");
        return false;
      }
      if (this.password.trim() == "") {
        alert("비밀번호를 입력하세요.");
        return false;
      }
      if (this.password_confirmation.trim() == "") {
        alert("비밀번호 확인을 입력하세요.");
        return false;
      }
      if (this.gender_type.trim() == "") {
        alert("성별을 입력하세요.");
        return false;
      }
      if (this.birth_date.trim() == "") {
        alert("생년월일을 입력하세요.");
        return false;
      }
      if (this.phone_number.trim() == "") {
        alert("휴대폰번호를 입력하세요.");
        return false;
      }
      if (this.is_phone_number_public.trim() == "") {
        alert("휴대폰번호 공개여부를 선택하세요.");
        return false;
      }
      // if (this.address.trim() == "") {
      //   alert("주소를 입력하세요.");
      //   return false;
      // }
      // if (this.address_detail.trim() == "") {
      //   alert("세부주소를 입력하세요.");
      //   return false;
      // }
      // if (this.is_address_public.trim() == "") {
      //   alert("주소 공개여부를 입력하세요.");
      //   return false;
      // }
      // if (this.church_office_idx == "") {
      //   alert("직분을 선택하세요.");
      //   return false;
      // }
      return true;
    },
    // 파일 업로드 헨들러
    async fileHendlerUP() {
      console.log(`%c[ Comp: SignUpUser ] fileHendlerUP()`, `color:#BFFF00;`);
      await this.setTempFileData(this.email, "UP", this.userProfile, true);
    },
    // 우편번호 찾기 헨들러
    execDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          if (this.extraAddress !== "") {
            this.extraAddress = "";
          }
          if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            this.address = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            this.address = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              this.extraAddress += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              this.extraAddress +=
                this.extraAddress !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (this.extraAddress !== "") {
              this.extraAddress = `(${this.extraAddress})`;
            }
          } else {
            this.extraAddress = "";
          }
          // 우편번호를 입력한다.
          this.postcode = data.zonecode;
        },
      }).open();
    },
    save(date) {
      this.$refs.menu.save(date);
    },
  },
};
</script>

<style></style>

<style scoped>
/* Element : v-text-field */
.v-text-field--outlined >>> fieldset {
  /* border-color: rgba(192, 0, 250, 0.986); */
  border: solid 1.5px rgba(236, 237, 245, 0.3);
  border-radius: 24px;
  background-image: #edeef3 !important;
  box-shadow: 15px 15px 15px #00000012, -15px -15px 15px #ffffff !important;
}

::v-deep .v-label {
  font-family: NotoSansKR;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.09px;
  color: #b7bbcc;
}

.fb-btn .v-btn--outlined {
  border: thin solid #cccccc;
}
</style>
