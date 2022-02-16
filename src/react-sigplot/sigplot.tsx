import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

interface sigplotProps {
  height?: number;
  width?: number;
  display?: string;
  styles?: React.CSSProperties;
  options?: object;
  children?: any;
  onMtag?: CallableFunction;
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

const propTypes = {
  /** Height of the wrapper div */
  height: PropTypes.number,

  /** Width of the wrapper div */
  width: PropTypes.number,

  /** CSS 'display' property */
  display: PropTypes.string,

  /** Styles object for any other CSS styles on the wrapper div */
  styles: PropTypes.object,

  /**
   * SigPlot plot-level options
   *
   * @see See [sigplot.Plot Docs](http://sigplot.lgsinnovations.com/html/doc/sigplot.Plot.html)
   */
  options: PropTypes.object,

  onMtag: PropTypes.func,
};

const defaultProps = {
  height: 300,
  width: 300,
  display: "inline-block",
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
  display,
  styles,
  options,
  onMtag,
}: sigplotProps) {
  const [plot, setPlot] = useState(undefined);
  const plotRef = useRef<HTMLDivElement>();

  // This only runs when it is mounted due to the empty array
  useEffect(() => {
    const plot = new Plot(plotRef.current, options);
    if (onMtag) {
      plot.addListener("mtag", function (event) {
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
        display,
        ...styles,
      }}
      ref={plotRef}
    >
      {plotChildren}
    </div>
  );
}

SigPlot.propTypes = propTypes;
SigPlot.defaultProps = defaultProps;

export default SigPlot;
