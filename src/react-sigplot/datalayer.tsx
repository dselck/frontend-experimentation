import React, { useEffect, useState } from "react";
import { Plot } from "sigplot";
import { dataOptions, layerOptions } from "./typing";

export interface dataLayerProps {
  /** The data you intend to plot. This should be a numeric array if
   * of type "array", "pipe", or "bluefile". It should be a string if
   * of type "websocket"
   */
  data: number[] | string;

  /** The format your data takes (bluefile, array, pipe, websocket) */
  format: "array" | "pipe" | "bluefile" | "websocket" | "wpipe";

  /** Options for how to interpret the data as a bluefile */
  options?: dataOptions;

  /** Options for how to display the layer */
  layerOptions?: layerOptions;

  /** This is only used when doing a wpipe. It must be supplied if format === "wpipe".
   * The fps stands for frames per second and sets the update rate.
   */
  fps?: number;

  /** This in almost all instances should not be inserted by the user. This is intended
   * to be a child of the <SigPlot> in which case this is put in there automatically.
   */
  plot?: Plot;
}

function DataLayer({
  plot,
  data,
  format,
  options,
  layerOptions,
  fps,
}: dataLayerProps) {
  /** Other than hreflayer - this is the method used to get data to show up on the plot.
   * Functionally, it allows setting the format to one of 5 different types. Each
   * type is a different input type to sigplot. The different all call different
   * sigplot functions under the hood, but there is enough commonality where it is
   * easiest to keep them all together. Examples of how to call them are seen below:
   *
   * <SigPlot>
   *   <DataLayer format="array" data=[1,2,3] options={options} />
   *   <DataLayer format="array" data=[[1,2,3], [4,5,6]] options={options} />
   *   <DataLayer format="pipe" data={data} options={options} />
   *   <DataLayer format="bluefile" data={data} options={options} />
   *   <DataLayer format="websocket" data="ws://localhost:8080" options={options} />
   *   <DataLayer format="wpipe" data="ws://localhost:8080" options={options} />
   * <SigPlot>
   */

  const [layer, setLayer] = useState(undefined);
  const [resetSocket, setResetSocket] = useState(false);

  useEffect(() => {
    // Setup our layer & adjust if we change types.
    let curLayer = undefined;
    switch (format) {
      case "array":
        curLayer = plot.overlay_array(data, options, layerOptions);
        break;
      case "bluefile":
        curLayer = plot.overlay_bluefile(data, options, layerOptions);
        break;
      case "websocket":
        curLayer = plot.overlay_websocket(data, options, layerOptions);
        break;
      case "wpipe":
        curLayer = plot.overlay_wpipe(data, options, layerOptions, fps);
        break;
      case "pipe":
        curLayer = plot.overlay_pipe(data, options, layerOptions);
        if (data !== undefined && data.length > 0) {
          plot.push(curLayer, data);
        }
        break;
    }
    setLayer(curLayer);

    // This removes the layer on unmount or if the layer type changes.
    return () => {
      curLayer && plot.remove_layer(curLayer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, resetSocket]);

  useEffect(() => {
    // Push more data to the plot, or reload
    if (layer) {
      if (format === "pipe") {
        plot.push(layer, data, options);
      } else if (format === "websocket" || format === "wpipe") {
        // We need to tear down the layer and make a new one.
        // We created a state just for that. We don't want to remove and
        // reset the layer here as it would break the teardown function.
        setResetSocket(!resetSocket);
      } else {
        plot.reload(layer, data, options);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, layer]);

  useEffect(() => {
    // Change the data options
    if (layer) {
      plot.headermod(layer, options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, layer]);

  useEffect(() => {
    // Change the settings for the layer
    if (layer) {
      plot.get_layer(layer).change_settings(layerOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerOptions, layer]);

  return <div />;
}

export default DataLayer;
