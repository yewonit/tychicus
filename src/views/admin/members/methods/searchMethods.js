/**
 * 검색 관련 메서드
 */

export default {
  // 검색 디바운싱
  debounceSearch() {
    clearTimeout(this.searchDebounceTimeout);
    this.searchDebounceTimeout = setTimeout(() => {
      this.searchItems();
    }, 300);
  },

  // 검색 결과 숨기기 (지연)
  hideSearchResultsDelayed() {
    clearTimeout(this.searchResultsTimeout);
    this.searchResultsTimeout = setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  },

  // 검색 실행
  searchItems() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    const results = [];

    // 검색 타입에 따라 다른 검색 로직 적용
    if (this.searchType === 'all' || this.searchType === 'organization') {
      this.searchOrganizations(query, results);
    }

    if (this.searchType === 'all' || this.searchType === 'member') {
      this.searchMembers(query, results);
    }

    this.searchResults = results;
    this.showSearchResults = results.length > 0;
  },

  // 조직 검색
  searchOrganizations(query, results) {
    const searchInOrganizations = (orgs) => {
      orgs.forEach((org) => {
        if (org.name.toLowerCase().includes(query)) {
          // 최하위 조직(isLeafNode가 true)인 경우에만 결과에 추가
          if (org.isLeafNode) {
            results.push({
              type: 'organization',
              id: org.id,
              name: org.name,
              organization_code: org.organization_code,
              memberCount: org.memberCount,
              isLeafNode: org.isLeafNode,
              path: this.getOrganizationPath(org.id),
            });
          }
        }

        if (org.children && org.children.length > 0) {
          searchInOrganizations(org.children);
        }
      });
    };

    searchInOrganizations(this.organizationTree);
  },

  // 멤버 검색
  searchMembers(query, results) {
    // 아직 모든 멤버가 로드되지 않았다면 로드
    if (!this.allMembersLoaded) {
      this.loadAllMembers();
    }

    // 모든 멤버 검색
    const allMembers = this.getAllCachedMembers();

    allMembers.forEach((member) => {
      if (
        (member.name && member.name.toLowerCase().includes(query)) ||
        (member.phoneNumber && member.phoneNumber.includes(query)) ||
        (member.email &&
          member.email &&
          member.email.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'member',
          userId: member.userId,
          name: member.name,
          phoneNumber: member.phoneNumber,
          organizationId: member.organizationId,
          organizationName: member.organizationName,
        });
      }
    });
  },

  // 모든 캐시된 멤버 조회
  getAllCachedMembers() {
    let allMembers = [];

    // 현재 선택된 조직의 멤버 추가
    if (this.selectedOrganization && this.members.length > 0) {
      allMembers = this.members.map((member) => ({
        ...member,
        organizationId: this.selectedOrganization.id,
        organizationName: this.selectedOrganization.name,
      }));
    }

    // 캐시된 다른 조직의 멤버들 추가
    Object.entries(this.memberCache).forEach(([orgId, data]) => {
      // 현재 선택된 조직의 멤버는 이미 추가됨
      if (
        this.selectedOrganization &&
        this.selectedOrganization.id === Number(orgId)
      ) {
        return;
      }

      if (data.members && Array.isArray(data.members)) {
        const membersWithOrg = data.members.map((member) => ({
          ...member,
          organizationId: Number(orgId),
          organizationName: data.name,
        }));
        allMembers = allMembers.concat(membersWithOrg);
      }
    });

    return allMembers;
  },

  // 조직 경로 조회
  getOrganizationPath(orgId) {
    const findPath = (orgs, targetId, currentPath = []) => {
      for (const org of orgs) {
        const newPath = [...currentPath, org.id];
        if (org.id === targetId) {
          return newPath;
        }

        if (org.children && org.children.length > 0) {
          const found = findPath(org.children, targetId, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(this.organizationTree, orgId) || [];
  },

  // 검색된 조직 선택
  selectSearchedOrganization(org) {
    this.showSearchResults = false;
    this.highlightedMemberId = null;

    // 해당 조직의 경로 펼치기
    if (org.path && org.path.length > 0) {
      this.expandedOrganizationIds = org.path;

      // OrganizationTree 컴포넌트에 확장 정보 전달
      this.$nextTick(() => {
        // 선택된 조직으로 이동 및 멤버 로드
        if (org.isLeafNode) {
          this.selectOrganization(org);
        }
      });
    }
  },

  // 검색된 멤버 선택
  selectSearchedMember(member) {
    this.showSearchResults = false;
    this.highlightedMemberId = member.userId;

    // 해당 멤버의 조직으로 이동
    if (member.organizationId) {
      const org = this.findOrganizationById(member.organizationId);
      if (org) {
        this.selectSearchedOrganization(org);

        // 멤버 목록에서 해당 멤버 하이라이트
        this.$nextTick(() => {
          // 멤버 하이라이트 로직
        });
      }
    }
  },

  // ID로 조직 찾기
  findOrganizationById(orgId) {
    const findOrg = (orgs) => {
      for (const org of orgs) {
        if (org.id === orgId) {
          return {
            type: 'organization',
            id: org.id,
            name: org.name,
            organization_code: org.organization_code,
            memberCount: org.memberCount,
            isLeafNode: org.isLeafNode,
            path: this.getOrganizationPath(org.id),
          };
        }

        if (org.children && org.children.length > 0) {
          const found = findOrg(org.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findOrg(this.organizationTree);
  },
};
