import { createContext, useContext } from "react";

const PageContext = createContext<{
  active: number,
  ready: number,
}>({
  active: -1,
  ready: -1,
});

export const usePage = () => {
  return {
    active: useContext(PageContext).active + 1,
    ready: useContext(PageContext).ready + 1,
  }
}

export default PageContext;