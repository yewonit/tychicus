/**
 * 인증 관련 메서드
 */

export default {
  // 비밀번호 확인
  checkPassword() {
    this.loading = true;

    setTimeout(() => {
      if (this.password === this.correctPassword) {
        this.isAuthenticated = true;
        this.passwordError = '';

        // 인증 상태를 로컬 스토리지에 저장
        localStorage.setItem('coramdeoAuth', 'true');

        // 인증 성공 후 조직 데이터 로드
        this.$nextTick(() => {
          this.fetchOrganizationsOnly()
            .then(() => {
              this.calculateMemberCounts();
            })
            .catch(() => {
              // 조직 데이터 로드 중 오류
            });
        });
      } else {
        this.passwordError = '비밀번호가 올바르지 않습니다.';
      }
      this.loading = false;
    }, 500);
  },

  // 로그아웃
  logout() {
    // 로컬 스토리지에서 인증 상태 제거
    localStorage.removeItem('coramdeoAuth');

    // 인증 상태 초기화
    this.isAuthenticated = false;
    this.password = '';
    this.passwordError = '';

    // 데이터 초기화
    this.organizations = [];
    this.organizationTree = [];
    this.selectedOrganization = null;
    this.members = [];
  },
};
