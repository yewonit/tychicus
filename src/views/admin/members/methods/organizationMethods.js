/**
 * 조직 관련 메서드
 */

export default {
  // 조직 정보만 불러오기
  async fetchOrganizationsOnly() {
    try {
      // 캐시된 데이터가 있고 만료되지 않았다면 그것을 사용
      const now = new Date().getTime();
      if (
        this.cachedOrganizations &&
        this.organizationCacheExpiry &&
        now < this.organizationCacheExpiry
      ) {
        this.organizations = this.cachedOrganizations;
        this.organizationTree = this.buildOrganizationTree(this.organizations);
        this.calculateMemberCounts();
        this.memberCache = {};
        this.allMembersLoaded = false;
        return;
      }

      const response = await this.getAllOrganizations(true);

      // API 응답 구조 확인 및 데이터 추출
      let organizations = [];
      if (response && response.data && Array.isArray(response.data)) {
        organizations = response.data;
      } else if (Array.isArray(response)) {
        organizations = response;
      }

      // 유효한 조직 데이터가 있는지 확인
      if (!organizations || organizations.length === 0) {
        console.error('유효한 조직 데이터가 없습니다.');
        organizations = [];
      }

      // 각 조직의 멤버 수 초기화
      organizations.forEach((org) => {
        org.memberCount = 0;
      });

      this.organizations = organizations;

      // 조직 데이터 캐싱
      this.cachedOrganizations = JSON.parse(JSON.stringify(organizations));
      this.organizationCacheExpiry =
        new Date().getTime() + this.organizationCacheDuration;

      // 조직 트리 구성
      this.organizationTree = this.buildOrganizationTree(this.organizations);

      // 멤버 수 계산
      this.calculateMemberCounts();

      // 멤버 캐시 초기화
      this.memberCache = {};
      this.allMembersLoaded = false;
    } catch (error) {
      console.error('조직 데이터 로드 중 오류 발생:', error);
      this.organizations = [];
      this.organizationTree = [];
    }
  },

  // 멤버 수 계산 (최적화: 단일 API 호출)
  async calculateMemberCounts() {
    if (!Array.isArray(this.organizations) || this.organizations.length === 0) {
      return;
    }

    try {
      // 1. 모든 조직의 멤버 수를 0으로 초기화
      this.organizations.forEach((org) => {
        org.memberCount = 0;
      });

      // 2. 새 API를 사용하여 모든 조직의 멤버 수를 한 번에 가져옴 (N+1 문제 해결)
      const memberCountsResponse =
        await this.getAllOrganizationsWithMemberCounts();

      // API 응답 검증
      if (memberCountsResponse && memberCountsResponse.error) {
        console.warn(
          '새 API를 사용할 수 없습니다. 기존 방식으로 폴백합니다.',
          memberCountsResponse.error
        );
        // 기존 방식으로 폴백
        await this.calculateMemberCountsLegacy();
        return;
      }

      // 3. 응답 데이터 구조 확인 및 정규화
      let memberCounts = [];
      if (Array.isArray(memberCountsResponse)) {
        memberCounts = memberCountsResponse;
      } else if (
        memberCountsResponse.data &&
        Array.isArray(memberCountsResponse.data)
      ) {
        memberCounts = memberCountsResponse.data;
      }

      // 4. 멤버 수 데이터를 Map으로 변환 (빠른 조회를 위해)
      const memberCountMap = new Map();
      memberCounts.forEach((item) => {
        memberCountMap.set(item.organizationId, item.memberCount || 0);
      });

      // 5. 최하위 조직(리프 노드)에 멤버 수 설정
      this.organizations.forEach((org) => {
        if (memberCountMap.has(org.id)) {
          org.memberCount = memberCountMap.get(org.id);
        }
      });

      // 6. 상위 조직의 멤버 수를 계산 (상향식 접근법)
      const orgLevels = [];
      const processedOrgs = new Set();

      // 리프 노드(최하위 조직) 찾기
      const leafOrgs = this.organizations.filter(
        (org) =>
          !this.organizations.some(
            (other) => other.upper_organization_id === org.id
          )
      );

      // 리프 노드는 이미 처리했으므로 레벨 0으로 설정
      leafOrgs.forEach((org) => {
        processedOrgs.add(org.id);
      });

      // 나머지 조직의 레벨을 결정 (최대 10단계까지 처리)
      for (let level = 1; level <= 10; level++) {
        const currentLevelOrgs = [];

        this.organizations.forEach((org) => {
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
          break;
        }
      }

      // 레벨별로 멤버 수 계산 (낮은 레벨부터)
      orgLevels.forEach((levelOrgs) => {
        levelOrgs.forEach((org) => {
          const childOrgs = this.organizations.filter(
            (child) => child.upper_organization_id === org.id
          );

          let totalMembers = 0;
          childOrgs.forEach((child) => {
            totalMembers += child.memberCount || 0;
          });

          org.memberCount = totalMembers;
        });
      });

      // 7. 트리 다시 구성 (멤버 수 정보 반영)
      this.organizationTree = this.buildOrganizationTree(this.organizations);
    } catch (error) {
      console.error('멤버 수 계산 중 오류 발생:', error);
      // 오류 발생 시 기존 방식으로 폴백
      await this.calculateMemberCountsLegacy();
    }
  },

  // 기존 방식의 멤버 수 계산 (폴백용)
  async calculateMemberCountsLegacy() {
    try {
      // 최하위 조직(리프 노드) 찾기
      const leafOrgs = this.organizations.filter(
        (org) =>
          !this.organizations.some(
            (other) => other.upper_organization_id === org.id
          )
      );

      // 각 최하위 조직의 멤버 수를 API로 가져옴 (기존 방식)
      for (const org of leafOrgs) {
        try {
          const members = await this.getMembersWithRoles(org.id, false);

          if (members && Array.isArray(members)) {
            org.memberCount = members.length;
          } else {
            org.memberCount = 0;
          }
        } catch {
          org.memberCount = 0;
        }
      }

      // 상위 조직의 멤버 수 계산은 calculateMemberCounts()의 6-7단계와 동일하므로 생략
      // (이미 메인 메서드에서 처리됨)
    } catch (error) {
      console.error('레거시 멤버 수 계산 중 오류 발생:', error);
    }
  },

  // 조직 선택
  selectOrganization(organization) {
    this.selectedOrganization = organization;
    this.fetchMembers(organization.id);
  },

  // 조직 다이얼로그 열기
  openOrganizationDialog(organization = null) {
    if (organization) {
      this.editedOrganization = {
        ...organization,
        name: organization.name,
        organization_code: organization.organization_code || '',
        description: organization.description || '',
      };
    } else {
      this.editedOrganization = {
        id: null,
        name: '',
        organization_code: '',
        description: '',
        upper_organization_id: null,
      };
    }
    this.organizationDialog = true;
  },

  // 조직 다이얼로그 닫기
  closeOrganizationDialog() {
    this.organizationDialog = false;
  },

  // 조직 저장
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
        name: this.editedOrganization.name,
        organization_code: this.editedOrganization.organization_code,
        description: this.editedOrganization.description,
      };

      let response;
      if (this.editedOrganization.id) {
        // 조직 수정
        try {
          response = await this.updateOrganization(
            this.editedOrganization.id,
            organizationData,
            true
          );

          if (response && response.error) {
            console.error('조직 수정 API 오류:', response.error);
            throw new Error(response.error);
          }

          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `조직 "${organizationData.name}"이(가) 수정되었습니다.`,
              color: 'success',
            });
          });
        } catch (error) {
          console.error('조직 수정 중 API 오류 발생:', error);

          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `조직 수정 중 오류가 발생했습니다: ${error.message}`,
              color: 'error',
            });
          });
        }
      } else {
        // 조직 추가
        try {
          response = await this.createOrganization(organizationData, true);

          if (response && response.error) {
            console.error('조직 추가 API 오류:', response.error);
            throw new Error(response.error);
          }

          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `조직 "${organizationData.name}"이(가) 추가되었습니다.`,
              color: 'success',
            });
          });
        } catch (error) {
          console.error('조직 추가 중 API 오류 발생:', error);

          this.$nextTick(() => {
            this.$store.dispatch('snackbar/showMessage', {
              message: `조직 추가 중 오류가 발생했습니다: ${error.message}`,
              color: 'error',
            });
          });
        }
      }

      this.closeOrganizationDialog();

      // 조직 정보를 다시 불러오고 멤버 수 계산
      await this.fetchOrganizationsOnly();

      // 조직 정보가 업데이트된 후 멤버 수 다시 계산
      this.$nextTick(() => {
        this.calculateMemberCounts();
      });
    } catch (_) {
      alert('조직 저장 중 오류가 발생했습니다. 관리자에게 문의하세요.');
    }
  },

  // 조직 삭제 확인
  confirmDeleteOrganization(organization) {
    this.deleteType = 'organization';
    this.deleteItem = organization;
    this.deleteDialogText = `조직 "${organization.name}"을(를) 삭제하시겠습니까? 이 조직에 속한 모든 멤버 정보도 함께 삭제됩니다.`;
    this.deleteDialog = true;
  },

  // 조직 트리 구성
  buildOrganizationTree(organizations) {
    if (
      !organizations ||
      !Array.isArray(organizations) ||
      organizations.length === 0
    ) {
      return [];
    }

    const tree = [];
    const organizationMap = new Map();

    // 조직 객체를 맵에 저장
    for (const org of organizations) {
      try {
        if (!org || !org.id) {
          continue;
        }

        const mappedOrg = {
          ...org,
          name: org.name,
          organization_code: org.organization_code || '',
          description: org.description || '',
          children: [],
          isLeafNode: true,
        };
        organizationMap.set(org.id, mappedOrg);
      } catch {
        // 조직 데이터 매핑 중 오류 발생
      }
    }

    // 조직 객체를 트리 구조로 변환
    for (const org of organizations) {
      try {
        if (!org || !org.id) continue;

        if (!org.upper_organization_id) {
          // 최상위 조직
          tree.push(organizationMap.get(org.id));
        } else {
          // 하위 조직
          const parent = organizationMap.get(org.upper_organization_id);
          if (parent) {
            parent.isLeafNode = false;
            parent.children.push(organizationMap.get(org.id));
          } else {
            tree.push(organizationMap.get(org.id));
          }
        }
      } catch {
        // 조직 트리 구성 중 오류 발생
      }
    }

    // 트리가 비어있으면 모든 조직을 최상위로 처리
    if (tree.length === 0) {
      for (const [, org] of organizationMap.entries()) {
        tree.push(org);
      }
    }

    return tree;
  },

  // 조직 선택 처리
  handleOrganizationSelect(active) {
    try {
      if (active && active.length > 0) {
        const selectedOrg = active[0];
        this.selectedOrganization = selectedOrg;

        // 최하위 조직인 경우에만 멤버 목록 조회
        if (selectedOrg && selectedOrg.id) {
          if (selectedOrg.isLeafNode) {
            this.fetchMembers(selectedOrg.id);
          } else {
            this.members = [];
            this.loadingMembers = false;
          }
        } else {
          this.members = [];
          this.loadingMembers = false;
        }
      } else {
        this.selectedOrganization = null;
        this.members = [];
        this.loadingMembers = false;
      }
    } catch (error) {
      console.error('조직 선택 처리 중 오류 발생:', error);
      if (!this.selectedOrganization) {
        this.members = [];
      }
      this.loadingMembers = false;
    }
  },

  // 첫 번째 최하위 조직 선택
  selectFirstLeafNode(tree) {
    if (!tree || !Array.isArray(tree) || tree.length === 0) {
      return;
    }

    // 깊이 우선 탐색으로 최하위 조직 찾기
    const findFirstLeafNode = (nodes) => {
      for (const node of nodes) {
        if (node.isLeafNode) {
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
      this.selectedOrganization = leafNode;
      this.fetchMembers(leafNode.id);
    } else {
      // 최하위 조직이 없으면 첫 번째 조직 선택
      this.selectedOrganization = tree[0];
      this.members = [];
    }
  },
};
