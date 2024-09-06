import PageInterface from "../Page/PageInterface";
import { usePage } from "../Page/PageContext";
import { useEffect, useRef } from "react";
import { Painter } from "./Painter";
import useState from "react-usestateref";

let painter: Painter;

export default function PaintPage({ containerRef, pageNumber }: PageInterface) {
  const { active, ready } = usePage();
  const [_, setOnce, onceRef] = useState(false);
  const paintGridRef = useRef<HTMLDivElement>(null);
  const shouldRender = useRef(false);

  const handleResize = () => {
    painter.resize();
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (active === pageNumber) {
      if (!onceRef.current) {
        setOnce(true);
        if (!painter) return;
        painter.show();
      }
      shouldRender.current = true;
    } else {
      containerRef.current!.classList.remove('show');
      if (painter) painter.pause();
      shouldRender.current = false;
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) {
      containerRef.current!.classList.add('show');
      if (painter && painter.finishedInitial && onceRef.current) painter.play();
    }
  }, [ready]);

  useEffect(() => {
    if (!paintGridRef.current) return;
    if (!painter) painter = new Painter(paintGridRef.current);
  }, [paintGridRef.current]);

  return <div className="w-full h-full relative">
    <div ref={paintGridRef} className="paint-grid"/>
  </div>
}