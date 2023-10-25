const convertToHalfsize = (chars) => {
  let ascii = "";
  for (let i = 0, l = chars.length; i < l; i++) {
    let c = chars[i].charCodeAt(0);
    // => get key of utf-16
    if (c === 12290) {
      c = 46;
    }
    if (c >= 0xff00 && c <= 0xffef) {
      c = 0xff & (c + 0x20);
    }
    // => check c
    // console.log(String.fromCharCode(12290));
    // > "。"
    ascii += String.fromCharCode(c);
  }

  return formatNumber(ascii);
};

const formatNumber = (n) => {
  return n !== null ? Number(n.toString().replace(/[,]+/g, "")) : Number(n);
};

// data in number ( < 9e+16)
const validNegativeNumber = (number, integer = 16) => {
  let regex = `^-?[0-9]{0,${integer}}$`;

  let reg = new RegExp(regex);
  return reg.test(number);
};

export { formatNumber, convertToHalfsize, validNegativeNumber };
