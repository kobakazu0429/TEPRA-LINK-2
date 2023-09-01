import { v4 as id } from "https://esm.sh/uuid@9.0.0";

const DPI = 72;
const INCH_AS_MM = 25.4;

type Mm = number;
type Px = number;
const toPx = (mm: Mm): Px => mm / (INCH_AS_MM / DPI);
// const toMm = (px: Px): Mm => (px * INCH_AS_MM) / DPI;

const IGNORE_FRAME = [0, 0, 0, 0];
const BLACK = [0, 0, 0, 1];
const WHITE = [1, 1, 1, 1];

const FONT_NAME = "OTBGoStdR-Normal";
const FONT_SIZE = 7;

const TAPES = {
  36: {},
};

type Width = {
  isAutoLength: boolean;
};
// | {
//     width: number;
//   };

const buildFrame = (x: Mm, y: Mm, w: Mm, h: Mm) => {
  return [x, y, w, h].map((v) => toPx(v)) as [x: Px, y: Px, w: Px, h: Px];
};

interface TextOptions {
  text: string;
}
const drawText = (options: TextOptions) => {
  return {
    BILineStyle: 1,
    BILineThickness: 0,
    BILineWidhValue: 0.7,
    BILineWidth: 0,
    BIType: 0,
    Rotate: 0,
    TIAlignment: 0,
    TIBold: false,
    TIColor: BLACK,
    TIFillMode: 0,
    TIFontFace: 1,
    TIFontName: FONT_NAME,
    TIFontSize: FONT_SIZE,
    TIItalic: false,
    TILineBreak: 2,
    TIText: options.text,
    TIVerticalAlignment: 1,
    frameTop: false,
    hasPlaceholder: false,
    holdAspect: true,
    identifier: id(),
    isaacIdentifier: "",
    sizePriority: false,
    tapeBackgroundColor: WHITE,
    tapeForegroundColor: BLACK,
    tapeTapeFrame: IGNORE_FRAME,
    tapeVertical: false,
    textMargin: [0.1, 0],
    textVertical: false,
    type: "text",
  };
};

interface TableOpions {
  margin: number;
  width: number[];
  height: number[];
  text: string[];
}

const sum = (total: number, cur: number) => total + cur;

const tableDraw = (options: TableOpions) => {
  const TableCells = options.height.map((h, i) => {
    return options.width.map((w, j) => {
      return {
        ...drawText({ text: options.text[i * options.width.length + j] }),
        frame: buildFrame(
          0 + 0 <= j - 1 ? options.width.slice(0, j).reduce(sum, 0) : 0,
          0 + 0 <= i - 1 ? options.height.slice(0, i).reduce(sum, 0) : 0,
          w,
          h
        ),
      };
    });
  });
  return {
    BILineStyle: 1,
    BILineThickness: 0,
    BILineWidhValue: 0.7,
    BILineWidth: 0,
    BIType: 0,
    frame: buildFrame(
      0 + options.margin,
      0 + options.margin,
      options.width.reduce(sum, 0),
      options.height.reduce(sum, 0)
    ),
    frameTop: false,
    identifier: id(),
    isaacIdentifier: "",
    Rotate: 0,
    TableColumn: options.width.length - 1,
    TableRow: options.height.length - 1,
    TableVertical: false,
    tapeBackgroundColor: WHITE,
    tapeForegroundColor: BLACK,
    tapeTapeFrame: IGNORE_FRAME,
    tapeVertical: false,
    TableCells,
    TIAngle: 0,
    TIFrameLineStyle: 1,
    TIFrameLineWidth: toPx(0.25),
    TIHorizontalLineStyle: 1,
    TIHorizontalLineWidth: toPx(0.25),
    TIIsVertical: false,
    TIVerticalLineStyle: 1,
    TIVerticalLineWidth: 1,
    type: "table",
  };
};

type Options = Width & {
  margin: number;
  width: Mm[];
  height: Mm[];
  text: string[];
};

export const build = (options: Options) => {
  if (!options.text.every((t) => typeof t === "string")) {
    throw new Error("text must be string");
  }

  if (options.text.length !== options.height.length * options.width.length) {
    throw new Error("text length is missing");
  }

  const table = tableDraw({
    margin: options.margin,
    width: options.width,
    height: options.height,
    text: options.text,
  });
  const w = options.width.reduce(sum, 0) + options.margin * 2;
  const h = options.height.reduce(sum, 0) + options.margin * 2;

  return {
    documents: [
      {
        MultiplePage: false,
        SettingsAutoLength: options.isAutoLength,
        SettingsFixedLength: toPx(w),
        SettingsBackgroundColor: WHITE,
        SettingsBackgroundColorName: "白",
        SettingsForegroundColor: BLACK,
        SettingsForegroundColorName: "黒",
        SettingsMargin: 0,
        SettingsPrintableArea: toPx(36),
        SettingsTapeVertical: false,
        SettingsTapeWidth: 36,
        drawers: [table],
        frame: buildFrame(0, 0, w, h),
        identifier: id(),
        name: "Tape",
        printableFrame: buildFrame(0, 0, w, h),
      },
    ],
  };
};
