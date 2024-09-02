import { useEffect, useRef, useMemo, useCallback } from 'react';
import { animate, Animation } from '@juliangarnierorg/anime-beta';
import useState from 'react-usestateref';
import { chunk, furthestCorner, oneRandomArray } from '../Utility';
import { holeEffect, rippleEffect } from './SquareEffect';
import { squareCount, setLength, indexOf } from './SquareUtility';
import PageContext from './PageContext';
import Flower from './Flower';
import pages from './PageInfo';
import RevealPage from '../Reveal/RevealPage';

const skipLoading = true;
const maxRadius = { value: 0 };
var rippleAnime: Animation | null = null;
const maskPosition = {
  x: 0,
  y: 0,
  xPercent: 0,
  yPercent: 0,
}
var needMaskResize = false;

export default function PageManager() {
  const [active, setActive, activeRef] = useState(-1);
  const [ready, setReady] = useState(-1);
  
  const loadingRef = useRef<HTMLDivElement>(null);
  const blockerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement[]>([]);
  const whiteMask = useRef<(SVGCircleElement | null)[]>([]);
  const blackMask = useRef<(SVGCircleElement | null)[]>([]);

  const ripple = useCallback((x: number, y: number, type: "next" | number) => {
    const target = type === "next" ? (activeRef.current + 1) % pages.length : type;
    if (target === activeRef.current) return null;
    const index = indexOf(x, y);
    const rect = squareRef.current[index]!.getBoundingClientRect();
    maskPosition.x = rect.left + rect.width/2;
    maskPosition.y = rect.top + rect.height/2;
    maskPosition.xPercent = maskPosition.x / window.innerWidth;
    maskPosition.yPercent = maskPosition.y / window.innerHeight;
    const curBlack = blackMask.current[activeRef.current];
    const curWhite = whiteMask.current[target];

    const { dist } = furthestCorner(
      maskPosition.xPercent * window.innerWidth,
      maskPosition.yPercent * window.innerHeight,
      window.innerWidth,
      window.innerHeight
    )

    /* const speed = 1000*squareRef.current[index]!.clientWidth * 0.8/squareSpeed;
    var i = 0;
    const timer = createTimer({
      frameRate: 60,
      onUpdate: () => {
        curBlack?.setAttribute('r', i * speed/60 + '');
        curWhite?.setAttribute('r', i++ * speed/60 + '');
      }
    }) */
    rippleAnime = rippleEffect(squareRef.current, index, pages[target].color, () => {
      setReady(target);
      curBlack?.setAttribute('cx', `${maskPosition.x}`);
      curBlack?.setAttribute('cy', `${maskPosition.y}`);
      curWhite?.setAttribute('cx', `${maskPosition.x}`);
      curWhite?.setAttribute('cy', `${maskPosition.y}`);
      blockerRef.current!.style.pointerEvents = 'all';
      // timer.play();
    }, (anim) => {
      curBlack?.setAttribute('r', `${dist * anim.progress}`);
      curWhite?.setAttribute('r', `${dist * anim.progress}`);
    }, () => {
      // timer.pause();
      curBlack?.setAttribute('r', '0');
      whiteMask.current[activeRef.current]?.setAttribute('r', '0');
      setActive(target);
      blockerRef.current!.style.pointerEvents = 'none';
      if (needMaskResize) {
        needMaskResize = false;
        handleResize();
      }
    });
    return rippleAnime;
  }, []);

  const handleResize = () => {
    maxRadius.value = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 1;
    const curWhite = whiteMask.current[activeRef.current];
    if (!rippleAnime || rippleAnime.completed) curWhite?.setAttribute('r', `${maxRadius.value}`);
    else needMaskResize = true;
    curWhite?.setAttribute('cx', `${maskPosition.xPercent * window.innerWidth}`);
    curWhite?.setAttribute('cy', `${maskPosition.yPercent * window.innerHeight}`);
    if (squareRef.current && squareRef.current.length) setLength(squareRef.current[0]!.clientWidth);
  }

  const squareMemo = useMemo(() => {
    return <div className="absolute max-h-[20000px] page-grid w-full h-full">
      {
        Array.from({length: squareCount * squareCount}, (_, i) => {
          return <div ref={el => {
            if (el) squareRef.current.push(el);
          }} key={i} id={`${i}-square`}
          className="page-square" style={{ transform: 'translateX(100svw)' }}/>
        })
      }
    </div>
  }, []);

  const clipMemo = useMemo(() => {
    return Array.from({ length: pages.length }, (_, i) => {
      return <svg key={i} className='absolute' xmlns="http://www.w3.org/2000/svg">
        <mask id={`page-clip-${i + 1}`}>
          <circle ref={(element) => whiteMask.current.push(element)} cx="0" cy="0" r="0" fill="white"/>
          <circle ref={(element) => blackMask.current.push(element)} cx="0" cy="0" r="0" fill="black"/>
        </mask>
      </svg>
    });
  }, []);

  useEffect(() => {
    handleResize();

    whiteMask.current.forEach((element, i) => element?.setAttribute('r', i === 0 ? `${maxRadius.value}` : '0'));
    blackMask.current.forEach((element) => element?.setAttribute('r', '0'))

    if (!squareRef.current.length || !blockerRef.current) return;
    blockerRef.current.style.pointerEvents = 'all';
    const rows = chunk(squareRef.current, squareCount);
    for(let i = 0; i < rows.length; i++) {
      const delays = oneRandomArray(squareCount).map((i) => i * (skipLoading ? 0 : 6000));
      rows[i].forEach((el: HTMLDivElement, j: number, arr: any[]) => {
        animate(el, {
          translateX: '0svw',
          easing: 'inOutQuad',
          duration: skipLoading ? 0 : 1000,
          delay: 1000 + delays[j],
          onComplete: () => {
             if (i === rows.length - 1 && j === arr.length - 1) {
              squareRef.current.forEach(el => el!.style.transform = 'translateX(0) rotate(0)')
              // ripple(0, 0, 0);
              setReady(0);
              setActive(0);
              loadingRef.current!.style.display = 'none';
              blockerRef.current!.style.pointerEvents = 'none';
            }
          }
        })
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadingMemo = useMemo(() => {
    return <div ref={loadingRef} className='absolute top-0 left-0 w-full h-full 
      flex flex-col justify-center items-end bg-black font-mono 
      text-heading text-white select-none pointer-events-none'>
      <span>Building</span>
      <span className='text-headingHalf text-red'>(loading)</span>
      <span>Blocks...</span>
    </div>
  }, []);

  return <div className="w-svw h-svh relative overflow-hidden">
    <div ref={blockerRef} className='absolute top-0 w-full h-full bg-transparent z-[9999]'/>
    {loadingMemo}
    <RevealPage active={active} pageNumber={pages.length - 1} 
      immediateEffect={(indexes: number[], holes: number[]) => holeEffect(squareRef.current, indexes, holes)}
    />
    {squareMemo}
    <PageContext.Provider value={{ active, ready }}>
      {
        pages.map((info, i) => {
          const ref = useRef<HTMLDivElement>(null);
          if (info.type === 'fun') {
            return <div ref={ref} key={i} className={`page page-mask-${i+1}`}>
              <info.page containerRef={ref} pageNumber={i + 1}/>
              {clipMemo[i]}
            </div>
          } else if (info.type === 'slate') {
            return <div ref={ref} key={i} className={`page page-mask-${i+1}`}>
              <info.page text={info.text ? info.text : ''} inner={info.inner ? info.inner : ''} 
                tutorial={info.tutorial ? info.tutorial : false}
                empty={info.empty ? info.empty : false}
                containerRef={ref} pageNumber={i + 1}
                squareEffect={info.effect ? 
                  (x: number, y: number) => info.effect && info.effect(squareRef.current, x, y)
                : () => {}}/>
              {clipMemo[i]}
            </div>
          }
        })
      }
    </PageContext.Provider>
    <Flower squareEffect={ripple} active={active}/>
  </div>
}