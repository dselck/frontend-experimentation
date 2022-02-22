import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";
import { layerOptions } from "./typing";

/**
 * Wrapper around sigplot.Plot.overlay_href
 *
 * Typical use of this layer looks like
 *   <SigPlot>
 *     <HrefLayer href={'/path/to/file.tmp'}/>
 *   </SigPlot>
 */

const propTypes = {
  /**
   * URI to BLUEFILE or MATFILE to plot
   *
   * This can either be local 'file:///path/to/file' or
   * remote 'http://myfile.com/file.tmp'
   *
   * Keep in mind that if the file is on a different domain,
   * most browsers/web-servers will block cross origin requests.
   *
   * Since this layer doesn't take any numeric data,
   * we are omitting the use of the `data` prop here.
   */
  href: PropTypes.string,

  /** Callback that executes once the file loads */
  onload: PropTypes.func,

  /** Layer options */
  options: PropTypes.object,
};

const defaultProps = {
  href: "",
  onload: null,
};

interface HrefProps {
  /** href or |-delimited hrefs the url to the bluefile or matfile */
  href?: string;
  onload?: CallableFunction;
  layerOptions?: layerOptions;
  plot?: Plot;
}

function HrefLayer({ plot, href, onload, layerOptions }: HrefProps) {
  const [layer, setLayer] = useState(undefined);

  useEffect(() => {
    // Called on Mount
    const curLayer = plot.overlay_href(href, onload, layerOptions);
    setLayer(curLayer);

    // This will be called on unmount
    return () => {
      plot.remove_layer(curLayer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layer) {
      plot.deoverlay(layer);
      setLayer(plot.overlay_href(href, onload, layerOptions));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);

  useEffect(() => {
    if (layer) {
      plot.get_layer(layer).change_settings(layerOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerOptions]);

  return <div />;
}

HrefLayer.propTypes = propTypes;
HrefLayer.defaultProps = defaultProps;

export default HrefLayer;
