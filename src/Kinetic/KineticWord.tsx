import MatterTone from "../Constants/MatterTone";
import { word } from "./KineticUtility";

interface KineticWordProps {
  wordRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  pivotRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  charRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}

export default function KineticWord({ wordRef, pivotRef, charRef }: KineticWordProps) {
  return <div ref={el => wordRef.current.push(el)} className="flex kinetic-word pointer-events-all">
    {
      word.split('').map((char, i) => {
        return <div ref={el => pivotRef.current.push(el)} className="kinetic-pivot" key={i}>
          <span ref={el => charRef.current.push(el)} className="kinetic-char" key={i} style={{
            WebkitTextStrokeColor: MatterTone.White,
            transform: `translateX(${0.28+(i - word.length/2)*0.63}em)`
          }}>
            {char}
          </span>
        </div>
      })
    }
    <div className="opacity-0">&nbsp;</div>
  </div>
}