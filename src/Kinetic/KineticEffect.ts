import MatterColor from "../Constants/MatterColor";
import MatterTone from "../Constants/MatterTone";
import { randomInt, shuffle } from "../Utility";
import { duration, word, rows } from "./KineticUtility";
import { Animation, Timer, animate, createTimer, utils } from "@juliangarnierorg/anime-beta";

const EMPTY = 'rgba(255, 255, 255, 0)';
const cols = word.length;
const gap = 25;
const colIndexes = Array.from({ length: cols }, (_, i) => i);

export const moveLeft = (target: HTMLDivElement | null, val: string) => {
  if (!target) return;
  if (utils.get(target, 'left') === val) return;
  return animate(target, {
    left: val,
    duration: duration/2
  })
}

export const moveY = (targets: (HTMLDivElement | HTMLSpanElement)[], distance: number[]) => {
  return animate(targets, {
    translateY: (_, i: number | undefined) => {
      if (i === undefined) return 0;
      return distance[i] + 'lvh';
    },
    duration: duration/2, 
  })
}

export const colorFill = (targets: (HTMLDivElement | HTMLSpanElement)[], color?: string) => {
  return animate(targets, {
    color: color ? color : EMPTY,
    duration,
  })
}

var colorStroked = false;
export const colorStroke = (targets: (HTMLDivElement | HTMLSpanElement)[]) => {
  if (colorStroked) return;
  colorStroked = true;
  targets.forEach(el => {
    el.style.webkitTextStrokeColor = MatterColor.Random();
  });
}

export const whiteStroke = (targets: (HTMLDivElement | HTMLSpanElement)[]) => {
  if (!colorStroked) return;
  colorStroked = false;
  targets.forEach(el => {
    el.style.webkitTextStrokeColor = MatterTone.White;
  });
}

var isBouncing = false;
const bounces: Animation[] = [];
const charByCol: HTMLSpanElement[][] = [];
export const charBounce = (targets: HTMLSpanElement[], initialDrop: number, bounce: number, onComplete: () => void) => {
  if (isBouncing) return;
  isBouncing = true;
  if (charByCol.length === 0) {
    for(let i = 0; i < cols; i++) {
      const arr = [];
      for(let j = i; j < targets.length; j += cols) arr.push(targets[j]);
      charByCol.push(arr);
    }
  }
  var count = cols;
  charByCol.forEach((charCol, i) => {
    animate(charCol, {
      translateY: '+=' + initialDrop + 'lvh',
      duration: duration/2,
      delay: i*100,
      ease: 'inOutQuad',
      onComplete: () => {
        if (--count === 0) {
          setTimeout(() => {
            onComplete();
          }, 200);
        }
        charCol.forEach((el, i) => {
          setTimeout(() => {
            bounces.push(animate(el, {
              translateY: '-=' + bounce + 'lvh',
              duration: duration,
              loop: true,
              alternate: true,
            }))
          }, i*50)
        })
      }
    });
  })
}

export const stopBounce = () => {
  if (!isBouncing) return;
  isBouncing = false;
  bounces.forEach(b => {
    b.pause();
  });
  bounces.length = 0;
  charByCol.forEach(charCol => {
    animate(charCol, {
      translateY: 0,
      duration: duration/2,
    })
  })
}

const shiftStrokeDown = (targets: (HTMLDivElement | HTMLSpanElement)[], col: number, wrap=true) => {
  var prev = targets[col].style.webkitTextStrokeColor;
  for(var i = 1; i < rows; i++) {
    var temp = targets[col + i*cols].style.webkitTextStrokeColor;
    targets[col + i*cols].style.webkitTextStrokeColor = prev;
    prev = temp;
  }
  if (wrap) targets[col].style.webkitTextStrokeColor = prev;
}

