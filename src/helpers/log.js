function log(title, content) {
  const message = `
${title}${content ? `:\n  ${content}` : ""}
`;
  console.log(message);
}

function logList(title, list, bullet = ">") {
  const formattedList = list.map(listItem => {
    return `${bullet} ${listItem}\n  `;
  });

  const message = `
${title}${list ? `:\n  ${formattedList.join("")}` : ""}
`;
  console.log(message);
}

module.exports = {
  log,
  logList
};
