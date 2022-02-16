import React, { useLayoutEffect, useRef, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import SigPlot, { mtagEvent } from "../react-sigplot/sigplot";
import HrefLayer from "../react-sigplot/hreflayer";
import BoxesPlugin, { box } from "../react-sigplot/boxesplugin";
import produce from "immer";

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

const FFTWidget = React.forwardRef(
  (props: any, ref: React.RefObject<HTMLDivElement>) => {
    const plotRef = useRef<HTMLDivElement>();
    const [plotSize, setPlotSize] = useState({ height: 300, width: 300 });
    const [boxes, setBoxes] = useState<box[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const newWidth = plotRef.current.clientWidth - 32;
      const newHeight = plotRef.current.clientHeight - 32;

      if (newWidth !== plotSize.width || newHeight !== plotSize.height) {
        setPlotSize({ height: newHeight, width: newWidth });
      }
    });

    const addedToPlotEvent = (boxesWithIds: box[]) => {
      const equal = boxes
        .map((box, idx) => box.id === boxesWithIds[idx].id)
        .reduce((previous, current) => previous && current);

      sleep(1000);

      // !equal &&
      //   setBoxes(
      //     produce((draft) => {
      //       draft.forEach((box, idx) => {
      //         if (box.id !== boxesWithIds[idx].id) {
      //           draft[idx].id = boxesWithIds[idx].id;
      //         }
      //       });
      //     })
      //   );
    };

    const moveBoxEvent = (movedBox: box) => {
      console.log("move event!");
      const idx = boxes.findIndex((box) => box.id === movedBox.id);

      if (idx !== -1) {
        setBoxes(
          produce((draft) => {
            draft[idx] = movedBox;
          })
        );
      }
    };

    const addBox = (event: mtagEvent) => {
      const newBox: box = { x: event.x, y: event.y, h: event.h, w: event.w };

      setBoxes(
        produce((draft) => {
          draft.push(newBox);
        })
      );
    };

    return (
      <Card ref={ref} className={props.className} style={props.style}>
        <Card.Header>Its a Penny!!!</Card.Header>
        <Card.Body ref={plotRef} style={{ overflow: "hidden" }}>
          <SigPlot
            width={plotSize.width}
            height={plotSize.height}
            onMtag={addBox}
          >
            <BoxesPlugin
              boxes={boxes}
              onId={addedToPlotEvent}
              onMove={moveBoxEvent}
              options={{
                enableResize: true,
                enableMove: true,
              }}
            />
            <HrefLayer href="http://sigplot.lgsinnovations.com/dat/penny.prm"></HrefLayer>
          </SigPlot>
        </Card.Body>
        <Card.Footer>
          <DropdownButton variant="secondary" title="FFT Size">
            <Dropdown.Item>4k</Dropdown.Item>
            <Dropdown.Item>8k</Dropdown.Item>
            <Dropdown.Item>16k</Dropdown.Item>
            <Dropdown.Item>32k</Dropdown.Item>
            <Dropdown.Item>64k</Dropdown.Item>
          </DropdownButton>
        </Card.Footer>
      </Card>
    );
  }
);

export default FFTWidget;
