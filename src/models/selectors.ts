import { selector } from "recoil";
import { viewPages, activePageIdx } from "./atoms";

export const activePageSelector = selector({
    key: "activePageSelector",
    get: ({ get }) => {
      const activeIdx: number = get(activePageIdx);
      const pages = get(viewPages);
      
      return pages[activeIdx].name;
    },
  });