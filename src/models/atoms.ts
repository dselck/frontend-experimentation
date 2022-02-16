import { atom } from "recoil";

export const viewPages = atom({
    key: 'viewPages',
    default: [
        { name: "Page 1", id: "thisispage1", layout: "something here" },
        { name: "Page 2", id: "thisispage2", layout: "something here" },
        { name: "Page 3", id: "thisispage3", layout: "something here" },
      ],
})

export const activePageIdx = atom({
    key: 'activePageIdx',
    default: 0,
})

export const sidebarViewState = atom({
    key: 'sidebarViewState',
    default: false,
})
