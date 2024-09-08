import { rowOf, colOf, ringOf, topdown, leftright, rightleft, bottomup, squareCount, indexOf, getVisible, block2, pick2 } from '../Page/SquareUtility';
import { animate, stagger, Timer, createTimeline, Target, Animation, utils, createTimer } from '@juliangarnierorg/anime-beta';
import MatterColor from '../Constants/MatterColor';
import MatterTone from '../Constants/MatterTone';
import { interpolateColor, randomElement, rgbToHex, shuffle } from '../Utility';

//This is for the ripple effect
const fastTransition = false;
//This is how long the animation takes
const squareDuration = 300;
//This is how long the animation waits before starting
//The four controls the 'length' of the frontier
const squareSpeed = fastTransition ? 10 : squareDuration/4;

let animating = false;
let animatingFalse = () => animating = false;

export const rippleEffect = (targets: HTMLDivElement[], index: number, 
  color: string, onBegin: () => void, onUpdate: (anim: Animation) => void, onComplete: () => void) => {
  if (animating) return null;
  animating = true;

  const { visible, visibleCols, visibleIndex } = getVisible(targets, index, (d) => {
    utils.set(d, { 
      scale: 1,
      background: color,
      rotate: 0,
      translateX: 0,
      translateY: 0, 
    });
  });

  const anim = animate(visible, {
    scale: [
      { to: 0 },
      { to: 1 }
    ],
    background: color,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    duration: squareDuration,
    delay: stagger(squareSpeed,
      {
        grid: [visibleCols, visibleCols],
        from: visibleIndex,
        ease: 'linear'
      }
    ),
    onBegin,
    onUpdate,
    onComplete: () => {
      onComplete();
      animatingFalse();
    }
  })
  return anim;
}

let jumpScale = 0.8;
export const waterEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  if (animating) return null;
  animating = true;
  const { visible, visibleCols, visibleIndex } = getVisible(targets, indexOf(x, y));
  const anim = animate(visible, {
    scale: jumpScale,
    ease: 'outElastic(3, 0.45)',
    delay: stagger(30, {
      grid: [visibleCols, visibleCols],
      from: visibleIndex,
    }),
    onComplete: animatingFalse,
  });
  jumpScale = jumpScale === 0.8 ? 1 : 0.8;
  return anim;
}

export const sunflowerEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  if (animating) return null;
  animating = true;
  const color = MatterColor.RandomRGB();
  const index = indexOf(x, y);
  const { visible, visibleCols, visibleIndex } = getVisible(targets, index, (d) => {
    utils.set(d, {
      translateX: 0,
      translateY: 0,
      background: rgbToHex(color.r, color.g, color.b),
    })
  });
  const row = rowOf(visibleIndex, visibleCols);
  const col = colOf(visibleIndex, visibleCols);
  const anim = animate(visible, {
    translateX: (_: Target | undefined, i: number | undefined) => {
      if (i === undefined) return 0;
      const col2 = colOf(i, visibleCols);
      if (col2 === col) return 0;
      return (col2 > col ? 1 : -1) * Math.log1p(ringOf(visibleIndex, i, visibleCols) - 1) * 75 + '%';
    },
    translateY: (_: Target | undefined, i: number | undefined) => {
      if (i === undefined) return 0;
      const row2 = rowOf(i, visibleCols);
      if (row2 === row) return 0;
      return (row2 > row ? 1 : -1) * Math.log1p(ringOf(visibleIndex, i, visibleCols) - 1) * 75 + '%';
    },
    background: (_: any, i: number | undefined) => {
      if (i === undefined) return MatterTone.White;
      const c = interpolateColor(MatterTone.WhiteRGB, color, 1 - ringOf(visibleIndex, i, visibleCols) / squareCount);
      return `rgb(${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)})`;
    },
    duration: 750,
    delay: stagger(40,
      {
        grid: [visibleCols, visibleCols],
        from: visibleIndex,
      }
    ),
    onComplete: animatingFalse,
  })
  return anim;
}

const shootDelay = 50;
const shootDuration = 200;
const shootTranslation = 40;
const shootWaveDuration1 = 600;
const shootWaveDuration2 = 400;
const shootWaveDelay = 30;
const shootBaseColor = MatterColor.Red;
const shootColor = [MatterTone.White, MatterColor.Yellow, MatterColor.Green, MatterColor.Blue];
const rotateShootColor = () => {
  shootColor.push(shootColor.shift()!);
}

