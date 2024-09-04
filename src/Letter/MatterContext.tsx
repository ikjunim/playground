import { createContext, useContext, useEffect } from "react";
import Cloud from "../Matter/Cloud";
import Foundry from "../Matter/Foundry";
import MatterInstance from "../Matter/MatterInstance";
import Matter from "matter-js";
//@ts-ignore
import MatterWrap from "matter-wrap";
//@ts-ignore
import decomp from "poly-decomp";
import MatterCategory from "../Constants/MatterCategory";

const MatterContext = createContext<{
  cloud: Cloud;
  foundry: Foundry;
  instance: MatterInstance;
} | null>(null);

export const useMatterContext = () => {
  const context = useContext(MatterContext);
  if (!context) throw new Error('useMatterContext must be used within a MatterContextProvider');
  return context;
}

interface MatterContextProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  active: number;
  ready: number;
  pageNumber: number;
}

let instance: MatterInstance;
let cloud: Cloud;
let foundry: Foundry;
let mousePosition = { x: 0, y: 0 };

export default function MatterContextProvider({ children, containerRef, active, ready, pageNumber }: MatterContextProps) {
  const handleResize = () => {
    if (instance) instance.resize();
    if (cloud) cloud.repositionWalls();
		if (foundry) foundry.updateWrap();
  };

  const handleMouseMove = (event: MouseEvent) => {
    mousePosition = { x: event.clientX, y: event.clientY };
  };

  useEffect(() => {
    Matter.use(MatterWrap);
    Matter.Common.setDecomp(decomp);

    if (!containerRef.current) return;
    if (!instance) {
      instance = new MatterInstance(containerRef.current, {
        category: MatterCategory.Character,
        mask: MatterCategory.Character,
      });
    }
    if (!foundry) foundry = new Foundry(instance);
    if (!cloud) cloud = new Cloud(instance);

    if (!containerRef.current) return;

    instance.resize();
    cloud.spawnWalls();
    cloud.repositionWalls();

    Matter.Events.on(instance.engine, 'beforeUpdate', () => {
      cloud!.applyForce(mousePosition.x, mousePosition.y);
    });

		const mc = instance.mouse();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    Matter.Events.on(mc, 'mousedown', () => {
      document.getElementById('idea-field')?.blur();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (instance) instance.clear();
    }
  }, []);

  useEffect(() => {
    if (active === pageNumber) {
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

  return <MatterContext.Provider value={{ instance: instance, cloud: cloud, foundry: foundry }}>
    {children}
  </MatterContext.Provider>
}