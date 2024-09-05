import fonts from "./fonts";
import MatterTone from "../Constants/MatterTone";
import MatterColor from "../Constants/MatterColor";

const commonTitleOption = {
  fontSize: 10,
  maxWidth: 300,
  lineHeight: 1,
  letterSpacing: 0,
  textAlign: 'center',
  materialType: 'MeshBasicMaterial',
}

const commonTextOption = {
  fontSize: 3,
  maxWidth: 300,
  lineHeight: 1,
  letterSpacing: 0,
  textAlign: 'center',
  materialType: 'MeshBasicMaterial',
}

const titleString = [
  "Developer",
  "Extrovert",
  "Magician",
  "Artist",
  "Explorer"
];

const textString = [
  "Pursuing Frontend\nReact, Three, Vite",
  "I know it looks like it, but\nI'm not a shut-in, I touch grass",
  "If you have an idea\nI can turn it into reality",
  "Artists use a brush\nI use a keyboard",
  "I go wherever\nMy curiosity takes me"
]

export const title = [
  { ...commonTitleOption, fontSize: 8, font: fonts["Space Mono"], color: MatterTone.White, text: titleString[0] },
  { ...commonTitleOption, font: fonts["Caveat"], color: MatterColor.Red, text: titleString[1] },
  { ...commonTitleOption, font: fonts["DM Serif"], color: MatterColor.Yellow, text: titleString[2] },
  { ...commonTitleOption, font: fonts["LaBelle Aurore"], color: MatterColor.Green, text: titleString[3] },
  { ...commonTitleOption, font: fonts["League Gothic"], color: MatterColor.Blue, text: titleString[4] },
]

export const sub = [
  { ...commonTextOption, font: fonts["Space Mono"], color: MatterTone.White, text: textString[0] },
  { ...commonTextOption, font: fonts["Caveat"], color: MatterColor.Red, text: textString[1] },
  { ...commonTextOption, font: fonts["DM Serif"], color: MatterColor.Yellow, text: textString[2] },
  { ...commonTextOption, font: fonts["Space Mono"], color: MatterColor.Green, text: textString[3] },
  { ...commonTextOption, font: fonts["League Gothic"], color: MatterColor.Blue, text: textString[4] },
]