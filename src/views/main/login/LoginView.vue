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
        <!-- {{ email }} -->
        <!-- 이메일 입력 필드 -->
        <v-text-field
          v-model="email"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          label="터치해서 이메일을 입력하세요"
          hide-details="auto"
          class="mb-4 mx-auto bg-transparent"
        ></v-text-field>

        <!-- 비밀번호 입력 필드 -->
        <v-text-field
          v-model="password"
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          dense
          label="터치해서 비밀번호를 입력하세요"
          hide-details="auto"
          class="mb-7 mx-auto bg-transparent"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <div v-if="loginCheckMessage" class="ma-auto error--text">
          {{ loginCheckMessage }}
        </div>

        <v-row class="mt-2">
          <v-col cols="12" sm="6" class="pa-1 pa-sm-0">
            <v-btn
              text
              class="text-decoration-none text-caption text-sm-body-2"
              color="primary"
              @click="$router.push('/name-input')"
              block
            >
              이메일과 비밀번호가 없나요?
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="pa-1 pa-sm-0">
            <v-btn
              text
              class="text-decoration-none text-caption text-sm-body-2"
              color="primary"
              @click="
                $router.push({
                  name: 'NameInputView',
                  query: { isPasswordRecovery: true },
                })
              "
              block
            >
              비밀번호를 잃어버렸어요.
            </v-btn>
          </v-col>
        </v-row>
        <br />
        <!-- 안내 텍스트 -->
        <div class="ma-auto grey--text mb-0 fadeIn">
          <strong>믿음의 눈</strong>
          으로
          <strong>약속의 땅</strong>
          을 차지할
          <br />
          <strong>하나님 나라의 청년!</strong>
        </div>
      </v-col>
      <!-- 공간을 채우기 위한 스페이서 -->
      <v-spacer></v-spacer>
      <!-- 하단 컨텐츠 -->
      <v-col cols="12" class="pa-15 pb-0">
        <!-- 버튼 -->
        <v-btn class="mx-auto wc-btn" rounded block large @click="fnLogin()">
          <span class="wc-h3">다음으로</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // "@/styles/overrides.scss" 파일을 import합니다.
  // 이 파일은 스타일 오버라이드를 위한 SCSS 파일입니다.
  import '@/styles/overrides.scss';

  // Vuex의 mapState와 mapActions를 import합니다.
  // mapState는 Vuex 저장소의 상태를 컴포넌트의 computed 속성에 매핑하는 데 사용됩니다.
  // mapActions는 Vuex 저장소의 액션을 컴포넌트의 methods에 매핑하는 데 사용됩니다.
  import { mapActions, mapState } from 'vuex';

  // DataSetting 믹신을 "@/mixins/dataset/DataSetting"에서 import합니다.
  // 이 믹신은 데이터 CRUD(Create, Read, Update, Delete) 작업을 위한 메서드를 제공합니다.
  import { DataSetting } from '@/mixins/dataset/DataSetting';

  // AuthCtrl 믹신을 "@/mixins/apis_v2/internal/AuthCtrl"에서 import합니다.
  // 이 믹신은 계정 관련 API 호출을 위한 메서드를 제공합니다.
  import { AuthCtrl } from '@/mixins/apis_v2/internal/domainCtrl/AuthCtrl';

  // FileBins 믹신을 "@/mixins/apis_v2/internal/FileBins"에서 import합니다.
  // 이 믹신은 파일 제어를 위한 메서드를 제공합니다.
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';

  // Utility 믹신을 "@/mixins/apis_v2/utility/Utility"에서 import합니다.
  // 이 믹신은 유틸리티 메서드를 제공합니다.
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  // import Login from "@/views/clean/archive/Login.vue";

  // Vue 컴포넌트를 정의합니다.
  export default {
    // 컴포넌트의 이름을 "LoginView"로 설정합니다.
    name: 'LoginView',

    // 컴포넌트의 데이터 속성을 정의합니다.
    data() {
      return {
        // 검색 키워드를 저장할 변수입니다.
        keyword: '',
        // 사용자 프로필 이미지를 저장할 배열입니다.
        userProfileImage: [],
        // 프로필 이미지의 파일 경로를 저장할 변수입니다.
        profileFilepath: '',
        // 사용자 이름을 저장할 변수입니다.
        name: '',
        // 이메일을 저장할 변수입니다.
        email: '',
        // 비밀번호를 저장할 변수입니다.
        password: '',
        // 비밀번호 표시 여부를 저장할 변수입니다.
        showPassword: false,
        // 로그인 관련 안내 메세지
        loginCheckMessage: '',
      };
    },

    // 컴포넌트의 computed 속성을 정의합니다.
    computed: {
      // Vuex 저장소의 "auth" 모듈에서 "userName" 상태를 매핑합니다.
      ...mapState('auth', ['userName']),
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
      ...mapActions('auth', ['setUserName', 'setUserList']),

      // 사용자 이름 중복 체크를 수행하는 비동기 메서드입니다.
      async fnLogin() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 이메일이 비어있는 경우 알림을 표시하고 함수를 종료합니다.
        if (this.email.trim() === '') {
          this.loginCheckMessage = '이메일을 입력해주세요.';
          return;
        } else if (!emailRegex.test(this.email)) {
          this.loginCheckMessage = '올바른 이메일 형식을 입력해주세요.';
          return;
        }

        // 비밀번호가 비어있는 경우 알림을 표시하고 함수를 종료합니다.
        if (this.password.trim() === '') {
          this.loginCheckMessage = '비밀번호를 입력해주세요.';
          return;
        }

        try {
          // 로그인 API 호출
          const response = await this.authLogin(this.email, this.password);
          if (response.success) {
            // 메인 페이지로 이동
            this.$router.push({ name: 'ServiceSelectionView' });
          } else {
            // 로그인 실패 시 에러 메시지 표시
            this.loginCheckMessage = response.message;
          }
        } catch (error) {
          console.error('Login error:', error.message);
          this.loginCheckMessage = '로그인 중 오류가 발생했습니다.';
        }
      },
    },
  };
</script>

<style scoped>
  /* 스타일은 Vuetify 클래스를 사용하여 이미 정의되어 있으므로 추가적인 스타일링이 필요하지 않을 수 있습니다. 필요하다면 여기에 추가하세요. */
</style>
