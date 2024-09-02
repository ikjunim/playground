import { useEffect, useRef } from "react";
import { useSpawn } from "./BalloonPage";
import { animate, stagger } from "@juliangarnierorg/anime-beta";

const introLines = [
  "im an extrovert but i dont",
  "get invited to parties",
  "so i made my own"
]

const maxCount = 8;

export default function BrickField({ show }: { show: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<(HTMLSpanElement | null)[]>([]);

  const setText = useSpawn();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim().length != 0) {
      e.preventDefault();
      const value = inputRef.current.value.trim();
      inputRef.current.value = '';
      setText(prev => {
        if (prev && prev.length >= maxCount) {
          prev.shift();
        }
        return [...prev, value]
      })
    }
  }

  useEffect(() => {
    if (!show) return;
    animate(textRef.current, {
      opacity: [
        { to: 1, duration: 0 },
      ],
      backgroundColor: [
        { to: 'black' },
        { to: 'transparent' }
      ],
      duration: 200,
      delay: stagger(80)
    })
  }, [show]);

  return <div className="w-full h-full absolute top-0 text-black p-[2svw] flex flex-col justify-start items-start text-headingHalf">
    <div className="text-heading z-50">
      <div className="bg-transparent text-transparent pointer-events-none w-fit h-fit relative">
        1234567890
        <input ref={inputRef} className="absolute top-0 left-0 border-none outline-none bg-transparent pointer-events-auto select-auto
          text-black w-full h-full"
          placeholder="type here"
          maxLength={10}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
    {
      introLines.map((line, i) => {
        return <div key={i} className="flex text-text">
          {
            line.split('').map((char, j) => {
              return <span key={j} ref={el => textRef.current.push(el)} style={{ opacity: 0, backgroundColor: 'black' }}>
                {char === ' ' ? '\u00A0' : char}
              </span> 
            })
          }
        </div>
      })
    }
  </div>
}