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
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="ma-0 mt-3 pa-3" cols="7" lg="2" xl="2" md="2" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1601933470198-75ebdfa8e740?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470"
                  aspect-ratio="1"
                  rounded
                ></v-img>
              </v-card>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col class="ma-0 mb-4 pa-4 pl-5 pb-3" cols="12">
            <div class="mt-3 wc-h2 text-center">산업인 정보 등록</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 4
            </div>
            <div class="mt-7 wc-info-light text-center">
              입력하신 정보들은 산업인 검색에 사용되니
              <br />
              최대한 꼼꼼하게 작성해주세요
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pa-4 pb-8" cols="12" xl="8" lg="8" md="8" sm="12">
            <div class="pa-5 mb-5 text-center wc-info2">
              필수 입력사항입니다
            </div>
            <v-text-field
              v-model="company_name"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="회사 이름을 입력하세요"
              hide-details="auto"
              class="mb-8"
              :rules="requiredRule.required"
            ></v-text-field>
            <v-select
              v-model="business_domain_lv1_idx"
              :items="business_domain_lv1_table"
              label="비즈니스 대분류를 선택하세요"
              hide-details="auto"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
            ></v-select>

            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="비즈니스 소분류를 선택하세요"
              :items="business_domain_lv2_table"
              v-model="business_domain_lv2_idx"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="회사,업무의 유형을 선택하세요"
              :items="work_table"
              v-model="work_type"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="직급을 선택하세요"
              :items="job_position_table"
              v-model="job_position_idx"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="경력을 선택하세요"
              :items="career_table"
              v-model="career_type"
              hide-details="auto"
              class="mb-16"
            ></v-select>

            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="산업 전화번호를 입력하세요(-제외)"
              v-model="tel"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-container class="ma-0 pa-3">
              <v-row>
                <v-col class="ma-0 pa-0" cols="7">
                  <v-text-field
                    v-model="working_place_postcode"
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
                    <span class="wc-h5 white--text">우편번호 검색</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-text-field
              v-model="working_place_address"
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
              v-model="working_place_address_detail"
              label="세부주소를 입력하세요"
              class="mb-16"
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
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="work_description"
              v-model="work_description"
              label="사업,직무 한 줄 설명을 입력하세요"
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
              hide-details="auto"
              v-model="editedItemBusinessKeywords"
              label="검색에 사용될 키워드를 입력 (,로 구분)"
              class="mb-16"
            ></v-text-field>
            <div class="pa-5 mb-5 text-center wc-info2">
              선택 입력사항입니다
            </div>
            <!-- 홍보 URL -->
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
              v-model="uri_instagram"
              label="인스타그램 URL을 입력하세요"
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
              hide-details="auto"
              v-model="uri_homepage"
              label="홈페이지 URL을 입력하세요"
              class="mb-16"
            ></v-text-field>
            <!-- 이미지파일 업로드 -->
            <v-card class="wc-card pa-2 mb-8">
              <v-img
                lazy-src=""
                min-height="300"
                :src="workRefImg.tempUrl"
                rounded
                aspect-ratio="1.7"
              >
                <!-- 산업 대표 이미지 등록 -->
              </v-img>
            </v-card>
            <v-file-input
              v-model="workRefImg.fileObject"
              :accept="fileAccept"
              @change="fileHendlerWR()"
              label="산업 대표 제품,서비스 이미지 업로드"
              background-color="#edeef3"
              color="#7EA394"
              flat
              solo
              rounded
              outlined
              dense
              class="mb-8"
            ></v-file-input>
            <!-- 이미지등록 -->
            <v-row>
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[0].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[0].fileObject"
                  @change="fileHendlerWP1()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  v-model="portfolioList[0].file_title"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[0].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[0].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[0].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[1].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[1].fileObject"
                  @change="fileHendlerWP2()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[1].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[1].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[1].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[1].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[2].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[2].fileObject"
                  @change="fileHendlerWP3()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[2].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[2].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[2].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[2].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[3].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[3].fileObject"
                  @change="fileHendlerWP4()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[3].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[3].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[3].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[3].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[4].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[4].fileObject"
                  @change="fileHendlerWP5()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[4].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[4].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[4].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[4].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="6">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[5].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[5].fileObject"
                  @change="fileHendlerWP6()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[5].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[5].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[5].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-0"
                  :disabled="portfolioList[5].fileObject == null"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-3 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              color="#fff"
              rounded
              block
              @click="saveWork()"
            >
              <span class="wc-h5 white--text">산업인 정보 등록</span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-if="!this.$vuetify.breakpoint.smAndDown" class="wc-card">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="ma-0 mt-16 pa-3" cols="5" lg="2" xl="2" md="2" sm="5">
            <v-card class="ma-1 pa-1 ih-layer-1">
              <v-card class="ih-layer-2">
                <v-img
                  lazy-src=""
                  src="https://images.unsplash.com/photo-1601933470198-75ebdfa8e740?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470"
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
            <div class="mt-3 wc-h2 text-center">산업인 정보 등록</div>
            <div class="mt-1 wc-info-light text-center">
              membership registration step 4
            </div>
            <div class="mt-7 wc-info-light text-center">
              입력하신 정보들은 산업인 검색에 사용되니
              <br />
              최대한 꼼꼼하게 작성해주세요
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-spacer></v-spacer>
          <v-col class="pa-10 pb-8" cols="12" xl="8" lg="8" md="8" sm="12">
            <div class="pa-5 mb-5 text-center wc-info2">
              필수 입력사항입니다
            </div>
            <v-text-field
              v-model="company_name"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="회사 이름을 입력하세요"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-select
              v-model="business_domain_lv1_idx"
              :items="business_domain_lv1_table"
              label="비즈니스 대분류를 선택하세요"
              hide-details="auto"
              class="mb-8"
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="비즈니스 소분류를 선택하세요"
              :items="business_domain_lv2_table"
              v-model="business_domain_lv2_idx"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="회사,업무의 유형을 선택하세요"
              :items="work_table"
              v-model="work_type"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="직급을 선택하세요"
              :items="job_position_table"
              v-model="job_position_idx"
              hide-details="auto"
              class="mb-8"
            ></v-select>
            <v-select
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="경력을 선택하세요"
              :items="career_table"
              v-model="career_type"
              hide-details="auto"
              class="mb-16"
            ></v-select>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              label="산업 전화번호를 입력하세요(-제외)"
              v-model="tel"
              hide-details="auto"
              class="mb-8"
            ></v-text-field>
            <v-container class="ma-0 pa-3">
              <v-row>
                <v-col class="ma-0 pa-0" cols="7">
                  <v-text-field
                    v-model="working_place_postcode"
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
                <v-col class="ma-0 pl-5 pa-0" cols="5">
                  <v-btn
                    class="wc-btn wc-btn-green"
                    @click="execDaumPostcode()"
                    color="#fff"
                    rounded
                    block
                  >
                    <span class="wc-h5 white--text">우편번호 검색</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            <v-text-field
              v-model="working_place_address"
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
              v-model="working_place_address_detail"
              label="세부주소를 입력하세요"
              class="mb-16"
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
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="work_description"
              v-model="work_description"
              label="사업,직무 한 줄 설명을 입력하세요"
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
              hide-details="auto"
              v-model="editedItemBusinessKeywords"
              label="산업을 설명할 키워드를 입력 (,구분)"
              class="mb-16"
            ></v-text-field>
            <!-- 홍보 URL -->
            <div class="pa-5 mb-5 text-center wc-info2">
              선택 입력사항입니다
            </div>
            <v-text-field
              background-color="#edeef3"
              color="#7EA394"
              solo
              rounded
              flat
              outlined
              dense
              hide-details="auto"
              v-model="uri_instagram"
              label="인스타그램 URL을 입력하세요"
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
              hide-details="auto"
              v-model="uri_homepage"
              label="홈페이지 URL을 입력하세요"
              class="mb-16"
            ></v-text-field>
            <!-- 이미지파일 업로드 -->
            <v-card class="wc-card pa-2 mb-8">
              <v-img
                lazy-src=""
                min-height="300"
                :src="workRefImg.tempUrl"
                rounded
                aspect-ratio="1.7"
              >
                <!-- 산업 대표 이미지 등록 -->
              </v-img>
            </v-card>
            <v-file-input
              v-model="workRefImg.fileObject"
              :accept="fileAccept"
              @change="fileHendlerWR()"
              label="산업 대표 제품,서비스 이미지 업로드"
              background-color="#edeef3"
              color="#7EA394"
              flat
              solo
              rounded
              outlined
              dense
              class="mb-8"
            ></v-file-input>
            <!-- 이미지등록 -->
            <v-row>
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[0].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[0].fileObject"
                  @change="fileHendlerWP1()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  v-model="portfolioList[0].file_title"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[0].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[0].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[0].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[1].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[1].fileObject"
                  @change="fileHendlerWP2()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[1].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[1].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[1].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[1].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[2].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[2].fileObject"
                  @change="fileHendlerWP3()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[2].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[2].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[2].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[2].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[3].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[3].fileObject"
                  @change="fileHendlerWP4()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[3].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[3].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[3].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[3].fileObject == null"
                ></v-text-field>
              </v-col>
              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[4].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[4].fileObject"
                  @change="fileHendlerWP5()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[4].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[4].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[4].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[4].fileObject == null"
                ></v-text-field>
              </v-col>

              <!-- 포트폴리오 이미지 업로드 유닛 -->
              <v-col cols="12" xl="6" lg="6" md="6" sm="12">
                <v-card class="wc-card pa-2 mb-8">
                  <v-img
                    lazy-src=""
                    aspect-ratio="1"
                    :src="portfolioList[5].tempUrl"
                    rounded
                  >
                    <!-- 산업 대표 이미지 등록 -->
                  </v-img>
                </v-card>
                <v-file-input
                  v-model="portfolioList[5].fileObject"
                  @change="fileHendlerWP6()"
                  accept="image/*"
                  label="제품,서비스 이미지 업로드"
                  :rules="rules"
                  background-color="#edeef3"
                  color="#7EA394"
                  flat
                  solo
                  rounded
                  outlined
                  dense
                ></v-file-input>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[5].file_title"
                  label="제품, 메뉴 혹은 서비스 이름"
                  class="mb-8"
                  :disabled="portfolioList[5].fileObject == null"
                ></v-text-field>
                <v-text-field
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  outlined
                  dense
                  hide-details="auto"
                  v-model="portfolioList[5].file_description"
                  label="한 줄 설명을 작성"
                  class="mb-8"
                  :disabled="portfolioList[5].fileObject == null"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col class="px-10 mb-16" cols="12" xl="8" lg="8" md="8" sm="12">
            <!--Element : Basic Button -->
            <v-btn
              class="wc-btn wc-btn-green"
              @click="saveWork()"
              color="#fff"
              rounded
              block
              :disabled="isLock"
            >
              <span class="wc-h5 white--text">산업인 정보 등록</span>
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
  import '@/styles/overrides.scss';
  import { mapState, mapActions } from 'vuex';

  import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
  import { FileBins } from '@/mixins/apis_v2/internal/FileBins';
  import { Utility } from '@/mixins/apis_v2/utility/Utility';
  export default {
    data() {
      return {
        // 입력 방지
        portfolioTitleLock1: false,
        portfolioTitleLock2: false,
        portfolioTitleLock3: false,
        portfolioTitleLock4: false,
        portfolioTitleLock5: false,
        portfolioTitleLock6: false,
        // 중복호출 방지
        isLock: false,
        // CREAT DATA
        // Work data
        user_name: '',
        bank_idx: 0,
        bank_account: '',
        donation_amount: '',

        company_name: '',
        business_domain_lv1_idx: 0,
        business_domain_lv2_idx: 0,
        work_type: '',
        job_position_idx: '',
        career_type: '',
        tel: '',
        working_place_postcode: '',
        working_place_address: '',
        working_place_address_detail: '',
        work_description: '',
        uri_instagram: '',
        uri_homepage: '',

        // BUSINDESS KEYWORD
        // Business Keywords data
        editedItemBusinessKeywords: '',

        // FILE
        workId: '',
        key: '',
        location: '',
        fileId: 0,
        // 산업 대표이미지
        workRefImg: {
          file_id: 0,
          file_for: '',
          file_name: '',
          file_title: '',
          file_description: '',
          file_path: '',
          file_size: '',
          file_type: '',
          fileName: '',
          fileObject: null,
          tempUrl: '',
        },

        // 산업 포트폴리오
        portfolioList: [
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
          {
            file_id: 0,
            file_for: '',
            file_name: '',
            file_title: '',
            file_description: '',
            file_path: '',
            file_size: '',
            file_type: '',
            fileName: '',
            fileObject: null,
            tempUrl: '',
          },
        ],

        // 이미지 홀더 크기
        imageHolderWide: 100,

        // Data for Env --------------------------------------------------------

        // AWS-S3
        albumBucketName: 'wisechurch-t-1',
        bucketRegion: 'ap-northeast-2',
        IdentityPoolId: 'ap-northeast-2:5e8b852b-4649-4451-a8e1-a831049355a1',

        // Data For Component Controls -----------------------------------------

        // Data Control : DB저장형식 & 사용자 표현형식 치환을 위한 데이터 테이블
        business_domain_lv1_table: [
          { text: '서비스업', value: 100 },
          { text: '금융∙은행업', value: 200 },
          { text: 'IT∙정보통신업', value: 300 },
          { text: '판매유통업', value: 400 },
          { text: '제조∙생산∙화학업', value: 500 },
          { text: '교육업', value: 600 },
          { text: '건설업', value: 700 },
          { text: '의료∙제약업', value: 800 },
          { text: '미디어∙광고업', value: 900 },
          { text: '문화∙예술∙디자인업', value: 1000 },
          { text: '기관∙협회', value: 1100 },
        ],
        business_domain_lv2_table: [],
        business_domain_lv2_1_table: [
          { text: '호텔∙여행∙항공', value: 101 },
          { text: '음식료∙외식∙프랜차이즈', value: 102 },
          { text: '스포츠∙여가∙레저', value: 103 },
          { text: '뷰티∙미용', value: 104 },
          { text: '콜센터∙아웃소싱∙기타', value: 105 },
          { text: '정비∙A/S∙카센터', value: 106 },
          { text: '렌탈∙임대∙리스', value: 107 },
          { text: '서치펌∙헤드헌팅', value: 108 },
          { text: '시설관리∙보안∙경비', value: 109 },
          { text: '웨딩∙상조∙이벤트', value: 110 },
        ],
        business_domain_lv2_2_table: [
          { text: '은행∙금융', value: 201 },
          { text: '캐피탈∙대출', value: 202 },
          { text: '증권∙보험∙카드', value: 203 },
        ],
        business_domain_lv2_3_table: [
          { text: '솔루션∙SI∙CRM∙ERP', value: 301 },
          { text: '웹에이전시', value: 302 },
          { text: '쇼핑몰∙오픈마켓∙소셜커머스', value: 303 },
          { text: '포털∙컨텐츠∙커뮤니티', value: 304 },
          { text: '네트워크∙통신서비스', value: 305 },
          { text: '정보보안', value: 306 },
          { text: '컴퓨터∙하드웨어∙장비', value: 307 },
          { text: '게임∙애니메이션', value: 308 },
          { text: '모바일∙APP', value: 309 },
          { text: 'IT컨설팅', value: 310 },
        ],
        business_domain_lv2_4_table: [
          { text: '백화점∙유통∙도소매', value: 401 },
          { text: '무역∙상사', value: 402 },
          { text: '물류∙운송∙배송', value: 403 },
        ],
        business_domain_lv2_5_table: [
          { text: '전기∙전자∙제어', value: 501 },
          { text: '반도체∙디스플레이∙광학', value: 502 },
          { text: '기계∙기계설비', value: 503 },
          { text: '자동차∙조선∙철강∙항공', value: 504 },
          { text: '금속∙재료∙자재', value: 505 },
          { text: '화학∙에너지∙환경', value: 506 },
          { text: '섬유∙의류∙패션', value: 507 },
          { text: '생활화학∙화장품', value: 508 },
          { text: '생활용품∙소비재∙기타', value: 509 },
          { text: '목재∙제자∙가구', value: 510 },
          { text: '식품가공', value: 511 },
          { text: '농축산∙어업∙임업', value: 512 },
        ],
        business_domain_lv2_6_table: [
          { text: '학교(초∙중∙고∙대학∙특수)', value: 601 },
          { text: '유아∙유치원∙어린이집', value: 602 },
          { text: '학원∙어하원∙교육원', value: 603 },
          { text: '학습지∙방문교육', value: 604 },
        ],
        business_domain_lv2_7_table: [
          { text: '건축∙설비∙환경', value: 701 },
          { text: '건설∙시공∙토목∙조경', value: 702 },
          { text: '인테리어∙자재', value: 703 },
          { text: '부동산∙중개∙임대', value: 704 },
        ],
        business_domain_lv2_8_table: [
          { text: '의료(병원분류별)', value: 801 },
          { text: '의료(진료과별)', value: 802 },
          { text: '의료(간호∙원무∙상담)', value: 803 },
          { text: '제약∙보건∙바이오', value: 804 },
          { text: '사회복지∙요양', value: 805 },
        ],
        business_domain_lv2_9_table: [
          { text: '방송∙케이블∙프로덕션', value: 901 },
          { text: '신문∙잡지∙언론사', value: 902 },
          { text: '광고∙홍보∙전시', value: 903 },
          { text: '영화∙음반∙배급', value: 904 },
          { text: '연예∙엔터테인먼트', value: 905 },
          { text: '출판∙인쇄∙사진', value: 906 },
        ],
        business_domain_lv2_10_table: [
          { text: '문화∙공연∙예술', value: 1001 },
          { text: '디자인∙CAD', value: 1002 },
        ],
        business_domain_lv2_11_table: [
          { text: '공기업∙공공기관', value: 1101 },
          { text: '협회∙단체', value: 1102 },
          { text: '컨설팅∙연구∙조사', value: 1103 },
          { text: '회계∙세무∙법무', value: 1104 },
          { text: '연예∙엔터테인먼트', value: 1105 },
          { text: '출판∙인쇄∙사진', value: 1106 },
        ],
        business_domain_table: [
          { text: '건설', value: 100 },
          { text: '경찰', value: 200 },
          { text: '공공', value: 300 },
          { text: '공기업', value: 400 },
          { text: '공연예술', value: 500 },
          { text: '광고 & 마케팅', value: 600 },
          { text: '교육', value: 700 },
          { text: '상담', value: 800 },
          { text: '기관 & 협회', value: 900 },
          { text: '유통 & 물류', value: 1000 },
          { text: '문화 & 예술', value: 1100 },
          { text: '미디어', value: 1200 },
          { text: '디자인', value: 1300 },
          { text: '방송', value: 1400 },
          { text: '행사', value: 1500 },
          { text: '법률 & 법조', value: 1600 },
          { text: '부동산', value: 1700 },
          { text: '사회복지', value: 1800 },
          { text: '서비스', value: 1900 },
          { text: '세관', value: 2000 },
          { text: '세무 & 회계', value: 2100 },
          { text: '스포츠', value: 2200 },
          { text: '식품', value: 2300 },
          { text: '에너지', value: 2400 },
          { text: '애니메이션', value: 2500 },
          { text: '연구개발', value: 2600 },
          { text: '연예계', value: 2700 },
          { text: '은행 & 금융', value: 2800 },
          { text: '음악', value: 2900 },
          { text: '의료', value: 3000 },
          { text: '제약', value: 3100 },
          { text: '패션 & 의류', value: 3200 },
          { text: '제조 & 화학', value: 3300 },
          { text: '춤 & 댄스', value: 3400 },
          { text: '판매 & 유통', value: 3500 },
          { text: '항공', value: 3600 },
          { text: '해충 & 방역', value: 3700 },
          { text: '감사 & 컨설팅', value: 3800 },
          { text: 'IT & 웹', value: 3900 },
          { text: '통신', value: 4000 },
        ],
        job_domain_table: [
          { text: 'IT & 인터넷', value: 100 },
          { text: '감정 & 평가', value: 200 },
          { text: '건설', value: 300 },
          { text: '경영 & 사무', value: 400 },
          { text: '경찰', value: 500 },
          { text: '교육', value: 600 },
          { text: '군인', value: 700 },
          { text: '디자인', value: 800 },
          { text: '마케팅', value: 900 },
          { text: '문화예술', value: 1000 },
          { text: '미디어', value: 1100 },
          { text: '법무 & 법조', value: 1200 },
          { text: '부동산', value: 1300 },
          { text: '사회복지', value: 1400 },
          { text: '상담', value: 1500 },
          { text: '생산 & 제조', value: 1600 },
          { text: '서비스', value: 1700 },
          { text: '세관', value: 1800 },
          { text: '세무 & 회계', value: 1900 },
          { text: '스포츠', value: 2000 },
          { text: '심리상담', value: 2100 },
          { text: '안전 & 환경', value: 2200 },
          { text: '연구', value: 2300 },
          { text: '연예', value: 2400 },
          { text: '영업 & 고객상담', value: 2500 },
          { text: '요식업', value: 2600 },
          { text: '유통 & 무역', value: 2700 },
          { text: '음악', value: 2800 },
          { text: '의료', value: 2900 },
          { text: '인사', value: 3000 },
          { text: '소매 & 도매', value: 3100 },
          { text: '컨설팅', value: 3200 },
          { text: '특수계층 & 공공', value: 3300 },
          { text: '항공', value: 3400 },
        ],
        job_position_table: [
          { text: '미등록', value: 0 },
          { text: '대표', value: 100 },
          // { text: "회장", value: 101 },
          // { text: "회장", value: 1 },
          // { text: "대표", value: 102 },
          // { text: "대표", value: 2 },
          // { text: "공동대표", value: 103 },
          // { text: "공동대표", value: 3 },
          { text: '임원', value: 200 },
          // { text: "이사", value: 201 },
          // { text: "이사", value: 4 },
          // { text: "사장", value: 202 },
          // { text: "사장", value: 5 },
          // { text: "부사장", value: 203 },
          // { text: "부사장", value: 6 },
          // { text: "전무", value: 204 },
          // { text: "전무", value: 7 },
          // { text: "상무", value: 205 },
          // { text: "상무", value: 8 },
          // { text: "상무보", value: 206 },
          // { text: "상무보", value: 9 },
          { text: '중간관리자(부차과장 등)', value: 300 },
          // { text: "부장", value: 301 },
          // { text: "부장", value: 10 },
          // { text: "차장", value: 302 },
          // { text: "차장", value: 11 },
          // { text: "과장", value: 303 },
          // { text: "과장", value: 12 },
          { text: '대리', value: 13 },
          { text: '주임', value: 14 },
          { text: '매니저', value: 15 },
          { text: '사원', value: 16 },
          // { text: "사원", value: 15 },
          { text: '인턴', value: 17 },
          // { text: "인턴", value: 16 },
          { text: '프리렌서', value: 18 },
          // { text: "프리렌서", value: 17 },
        ],
        work_table: [
          { text: '법인사업자', value: 'CB' },
          { text: '개인사업자', value: 'PB' },
          { text: '협회 및 단체', value: 'EP' },
          { text: '정규직 직원', value: 'RE' },
          { text: '계약직 직원', value: 'TE' },
          { text: '아르바이트', value: 'AB' },
          { text: '프리렌서', value: 'FR' },
          { text: '기타', value: 'EC' },
        ],
        authority_table_table: [
          { text: '일반회원', value: '1' },
          { text: '비즈니스등록회원', value: '2' },
          { text: '정회원', value: '3' },
          { text: '일반관리자A', value: '4' },
          { text: '일반관리자B', value: '5' },
          { text: '중급관리자A', value: '6' },
          { text: '중급관리자B', value: '7' },
          { text: '최고관리자', value: '8' },
          { text: 'SystemMaster', value: '9' },
        ],
        career_table: [
          { text: '1년 미만', value: 10 },
          { text: '1년 이상 3년 미만', value: 20 },
          { text: '3년 이상 5년 미만', value: 30 },
          { text: '5년 이상 10년 미만', value: 40 },
          { text: '10년 이상', value: 50 },
          ``,
        ],

        // Loading
        logingDialog: false,
        value: '0',

        // Rules for handling data ----------------------------------------------
        // Rule Definition
        fileAccept: 'image/png, image/jpeg, image/bmp',
        rules: [
          (value) =>
            !value ||
            value.size < 2000000 ||
            'Avatar size should be less than 2 MB!',
        ],
        requiredRule: {
          required: [
            (val) => (val || '').length > 0 || 'This field is required',
          ],
        },
      };
    },
    computed: {
      ...mapState(['isLogin', 'userInfo']),
    },
    watch: {
      business_domain_lv1_idx: function (val) {
        switch (val) {
          case 100:
            console.log('checkpoint');
            this.business_domain_lv2_table = this.business_domain_lv2_1_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 200:
            this.business_domain_lv2_table = this.business_domain_lv2_2_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 300:
            this.business_domain_lv2_table = this.business_domain_lv2_3_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 400:
            this.business_domain_lv2_table = this.business_domain_lv2_4_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 500:
            this.business_domain_lv2_table = this.business_domain_lv2_5_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 600:
            this.business_domain_lv2_table = this.business_domain_lv2_6_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 700:
            this.business_domain_lv2_table = this.business_domain_lv2_7_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 800:
            this.business_domain_lv2_table = this.business_domain_lv2_8_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 900:
            this.business_domain_lv2_table = this.business_domain_lv2_9_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 1000:
            this.business_domain_lv2_table = this.business_domain_lv2_10_table;
            console.log(this.business_domain_lv2_table);
            break;
          case 1100:
            this.business_domain_lv2_table = this.business_domain_lv2_11_table;
            console.log(this.business_domain_lv2_table);
            break;
          default:
        }
      },
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
      // API 중복호출방지용 플래그 세팅
      async setIsLockTrue() {
        this.isLock = true;
      },
      async saveWork() {
        this.isLock = true;
        this.lv1_Func('comp:SignUpWork', 'saveWork()');
        await this.lv1_Act('작성된 산업정보를 DB에 저장합니다.');
        this.logingDialog = true;
        this.value = '10';

        //필수정보의 입력이 누락되었는지 검사합니다.
        await this.lv1_Act('필수정보의 입력이 누락되었는지 검사합니다.');
        if (!(await this.checkEmptyData())) {
          await this.lv1_Case('입력되지 않은 필수 데이터가 있음');
          await this.lv1_Act('함수를 종료합니다.');
          this.isLock = false;
          return;
        }
        // 워크 모델을 생성합니다.
        await this.lv1_Act('워크 모델을 생성합니다.');
        // 로그인된 유저정보를 가져옵니다
        await this.lv1_Act('로그인된 유저정보 가져오기');
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        await this.lv1_Data('userInfo', userInfo);
        // 산업정보 모델을 생성합니다.
        await this.lv1_Act('산업정보 모델을 생성합니다.');
        const newWorkModel = {
          user_id: userInfo.id,
          company_name: this.company_name, //
          business_domain_lv1_idx: this.business_domain_lv1_idx, //
          business_domain_lv2_idx: this.business_domain_lv2_idx, //
          work_type: this.work_type, //
          job_position_idx: this.job_position_idx, //
          career_type: this.career_type,
          tel: this.tel,
          working_place_postcode: this.working_place_postcode,
          working_place_address: this.working_place_address,
          working_place_address_detail: this.working_place_address_detail,
          work_description: this.work_description,
          uri_homepage: this.uri_homepage,
          uri_instagram: this.uri_instagram,
          // user_id: userInfo.id,
          // company_name: "산업명",
          // business_domain_lv1_idx: 1,
          // business_domain_lv2_idx: 1,
          // work_type: "CB",
          // job_position_idx: 1,
          // career_type: "10",
          // tel: "024092777",
          // working_place_postcode: "00000",
          // working_place_address: "주소",
          // working_place_address_detail: "세부주소",
          // work_description: "업무설명",
          // uri_homepage: "uri_homepage",
          // uri_instagram: "uri_instagram",
        };
        await this.lv1_Data('newWorkModel', newWorkModel);
        // 산업정보를 생성합니다.
        await this.lv1_Act('산업정보를 생성합니다.');
        const newWork = await this.authCreateData(this.Work, newWorkModel);
        await this.lv1_Data('newWork', newWork);

        // 비즈니스 관련 이미지 저장
        this.value = '30';
        // 대표이미지를 저장합니다.
        await this.lv1_Act('대표이미지를 저장합니다.');
        if (this.workRefImg.fileObject !== null) {
          await this.lv1_Case('유저가 산업 대표이미지 업로드함');
          await this.lv1_Act('산업 대표이미지 업로드합니다.');
          const workRefImg = await this.createWorkFile(
            newWork.id,
            'WR',
            this.workRefImg.fileObject,
            this.workRefImg.fileName,
            this.workRefImg.file_title,
            this.workRefImg.file_description
          );
          await this.lv1_Data('workRefImg', workRefImg);
        }
        // 포트폴리오 이미지를 저장합니다.
        this.value = '70';
        await this.lv1_Act('포트폴리오 이미지를 저장합니다.');
        await this.portfolioList.forEach(async (portfolio) => {
          await this.lv1_Act('포트폴리오 리스트배열을 순회합니다.');
          if (portfolio.fileObject !== null) {
            await this.lv1_Case('사용자가 포트폴리오 이미지 업로드함');
            await this.lv1_Act('포트폴리오 이미지를 저장합니다.');
            const workPortfolio = await this.createWorkFile(
              newWork.id,
              'WP',
              portfolio.fileObject,
              portfolio.fileName,
              portfolio.file_title,
              portfolio.file_description
            );
            await this.lv1_Data('workPortfolio', workPortfolio);
          }
        });

        // 5. 비즈니스 관련 키워드 저장
        this.value = '90';
        // 비즈니스 키워드를 저장합니다.
        await this.lv1_Act('비즈니스 키워드를 저장합니다.');
        await this.lv1_Act(
          '작성된 키워드를 , 기준으로 나누어 배열로 만듭니다.'
        );
        let tempArray = this.editedItemBusinessKeywords.split(',');
        tempArray = tempArray.filter((item) => item !== '');
        tempArray.forEach(async (element) => {
          await this.lv1_Act('배열을 순회하면서 키워드를 저장합니다.');
          await this.lv1_Act('키워드 모델 생성');
          const busnessKeywordModel = {
            work_id: newWork.id,
            keyword_name: element,
          };
          await this.lv1_Act('키워드 저장');
          const newBusinessKeyword = await this.authCreateData(
            this.BusinessKeyword,
            busnessKeywordModel
          );
          await this.lv1_Data('newBusinessKeyword', newBusinessKeyword);
        });
        // 6. 다음화면으로 이동
        this.value = '100';
        this.logingDialog = false;
        this.isLock = false;
        this.$emit('goToNextStep', 6);
      },

      // 빈 데이터 체크
      async checkEmptyData() {
        // // 빈 데이터방지 확인
        if (this.company_name == '') {
          alert('회사 이름을 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.business_domain_lv1_idx == '') {
          alert('비즈니스 대분류를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.business_domain_lv2_idx == '') {
          alert('비즈니스 소분류를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.work_type == '') {
          alert('회사,업무의 유형을 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.job_position_idx == '') {
          alert('직급을 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.career_type == '') {
          alert('경력을 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.tel == '') {
          alert('산업 전화번호를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }

        if (this.working_place_postcode == '') {
          alert('우편번호를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.working_place_address == '') {
          alert('주소를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.working_place_address_detail == '') {
          alert('세부주소를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.work_description == '') {
          alert('사업,직무 한 줄 설명을 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.editedItemBusinessKeywords == '') {
          alert('산업을 잘 설명할 키워드를 입력하세요. 검색에 활용됩니다.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }
        if (this.editedItemBusinessKeywords == '') {
          alert('사업,직무 키워드를 입력하세요.');
          this.logingDialog = false;
          this.value = '0';
          return false;
        }

        return true;
      },

      // IMAGE HANDELER
      async fileHendlerWR() {
        console.log(`%c[ Comp: SignUpWork ] fileHendlerWR()`, `color:#BFFF00;`);
        const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
        await this.setTempFileData(userEmail, 'WR', this.workRefImg, true);
      },
      async fileHendlerWP1() {
        if (this.portfolioList[0].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP1()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[0],
            true
          );
        } else {
          this.portfolioList[0].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },
      async fileHendlerWP2() {
        if (this.portfolioList[1].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP2()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[1],
            true
          );
        } else {
          this.portfolioList[1].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },
      async fileHendlerWP3() {
        if (this.portfolioList[2].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP3()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[2],
            true
          );
        } else {
          this.portfolioList[2].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },
      async fileHendlerWP4() {
        if (this.portfolioList[3].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP4()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[3],
            true
          );
        } else {
          this.portfolioList[3].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },
      async fileHendlerWP5() {
        if (this.portfolioList[4].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP5()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[4],
            true
          );
        } else {
          this.portfolioList[4].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },
      async fileHendlerWP6() {
        if (this.portfolioList[5].file !== null) {
          console.log(
            `%c[ Comp: SignUpWork ] fileHendlerWP6()`,
            `color:#BFFF00;`
          );
          const userEmail = JSON.parse(localStorage.getItem('user_info')).email;
          await this.setTempFileData(
            userEmail,
            'WP',
            this.portfolioList[5],
            true
          );
        } else {
          this.portfolioList[5].file_path =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEddFPyFQa3czMdjTSMulgvCKmt3rJMqYuMwTSDEpZtdWzgxc1PLYF-NfJMSlqbgXbaoE&usqp=CAU';
        }
      },

      // PHSTCODE
      execDaumPostcode() {
        new window.daum.Postcode({
          oncomplete: (data) => {
            if (this.working_place_address_detail !== '') {
              this.working_place_address_detail = '';
            }
            if (data.userSelectedType === 'R') {
              // 사용자가 도로명 주소를 선택했을 경우
              this.working_place_address = data.roadAddress;
            } else {
              // 사용자가 지번 주소를 선택했을 경우(J)
              this.working_place_address = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
              // 법정동명이 있을 경우 추가한다. (법정리는 제외)
              // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                this.working_place_address_detail += data.bname;
              }
              // 건물명이 있고, 공동주택일 경우 추가한다.
              if (data.buildingName !== '' && data.apartment === 'Y') {
                this.working_place_address_detail +=
                  this.working_place_address_detail !== ''
                    ? `, ${data.buildingName}`
                    : data.buildingName;
              }
              // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
              if (this.working_place_address_detail !== '') {
                this.working_place_address_detail = `(${this.working_place_address_detail})`;
              }
            } else {
              this.working_place_address_detail = '';
            }
            // 우편번호를 입력한다.
            this.working_place_postcode = data.zonecode;
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
