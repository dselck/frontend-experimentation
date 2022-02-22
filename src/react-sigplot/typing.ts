type inCmode = "IN__MA" | "IN__Magnitude" | "IN__PH" | "IN__Phase" | "IN__RE" | "IN__Real" | "IN__IM" | 
               "IN__Imaginary" | "IN__LO" | "IN__D1" | "IN__10log10" | "IN__L2" | "IN__D2" | 
               "IN__20log20" | "IN__RI" | "IN__Real/Imag" | "IN__Image/Real" | "IN__IR";
type abCmode = "AB__MA" | "AB__Magnitude" | "AB__PH" | "AB__Phase" | "AB__RE" | "AB__Real" | "AB__IM" | 
               "AB__Imaginary" | "AB__LO" | "AB__D1" | "AB__10log10" | "AB__L2" | "AB__D2" | 
               "AB__20log20" | "AB__RI" | "AB__Real/Imag" | "AB__Image/Real" | "AB__IR";
type cmode = "IN" | "AB" | "MA" | "Magnitude" | "PH" | "Phase" | "RE" | "Real" | "IM" | 
                    "Imaginary" | "LO" | "D1" | "10log10" | "L2" | "D2" | "20log20" | "RI" | 
                    "Real/Imag" | "Image/Real" | "IR" | inCmode | abCmode;

interface colors {
  fg?: string;
  bg?: string;
}

export interface sigplotOptions {
  cmode?: cmode;
  phunits?: "D" | "R" | "C";
  cross?: boolean;
  nogrid?: boolean;
  legend?: boolean;
  no_legend_button?: boolean;
  nopan?: boolean;
  nomenu?: boolean;
  nospec?: boolean;
  noxaxis?: boolean;
  noyaxis?: boolean;
  noreadout?: boolean;
  nodragdrop?: boolean;
  scroll_time_interval?: number;
  index?: boolean;
  autox?: 0 | 1 | 2 | 3;
  xmin?: number;
  xmax?: number;
  xlab?: units;
  xlabel?: object;
  xdiv?: number;
  xcnt?: 0|1|2;
  rubberbox_mode?: "zoom" | "box";
  rightclick_rubberbox_mode?: "zoom" | "box";
  line?: 0 | 1 | 2 | 3;
  autoy?: 0 | 1 | 2 | 3;
  ylab?: units;
  ylabel?: object;
  ymin?: number;
  ymax?: number;
  ydiv?: number;
  zmin?: number;
  zmax?: number;
  yinv?: boolean;
  colors?: colors;
  xi?: boolean;
  all?: boolean;
  expand?: boolean;
  origin?: 1 | 2 | 3 | 4;
  bufmax?: number;
  nokeypress?: boolean;
  font_family?: string;
  font_scaled?: boolean;
  font_width?: number;
}

export interface layerOptions {
    /** These options override ways that the layer of the plot are
     * displayed to the user
     */
  
    /** Override the x-midas data-type */
    layerType?: "1D" | "2D" | "1DSDS" | "2DSDS";
    /** This expands the plot range to accomodate if this isn't the first layer */
    expand?: boolean;
    /** Any data that you want to store in the layer */
    user_data?: any;
    /** Set the framesize for the plot */
    framesize?: number;
    /** Set the display name for the layer */
    name?: string;
  }
  
export interface dataOptions {
    /** These options override whatever key/value pairs you desire in the
     * header control block of the bluefile - even if you are just passing
     * in an array of data, or reading from a non-xmidas pipe, internally
     * a header control block is created
     */

    /** The type of the xmidas file being plotted */
    type?: 1000 | 2000;

    /** The size of data to be plotted - if set, sigplot forces type 2000 */
    subsize?: number;

    /** The format of the data (CF/SF/etc) */
    format?: string;

    /** The start time for the file in J1950 format */
    timecode?: number;

    xstart?: number;

    /** The change in `units` between subsequent points */
    xdelta?: number;

