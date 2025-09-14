<template>
  <v-container class="pa-10">
    <v-row class="mt-10 mb-10">
      <v-col cols="12">
        <span class="wc-h2"> ELEMENT </span><br />
        <span class="wc-st1"> UI / UX Element </span><br />
      </v-col>
    </v-row>
    <!--Element : Typography -->
    <v-row class="mb-10">
      <v-col cols="12">
        <span class="wc-h4"> TYPOGRAPHY </span><br />
        <span class="wc-st1"> Typography for Wise Church </span><br />
      </v-col>
      <v-col cols="12">
        <span class="wc-h1"> Title </span><br />
        <span class="wc-h2"> Title </span><br />
        <span class="wc-h2-m"> Title </span><br />
        <span class="wc-h3"> Title </span><br />
        <span class="wc-h4"> Title </span><br />
        <span class="wc-h5"> Title </span><br />

        <span class="wc-st1"> Title </span><br />
        <span class="wc-st2"> Title </span><br />

        <span class="wc-tb1"> Title </span><br />
        <span class="wc-tb2"> Title </span><br />
        <span class="wc-tb3"> Title </span><br />

        <span class="wc-body1"> Title </span><br />
        <span class="wc-body2"> Title </span><br />

        <span class="wc-placeholder"> Title </span><br />

        <span class="wc-info"> Title </span><br />
        <span class="wc-caption"> Title </span><br />

        <span class="wc-topmenu-active"> Title </span><br />
        <span class="wc-topmenu-default"> Title </span><br />
        <span class="wc-sidemenu-active"> Title </span><br />
        <span class="wc-sidemenu-default"> Title </span><br />
      </v-col>
    </v-row>
    <!--Element : Card -->
    <v-row class="mb-10">
      <v-col class="mb-5" cols="12">
        <span class="wc-h4"> Card </span><br />
        <span class="wc-st1"> Card for Wise Church </span><br />
      </v-col>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-card class="pa-16 wc-card"> Card </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-card class="pa-16 wc-card"> Card </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-card class="pa-16 wc-card"> Card </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-card class="pa-16 wc-card"> Card </v-card>
      </v-col>
    </v-row>
    <!--Element : Input -->
    <v-row class="mb-10">
      <v-col cols="12">
        <span class="wc-h4"> Input </span><br />
        <span class="wc-st1"> Input for Wise Church </span><br />
      </v-col>
      <!-- Element : v-text-field -->
      <v-col class="mb-5" cols="12">
        <v-text-field
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          label="레이블이 입력됩니다"
          hide-details="auto"
          class="mb-5"
        ></v-text-field>
      </v-col>
      <!-- Element : v-textarea -->
      <v-col class="mb-5" cols="12">
        <v-textarea
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          label="레이블이 입력됩니다"
          hide-details="auto"
          class="mb-5"
        ></v-textarea>
      </v-col>
      <!-- Element : v-file-input -->
      <v-col class="mb-5" cols="12">
        <v-file-input
          accept="image/*"
          label="File input"
          background-color="#edeef3"
          color="#7EA394"
          flat
          solo
          rounded
          outlined
          dense
        ></v-file-input>
      </v-col>
      <!-- Element : v-select -->
      <v-col class="mb-5" cols="12">
        <v-select
          background-color="#edeef3"
          color="#7EA394"
          solo
          rounded
          flat
          outlined
          dense
          label="레이블이 입력됩니다"
          :items="items"
          hide-details="auto"
          class="mb-5"
        ></v-select>
      </v-col>
      <!-- Element : v-date-picker -->
      <v-col class="mb-5" cols="12">
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
              v-model="date"
              label="날짜를 선택하세요"
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
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <!-- Element : 주소검색 -->
      <v-col class="mb-5" cols="12">
        <v-text-field
          v-model="postcode"
          label="우편번호를 검색하세요"
          @click="execDaumPostcode()"
          class="mb-5"
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
          v-model="address"
          label="주소를 검색하세요"
          @click="execDaumPostcode()"
          class="mb-5"
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
          v-model="addressDetails"
          label="세부주소를 입력하세요"
          class="mb-5"
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
    </v-row>
    <!--Element : Button -->
    <v-row class="mb-10">
      <v-col class="mb-5" cols="12">
        <span class="wc-h4"> Button </span><br />
        <span class="wc-st1"> Button for Wise Church </span><br />
      </v-col>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <!--Element : Basic Button -->
        <v-btn
          :key="icon"
          class="wc-btn wc-btn-green"
          color="#fff"
          rounded
          block
        >
          <span class="wc-h5 white--text"> 플래인맛임 </span>
        </v-btn>
      </v-col>
      <!--Element : Big Round Button -->
      <v-col class="mb-5" cols="12" xl="1" lg="1" md="4" sm="12">
        <v-fab-transition>
          <v-btn fab large bottom left class="wc-btn wc-btn-green">
            <span class="wc-h5 white--text"> 수정 </span>
          </v-btn>
        </v-fab-transition>
      </v-col>
      <!--Element : Round Button -->
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-btn class="mx-4 wc-btn" color="#7D9AA5" icon>
          <v-icon size="24px "> mdi-facebook </v-icon>
        </v-btn>
        <v-btn class="mx-4 wc-btn" color="#7D9AA5" icon>
          <v-icon size="24px "> mdi-instagram </v-icon>
        </v-btn>
      </v-col>
      <!--Element : text Button -->
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <v-btn class="mx-3" color="#8a98a5 wc-tb1" text small plain>
          <span class="wc-tb1"> 텍스트 버튼 </span>
        </v-btn>
        <v-btn class="mx-3" color="#8a98a5 wc-tb2" text small plain>
          <span class="wc-tb2"> 텍스트 버튼 </span>
        </v-btn>
        <v-btn class="mx-3" color="#8a98a5 wc-tb3" text small plain>
          <span class="wc-tb3"> 텍스트 버튼 </span>
        </v-btn>
      </v-col>
    </v-row>
    <!--Element : Image Holder -->
    <v-row>
      <v-col class="mb-5" cols="3">
        <v-card class="pa-3 ih-layer-1">
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
      <v-col class="mb-5" cols="2">
        <v-card class="pa-2 ih-layer-1">
          <v-card class="ih-layer-2">
            <v-img
              lazy-src=""
              src="https://images.unsplash.com/photo-1638913662252-70efce1e60a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              aspect-ratio="1"
            ></v-img>
          </v-card>
        </v-card>
      </v-col>
      <v-col class="mb-5" cols="1">
        <v-card class="pa-1 ih-layer-1">
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
    </v-row>
    <!--Element : Typography -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <WorkListItem
          :userProfile="'userProfile'"
          :userName="'userName'"
          :userInfo="'userInfo'"
          :companyName="'companyName'"
          :workDescription="'workDescription'"
          :tel="'conpanyTel'"
        ></WorkListItem>
      </v-col>
    </v-row>
    <!--Element : PotoBox -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="7" lg="7" md="8" sm="12">
        <PotoBox
          :imgUrl="'https://images.unsplash.com/photo-1561016444-14f747499547?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80'"
        ></PotoBox>
      </v-col>
    </v-row>
    <!--Element : UserProfileBox -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <UserProfileBox
          :userProfile="'userProfile'"
          :userName="'userName'"
          :jopPosition="'직급명'"
          :churchOffice="'직분명'"
          :organization="'기관명'"
          :phoneNumber="'phoneNumber'"
          :address="'address'"
        ></UserProfileBox>
      </v-col>
    </v-row>
    <!--Element : UserProfileBox -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <TopicBox
          :TopicTitle="'TopicTitle'"
          :TopicSubTitle="'TopicSubTitle'"
          :TopicDescription="'이 곳에는 해당 토픽에 대한 설명이 들어가게됩니다.'"
          :TopicInfo="'TopicInfo'"
        ></TopicBox>
      </v-col>
    </v-row>
    <!--Element : Portfolio -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="3" lg="3" md="4" sm="12">
        <Portfolio
          :portfolioTitle="'portfolioTitle'"
          :portfolioDescription="'portfolioDescription'"
        ></Portfolio>
      </v-col>
    </v-row>
    <!-- Component : Login -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="5" lg="4" md="5" sm="12">
        <LoginComp :userEmail="'userEmail'" :userPW="'userPW'"></LoginComp>
      </v-col>
    </v-row>
    <!-- Component : ResetPWInfo -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="5" lg="4" md="5" sm="12">
        <ResetPWInfo :userEmail="'userEmail'"></ResetPWInfo>
      </v-col>
    </v-row>
    <!-- 회원가입 Component -->
    <!-- STEP 1 -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="8" lg="8" md="8" sm="12">
        <SignUpComfirm
          :title="'title'"
          :subTitle="'subTitle'"
          :bodyTitle="'bodyTitle'"
          :bodyText="'bodyText'"
        ></SignUpComfirm>
      </v-col>
    </v-row>
    <!-- STEP 2 -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="8" lg="8" md="8" sm="12">
        <SignUpComfirm
          :title="'title'"
          :subTitle="'subTitle'"
          :bodyTitle="'bodyTitle'"
          :bodyText="'bodyText'"
        ></SignUpComfirm>
      </v-col>
    </v-row>
    <!-- STEP 3 -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="10" lg="10" md="" sm="12">
        <SignUpUser></SignUpUser>
      </v-col>
    </v-row>
    <!-- STEP 4 -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="10" lg="10" md="" sm="12">
        <SignUpWork></SignUpWork>
      </v-col>
    </v-row>
    <!-- STEP 5 -->
    <v-row>
      <v-col class="mb-5" cols="12" xl="10" lg="10" md="" sm="12">
        <SignUpRegularMember></SignUpRegularMember>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/styles/overrides.scss";
