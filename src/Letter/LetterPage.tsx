import { useRef, useEffect } from "react";
import useState from 'react-usestateref';
import { usePage } from "../Page/PageContext";
import MatterContextProvider from "./MatterContext";
import IdeaField from "./IdeaField";
import PageInterface from "../Page/PageInterface";

export default function LetterPage({ containerRef, pageNumber }: PageInterface) {
  const matterContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(matterContainerRef.current ? true : false), [matterContainerRef.current]);
  
  const { active, ready } = usePage();

  useEffect(() => {
    if (active === pageNumber) {
    } else {
      containerRef.current!.classList.remove('show');
    }
  }, [active]);

  useEffect(() => {
    if (ready === pageNumber) containerRef.current!.classList.add('show');
  }, [ready]);

  return <div className="w-full h-full">
    <div ref={matterContainerRef} className="absolute top-0 w-full h-full"/>
    {loaded && 
      <MatterContextProvider containerRef={matterContainerRef} active={active} ready={active} pageNumber={pageNumber}>
        <IdeaField pageNumber={pageNumber}/>
      </MatterContextProvider>
    }
  </div>
}