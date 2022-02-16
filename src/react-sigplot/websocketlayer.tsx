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
   * URI to websocket server
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
};

interface WSProps {
  wsurl?: string;
  overrides?: object;
  options?: object;
  plot?: Plot;
}

function WebsocketLayer({ plot, wsurl, overrides, options }: WSProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastUrl, setUrl] = useState(wsurl);

  useEffect(() => {
    // This will be called on unmount
    setLayer(plot.overlay_websocket(wsurl, overrides, options));

    // Called on unmount
    return () => {
      plot.remove_layer(layer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layer) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsurl, options]);

  return <div />;
}

WebsocketLayer.propTypes = propTypes;

export default WebsocketLayer;
