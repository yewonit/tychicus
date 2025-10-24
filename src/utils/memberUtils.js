/**
 * 멤버 관련 유틸리티 함수 모음
 */

/**
 * 역할 정보 상수
 */
export const ROLE_INFO = {
  72: { name: '그룹장', color: '#B3C6FF', priority: 1 },
  73: { name: '부순장', color: '#FFF4B3', priority: 2 },
  74: { name: '순원', color: '#C2E0C2', priority: 3 },
};

/**
 * 역할 ID로 역할명 조회
 * @param {number} roleId - 역할 ID
 * @returns {string} 역할명
 */
export function getRoleName(roleId) {
  return ROLE_INFO[roleId]?.name || '회원';
}

/**
 * 역할명으로 색상 조회
 * @param {string} roleName - 역할명
 * @returns {string} 색상 코드
 */
export function getRoleColor(roleName) {
  const colorMap = {
    그룹장: '#B3C6FF',
    부그룹장: '#B3C6FF',
    순장: '#B3C6FF',
    부순장: '#FFF4B3',
    순원: '#C2E0C2',
    회원: '#D6EAD6',
  };
  return colorMap[roleName] || '#E0E0E0';
}

/**
 * 멤버 상태 조회
 * @param {Object} member - 멤버 객체
 * @returns {string} 상태명
 */
export function getMemberStatus(member) {
  if (member.isNewMember === true) return '새가족';
  if (member.isLongTermAbsentee === true) return '장기결석';
  return member.roleName === '회원' ? '순원' : member.roleName || '순원';
}

/**
 * 멤버 상태 색상 조회
 * @param {Object} member - 멤버 객체
 * @returns {string} 색상 코드
 */
export function getMemberStatusColor(member) {
  if (member.isNewMember === true) return '#FFE0B3'; // 새가족
  if (member.isLongTermAbsentee === true) return '#FFCCCC'; // 장기결석자

  const roleColors = {
    그룹장: '#B3C6FF',
    순장: '#D6E0FF',
    부순장: '#FFF4B3',
    순원: '#C2E0C2',
    회원: '#D6EAD6',
  };

  return roleColors[member.roleName] || '#E0E0E0';
}

/**
 * 멤버 목록 정렬
 * @param {Array} members - 멤버 배열
 * @returns {Array} 정렬된 멤버 배열
 */
export function sortMembers(members) {
  if (!members || !Array.isArray(members)) return [];

  return [...members].sort((a, b) => {
    // 역할 우선순위에 따른 정렬
    const roleOrder = {
      그룹장: 1,
      부그룹장: 2,
      순장: 3,
      부순장: 4,
    };

    const roleA =
      roleOrder[a.roleName] !== undefined ? roleOrder[a.roleName] : 10;
    const roleB =
      roleOrder[b.roleName] !== undefined ? roleOrder[b.roleName] : 10;

    // 역할 우선순위가 다르면 그에 따라 정렬
    if (roleA !== roleB) {
      return roleA - roleB;
    }

    // 새가족 우선
    if (a.isNewMember === true && b.isNewMember !== true) return -1;
    if (a.isNewMember !== true && b.isNewMember === true) return 1;

    // 장기결석자 정렬
    if (a.isLongTermAbsentee === true && b.isLongTermAbsentee !== true)
      return -1;
    if (a.isLongTermAbsentee !== true && b.isLongTermAbsentee === true)
      return 1;

    // 이름 알파벳 순 정렬
    return a.name.localeCompare(b.name);
  });
}

/**
 * 멤버 기본 데이터 생성
 * @returns {Object} 기본 멤버 객체
 */
export function createDefaultMember() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayFormatted = `${year}${month}${day}`;

  return {
    userId: null,
    name: '',
    nameSuffix: 'FFF',
    phoneNumber: '00000000000',
    genderType: 'M',
    email: 'email@email.com',
    birthDate: null,
    isNewMember: true,
    isLongTermAbsentee: false,
    isKakaotalkChatMember: false,
    roleId: 74,
    roleName: '순원',
    memberNumber: '',
    registrationDate: todayFormatted,
    countryCode: 'KOR',
    address: '',
    addressDetail: '',
    postcode: '',
    hobby: '',
    city: null,
    stateProvince: null,
    isAddressPublic: false,
    isPhoneNumberPublic: false,
    snsUrl: null,
  };
}
