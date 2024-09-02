import { animate } from "@juliangarnierorg/anime-beta";
import { useMemo, useRef } from "react";
import { ReadOnlyRefObject } from "react-usestateref";
import { desc, duration } from "./KineticUtility";

interface KineticSliderProps {
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  levelRef: ReadOnlyRefObject<number>;
  animatingRef: React.MutableRefObject<boolean>;
}

export default function KineticSlider({ setLevel, level, levelRef, animatingRef }: KineticSliderProps) {
  const viewBoxRef = useRef<HTMLDivElement>(null);

  const descMemo = useMemo(() => {
    return desc.map((el, i) => {
      return <div key={i} className="pointer-events-none cursor-none no-select text-text flex justify-center 
        items-center flex-shrink-0 text-center w-full h-full bg-black">
        {el}
      </div>
    });
  }, []);

  const handleClick = (dir: "left" | "right") => {
    if (animatingRef.current) return;
    if (dir === "left") {
      if (levelRef.current > 0) {
        setLevel(prev => prev - 1);
        if (!viewBoxRef.current) return;
        animate(viewBoxRef.current, {
          translateX: { to: '+=100%'},
          duration: duration/2,
        })
      }
    } else {
      if (levelRef.current < desc.length - 1) {
        setLevel(prev => prev + 1);
        if (!viewBoxRef.current) return;
        animate(viewBoxRef.current, {
          translateX: { to: '-=100%'},
          duration: duration/2,
        })
      }
    }
  }
  
  return <div className="h-max w-max gap-3 text-transparent text-kinetic pointer-events-auto relative no-select">
    explorer
    <div className="absolute w-full h-full top-0 flex text-text text-white">
      <button className="level-button self-center z-50" onClick={() => handleClick("left")}>
        {
          level === 0 ? 
            <svg className="w-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path className="fill-white" d="m4.12 6.137 1.521-1.52 7 7-1.52 1.52z"/><path className="fill-white" d="m4.12 11.61 7.001-7 1.52 1.52-7 7z"/></svg>
            : <svg className="w-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path className="fill-white" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg>
        }
      </button>
      <div className="pointer-events-none cursor-none text-text flex-grow max-w-[20000px] overflow-hidden w-full h-full">
        <div ref={viewBoxRef} className="w-full h-full flex justify-start text-center">
          {descMemo}
        </div>
      </div>
      <button className="level-button self-center z-50" onClick={() => handleClick("right")}>
        {
          level === desc.length - 1 ? 
            <svg className="w-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path className="fill-white" d="m4.12 6.137 1.521-1.52 7 7-1.52 1.52z"/><path className="fill-white" d="m4.12 11.61 7.001-7 1.52 1.52-7 7z"/></svg>
          : <svg className="w-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path className="fill-white" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" data-name="Right"/></svg>
        }
      </button>
    </div>
  </div>
}