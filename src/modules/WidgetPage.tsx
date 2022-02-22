import React from "react";
import { Card } from "react-bootstrap";
import { Responsive, WidthProvider } from "react-grid-layout";
import FFTWidget from "./FFTWidget";
import FFTMantine from "./fftmantine";

function WidgetPage() {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 5 },
    { i: "b", x: 1, y: 0, w: 1, h: 5 },
    { i: "c", x: 2, y: 0, w: 5, h: 14 },
  ];

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      cols={{ lg: 8, md: 6, sm: 3, xs: 2, xxs: 1 }}
      rowHeight={30}
      width={1200}
      isDraggable={false}
      isResizable={false}
    >
      <Card key="a">
        <Card.Header>Normal</Card.Header>
        <Card.Body>Normal</Card.Body>
      </Card>
      <Card key="b">
        <Card.Header>This is a test</Card.Header>
        <Card.Body style={{ overflow: "auto" }}>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
          <p>I have a body</p>
        </Card.Body>
      </Card>
      <FFTMantine key="c" />
    </ResponsiveGridLayout>
  );
}

export default WidgetPage;
