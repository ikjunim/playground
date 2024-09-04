import PageManager from './Page/PageManager';
import { useEffect } from 'react'
import { scrollToTop } from './Utility'
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
function App() {
  useEffect(() => {
    window.addEventListener('beforeunload', scrollToTop);
    return () => window.removeEventListener('beforeunload', scrollToTop);
  }, []);

  return <PageManager/>
}

export default App;