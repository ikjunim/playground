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

export const cumulativeLength = (array: string[]) => {
  const res: number[] = [0];
  let sum = 0;
  array.forEach(item => {
    sum += item.length;
    res.push(sum);
  });
  return res;
}

export const umod = (n: number, m: number) => {
  var remain = n % m;
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

export const hasMouseSupport = () => {
  return matchMedia('(hover: hover)').matches;
}

export const scrollToTop = () => {
  window.scrollTo(0, 0);
}

export const simulateText = (text: string, font: string) => {
  const container = document.createElement('div');

  container.style.position = 'absolute';
  container.style.opacity = '0';
  container.style.fontFamily = font;
  container.style.whiteSpace = 'nowrap';
  container.style.pointerEvents = 'none';

  text.split('').forEach(char => { 
    const span = document.createElement('span');
    span.innerHTML = char === ' ' ? '\u00A0' : char;
    container.appendChild(span);
  });

  document.body.appendChild(container);

  const result: any[] = [];

  container.querySelectorAll('span').forEach(span => {
    result.push(span.getBoundingClientRect());
  });

  document.body.removeChild(container);

  return result;
}

export const normalizeArray = (array: number[]) => {
  const max = Math.max(...array);
  return array.map(value => value / max);
}

export const sampleCoordinates = (text: string, font: string, size: number): { x: number, y: number}[] => {
  const container = document.createElement('canvas');
  const context = container.getContext('2d');
  if (!context) return [];

  document.body.appendChild(container);

  const lines = text.split('\n');
  const linesMaxLength = [...lines].sort((a, b) => b.length - a.length)[0].length;
  const wTexture = size * .7 * linesMaxLength;
  const hTexture = lines.length * size;

  const linesNumber = lines.length;
  container.width = wTexture;
  container.height = hTexture;
  context.font = '100 ' + size + 'px ' + font;
  context.fillStyle = '#2a9d8f';
  context.clearRect(0, 0, container.width, container.height);
  for (let i = 0; i < linesNumber; i++) {
    context.fillText(lines[i], 0, (i + .8) * hTexture / linesNumber);
  }

  let textureCoordinates = [];
    const samplingStep = 4;
    if (wTexture > 0) {
        const imageData = context.getImageData(0, 0, container.width, container.height);
        for (let i = 0; i < container.height; i += samplingStep) {
            for (let j = 0; j < container.width; j += samplingStep) {
                if (imageData.data[(j + i * container.width) * 4] > 0) {
                    textureCoordinates.push({
                        x: j,
                        y: i
                    })
                }
            }
        }
    }

  document.body.removeChild(container);

  return textureCoordinates;
}

export const boundingBox = (points: { x: number, y: number }[]) => {
  const x = points.map(point => point.x);
  const y = points.map(point => point.y);
  return {
    min: { x: Math.min(...x), y: Math.min(...y) },
    max: { x: Math.max(...x), y: Math.max(...y) }
  }
}

export const chunk = (array: any[], size: number) => {
  return array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);
}

export const oneRandomArray = (n: number) => {
  let res = [1];

  for(var i = 0; i < n - 1; i++) {
    res.push(Math.random());
  }

  res.sort((a, b) => a - b);

  return res;
}

export const mag2D = ({ x, y }: {x: number, y: number}) => Math.sqrt(x*x+y*y);

export const mag3D = ({ x, y, z }: {x: number, y: number, z: number}) => Math.sqrt(x*x+y*y+z*z);

export const add = (vector1: {x: number, y: number}, vector2: {x: number, y: number}) => {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  }
}

export const add3 = (vector1: {x: number, y: number, z: number}, vector2: {x: number, y: number, z: number}) => {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y,
    z: vector2.z + vector2.z
  }
}

export const normalizeVector = ({ x, y, z }: {x: number, y: number, z: number}) => {
  const mag = Math.sqrt(x*x + y*y + z*z);
  return {x: x/mag, y: y/mag, z: z/mag};
}

export const scaleVector = ({ x, y }: {x: number, y: number}, scale: number) => {
  return {x: x*scale, y: y*scale};
}

export const scaleVector3 = ({ x, y, z}: {x: number, y: number, z: number}, scale: number) => {
  return {x: x*scale, y: y*scale, z: z*scale};
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

export function rotateVector({ x, y }: {x: number, y: number}, angle: number): { x: number, y: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
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
  const res = { x: 0, y: 0 };
  var maxDist = -Infinity;

  const topleft = { x: 0, y: 0 };
  const topright = { x: width, y: 0 };
  const bottomleft = { x: 0, y: height };
  const bottomright = { x: width, y: height };

  const corners = [topleft, topright, bottomleft, bottomright];

  corners.forEach(corner => {
    const dist = (x - corner.x) * (x - corner.x) + (y - corner.y) * (y - corner.y);
    if (dist > maxDist) {
      res.x = corner.x;
      res.y = corner.y;
      maxDist = dist;
    }
  })

  return {
    ...res,
    dist: Math.sqrt(maxDist)
  }
}