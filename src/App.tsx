import React from "react";
import { RecoilRoot } from "recoil";
// import Sidebar from "./modules/Sidebar";
// import Topbar from "./modules/Topbar";
// import WidgetPage from "./modules/WidgetPage";
import MainPage from "./modules/mainpage";

function App() {
  return (
    <RecoilRoot>
      {/* <Topbar />
      <Sidebar />
      <WidgetPage /> */}
      <MainPage />
    </RecoilRoot>
  );
}

export default App;
