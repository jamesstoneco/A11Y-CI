function countViolationNodes(violations) {
  return violations.reduce((accumulator, current) => {
    const { nodes } = current;
    return accumulator + nodes.length;
  }, 0);
}

function getViolationNodesCount(results) {
  return results.reduce((accumulator, current) => {
    const { violations } = current;
    const nodeCount = countViolationNodes(violations, 0);
    return accumulator + nodeCount;
  }, 0);
}

module.exports = getViolationNodesCount;
