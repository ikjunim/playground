import { useEffect, useMemo, useRef } from "react"
import MatterColor from "../Constants/MatterColor";
import signature from './Signature.webp';
import { indexOf } from "../Page/SquareUtility";
import { isMobileOnly, isSafari } from 'react-device-detect';

interface RevealPageProps {
  active: number;
  ready: number;
  pageNumber: number;
  immediateEffect: (indexes: number[], holes: number[]) => void;
}

export default function RevealPage({ active, ready, pageNumber, immediateEffect } : RevealPageProps) {
  const madeWithRef = useRef<HTMLDivElement>(null);
  const madeByRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<(SVGPathElement | null)[]>([]);
  const jawline = useMemo(() => {
    return <div className="jawline w-full h-full absolute top-0">
      <svg height="100svh" strokeMiterlimit="10" version="1.1" viewBox="0 0 841.995 595.35" width="max(100svw,40rem)" xmlns="http://www.w3.org/2000/svg" className="max-w-[20000px] absolute top-1/2 left-1/2 -translate-x-[max(50svw,20rem)] -translate-y-1/2">
        <g id="jawline-main-1" className="translate-x-[0.75%]">
          <path d="M155.429 608.277C155.159 610.911 155.882 603.856 156.007 602.631C156.489 597.926 157.745 593.088 158.224 588.404C159.593 575.033 163.271 561.871 166.074 548.89C169.83 531.499 178.016 515.106 181.594 497.609C186.252 474.828 194.284 443.729 210.903 426.821C246.237 390.872 339.258 396.196 354.502 346.814C361.901 322.848 334.167 295.369 328.093 274.124C321.387 250.667 316.478 229.849 314.174 205.756C312.792 191.313 322.837 175.931 329.483 163.963C347.298 131.882 365.516 111.543 404.307 107.832C421.445 106.193 439.773 111.514 454.918 116.189C508.469 132.721 503.351 141.653 519.073 185.617C528.761 212.708 521.68 266.84 512.365 290.14C508.785 299.094 498.263 355.694 492.096 359.403C480.679 366.269 465.293 357.166 452.961 353.79C438.42 349.81 437.269 346.608 413.938 343.045C380.625 337.958 385.097 286.249 380.623 255.16C379.564 247.809 377.401 233.829 372.404 227.693C369.319 223.904 369.246 222.491 364.401 219.952C351.998 213.455 341.266 223.172 342.004 234.85C342.867 248.514 350.557 267.107 361.449 275.258C366.815 279.274 378.443 276.938 381.65 282.271C390.411 296.837 381.322 320.27 395.595 333.449C407.572 344.507 436.906 348.064 452.6 352.909C459.075 354.908 450.719 385.656 455.918 390.455C465.822 399.6 473.444 398.616 489.696 407.129C510.911 418.243 512.614 416.794 536.098 423.222C543.637 425.286 553.616 427.964 559.755 433.632C568.716 441.906 571.008 457.395 574.431 468.606C580.57 488.712 580.57 511.256 587.999 531.783C591.867 542.47 592.464 550.549 596.465 561.127C601.637 574.801 603.535 591.793 606.749 606.182" 
          ref={el => mainRef.current.push(el)} className="jawline-main-1-animation" stroke={MatterColor.Red}/>
        </g>
        <g id="jawline-main-2" className="translate-x-[0.25%]">
          <path d="M155.429 608.277C155.159 610.911 155.882 603.856 156.007 602.631C156.489 597.926 157.745 593.088 158.224 588.404C159.593 575.033 163.271 561.871 166.074 548.89C169.83 531.499 178.016 515.106 181.594 497.609C186.252 474.828 194.284 443.729 210.903 426.821C246.237 390.872 339.258 396.196 354.502 346.814C361.901 322.848 334.167 295.369 328.093 274.124C321.387 250.667 316.478 229.849 314.174 205.756C312.792 191.313 322.837 175.931 329.483 163.963C347.298 131.882 365.516 111.543 404.307 107.832C421.445 106.193 439.773 111.514 454.918 116.189C508.469 132.721 503.351 141.653 519.073 185.617C528.761 212.708 521.68 266.84 512.365 290.14C508.785 299.094 498.263 355.694 492.096 359.403C480.679 366.269 465.293 357.166 452.961 353.79C438.42 349.81 437.269 346.608 413.938 343.045C380.625 337.958 385.097 286.249 380.623 255.16C379.564 247.809 377.401 233.829 372.404 227.693C369.319 223.904 369.246 222.491 364.401 219.952C351.998 213.455 341.266 223.172 342.004 234.85C342.867 248.514 350.557 267.107 361.449 275.258C366.815 279.274 378.443 276.938 381.65 282.271C390.411 296.837 381.322 320.27 395.595 333.449C407.572 344.507 436.906 348.064 452.6 352.909C459.075 354.908 450.719 385.656 455.918 390.455C465.822 399.6 473.444 398.616 489.696 407.129C510.911 418.243 512.614 416.794 536.098 423.222C543.637 425.286 553.616 427.964 559.755 433.632C568.716 441.906 571.008 457.395 574.431 468.606C580.57 488.712 580.57 511.256 587.999 531.783C591.867 542.47 592.464 550.549 596.465 561.127C601.637 574.801 603.535 591.793 606.749 606.182" 
          ref={el => mainRef.current.push(el)} className="jawline-main-2-animation" stroke={MatterColor.Yellow}/>
        </g>
        <g id="jawline-main-3" className="translate-x-[-0.25%]">
          <path d="M155.429 608.277C155.159 610.911 155.882 603.856 156.007 602.631C156.489 597.926 157.745 593.088 158.224 588.404C159.593 575.033 163.271 561.871 166.074 548.89C169.83 531.499 178.016 515.106 181.594 497.609C186.252 474.828 194.284 443.729 210.903 426.821C246.237 390.872 339.258 396.196 354.502 346.814C361.901 322.848 334.167 295.369 328.093 274.124C321.387 250.667 316.478 229.849 314.174 205.756C312.792 191.313 322.837 175.931 329.483 163.963C347.298 131.882 365.516 111.543 404.307 107.832C421.445 106.193 439.773 111.514 454.918 116.189C508.469 132.721 503.351 141.653 519.073 185.617C528.761 212.708 521.68 266.84 512.365 290.14C508.785 299.094 498.263 355.694 492.096 359.403C480.679 366.269 465.293 357.166 452.961 353.79C438.42 349.81 437.269 346.608 413.938 343.045C380.625 337.958 385.097 286.249 380.623 255.16C379.564 247.809 377.401 233.829 372.404 227.693C369.319 223.904 369.246 222.491 364.401 219.952C351.998 213.455 341.266 223.172 342.004 234.85C342.867 248.514 350.557 267.107 361.449 275.258C366.815 279.274 378.443 276.938 381.65 282.271C390.411 296.837 381.322 320.27 395.595 333.449C407.572 344.507 436.906 348.064 452.6 352.909C459.075 354.908 450.719 385.656 455.918 390.455C465.822 399.6 473.444 398.616 489.696 407.129C510.911 418.243 512.614 416.794 536.098 423.222C543.637 425.286 553.616 427.964 559.755 433.632C568.716 441.906 571.008 457.395 574.431 468.606C580.57 488.712 580.57 511.256 587.999 531.783C591.867 542.47 592.464 550.549 596.465 561.127C601.637 574.801 603.535 591.793 606.749 606.182" 
          ref={el => mainRef.current.push(el)} className="jawline-main-3-animation" stroke={MatterColor.Green}/>
        </g>
        <g id="jawline-main-4" className="translate-x-[-0.75%]">
          <path d="M155.429 608.277C155.159 610.911 155.882 603.856 156.007 602.631C156.489 597.926 157.745 593.088 158.224 588.404C159.593 575.033 163.271 561.871 166.074 548.89C169.83 531.499 178.016 515.106 181.594 497.609C186.252 474.828 194.284 443.729 210.903 426.821C246.237 390.872 339.258 396.196 354.502 346.814C361.901 322.848 334.167 295.369 328.093 274.124C321.387 250.667 316.478 229.849 314.174 205.756C312.792 191.313 322.837 175.931 329.483 163.963C347.298 131.882 365.516 111.543 404.307 107.832C421.445 106.193 439.773 111.514 454.918 116.189C508.469 132.721 503.351 141.653 519.073 185.617C528.761 212.708 521.68 266.84 512.365 290.14C508.785 299.094 498.263 355.694 492.096 359.403C480.679 366.269 465.293 357.166 452.961 353.79C438.42 349.81 437.269 346.608 413.938 343.045C380.625 337.958 385.097 286.249 380.623 255.16C379.564 247.809 377.401 233.829 372.404 227.693C369.319 223.904 369.246 222.491 364.401 219.952C351.998 213.455 341.266 223.172 342.004 234.85C342.867 248.514 350.557 267.107 361.449 275.258C366.815 279.274 378.443 276.938 381.65 282.271C390.411 296.837 381.322 320.27 395.595 333.449C407.572 344.507 436.906 348.064 452.6 352.909C459.075 354.908 450.719 385.656 455.918 390.455C465.822 399.6 473.444 398.616 489.696 407.129C510.911 418.243 512.614 416.794 536.098 423.222C543.637 425.286 553.616 427.964 559.755 433.632C568.716 441.906 571.008 457.395 574.431 468.606C580.57 488.712 580.57 511.256 587.999 531.783C591.867 542.47 592.464 550.549 596.465 561.127C601.637 574.801 603.535 591.793 606.749 606.182" 
          ref={el => mainRef.current.push(el)} className="jawline-main-4-animation" stroke={MatterColor.Blue}/>
        </g>
        <g id="jawline-glasses">
          <path d="M368.669 223.228C365.602 222.517 374.939 222.366 377.934 221.398C384.571 219.253 390.69 219.402 397.464 218.19C412.935 215.421 430.086 212.338 445.786 212.816C448.04 212.884 459.241 212.649 460.535 214.024C461.22 214.752 460.13 220.078 460.189 221.238C460.869 234.697 457.686 265.645 479.139 266.298C496.315 266.82 492.205 240.745 495.998 238.38C497.241 237.604 500.752 239.652 501.984 240.209C508.054 242.958 504.037 254.648 503.885 259.657C503.687 266.154 507.953 272.799 511.145 277.917C512.892 280.718 514.751 289.842 520.738 286.108C533.417 278.202 529.762 250.619 520.444 241.615C512.516 233.956 510.248 243.868 505.045 245.118C504.951 245.141 503.528 241.113 502.984 240.662C500.306 238.445 496.878 239.557 494.901 238.346C494.544 238.127 494.747 236.452 494.758 236.103C494.937 230.218 491.74 223.784 488.772 219.023C481.041 206.626 463.755 210.577 452.063 213.387" 
          className="jawline-glasses" stroke={MatterColor.Yellow}/>
        </g>
        <g id="jawline-rest">
          <path d="M494.633 240.45C488.796 252.123 514.037 268.381 512.277 278.945C511.394 284.24 503.24 284.139 501.419 288.692C500.664 290.58 501.572 300.723 500.802 301.031C498.18 302.08 481.702 307.202 481.184 309.791C480.657 312.428 502.491 310.957 504.627 321.636C505.483 325.916 480.275 317.421 481.307 312.259C483.147 303.063 513.652 328.467 504.997 306.83C503.946 304.203 500.833 302.729 499.938 300.044" 
          className="jawline-rest" stroke={MatterColor.Yellow}/>
        </g>
      </svg>
    </div>
  }, []);

  const endingCredits = useMemo(() => {
    return <>
      <div className="w-full h-full absolute top-0 flex justify-center items-center">
        <img className="relative w-[min(100%,70rem)] opacity-30" src={signature}/>
      </div>
      <div className="w-full h-full flex relative justify-center items-center font-mono text-white text-text">
        <div className="w-full h-[20%] flex justify-evenly items-start">
          <div ref={madeWithRef} className="text-left flex flex-col">
            <span className="text-headingHalf">Made with</span>
            <span>React</span>
            <span>Anime.js</span>
            <span>Three.js</span>
            <span>Matter.js</span>
            <span>PixiJS</span>
          </div>
          <div ref={madeByRef} className="text-right flex flex-col">
            <span className="text-headingHalf">Made By</span>
            <span>ikjun im</span>
            <span>playground</span>
            <span>no socials</span>
            <span>based in Sydney</span>
            <span>ikjunim@gmail.com</span>
          </div>
        </div>
      </div>
    </>
  }, []);

  const noteMemo = useMemo(() => {
    if (isMobileOnly || isSafari) return null;
    return <div className="absolute top-0 w-full h-full flex justify-start items-end font-mono text-white text-tiny">
      <div className="w-max h-max">
        would you believe me <br/>
        if i told you that <br/>
        this is my second website <br/>
        that i've ever made?
      </div>
    </div>
  }, []);

  useEffect(() => {
    if (active === pageNumber) {
      if (!madeWithRef.current || !madeByRef.current || isMobileOnly || isSafari) return;
      const madeWithRect = madeWithRef.current.getBoundingClientRect();
      const madeByRect = madeByRef.current.getBoundingClientRect();

      immediateEffect([
        indexOf(madeWithRect.left + madeWithRect.width / 2, madeWithRect.top + madeWithRect.height / 2),
        indexOf(window.innerWidth / 2, window.innerHeight / 2),
        indexOf(madeByRect.left + madeByRect.width / 2, madeByRect.top + madeByRect.height / 2)
      ], [3, 7, 3])
    } else {
    }
  }, [active]);

  return <div className={`w-svw h-svh absolute top-0 overflow-hidden no-select bg-black ${(isMobileOnly || isSafari) && (ready === pageNumber || active === pageNumber) ? '' : (active === pageNumber ? '' : 'hidden')}`}>
    {jawline}
    {endingCredits}
    {noteMemo}
  </div>
}