const convertToHalfsize = (chars) => {
  let ascii = "";
  for (let i = 0, l = chars.length; i < l; i++) {
    let c = chars[i].charCodeAt(0);
    // fix dot fullsize
    if (c === 12290) {
      c = 46;
    }
    if (c >= 0xff00 && c <= 0xffef) {
      c = 0xff & (c + 0x20);
    }

    ascii += String.fromCharCode(c);
  }

  return formatNumber(ascii);
};
const formatNumber = (n) => {
  return n !== null ? n.toString().replace(/[,]+/g, "") : n;
};

export { formatNumber, convertToHalfsize };
