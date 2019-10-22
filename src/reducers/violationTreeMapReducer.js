function violationTreeMapReducer(violations, url, init = {}) {
  return violations.reduce((accumulator, current) => {
    const { nodes, id } = current;
    nodes.forEach(node => {
      const { impact } = node;
      if (!accumulator[url]) accumulator[url] = {};
      if (!accumulator[url][id]) accumulator[url][id] = {};
      if (!accumulator[url][id][impact]) accumulator[url][id][impact] = [];
      accumulator[url][id][impact].push(node);
    });
    return accumulator;
  }, init);
}

module.exports = { violationTreeMapReducer };
