import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import SigPlot from "../react-sigplot/sigplot";
import HrefLayer from "../react-sigplot/hreflayer";
import BoxesPlugin from "../react-sigplot/boxesplugin";
import { box } from "../react-sigplot/typing";
import {
  Card,
  Text,
  Button,
  Header,
  useMantineTheme,
  Paper,
} from "@mantine/core";
import produce from "immer";

const FFTMantine = React.forwardRef(
  (props: any, ref: React.RefObject<HTMLDivElement>) => {
    const plotRef = useRef<HTMLDivElement>();
    const [plotSize, setPlotSize] = useState({ height: 300, width: 300 });
    const [boxes, setBoxes] = useState<box[]>([]);
    const [boxesToAdd, setboxesToAdd] = useState<box[] | box>();
    const [boxesToRemove, setboxesToRemove] = useState<string[] | string>();
    const [boxToMove, setBoxToMove] = useState<box>();

    const headerHeight = 40;
    const theme = useMantineTheme();
    const secondaryColor =
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    useLayoutEffect(() => {
      const cardWidth = ref.current.clientWidth;
      const cardHeight = ref.current.clientHeight;
      const plotWidth = plotRef.current.clientWidth;
      const plotHeight = plotRef.current.clientHeight;

      const newPlotHeight =
        cardHeight - headerHeight > 10 ? cardHeight - headerHeight : 10;

      if (cardWidth !== plotWidth || plotHeight !== newPlotHeight) {
        setPlotSize({ height: newPlotHeight, width: cardWidth });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

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
      <Paper
        ref={ref}
        className={props.className}
        style={{ overflow: "hidden", ...props.style }}
        shadow="md"
        withBorder
      >
        <Header height={headerHeight} padding="sm">
          <Text>This is the header</Text>
        </Header>
        <div ref={plotRef} style={{ overflow: "hidden" }}>
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
        </div>
      </Paper>
    );
  }
);

export default FFTMantine;
