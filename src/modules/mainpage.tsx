import React, { useState } from "react";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Topbar from "./topbar_mantine";
import Sidebar from "./sidebar_mantine";
import WidgetPage from "./WidgetPage";
import { useRecoilValue } from "recoil";
import { sidebarViewState } from "../models/atoms";

function MainPage() {
  const opened = useRecoilValue(sidebarViewState);
  const breakpoint = "xl";

  return (
    <AppShell
      navbarOffsetBreakpoint={breakpoint}
      fixed
      header={<Topbar height={50} padding="md" hiddenBreakpoint={breakpoint} />}
      navbar={
        <Sidebar
          padding="md"
          hidden={!opened}
          hiddenBreakpoint={breakpoint}
          width={{ base: 240 }}
        />
      }
    >
      <WidgetPage />
    </AppShell>
  );
}

export default MainPage;
