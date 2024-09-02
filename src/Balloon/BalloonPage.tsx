import { createContext, useEffect, useMemo, useRef, useContext } from "react"
import { animate, stagger } from "@juliangarnierorg/anime-beta";
import { usePage } from "../Page/PageContext";
import MatterInstance from "../Matter/MatterInstance";
import Party from "../Matter/Party";
import Matter from "matter-js";
import MatterCategory from "../Constants/MatterCategory";
import useState from "react-usestateref";
import BrickField from "./BrickField";
import { Brick } from "../Matter/Party";
import { randomInt, randomFloat } from "../Utility";
import PageInterface from "../Page/PageInterface";

const spikeCount = 100;

const randomBalloonCount = () => {
  // return randomInt(5, 5);
  return 5;
}

const randomTop = () => {
  return (randomFloat(0, 10) + 130) + "%";
}

const randomLeft = () => {
  return (randomFloat(0, 70) + 10) + "%";
}

let instance: MatterInstance;
let party: Party;
let clickedId = -1, clickedPosition = { x: 0, y: 0 };

//@ts-ignore
const SpawnContext = createContext<React.Dispatch<React.SetStateAction<string[]>>>(null);
export const useSpawn = () => useContext(SpawnContext);

export default function BalloonPage({ containerRef, pageNumber }: PageInterface) {
  const { active, ready } = usePage();
  //@ts-ignore
  const [once, setOnce, onceRef] = useState(false);
  const [show, setShow] = useState(false);
  const boxContainerRef = useRef<HTMLDivElement>(null);
  const matterRef = useRef<HTMLDivElement>(null);
  const spikeRef = useRef<HTMLDivElement>(null);
  const [text, setText, textRef] = useState(['pop', 'and', 'drag', 'the', 'balloons']);
  const [boxel, setBoxel, boxelRef] = useState<(JSX.Element | null)[]>([]);
  const divelRef = useRef<(HTMLDivElement | null)[]>([]);
  const brickRef = useRef<(Brick | null)[]>([]);
  const [spawn, setSpawn, spawnRef] = useState(false);

  const handleResize = () => {
    if (instance) instance.resize();
    if (party) party.resize();
  }

  useEffect(() => {
    if (!matterRef.current) return;

    if (!instance) {
      instance = new MatterInstance(matterRef.current, {
        category: MatterCategory.Balloon,
        mask: MatterCategory.Balloon,
        fast: true
      });
    }
    if (!party) party = new Party(instance, spikeRef.current!);
    party.spawnWalls();

    handleResize();
    window.addEventListener('resize', handleResize);

    Matter.Events.on(instance.engine, 'beforeUpdate', (t) => {
      Object.entries(party.bricks).forEach(([_, brick]) => {
        brick.box.style.top = `${brick.body.position.y - brick.height/2}px`;
        brick.box.style.left = `${brick.body.position.x - brick.width/2}px`;
        brick.box.style.rotate = `${brick.body.angle}rad`;
        brick.down(t.timestamp);
      });
      Object.entries(party.balloons).forEach(([_, balloon]) => {
        balloon.up();
      });
    });

    Matter.Events.on(instance.engine, 'collisionStart', (e) => {
      const pairs = e.pairs;
      for(let i = 0; i < pairs.length; i++) {
        if (pairs[i].bodyA.id === party.spikeId) party.despawnBalloon(pairs[i].bodyB.id);
        else if (pairs[i].bodyB.id === party.spikeId) party.despawnBalloon(pairs[i].bodyA.id);
      }
    })

    Matter.Events.on(instance.engine, 'collisionActive', (e) => {
      const pairs = e.pairs;
      for(let i = 0; i < pairs.length; i++) {
        if (pairs[i].bodyA.id === party.trampolineId) party.bounceBrick(pairs[i].bodyB.id);
        else if (pairs[i].bodyB.id === party.trampolineId) party.bounceBrick(pairs[i].bodyA.id);
      }
    })  

    Matter.Events.on(instance.mouseConstraint, 'mousedown', (e) => {
      if (instance.mouseConstraint.body) {
        clickedId = instance.mouseConstraint.body.id;
        clickedPosition = { x: e.mouse.position.x, y: e.mouse.position.y };
      } else clickedId = -1;
    });

    Matter.Events.on(instance.mouseConstraint, 'mouseup', (e) => {
      if (clickedId != -1 && Math.abs(e.mouse.position.x - clickedPosition.x) < 20 && Math.abs(e.mouse.position.y - clickedPosition.y) < 20) {
        party.despawnBalloon(clickedId);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (active === pageNumber) {
      if (!onceRef.current) {
        setOnce(true);

        setTimeout(() => {
          setSpawn(true);
        }, 1000);
        
        if (!spikeRef.current) return;
        animate(spikeRef.current.querySelectorAll('div'), {
          top: 0,
          duration: 1000,
          delay: stagger(40)
        })

        setShow(true);
      }
    } else {
      containerRef.current!.classList.remove('show');
      instance.stop();
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) {
      containerRef.current!.classList.add('show');
      instance.run();
    }
  }, [ready]);

  useEffect(() => {
    if (!spawnRef.current) return;
    setBoxel(prev => {
      if (prev.length === textRef.current.length) {
        prev.shift();
        divelRef.current.shift();
        party.despawnBrick(brickRef.current[0]!.body.id);
        brickRef.current.shift();
      }

      const res: (JSX.Element | null)[] = [...prev];
      textRef.current.forEach((text, i) => {
        if (i < res.length) return;
        res.push(<div
          key={crypto.randomUUID()}
          className="party-brick text-headingHalf"
          ref={el => divelRef.current.push(el)}
          style={{
            top: randomTop(),
            left: randomLeft()
          }}
        >
          {text}
        </div>)
      });

      return res;
    })
  }, [spawn, text]);

  useEffect(() => {
    if (!party || divelRef.current.length <= 0) return;
    divelRef.current = divelRef.current.filter(el => el !== null);
    boxelRef.current.forEach((b, i) => {
      if (!b || i < brickRef.current.length) return;
      const brick = party.spawnBrick(divelRef.current[i]!);
      brickRef.current.push(brick);
      party.spawnBalloon(brick, randomBalloonCount());
    })
  }, [boxel])

  const spikeMemo = useMemo(() => {
   return <div ref={spikeRef} className="w-full h-fit absolute top-0 flex flex-nowrap overflow-hidden">
    {
      Array.from({ length: spikeCount }, (_, i) => {
        return <div key={i} className="triangle-down relative" style={{ top: '-2rem' }}/>
      })
    }
   </div>
  }, []);

  const fieldMemo = useMemo(() => <BrickField show={once}/>, [once]);

  return <div className="w-full h-full">
    <div ref={boxContainerRef} className="absolute top-0 w-full h-full z-10">
      {spikeMemo}
      {boxel}
    </div>
    <SpawnContext.Provider value={ setText }>
      {show && fieldMemo}
    </SpawnContext.Provider>
    <div ref={matterRef} className="absolute top-0 w-full h-full pointer-events-auto"/>
  </div>
}