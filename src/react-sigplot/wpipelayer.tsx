import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

/**
 * Wrapper around sigplot.Plot.overlay_websocket
 *
 * Typical use of this layer looks like
 *   <SigPlot>
 *     <WebsocketLayer wsurl={'ws://localhost:8080'}/>
 *   </SigPlot>
 */

const propTypes = {
  /**
   * URI to WPIPE websocket server
   *
   * This usually looks like ws://<some URI>:<some port>
   *
   * Keep in mind that if the websocket server is on a different domain,
   * most browsers/web-servers will block cross origin requests.
   *
   * Since this layer doesn't take any numeric data,
   * we are omitting the use of the `data` prop here.
   */
  wsurl: PropTypes.string,

  /** Key-value pairs whose values alter plot settings */
  overrides: PropTypes.object,

  /** Layer options */
  options: PropTypes.object,

  /** Frames per second throttles the data flow to the client by the specified */
  fps: PropTypes.number,

  /**
   * Options about the layer
   *
   * @see See [sigplot.layer1d](https://github.com/LGSInnovations/sigplot/blob/master/js/sigplot.layer1d.js)
   * @see See [sigplot.layer2d](https://github.com/LGSInnovations/sigplot/blob/master/js/sigplot.layer2d.js)
   */
  layerOptions: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
};

interface WPipeProps {
  wsurl?: string;
  overrides?: object;
  options?: object;
  fps?: number;
  plot?: Plot;
  layerOptions?: object;
}

function WPipeLayer({
  plot,
  wsurl,
  overrides,
  options,
  fps,
  layerOptions,
}: WPipeProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastUrl, setUrl] = useState(wsurl);

  useEffect(() => {
    // This will be called on unmount
    setLayer(plot.overlay_wpipe(wsurl, options, layerOptions, fps));

    // Called on unmount
    return () => {
      plot.remove_layer(layer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wsurl !== pastUrl) {
      setUrl(wsurl);
      plot.deoverlay(layer);
      setLayer(plot.overlay_websocket(wsurl, overrides, options));
    } else {
      const cur_layer = plot.get_layer(layer);
      if (cur_layer) {
        cur_layer.change_settings(options);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsurl, options]);

  return <div />;
}

WPipeLayer.propTypes = propTypes;

export default WPipeLayer;
