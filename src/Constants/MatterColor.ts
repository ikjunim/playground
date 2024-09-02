import { hexToRgb } from "../Utility";

const MatterColor = {
  Red: '#fe6d73',
  Yellow: '#ffcb77',
  Green: '#17c3b2',
  Blue: '#227c9d',
  RedRGB: hexToRgb('#fe6d73'),
  YellowRGB: hexToRgb('#ffcb77'),
  GreenRGB: hexToRgb('#17c3b2'),
  BlueRGB: hexToRgb('#227c9d'),
  Random: () => "#ffffff",
  RandomRGB: () => ({ r: 255, g: 255, b: 255 }),
  Array: () => [''],
  //@ts-ignore
  RandomArray: (count: number) => [''],
}

const colors = [MatterColor.Red, MatterColor.Yellow, MatterColor.Green, MatterColor.Blue];
MatterColor.Random = () => {
  return colors[Math.floor(Math.random() * colors.length)];
}

MatterColor.RandomRGB = () => {
  const res = hexToRgb(MatterColor.Random());
  if (res === null) return { r: 255, g: 255, b: 255 };
  return res;
}

MatterColor.RandomArray = (count: number) => {
  return Array.from({ length: count }, () => MatterColor.Random());
}

MatterColor.Array = () => {
  return colors;
}

export default MatterColor;