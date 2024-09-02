export const word = "explorer";
export const rows = 6;
export const innerRows = 4;
export const duration = 800;
export const isInner = (i: number) => i > 0 && i < 5;
export const isInnerInner = (i: number) => isInner(Math.floor(i/word.length));

export const desc = [
  <>
    What better way to show you <br/> that I'm an explorer
  </>,
  <>
    Than to show you <br/> the journey itself?
  </>,
  <>
    What you are seeing is the <br/>process of taking a single word
  </>,
  <>
    And me experimenting with the <br/> different ways it can be animated
  </>,
  <>
    I let curiosity take the wheel <br/> because it can lead to some...
  </>,
  <>
    Mesmerising <br/> effects
  </>,
]