import React, { useEffect, useState } from "react";
import { Plot } from "sigplot";
import Plugins from "../../node_modules/sigplot/js/plugins.js";
import { box } from "./typing";

/**
 * Boxes Plugin wrapper for sigplot
 *
 * This layer adds a plugin to sigplot
 *
 *   <SigPlot>
 *     <BoxesPlugin addOnMtag />
 *   </SigPlot>
 */

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
  /** Options to be passed to the plugin regarding global defaults */
  options?: pluginOptions;
  /** The reference to the Plot to which this plugin is attached.
   * If this is a child component of SigPlot, then this gets added
   * automatically for you and you should leave it blank. */
  plot?: Plot;
  /** Any boxes passed to this property will be inserted onto the
   * plot. If this input changes, all those items will be added to the
   * plot without regard for if they were already there. In essence
   * This just mimicks the boxAdd function in the plugin. I do allow
   * passing a list of boxes in addition to one by one.
   */
  addBox?: box[] | box;
  /** Any box IDs passed to this function will be removed from the plot.
   * It will "watch" changes much like addBox so you can interact with it.
   * You can either pass a single box id or a list of box ids
   */
  removeBox?: string[] | string;
  /** If you would like to programatically take a box that is already
   * on the screen and move it, then put the box info here. If the box.id
   * contained in the box does not exist, then nothing will happen.
   */
  moveBox?: box;
  /** If this is set to True then a handler will be setup to add boxes
   * to the plot on "mtag" events - i.e. if you hold control while drawing
   * a box with your mouse.
   */
  addOnMtag?: boolean;
  /** If you move (or resize) a box on the plot, this callback will be
   * triggered. The passed box will be the "new" box position.
   */
  onMove?(box: box): void;
  /** Subscribing to this callback will allow you to retrieve the IDs of
   * any boxes added to the plot.
   */
  onAdd?(box: box): void;
  /** This callback will be triggered anytime a box is removed from the plot */
  onRemove?(box: box): void;
  /** This callback will be triggered anytime a box on the plot is selected */
  onSelect?(box: box): void;
}

function BoxesPlugin({
  plot,
  options,
  addBox,
  removeBox,
  moveBox,
  addOnMtag,
  onMove,
  onAdd,
  onRemove,
  onSelect,
}: pluginProps) {
  const [plugin, setPlugin] = useState(undefined);

  useEffect(() => {
    // This will be called on mount
    const bPlugin = new Plugins.BoxesPlugin(options);
    plot.add_plugin(bPlugin, 2);
    setPlugin(bPlugin);

    /** Add callbacks if the user wants them. Make sure that the
     * despread operator is used everywhere as the objects being
     * returned in event.box are just references to the object on
     * the plot. That can cause weird behavior... Therefore, we
     * will just return copies of those original objects.
     */
    if (onMove) {
      plot.addListener("boxmove", function (event) {
        const curBox: box = { ...event.box };
        onMove(curBox);
      });
    }

    if (onAdd) {
      plot.addListener("boxadd", function (event) {
        const curBox: box = { ...event.box };
        onAdd(curBox);
      });
    }

    if (onSelect) {
      plot.addListener("boxselect", function (event) {
        const curBox: box = { ...event.box };
        onSelect(curBox);
      });
    }

    if (onRemove) {
      plot.addListener("boxremove", function (event) {
        const curBox: box = { ...event.box };
        onRemove(curBox);
      });
    }

    if (addOnMtag) {
      plot.addListener("mtag", function (event) {
        bPlugin.addBox({ x: event.x, y: event.y, h: event.h, w: event.w });
      });
    }

    /** There is a bug in the boxes plugin where if certain modes are selected
     * then boxes with no width or height can be created. This is a hacky
     * bugfix to tide over until the actual bug is fixed
     *
     * TODO Remove when original bug is fixed
     */
    plot.addListener("boxadd", function (event) {
      if (!event.box.w || !event.box.h) {
        // There appears to be a bug in the boxes plugin where you can
        // create boxes just by clicking on the screen of 0 w an 0 h
        bPlugin.removeBox(event.box.id);
      }
    });

    // Called on unmount
    return () => {
      plot.remove_plugin(bPlugin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (plugin) {
      if (addBox instanceof Array) {
        addBox.forEach((box) => plugin.addBox(box));
      } else if (addBox) {
        plugin.addBox(addBox);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin, addBox]);

  useEffect(() => {
    if (plugin) {
      if (removeBox instanceof Array) {
        removeBox.forEach((box) => plugin.removeBox(box));
      } else if (removeBox) {
        plugin.removeBox(removeBox);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin, removeBox]);

  useEffect(() => {
    if (plugin) {
      // Manually insert the box into the array held by the plugin
      let curBoxes: box[] = plugin.getBoxes();
      const idx = curBoxes.findIndex((box) => box.id === moveBox.id);
      if (idx !== -1) curBoxes[idx] = { ...moveBox };

      // Redraw the plot
      plot.redraw();

      // Send out a resize event if we need to
      if (onMove) {
        onMove(moveBox);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin, moveBox]);

  return <div />;
}

export default BoxesPlugin;
