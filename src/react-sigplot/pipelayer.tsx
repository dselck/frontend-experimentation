import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";

/**
 * Wrapper around sigplot.Plot.overlay_pipe
 *
 * This wrapper is for streaming 1-D plots or
 * 2-D raster waterfall plots.
 *
 * Typical use of this would look like
 *
 *   <SigPlot>
 *     <PipeLayer options={options} data={data}/>
 *   </SigPlot>
 *
 * where options is populated before data begins flowing
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

function PipeLayer({ plot, data, options, layerOptions }: ArrayProps) {
  const [layer, setLayer] = useState(undefined);
  const [pastData, setData] = useState(data);
  const [pastOptions, setOptions] = useState(options);

  useEffect(() => {
    // This will be called on unmount
    setLayer(plot.overlay_pipe(options, layerOptions));

    // if data is provided and non-empty, go ahead and begin plotting
    if (data !== undefined && data.length > 0) {
      plot.push(layer, data);
    }

    // Called on unmount
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

        // Should this be an else if? Maybe extract into new effect?
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

PipeLayer.propTypes = propTypes;

export default PipeLayer;