var lastVerticalAnimation: Animation | null = null;
const shiftDown = (targets: (HTMLDivElement | HTMLSpanElement)[], col: number) => {
  if (flashing && lastSpawned[col] > 1 && Math.random() < lastSpawned[col]/10) {
    lastSpawned[col] = 0;
    flashes[col].add(new Flash(col));
  }
  for(let i = 0; i < rows; i++) {
    lastVerticalAnimation = animate(targets[col + i*cols], {
      translateY: { from: 0, to: gap + 'lvh' },
      duration: duration/2,
      onComplete: () => {
        if (i === rows - 1) {
          isShifting[col] = false;
          hasShifted[col] = true;
        }
      }
    })
  }
}

export const resetShiftAll = (targets: (HTMLDivElement | HTMLSpanElement)[], onComplete?: () => void) => {
  setTimeout(() => {
    for(let i = 0; i < cols; i++) {
      if (!hasShifted[i]) continue;
      shiftStrokeDown(targets, i);
      flashes[i].forEach(f => f.moveDown());
      for(let j = 0; j < rows; j++) {
        utils.set(targets[i + j*cols], { translateY: 0 });
      }
      hasShifted[i] = false;
    }
    if (onComplete) onComplete();
  }, lastVerticalAnimation ? (lastVerticalAnimation.completed ? 0 : lastVerticalAnimation.duration - lastVerticalAnimation.currentTime + 50) : 0);
}

var verticallyMoving = false;
var verticalTimer : Timer | null = null;
const isShifting = Array.from({ length: cols }, () => false);
const hasShifted = Array.from({ length: cols }, () => false);
export const startVertical = (targets: (HTMLDivElement | HTMLSpanElement)[]) => {
  if (verticallyMoving) return;
  verticallyMoving = true;
  verticalTimer = createTimer({
    duration,
    loop: true,
    onLoop: () => {
      shuffle(colIndexes);
      var repeat = randomInt(1, cols/2);
      for(var i = 0; i < repeat; i++) {
        if (hasShifted[colIndexes[i]]) {
          shiftStrokeDown(targets, colIndexes[i]);
          lastSpawned[colIndexes[i]]++;
          flashes[colIndexes[i]].forEach(f => {
            if (!f.moveDown()) {
              flashes[colIndexes[i]].delete(f);
            }
          });
        }

        shiftDown(targets, colIndexes[i]);
        isShifting[colIndexes[i]] = true;
      }
    }
  })
}

export const resetVertical = (targets: (HTMLDivElement | HTMLSpanElement)[]) => {
  targets.forEach(el => {
    utils.set(el, { translateY: 0 });
  })
  hasShifted.fill(false);
}

export const stopVertical = () => {
  if (!verticallyMoving) return;
  verticallyMoving = false;
  if (verticalTimer) {
    verticalTimer.pause();
    verticalTimer = null;
  }
}

var flashing = false;

class Flash {
  static targets: (HTMLDivElement | HTMLSpanElement)[];
  row: number;
  col: number;
  current: HTMLDivElement | HTMLSpanElement;

  //This must only be spawned if the column has NOT SHIFTED
  constructor(col: number) {
    this.row = 0;
    this.col = col;
    this.current = Flash.targets[col + this.row*cols];
    this.current.style.color = this.current.style.webkitTextStrokeColor;
  }

  moveDown() {
    this.current.style.color = EMPTY;
    this.row++;
    if (this.row >= rows) return false;

    if (!hasShifted[this.col]) {
      this.current = Flash.targets[this.col + (this.row - 1)*cols];
    } else {
      this.current = Flash.targets[this.col + this.row*cols];
    }
    this.current.style.color = this.current.style.webkitTextStrokeColor;

    return true;
  }

  moveRight() {
    this.current.style.color = EMPTY;
    this.col = (this.col + 1) % cols;

    if (!hasShifted[this.col]) {
      this.current = Flash.targets[this.col + (this.row - 1)*cols];
    } else {
      this.current = Flash.targets[this.col + this.row*cols];
    }
    this.current.style.color = this.current.style.webkitTextStrokeColor;

    return true;
  }
}

