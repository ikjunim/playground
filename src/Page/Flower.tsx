import { useEffect, useMemo, useRef, useState } from "react";
import { hasMouse } from "../Utility";
import pages from "./PageInfo";
import { animate, stagger, createTimer, spring } from "@juliangarnierorg/anime-beta";

const petalCount = 12;

let targetPosition = { x: 0, y: 0 };
let mousePosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };
let speed = 0.06, followMouse = true;

let curActive = 0;
const flowerPosition = pages.map(page => page.flowerPosition);
let prevPosition = flowerPosition[0];

interface FlowerProps {
  squareEffect: (x: number, y: number, type: "next" | number) => boolean,
  active: number,
  ready: number,
}

export default function Flower({ squareEffect, active, ready }: FlowerProps) {
  const lappedString = localStorage.getItem('lapped');
  if (lappedString === null) localStorage.setItem('lapped', 'false');
  const [lapped, setLapped] = useState(lappedString ? lappedString === 'true' : false);
  
  const flowerRef = useRef<HTMLDivElement>(null);
  const petalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const navRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = (e: any) => {
    if (squareEffect(e.clientX, e.clientY, "next")) {
      buttonRef.current!.classList.remove(prevPosition);
      prevPosition = flowerPosition[(curActive + 1)%flowerPosition.length];
      buttonRef.current!.classList.add(prevPosition);
    }
  }

  const handleNavClick = (e: any, i: number) => {
    if (squareEffect(e.clientX, e.clientY, i)) {
      buttonRef.current!.classList.remove(prevPosition);
      prevPosition = flowerPosition[i];
      buttonRef.current!.classList.add(prevPosition);
    }
  }

  useEffect(() => {
    curActive = active;
  }, [active]);

  const buttonFollowTimer = useMemo(() => {
    return createTimer({
      frameRate: 30,
      onUpdate: () => {
        const rect = buttonRef.current!.getBoundingClientRect();
        targetPosition.x = rect.x + rect.width/2;
        targetPosition.y = rect.y + rect.height/2;
      },
      autoplay: false,
    })
  }, []);

	const mouseFollowTimer = useMemo(() => {
    if (!hasMouse) return null;
		return createTimer({
			frameRate: 60,
			onUpdate: () => {
				currentPosition.x = currentPosition.x + (targetPosition.x - currentPosition.x) * speed;
    		currentPosition.y = currentPosition.y + (targetPosition.y - currentPosition.y) * speed;

    		flowerRef.current!.style.transform = "translate(" + currentPosition.x + "px, " + currentPosition.y + "px)";
			},
			autoplay: false,
		})
	}, []);

  const handleEnter = () => {
    if (!hasMouse) return;
    followMouse = false;
    buttonFollowTimer.play();
    petalRef.current!.classList.add('expanded');
    petalRef.current!.classList.remove('contracted');
  }

  const handleLeave = () => {
    if (!hasMouse) return;
    followMouse = true;
    buttonFollowTimer.pause();
    petalRef.current!.classList.remove('expanded');
    petalRef.current!.classList.add('contracted');

    targetPosition.x = mousePosition.x;
    targetPosition.y = mousePosition.y;
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!hasMouse) return;
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
    if (followMouse) {
      targetPosition.x = mousePosition.x;
      targetPosition.y = mousePosition.y;
    }
  }

  useEffect(() => {
    if (hasMouse) {
      flowerRef.current!.style.transform = "translate(0px, 0px)";
      window.addEventListener('mousemove', handleMouseMove);
			mouseFollowTimer?.play();
    }

    return () => {
      if (hasMouse) {
        window.removeEventListener('mousemove', handleMouseMove);
				mouseFollowTimer?.pause();
      }
    }
  }, []);

  const buttonMemo = useMemo(() => {
    return <div ref={buttonRef} className={`absolute top-0 left-0 flower z-[200] flex justify-center items-center ${prevPosition}`}>
      <svg className="w-[100%] h-[100%] pointer-events-auto relative z-10 fill-[#ffffff]" 
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" 
        onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}>
        <path ref={pathRef} d="m68.4 33.5-3.8 3.8L89.2 62H24.1v5.3h64.3l-23.8 24 3.8 3.8 30.7-30.8-.1-.1.1-.1-30.7-30.6zM64.1 0C28.8 0 .2 28.7.2 64s28.6 64 63.9 64S128 99.3 128 64c-.1-35.3-28.7-64-63.9-64zm0 122.7C31.7 122.7 5.5 96.4 5.5 64c0-32.4 26.2-58.7 58.6-58.7 32.3 0 58.6 26.3 58.6 58.7-.1 32.4-26.3 58.7-58.6 58.7z" id="icon_36_"/>
      </svg>
      <div className="w-[300%] h-[300%] max-w-[20000px] max-h-[20000px] absolute" 
        onMouseEnter={handleEnter} onMouseLeave={handleLeave}/>
    </div>
  }, []);

  const navMemo = useMemo(() => {
    return Array.from({ length: pages.length }, (_, i) => {
      return <button key={i} ref={el => navRef.current.push(el)} 
        className="border-none outline-none text-nav font-mono w-[1.5em] inline-flex justify-center items-center h-max text-[#ffffff] mix-blend-difference" 
        onClick={(e) => handleNavClick(e, i)} style={{ transform: 'translateY(-5em)'}}>
        {i+1}
      </button>
    });
  }, []);

	const ballRef = useRef<HTMLDivElement>(null);
  const ballMemo = useMemo(() => {
    return <div ref={ballRef} className="absolute bottom-0 left-0 text-nav bg-white w-[1.5em] h-full nav-ball" style={{ transform: 'translateY(-5em)'}}/>
  }, []);

  useEffect(() => {
    if (active >= 0 && lapped) {
      animate(navRef.current, {
        translateY: 0,
        duration: 600,
        delay: stagger(50),
        ease: 'outBack(2)'
      })
			if (!ballRef.current) return;
			animate(ballRef.current, {
				translateY: 0,
				duration: 600,
				ease: 'outBack(2)'
			})
      // localStorage.setItem('lapped', 'false');
    }
    if (!lapped && active === pages.length - 1) {
      setLapped(true);
      localStorage.setItem('lapped', 'true');
    }
  }, [active, lapped]);

  useEffect(() => {
    if (ready < 0) return;
    animate(ballRef.current!, {
      translateX: `${(ready) * 1.5}em`,
      ease: spring(1, 100, 11),
    })
  }, [ready]);

  return <>
    {buttonMemo}
    <div className='absolute top-[5svh] right-1/2 translate-x-1/2 max-w-[20000px] 
      w-max h-max z-[1000] mix-blend-difference'>
      {ballMemo}
      {navMemo}
    </div>
    {hasMouse && <div ref={flowerRef} className="absolute petal-container pointer-events-none select-none z-[1000]">
      <div className="w-full h-full relative -translate-x-1/2 -translate-y-1/2">
        <div ref={petalRef} className="rotate-full w-full h-full contracted">
          {
            Array.from({ length: petalCount }, (_, i) => <Petal index={i} key={i} active={active}/>)
          }
        </div>
      </div>
    </div>}
  </>
}

function Petal({ index, active }: { index: number, active: number }) {
  const petalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    petalRef.current!.innerText = '' + (active + 1);
  }, [active]);

  const petalMemo = useMemo(() => {
    return <div className="petal">
      <div ref={petalRef} className="petal-text" style={{ rotate: `${index * 360/petalCount}deg`}}>
        0
      </div>
    </div>
  }, []);

  return petalMemo;
}