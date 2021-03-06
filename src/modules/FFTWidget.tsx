import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import SigPlot from "../react-sigplot/sigplot";
import HrefLayer from "../react-sigplot/hreflayer";
import BoxesPlugin from "../react-sigplot/boxesplugin";
import { box } from "../react-sigplot/typing";

import produce from "immer";

const FFTWidget = React.forwardRef(
  (props: any, ref: React.RefObject<HTMLDivElement>) => {
    const plotRef = useRef<HTMLDivElement>();
    const [plotSize, setPlotSize] = useState({ height: 300, width: 300 });
    const [boxes, setBoxes] = useState<box[]>([]);
    const [boxesToAdd, setboxesToAdd] = useState<box[] | box>();
    const [boxesToRemove, setboxesToRemove] = useState<string[] | string>();
    const [boxToMove, setBoxToMove] = useState<box>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const newWidth = plotRef.current.clientWidth;
      const newHeight = plotRef.current.clientHeight;

      if (newWidth !== plotSize.width || newHeight !== plotSize.height) {
        setPlotSize({ height: newHeight, width: newWidth });
      }
    });

    const addBoxEvent = (box: box) => {
      setBoxes(
        produce((draft) => {
          // Need to use the spread operator here. Reason is because this
          // is the actual object used by the boxes plugin. If we don't make
          // a copy of it, then we break the plugin.
          draft.push(box);
        })
      );
    };

    const moveBoxEvent = (movedBox: box) => {
      setBoxes(
        produce((draft) => {
          const idx = draft.findIndex((box) => box.id === movedBox.id);
          // Use the spread operator here to save a copy of moved box.
          // If we don't, then we break the plot!
          if (idx !== -1) draft[idx] = movedBox;
        })
      );
    };

    return (
      <Card ref={ref} className={props.className} style={props.style}>
        <Card.Header>Its a Penny!!!</Card.Header>
        <Card.Body ref={plotRef} style={{ overflow: "hidden", padding: "0px" }}>
          <SigPlot width={plotSize.width} height={plotSize.height}>
            <BoxesPlugin
              addOnMtag
              addBox={boxesToAdd}
              removeBox={boxesToRemove}
              moveBox={boxToMove}
              onAdd={addBoxEvent}
              onMove={moveBoxEvent}
              options={{
                enableResize: true,
                enableMove: true,
                enableSelect: true,
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
