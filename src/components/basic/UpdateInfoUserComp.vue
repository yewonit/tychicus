<template>
  <div>
    <v-card
      flat
      v-if="this.$vuetify.breakpoint.smAndDown"
      class="nm-card-plain"
    >
      <v-container>
        <v-row class="mt-0">
          <v-col class="ma-0 pa-4 pl-5 pb-5" cols="12">
            <div class="mt-3 wc-h2 text-center">내 정보</div>
            <div class="mt-1 wc-info-light text-center">My Infomation</div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pb-8" cols="12" xl="8" lg="8" md="8" sm="7">
            <v-row class="mt-0 mb-16">
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
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="userModel.name"
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
              v-model="userModel.email"
              :rules="rules.email"
              label="Email 계정을 입력하세요"
              hide-details="auto"
              class="mb-8"
              @change="fileHendlerUP()"
            ></v-text-field>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="userModel.gender_type"
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
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="userModel.birth_date"
                  :rules="rules.birth_date"
                  label="생년월일을 선택하세요"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="userModel.birth_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
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
              v-model="userModel.phone_number"
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
              v-model="userModel.is_phone_number_public"
              :rules="rules.is_phone_number_public"
              label="전화번호를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <v-text-field
              v-model="userModel.postcode"
              :rules="rules.postcode"
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
            <v-text-field
              v-model="userModel.address"
              :rules="rules.address"
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
              v-model="userModel.address_detail"
              :rules="rules.address_detail"
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
              v-model="userModel.is_address_public"
              :rules="rules.is_address_public"
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
              v-model="userModel.church_office_idx"
              :rules="rules.church_office"
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
              v-model="userModel.hobby"
              :rules="rules.hobby"
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
              v-model="userModel.sns_url"
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
            <v-btn class="wc-btn wc-btn-green" color="#fff" rounded block>
              <span class="wc-h5 white--text" @click="saveUser()">
                사용자 정보 변경
              </span>
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
            <div class="mt-3 wc-h2 text-center">내 정보</div>
            <div class="mt-1 wc-info-light text-center">My Infomation</div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pb-8" cols="12" xl="8" lg="8" md="8" sm="12">
            <v-row class="mt-0 mb-16">
              <v-spacer></v-spacer>
              <v-col cols="12" xl="7" lg="12" md="6" sm="12">
                <v-card class="wc-card rounded-circle pa-2 mb-12 ma-16 mt-5">
                  <v-img
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
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="userModel.name"
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
              v-model="userModel.email"
              :rules="rules.email"
              label="Email 계정을 입력하세요"
              hide-details="auto"
              class="mb-8"
              disabled
            ></v-text-field>
            <!-- <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="userModel.password"
              :rules="rules.password"
              label="비밀번호를 입력하세요"
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
              v-model="password_confirmation"
              :rules="rules.password_confirmation"
              label="비밀번호를 확인합니다"
              hide-details="auto"
              class="mb-16"
            ></v-text-field> -->
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              v-model="userModel.gender_type"
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
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="userModel.birth_date"
                  :rules="rules.birth_date"
                  label="생년월일을 선택하세요"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="userModel.birth_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
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
              v-model="userModel.phone_number"
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
              v-model="userModel.is_phone_number_public"
              :rules="rules.is_phone_number_public"
              label="전화번호를 공개할까요?"
              :items="is_address_public_table"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <!-- Group -->
            <v-text-field
              v-model="userModel.postcode"
              :rules="rules.postcode"
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
            <v-text-field
              v-model="userModel.address"
              :rules="rules.address"
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
              v-model="userModel.address_detail"
              :rules="rules.address_detail"
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
              v-model="userModel.is_address_public"
              :rules="rules.is_address_public"
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
              v-model="userModel.church_office_idx"
              :rules="rules.church_office"
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
              v-model="userModel.hobby"
              :rules="rules.hobby"
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
              v-model="userModel.sns_url"
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
            <v-btn class="wc-btn wc-btn-green" color="#fff" rounded block>
              <span class="wc-h5 white--text" @click="saveUser()">
                사용자 정보 변경
              </span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import '@/styles/overrides.scss';
  import { mapState, mapActions } from 'vuex';

  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';

  export default {
    props: {},
    data() {
      return {
        // Group
        fileName: '',
        fileAccept: 'image/png, image/jpeg, image/bmp',
        userProfileImageName: '',
        userProfileImageUrl: '',

        // 데이터 객체 모델
        userModel: {
          id: '',
          name: '',
          email: '',
          gender_type: '',
          birth_date: '',
          phone_number: '',
          is_phone_number_public: '',
          postcode: '',
          address: '',
          address_detail: '',
          is_address_public: '',
          church_office_idx: '',
          hobby: '',
          sns_url: '',
        },

        // 유저 프로필 이미지 업로드 정보
        userProfile: {
          file_id: 0,
          file_for: '',
          file_name: '',
          file_title: 'fileTitle',
          file_description: 'fileDescription',
          file_path: '',
          file_size: '',
          file_type: '',
          fileName: '',
          fileObject: null,
          tempUrl: '',
        },

        // 데이터 테이블 (DB저장형식 & 사용자 표현형식 치환을 위한)
        gender_table: [
          { text: '남자', value: 'm' },
          { text: '여자', value: 'f' },
        ],
        is_address_public_table: [
          { text: '공개', value: 'y' },
          { text: '비공개', value: 'n' },
        ],
        is_phone_number_public_table: [
          { text: '공개', value: 'y' },
          { text: '비공개', value: 'n' },
        ],
        church_office_table: [
          { text: '장로', value: 200 },
          { text: '권사', value: 300 },
          { text: '집사', value: 400 },
          { text: '안수집사', value: 401 },
          { text: '성도', value: 500 },
          { text: '청년', value: 600 },
          // { text: "렘넌트", value: 700 },
          // { text: "기관", value: 800 },
          { text: '렘넌트 기관', value: 820 },
          { text: '교역자', value: 100 },
          // { text: "목사", value: 101 },
          // { text: "전도사", value: 102 },
          { text: '기타', value: 900 },
        ],

        // UI 구성을 위한 데이터
        // 데이트 피커
        date: null,
        menu: false,
        modal: false,
        menu2: false,
        // 상단 이미지 홀더
        imageHolderWide: 100,

        // 데이터 입력 규칙
        // 파일 데이터
        fileRules: [
          (value) =>
            !value ||
            value.size < 5000000 ||
            'Avatar size should be less than 2 MB!',
        ],
        // 정보 입력
        rules: {
          name: [(val) => (val || '').length > 0 || 'This field is required'],
          email: [(val) => (val || '').length > 0 || 'This field is required'],
          password: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          password_confirmation: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          gender_type: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          birth_date: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          phone_number: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          is_phone_number_public: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          postcode: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          address: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          address_detail: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
          is_address_public: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
        },

        // 유저 프로필 이미지 업로드
        // AWS-S3
        albumBucketName: 'wisechurch-t-1',
        bucketRegion: 'ap-northeast-2',
        IdentityPoolId: 'ap-northeast-2:5e8b852b-4649-4451-a8e1-a831049355a1',
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo']),
    },
    created() {
      this.getUserInfo();
      // this.getUserProfileImage();
    },
    mixins: [MasterCtrl, FileBins, Utility],
    methods: {
      ...mapActions([
        'hideLogin',
        'login',
        'checkLogin',
        'refreshAccessTokenAtVuex',
        'logout',
      ]),
      async getUserInfo() {
        this.lv1_Func('Comp: UpdateInfoUser', 'getUserInfo()');

        // 1. 유저 데이터 가져오기
        this.lv1_Act('유저 데이터 가져오기');

        this.lv1_SubAct('로컬스토리지의 유저정보 가져오기');
        const loginUserInfo = JSON.parse(localStorage.getItem('user_info'));
        this.lv1_Data('loginUserInfo', loginUserInfo);

        this.lv1_SubAct('데이터베이스의 유저정보 가져오기');
        const userInfo = await this.authReadDataItemById(
          this.User,
          loginUserInfo.id
        );
        this.lv1_Data('userInfo', userInfo);

        // 2. 유저 데이터 세팅하기
        this.lv1_Act('유저 데이터 세팅하기');

        this.userModel.id = userInfo.id;
        this.userModel.name = userInfo.name;
        this.userModel.email = userInfo.email;
        this.userModel.gender_type = userInfo.gender_type;
        this.userModel.birth_date = userInfo.birth_date;
        this.userModel.phone_number = userInfo.phone_number;
        this.userModel.is_phone_number_public = userInfo.is_phone_number_public;
        this.userModel.postcode = userInfo.postcode;
        this.userModel.address = userInfo.address;
        this.userModel.address_detail = userInfo.address_detail;
        this.userModel.is_address_public = userInfo.is_address_public;
        this.userModel.church_office_idx = userInfo.church_office_idx;
        this.userModel.hobby = userInfo.hobby;
        this.userModel.sns_url = userInfo.sns_url;

        // 생년월일 데이터 앞에서 10자리 추출(양식고정)
        this.userModel.birth_date = this.userModel.birth_date.substring(0, 10);

        this.lv1_Data('userModel', this.userModel);

        // 3. 유저 프로필 정보 가져오기
        this.lv1_Act('유저 프로필 정보 가져오기');
        const userFileList = await this.readUserFileList(userInfo.id, 'UP');
        this.lv1_Data('userFileList', userFileList);

        if (userFileList.length > 0) {
          // 파일이 있는 경우
          this.lv1_Case('파일이 있는 경우 : 프로필 이미지 세팅');
          this.userProfile.tempUrl = userFileList[0].file_path;
          this.lv1_Data(
            '프로필 URL : this.userProfile.tempUrl',
            this.userProfile.tempUrl
          );
        } else {
          // 파일이 없는 경우
          this.lv1_Case('파일이 없는 경우 : 디폴트 이미지 세팅');
          this.userProfile.tempUrl =
            'https://images.unsplash.com/photo-1569237616706-9c0969f8899a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80';
          this.lv1_Data(
            '프로필 URL : this.userProfile.tempUrl',
            this.userProfile.tempUrl
          );
        }
      },

      // Btn : 데이터 생성
      async saveUser() {
        this.lv1_Func('Comp: UpdateInfoUser', 'saveUser()');
        if (!(await this.checkEmptyData())) {
          return;
        }

        // 1.유저 업데이트
        this.lv1_Act('유저 업데이트');
        const loginUserInfo = JSON.parse(localStorage.getItem('user_info'));
        const authUpdatedUser = await this.authUpdateData(
          this.User,
          loginUserInfo.id,
          this.userModel
        );
        this.lv1_Data('authUpdatedUser', authUpdatedUser);

        if (loginUserInfo.result !== 0) {
          this.lv1_Case('사용자 데이터를 성공적으로 가져온 경우');
          // 2. 업로드된 이미지 파일이 있다면 이미지 업로드 or 업데이트
          this.lv1_Act('업로드된 이미지 파일이 있다면 이미지 업로드');
          if (this.userProfile.fileObject !== null) {
            this.lv1_Case('새로운 프로필 업로드');
            const userFileList = await this.readUserFileList(
              loginUserInfo.id,
              'UP'
            );
            this.lv1_Data('userFileList', userFileList);

            if (userFileList.length > 0) {
              this.lv1_Case('기존의 파일이 있으면 업데이트 진행');
              const updatedFile = await this.updateFile(
                userFileList[0].id,
                this.userProfile.fileObject,
                this.userProfile.fileName,
                this.userProfile.file_title,
                this.userProfile.file_description
              );
              this.lv1_Data('updatedFile', updatedFile);
            } else {
              this.lv1_Case('기존의 파일이 없으면 업로드 진행');
              const userFile = await this.createUserFile(
                authUpdatedUser.id,
                'UP',
                this.userProfile.fileObject,
                this.userProfile.fileName,
                this.userProfile.file_title,
                this.userProfile.file_description
              );
              this.lv1_Data('userFile', userFile);
            }
          } else {
            this.lv1_Case('업로드한 이미지 없음');
          }
          alert('정보가 정상적으로 변경되었습니다.');
        } else {
          this.lv1_Case('사용자 데이터를 불러오는데 실패한 경우');
          alert('사용자 데이터 로딩 실패');
        }

        // setTimeout(() => this.$router.go(), 300);
      },
      // 빈 데이터 체크
      async checkEmptyData() {
        // 빈 데이터방지 확인

        if (this.userModel.name.trim() == '') {
          alert('이름을 입력하세요.');
          return;
        }
        if (this.userModel.email.trim() == '') {
          alert('이메일을 입력하세요.');
          return false;
        } else {
          // Email 형식검사
          if (
            !this.userModel.email.match(
              /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
            )
          ) {
            alert('이메일 형식이 올바르지 않습니다.');
            return false;
          }
        }
        if (this.userModel.gender_type.trim() == '') {
          alert('성별을 입력하세요.');
          return false;
        }
        if (this.userModel.birth_date.trim() == '') {
          alert('생년월일을 입력하세요.');
          return false;
        }
        if (this.userModel.phone_number.trim() == '') {
          alert('휴대폰번호를 입력하세요.');
          return false;
        }
        if (this.userModel.is_phone_number_public.trim() == '') {
          alert('휴대폰번호 공개여부를 선택하세요.');
          return false;
        }
        if (this.userModel.address.trim() == '') {
          alert('주소를 입력하세요.');
          return false;
        }
        if (this.userModel.address_detail.trim() == '') {
          alert('세부주소를 입력하세요.');
          return false;
        }
        if (this.userModel.is_address_public.trim() == '') {
          alert('주소 공개여부를 입력하세요.');
          return false;
        }
        if (this.userModel.church_office_idx == '') {
          alert('직분을 선택하세요.');
          return false;
        }
        return true;
      },
      // 파일 업로드 헨들러
      async fileHendlerUP() {
        console.log(
          `%c[ Comp: UpdateInfoUser ] fileHendlerUP()`,
          `color:#BFFF00;`
        );
        await this.setTempFileData(
          this.userModel.email,
          'UP',
          this.userProfile,
          true
        );
      },
      // 우편번호 찾기 헨들러
      execDaumPostcode() {
        new window.daum.Postcode({
          oncomplete: (data) => {
            if (this.extraAddress !== '') {
              this.extraAddress = '';
            }
            if (data.userSelectedType === 'R') {
              // 사용자가 도로명 주소를 선택했을 경우
              this.userModel.address = data.roadAddress;
            } else {
              // 사용자가 지번 주소를 선택했을 경우(J)
              this.userModel.address = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
              // 법정동명이 있을 경우 추가한다. (법정리는 제외)
              // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                this.extraAddress += data.bname;
              }
              // 건물명이 있고, 공동주택일 경우 추가한다.
              if (data.buildingName !== '' && data.apartment === 'Y') {
                this.extraAddress +=
                  this.extraAddress !== ''
                    ? `, ${data.buildingName}`
                    : data.buildingName;
              }
              // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
              if (this.extraAddress !== '') {
                this.extraAddress = `(${this.extraAddress})`;
              }
            } else {
              this.extraAddress = '';
            }
            // 우편번호를 입력한다.
            this.userModel.postcode = data.zonecode;
          },
        }).open();
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