export const shootEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  if (animating) return null;
  animating = true;

  const index = indexOf(x, y);
  const { visible, visibleCols, visibleRows, visibleIndex } = getVisible(targets, index);

  const row = rowOf(visibleIndex, visibleCols);
  const col = colOf(visibleIndex, visibleCols);

  const td = topdown(visibleIndex, visibleRows, visibleCols);
  const lr = leftright(visibleIndex, visibleRows, visibleCols);
  const rl = rightleft(visibleIndex, visibleRows, visibleCols);
  const bu = bottomup(visibleIndex, visibleRows, visibleCols);

  const max = Math.max(td.length, lr.length, rl.length, bu.length);

  const timeline = createTimeline();
  const offset = Math.floor(Math.random() * MatterColor.Array().length);

  timeline
  .add(td.map(i => targets[i]), {
    background: [
      { to: shootColor[0]},
      { to: shootBaseColor }
    ],
    duration: shootDuration,
    delay: stagger(shootDelay, { start: shootDelay * (max - td.length), from: 0, ease: 'linear' }),
  }, 0)
  .add(lr.map(i => targets[i]), {
    background: [
      { to: shootColor[1]},
      { to: shootBaseColor }
    ],
    duration: shootDuration,
    delay: stagger(shootDelay, { start: shootDelay * (max - lr.length), from: 0, ease: 'linear' }),
  }, 0)
  .add(rl.map(i => targets[i]), {
    background: [
      { to: shootColor[1]},
      { to: shootBaseColor }
    ],
    duration: shootDuration,
    delay: stagger(shootDelay, { start: shootDelay * (max - rl.length), from: 0, ease: 'linear' }),
  }, 0)
  .add(bu.map(i => targets[i]), {
    background: [
      { to: shootColor[3]},
      { to: shootBaseColor }
    ],
    duration: shootDuration,
    delay: stagger(shootDelay, { start: shootDelay * (max - bu.length), from: 0, ease: 'linear' }),
  }, 0)
  .add(visible, {
    background: [
      { to: (_: Target | undefined, i: number | undefined) => {
        if (i === undefined) return shootBaseColor;
        return MatterColor.Array()[(ringOf(visibleIndex, i, visibleCols) + offset) % 4];
      }, duration: shootWaveDuration1 },
      { to: shootBaseColor, duration: shootWaveDuration2 }
    ],
    translateX: [
      { to: (_: Target | undefined, i: number | undefined) => {
        if (i === undefined) return 0;
        const col2 = colOf(i, visibleCols);
        return (col2 - col) * shootTranslation + '%'
      }, duration: shootWaveDuration1 },
      { to: 0, duration: shootWaveDuration2 }
    ],
    translateY: [
      { to: (_: Target | undefined, i: number | undefined) => {
        if (i === undefined) return 0;
        const row2 = rowOf(i, visibleCols);
        return (row2 - row) * shootTranslation + '%'
      }, duration: shootWaveDuration1 },
      { to: 0, duration: shootWaveDuration2 }
    ],
    ease: 'outQuad',
    delay: stagger(shootWaveDelay,
      {
        grid: [visibleCols, visibleCols],
        from: visibleIndex,
      }
    )
  }, `-=${shootDelay}`)
  .add({ duration: 1, onComplete: animatingFalse }, '+=0')

  rotateShootColor();
  return timeline;
}

const crossColor = MatterColor.Blue;

export const crossEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  if (animating) return null;
  animating = true;
  const index = indexOf(x, y);
  const { visible, visibleCols, visibleIndex } = getVisible(targets, index, (d) => {
    utils.set(d, {
      rotate: 0,
      background: crossColor,
    })
  });
  const row = rowOf(visibleIndex, visibleCols);
  const col = colOf(visibleIndex, visibleCols);
  const anim = animate(visible, {
    rotate: (_: any, i: number | undefined) => {
      if (i === undefined) return 0;
      return Math.atan2(rowOf(i, visibleCols) - row, colOf(i, visibleCols) - col) + 'rad';
    },
    background: (_: any, i: number | undefined) => {
      if (i === undefined) return crossColor;
      if (rowOf(i, visibleCols) === row || colOf(i, visibleCols) === col) return MatterTone.Black;
      else return crossColor;
    },
    duration: 800,
    ease: 'outExpo',
    delay: stagger(50,
      {
        grid: [visibleCols, visibleCols],
        from: visibleIndex,
      }
    ),
    onComplete: animatingFalse,
  });
  return anim;
}

