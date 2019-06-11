const { raw } = String;
const urlRegex = new RegExp(
  raw`^https?:\/\/` + // protocol
  raw`((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|` + // domain name
  raw`((\d{1,3}\.){3}\d{1,3}))` + // OR ip (v4) address
  raw`(\:\d+)?(\/[-a-z\d%_.~+]*)*` + // port and path
  raw`(\?[;&a-z\d%_.~+=-]*)?` + // query string
    raw`(\#[-a-z\d_]*)?$`, // fragment locater
  "i"
);

module.exports = { urlRegex };
