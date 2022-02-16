import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { sidebarViewState } from "../models/atoms";
import { activePageSelector } from "../models/selectors";
import {
  Container,
  Navbar,
  Button,
  SplitButton,
  Dropdown,
} from "react-bootstrap";

function Topbar() {
  const [show, setShow] = useRecoilState(sidebarViewState);
  const activePage = useRecoilValue(activePageSelector);

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid>
        <Button
          className=" ps-2 pe-2 pt-0 pb-0 me-3 fs-5 bi-layout-sidebar"
          onClick={() => setShow(!show)}
        />
        <Navbar.Brand className="me-auto">Branding</Navbar.Brand>
        <Navbar.Text className="me-auto">{activePage}</Navbar.Text>
        <SplitButton variant="primary" title="Edit Layout">
          <Dropdown.Item>Add Widget</Dropdown.Item>
          <Dropdown.Item>Rename Page</Dropdown.Item>
          <Dropdown.Item>Delete Page</Dropdown.Item>
          <Dropdown.Item>All the Things</Dropdown.Item>
        </SplitButton>
      </Container>
    </Navbar>
  );
}

export default Topbar;