const paintColors = [MatterColor.Red, MatterColor.Green, MatterColor.Blue, MatterTone.White, MatterTone.Black];
const randomPaint = () => {
  return paintColors[Math.floor(Math.random() * paintColors.length)];
}

export const paintEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  if (animating) return null;
  animating = true;
  const anim = animate(targets[indexOf(x, y)]!, {
    background: randomPaint(),
    ease: 'inOutQuad',
    duration: 200,
    onComplete: animatingFalse,
  })
  return anim;
}

const punchDuration = 100;
export const holeEffect = (targets: HTMLDivElement[], indexes: number[], holes: number[]) => {
  if (animating) return null;
  animating = true;

  const startingIndexes: number[] = JSON.parse(JSON.stringify(indexes));

  startingIndexes.forEach((index, i) => {
    pick2(index, holes[i]).forEach(picked => {
      indexes.push(picked);
    })
  })

  shuffle(indexes);
  var counter = 0;
  const timer = createTimer({
    duration: punchDuration + 10,
    loop: true,
    onLoop: () => {
      if (counter >= indexes.length) {
        timer.pause();
        animatingFalse();
        return;
      }
      punchEffectWrapper(targets, indexes[counter++], true);
    }
  })
}

export const punchEffectWrapper = (targets: HTMLDivElement[], index: number, ignore: boolean = false) => {
  if (!ignore && animating) return null;
  if (!ignore) animating = true;

  const indexes = block2(index);

  const anim = animate(indexes.map(i => targets[i]), {
    scale: (target: Target | undefined, i: number | undefined) => {
      if (i === undefined || target === undefined) return 0;
      return Math.max(utils.get(target, 'scale') - 
        (1 - Math.sqrt( (rowOf(indexes[i]) - rowOf(index)) ** 2 + (colOf(indexes[i]) - colOf(index)) ** 2 )/3), 
      0);
    },
    duration: punchDuration,
    onComplete: () => {
      if (!ignore) animatingFalse();
    }
  });
  return anim;
}

export const punchEffect = (targets: HTMLDivElement[], x: number, y: number) => {
  return punchEffectWrapper(targets, indexOf(x, y));
}

export const timerEffect = (duration: number, onBegin: () => void, onUpdate: (timer: Timer) => void, onComplete: () => void) => {
	if (animating) return null;
	animating = true;

	return createTimer({
		duration,
		frameRate: 60,
		onBegin,
		onUpdate,
		onComplete: () => {
			onComplete();
			animatingFalse();
		}
	})
}

//For safari, the dumbass browser
const slideOptions = [
	{
		hiding: {translateY: { from: '0%', to: '100%' }},
		showing: {
			translateX: 0,
			translateY: { from: '-100%', to: '0%'},
		}
	},
	{
		hiding: {translateX: { from: '0%', to: '-100%'}},
		showing: {
			translateX: { from: '100%', to: '0%'},
			translateY: 0,
		}
	},
	{
		hiding: {translateY: { from: '0%', to: '-100%'}},
		showing: {
			translateX: 0,
			translateY: { from: '100%', to: '0%'},
		}
	},
	{
		hiding: {translateX: { from: '0%', to: '100%'}},
		showing: {
			translateX: { from: '-100%', to: '0%'},
			translateY: 0,
		}
	}
]

const strToSlideOption = (str: 'top' | 'right' | 'bottom' | 'left') => {
	switch(str) {
		case 'top':
			return slideOptions[0]
		case 'right':
			return slideOptions[1]
		case 'bottom':
			return slideOptions[2]
		case 'left':
			return slideOptions[3]
	}
}

export const randomSlide = (hiding: HTMLDivElement, showing: HTMLDivElement, type: 'random' | 'top' | 'right' | 'bottom' | 'left',
	 duration: number, onBegin: () => void, onComplete: () => void) => {
	const options = type === 'random' ? randomElement(slideOptions) : strToSlideOption(type);
	if (animating) return null;
  animating = true;

	if (hiding) {
		animate(hiding, {
			...options.hiding,
			duration,
			ease: 'inOutQuad',
			onBegin,
			onComplete,
		})
	}

	return animate(showing, {
		...options.showing,
		duration,
		ease: 'inOutQuad',
		onBegin,
		onComplete: () => {
			onComplete();
			animatingFalse();
		}
	})
}