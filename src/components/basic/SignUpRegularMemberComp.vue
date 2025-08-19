<template>
  <v-card class="wc-card">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="ma-0 mt-16 pa-3" cols="5" lg="2" xl="2" md="2" sm="5">
          <v-card class="ma-1 pa-1 ih-layer-1">
            <v-card class="ih-layer-2">
              <v-img
                lazy-src=""
                src="https://images.unsplash.com/photo-1638913662252-70efce1e60a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                aspect-ratio="1"
                rounded
              ></v-img>
            </v-card>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-4 pl-5 pb-5" cols="12">
          <div class="mt-3 wc-h2 text-center">정회원 등록</div>
          <div class="mt-1 wc-info-light text-center">
            membership registration step 5
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="pa-10 pb-8" cols="12" xl="8" lg="8" md="8" sm="12">
          <v-text-field
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            outlined
            dense
            hide-details="auto"
            v-model="addressDetails"
            label="예금주 이름을 입력하세요"
            class="mb-8"
          ></v-text-field>
          <v-select
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            outlined
            dense
            label="은행을 선택하세요"
            :items="bank_table"
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
            hide-details="auto"
            v-model="addressDetails"
            label="계좌번호를 입력하세요"
            class="mb-8"
          ></v-text-field>
          <v-select
            background-color="#edeef3"
            color="#7EA394"
            solo
            rounded
            flat
            outlined
            dense
            label="월 0000원 회비 납부에 동의합니다"
            :items="consent_table"
            hide-details="auto"
            class="mb-8"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col class="px-10 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
          <!--Element : Basic Button -->
          <v-btn class="wc-btn wc-btn-green" color="#fff" rounded block>
            <span class="wc-h5 white--text">산업정보 등록</span>
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import '@/styles/overrides.scss';
  export default {
    props: {},
    data() {
      return {
        bank_table: [
          {
            text: 'Bank',
            value: 'bank',
          },
        ],
        consent_table: [
          {
            text: '예',
            value: 'y',
          },
          {
            text: '아니오',
            value: 'n',
          },
        ],
      };
    },
    methods: {
      execDaumPostcode() {
        new window.daum.Postcode({
          oncomplete: (data) => {
            if (this.extraAddress !== '') {
              this.extraAddress = '';
            }
            if (data.userSelectedType === 'R') {
              // 사용자가 도로명 주소를 선택했을 경우
              this.address = data.roadAddress;
            } else {
              // 사용자가 지번 주소를 선택했을 경우(J)
              this.address = data.jibunAddress;
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
            this.postcode = data.zonecode;
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
