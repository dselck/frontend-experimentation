import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Plot } from "sigplot";
import Plugins from "../../node_modules/sigplot/js/plugins.js";
import produce from "immer";

/**
 * Boxes Plugin wrapper for sigplot
 *
 * This layer adds a plugin to sigplot
 *
 *   <SigPlot>
 *     <BoxesPlugin boxes={boxes} />
 *   </SigPlot>
 */

const propTypes = {
  /** Options for the plugin */
  options: PropTypes.object, // eslint-disable-line react/no-unused-prop-types

  plot: PropTypes.object,

  boxes: PropTypes.arrayOf(Object),

  onMove: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onSelect: PropTypes.func,
  onId: PropTypes.func,
};

export interface box {
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  fill?: boolean;
  fillStyle?: string;
  alpha?: number;
  lineWidth?: number;
  absolutePlacement?: boolean;
  id?: string; // this is inserted by the plugin
}

interface pluginOptions {
  display?: boolean;
  enableSelect?: boolean;
  enableMove?: boolean;
  enableResize?: boolean;
  lineWidth?: number;
  alpha?: number;
  font?: string;
  fill?: boolean;
  strokeStyle?: string;
  fillStyle?: string;
  absolutePlacement?: boolean;
}

interface pluginProps {
  options?: pluginOptions;
  plot?: Plot;
  boxes?: box[];
  onMove?: CallableFunction;
  onAdd?: CallableFunction;
  onRemove?: CallableFunction;
  onSelect?: CallableFunction;
  onId?: CallableFunction;
}

function BoxesPlugin({
  plot,
  options,
  boxes,
  onMove,
  onAdd,
  onRemove,
  onSelect,
  onId,
}: pluginProps) {
  const [plugin, setPlugin] = useState(undefined);

  useEffect(() => {
    // This will be called on mount
    const bPlugin = new Plugins.BoxesPlugin(options);
    plot.add_plugin(bPlugin, 2);
    setPlugin(bPlugin);

    // Add callbacks if they exist
    if (onMove) {
      plot.addListener("boxmove", function (event) {
        const curBox: box = event.box;
        onMove(curBox);
      });
    }

    if (onAdd) {
      plot.addListener("boxadd", function (event) {
        const curBox: box = event.box;
        onAdd(curBox);
      });
    }

    if (onSelect) {
      plot.addListener("boxselect", function (event) {
        const curBox: box = event.box;
        onSelect(curBox);
      });
    }

    if (onRemove) {
      plot.addListener("boxremove", function (event) {
        const curBox: box = event.box;
        onRemove(curBox);
      });
    }

    // Called on unmount
    return () => {
      console.log("removing plugin");
      plot.remove_plugin(plugin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // We need to ensure that everything about the plot
    // matches here (order etc). Make some arrays to
    // do some checking against
    if (plugin) {
      const curPlotBoxes: box[] = plugin.getBoxes();
      console.log(curPlotBoxes);
      let pushIds = false;

      if (boxes && boxes.length > 0) {
        // The first thing we need to do is check the supplied
        // boxes to see if they are already plotted
        boxes.forEach((box) => {
          // First look for the correct box by id
          if (box.id) {
            const idx = curPlotBoxes.findIndex((curBox) => {
              return curBox.id === box.id;
            });

            if (idx > -1 && curPlotBoxes[idx] !== box) {
              // The box has been altered in some way outside of the
              // plot. Push this change to the plot and redraw
              plugin.boxes[idx] = box;
              plot.redraw();
            } else if (idx === -1) {
              // We have a local copy of this, including its ID.
              // Let's just assume that the user put the id in
              // there and didn't let the software do it. Fix here
              box.id = plugin.addBox(box);
              pushIds = true;
            }
          } else {
            // If there is no ID then the box needs to be added
            box.id = plugin.addBox(box);
            pushIds = true;
          }
        });

        // Now we need to see if there are things that need to be deleted
        curPlotBoxes.forEach((curBox) => {
          const idx = boxes.findIndex((box) => {
            return box.id === curBox.id;
          });

          // It is on the plot, but not in our local store - delete.
          if (idx === -1) {
            plugin.removeBox(curBox.id);
          }
        });

        // There is absolutely no guarantee that the order will be
        // correct betwen "our" copy of the boxes, and the one
        // actually plotted on the screen. TODO fix this...
        console.log(boxes);
        console.log(plugin.getBoxes());
        if (onId && pushIds) {
          onId(boxes);
        }
      } else if (curPlotBoxes.length > 0) {
        plugin.clearBoxes();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin, boxes]);

  return <div />;
}

BoxesPlugin.propTypes = propTypes;

export default BoxesPlugin;
