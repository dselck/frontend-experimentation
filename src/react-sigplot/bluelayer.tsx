import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

/**
 * BlueLayer wrapper for sigplot.layer1d and sigplot.layer2d
 *
 * This layer is meant for Bluefiles
 * ArrayBuffers. A typical use case looks like
 *
 * For a 1-D spectral or time-series plot:
 *
 *   <SigPlot>
 *     <BlueLayer data={hcb}/>
 *   </SigPlot>
 *
 * For a 2-D raster/heatmap:
 *
 *   <SigPlot>
 *     <BlueLayer data={hcb}
 *           layerOptions={{
 *             subsize: 8,
 *             layerType: "2D"
 *         }}
 *       />
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

function BlueLayer({ plot, data, options, layerOptions }: ArrayProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastData, setData] = useState(data);
  const [pastOptions, setOptions] = useState(options);

  useEffect(() => {
    // This will be called on unmount
    setLayer(plot.overlay_bluefile(data, layerOptions));
    return () => {
      plot.remove_layer(layer);
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

BlueLayer.propTypes = propTypes;

export default BlueLayer;