import WorkListItem from "@/components/basic/WorkListItemComp.vue";
import PotoBox from "@/components/basic/PotoBoxComp.vue";
import UserProfileBox from "@/components/basic/UserProfileBoxComp.vue";
import TopicBox from "@/components/basic/TopicBoxComp.vue";
import Portfolio from "@/components/basic/PortfolioComp.vue";
import LoginComp from "@/components/basic/LoginComp.vue";
import ResetPWInfo from "@/components/basic/ResetPWInfoComp.vue";
import SignUpComfirm from "@/components/basic/SignUpComfirmComp.vue";
import SignUpUser from "@/components/basic/SignUpUserComp.vue";
import SignUpWork from "@/components/basic/SignUpWorkComp.vue";
import SignUpRegularMember from "@/components/basic/SignUpRegularMemberComp.vue";

export default {
  name: "HomeView",
  components: {
    WorkListItem,
    PotoBox,
    UserProfileBox,
    Portfolio,
    LoginComp,
    ResetPWInfo,
    SignUpComfirm,
    SignUpUser,
    SignUpWork,
    SignUpRegularMember,
    TopicBox,
  },
  data() {
    return {
      items: [
        { text: "Item 1", value: "item1" },
        { text: "Item 2", value: "item2" },
        { text: "Item 3", value: "item3" },
      ],
      // rules: [(v) => !!v || "Required"],
      // datepicker
      date: null,
      menu: false,
      modal: false,
      menu2: false,
      // postcode
      postcode: "",
      address: "",
      extraAddress: "",
      addressDetails: "",
      // Image Holder
      imageHolderWide: 100,
    };
  },
  methods: {
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
  },
};
</script>

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
