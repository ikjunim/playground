export const hasMouse = function() {
  return matchMedia('(hover: hover)').matches;
}();

export const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const shuffle = (array: any[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const randomInt = (min: number, max: number) => {
  return Math.floor(randomFloat(min, max));
}

export const umod = (n: number, m: number) => {
  const remain = n % m;
  return Math.floor(remain >= 0 ? remain : remain + m);
}

export const isDigit = (char: string) => {
  return /^\d$/.test(char);
}

export const isUpper = (char: string) => {
  return /^[A-Z]$/.test(char);
}

export const isLower = (char: string) => {
  return /^[a-z]$/.test(char);
}

export const allowedGlyph = (char: string) => {
  return /^[a-zA-Z0-9\/+\-]+$/.test(char);
}

export const randomElement = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const textWidth = (text: string, font: string) => {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
}

export const chunk = (array: any[], size: number) => {
  return array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);
}

export const oneRandomArray = (n: number) => {
  let res = [1];
  for(var i = 0; i < n - 1; i++) res.push(Math.random());
  res.sort((a, b) => a - b);
  return res;
}

export const add = (vector1: {x: number, y: number}, vector2: {x: number, y: number}) => {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  }
}

export const distribute = (n: number, weights: number[]) => {
  const res = weights.map(weight => Math.floor(n * weight/100));
  const sum = res.reduce((acc, cur) => acc + cur, 0);
  const diff = n - sum;
  for (let i = 0; i < diff; i++) res[i]++;
  return res;
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16)/255,
    g: parseInt(result[2], 16)/255,
    b: parseInt(result[3], 16)/255
  } : null;
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function interpolateColor(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }, t: number) {
  if (t <= 0) return color1;
  if (t >= 1) return color2;
  return {
    r: color1.r + (color2.r - color1.r) * t,
    g: color1.g + (color2.g - color1.g) * t,
    b: color1.b + (color2.b - color1.b) * t
  }
}

// LZW-compress a string
//@ts-ignore
export function lzw_encode(s) {
  var dict = {};
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  for (var i=1; i<data.length; i++) {
      currChar=data[i];
      //@ts-ignore
      if (dict[phrase + currChar] != null) {
          phrase += currChar;
      }
      else {
          //@ts-ignore
          out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          //@ts-ignore
          dict[phrase + currChar] = code;
          code++;
          phrase=currChar;
      }
  }
  //@ts-ignore
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (var i=0; i<out.length; i++) {
      out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
}

// Decompress an LZW-encoded string
//@ts-ignore
export function lzw_decode(s) {
  var dict = {};
  var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;
  for (var i=1; i<data.length; i++) {
      var currCode = data[i].charCodeAt(0);
      if (currCode < 256) {
          phrase = data[i];
      }
      else {
        //@ts-ignore
         phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
      }
      out.push(phrase);
      currChar = phrase.charAt(0);
      //@ts-ignore
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
  }
  return out.join("");
}

export function nthSubstring(str: string, pat: string, n: number){
  var L= str.length, i= -1;
  while(n-- && i++<L){
      i= str.indexOf(pat, i);
      if (i < 0) break;
  }
  return i;
}

export function furthestCorner(x: number, y: number, width: number, height: number) {
  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height }
  ];

  return corners.reduce((acc, cur) => {
    const dist = Math.sqrt((x - cur.x)**2 + (y - cur.y)**2);
    return Math.max(acc, dist);
  }, 0);
}