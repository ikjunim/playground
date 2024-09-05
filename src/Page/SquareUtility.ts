import { shuffle } from "../Utility";

export const squareCount = 16;
export const maxSquareIndex = squareCount * squareCount;
const squareLength = { current: 10000 };

export const setLength = (length: number) => {
  squareLength.current = length;
}

export const indexOf = (x: number, y: number) => {
  return Math.floor(y / squareLength.current) * squareCount + Math.floor(x / squareLength.current);
}

export const getVisible = (squares: HTMLDivElement[], originalIndex: number, callback?: (d: HTMLDivElement, i: number) => void) => {
  const visibleRows = Math.min(Math.ceil(window.innerHeight / squareLength.current), squareCount);
  const visibleCols = Math.min(Math.ceil(window.innerWidth / squareLength.current), squareCount);

  const visible = squares.filter((_, i) => {
    const res = rowOf(i) < visibleRows && colOf(i) < visibleCols;
    if (!res && callback) callback(squares[i], i);
    return res;
  });

  for(let i = 0; i < visible.length; i++) {
    if (visible[i].id === squares[originalIndex].id) {
      return {
        visible,
        visibleIndex: i,
        visibleRows,
        visibleCols,
      }
    }
  }

  return {
    visible: [],
    visibleIndex: -1,
    visibleRows,
    visibleCols,
  };
}

export const rowOf = (index: number, cols?: number) => {
  return Math.floor(index / (cols ? cols : squareCount));
}

export const colOf = (index: number, cols?: number) => {
  return index % (cols ? cols : squareCount);
}

export const ringOf = (center: number, index: number, cols?: number) => {
  return Math.max(Math.abs(rowOf(center, cols) - rowOf(index, cols)), Math.abs(colOf(center, cols) - colOf(index, cols)));
}

export const cardinal1 = (index: number) => {
  const res: number[] = [index];
  const row = rowOf(index);

  if (index + squareCount < maxSquareIndex) res.push(index + squareCount);
  if (rowOf(index + 1) === row) res.push(index + 1);
  if (index - squareCount >= 0) res.push(index - squareCount);
  if (rowOf(index - 1) === row) res.push(index - 1);

  return res;
}

export const ring1 = (index: number) => {
  const res: number[] = [];
  const row = rowOf(index);

  if (index - squareCount - 1 >= 0 && rowOf(index - squareCount - 1) === row - 1) res.push(index - squareCount - 1);
  if (index - squareCount >= 0) res.push(index - squareCount);
  if (index - squareCount + 1 >= 0 && rowOf(index - squareCount + 1) === row - 1) res.push(index - squareCount + 1);
  if (index + 1 < maxSquareIndex && rowOf(index + 1) === row) res.push(index + 1);
  if (index + squareCount + 1 < maxSquareIndex && rowOf(index + squareCount + 1) === row + 1) res.push(index + squareCount + 1);
  if (index + squareCount < maxSquareIndex) res.push(index + squareCount);
  if (index + squareCount - 1 < maxSquareIndex && rowOf(index + squareCount - 1) === row + 1) res.push(index + squareCount - 1);
  if (index - 1 >= 0 && rowOf(index - 1) === row) res.push(index - 1);

  return res;
}

export const ring2 = (index: number) => {
  const res: number[] = [];
  const row = rowOf(index);

  if (index - squareCount * 2 - 2 >= 0 && rowOf(index - squareCount * 2 - 2) === row - 2) res.push(index - squareCount * 2 - 2);
  if (index - squareCount * 2 - 1 >= 0 && rowOf(index - squareCount * 2 - 1) === row - 2) res.push(index - squareCount * 2 - 1);
  if (index - squareCount * 2 >= 0) res.push(index - squareCount * 2);
  if (index - squareCount * 2 + 1 >= 0 && rowOf(index - squareCount * 2 + 1) === row - 2) res.push(index - squareCount * 2 + 1);
  if (index - squareCount * 2 + 2 >= 0 && rowOf(index - squareCount * 2 + 2) === row - 2) res.push(index - squareCount * 2 + 2);
  if (index - squareCount + 2 >= 0 && rowOf(index - squareCount + 2) === row - 1) res.push(index - squareCount + 2);
  if (index + 2 < maxSquareIndex && rowOf(index + 2) === row) res.push(index + 2);
  if (index + squareCount + 2 < maxSquareIndex && rowOf(index + squareCount + 2) === row + 1) res.push(index + squareCount + 2);
  if (index + squareCount * 2 + 2 < maxSquareIndex && rowOf(index + squareCount * 2 + 2) === row + 2) res.push(index + squareCount * 2 + 2);
  if (index + squareCount * 2 + 1 < maxSquareIndex && rowOf(index + squareCount * 2 + 1) === row + 2) res.push(index + squareCount * 2 + 1);
  if (index + squareCount * 2 < maxSquareIndex) res.push(index + squareCount * 2);
  if (index + squareCount * 2 - 1 < maxSquareIndex && rowOf(index + squareCount * 2 - 1) === row + 2) res.push(index + squareCount * 2 - 1);
  if (index + squareCount * 2 - 2 < maxSquareIndex && rowOf(index + squareCount * 2 - 2) === row + 2) res.push(index + squareCount * 2 - 2);
  if (index + squareCount - 2 < maxSquareIndex && rowOf(index + squareCount - 2) === row + 1) res.push(index + squareCount - 2);
  if (index - 2 >= 0 && rowOf(index - 2) === row) res.push(index - 2);
  if (index - squareCount - 2 >= 0 && rowOf(index - squareCount - 2) === row - 1) res.push(index - squareCount - 2);

  return res;
}

export const pick2 = (index: number, count: number) => {
  const res: number[] = [];
  const ring2Indexes = ring2(index);
  shuffle(ring2Indexes);
  for(let i = 0; i < count; i++) {
    res.push(ring2Indexes[i]);
  }
  return res;
}

export const block1 = (index: number) => {
  const res: number[] = [index];
  res.push(...ring1(index));
  return res;
}

export const block2 = (index: number) => {
  const indexes: number[] = [index];
  indexes.push(...ring1(index));
  indexes.push(...ring2(index));
  return indexes;
}

export const topdown = (index: number, rows?: number, cols?: number) => {
  const res: number[] = [];
  rows = rows ? rows : squareCount;
  cols = cols ? cols : squareCount;
  var start = colOf(index, cols);

  while (start < index) {
    res.push(start);
    start += cols;
  }

  return res;
}

export const leftright = (index: number, rows?: number, cols?: number) => {
  const res: number[] = [];
  rows = rows ? rows : squareCount;
  cols = cols ? cols : squareCount;
  var start = rowOf(index, cols) * cols;

  while (start < index) {
    res.push(start);
    start++;
  }

  return res;
}

export const rightleft = (index: number, rows?: number, cols?: number) => {
  const res: number[] = [];
  rows = rows ? rows : squareCount;
  cols = cols ? cols : squareCount;
  var start = rowOf(index, cols) * cols + cols - 1;

  while (start > index) {
    res.push(start);
    start--;
  }

  return res;
}

export const bottomup = (index: number, rows?: number, cols?: number) => {
  const res: number[] = [];
  rows = rows ? rows : squareCount;
  cols = cols ? cols : squareCount;
  var start = colOf(index, cols) + cols * (rows - 1);

  while (start > index) {
    res.push(start);
    start -= cols;
  }

  return res;
}
