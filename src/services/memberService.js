/**
 * 멤버 관리 서비스 레이어
 * @description CurrentMemberCtrl mixin의 API 호출을 명확한 서비스 함수로 래핑
 */

import { CurrentMemberCtrl } from '@/mixins/apis_v2/internal/domainCtrl/CurrentMemberCtrl';
import { sortMembers } from '@/utils/memberUtils';

/**
 * CurrentMemberCtrl 인스턴스 생성
 */
const memberService = {
  ...CurrentMemberCtrl,
  data() {
    return {};
  },
  methods: CurrentMemberCtrl.methods,
};

/**
 * 역할 정보가 포함된 멤버 목록 조회 및 정렬
 * @param {number} organizationId - 조직 ID
 * @param {boolean} autoSort - 자동 정렬 여부 (기본: true)
 * @returns {Promise<Array>} 멤버 목록
 * @description
 * 조직의 모든 멤버 정보를 역할과 함께 조회하고,
 * 새가족 > 장기결석자 > 역할 순으로 정렬하여 반환합니다.
 */
export async function fetchMembersWithRoles(organizationId, autoSort = true) {
  try {
    const memberList = await memberService.methods.getMembersWithRoles(
      organizationId,
      true
    );

    if (!memberList || !Array.isArray(memberList)) {
      console.warn('멤버 목록 조회 실패 또는 빈 목록');
      return [];
    }

    // 자동 정렬 옵션이 활성화되어 있으면 정렬
    return autoSort ? sortMembers(memberList) : memberList;
  } catch (error) {
    console.error('멤버 목록 조회 중 오류:', error);
    throw error;
  }
}

/**
 * 멤버 목록에 참여 상태 필드 추가
 * @param {Array} memberList - 멤버 목록
 * @returns {Array} 참여 상태 필드가 추가된 멤버 목록
 * @description
 * 각 멤버에 isParticipating 필드를 추가하여
 * 참가자 선택 UI에서 사용할 수 있도록 합니다.
 */
export function addParticipationField(memberList) {
  if (!Array.isArray(memberList)) return [];

  return memberList.map((member) => ({
    ...member,
    isParticipating: member.isParticipating ?? false,
  }));
}

/**
 * 참여 중인 멤버 수 계산
 * @param {Array} memberList - 멤버 목록
 * @returns {number} 참여 중인 멤버 수
 */
export function getParticipantCount(memberList) {
  if (!Array.isArray(memberList)) return 0;
  return memberList.filter((member) => member.isParticipating === true).length;
}

/**
 * 멤버 통계 계산
 * @param {Array} memberList - 멤버 목록
 * @returns {Object} 멤버 통계
 * @property {number} total - 전체 멤버 수
 * @property {number} newMembers - 새가족 수
 * @property {number} longTermAbsentees - 장기결석자 수
 */
export function calculateMemberStats(memberList) {
  if (!Array.isArray(memberList)) {
    return {
      total: 0,
      newMembers: 0,
      longTermAbsentees: 0,
    };
  }

  return {
    total: memberList.length,
    newMembers: memberList.filter((m) => m.isNewMember === true).length,
    longTermAbsentees: memberList.filter((m) => m.isLongTermAbsentee === true)
      .length,
  };
}