const flashes: { [col: number]: Set<Flash> } = {};
Array.from({ length: cols }, (_, i) => {flashes[i] = new Set(); });
const lastSpawned = Array.from({ length: cols }, () => Infinity);

export const startFlashing = (targets: (HTMLDivElement | HTMLSpanElement)[]) => {
  if (flashing) return;
  flashing = true;
  Flash.targets = targets;
  lastSpawned.fill(Infinity);
}

export const stopFlashing = () => {
  if (!flashing) return;
  flashing = false;
  Object.entries(flashes).forEach(([_, set]) => {
    set.clear();
  });
}

var ringAnimation: Animation | null = null;
export const pivotRing = (targets: HTMLDivElement[], onComplete: () => void) => {
  animate(targets, {
    rotateY: (_, i: number | undefined) => {
      if (i === undefined) return 0;
      return (i%cols)*360/cols;
    },
    duration: duration/2,
    onComplete: () => {
      onComplete();
      ringAnimation = animate(targets, {
        rotateY: '+=360',
        duration: duration*10,
        loop: true,
        ease: 'linear'
      })
    }
  })
}

const charRing: string[] = [];
export const charFaceCenter = (targets: HTMLSpanElement[]) => {
  if (charRing.length === 0) {
    targets.forEach(el => {
      charRing.push(utils.get(el, 'translateX'));
    });
  }
  animate(targets, {
    translateX: 0,
    translateZ: '3em',
    duration: duration/2,
  })
}

export const pivotLinear = (targets: HTMLDivElement[]) => {
  if (ringAnimation) {
    ringAnimation.pause();
    ringAnimation = null;
  }
  return animate(targets, {
    rotateY: 0,
    duration: duration/2,
    ease: 'linear',
  })
}

export const charFaceLinear = (targets: HTMLSpanElement[]) => {
  if (charRing.length === 0) return;
  animate(targets, {
    translateX: (_, i: number | undefined) => {
      if (i === undefined) return 0;
      return charRing[i];
    },
    translateZ: 0,
    duration: duration/2,
    ease: 'linear',
  })
}

var spinAnimation: any = null;
export const spin = (targets: HTMLDivElement[]) => {
  spinAnimation = animate(targets, {
    rotateY: '+=360',
    duration: duration*5,
    loop: true,
    ease: 'linear'
  })
}

export const stopSpin = (targets: HTMLDivElement[]) => {
  if (spinAnimation === null) return;
  spinAnimation.pause();
  animate(targets, {
    rotateY: 0,
    duration: duration,
    ease: 'linear'
  })
  spinAnimation = null;
}

var sphereAnimation: any = null;
export const startSphere = (targets: HTMLDivElement[]) => {
  return animate(targets, {
    rotateZ: (_, i: number | undefined) => {
      if (i === undefined) return 0;
      return i/targets.length*180;
    },
    duration: duration/2,
    onComplete: () => {
      sphereAnimation = animate(targets, {
        rotateX: 360,
        rotateY: 360,
        duration: 10000,
        ease: 'linear',
        loop: true,
      })
    }
  })
}

export const stopSphere = (targets: HTMLDivElement[]) => {
  if (sphereAnimation === null) return;
  sphereAnimation.pause();
  animate(targets, {
    rotateX: 0,
    rotateZ: 0,
    rotateY: 0,
    duration: duration/2,
  })
  sphereAnimation = null;
}

export const pauseAll = () => {
  if (bounces.length) bounces.forEach(b => b.pause());
  if (verticalTimer) verticalTimer.pause();
  if (ringAnimation) ringAnimation.pause();
  if (spinAnimation) spinAnimation.pause();
  if (sphereAnimation) sphereAnimation.pause();
}

export const resumeAll = () => {
  if (bounces.length) bounces.forEach(b => b.play());
  if (verticalTimer) verticalTimer.play();
  if (ringAnimation) ringAnimation.play();
  if (spinAnimation) spinAnimation.play();
  if (sphereAnimation) sphereAnimation.play();
}