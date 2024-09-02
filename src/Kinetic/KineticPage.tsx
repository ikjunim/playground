import PageInterface from "../Page/PageInterface";
import { usePage } from "../Page/PageContext";
import { useEffect, useMemo, useRef } from "react";
import KineticWord from "./KineticWord";
import useState from 'react-usestateref';
import KineticSlider from "./KineticSlider";
import { colorFill, colorStroke, moveY, pivotRing, moveLeft,
    startFlashing, startVertical, stopFlashing, stopVertical, 
    whiteStroke, charFaceCenter, resetVertical, resetShiftAll, 
    pivotLinear, charFaceLinear, stopSphere, startSphere, 
    charBounce, stopBounce, resumeAll, pauseAll} from "./KineticEffect";
import { rows, isInner, isInnerInner } from "./KineticUtility";

export default function KineticPage({ containerRef, pageNumber }: PageInterface) {
  const { active, ready } = usePage();
  const wordRef = useRef<(HTMLDivElement)[]>([]);
  const pivotRef = useRef<(HTMLDivElement)[]>([]);
  const charRef = useRef<(HTMLSpanElement)[]>([]);
  const kineticRef = useRef<HTMLDivElement>(null);
  const [level, setLevel, levelRef] = useState(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (active === pageNumber) {
    } else {
      containerRef.current!.classList.remove('show');
      pauseAll();
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) {
      containerRef.current!.classList.add('show');
      resumeAll();
    }
  }, [ready]);

  const lineMemo = useMemo(() => {
    return <div ref={kineticRef} className="w-full h-[150%] max-h-[20000px] flex flex-col justify-around items-center kinetic-container">
      {Array.from({ length: rows }).map((_, i) => <KineticWord
        wordRef={wordRef} pivotRef={pivotRef} charRef={charRef} key={i}/>)}
    </div>
  }, []);

  useEffect(() => {
    animatingRef.current = true;
    switch(level) {
      case 0:
        stopBounce();
        moveY(wordRef.current, [0, 25, 0, -25, -50, 0]);
        colorFill(charRef.current, '#ffffffff').onComplete = () => animatingRef.current = false;
        whiteStroke(charRef.current);
        resetVertical(charRef.current);
        moveLeft(kineticRef.current, '-0.25em');
        break;
      case 1:
        charBounce(charRef.current.filter((_, i) => isInnerInner(i)), 20, 20, () => animatingRef.current = false);
        moveY(wordRef.current, [0, 25, 0, -25, -50, 0]);
        moveLeft(kineticRef.current, '-0.25em');
        break;
      case 2:
        stopBounce();
        colorStroke(charRef.current);
        moveY(wordRef.current, [0, 0, 0, 0, 0, 0]);
        stopVertical();
        stopFlashing();
        colorFill(charRef.current, '#ffffff00').onComplete = () => resetShiftAll(charRef.current, () => animatingRef.current = false);
        moveLeft(kineticRef.current, '-0.25em');
        break;
      case 3:
        startVertical(charRef.current);
        startFlashing(charRef.current);
        pivotLinear(pivotRef.current).onComplete = () => animatingRef.current = false;
        charFaceLinear(charRef.current);
        moveLeft(kineticRef.current, '-0.25em');
        break;
      case 4:
        startVertical(charRef.current);
        pivotRing(pivotRef.current, () => animatingRef.current = false);
        charFaceCenter(charRef.current);
        moveY(wordRef.current.filter((_, i) => isInner(i)), [0, 0, 0, 0]);
        stopSphere(wordRef.current.filter((_, i) => isInner(i)));
        moveLeft(kineticRef.current, '0');
        break;
      case 5:
        stopVertical();
        resetShiftAll(charRef.current, () => {
          moveY(wordRef.current.filter((_, i) => isInner(i)), [37.5, 12.5, -12.5, -37.5]).onComplete = () => animatingRef.current = false;
          startSphere(wordRef.current.filter((_, i) => isInner(i)));
        });
        moveLeft(kineticRef.current, '0');
        break;
    }
  }, [level]);

  return <div className="w-full h-full flex items-center">
    <div className="w-full h-full absolute top-0 flex justify-center items-center text-kinetic">
      <KineticSlider level={level} setLevel={setLevel} levelRef={levelRef} animatingRef={animatingRef}/>
    </div>
    {lineMemo}
  </div>
}