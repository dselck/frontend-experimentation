import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

/**
 * ArrayLayer wrapper for sigplot.layer1d and sigplot.layer2d
 *
 * This layer is meant for static 1D and 2D (or 1D with `framesize`)
 * JS arrays/ArrayBuffers. A typical use case looks like
 *
 * For a 1-D spectral or time-series plot:
 *
 *   <SigPlot>
 *     <ArrayLayer data={[1, 2, 3]}/>
 *   </SigPlot>
 *
 * For a 2-D raster/heatmap:
 *
 *   <SigPlot>
 *     <ArrayLayer data={[[1, 2, 3], [2, 3, 4]]}/>
 *   </SigPlot>
 */

const propTypes = {
  /** Array of `Number` types */
  data: PropTypes.arrayOf(PropTypes.number), // eslint-disable-line react/no-unused-prop-types

  /** Header options for `data` */
  options: PropTypes.object, // eslint-disable-line react/no-unused-prop-types

  /**
   * Options about the layer
   *
   * @see See [sigplot.layer1d](https://github.com/LGSInnovations/sigplot/blob/master/js/sigplot.layer1d.js)
   * @see See [sigplot.layer2d](https://github.com/LGSInnovations/sigplot/blob/master/js/sigplot.layer2d.js)
   */
  layerOptions: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
};

interface ArrayProps {
  data: number[];
  options?: object;
  layerOptions?: object;
  plot?: Plot;
}

function ArrayLayer({ plot, data, options, layerOptions }: ArrayProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastData, setData] = useState(data);
  const [pastOptions, setOptions] = useState(options);

  useEffect(() => {
    // This will be called on unmount
    setLayer(plot.overlay_array(data, options, layerOptions));
    return () => {
      layer && plot.remove_layer(layer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layer) {
      if (data !== pastData) {
        setData(data);
        plot.reload(layer, data, options);
      } else if (options !== pastOptions) {
        setOptions(options);
        plot.headermod(layer, options);
      } else {
        const cur_layer = plot.get_layer(layer);
        if (cur_layer) {
          cur_layer.change_settings(layerOptions);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, options, layerOptions]);

  return <div />;
}

ArrayLayer.propTypes = propTypes;

export default ArrayLayer;
