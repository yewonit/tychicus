/**
 * 멤버 관련 메서드
 */

import dayjs from 'dayjs';
import { sortMembers, createDefaultMember } from '@/utils/memberUtils';

export default {
  // 멤버 조회
  async fetchMembers(organizationId) {
    if (!organizationId) {
      this.members = [];
      return;
    }

    this.loadingMembers = true;
    try {
      let members;

      // 캐시된 데이터가 있으면 사용
      if (
        this.memberCache[organizationId] &&
        this.memberCache[organizationId].members
      ) {
        members = this.memberCache[organizationId].members;
      } else {
        members = await this.getMembersWithRoles(organizationId, true);

        // 유효한 멤버 배열인 경우 캐시에 저장
        if (members && Array.isArray(members)) {
          const organization = this.findOrganizationById(organizationId);
          this.memberCache[organizationId] = {
            members,
            organization_name: organization
              ? organization.name
              : `조직 ID: ${organizationId}`,
          };
        }
      }

      // 404 에러 처리 - 해당 조직에 소속된 멤버가 없는 경우
      if (
        members &&
        ((members.error && members.error.includes('404')) ||
          (typeof members === 'object' &&
            members.error &&
            typeof members.error === 'object' &&
            members.error.response &&
            members.error.response.status === 404))
      ) {
        this.members = [];
        return;
      }

      // API 호출 결과가 유효하지 않은 경우 빈 배열 사용
      if (!members || members.error || !Array.isArray(members)) {
        this.members = [];
        return;
      }

      // 멤버 데이터 정렬
      this.members = this.sortMembers(members);

      // 멤버 목록이 로드된 후 하이라이트된 멤버가 있으면 강조 표시
      if (this.highlightedMemberId) {
        this.$nextTick(() => {
          this.highlightMember(this.highlightedMemberId);
        });
      }
    } catch (error) {
      // 404 에러인 경우 - 해당 조직에 소속된 멤버가 없는 경우
      if (error.response && error.response.status === 404) {
        this.members = [];
      } else {
        // 다른 오류 발생 시 빈 배열 사용
        this.members = [];
      }
    } finally {
      this.loadingMembers = false;
    }
  },

  // 멤버 목록 정렬
  sortMembers(members) {
    return sortMembers(members);
  },

  // 멤버 다이얼로그 열기
  openMemberDialog(member = null) {
    if (member) {
      // 기존 멤버 수정
      this.editedMember = { ...member };
      this.originalMember = { ...member };
    } else {
      // 새 멤버 추가 - 유틸리티 함수 사용
      this.editedMember = createDefaultMember();
      this.originalMember = null;
    }
    this.memberDialog = true;
  },

  // 멤버 다이얼로그 닫기
  closeMemberDialog() {
    this.memberDialog = false;
    this.$nextTick(() => {
      this.editedMember = createDefaultMember();
      this.originalMember = null;
    });
  },

  // 필드 유효성 검사
  validateFields() {
    const name =
      !this.editedMember.name || this.editedMember.name.trim() === '';
    const phoneNumber =
      !this.editedMember.phoneNumber ||
      this.editedMember.phoneNumber.trim() === '';
    const genderType = !this.editedMember.genderType;
    const roleId = !this.editedMember.roleId;

    return !name && !phoneNumber && !genderType && !roleId;
  },

  // 멤버 저장
  async saveMember(memberData) {
    if (this.savingMember) return; // 중복 호출 방지

    this.savingMember = true;

    try {
      // 전달받은 멤버 데이터로 업데이트
      if (memberData) {
        this.editedMember = { ...memberData };
      }

      // 기본 검증
      if (!this.selectedOrganization) {
        this.showErrorMessage(
          '선택된 조직이 없습니다. 조직을 먼저 선택해주세요.'
        );
        this.savingMember = false;
        return;
      }

      // 유효성 검사
      if (!this.validateFields()) {
        this.showErrorMessage('모든 필수 항목(*)을 입력해주세요.');
        this.savingMember = false;
        return;
      }

      // 역할 ID 기본값 설정
      if (!this.editedMember.roleId) {
        this.editedMember.roleId = 74; // 기본값: 순원
      }

      // 데이터 변경 감지 (수정 모드)
      if (this.editedMember.userId && !this.isDataChanged) {
        this.showMessage('변경된 데이터가 없습니다.', 'info');
        this.closeMemberDialog();
        this.savingMember = false;
        return;
      }

      // API 데이터 준비
      const apiUserData = this.prepareApiUserData();
      const organizationId = this.selectedOrganization.id;
      const organizationCode = this.selectedOrganization.name;
      const creatingUserId = this.userInfo?.id || null;

      // 멤버 수정 또는 추가
      if (this.editedMember.userId) {
        await this.updateExistingMember(apiUserData);
      } else {
        await this.createNewMember(
          apiUserData,
          organizationId,
          organizationCode,
          creatingUserId
        );
      }

      // 목록 정렬 적용
      this.members = this.sortMembers(this.members);
    } catch (error) {
      this.showErrorMessage(
        `멤버 저장 중 오류가 발생했습니다: ${error.message}`
      );
    } finally {
      this.savingMember = false;
    }
  },

  // API 데이터 준비
  prepareApiUserData() {
    // 생년월일 형식 변환
    const birthDate = this.editedMember.birthDate
      ? dayjs(this.editedMember.birthDate).format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    // 등록일 형식 변환
    const registrationDate = this.editedMember.registrationDate
      ? dayjs(this.editedMember.registrationDate).format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    // API에 전송할 데이터 구성
    return {
      name: this.editedMember.name,
      name_suffix: this.editedMember.nameSuffix || 'FFF',
      gender_type: this.editedMember.genderType,
      birth_date: birthDate,
      country: this.editedMember.countryCode || 'KOR',
      phone_number: this.editedMember.phoneNumber,
      church_registration_date: registrationDate,
      is_new_member: this.editedMember.isNewMember,
    };
  },

  // 멤버 수정 처리
  async updateExistingMember(apiUserData) {
    try {
      await this.openUpdateData(
        this.User,
        this.editedMember.userId,
        apiUserData,
        true
      );

      // UI 업데이트
      const index = this.members.findIndex(
        (m) => m.userId === this.editedMember.userId
      );
      if (index !== -1) {
        const updatedMember = this.convertToUiMember(
          apiUserData,
          this.editedMember.userId
        );
        this.members.splice(index, 1, updatedMember);
      }

      // 성공 메시지
      this.showMessage(
        `멤버 ${this.editedMember.name}님의 정보가 수정되었습니다.`
      );
      this.closeMemberDialog();
    } catch (error) {
      this.showErrorMessage(
        `멤버 수정 중 오류가 발생했습니다: ${error.message}`
      );
    }
  },

  // 새 멤버 생성 처리
  async createNewMember(
    apiUserData,
    organizationId,
    organizationCode,
    creatingUserId
  ) {
    try {
      const response = await this.createMember(
        apiUserData,
        organizationId,
        organizationCode,
        creatingUserId
      );

      if (!response) {
        throw new Error('API 응답이 없습니다.');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      // 새로 생성된 멤버의 ID 가져오기
      const memberId = response.userId || response.id;
      if (!memberId) {
        throw new Error('API 응답에 사용자 ID가 없습니다.');
      }

      // UI에 멤버 추가
      const newMember = this.convertToUiMember(apiUserData, memberId);
      this.members.push(newMember);

      // 성공 메시지
      this.showMessage(`멤버 ${this.editedMember.name}님이 추가되었습니다.`);
      this.closeMemberDialog();
    } catch (error) {
      // 오류 정보 표시
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message;
        this.showErrorMessage(
          `멤버 추가 실패 (${error.response.status}): ${errorMessage}`
        );
      } else if (error.request) {
        this.showErrorMessage(`멤버 추가 요청 후 응답 없음: ${error.message}`);
      } else {
        this.showErrorMessage(`멤버 추가 요청 설정 중 오류: ${error.message}`);
      }
    }
  },

  // API 데이터를 UI 표시용 데이터로 변환
  convertToUiMember(apiData, userId) {
    return {
      userId,
      name: apiData.name,
      nameSuffix: apiData.name_suffix,
      phoneNumber: apiData.phone_number,
      genderType: apiData.gender_type,
      email: apiData.email,
      birthDate: apiData.birth_date,
      isNewMember: apiData.is_new_member,
      isLongTermAbsentee: apiData.is_long_term_absentee,
      isKakaotalkChatMember: apiData.is_kakaotalk_chat_member,
      roleId: apiData.role_id,
      roleName: this.getRoleName(apiData.role_id),
      memberNumber: apiData.church_member_number,
      registrationDate: apiData.church_registration_date,
      countryCode: apiData.country,
      countryName:
        apiData.country_name || this.getCountryNameByCode(apiData.country),
      address: apiData.address,
      addressDetail: apiData.address_detail,
      postcode: apiData.zip_postal_code,
      hobby: apiData.hobby,
    };
  },

  // 멤버 삭제 확인
  confirmDeleteMember(member) {
    this.deleteType = 'member';
    this.deleteItem = member;
    this.deleteDialogText = `멤버 "${member.name}"님을 삭제하시겠습니까?`;
    this.deleteDialog = true;
  },

  // 삭제 확인
  async deleteConfirm() {
    try {
      if (this.deleteType === 'organization') {
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
      } else if (this.deleteType === 'member') {
        // 실제 API 호출로 멤버 삭제
        try {
          await this.openDeleteData(this.User, this.deleteItem.userId, true);

          // 성공적으로 삭제된 경우 UI에서 멤버 제거
          const index = this.members.findIndex(
            (m) => m.userId === this.deleteItem.userId
          );
          if (index !== -1) {
            this.members.splice(index, 1);
          }

          // 성공 메시지 표시
          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `멤버 ${this.deleteItem.name}님이 삭제되었습니다.`,
              color: 'success',
            });
          });

          // 멤버 삭제 후 멤버 수 다시 계산
          this.$nextTick(() => {
            this.calculateMemberCounts();
          });
        } catch (error) {
          console.error('멤버 삭제 중 오류 발생:', error);

          // 오류 발생 시에도 UI에서 멤버 제거 (백엔드 오류 대응)
          const index = this.members.findIndex(
            (m) => m.userId === this.deleteItem.userId
          );
          if (index !== -1) {
            this.members.splice(index, 1);

            // 멤버 삭제 후 멤버 수 다시 계산
            this.$nextTick(() => {
              this.calculateMemberCounts();
            });
          }

          // 오류 메시지 표시
          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `멤버 삭제 중 오류가 발생했습니다: ${error.message}`,
              color: 'error',
            });
          });
        }
      }
    } catch (error) {
      console.error('삭제 확인 중 오류 발생:', error);
      this.$store.dispatch('snackbar/showMessage', {
        message: `삭제 중 오류가 발생했습니다: ${error.message}`,
        color: 'error',
      });
    } finally {
      this.deleteDialog = false;
    }
  },

  // 모든 최하위 조직의 멤버 로드
  async loadAllMembers() {
    if (this.allMembersLoaded) return;

    try {
      // 최하위 조직 찾기 (공통 함수로 추출 가능)
      const findLeafOrganizations = (orgs) => {
        let leaves = [];
        orgs.forEach((org) => {
          if (!org.children || org.children.length === 0 || org.isLeafNode) {
            leaves.push(org);
          } else if (org.children && org.children.length > 0) {
            leaves = leaves.concat(findLeafOrganizations(org.children));
          }
        });
        return leaves;
      };

      const leafOrgs = findLeafOrganizations(this.organizationTree);

      // 각 최하위 조직의 멤버 캐싱
      for (const org of leafOrgs) {
        await this.cacheOrganizationMembers(org.id);
      }

      this.allMembersLoaded = true;
    } catch (error) {
      console.error('모든 멤버 로드 중 오류:', error);
    }
  },

  // 조직의 멤버 정보를 캐시하는 메서드
  async cacheOrganizationMembers(organizationId) {
    // 이미 캐시된 데이터가 있으면 다시 가져오지 않음
    if (
      this.memberCache[organizationId] &&
      this.memberCache[organizationId].members
    ) {
      return this.memberCache[organizationId].members;
    }

    try {
      const members = await this.getMembersWithRoles(organizationId, false);

      // 유효한 멤버 배열인 경우 캐시에 저장
      if (members && Array.isArray(members)) {
        const organization = this.findOrganizationById(organizationId);
        this.memberCache[organizationId] = {
          members,
          name: organization ? organization.name : `조직 ID: ${organizationId}`,
        };
        return members;
      }
      return [];
    } catch {
      return [];
    }
  },

  // 멤버 강조 표시
  highlightMember(memberId) {
    // 이전 강조 표시 제거
    const previousHighlighted = document.querySelector('.highlighted-member');
    if (previousHighlighted) {
      previousHighlighted.classList.remove('highlighted-member');
    }

    // 새 멤버 강조 표시
    const memberRow = document.querySelector(`[data-member-id="${memberId}"]`);
    if (memberRow) {
      memberRow.classList.add('highlighted-member');
      // 화면에 보이도록 스크롤
      memberRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 3초 후 강조 표시 제거
    setTimeout(() => {
      const el = document.querySelector('.highlighted-member');
      if (el) {
        el.classList.remove('highlighted-member');
      }
      this.highlightedMemberId = null;
    }, 3000);
  },

  // 모든 새가족 로드 (최적화: 단일 API 호출)
  async loadAllNewMembers() {
    this.loadingAllMembers = true;

    try {
      // 새가족 데이터가 이미 있는 경우 다시 로드하지 않음
      if (this.allNewMembers && this.allNewMembers.length > 0) {
        this.loadingAllMembers = false;
        return;
      }

      // 새가족 데이터 초기화
      this.allNewMembers = [];

      // 새 API를 사용하여 모든 새가족을 한 번에 로드 (N+1 문제 해결)
      const newMembersResponse = await this.getAllNewMembers();

      // API 응답 검증
      if (newMembersResponse && newMembersResponse.error) {
        console.warn(
          '새 API를 사용할 수 없습니다. 기존 방식으로 폴백합니다.',
          newMembersResponse.error
        );
        // 기존 방식으로 폴백
        await this.loadAllLeafOrganizationsNewMembersLegacy();
        return;
      }

      // 응답 데이터 구조 확인 및 정규화
      let newMembers = [];
      if (Array.isArray(newMembersResponse)) {
        newMembers = newMembersResponse;
      } else if (
        newMembersResponse.data &&
        Array.isArray(newMembersResponse.data)
      ) {
        newMembers = newMembersResponse.data;
      }

      // 새가족 목록 설정 (이미 조직 정보가 포함되어 있음)
      this.allNewMembers = newMembers;

      // 등록일 기준으로 정렬 (백엔드에서 이미 정렬했을 수 있지만 안전하게)
      this.allNewMembers.sort((a, b) => {
        if (!a.registrationDate) return 1;
        if (!b.registrationDate) return -1;
        return b.registrationDate.localeCompare(a.registrationDate);
      });
    } catch (error) {
      console.error('새가족 로드 중 오류 발생:', error);
      // 오류 발생 시 기존 방식으로 폴백
      await this.loadAllLeafOrganizationsNewMembersLegacy();
    } finally {
      this.loadingAllMembers = false;
    }
  },

  // 모든 최하위 조직의 새가족 로드 (기존 방식 - 폴백용)
  async loadAllLeafOrganizationsNewMembersLegacy() {
    try {
      // 최하위 조직 찾기
      const findLeafOrganizations = (orgs) => {
        let leaves = [];
        orgs.forEach((org) => {
          if (!org.children || org.children.length === 0 || org.isLeafNode) {
            leaves.push(org);
          } else if (org.children && org.children.length > 0) {
            leaves = leaves.concat(findLeafOrganizations(org.children));
          }
        });
        return leaves;
      };

      const leafOrgs = findLeafOrganizations(this.organizationTree);

      // 각 최하위 조직의 새가족 멤버 로드 (기존 방식)
      for (const org of leafOrgs) {
        try {
          const members = await this.getMembersWithRoles(org.id, false);

          if (members && Array.isArray(members)) {
            // 새가족 필터링 (isNewMember === 'Y')
            const newMembers = members.filter(
              (member) => member.isNewMember === 'Y'
            );

            // 조직 정보 추가
            newMembers.forEach((member) => {
              member.organizationId = org.id;
              member.organizationName = org.name;
            });

            // 새가족 목록에 추가
            this.allNewMembers = [...this.allNewMembers, ...newMembers];
          }
        } catch (error) {
          console.error(`조직 ${org.id}의 새가족 로드 중 오류:`, error);
        }
      }

      // 등록일 기준으로 정렬
      this.allNewMembers.sort((a, b) => {
        if (!a.registrationDate) return 1;
        if (!b.registrationDate) return -1;
        return b.registrationDate.localeCompare(a.registrationDate);
      });
    } catch (error) {
      console.error('레거시 새가족 로드 중 오류 발생:', error);
      this.$store.dispatch('snackbar/showMessage', {
        message: '새가족 정보를 불러오는 중 오류가 발생했습니다.',
        color: 'error',
      });
    }
  },
};
