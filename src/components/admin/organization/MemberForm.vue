<template>
  <v-dialog v-model="visible" max-width="600px">
    <v-card rounded="lg">
      <v-card-title class="wc-bold-600">
        <span class="text-h5 font-weight-bold">
          {{ editedMember.userId ? '멤버 수정' : '새로운 인원 등록' }}
        </span>
        <v-row>
          <v-col cols="12" class="pt-1 pb-0">
            <span class="subtitle-2 grey--text text--darken-1">
              {{
                editedMember.userId
                  ? '기존 멤버의 정보를 수정합니다. 변경된 필드는 자동으로 저장됩니다.'
                  : '새로운 인원을 등록합니다. 필수 항목(*)을 모두 입력해야 저장이 가능합니다.'
              }}
            </span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <!-- 상태 토글 스위치 -->
          <v-row class="ma-0 pa-0 pt-3 pb-5 px-5" v-if="editedMember.userId">
            <!-- 카카오톡 단톡방 참여여부 -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-icon size="22" class="mr-2" color="#262626">mdi-chat</v-icon>
              <span class="subtitle-1 font-weight-medium">
                카톡방 참여 여부
              </span>
              <v-spacer></v-spacer>
              <label class="custom-switch mt-0 pt-0">
                <input
                  type="checkbox"
                  :checked="editedMember.isKakaotalkChatMember === 'Y'"
                  @change="
                    editedMember.isKakaotalkChatMember = $event.target.checked
                      ? 'Y'
                      : 'N'
                  "
                />
                <span class="custom-slider"></span>
              </label>
            </v-col>

            <!-- 장결자 여부 -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-icon size="22" class="mr-2" color="#262626">
                mdi-account-check
              </v-icon>
              <span class="subtitle-1 font-weight-medium">장결자 여부</span>
              <v-spacer></v-spacer>
              <label class="custom-switch mt-0 pt-0">
                <input
                  type="checkbox"
                  :checked="editedMember.isLongTermAbsentee === 'Y'"
                  @change="
                    editedMember.isLongTermAbsentee = $event.target.checked
                      ? 'Y'
                      : 'N'
                  "
                />
                <span class="custom-slider"></span>
              </label>
            </v-col>

            <!-- 새가족 여부 -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-icon size="22" class="mr-2" color="#262626">
                mdi-account-multiple-plus
              </v-icon>
              <span class="subtitle-1 font-weight-medium">새가족 여부</span>
              <v-spacer></v-spacer>
              <label class="custom-switch mt-0 pt-0">
                <input
                  type="checkbox"
                  :checked="editedMember.isNewMember === 'Y'"
                  @change="
                    editedMember.isNewMember = $event.target.checked ? 'Y' : 'N'
                  "
                />
                <span class="custom-slider"></span>
              </label>
            </v-col>
          </v-row>

          <!-- 정보입력 -->
          <v-row>
            <v-col cols="12" class="text-center mt-5 px-15">
              <!-- 이름 -->
              <div class="field-title mb-1 text-left">
                이름
                <span class="red--text">*</span>
              </div>
              <v-text-field
                v-model="editedMember.name"
                label="이름 (필수)"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
                required
                :error="validationErrors.name"
                :error-messages="
                  validationErrors.name ? '이름을 입력해주세요' : ''
                "
              ></v-text-field>

              <!-- 동명이인 구분자 -->
              <div class="field-title mb-1 text-left">구분자</div>
              <v-text-field
                v-model="editedMember.nameSuffix"
                label="구분자 (선택, 기본값: FFF)"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
              ></v-text-field>

              <!-- 전화번호 -->
              <div class="field-title mb-1 text-left">
                전화번호
                <span class="red--text">*</span>
              </div>
              <v-text-field
                v-model="editedMember.phoneNumber"
                label="전화번호 (필수)"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
                required
                :error="validationErrors.phoneNumber"
                :error-messages="
                  validationErrors.phoneNumber ? '전화번호를 입력해주세요' : ''
                "
              ></v-text-field>

              <!-- 성별(드롭다운) -->
              <div class="field-title mb-1 text-left">
                성별
                <span class="red--text">*</span>
              </div>
              <v-select
                v-model="editedMember.genderType"
                :items="[
                  { text: '남성', value: 'M' },
                  { text: '여성', value: 'F' },
                ]"
                item-text="text"
                item-value="value"
                label="성별"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
                :error="validationErrors.genderType"
                :error-messages="
                  validationErrors.genderType ? '성별을 선택해주세요' : ''
                "
              ></v-select>

              <!-- 이메일 -->
              <div class="field-title mb-1 text-left">이메일</div>
              <v-text-field
                v-model="editedMember.email"
                label="이메일 (선택, 기본값: email@email.com)"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
              ></v-text-field>

              <!-- 생년월일 -->
              <div class="field-title mb-1 text-left">생년월일</div>
              <v-menu
                v-model="birthDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedMember.birthDate"
                    label="생년월일 (예: 19901201)"
                    color="#7EA394"
                    background-color="#FFFFFF"
                    solo
                    rounded
                    flat
                    dense
                    hide-details="auto"
                    class="mb-7"
                    v-bind="attrs"
                    v-on="on"
                    @input="validateDateFormat('birthDate')"
                    append-icon="mdi-calendar"
                    @click:append="birthDateMenu = true"
                    :error="dateErrors.birthDate"
                    :error-messages="dateErrorMessages.birthDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="pickerBirthDate"
                  no-title
                  @input="handleDatePickerInput('birthDate')"
                ></v-date-picker>
              </v-menu>

              <!-- 교회 등록일 -->
              <div class="field-title mb-1 text-left">교회 등록일</div>
              <v-menu
                v-model="registrationDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedMember.registrationDate"
                    label="교회 등록일 (예: 20230101)"
                    color="#7EA394"
                    background-color="#FFFFFF"
                    solo
                    rounded
                    flat
                    dense
                    hide-details="auto"
                    class="mb-7"
                    v-bind="attrs"
                    v-on="on"
                    @input="validateDateFormat('registrationDate')"
                    append-icon="mdi-calendar"
                    @click:append="registrationDateMenu = true"
                    :error="dateErrors.registrationDate"
                    :error-messages="dateErrorMessages.registrationDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="pickerRegistrationDate"
                  no-title
                  @input="handleDatePickerInput('registrationDate')"
                ></v-date-picker>
              </v-menu>

              <!-- 국적 -->
              <div class="field-title mb-1 text-left">국적</div>
              <v-autocomplete
                v-model="selectedCountry"
                :items="filteredCountryItems"
                item-text="text"
                item-value="value"
                label="국적"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
                clearable
                :menu-props="{ maxHeight: '300px', offsetY: true }"
                :filter="customFilter"
                :search-input.sync="countrySearchInput"
                @change="handleCountryChange"
                @click:clear="clearSelectedCountry"
                return-object
                auto-select-first
                open-on-clear
                cache-items
              ></v-autocomplete>

              <!-- 역할 선택 -->
              <div class="field-title mb-1 text-left">
                역할
                <span class="red--text">*</span>
              </div>
              <v-select
                v-model="editedMember.roleId"
                :items="roleItems"
                item-text="text"
                item-value="value"
                label="역할 (필수)"
                background-color="#FFFFFF"
                color="#7EA394"
                solo
                rounded
                flat
                dense
                hide-details="auto"
                class="mb-7"
                required
                :error="validationErrors.roleId"
                :error-messages="
                  validationErrors.roleId ? '역할을 선택해주세요' : ''
                "
              ></v-select>

              <v-col cols="12" class="pa-15 pt-4 pb-0">
                <v-btn
                  class="mx-auto custom-save-btn"
                  block
                  color="#7EA394"
                  text
                  @click="saveMember"
                  :loading="savingMember"
                >
                  <span class="wc-h3">
                    {{ editedMember.userId ? '데이터 수정' : '데이터 저장' }}
                  </span>
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  // 유틸리티 함수 import
  import { COUNTRY_LIST } from '@/assets/data/countryList';
  import { createDefaultMember } from '@/utils/memberUtils';
  import {
    validateDateFormat,
    validateBirthDate,
  } from '@/utils/dateFormatUtils';

  export default {
    name: 'MemberForm',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
      member: {
        type: Object,
        default: null,
      },
      savingMember: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        editedMember: {
          userId: null,
          name: '',
          nameSuffix: '',
          phoneNumber: '',
          genderType: 'M',
          email: '',
          birthDate: null,
          isNewMember: 'N',
          isLongTermAbsentee: 'N',
          isKakaotalkChatMember: 'N',
          roleId: 74,
          roleName: '순원',
          memberNumber: '',
          registrationDate: null,
          countryCode: 'KOR',
          countryName: '대한민국',
          address: '',
          addressDetail: '',
          postcode: '',
          hobby: '',
          city: null,
          stateProvince: null,
          isAddressPublic: 'N',
          isPhoneNumberPublic: 'N',
          snsUrl: null,
        },
        birthDateMenu: false,
        registrationDateMenu: false,
        pickerBirthDate: null,
        pickerRegistrationDate: null,
        validationErrors: {
          name: false,
          phoneNumber: false,
          genderType: false,
          roleId: false,
        },
        dateErrors: {
          birthDate: false,
          registrationDate: false,
        },
        dateErrorMessages: {
          birthDate: '',
          registrationDate: '',
        },
        roleItems: [
          { text: '그룹장', value: 72 },
          { text: '부순장', value: 73 },
          { text: '순원', value: 74 },
        ],
        countryItems: COUNTRY_LIST,
        countrySearchInput: '',
        selectedCountry: null,
        pendingCustomItem: null,
      };
    },

    computed: {
      visible: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },

      // 검색어에 따라 필터링된 국가 목록
      filteredCountryItems() {
        // 검색어가 없으면 전체 국가 목록 반환
        if (!this.countrySearchInput || this.countrySearchInput.trim() === '') {
          return this.countryItems;
        }

        const searchText = this.countrySearchInput.toLowerCase().trim();

        // 기존 국가 목록에서 검색어를 포함하는 항목 필터링
        const filteredItems = this.countryItems.filter((item) =>
          item.text.toLowerCase().includes(searchText)
        );

        // 검색어와 정확히 일치하는 항목이 있는지 확인
        const exactMatch = this.countryItems.find(
          (item) => item.text.toLowerCase() === searchText
        );

        // 검색어와 일치하는 항목이 없고, 직접 입력 값이 있는 경우
        if (!exactMatch && searchText.length > 0) {
          // 사용자 정의 항목 생성 (중요: 다른 항목과 형식 일치)
          const customItem = {
            text: this.countrySearchInput,
            value: 'ETC',
            custom: true,
          };

          // 직접 입력한 값을 리스트 최상단에 표시
          return [customItem, ...filteredItems];
        }

        return filteredItems;
      },
    },

    watch: {
      member: {
        handler(newVal) {
          console.group('MemberForm - member prop 변경');

          if (newVal) {
            // 기존 멤버 수정 - 깊은 복사로 데이터 복제
            this.editedMember = JSON.parse(JSON.stringify(newVal));

            // 기존 날짜 데이터가 있고 하이픈(-) 형식이면 YYYYMMDD 형식으로 변환
            if (
              this.editedMember.birthDate &&
              this.editedMember.birthDate.includes('-')
            ) {
              const [year, month, day] = this.editedMember.birthDate.split('-');
              this.editedMember.birthDate = `${year}${month}${day}`;
            }

            if (
              this.editedMember.registrationDate &&
              this.editedMember.registrationDate.includes('-')
            ) {
              const [year, month, day] =
                this.editedMember.registrationDate.split('-');
              this.editedMember.registrationDate = `${year}${month}${day}`;
            }

            // 국가 코드에 해당하는 selectedCountry 설정
            if (this.editedMember.countryCode) {
              const country = this.countryItems.find(
                (item) => item.value === this.editedMember.countryCode
              );
              if (country) {
                this.selectedCountry = country;
              }
            }
          } else {
            // 새 멤버 추가 - 유틸리티 함수 사용
            this.editedMember = createDefaultMember();

            // 기본 국가 설정
            this.selectedCountry = this.countryItems.find(
              (item) => item.value === 'KOR'
            );
          }

          // 유효성 검사 오류 초기화
          this.validationErrors = {
            name: false,
            phoneNumber: false,
            genderType: false,
            roleId: false,
          };

          // 날짜 오류 초기화
          this.dateErrors = {
            birthDate: false,
            registrationDate: false,
          };
          this.dateErrorMessages = {
            birthDate: '',
            registrationDate: '',
          };
        },
        immediate: true,
      },

      // 데이트 피커 값 초기화를 위한 watch
      'editedMember.birthDate': {
        handler(val) {
          if (val && val.length === 8) {
            // YYYYMMDD 형식을 YYYY-MM-DD로 변환 (데이트피커용)
            const year = val.substring(0, 4);
            const month = val.substring(4, 6);
            const day = val.substring(6, 8);
            this.pickerBirthDate = `${year}-${month}-${day}`;
          }
        },
        immediate: true,
      },

      'editedMember.registrationDate': {
        handler(val) {
          if (val && val.length === 8) {
            // YYYYMMDD 형식을 YYYY-MM-DD로 변환 (데이트피커용)
            const year = val.substring(0, 4);
            const month = val.substring(4, 6);
            const day = val.substring(6, 8);
            this.pickerRegistrationDate = `${year}-${month}-${day}`;
          }
        },
        immediate: true,
      },

      // 국가 선택 변경 감지
      selectedCountry: {
        handler(newVal) {
          if (!newVal) {
            this.editedMember.countryCode = '';
            this.editedMember.countryName = '';
            return;
          }

          if (typeof newVal === 'object') {
            this.editedMember.countryCode = newVal.value;
            this.editedMember.countryName = newVal.text;
          }
        },
        deep: true,
      },

      // 검색어에 따른 자동 선택
      countrySearchInput: {
        handler(newVal) {
          if (!newVal || newVal.trim() === '') return;

          // 정확히 일치하는 국가가 있는지 확인
          const exactMatch = this.countryItems.find(
            (item) => item.text.toLowerCase() === newVal.toLowerCase().trim()
          );

          if (exactMatch) {
            // 이미 선택된 값과 다른 경우에만 업데이트
            if (
              !this.selectedCountry ||
              this.selectedCountry.text !== exactMatch.text
            ) {
              this.selectedCountry = exactMatch;
            }
          }
        },
        immediate: false,
      },
    },

    mounted() {
      // 국가 초기값 설정
      if (this.editedMember.countryCode) {
        const country = this.countryItems.find(
          (item) => item.value === this.editedMember.countryCode
        );
        if (country) {
          this.selectedCountry = country;
        }
      }
    },

    methods: {
      // 필드 유효성 검사 메서드
      validateFields() {
        // 00000000000도 유효한 전화번호로 인정
        this.validationErrors = {
          name: !this.editedMember.name || this.editedMember.name.trim() === '',
          phoneNumber:
            !this.editedMember.phoneNumber ||
            this.editedMember.phoneNumber.trim() === '',
          genderType: !this.editedMember.genderType,
          roleId: !this.editedMember.roleId,
        };

        console.groupEnd();

        return !Object.values(this.validationErrors).some((v) => v === true);
      },

      saveMember() {
        // 날짜 필드의 유효성 다시 확인
        if (this.editedMember.birthDate) {
          this.validateDateFormat('birthDate');
        }
        if (this.editedMember.registrationDate) {
          this.validateDateFormat('registrationDate');
        }

        // 날짜 필드 오류 확인
        const hasDateErrors =
          this.dateErrors.birthDate || this.dateErrors.registrationDate;

        if (this.validateFields() && !hasDateErrors) {
          this.$emit('save', this.editedMember);
        } else {
          // 검증 실패 시 오류 메시지를 부모 컴포넌트에 전달
          let validationErrors = this.validationErrors;

          // 날짜 오류 정보 추가
          if (hasDateErrors) {
            const errorMessage = this.dateErrors.birthDate
              ? this.dateErrorMessages.birthDate
              : this.dateErrorMessages.registrationDate;

            validationErrors = {
              ...validationErrors,
              dateError: true,
              dateErrorMessage: errorMessage,
            };
          }

          this.$emit('validation-failed', validationErrors);
        }
      },

      // 주소 검색 기능
      execDaumPostcode() {
        if (window.daum && window.daum.Postcode) {
          new window.daum.Postcode({
            oncomplete: (data) => {
              let roadAddr = data.roadAddress;
              let extraRoadAddr = '';

              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
              }
              if (data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr +=
                  extraRoadAddr !== ''
                    ? ', ' + data.buildingName
                    : data.buildingName;
              }
              if (extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
              }

              this.editedMember.postcode = data.zonecode;
              this.editedMember.address = roadAddr;

              this.$nextTick(() => {
                const addressDetailField = document.querySelector(
                  'input[v-model="editedMember.addressDetail"]'
                );
                if (addressDetailField) {
                  addressDetailField.focus();
                }
              });
            },
          }).open();
        } else {
          this.$store.dispatch('snackbar/showMessage', {
            message:
              '주소 검색 서비스를 로드할 수 없습니다. 직접 입력해주세요.',
            color: 'warning',
          });
        }
      },

      /**
       * 날짜 형식 검증
       * @param {string} field - 검증할 필드명
       */
      validateDateFormat(field) {
        if (!this.editedMember[field]) {
          this.dateErrors[field] = false;
          this.dateErrorMessages[field] = '';
          return;
        }

        // 유틸리티 함수 사용
        const result =
          field === 'birthDate'
            ? validateBirthDate(this.editedMember[field])
            : validateDateFormat(this.editedMember[field]);

        this.dateErrors[field] = !result.isValid;
        this.dateErrorMessages[field] = result.error;
      },

      handleDatePickerInput(field) {
        if (field === 'birthDate') {
          // 캘린더에서 선택된 YYYY-MM-DD 형식을 YYYYMMDD로 변환
          if (this.pickerBirthDate) {
            const [year, month, day] = this.pickerBirthDate.split('-');
            this.editedMember.birthDate = `${year}${month}${day}`;
            this.birthDateMenu = false;
          }
        } else if (field === 'registrationDate') {
          // 캘린더에서 선택된 YYYY-MM-DD 형식을 YYYYMMDD로 변환
          if (this.pickerRegistrationDate) {
            const [year, month, day] = this.pickerRegistrationDate.split('-');
            this.editedMember.registrationDate = `${year}${month}${day}`;
            this.registrationDateMenu = false;
          }
        }

        // 날짜 형식 검증
        this.validateDateFormat(field);
      },

      customFilter(item, queryText) {
        if (!queryText) return true;

        const text = item.text.toString().toLowerCase();
        const query = queryText.toString().toLowerCase();

        return text.indexOf(query) > -1;
      },

      handleCountryChange(value) {
        // 값이 없으면 초기화
        if (!value) {
          this.editedMember.countryCode = '';
          this.editedMember.countryName = '';
          this.selectedCountry = null;
          return;
        }

        // 선택된 객체 처리 (return-object 속성으로 인해 항상 객체 형태)
        if (typeof value === 'object') {
          this.editedMember.countryCode = value.value;
          this.editedMember.countryName = value.text;
        }
      },

      clearSelectedCountry() {
        this.editedMember.countryCode = '';
        this.editedMember.countryName = '';
        this.selectedCountry = null;
        this.countrySearchInput = ''; // 검색어도 함께 초기화
      },
    },
  };
</script>

<style scoped>
  /* 필드 제목 스타일 */
  .field-title {
    font-weight: 500;
    font-size: 0.95rem;
    color: #444;
    margin-left: 5px;
  }

  /* 토글 스위치 스타일 */
  .custom-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .custom-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .custom-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .custom-slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .custom-slider {
    background-color: #7ea394;
  }

  input:focus + .custom-slider {
    box-shadow: 0 0 1px #7ea394;
  }

  input:checked + .custom-slider:before {
    transform: translateX(26px);
  }

  /* 커스텀 저장 버튼 스타일 */
  .custom-save-btn {
    height: 50px !important;
    border-radius: 20px !important;
    background-color: #7ea394 !important;
    color: white !important;
    font-weight: 500 !important;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
  }

  .custom-save-btn:hover {
    background-color: #6a8d82 !important;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .custom-save-btn:disabled {
    background-color: #cccccc !important;
    color: #888888 !important;
  }

  .bg-transparent {
    background-color: transparent !important;
  }
</style>