    /** The units for the x-axis */
    xunits?: units;

    ystart?: number;

    /** The change in `units` between subsequent points */
    ydelta?: number;

    /** The units for the y-axis */
    yunits?: units;

    /** pipe size for piped data. */
    pipesize?: number;
  }

/** units Structure:
 *		0: ["None", "U"],
 *		1: ["Time", "sec"],
 *		2: ["Delay", "sec"],
 *		3: ["Frequency", "Hz"],
 *		4: ["Time code format", ""],
 *		5: ["Distance", "m"],
 *		6: ["Speed", "m/s"],
 *		7: ["Acceleration", "m/sec^2"],
 *		8: ["Jerk", "m/sec^3"],
 *		9: ["Doppler", "Hz"],
 *		10: ["Doppler rate", "Hz/sec"],
 *		11: ["Energy", "J"],
 *		12: ["Power", "W"],
 *		13: ["Mass", "g"],
 *		14: ["Volume", "l"],
 *		15: ["Angular power density", "W/ster"],
 *		16: ["Integrated power density", "W/rad"],
 *		17: ["Spatial power density", "W/m^2"],
 *		18: ["Integrated power density", "W/m"],
 *		19: ["Spectral power density", "W/MHz"],
 *		20: ["Amplitude", "U"],
 *		21: ["Real", "U"],
 *		22: ["Imaginary", "U"],
 *		23: ["Phase", "rad"],
 *		24: ["Phase", "deg"],
 *		25: ["Phase", "cycles"],
 *		26: ["10*Log", "U"],
 *		27: ["20*Log", "U"],
 * 		28: ["Magnitude", "U"],
 *		29: ["Unknown", "U"],
 *		30: ["Unknown", "U"],
 *		31: ["General dimensionless", ""],
 *		32: ["Counts", ""],
 *		33: ["Angle", "rad"],
 *		34: ["Angle", "deg"],
 *		35: ["Relative power", "dB"],
 *		36: ["Relative power", "dBm"],
 *		37: ["Relative power", "dBW"],
 *		38: ["Solid angle", "ster"],
 *		40: ["Distance", "ft"],
 *		41: ["Distance", "nmi"],
 *		42: ["Speed", "ft/sec"],
 *		43: ["Speed", "nmi/sec"],
 *		44: ["Speed", "knots=nmi/hr"],
 *		45: ["Acceleration", "ft/sec^2"],
 *		46: ["Acceleration", "nmi/sec^2"],
 *		47: ["Acceleration", "knots/sec"],
 *		48: ["Acceleration", "G"],
 *		49: ["Jerk", "G/sec"],
 *		50: ["Rotation", "rps"],
 *		51: ["Rotation", "rpm"],
 *		52: ["Angular velocity", "rad/sec"],
 *		53: ["Angular velocity", "deg/sec"],
 *		54: ["Angular acceleration", "rad/sec^2"],
 *		55: ["Angular acceleration", "deg/sec^2"],
 *		60: ["Latitude", "deg"],
 *		61: ["Longitude", "deg"],
 *		62: ["Altitude", "ft"],
 *		63: ["Altitude", "m"]
 */
export type units = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|
                    20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|
                    40|41|42|43|45|46|47|48|49|50|51|52|53|54|55|60|61|62|63;

export interface box {
  /** The X coordinate of the box */
  x: number;
  /** The Y coordinate of the box */
  y: number;
  /** The width of the box */
  w: number;
  /** The height of the box */
  h: number;
  /** An optional label for the box */
  text?: string;
  /** Do you want the box filled in? */
  fill?: boolean;
  /** What style would you like your fill? */
  fillStyle?: string;
  /** What should the transparency value be on fill/select */
  alpha?: number;
  /** How thick do you want the box border */
  lineWidth?: number;
  /** Do you want to use the pixel coordinate space? */
  absolutePlacement?: boolean;
  /** This value is returned by the plugin when a box is created.
   * It will be overriden if passed when creating a box */
  id?: string;
}