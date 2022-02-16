import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { activePageIdx, viewPages, sidebarViewState } from "../models/atoms";
import produce from "immer";
import {
  Button,
  Offcanvas,
  Nav,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";

function Sidebar() {
  const [show, setShow] = useRecoilState(sidebarViewState);
  const [page, setPage] = useRecoilState(activePageIdx);
  const [pages, setPages] = useRecoilState(viewPages);
  // this one is local to the sidebar - not in recoil
  const [editPages, setEditPages] = useState(false);

  let newPageName = "";
  let pagesUpdated = false;

  const hideSidebar = () => {
    setEditPages(false);
    setShow(false);

    //Ensure all page names have no extra whitespace
    pages.forEach(function (curPage, idx) {
      curPage.name !== curPage.name.trim() &&
        updatePageName(curPage.name.trim(), idx);
    });

    if (pagesUpdated) {
      // Do an HTTP PUT to update all this stuff on the server with fetch
      console.log("TODO - push these changes to the server!");
    }
  };

  const addPage = () => {
    const trimmed = newPageName.trim();

    if (
      trimmed !== "" &&
      !pages.map((curPage) => curPage.name).includes(trimmed)
    ) {
      pagesUpdated = true;
      setPages(
        produce((draft) => {
          draft.push({
            name: trimmed,
            id: "unique" + trimmed,
            layout: "something here",
          });
        })
      );
    }
  };

  const updatePageName = (newName: string, idx: number) => {
    pagesUpdated = true;
    setPages(
      produce((draft) => {
        draft[idx].name = newName;
      })
    );
  };

  const movePagePosition = (fromIdx: number, toIdx: number) => {
    pagesUpdated = true;
    // If direction is > 0 it goes up, else down
    setPages(
      produce((draft) => {
        if (toIdx < 0) {
          toIdx = pages.length - 1;
        } else if (toIdx >= pages.length) {
          toIdx = 0;
        }
        draft.splice(toIdx, 0, draft.splice(fromIdx, 1)[0]);
      })
    );
  };

  const deletePage = (idx: number) => {
    pagesUpdated = true;
    setPages(
      produce((draft) => {
        draft.splice(idx, 1);
      })
    );
  };

  return (
    <Offcanvas
      show={show}
      onHide={hideSidebar}
      className="me-2 bg-dark p-3 text-white flex-column"
      style={{ width: "280px" }}
    >
      <Offcanvas.Header
        className=" pt-0 pb-0"
        style={{
          justifyContent: "left",
          paddingRight: "0rem",
          paddingLeft: "0.5rem",
        }}
      >
        <Offcanvas.Title className=" bi-book me-3"></Offcanvas.Title>
        <Offcanvas.Title className=" me-auto">Pages</Offcanvas.Title>
        <button
          onClick={hideSidebar}
          className="btn text-white fs-4 bi-x-square p-0"
        />
      </Offcanvas.Header>
      <hr />
      {editPages ? (
        <>
          {pages.map((curPage, idx) => (
            <Row className="pb-1 gx-1" key={curPage.id}>
              <Col sm={7}>
                <Form.Control
                  style={{ borderColor: "#0d6efd" }}
                  className="bg-dark text-light"
                  type="text"
                  onChange={(e) => {
                    updatePageName(e.currentTarget.value, idx);
                  }}
                  value={curPage.name}
                />
              </Col>
              <Col sm="auto">
                <Button
                  variant="primary"
                  className="p-0 bi-arrow-up-short fs-4"
                  onClick={() => movePagePosition(idx, idx - 1)}
                />
              </Col>
              <Col sm="auto">
                <Button
                  variant="primary"
                  className="p-0 bi-arrow-down-short fs-4"
                  onClick={() => movePagePosition(idx, idx + 1)}
                />
              </Col>
              <Col sm="auto">
                <Button
                  variant="danger"
                  className="pt-0 pb-0 ps-1 fs-4 bi-x-octagon"
                  style={{ paddingRight: "0.35rem" }}
                  onClick={() => deletePage(idx)}
                />
              </Col>
            </Row>
          ))}
          <div className="mb-auto"></div>
        </>
      ) : (
        <Nav
          variant="pills"
          className="flex-column mb-auto"
          activeKey={page}
          onSelect={(eventKey) =>
            eventKey != null && setPage(parseInt(eventKey))
          }
        >
          {pages.map((curPage, idx) => (
            <Nav.Item key={curPage.id}>
              <Nav.Link
                eventKey={idx}
                className="text-white"
                onClick={() => setShow(false)}
              >
                {curPage.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}
      <hr />
      {editPages && (
        <Form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            addPage();
          }}
          className="pb-2"
        >
          <InputGroup>
            <Button onClick={addPage}>Add</Button>
            <Form.Control
              style={{ borderColor: "#0d6efd" }}
              className="bg-dark text-light"
              type="text"
              placeholder="Page Name"
              onChange={(event) => (newPageName = event.target.value)}
            />
          </InputGroup>
        </Form>
      )}
      <Form.Check
        id="edit-pages-sidebar-switch"
        type="switch"
        label="Edit Pages"
        checked={editPages}
        onChange={() => setEditPages(!editPages)}
      />
    </Offcanvas>
  );
}

export default Sidebar;
