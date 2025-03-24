import SlatePage from "../Slate/SlatePage";
import BalloonPage from "../Balloon/BalloonPage";
import ThreePage from "../Three/ThreePage";
import LetterPage from "../Letter/LetterPage";
import PaintPage from "../Paint/PaintPage";
import KineticPage from "../Kinetic/KineticPage";
import MatterTone from "../Constants/MatterTone";
import { waterEffect, sunflowerEffect, shootEffect, crossEffect, paintEffect, punchEffect } from "./SquareEffect";
import { JSAnimation, Timeline } from "@juliangarnierorg/anime-beta";
import MatterColor from "../Constants/MatterColor";
import { isMobileOnly, isSafari } from "react-device-detect";

interface PageInfo {
  type: 'fun' | 'slate';
  color: string; //hex
  bg: string; //tailwind
  page: React.FC<any>;
  text?: JSX.Element;
  inner?: JSX.Element;
  tutorial?: boolean;
  empty?: boolean;
  effect?: (targets: HTMLDivElement[], x: number, y: number) => JSAnimation | Timeline | null;
  flowerPosition: "bottom-left" | "bottom-center" | "bottom-right";
}

const pages: PageInfo[] = [
  { type: 'slate', color: MatterTone.White, bg: 'white', page: SlatePage, flowerPosition: "bottom-center",
    text: <div className="full-stack items-center">
      <span className="text-heading">playground</span>
      <span className="text-headingHalf">ikjunim@gmail.com</span>
			{isMobileOnly ? <>
				<span className="text-text">A laptop is recommended</span>
			</> :
				isSafari ? <>
					<span className="text-text">A modern browser is recommended</span>
					<span className="text-text">like Chrome or Firefox</span>
				</> : 
				<></>
			}
    </div>,
    inner: (isMobileOnly || isSafari) ? 
      <div className="full-stack bg-black text-white items-center justify-center text-text">
        <span className="text-headingHalf">press here</span>
        <span className="text-headingHalf">again to hide</span>
      </div> : 
      <div className="full-stack bg-black text-white items-center justify-center text-text">
        <span className="text-headingHalf">press on the grid</span>
        <span className="text-headingHalf">(on the squares)</span>
        <span>press here again to hide</span>
      </div>,
    effect: waterEffect,
    tutorial: true,
  },
  { type: 'fun', color: MatterTone.Black, bg: 'black', page: ThreePage, flowerPosition: "bottom-right", },
  { type: 'slate', color: MatterColor.Red, bg: 'red', page: SlatePage, flowerPosition: "bottom-center", 
    text: <div className="full-stack text-headingHalf">
      <span>&nbsp;what's the purpose</span>
      <span>of this website?</span>
    </div>,
    inner: <div className="full-stack bg-red text-black justify-center items-center">
      <span className="text-headingHalf">experiment</span>
      <span className="text-text">this website is the result of me</span>
      <span className="text-text">playing around with my creativity</span>
    </div>,
    effect: shootEffect,
  },
  { type: 'fun', color: MatterTone.White, bg: 'white', page: BalloonPage, flowerPosition: "bottom-right", },
  { type: 'slate', color: MatterColor.Yellow, bg: 'yellow', page: SlatePage, flowerPosition: "bottom-center",
    text: <div className="full-stack text-headingHalf">
      <span>&nbsp;what's the inspiration</span>
      <span>behind the website?</span>
    </div>,
    inner: <div className="full-stack bg-yellow text-black justify-center items-center">
      <span className="text-headingHalf">me</span>
      <span className="text-text">i took my personality and found creative</span>
      <span className="text-text">and interactive ways to express it</span>
    </div>,
    effect: paintEffect,
  },
  { type: 'fun', color: MatterTone.Black, bg: 'black', page: KineticPage, flowerPosition: "bottom-right", },
  { type: 'slate', color: MatterColor.Green, bg: 'green', page: SlatePage, flowerPosition: "bottom-center", 
    text: <div className="full-stack text-headingHalf">
      <span>&nbsp;How did you make</span>
      <span>the website?</span>
    </div>,
    inner: <div className="full-stack bg-green text-black justify-center items-center">
      <span className="text-headingHalf">with passion</span>
      <span className="text-text">...and a lot of time</span>
      <span className="text-text">...and a lot of effort</span>
    </div>,
    effect: sunflowerEffect,
  },
  { type: 'fun', color: MatterTone.Black, bg: 'black', page: LetterPage, flowerPosition: "bottom-right", },
  { type: 'slate', color: MatterColor.Blue, bg: 'blue', page: SlatePage, flowerPosition: "bottom-center", 
    text: <div className="full-stack text-headingHalf">
      <span>&nbsp;How long did it take</span>
      <span>for you to make it?</span>
    </div>,
    inner: <div className="full-stack bg-blue text-white justify-center items-center">
      <span className="text-headingHalf">4 months</span>
      <span className="text-text">from the concept to design and to</span>
      <span className="text-text">self-learning everything involved</span>
    </div>,
    effect: crossEffect,
  },
  { type: 'fun', color: MatterTone.Black, bg: 'black', page: PaintPage, flowerPosition: "bottom-right", },
  { type: 'slate', color: MatterTone.White, bg: 'black', page: SlatePage, flowerPosition: "bottom-right", 
    empty: true,
    effect: punchEffect,
  },
]
export default pages;