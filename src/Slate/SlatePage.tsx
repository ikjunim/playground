import { usePage } from "../Page/PageContext";
import { useEffect, useMemo, useRef } from "react";
import useState from 'react-usestateref';

interface SlatePageProps {
  text: JSX.Element;
  inner: JSX.Element;
  tutorial: boolean;
  empty: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  pageNumber: number;
  squareEffect: (x: number, y: number) => void;
}

export default function SlatePage({ text, inner, tutorial, empty, squareEffect, containerRef, pageNumber }: SlatePageProps) {
  const { active, ready } = usePage();
  const foldRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  const emptyRef = useRef<HTMLDivElement>(null);
  const [foldTutorial, setFoldTutorial] = useState(tutorial);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    squareEffect(e.clientX, e.clientY);
    if (emptyRef.current) emptyRef.current.style.display = 'none';
  }

  const handleFoldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (expandedRef.current) {
      foldRef.current!.classList.remove('fold-expanded');
      foldRef.current!.classList.add('fold-contracted');
    } else {
      foldRef.current!.classList.remove('fold-contracted');
      foldRef.current!.classList.add('fold-expanded');
    }
    expandedRef.current = !expandedRef.current;
    if (foldTutorial) setFoldTutorial(false);
  }

  useEffect(() => {
    if (active === pageNumber) {
    } else {
      containerRef.current!.classList.remove('show');
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) containerRef.current!.classList.add('show');
  }, [ready]);

  const slateMemo = useMemo(() => {
    return <div className="w-svw h-svh flex justify-center items-center pointer-events-auto text-slate bg-transparent" onClick={handleOnClick}>
      {
        !empty &&
        <div className="party-brick relative z-10 no-select single-grid">
          <div className="span-grid relative">
            {text}
          </div>
          <div ref={foldRef} className="overflow-hidden span-grid relative z-10 fold-contracted" onClick={handleFoldClick}>
            {inner}
          </div>
          {foldTutorial &&
            <div className="w-full h-max absolute text-headingHalf flex items-end top-0 left-0 -translate-y-[110%] translate-x-[5%]">
              <svg className="inline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M31.71 1.71 30.29.29 2 28.59V16H0v15a1 1 0 0 0 1 1h16v-2H3.41z" data-name="6-Arrow Down"/></svg>
              press to reveal
            </div>
          }
        </div>
      }
    </div>
  }, [foldTutorial]);

  return slateMemo;
}