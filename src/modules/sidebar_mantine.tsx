import React from "react";
import { Navbar, NavbarProps, Text, Divider } from "@mantine/core";

function Sidebar(props: Omit<NavbarProps, "children">) {
  return (
    <Navbar {...props}>
      <Navbar.Section mb="sm">Pages</Navbar.Section>
      <Divider />
      <Navbar.Section grow mt="lg">
        Content
      </Navbar.Section>
      <Divider />
      <Navbar.Section mt="sm">Footer</Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
