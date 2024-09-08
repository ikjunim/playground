//@ts-nocheck
import { usePage } from "../Page/PageContext";
import { useEffect, useMemo, useRef } from "react";
import useState from "react-usestateref";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Text } from "troika-three-text";
import MatterColor from "../Constants/MatterColor";
import MatterTone from "../Constants/MatterTone";
import { title, sub } from './text';
import { umod, distribute, hasMouse } from "../Utility";
import * as THREE from 'three';
import { SamplePoints } from "./points";
import PageInterface from "../Page/PageInterface";
import { animate } from "@juliangarnierorg/anime-beta";
import { pageOrder } from "../Page/PageInfo";

extend({ Text });

const colorOrder = [MatterTone.WhiteRGB, MatterColor.RedRGB, MatterColor.YellowRGB, MatterColor.GreenRGB, MatterColor.BlueRGB];
const TAU = Math.PI * 2;
const pointCount = 200;
const count = title.length;

let wheelAnimating = false, direction = "";

let mousePosition = { x: 0, y: 0 };

export default function ThreePage({ containerRef, pageNumber }: PageInterface) {
  const { active, ready } = usePage();
  const buttonRefs = useRef<any[]>([]);
  const [index, setIndex, indexRef] = useState(0);

  useEffect(() => {
    containerRef.current.querySelectorAll('div').forEach(d => {
      d.style.pointerEvents = 'none'
      d.style.backgroundColor = 'transparent';
    });
    buttonRefs.current.forEach(b => b.style.pointerEvents = 'auto');
  }, []);

  useEffect(() => {
    if (active === pageNumber) {
    } else {
      containerRef.current!.classList.remove('show');
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) containerRef.current!.classList.add('show');
  }, [ready]);

  const handleClick = (dir: "up" | "down") => {
    if (wheelAnimating) return;
    wheelAnimating = true;
    direction = dir;
    setIndex(umod(index + (dir === "up" ? 1 : -1), count));
  }

  return <div className="w-full h-full">
    <Canvas camera={{position: [0, 0, 200]}} dpr={window.devicePixelRatio}>
      <Responsive/>
      <TextWheel index={index} active={active} ready={ready} pageNumber={pageNumber} />
      <Cloud index={index} active={active} ready={ready} pageNumber={pageNumber} />
      <Background index={index} active={active} ready={ready} pageNumber={pageNumber} />
    </Canvas>
    <div ref={el => buttonRefs.current.push(el)} className="three-arrow-container left-0" onClick={() => handleClick("up")}>
      <div className="three-arrow three-arrow-left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path className="fill-white" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg>
      </div>
    </div>
    <div ref={el => buttonRefs.current.push(el)} className="three-arrow-container right-0" onClick={() => handleClick("down")}>
      <div className="three-arrow three-arrow-right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path className="fill-white" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" data-name="Right"/></svg>
      </div>
    </div>
  </div>
}

const wheelRadius = 70, wheelTilt = Math.PI/80, wheelDuration = 1000;
const subYOffset = 10;
const angleStart = -2*Math.PI/(count - 1), angleIncrement = 2*Math.PI/count;
function TextWheel({ index, active, ready, pageNumber }: { index: number, active: number, ready: number, pageNumber: number }) {
  const topRef = useRef();
  const mainRef = useRef();
  const subRef = useRef();
  
  useEffect(() => {
    if (!direction) return;
    const angle = direction === "up" ? `+=${angleIncrement}` : `-=${angleIncrement}`;
    animate(mainRef.current.rotation, {
      y: angle,
      ease: 'outElastic(1, .6)',
      duration: wheelDuration,
      onComplete: () => { mainRef.current.rotation.y %= TAU; }
    })
    animate(subRef.current.rotation, {
      y: angle,
      ease: 'outElastic(1, .6)',
      duration: wheelDuration,
      onComplete: () => { wheelAnimating = false; subRef.current.rotation.y %= TAU; }
    })
  }, [index]);

  const topWheel = useMemo(() => {
    return <group ref={mainRef} rotation={[0, angleStart, 0]}>
      {
        Array.from({ length: count }, (_, i) => {
          return <text
            key={i}
            {...title[i]}
            anchorX="center"
            anchorY="middle"
            position-z={Math.sin(i/count * Math.PI * 2) * wheelRadius}
            position-x={Math.cos(i/count * Math.PI * 2) * wheelRadius}
            rotation-y={-i*Math.PI*2/count + Math.PI/2}
          />
        })
      }
    </group>
  }, []);

  const subWheel = useMemo(() => {
    return <group ref={subRef} position={[0, -subYOffset, 0]} rotation={[0, angleStart, 0]}>
      {
        Array.from({ length: count }, (_, i) => {
          return <text
            key={i}
            {...sub[i]}
            anchorX="center"
            anchorY="middle"
            position-z={Math.sin(i/count * Math.PI * 2) * wheelRadius}
            position-x={Math.cos(i/count * Math.PI * 2) * wheelRadius}
            rotation-y={-i*Math.PI*2/count + Math.PI/2}
          />
        })
      }
    </group>
  }, []);

  const idleAnimation = useMemo(() => {
    if (!topRef.current) return null;
    return animate(topRef.current.rotation, {
      z: [-wheelTilt, wheelTilt],
      easing: 'easeOutQuad',
      duration: 10000,
      loop: true,
      alternate: true,
      autoplay: false,
    })
  }, [topRef.current])

  useEffect(() => {
    if (!idleAnimation) return;
    if (ready === pageNumber || active === pageNumber) idleAnimation.play();
    else idleAnimation.pause();
  }, [ready, active]);

  return <group ref={topRef}>
    {topWheel}
    {subWheel}
  </group>
}

