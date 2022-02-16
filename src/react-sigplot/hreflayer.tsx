import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

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
  href?: string;
  onload?: CallableFunction;
  options?: object;
  plot?: Plot;
}

function HrefLayer({ plot, href, onload, options }: HrefProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastHref, setHref] = useState(href);

  useEffect(() => {
    // Called on Mount
    setLayer(plot.overlay_href(href, onload, options));

    // This will be called on unmount
    return () => {
      plot.remove_layer(layer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layer) {
      if (href !== pastHref) {
        setHref(href);
        plot.deoverlay(layer);
        setLayer(plot.overlay_href(href, onload, options));
      } else {
        const cur_layer = plot.get_layer(layer);
        if (cur_layer) {
          cur_layer.change_settings(options);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href, options]);

  return <div />;
}

HrefLayer.propTypes = propTypes;
HrefLayer.defaultProps = defaultProps;

export default HrefLayer;
