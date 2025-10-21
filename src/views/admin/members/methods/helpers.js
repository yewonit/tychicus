/**
 * 공통 헬퍼 함수
 */

/**
 * 최하위 조직 찾기
 * @param {Array} orgs - 조직 배열
 * @returns {Array} 최하위 조직 배열
 */
export function findLeafOrganizations(orgs) {
  let leaves = [];
  orgs.forEach((org) => {
    if (!org.children || org.children.length === 0 || org.isLeafNode) {
      leaves.push(org);
    } else if (org.children && org.children.length > 0) {
      leaves = leaves.concat(findLeafOrganizations(org.children));
    }
  });
  return leaves;
}

/**
 * 조직 트리에서 깊이 우선 탐색으로 최하위 노드 찾기
 * @param {Array} nodes - 노드 배열
 * @returns {Object|null} 첫 번째 최하위 노드
 */
export function findFirstLeafNode(nodes) {
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
}
