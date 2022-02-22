import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plot } from "sigplot";
import { sigplotOptions } from "./typing";

interface sigplotProps {
  /** Height of the wrapper div */
  height?: number;
  /** Width of the wrapper div */
  width?: number;
  /** Callback for `mtag` events which are generated with
   * clicking and dragging to create a box while holding ctrl.
   * Returns just the information about the box.
   */
  onMtag?(event: mtagEvent): void;
  /** Styles object for any other CSS styles on the wrapper div */
  style?: React.CSSProperties;
  /**
   * SigPlot plot-level options
   *
   * @see See [sigplot.Plot Docs](http://sigplot.lgsinnovations.com/html/doc/sigplot.Plot.html)
   */
  options?: sigplotOptions;
  /** Any plugins or layers that should be added to the plot */
  children?: any;
}

export interface mtagEvent {
  x: number;
  y: number;
  w: number;
  h: number;
  xpos: number;
  ypos: number;
  wpxl: number;
  hpxl: number;
}

const defaultProps = {
  height: 300,
  width: 300,
  style: { display: "inline-block" },
  options: {
    all: true,
    expand: true,
    autol: 100,
    autohide_panbars: true,
  },
};

function SigPlot({
  children,
  height,
  width,
  style,
  options,
  onMtag,
}: sigplotProps) {
  const [plot, setPlot] = useState(undefined);
  const plotRef = useRef<HTMLDivElement>();

  // This only runs when it is mounted due to the empty array
  useEffect(() => {
    const plot = new Plot(plotRef.current, options);
    if (onMtag) {
      plot.addListener("mtag", (event: any) => {
        const eventData: mtagEvent = {
          x: event.x,
          y: event.y,
          h: event.h,
          w: event.w,
          xpos: event.xpos,
          ypos: event.ypos,
          wpxl: event.wpxl,
          hpxl: event.hpxl,
        };
        onMtag(eventData);
      });
    }
    setPlot(plot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Anytime the width or height changes, this will kick off
  useLayoutEffect(() => plot && plot.checkresize(), [plot, width, height]);

  // Anytime the options change this will fire
  useEffect(() => plot && plot.change_settings(options), [plot, options]);

  const plotChildren = plot
    ? React.Children.map(children, (child) => {
        if (child) {
          return React.cloneElement(child, { plot });
        }
        return null;
      })
    : null;

  return (
    <div
      style={{
        height,
        width,
        ...style,
      }}
      ref={plotRef}
    >
      {plotChildren}
    </div>
  );
}

SigPlot.defaultProps = defaultProps;

export default SigPlot;
