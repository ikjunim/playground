import { usePage } from '../Page/PageContext';
import useState from 'react-usestateref';
import { useEffect, useRef } from "react";
import { useMatterContext } from "./MatterContext";
import { textWidth, hasMouseSupport } from "../Utility";
import { animate, stagger } from '@juliangarnierorg/anime-beta';

let letterIndex = 0, letterSize = 0, letterPosition = { x: 0, y: 0 };

let delayDuration = 500;
let showDuration = 1000;

export default function IdeaField({ pageNumber }: { pageNumber: number }) {
  //@ts-ignore
  const [once, setOnce, onceRef] = useState(false);
  const [text, setText, textRef] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const turnRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const magicRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const fieldContainerRef = useRef<HTMLDivElement>(null);

  const { active } = usePage();
  const { cloud, foundry } = useMatterContext();
  
  const handleResize = () => {
    if (!textContainerRef.current) return;
    letterSize = textWidth('a', getComputedStyle(textContainerRef.current).font);
    const rect = fieldContainerRef.current?.getBoundingClientRect();
    if (!rect) letterPosition = { x: 0, y: 0 };
    else {
      letterPosition = {
        x: rect.left - letterSize,
        y: rect.top + rect.height/2
    }}
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current && inputRef.current.value.length != 0) {
      e.preventDefault();
      setText(inputRef.current.value);
      inputRef.current.value = '';
      inputRef.current.placeholder = '';
      inputRef.current.style.pointerEvents = 'none';
      inputRef.current.blur();
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLetterComplete = () => {
    if (!inputRef.current) return;
    inputRef.current.placeholder = 'Type something';
    inputRef.current.style.pointerEvents = 'auto';
    if (hasMouseSupport()) inputRef.current.focus();
    setText('');  
  }

  useEffect(() => {
    if (!text || !textContainerRef.current) return;
    letterIndex = 0;
    textContainerRef.current.querySelectorAll('span').forEach((span, i) => {
      animate(span, {
        x: '-100svw',
        duration: 150,
        delay: 100*i,
        ease: 'in',
        onComplete: () => {
          foundry.printf(text[letterIndex], letterPosition.x, letterPosition.y, letterSize);
          if (++letterIndex >= text.length) handleLetterComplete();
        }
      })
    });
  }, [text]);

  useEffect(() => {
    if (active === pageNumber) {
      if (!onceRef.current) {
        setOnce(true);
        if (!inputRef.current || !turnRef.current || !fieldRef.current || !stickRef.current) return;
        inputRef.current.value = 'into reality';
        inputRef.current.style.pointerEvents = 'none';

        animate(turnRef.current, {
          translateX: { from: '100%', to: '0%' },
          duration: showDuration, 
          delay: delayDuration + showDuration,
        })

        animate(fieldRef.current, {
          translateX: { from: '-100%', to: '0%' },
          duration: showDuration, 
          delay: delayDuration + showDuration*0.7,
        });

        animate(stickRef.current, {
          height: { from: '0%', to: '100%' }, 
          duration: showDuration, 
          delay: delayDuration,
        });

        setTimeout(() => cloud.explodeAtCenter(), delayDuration + showDuration);
        setTimeout(() => {
          handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any);
          if (!magicRef.current) return;
          animate(magicRef.current.querySelectorAll('span'), {
            translateX: 0,
            duration: showDuration,
            delay: stagger(showDuration*1.5, {
              start: 2000
            }),
          })
        }, delayDuration + showDuration + 1000);
      }
    } else {

    }
  }, [active]);

  return <div className="absolute w-svw h-svh z-50 pointer-events-none">
    <div className="overflow-hidden absolute top-1/2 translate-y-[-50%] w-full text-white text-idea font-serif flex flex-col justify-center items-center select-none">
      <div className="overflow-hidden w-1/2 translate-x-[calc(-50%-min(0.5svw,0.2rem))] flex justify-end">
        <div>
          <div ref={turnRef} style={{ transform: 'translateX(100%)' }}>
            Turn your ideas
          </div>
        </div>
      </div>
      <div ref={fieldContainerRef} className="overflow-hidden w-1/2 translate-x-[calc(50%+min(0.5svw,0.2rem))] flex justify-start">
        <div ref={fieldRef} style={{ transform: 'translateX(-100%)' }}>
          <input className="border-none outline-none bg-transparent overflow-hidden pointer-events-auto select-auto"
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder="Type something"
            maxLength={30}
          />
        </div>
        <div ref={textContainerRef} className="absolute overflow-hidden top-0 pointer-events-none select-none w-full h-full flex">
          {textRef.current.split('').map((char, i) => {
            return <span key={i}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          })}
        </div>
      </div>
      <div ref={stickRef} className="absolute inset-0 m-auto bg-transparent w-[min(0.5svw,0.2rem)] flex flex-col"  style={{ height: '0%' }}>
        <div className="bg-white w-full flex-1"></div>
        <div className="bg-white w-full flex-1"></div>
      </div>
    </div>
    <div className='text-white font-mono text-ideaHalf w-full h-full flex justify-center items-center pointer-events-none -translate-x-[30%] translate-y-[15%]'>
      <div ref={magicRef} className='overflow-hidden flex flex-col'>
        <span className='flex' style={{ transform: 'translateX(-100%)' }}>This is all magic<svg className="inline-svg fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M31 0H15v2h13.59L.29 30.29 1.7 31.7 30 3.41V16h2V1a1 1 0 0 0-1-1z" data-name="5-Arrow Up"/></svg></span>
        <span style={{ transform: 'translateX(-100%)' }}>No seriously,</span>
        <span style={{ transform: 'translateX(-100%)' }}>Try dragging the letters</span>
      </div>
    </div>
  </div>
}