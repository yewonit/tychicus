<template>
  <div class="organization-management-page">
    <!-- 비밀번호 입력 화면 -->
    <v-card
      v-if="!isAuthenticated"
      rounded="lg"
      elevation="3"
      max-width="500px"
      class="mx-auto my-12"
    >
      <v-card-title class="text-center wc-bold-600 pt-8">
        <span class="text-h5">코람데오 두기고 인원관리 시스템</span>
        <div class="text-subtitle-1 mt-2 grey--text">
          Coramdeo Dugigo Member Management System
        </div>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form @submit.prevent="checkPassword">
          <v-text-field
            v-model="password"
            label="비밀번호를 입력하세요"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            outlined
            dense
            color="#7EA394"
            :error-messages="passwordError"
            @input="passwordError = ''"
            @keyup.enter="checkPassword"
          ></v-text-field>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              color="#7EA394"
              dark
              rounded
              @click="checkPassword"
              :loading="loading"
            >
              확인
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 기존 조직관리 페이지 -->
    <v-card v-else rounded="lg" elevation="0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="wc-bold-600 text-h5">조직 및 멤버 관리</span>
        <div>
          <v-btn
            color="#7EA394"
            small
            rounded
            class="mr-2 white--text"
            @click="openOrganizationDialog()"
          >
            <v-icon left small>mdi-folder-plus</v-icon>
            조직 추가
          </v-btn>
          <v-btn
            color="#7EA394"
            small
            rounded
            :disabled="
              !selectedOrganization || !selectedOrganization.isLeafNode
            "
            @click="openMemberDialog()"
            class="white--text"
          >
            <v-icon left small>mdi-account-plus</v-icon>
            신규 인원 등록
          </v-btn>
          <v-btn
            color="grey darken-1"
            small
            rounded
            class="ml-2 white--text"
            @click="logout"
          >
            <v-icon left small>mdi-logout</v-icon>
            로그아웃
          </v-btn>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card flat>
              <v-card-title class="pb-0">
                <span class="subtitle-1 font-weight-bold">조직 목록</span>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-treeview
                  :items="organizationTree"
                  item-key="id"
                  open-all
                  dense
                  :active.sync="activeOrganization"
                  return-object
                  activatable
                  @update:active="handleOrganizationSelect"
                  :load-children="() => {}"
                  @input="(val) => console.log('트리뷰 입력 이벤트:', val)"
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon small color="#7EA394">
                      {{
                        item.children && item.children.length > 0
                          ? "mdi-folder"
                          : "mdi-folder-outline"
                      }}
                    </v-icon>
                  </template>
                  <template v-slot:label="{ item }">
                    <div
                      class="d-flex align-center justify-space-between"
                      style="width: 100%"
                    >
                      <div>
                        <span class="font-weight-bold">{{
                          item.organization_name
                        }}</span>
                        <div class="text-caption grey--text text--darken-1">
                          ID: {{ item.id }} | 코드:
                          {{ item.organization_code }} | 멤버:
                          {{ item.memberCount || 0 }}명
                        </div>
                      </div>
                      <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            small
                            v-bind="attrs"
                            v-on="on"
                            @click.stop
                          >
                            <v-icon small>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list dense>
                          <v-list-item
                            @click.stop="openOrganizationDialog(item)"
                          >
                            <v-list-item-title>
                              <v-icon left small color="#7EA394"
                                >mdi-pencil</v-icon
                              >
                              수정
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click.stop="confirmDeleteOrganization(item)"
                          >
                            <v-list-item-title>
                              <v-icon left small color="red">mdi-delete</v-icon>
                              삭제
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card flat>
              <v-card-title class="pb-0">
                <span class="subtitle-1 font-weight-bold">
                  {{
                    selectedOrganization
                      ? selectedOrganization.organization_name
                      : "조직을 선택하세요"
                  }}
                  <span v-if="selectedOrganization" class="text-caption ml-2">
                    (총 {{ members.length }}명)
                  </span>
                </span>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-alert
                  v-if="
                    selectedOrganization && !selectedOrganization.isLeafNode
                  "
                  type="info"
                  dense
                  text
                  class="ma-2"
                >
                  최하위 조직만 멤버를 관리할 수 있습니다. 최하위 조직을
                  선택해주세요.
                </v-alert>
                <v-data-table
                  :headers="memberHeaders"
                  :items="members"
                  :items-per-page="-1"
                  :loading="loadingMembers"
                  class="elevation-0"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 50, 100, -1],
                    'items-per-page-text': 'Rows per page:',
                    'items-per-page-all-text': 'All',
                  }"
                  :no-data-text="
                    selectedOrganization
                      ? selectedOrganization.isLeafNode
                        ? '멤버가 없습니다'
                        : '최하위 조직만 멤버를 조회할 수 있습니다'
                      : '조직을 선택하세요'
                  "
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar size="32" class="mr-2 name-avatar">
                            <span class="white--text">{{
                              item.name.charAt(0)
                            }}</span>
                          </v-avatar>
                          <div>
                            <div class="member-name">{{ item.name }}</div>
                            <div class="member-suffix">
                              {{ item.nameSuffix || "구분자 없음" }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{{ item.phoneNumber || "번호 없음" }}</td>
                      <td>{{ item.email || "이메일 없음" }}</td>
                      <td>{{ item.genderType === "M" ? "남성" : "여성" }}</td>
                      <td>
                        <v-chip
                          v-if="item.roleName === '그룹장'"
                          small
                          :color="getRoleColor('그룹장')"
                          text-color="black"
                          class="mr-1"
                        >
                          그룹장
                        </v-chip>
                        <v-chip
                          v-if="item.roleName === '부그룹장'"
                          small
                          :color="getRoleColor('부그룹장')"
                          text-color="black"
                          class="mr-1"
                        >
                          부그룹장
                        </v-chip>
                        <v-chip
                          v-if="item.roleName === '순장'"
                          small
                          :color="getRoleColor('순장')"
                          text-color="black"
                          class="mr-1"
                        >
                          순장
                        </v-chip>
                        <v-chip
                          v-if="item.roleName === 'EBS'"
                          small
                          :color="getRoleColor('EBS')"
                          text-color="black"
                          class="mr-1"
                        >
                          EBS
                        </v-chip>
                        <v-chip
                          v-if="item.isNewMember === 'Y'"
                          small
                          color="orange"
                          text-color="black"
                          class="mr-1"
                        >
                          새가족
                        </v-chip>
                        <v-chip
                          v-if="item.isLongTermAbsentee === 'Y'"
                          small
                          color="red"
                          text-color="black"
                          class="mr-1"
                        >
                          장기결석
                        </v-chip>
                        <v-chip
                          v-if="
                            item.roleName === '순원' || item.roleName === '회원'
                          "
                          small
                          :color="getRoleColor(item.roleName)"
                          text-color="black"
                        >
                          {{ item.roleName }}
                        </v-chip>
                      </td>
                      <td class="text-right">
                        <v-btn icon small @click="openMemberDialog(item)">
                          <v-icon small color="#7EA394">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click="confirmDeleteMember(item)">
                          <v-icon small color="red">mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 조직 추가/수정 다이얼로그 -->
    <v-dialog v-model="organizationDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="wc-bold-600">
          <span class="text-h5">{{
            editedOrganization.id ? "조직 수정" : "조직 추가"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedOrganization.organization_name"
                  label="조직명"
                  required
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedOrganization.organization_code"
                  label="조직 코드"
                  required
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedOrganization.upper_organization_id"
                  :items="organizationSelectItems"
                  item-text="text"
                  item-value="value"
                  label="상위 조직"
                  hint="상위 조직이 없으면 비워두세요"
                  persistent-hint
                  clearable
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedOrganization.organization_description"
                  label="설명"
                  rows="3"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#7EA394" text @click="closeOrganizationDialog"
            >취소</v-btn
          >
          <v-btn color="#7EA394" text @click="saveOrganization">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 멤버 추가/수정 다이얼로그 -->
    <v-dialog v-model="memberDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="wc-bold-600">
          <span class="text-h5 font-weight-bold">{{
            editedMember.userId ? "멤버 수정" : "새로운 인원 등록"
          }}</span>
          <v-row>
            <v-col cols="12" class="pt-1 pb-0">
              <span class="subtitle-2 grey--text text--darken-1">
                {{
                  editedMember.userId
                    ? "기존 멤버의 정보를 수정합니다. 변경된 필드는 자동으로 저장됩니다."
                    : "새로운 인원을 등록합니다. 필수 항목(*)을 모두 입력해야 저장이 가능합니다."
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
                <span class="subtitle-1 font-weight-medium"
                  >카톡방 참여 여부</span
                >
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
                <v-icon size="22" class="mr-2" color="#262626"
                  >mdi-account-check</v-icon
                >
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
                <v-icon size="22" class="mr-2" color="#262626"
                  >mdi-account-multiple-plus</v-icon
                >
                <span class="subtitle-1 font-weight-medium">새가족 여부</span>
                <v-spacer></v-spacer>
                <label class="custom-switch mt-0 pt-0">
                  <input
                    type="checkbox"
                    :checked="editedMember.isNewMember === 'Y'"
                    @change="
                      editedMember.isNewMember = $event.target.checked
                        ? 'Y'
                        : 'N'
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
                  이름 <span class="red--text">*</span>
                </div>
                <v-text-field
                  v-model="editedMember.name"
                  label="이름 (필수)"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input"
                  required
                  persistent-hint
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
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input"
                  persistent-hint
                ></v-text-field>

                <!-- 전화번호 -->
                <div class="field-title mb-1 text-left">
                  전화번호 <span class="red--text">*</span>
                </div>
                <v-text-field
                  v-model="editedMember.phoneNumber"
                  label="전화번호 (필수)"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input"
                  required
                  persistent-hint
                  :error="validationErrors.phoneNumber"
                  :error-messages="
                    validationErrors.phoneNumber
                      ? '전화번호를 입력해주세요'
                      : ''
                  "
                ></v-text-field>

                <!-- 성별(드롭다운) -->
                <div class="field-title mb-1 text-left">
                  성별 <span class="red--text">*</span>
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
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input org-custom-select"
                  persistent-hint
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
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input"
                  persistent-hint
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
                      class="mb-4 mx-auto org-custom-input"
                      persistent-hint
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedMember.birthDate"
                    no-title
                    @input="birthDateMenu = false"
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
                      class="mb-4 mx-auto org-custom-input"
                      persistent-hint
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedMember.registrationDate"
                    no-title
                    @input="registrationDateMenu = false"
                  ></v-date-picker>
                </v-menu>

                <!-- 국적 -->
                <div class="field-title mb-1 text-left">국적</div>
                <v-select
                  v-model="editedMember.countryCode"
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
                  class="mb-4 mx-auto bg-transparent org-custom-input org-custom-select"
                  persistent-hint
                ></v-select>

                <!-- 역할 선택 -->
                <div class="field-title mb-1 text-left">
                  역할 <span class="red--text">*</span>
                </div>
                <v-select
                  v-model="editedMember.roleId"
                  :items="roleItems"
                  item-text="text"
                  item-value="value"
                  label="역할 (필수)"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent org-custom-input org-custom-select"
                  required
                  persistent-hint
                  :error="validationErrors.roleId"
                  :error-messages="
                    validationErrors.roleId ? '역할을 선택해주세요' : ''
                  "
                ></v-select>

                <!-- 주소 관련 필드 주석 처리 시작 -->
                <!--
                <v-textarea
                  v-model="editedMember.address"
                  label="주소"
                  rows="3"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-textarea>

                <v-textarea
                  v-model="editedMember.addressDetail"
                  label="상세주소"
                  rows="3"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-textarea>

                <v-text-field
                  v-model="editedMember.postcode"
                  label="우편번호"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-text-field>
                -->
                <!-- 주소 관련 필드 주석 처리 끝 -->

                <!-- 취미 필드 주석 처리 시작 -->
                <!--
                <v-textarea
                  v-model="editedMember.hobby"
                  label="취미"
                  rows="3"
                  background-color="#edeef3"
                  color="#7EA394"
                  solo
                  rounded
                  flat
                  dense
                  hide-details="auto"
                  class="mb-4 mx-auto bg-transparent"
                ></v-textarea>
                -->
                <!-- 취미 필드 주석 처리 끝 -->

                <v-col cols="12" class="pa-15 pt-4 pb-0">
                  <v-btn
                    class="mx-auto custom-save-btn"
                    block
                    color="#7EA394"
                    text
                    @click="saveMember"
                    :loading="savingMember"
                    ><span class="wc-h3">{{
                      editedMember.userId ? "데이터 수정" : "데이터 저장"
                    }}</span></v-btn
                  >
                </v-col>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 삭제 확인 다이얼로그 -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card rounded="lg">
        <v-card-title class="text-h5 wc-bold-600"
          >정말 삭제하시겠습니까?</v-card-title
        >
        <v-card-text>
          {{ deleteDialogText }}
          <div class="red--text mt-2">이 작업은 되돌릴 수 없습니다.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#7EA394" text @click="deleteDialog = false">취소</v-btn>
          <v-btn color="red" text @click="deleteConfirm">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { CurrentMemberCtrl } from "@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl";
import { OrganizationCtrl } from "@/mixins/apis_v2/internal/domainCtrl/OrganizationCtrl";

export default {
  name: "OrganizationManagementView",
  mixins: [MasterCtrl, CurrentMemberCtrl, OrganizationCtrl],

  data() {
    return {
      // 비밀번호 인증 관련
      isAuthenticated: false,
      password: "",
      showPassword: false,
      passwordError: "",
      loading: false,
      correctPassword: "coramdeo", // 하드코딩된 비밀번호

      // 조직 관련
      organizations: [],
      organizationTree: [], // 빈 배열로 초기화
      selectedOrganizationIndex: -1,
      selectedOrganization: null,
      organizationDialog: false,
      editedOrganization: {
        id: null,
        organization_name: "",
        organization_code: "",
        organization_description: "",
      },
      // 조직 구조 캐싱
      cachedOrganizations: null,
      organizationCacheExpiry: null,
      organizationCacheDuration: 30 * 60 * 1000, // 30분 캐시 지속 시간

      // 멤버 관련
      members: [],
      loadingMembers: false,
      memberDialog: false,
      birthDateMenu: false,
      registrationDateMenu: false,
      savingMember: false, // 멤버 저장 중 상태 추가
      editedMember: {
        userId: null,
        name: "",
        nameSuffix: "",
        phoneNumber: "",
        genderType: "M",
        email: "",
        birthDate: null,
        isNewMember: "N",
        isLongTermAbsentee: "N",
        isKakaotalkChatMember: "N",
        roleId: 74,
        roleName: "순원",
        memberNumber: "",
        registrationDate: null,
        countryCode: "KOR",
        address: "",
        addressDetail: "",
        postcode: "",
        hobby: "",
        city: null,
        stateProvince: null,
        isAddressPublic: "N",
        isPhoneNumberPublic: "N",
        snsUrl: null,
      },
      originalMember: null, // 원본 멤버 데이터 저장용

      // 역할 정보
      roleItems: [
        { text: "그룹장", value: 72 },
        { text: "EBS", value: 73 },
        { text: "순원", value: 74 },
      ],

      // 데이터 테이블 헤더
      memberHeaders: [
        { text: "이름", value: "name", sortable: true },
        { text: "전화번호", value: "phoneNumber", sortable: true },
        { text: "이메일", value: "email", sortable: true },
        { text: "성별", value: "genderType", sortable: true },
        { text: "상태/역할", value: "status", sortable: false },
        { text: "관리", value: "actions", sortable: false, align: "right" },
      ],

      // 삭제 다이얼로그
      deleteDialog: false,
      deleteDialogText: "",
      deleteType: "", // "organization" 또는 "member"
      deleteItem: null,

      // 조직 트리 관련
      activeOrganization: [],

      // 국가 정보
      countryItems: [
        { text: "대한민국", value: "KOR" },
        { text: "미국", value: "USA" },
        { text: "일본", value: "JPN" },
        { text: "중국", value: "CHN" },
        { text: "기타", value: "ETC" },
      ],

      emailRules: [
        (v) => !!v || "이메일을 입력해주세요",
        (v) => /.+@.+\..+/.test(v) || "이메일이 유효하지 않습니다.",
      ],

      validationErrors: {
        name: false,
        phoneNumber: false,
        genderType: false,
        roleId: false,
      },
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),

    // 조직 선택 드롭다운 아이템
    organizationSelectItems() {
      return this.organizations.map((org) => ({
        text: `${org.organization_name} (ID: ${org.id})`,
        value: org.id,
      }));
    },

    // 데이터 변경 감지
    isDataChanged() {
      if (!this.originalMember) return true; // 새로 추가하는 경우는 항상 변경됨으로 간주
      return (
        JSON.stringify(this.editedMember) !==
        JSON.stringify(this.originalMember)
      );
    },
  },

  created() {
    try {
      // 로컬 스토리지에서 인증 상태 확인
      const storedAuth = localStorage.getItem("coramdeoAuth");
      if (storedAuth === "true") {
        this.isAuthenticated = true;
      }

      // 사용자 정보 확인
      if (this.userInfo && this.userInfo.id) {
        console.log("사용자 정보 확인:", this.userInfo.id);
      } else {
        console.warn("사용자 정보가 없습니다.");
      }

      // 조직 트리 초기화
      this.organizationTree = [];

      // 인증된 상태인 경우에만 조직 데이터 초기화
      if (this.isAuthenticated) {
        // 조직 데이터 초기화
        this.$nextTick(() => {
          // 조직 데이터 로드 및 멤버 수 계산
          this.fetchOrganizationsOnly()
            .then(() => {
              console.log("조직 데이터 로드 완료, 멤버 수 계산 시작");
              this.calculateMemberCounts();
            })
            .catch((error) => {
              console.error("조직 데이터 로드 중 오류:", error);
            });
        });
      }
    } catch (error) {
      console.error("초기화 중 오류 발생:", error);
      this.organizations = [];
      this.organizationTree = [];
    }
  },

  mounted() {
    console.log("OrganizationManagementView 마운트됨");

    // 인증된 상태인 경우에만 조직 데이터 로드
    if (this.isAuthenticated) {
      // 조직 데이터가 없으면 다시 로드
      if (!this.organizations || this.organizations.length === 0) {
        console.log("마운트 시 조직 데이터 없음, 다시 로드");
        this.fetchOrganizationsOnly()
          .then(() => {
            console.log("마운트 후 조직 데이터 로드 완료");
            // 첫 번째 조직 자동 선택
            this.$nextTick(() => {
              if (this.organizationTree && this.organizationTree.length > 0) {
                console.log("첫 번째 조직 자동 선택");
                this.selectFirstLeafNode(this.organizationTree);
              }
            });
          })
          .catch((error) => {
            console.error("마운트 후 조직 데이터 로드 중 오류:", error);
          });
      } else {
        console.log("마운트 시 조직 데이터 있음, 첫 번째 조직 선택");
        // 첫 번째 조직 자동 선택
        this.$nextTick(() => {
          if (this.organizationTree && this.organizationTree.length > 0) {
            this.selectFirstLeafNode(this.organizationTree);
          }
        });
      }

      // Daum 우편번호 서비스 스크립트 로드
      if (!window.daum || !window.daum.Postcode) {
        const script = document.createElement("script");
        script.src =
          "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  },

  methods: {
    // 비밀번호 확인 메서드
    checkPassword() {
      this.loading = true;

      // 간단한 비밀번호 확인 (실제 서비스에서는 더 안전한 방법 사용 권장)
      setTimeout(() => {
        if (this.password === this.correctPassword) {
          this.isAuthenticated = true;
          this.passwordError = "";

          // 인증 상태를 로컬 스토리지에 저장
          localStorage.setItem("coramdeoAuth", "true");

          // 인증 성공 후 조직 데이터 로드
          this.$nextTick(() => {
            this.fetchOrganizationsOnly()
              .then(() => {
                console.log("조직 데이터 로드 완료, 멤버 수 계산 시작");
                this.calculateMemberCounts();
              })
              .catch((error) => {
                console.error("조직 데이터 로드 중 오류:", error);
              });
          });
        } else {
          this.passwordError = "비밀번호가 올바르지 않습니다.";
        }
        this.loading = false;
      }, 500); // 0.5초 지연 (UX 향상)
    },

    // 로그아웃 메서드
    logout() {
      // 로컬 스토리지에서 인증 상태 제거
      localStorage.removeItem("coramdeoAuth");

      // 인증 상태 초기화
      this.isAuthenticated = false;
      this.password = "";
      this.passwordError = "";

      // 데이터 초기화
      this.organizations = [];
      this.organizationTree = [];
      this.selectedOrganization = null;
      this.members = [];
    },

    // 조직 정보만 불러오는 메서드 추가
    async fetchOrganizationsOnly() {
      try {
        // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
        const now = new Date().getTime();
        if (
          this.cachedOrganizations &&
          this.organizationCacheExpiry &&
          now < this.organizationCacheExpiry
        ) {
          console.log("캐시된 조직 데이터 사용 중...");
          this.organizations = this.cachedOrganizations;

          // 조직 트리 구성
          this.organizationTree = this.buildOrganizationTree(
            this.organizations
          );

          // 조직 정보를 가져온 후 멤버 수 계산
          this.calculateMemberCounts();
          return;
        }

        console.log("API에서 조직 데이터 가져오기 시작...");
        const response = await this.getAllOrganizations(true);
        console.log("API에서 가져온 조직 데이터:", response);

        // API 응답 구조 확인 및 데이터 추출
        let organizations = [];
        if (response && response.data && Array.isArray(response.data)) {
          // API 응답에서 data 배열을 추출
          organizations = response.data;
          console.log("API 응답에서 data 배열 추출:", organizations.length);
        } else if (Array.isArray(response)) {
          // 응답이 직접 배열인 경우
          organizations = response;
          console.log("API 응답이 직접 배열인 경우:", organizations.length);
        } else {
          console.error("API 응답 형식이 예상과 다릅니다:", response);
          // 더미 데이터 사용
          organizations = this.getDummyOrganizations();
          console.log("더미 데이터 사용:", organizations.length);
        }

        // 디버깅: 모든 조직 정보 출력
        console.log("처리된 조직 데이터:", organizations);

        // 각 조직 ID 출력
        console.log(
          "조직 ID 목록:",
          organizations.map((org) => org.id)
        );

        // 유효한 조직 데이터가 있는지 확인
        if (!organizations || organizations.length === 0) {
          console.log("조직 데이터가 없습니다. 더미 데이터를 사용합니다.");
          organizations = this.getDummyOrganizations();
        }

        // 각 조직의 멤버 수 초기화
        organizations.forEach((org) => {
          org.memberCount = 0;
        });

        // 모든 조직 데이터 사용 (특정 ID 필터링 제거)
        this.organizations = organizations;
        console.log("최종 조직 데이터 설정 완료:", this.organizations.length);

        // 조직 데이터 캐싱
        this.cachedOrganizations = JSON.parse(JSON.stringify(organizations)); // 깊은 복사
        this.organizationCacheExpiry =
          new Date().getTime() + this.organizationCacheDuration;
        console.log(
          "조직 데이터 캐싱 완료, 만료 시간:",
          new Date(this.organizationCacheExpiry)
        );

        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);

        // 디버깅: 생성된 트리 구조 출력
        console.log("생성된 조직 트리:", this.organizationTree);
        console.log("조직 트리 항목 수:", this.organizationTree.length);

        // 조직 정보를 가져온 후 멤버 수 계산
        this.calculateMemberCounts();
      } catch (error) {
        console.error("조직 목록 조회 중 오류 발생:", error);
        // 오류 발생 시 더미 데이터 사용
        this.organizations = this.getDummyOrganizations();
        console.log("오류로 인한 더미 데이터 사용:", this.organizations.length);

        // 조직 트리 구성
        this.organizationTree = this.buildOrganizationTree(this.organizations);
        console.log("오류 후 생성된 조직 트리:", this.organizationTree);
      }
    },

    // 멤버 수 계산을 별도 메서드로 분리
    async calculateMemberCounts() {
      if (
        !Array.isArray(this.organizations) ||
        this.organizations.length === 0
      ) {
        return;
      }

      console.log("멤버 수 계산 시작...");

      try {
        // 1. 먼저 모든 조직의 멤버 수를 0으로 초기화
        this.organizations.forEach((org) => {
          org.memberCount = 0;
        });

        // 2. 최하위 조직(리프 노드)을 찾아서 실제 멤버 수를 API로 가져옴
        const leafOrgs = this.organizations.filter(
          (org) =>
            !this.organizations.some(
              (other) => other.upper_organization_id === org.id
            )
        );

        console.log(`최하위 조직 ${leafOrgs.length}개 발견`);

        // 3. 각 최하위 조직의 멤버 수를 API로 가져옴
        for (const org of leafOrgs) {
          try {
            const members = await this.getMembersWithRoles(org.id, false);

            // 유효한 멤버 배열인 경우 멤버 수 설정
            if (members && Array.isArray(members)) {
              org.memberCount = members.length;
              console.log(
                `조직 ID ${org.id} (${org.organization_name}): 멤버 ${org.memberCount}명`
              );
            } else {
              org.memberCount = 0;
              console.log(
                `조직 ID ${org.id} (${org.organization_name}): 멤버 없음`
              );
            }
          } catch (error) {
            console.error(`조직 ID ${org.id} 멤버 조회 오류:`, error);
            org.memberCount = 0;
          }
        }

        // 4. 상위 조직의 멤버 수를 계산 (상향식 접근법)
        // 먼저 조직 간의 계층 구조를 파악
        const orgLevels = [];
        const processedOrgs = new Set();

        // 리프 노드는 이미 처리했으므로 레벨 0으로 설정
        leafOrgs.forEach((org) => {
          processedOrgs.add(org.id);
        });

        // 나머지 조직의 레벨을 결정 (최대 10단계까지 처리)
        for (let level = 1; level <= 10; level++) {
          const currentLevelOrgs = [];

          this.organizations.forEach((org) => {
            // 이미 처리된 조직은 건너뜀
            if (processedOrgs.has(org.id)) {
              return;
            }

            // 이 조직의 모든 하위 조직이 이미 처리되었는지 확인
            const childOrgs = this.organizations.filter(
              (child) => child.upper_organization_id === org.id
            );

            const allChildrenProcessed =
              childOrgs.length === 0 ||
              childOrgs.every((child) => processedOrgs.has(child.id));

            if (allChildrenProcessed) {
              currentLevelOrgs.push(org);
              processedOrgs.add(org.id);
            }
          });

          if (currentLevelOrgs.length > 0) {
            orgLevels.push(currentLevelOrgs);
          } else if (processedOrgs.size === this.organizations.length) {
            // 모든 조직이 처리되었으면 종료
            break;
          }
        }

        // 레벨별로 멤버 수 계산 (낮은 레벨부터)
        console.log(`조직 레벨 수: ${orgLevels.length}`);

        orgLevels.forEach((levelOrgs, level) => {
          console.log(
            `레벨 ${level + 1} 조직 처리 중... (${levelOrgs.length}개)`
          );

          levelOrgs.forEach((org) => {
            // 하위 조직 찾기
            const childOrgs = this.organizations.filter(
              (child) => child.upper_organization_id === org.id
            );

            // 하위 조직의 멤버 수 합산
            let totalMembers = 0;
            childOrgs.forEach((child) => {
              totalMembers += child.memberCount || 0;
            });

            org.memberCount = totalMembers;
            console.log(
              `상위 조직 ID ${org.id} (${org.organization_name}): 멤버 ${org.memberCount}명 (하위 조직 ${childOrgs.length}개)`
            );
          });
        });

        // 5. 트리 다시 구성 (멤버 수 정보 반영)
        this.organizationTree = this.buildOrganizationTree(this.organizations);
        console.log("멤버 수 계산 완료");
      } catch (error) {
        console.error("멤버 수 계산 중 오류 발생:", error);
      }
    },

    selectOrganization(organization) {
      this.selectedOrganization = organization;
      this.fetchMembers(organization.id);
    },

    openOrganizationDialog(organization = null) {
      if (organization) {
        this.editedOrganization = {
          ...organization,
          // API 응답 필드 매핑
          organization_description:
            organization.organization_description ||
            organization.description ||
            "",
        };
      } else {
        this.editedOrganization = {
          id: null,
          organization_name: "",
          organization_code: "",
          organization_description: "",
          upper_organization_id: null,
        };
      }
      this.organizationDialog = true;
    },

    closeOrganizationDialog() {
      this.organizationDialog = false;
    },

    async saveOrganization() {
      try {
        // 상위 조직 ID가 문자열인 경우 숫자로 변환
        if (this.editedOrganization.upper_organization_id) {
          this.editedOrganization.upper_organization_id = Number(
            this.editedOrganization.upper_organization_id
          );
        }

        // API 요청 데이터 준비
        const organizationData = {
          ...this.editedOrganization,
          // 필드 매핑 (organization_description -> description)
          description: this.editedOrganization.organization_description,
        };

        let response;
        if (this.editedOrganization.id) {
          // 조직 수정 API 호출
          try {
            response = await this.updateOrganization(
              this.editedOrganization.id,
              organizationData,
              true
            );

            if (response && response.error) {
              console.error("조직 수정 API 오류:", response.error);
              throw new Error(response.error);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 "${organizationData.organization_name}"이(가) 수정되었습니다.`,
                color: "success",
              });
            });
          } catch (error) {
            console.error("조직 수정 중 API 오류 발생:", error);

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 수정 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });

            // 오류가 발생해도 UI 업데이트를 위해 계속 진행
            console.log("조직 수정 UI 업데이트 진행 (API 오류)");
          }
        } else {
          // 조직 추가 API 호출
          try {
            response = await this.createOrganization(organizationData, true);

            if (response && response.error) {
              console.error("조직 추가 API 오류:", response.error);
              throw new Error(response.error);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 "${organizationData.organization_name}"이(가) 추가되었습니다.`,
                color: "success",
              });
            });
          } catch (error) {
            console.error("조직 추가 중 API 오류 발생:", error);

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `조직 추가 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });

            // 오류가 발생해도 UI 업데이트를 위해 계속 진행
            console.log("조직 추가 UI 업데이트 진행 (API 오류)");
          }
        }

        this.closeOrganizationDialog();

        // 조직 정보를 다시 불러오고 멤버 수 계산
        await this.fetchOrganizationsOnly();

        // 조직 정보가 업데이트된 후 멤버 수 다시 계산
        this.$nextTick(() => {
          this.calculateMemberCounts();
        });
      } catch (error) {
        console.error("조직 저장 중 오류 발생:", error);
        alert("조직 저장 중 오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    },

    confirmDeleteOrganization(organization) {
      this.deleteType = "organization";
      this.deleteItem = organization;
      this.deleteDialogText = `조직 "${organization.organization_name}"을(를) 삭제하시겠습니까? 이 조직에 속한 모든 멤버 정보도 함께 삭제됩니다.`;
      this.deleteDialog = true;
    },

    // 멤버 관련 메서드
    async fetchMembers(organizationId) {
      if (!organizationId) {
        console.error("유효하지 않은 조직 ID입니다.");
        this.members = [];
        return;
      }

      this.loadingMembers = true;
      try {
        const members = await this.getMembersWithRoles(organizationId, true);

        // 404 에러 처리 - 해당 조직에 소속된 멤버가 없는 경우
        if (
          members &&
          ((members.error && members.error.includes("404")) ||
            (typeof members === "object" &&
              members.error &&
              typeof members.error === "object" &&
              members.error.response &&
              members.error.response.status === 404))
        ) {
          console.log(`조직 ID ${organizationId}에 소속된 멤버가 없습니다.`);
          this.members = [];
          return;
        }

        // API 호출 결과가 유효하지 않은 경우 빈 배열 사용 (더미 데이터 대신)
        if (!members || members.error || !Array.isArray(members)) {
          console.log(
            `조직 ID ${organizationId}의 멤버 데이터를 가져오지 못했습니다.`
          );
          this.members = [];
          return;
        }

        // 멤버 데이터 정렬 (MemberListView.vue 참고)
        members.sort((a, b) => {
          // 역할 우선순위에 따른 정렬
          const roleOrder = {
            그룹장: 1,
            부그룹장: 2,
            순장: 3,
            EBS: 4,
          };

          // 역할 우선순위 확인 (지정된 역할이 없으면 높은 값 할당)
          const roleA =
            roleOrder[a.roleName] !== undefined ? roleOrder[a.roleName] : 10;
          const roleB =
            roleOrder[b.roleName] !== undefined ? roleOrder[b.roleName] : 10;

          // 역할 우선순위가 다르면 그에 따라 정렬
          if (roleA !== roleB) {
            return roleA - roleB;
          }

          // 역할 우선순위가 같거나 지정되지 않은 역할인 경우
          // 새가족 여부로 정렬 (새가족이 위에)
          if (a.isNewMember === "Y" && b.isNewMember !== "Y") return -1;
          if (a.isNewMember !== "Y" && b.isNewMember === "Y") return 1;

          // 장기결석자 정렬
          if (a.isLongTermAbsentee === "Y" && b.isLongTermAbsentee !== "Y")
            return -1;
          if (a.isLongTermAbsentee !== "Y" && b.isLongTermAbsentee === "Y")
            return 1;

          // 이름 알파벳 순 정렬
          return a.name.localeCompare(b.name);
        });

        this.members = members;
      } catch (error) {
        console.error("멤버 목록 조회 중 오류 발생:", error);

        // 404 에러인 경우 - 해당 조직에 소속된 멤버가 없는 경우
        if (error.response && error.response.status === 404) {
          console.log(`조직 ID ${organizationId}에 소속된 멤버가 없습니다.`);
          this.members = [];
        } else {
          // 다른 오류 발생 시 빈 배열 사용 (더미 데이터 대신)
          this.members = [];
        }
      } finally {
        this.loadingMembers = false;
      }
    },

    openMemberDialog(member = null) {
      if (member) {
        // 기존 멤버 수정
        this.editedMember = { ...member };
        // 원본 데이터 저장
        this.originalMember = { ...member };
        console.log("멤버 수정 모드:", this.editedMember);
      } else {
        // 새 멤버 추가
        console.group("🆕 [Debug] 새 멤버 기본값 설정");
        this.editedMember = {
          userId: null,
          name: "",
          nameSuffix: "FFF", // 기본값 FFF로 설정
          phoneNumber: "00000000000", // 기본값 00000000000으로 설정
          genderType: "M",
          email: "email@email.com", // 기본값 email@email.com으로 설정
          birthDate: null,
          isNewMember: "Y", // 신규 멤버는 자동으로 새가족으로 설정
          isLongTermAbsentee: "N",
          isKakaotalkChatMember: "N",
          roleId: 74,
          roleName: "순원",
          memberNumber: "",
          registrationDate: null,
          countryCode: "KOR",
          address: "",
          addressDetail: "",
          postcode: "",
          hobby: "",
          city: null,
          stateProvince: null,
          isAddressPublic: "N",
          isPhoneNumberPublic: "N",
          snsUrl: null,
        };
        console.log("신규 멤버 기본값:", this.editedMember);
        console.table({
          name: "빈 값(사용자 입력 필요)",
          nameSuffix: this.editedMember.nameSuffix,
          phoneNumber: this.editedMember.phoneNumber,
          genderType: this.editedMember.genderType,
          isNewMember: this.editedMember.isNewMember,
          roleId: this.editedMember.roleId,
          roleName: this.editedMember.roleName,
        });
        console.groupEnd();

        // 새 멤버 추가는 원본 데이터 없음
        this.originalMember = null;
        console.log("새 멤버 추가 모드");
      }
      this.memberDialog = true;
    },

    closeMemberDialog() {
      this.memberDialog = false;
      this.$nextTick(() => {
        this.editedMember = {
          userId: null,
          name: "",
          nameSuffix: "",
          phoneNumber: "",
          genderType: "M",
          email: "",
          birthDate: null,
          isNewMember: "N",
          isLongTermAbsentee: "N",
          isKakaotalkChatMember: "N",
          roleId: 74,
          roleName: "순원",
          memberNumber: "",
          registrationDate: null,
          countryCode: "KOR",
          address: "",
          addressDetail: "",
          postcode: "",
          hobby: "",
          city: null,
          stateProvince: null,
          isAddressPublic: "N",
          isPhoneNumberPublic: "N",
          snsUrl: null,
        };
        // 원본 데이터도 초기화
        this.originalMember = null;
      });
    },

    // 임의의 데이터 생성 메서드 추가
    generateRandomData(name) {
      // 이름에 기반한 랜덤 문자열 생성 (중복 방지)
      const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
      // name 매개변수 사용 (memberNumber에 이름 첫 글자 활용)
      const firstChar = name ? name.charAt(0).toUpperCase() : "M";

      console.group("🎲 [Debug] 임의 데이터 생성");
      console.log("이름 파라미터:", name || "없음");

      const randomData = {
        birthDate: "1990-01-01",
        memberNumber: `${firstChar}${randomSuffix}`,
        address: "서울특별시 강남구",
        addressDetail: "123번지",
        postcode: `0${randomSuffix}`,
        hobby: "독서",
      };
      console.log("생성된 임의 데이터:", randomData);
      console.groupEnd();

      return randomData;
    },

    // 필드 유효성 검사 메서드 추가
    validateFields() {
      // 초기화
      this.validationErrors = {
        name: false,
        phoneNumber: false,
        genderType: false,
        roleId: false,
      };

      // 필수 필드 검사
      let isValid = true;

      if (!this.editedMember.name || this.editedMember.name.trim() === "") {
        this.validationErrors.name = true;
        isValid = false;
      }

      if (
        !this.editedMember.phoneNumber ||
        this.editedMember.phoneNumber.trim() === ""
      ) {
        this.validationErrors.phoneNumber = true;
        isValid = false;
      }

      if (!this.editedMember.genderType) {
        this.validationErrors.genderType = true;
        isValid = false;
      }

      if (!this.editedMember.roleId) {
        this.validationErrors.roleId = true;
        isValid = false;
      }

      return isValid;
    },

    async saveMember() {
      if (this.savingMember) {
        console.log(
          "🚫 [Save/Update Member] 이미 저장 중입니다. 중복 요청을 방지합니다."
        );
        return; // 이미 저장 중이면 중복 호출 방지
      }

      this.savingMember = true; // 저장 시작 표시
      console.time("멤버 저장 작업 시간");

      try {
        console.group("🔄 [Debug] 멤버 저장 시작");
        console.log(
          "🛠️ [Save/Update Member] 멤버 정보 저장/업데이트를 시작합니다."
        );
        console.log("현재 멤버 데이터:", this.editedMember);
        console.log(
          "작업 유형:",
          this.editedMember.userId ? "멤버 수정" : "신규 멤버 추가"
        );
        console.groupEnd();

        if (!this.selectedOrganization) {
          console.error("선택된 조직이 없습니다.");
          alert("선택된 조직이 없습니다. 조직을 먼저 선택해주세요.");
          this.savingMember = false;
          return;
        }

        // 유효성 검사 실행
        if (!this.validateFields()) {
          console.warn("⚠️ [Validation] 필수 정보가 누락되었습니다.");

          // 스낵바와 알럿 모두 표시
          this.$store.dispatch("snackbar/showMessage", {
            message: `필수 항목을 입력해주세요.`,
            color: "error",
          });

          alert("모든 필수 항목(*)을 입력해주세요.");
          this.savingMember = false;
          return;
        }

        // 역할 ID가 없는 경우 기본값 설정 (순원: 74)
        if (!this.editedMember.roleId) {
          console.log("역할 ID가 없어서 기본값 74(순원)으로 설정합니다.");
          this.editedMember.roleId = 74;
        }

        // 데이터 변경 감지 (수정 모드일 경우)
        if (this.editedMember.userId && !this.isDataChanged) {
          console.log("🔍 [Change Detection] 변경된 데이터가 없습니다.");

          // 스낵바와 알럿 모두 표시
          this.$store.dispatch("snackbar/showMessage", {
            message: "변경된 데이터가 없습니다.",
            color: "info",
          });

          alert("변경된 데이터가 없습니다. 데이터를 수정하거나 취소하세요.");
          this.closeMemberDialog();
          this.savingMember = false;
          return;
        }

        // 임의의 데이터 생성
        const randomData = this.generateRandomData(this.editedMember.name);

        // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
        const today = new Date().toISOString().split("T")[0];

        // API 요청 데이터 형식 맞추기 (snake_case로 통일)
        const apiUserData = {
          id: this.editedMember.userId, // ID 필드 추가
          name: this.editedMember.name,
          name_suffix: this.editedMember.nameSuffix || "FFF", // 구분자가 없으면 "FFF"로 설정
          email: this.editedMember.email || "email@email.com", // 이메일이 없으면 "email@email.com"으로 설정
          phone_number: this.editedMember.phoneNumber,
          password: this.editedMember.phoneNumber || "1234",
          gender_type: this.editedMember.genderType,
          birth_date: this.editedMember.birthDate || randomData.birthDate,
          church_member_number:
            this.editedMember.memberNumber || randomData.memberNumber,
          church_registration_date: this.editedMember.registrationDate || today,
          country: this.editedMember.countryCode || "KOR",
          address: this.editedMember.address || randomData.address,
          address_detail:
            this.editedMember.addressDetail || randomData.addressDetail,
          zip_postal_code: this.editedMember.postcode || randomData.postcode,
          hobby: this.editedMember.hobby || randomData.hobby,
          is_long_term_absentee: this.editedMember.isLongTermAbsentee,
          is_new_member: this.editedMember.isNewMember,
          is_kakaotalk_chat_member: this.editedMember.isKakaotalkChatMember,
          is_address_public: this.editedMember.isAddressPublic,
          is_phone_number_public: this.editedMember.isPhoneNumberPublic,
          sns_url: this.editedMember.snsUrl,
          city: this.editedMember.city,
          state_province: this.editedMember.stateProvince,
          role_id: this.editedMember.roleId, // 필수 필드로 포함
        };

        const organizationId = this.selectedOrganization.id;
        const organizationCode = this.selectedOrganization.organization_code;

        // 상세 디버깅 정보 - 원본 멤버 데이터
        console.group("🔍 [Debug] 원본 멤버 데이터 (상세)");
        console.log("editedMember 객체:", this.editedMember);
        console.log("originalMember 객체:", this.originalMember);
        console.groupEnd();

        // 상세 디버깅 정보 - 변환된 API 데이터
        console.group("🔄 [Debug] 변환된 API 데이터 (상세)");
        console.log("apiUserData:", apiUserData);
        console.table({
          id: apiUserData.id,
          name: apiUserData.name,
          name_suffix: apiUserData.name_suffix,
          email: apiUserData.email,
          phone_number: apiUserData.phone_number,
          password: apiUserData.password,
          gender_type: apiUserData.gender_type,
          birth_date: apiUserData.birth_date,
          church_member_number: apiUserData.church_member_number,
          church_registration_date: apiUserData.church_registration_date,
          country: apiUserData.country,
          role_id: apiUserData.role_id,
          is_new_member: apiUserData.is_new_member,
          is_long_term_absentee: apiUserData.is_long_term_absentee,
          is_kakaotalk_chat_member: apiUserData.is_kakaotalk_chat_member,
        });
        console.groupEnd();

        // 조직 정보 디버깅
        console.group("🏢 [Debug] 조직 정보 (상세)");
        console.log("selectedOrganization:", this.selectedOrganization);
        console.table({
          id: organizationId,
          organization_code: organizationCode,
          organization_name: this.selectedOrganization.organization_name,
        });
        console.groupEnd();

        // 사용자 정보 디버깅
        console.group("👤 [Debug] 작업자 정보 (상세)");
        console.log("userInfo:", this.userInfo);
        console.table({
          id: this.userInfo && this.userInfo.id ? this.userInfo.id : "없음",
          email:
            this.userInfo && this.userInfo.email ? this.userInfo.email : "없음",
          roles:
            this.userInfo && this.userInfo.roles
              ? JSON.stringify(this.userInfo.roles)
              : "없음",
        });
        console.groupEnd();

        // API 요청 형식 디버깅 로그
        console.group("📡 [Debug] API 요청 데이터 (최종)");
        const finalRequestData = {
          userData: apiUserData,
          organizationId,
          organizationCode,
          idOfCreatingUser:
            this.userInfo && this.userInfo.id ? this.userInfo.id : null,
        };
        console.log("API 요청 형식:", finalRequestData);
        console.log(
          "API 엔드포인트:",
          `${this.BASIC_URL}${this.CurrentMember_EP}`
        );
        console.log("HTTP 메서드:", "POST");
        console.groupEnd();

        let response;

        if (this.editedMember.userId) {
          // 멤버 수정 API 호출
          console.log(
            "🔄 [Update Member] 멤버 수정 시작:",
            this.editedMember.name,
            "유저 ID:",
            this.editedMember.userId
          );

          try {
            // MasterCtrl의 openUpdateData 메서드 사용 (MemberUpdateView.vue 방식으로 변경)
            response = await this.openUpdateData(
              this.User, // "/users" URL 사용
              this.editedMember.userId, // 수정할 회원 ID
              apiUserData, // 수정할 데이터
              true // 로그 표시
            );

            console.log("✅ [Update Member] 업데이트 응답:", response);

            // 성공적으로 수정된 경우 UI 업데이트
            const index = this.members.findIndex(
              (m) => m.userId === this.editedMember.userId
            );

            if (index !== -1) {
              // UI에 표시할 데이터 형식으로 변환 (camelCase로)
              const updatedMember = {
                userId: this.editedMember.userId,
                name: apiUserData.name,
                nameSuffix: apiUserData.name_suffix,
                phoneNumber: apiUserData.phone_number,
                genderType: apiUserData.gender_type,
                email: apiUserData.email,
                birthDate: apiUserData.birth_date,
                isNewMember: apiUserData.is_new_member,
                isLongTermAbsentee: apiUserData.is_long_term_absentee,
                isKakaotalkChatMember: apiUserData.is_kakaotalk_chat_member,
                roleId: apiUserData.role_id,
                roleName: this.getRoleName(apiUserData.role_id), // 역할 이름 유지
                memberNumber: apiUserData.church_member_number,
                registrationDate: apiUserData.church_registration_date,
                countryCode: apiUserData.country,
                address: apiUserData.address,
                addressDetail: apiUserData.address_detail,
                postcode: apiUserData.zip_postal_code,
                hobby: apiUserData.hobby,
              };

              this.members.splice(index, 1, updatedMember);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              try {
                this.$store.dispatch("snackbar/showMessage", {
                  message: `멤버 ${this.editedMember.name}님의 정보가 수정되었습니다.`,
                  color: "success",
                });
              } catch (e) {
                console.warn("스낵바 메시지 표시 오류:", e);
                alert(
                  `멤버 ${this.editedMember.name}님의 정보가 수정되었습니다.`
                );
              }
            });

            console.log(
              "✅ [Update Member] 멤버 수정 완료:",
              this.editedMember.name
            );

            // 대화 상자 닫기
            this.closeMemberDialog();
          } catch (error) {
            console.error("❌ [API Error] 멤버 수정 실패:", error);

            // 작업 실패 메시지 표시
            try {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 수정 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            } catch (e) {
              console.warn("스낵바 메시지 표시 오류:", e);
              alert(`멤버 수정 중 오류가 발생했습니다: ${error.message}`);
            }
          }
        } else {
          // 멤버 추가 API 호출
          console.log(
            "➕ [Create Member] 신규 멤버 추가 시작:",
            this.editedMember.name
          );

          try {
            console.log("💡 [Debug] createMember 함수 호출 전");
            console.log("- userData:", JSON.stringify(apiUserData));
            console.log("- organizationId:", organizationId);
            console.log("- organizationCode:", organizationCode);
            console.log(
              "- idOfCreatingUser:",
              this.userInfo && this.userInfo.id ? this.userInfo.id : null
            );

            // 브라우저 개발자 도구 중단점 설정 (디버깅 용도)
            console.log(
              "%c API 호출 직전 - 개발자 도구에서 중단점을 설정할 수 있습니다",
              "background: #ff0000; color: #ffffff; font-size: 16px;"
            );

            // API 호출 전 네트워크 탭 확인 메시지
            console.log(
              "%c 개발자 도구의 네트워크 탭에서 API 요청을 확인하세요",
              "background: #00ff00; color: #000000; font-size: 16px;"
            );

            response = await this.createMember(
              apiUserData,
              organizationId,
              organizationCode,
              this.userInfo && this.userInfo.id ? this.userInfo.id : null,
              true
            );

            console.log("💡 [Debug] createMember 함수 호출 후");
            console.group("✅ [Debug] API 응답 데이터 (상세)");
            console.log("응답 원본:", response);
            if (response && typeof response === "object") {
              console.table(response);
            }
            console.groupEnd();

            if (!response) {
              console.error("❌ [API Error] 응답이 없습니다.");
              throw new Error("API 응답이 없습니다.");
            }

            if (response && response.error) {
              console.error(
                "❌ [API Error] 멤버 추가 API 오류:",
                response.error
              );
              throw new Error(response.error);
            }

            // 새로 생성된 멤버의 ID 가져오기
            const memberId = response.userId || response.id;

            if (memberId) {
              // UI에 표시할 데이터 형식으로 변환 (camelCase로)
              const newMember = {
                userId: memberId,
                name: apiUserData.name,
                nameSuffix: apiUserData.name_suffix,
                phoneNumber: apiUserData.phone_number,
                genderType: apiUserData.gender_type,
                email: apiUserData.email,
                birthDate: apiUserData.birth_date,
                isNewMember: apiUserData.is_new_member,
                isLongTermAbsentee: apiUserData.is_long_term_absentee,
                isKakaotalkChatMember: apiUserData.is_kakaotalk_chat_member,
                roleId: apiUserData.role_id,
                roleName: this.getRoleName(apiUserData.role_id), // 역할 ID로부터 이름 가져오기
                memberNumber: apiUserData.church_member_number,
                registrationDate: apiUserData.church_registration_date,
                countryCode: apiUserData.country,
                address: apiUserData.address,
                addressDetail: apiUserData.address_detail,
                postcode: apiUserData.zip_postal_code,
                hobby: apiUserData.hobby,
              };

              this.members.push(newMember);
              console.log(
                "✅ [Create Member] 멤버 목록에 추가된 데이터:",
                newMember
              );

              // 성공 메시지 표시
              this.$nextTick(() => {
                try {
                  this.$store.dispatch("snackbar/showMessage", {
                    message: `멤버 ${this.editedMember.name}님이 추가되었습니다.`,
                    color: "success",
                  });
                } catch (e) {
                  console.warn("스낵바 메시지 표시 오류:", e);
                  alert(`멤버 ${this.editedMember.name}님이 추가되었습니다.`);
                }
              });

              // 대화 상자 닫기
              this.closeMemberDialog();
            } else {
              console.error(
                "❌ [API Error] API 응답에 사용자 ID가 없습니다:",
                response
              );
              throw new Error("API 응답에 사용자 ID가 없습니다.");
            }
          } catch (error) {
            console.error("❌ [API Error] 멤버 추가 실패:", error);

            // 더 자세한 오류 정보 출력
            if (error.response) {
              console.error(
                "❌ [API Error Details] 상태:",
                error.response.status
              );
              console.error(
                "❌ [API Error Details] 헤더:",
                error.response.headers
              );
              console.error(
                "❌ [API Error Details] 데이터:",
                error.response.data
              );

              // 응답에 메시지가 있으면 표시
              const errorMessage =
                error.response.data && error.response.data.message
                  ? error.response.data.message
                  : error.message;

              alert(
                `멤버 추가 실패 (${error.response.status}): ${errorMessage}`
              );
            } else if (error.request) {
              // 요청은 보냈지만 응답을 받지 못한 경우
              console.error("❌ [API Error Details] 요청만 됨:", error.request);
              alert(`멤버 추가 요청 후 응답 없음: ${error.message}`);
            } else {
              // 요청 설정 중 오류 발생
              console.error("❌ [API Error Details] 설정 오류:", error.message);
              alert(`멤버 추가 요청 설정 중 오류: ${error.message}`);
            }

            // 작업 실패 메시지 표시
            try {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 추가 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            } catch (e) {
              console.warn("스낵바 메시지 표시 오류:", e);
            }
          }
        }

        // 정렬 다시 수행
        this.members.sort((a, b) => {
          // 역할 우선순위에 따른 정렬
          const roleOrder = {
            그룹장: 1,
            부그룹장: 2,
            순장: 3,
            EBS: 4,
          };

          // 역할 우선순위 확인 (지정된 역할이 없으면 높은 값 할당)
          const roleA =
            roleOrder[a.roleName] !== undefined ? roleOrder[a.roleName] : 10;
          const roleB =
            roleOrder[b.roleName] !== undefined ? roleOrder[b.roleName] : 10;

          // 역할 우선순위가 다르면 그에 따라 정렬
          if (roleA !== roleB) {
            return roleA - roleB;
          }

          // 역할이 같으면 이름으로 정렬
          return a.name.localeCompare(b.name);
        });
      } catch (error) {
        console.error("❌ [Error] 멤버 저장 중 예상치 못한 오류:", error);
        alert(`멤버 저장 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        this.savingMember = false; // 저장 작업 완료 표시
        console.timeEnd("멤버 저장 작업 시간");
      }
    },

    confirmDeleteMember(member) {
      this.deleteType = "member";
      this.deleteItem = member;
      this.deleteDialogText = `멤버 "${member.name}"님을 삭제하시겠습니까?`;
      this.deleteDialog = true;
    },

    // 삭제 확인
    async deleteConfirm() {
      try {
        if (this.deleteType === "organization") {
          await this.deleteOrganization(this.deleteItem.id, true);
          await this.fetchOrganizationsOnly();
          if (
            this.selectedOrganization &&
            this.selectedOrganization.id === this.deleteItem.id
          ) {
            this.selectedOrganization = null;
            this.selectedOrganizationIndex = -1;
            this.members = [];
          }

          // 조직 삭제 후 멤버 수 다시 계산
          this.$nextTick(() => {
            this.calculateMemberCounts();
          });
        } else if (this.deleteType === "member") {
          // 실제 API 호출로 멤버 삭제
          try {
            console.log(
              `❌ 멤버 삭제 시작 - ID: ${this.deleteItem.userId}, 이름: ${this.deleteItem.name}`
            );
            console.log(`✅ 멤버 삭제 완료`);

            // MemberListView.vue 방식으로 변경: openDeleteData 메서드 사용
            await this.openDeleteData(this.User, this.deleteItem.userId, true);
            console.log(`✅ 멤버 삭제 완료`);

            // 성공적으로 삭제된 경우 UI에서 멤버 제거
            const index = this.members.findIndex(
              (m) => m.userId === this.deleteItem.userId
            );
            if (index !== -1) {
              this.members.splice(index, 1);
            }

            // 성공 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 ${this.deleteItem.name}님이 삭제되었습니다.`,
                color: "success",
              });
            });

            console.log(`멤버 ${this.deleteItem.name} 삭제 완료`);

            // 멤버 삭제 후 멤버 수 다시 계산
            this.$nextTick(() => {
              this.calculateMemberCounts();
            });

            // 선택된 조직이 있으면 멤버 목록 새로고침
            if (this.selectedOrganization) {
              console.log(`🔄 멤버 리스트 새로고침`);
              await this.fetchMembers(this.selectedOrganization.id);
            }
          } catch (error) {
            console.error("멤버 삭제 중 오류 발생:", error);

            // 오류 발생 시에도 UI에서 멤버 제거 (백엔드 오류 대응)
            const index = this.members.findIndex(
              (m) => m.userId === this.deleteItem.userId
            );
            if (index !== -1) {
              this.members.splice(index, 1);
              console.log(
                `멤버 ${this.deleteItem.name} UI에서만 삭제됨 (API 오류)`
              );

              // 멤버 삭제 후 멤버 수 다시 계산
              this.$nextTick(() => {
                this.calculateMemberCounts();
              });
            }

            // 오류 메시지 표시
            this.$nextTick(() => {
              this.$store.dispatch("snackbar/showMessage", {
                message: `멤버 삭제 중 오류가 발생했습니다: ${error.message}`,
                color: "error",
              });
            });
          }
        }
      } catch (error) {
        console.error("삭제 확인 중 오류 발생:", error);
        this.$store.dispatch("snackbar/showMessage", {
          message: `삭제 중 오류가 발생했습니다: ${error.message}`,
          color: "error",
        });
      } finally {
        this.deleteDialog = false;
      }
    },

    // 조직 트리 관련 메서드
    buildOrganizationTree(organizations) {
      console.log(
        "buildOrganizationTree 호출됨, 조직 데이터:",
        organizations ? organizations.length : 0
      );

      if (
        !organizations ||
        !Array.isArray(organizations) ||
        organizations.length === 0
      ) {
        console.warn("유효한 조직 데이터가 없습니다.");
        return [];
      }

      const tree = [];
      const organizationMap = new Map();

      // 조직 객체를 맵에 저장
      for (const org of organizations) {
        try {
          if (!org || !org.id) {
            console.warn("유효하지 않은 조직 데이터 무시:", org);
            continue;
          }

          // API 응답 필드 매핑 (organization_description -> description)
          const mappedOrg = {
            ...org,
            description: org.organization_description || org.description || "",
            children: [],
            // 최하위 조직 여부를 저장할 속성 추가
            isLeafNode: true,
          };
          organizationMap.set(org.id, mappedOrg);
          console.log(
            `조직 매핑: ID ${org.id} - ${
              org.organization_name || org.name || "unnamed"
            }`
          );
        } catch (error) {
          console.error(
            `조직 데이터 매핑 중 오류 발생 (ID: ${org?.id || "unknown"}):`,
            error
          );
        }
      }

      console.log("조직 매핑 완료, 총 조직 수:", organizationMap.size);

      // 조직 객체를 트리 구조로 변환
      for (const org of organizations) {
        try {
          if (!org || !org.id) continue;

          if (!org.upper_organization_id) {
            // 상위 조직이 없는 경우 최상위 조직으로 추가
            console.log(
              `최상위 조직 추가: ${org.id} - ${
                org.organization_name || org.name || "unnamed"
              }`
            );
            tree.push(organizationMap.get(org.id));
          } else {
            // 상위 조직이 있는 경우
            const parent = organizationMap.get(org.upper_organization_id);
            if (parent) {
              // 부모 조직이 있으면 부모는 최하위 노드가 아님
              parent.isLeafNode = false;
              parent.children.push(organizationMap.get(org.id));
              console.log(
                `하위 조직 추가: ${org.id} - ${
                  org.organization_name || org.name || "unnamed"
                } -> 상위: ${org.upper_organization_id}`
              );
            } else {
              // 상위 조직ID가 있지만 맵에 없는 경우 최상위로 처리
              console.log(
                `상위 조직 없음, 최상위로 처리: ${org.id} - ${
                  org.organization_name || org.name || "unnamed"
                }`
              );
              tree.push(organizationMap.get(org.id));
            }
          }
        } catch (error) {
          console.error(
            `조직 트리 구성 중 오류 발생 (ID: ${org?.id || "unknown"}):`,
            error
          );
        }
      }

      console.log("최종 트리 구성 완료, 최상위 조직 수:", tree.length);
      if (tree.length > 0) {
        console.log(
          "최상위 조직 목록:",
          tree.map(
            (org) =>
              `${org.id} - ${org.organization_name || org.name || "unnamed"}`
          )
        );
      } else {
        console.warn(
          "최상위 조직이 없습니다. 모든 조직을 최상위로 처리합니다."
        );
        // 트리가 비어있으면 모든 조직을 최상위로 처리
        for (const [id, org] of organizationMap.entries()) {
          tree.push(org);
          console.log(
            `강제 최상위 조직 추가: ${id} - ${
              org.organization_name || org.name || "unnamed"
            }`
          );
        }
      }

      return tree;
    },

    handleOrganizationSelect(active) {
      try {
        if (active && active.length > 0) {
          // 선택된 조직 정보 설정
          const selectedOrg = active[0];
          this.selectedOrganization = selectedOrg;

          // 선택된 조직이 최하위 조직인 경우에만 멤버 목록 조회
          if (selectedOrg && selectedOrg.id) {
            if (selectedOrg.isLeafNode) {
              this.fetchMembers(selectedOrg.id);
            } else {
              // 최하위 조직이 아닌 경우 멤버 목록을 비우고 안내 메시지 표시
              this.members = [];
              this.loadingMembers = false;
              console.log("최하위 조직만 멤버를 조회할 수 있습니다.");
            }
          } else {
            console.warn("선택된 조직에 유효한 ID가 없습니다.");
            this.members = [];
            this.loadingMembers = false;
          }
        } else {
          this.selectedOrganization = null;
          this.members = [];
          this.loadingMembers = false;
        }
      } catch (error) {
        console.error("조직 선택 처리 중 오류 발생:", error);
        // 오류가 발생해도 UI 상태는 유지
        if (!this.selectedOrganization) {
          this.members = [];
        }
        this.loadingMembers = false;
      }
    },

    // 첫 번째 최하위 조직 선택 메서드
    selectFirstLeafNode(tree) {
      console.log("첫 번째 최하위 조직 선택 시도...");
      if (!tree || !Array.isArray(tree) || tree.length === 0) {
        console.warn("조직 트리가 비어있어 선택할 수 없습니다.");
        return;
      }

      // 깊이 우선 탐색으로 최하위 조직 찾기
      const findFirstLeafNode = (nodes) => {
        for (const node of nodes) {
          if (node.isLeafNode) {
            console.log(
              `최하위 조직 발견: ${node.id} - ${
                node.organization_name || node.name || "unnamed"
              }`
            );
            return node;
          }

          if (node.children && node.children.length > 0) {
            const leafNode = findFirstLeafNode(node.children);
            if (leafNode) return leafNode;
          }
        }
        return null;
      };

      // 최하위 조직 찾기
      const leafNode = findFirstLeafNode(tree);

      if (leafNode) {
        console.log(
          `최하위 조직 선택: ${leafNode.id} - ${
            leafNode.organization_name || leafNode.name || "unnamed"
          }`
        );
        this.selectedOrganization = leafNode;

        // 선택된 조직의 멤버 목록 조회
        this.fetchMembers(leafNode.id);
      } else {
        // 최하위 조직이 없으면 첫 번째 조직 선택
        console.log("최하위 조직이 없어 첫 번째 조직 선택");
        this.selectedOrganization = tree[0];

        // 선택된 조직이 최하위 조직이 아니므로 멤버 목록은 비움
        this.members = [];
      }
    },

    // 더미 데이터 반환 메서드 (API 호출 실패 시 사용)
    getDummyOrganizations() {
      return [
        {
          id: 1,
          organization_name: "코람데오 청년선교회",
          organization_code: "CORAMDEO",
          description:
            "코람데오 청년선교회는 청년들의 신앙과 교제를 위한 조직입니다.",
          upper_organization_id: null,
          memberCount: 0,
        },
        {
          id: 2,
          organization_name: "코람데오_1국",
          organization_code: "CORAMDEO_DEPT1",
          description: "코람데오 청년선교회 1국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 3,
          organization_name: "코람데오_2국",
          organization_code: "CORAMDEO_DEPT2",
          description: "코람데오 청년선교회 2국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 4,
          organization_name: "코람데오_3국",
          organization_code: "CORAMDEO_DEPT3",
          description: "코람데오 청년선교회 3국입니다.",
          upper_organization_id: 1,
          memberCount: 0,
        },
        {
          id: 5,
          organization_name: "코람데오_1국_1팀",
          organization_code: "CORAMDEO_DEPT1_TEAM1",
          description: "코람데오 청년선교회 1국 1팀입니다.",
          upper_organization_id: 2,
          memberCount: 0,
        },
      ];
    },

    // 역할에 따른 색상 지정
    getRoleColor(roleName) {
      const colorMap = {
        그룹장: "#B3C6FF", // 파스텔 블루
        부그룹장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
        순장: "#B3C6FF", // 그룹장과 같은 파스텔 블루
        EBS: "#FFF4B3", // 파스텔 옐로우
        순원: "#C2E0C2", // 파스텔 그린
        회원: "#D6EAD6", // 연한 파스텔 그린
      };
      return colorMap[roleName] || "#E0E0E0"; // 기본 연한 회색
    },

    // 역할 ID로부터 역할 이름 반환
    getRoleName(roleId) {
      const roleMap = {
        72: "그룹장",
        73: "EBS",
        74: "순원",
      };
      return roleMap[roleId] || "회원";
    },

    // 주소 검색 기능 추가
    execDaumPostcode() {
      if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let roadAddr = data.roadAddress; // 도로명 주소 변수
            let extraRoadAddr = ""; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraRoadAddr +=
                extraRoadAddr !== ""
                  ? ", " + data.buildingName
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraRoadAddr !== "") {
              extraRoadAddr = " (" + extraRoadAddr + ")";
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            this.editedMember.postcode = data.zonecode;
            this.editedMember.address = roadAddr;

            // 커서를 상세주소 필드로 이동한다.
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
        console.error("Daum Postcode 서비스를 로드할 수 없습니다.");
        this.$store.dispatch("snackbar/showMessage", {
          message: "주소 검색 서비스를 로드할 수 없습니다. 직접 입력해주세요.",
          color: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss">
.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep table {
  border-collapse: collapse;
}

.v-data-table ::v-deep th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}

.v-data-table ::v-deep td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}

/* 이름 아바타 스타일 */
.name-avatar {
  background: linear-gradient(135deg, #7ea394, #c2e0c2) !important;
  font-weight: bold;
}

/* MemberRegistrationView.vue에서 가져온 스타일 */
.wc-bold-600 {
  font-weight: 600;
}

.wc-fs-18 {
  font-size: 18px;
}

.wc-direction-text {
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 20px;
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
  background-color: #7ea394;
}

input:focus + .slider {
  box-shadow: 0 0 1px #7ea394;
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

.fadeIn {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-transparent {
  background-color: transparent !important;
}

/* 특정 페이지에서만 헤더와 메뉴 버튼 숨기기 (조직관리 페이지) */
.organization-management-page :deep(.v-app-bar__nav-icon) {
  display: none !important;
}

.organization-management-page :deep(.v-toolbar__content > .v-btn.v-btn--icon) {
  display: none !important;
}

.organization-management-page :deep(.v-toolbar__items) {
  display: none !important;
}

/* 조직 트리뷰 아이템 간격 조정 */
.v-treeview-node__root {
  margin-bottom: 4px;
}

/* 이름 볼드 처리 및 구분자 스타일 */
.member-name {
  font-weight: 600;
}

.member-suffix {
  opacity: 0.7;
  font-size: 0.85em;
}

/* 필드 제목 스타일 */
.field-title {
  font-weight: 500;
  font-size: 0.95rem;
  color: #444;
  margin-left: 5px;
}

/* 커스텀 입력 필드 스타일 */
.org-custom-input {
  height: 50px !important;
  border-radius: 20px !important;
  border: 2px solid rgb(240, 238, 238) !important;
  box-shadow: 5px 5px 15px #00000012, -5px -5px 15px #ffffff !important;
  transition: all 0.3s ease;
}

.org-custom-input:focus-within {
  box-shadow: 7px 7px 20px #00000015, -7px -7px 20px #ffffff !important;
  border-color: #7ea394 !important;
}

.org-custom-select .v-input__slot {
  border-radius: a20px !important;
  box-shadow: 5px 5px 15px #00000012, -5px -5px 15px #ffffff !important;
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
  content: "";
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

/* 왼쪽 메뉴와 상단 헤더 숨기기 - 이 부분을 제거합니다 */
/* :global(.v-navigation-drawer) {
  display: none !important;
} */

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
</style>
