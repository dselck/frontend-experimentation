import React from "react";
import {
  Header,
  Burger,
  Text,
  useMantineTheme,
  MediaQuery,
  NavbarProps,
} from "@mantine/core";
import { useRecoilState, useRecoilValue } from "recoil";
import { sidebarViewState } from "../models/atoms";
import { activePageSelector } from "../models/selectors";

function Topbar({
  height,
  hiddenBreakpoint,
  ...props
}: Omit<NavbarProps, "children">) {
  const [opened, setOpened] = useRecoilState(sidebarViewState);
  const activePage = useRecoilValue(activePageSelector);

  const theme = useMantineTheme();

  return (
    <Header height={height} {...props}>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan={hiddenBreakpoint} styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>Page {activePage} opened</Text>
      </div>
    </Header>
  );
}

export default Topbar;