const particleRadius = 1, particleWidth = 30;
const sphereRadius = 50;
const headRadius = 1  ;
const points = Array.from({ length: count }, () => null);

function Cloud({ index, active, ready, pageNumber }: { index: number, active: number, ready: number, pageNumber: number }) {
  const [loaded, setLoaded, loadedRef] = useState(false);
  const particleRefs = useRef([]);
  const cloudRef = useRef();

  useEffect(() => {
    points[0] = Array.from({ length: pointCount }, (_, i) => {
      const a = Math.random() * 2 - 1;
      const b = Math.random() * 2 - 1;
      const c = Math.random() * 2 - 1;
      const mag = Math.sqrt(a*a + b*b + c*c);
      return [sphereRadius* a/mag, sphereRadius * b/mag, sphereRadius * c/mag];
    });
    
    SamplePoints('/Model/star.obj', distribute(pointCount, 
      [100]
    ), points, 1, {
      scale: 40,
      translation: [0, -35, 0]
    });

    SamplePoints('/Model/wizard hat.obj', distribute(pointCount, 
      [100]
    ), points, 2, {
      scale: 20,
      translation: [10, -40, 0]
    });

    SamplePoints('/Model/easel.obj', distribute(pointCount, 
      [50, 50]
    ), points, 3, {
      scale: 15,
      translation: [0, 0, 0]
    });

    SamplePoints('/Model/cat.obj', distribute(pointCount, 
      [50, 10, 10, 30]
    ), points, 4, {
      scale: 15,
      translation: [0, -20, -20]
    });

    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    particleRefs.current.forEach((p, i) => {
      if (!p) return;
      animate(p.position, {
        x: points[index][i][0],
        y: points[index][i][1],
        z: points[index][i][2],
        ease: 'outElastic(1, .6)',
        duration: wheelDuration
      })
      animate(p.material.color, {
        r: colorOrder[index].r,
        g: colorOrder[index].g,
        b: colorOrder[index].b,
        ease: 'outElastic(1, .6)',
        duration: wheelDuration
      })
    })
  }, [index])

  const particles = useMemo(() => {
    if (!loadedRef.current) return <group ref={cloudRef}/>;
    const res = <group ref={cloudRef}>
      {
        Array.from({ length: pointCount }, (_, i) => {
          return <lineSegments
            key={i}
            ref={el => particleRefs.current.push(el)}
            position={points[index] ? points[index][i] : [0, 0, 0]}
            rotation={[Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2]}
          >
            <edgesGeometry args={[new THREE.TetrahedronGeometry(particleRadius)]} />
            <lineBasicMaterial color={colorOrder[index]} linewidth={particleWidth} />
          </lineSegments>
        })
      }
    </group>

    return res;
  }, [loadedRef.current]);

  const idleAnimation = useMemo(() => {
    if (!cloudRef.current) return null;
    return animate(cloudRef.current.rotation, {
      y: Math.PI*2,
      ease: 'linear',
      duration: 20000,
      loop: true,
      autoplay: false,
    })
  }, [cloudRef.current]);

  useEffect(() => {
    if (!idleAnimation) return;
    if (ready === pageNumber || active === pageNumber) idleAnimation.play();
    else idleAnimation.pause();
  }, [ready]);

  return particles;
}

const backRadius = [0.5, 1.5], backCount = 100, cameraMovement = 2;
const back = 3;
const backBounding = {
  x: [-wheelRadius*back, wheelRadius*back],
  y: [-wheelRadius*back, wheelRadius*back],
  z: [-80, 0]
}
function Background({ index, active, ready, pageNumber }: { index: number, active: number, ready: number, pageNumber: number }) {
  const backRefs = useRef([]);
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (hasMouse) {
    useFrame(() => {
      if (ready !== pageNumber && active !== pageNumber) return;
      camera.position.x = -mousePosition.x * cameraMovement;
      camera.position.y = -mousePosition.y * cameraMovement;
    })
  }

  useEffect(() => {
    backRefs.current.forEach((p, i) => {
      animate(p.material.color, {
        r: colorOrder[index].r,
        g: colorOrder[index].g,
        b: colorOrder[index].b,
        easing: 'easeOutElastic(1, .6)',
        duration: wheelDuration
      })
    })
  }, [index]);

  const background = useMemo(() => {
    return <group>
      {
        Array.from({ length: backCount }, (_, i) => {
          const color = MatterTone.White;
          return <lineSegments
            key={i}
            ref={el => backRefs.current.push(el)}
            position={[Math.random() * (backBounding.x[1] - backBounding.x[0]) + backBounding.x[0], Math.random() * (backBounding.y[1] - backBounding.y[0]) + backBounding.y[0], Math.random() * (backBounding.z[1] - backBounding.z[0]) + backBounding.z[0]]}
            rotation={[Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2]}
          >
            <edgesGeometry args={[new THREE.TetrahedronGeometry(particleRadius)]} />
            <lineBasicMaterial color={color} linewidth={particleWidth} />
          </lineSegments>
        })
      }
    </group>
  }, []);

  return background;
}

function Responsive() {
  useThree(({ camera }) => {
    camera.position.z = 4000/Math.min(Math.sqrt(window.innerWidth) + 5, 40);
  });

  return <></>;
}