import { useEffect, useRef } from "react";
import { useSpawn } from "./BalloonPage";
import { animate, stagger } from "@juliangarnierorg/anime-beta";
import { isMobileOnly, isSafari } from "react-device-detect";

const introLines = [
  'Pop and drag the balloons!',
  "To my students:",
  "Sorry for graduating early :(",
  "I really enjoyed teaching you all",
  "And hope you get the ATAR you deserve.",
  "From your maths teacher, Ikjun.",
]

// const maxCount = 16;
const maxCount = isMobileOnly || isSafari ? 6 : 14;

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
      delay: stagger(50)
    })
  }, [show]);

  return <div className="w-full h-full absolute top-0 text-black pl-[2svw] pt-[8svh] pb-[2svw] flex flex-col justify-start items-start">
    <div className="text-heading z-50">
      <div className="bg-transparent text-transparent pointer-events-none w-fit h-fit relative">
        1234567890
        <input ref={inputRef} className="absolute top-0 left-0 border-none outline-none bg-transparent pointer-events-auto select-auto
          text-black w-full h-full text-heading"
          placeholder="type here"
          maxLength={10}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
		<div className="text-text">
			{introLines[0].split('').map((char, j) => {
				return <span key={j} ref={el => textRef.current.push(el)} style={{ opacity: 0, backgroundColor: 'black' }}>
					{char === ' ' ? '\u00A0' : char}
				</span>
			})}
		</div>
		<div className="grow flex flex-col justify-end">
			<div className="flex flex-col">
				{
					introLines.map((line, i) => {
						if (i == 0) return <></>
						return <div key={i} className="text-text">
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
		</div>
  </div>
}