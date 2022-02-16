import React from "react";
import { RecoilRoot } from "recoil";
import Sidebar from "./modules/Sidebar";
import Topbar from "./modules/Topbar";
import WidgetPage from "./modules/WidgetPage";

function App() {
  return (
    <RecoilRoot>
      <Topbar />
      <Sidebar />
      <WidgetPage />
    </RecoilRoot>
  );
}

export default App;
