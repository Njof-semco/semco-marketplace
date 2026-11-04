import { MantineColorsTuple, createTheme } from "@mantine/core";

const darkMarineBlue: MantineColorsTuple = [
  "#e5ebef",
  "#ccd7de",
  "#99afbd",
  "#66879b",
  "#335f7a",
  "#103447",
  "#0c2837",
  "#091e2a",
  "#06141d",
  "#030a0f",
];

const brightSeaGreen: MantineColorsTuple = [
  "#e6f8f4",
  "#c2ecdf",
  "#9ee0ca",
  "#7ad5b5",
  "#56c9a0",
  "#53C8AE",
  "#3fa288",
  "#2f7a66",
  "#1f5244",
  "#0f2922",
];

const warmOrange: MantineColorsTuple = [
  "#fbeae4",
  "#f5c8b8",
  "#efa68c",
  "#e98460",
  "#e36234",
  "#C86746",
  "#a15238",
  "#793d2a",
  "#50291c",
  "#28140e",
];

const lightBlue: MantineColorsTuple = [
  "#e8f7f9",
  "#c6e9ed",
  "#a3dae2",
  "#80cbd6",
  "#5dbcc9",
  "#5CA9B7",
  "#488690",
  "#366469",
  "#244342",
  "#12211b",
];

const grey: MantineColorsTuple = [
  "#f9f9f9",
  "#f2f2f2",
  "#e6e7e8",
  "#d1d1d1",
  "#bcbcbc",
  "#a7a7a7",
  "#929292",
  "#7f7f7f",
  "#6a6a6a",
  "#555555",
];

// Status colors for result views (success / warning / error).
// Green and red match the Mantine defaults the app was already rendering.
const successGreen: MantineColorsTuple = [
  "#ebfbee",
  "#d3f9d8",
  "#b2f2bb",
  "#8ce99a",
  "#69db7c",
  "#51cf66",
  "#40c057",
  "#37b24d",
  "#2f9e44",
  "#2b8a3e",
];

const warningYellow: MantineColorsTuple = [
  "#fff9e1",
  "#fff3bf",
  "#ffe999",
  "#ffdd66",
  "#ffd43b",
  "#f5c518",
  "#d4a913",
  "#a8850e",
  "#7d6309",
  "#524104",
];

const errorRed: MantineColorsTuple = [
  "#fff5f5",
  "#ffe3e3",
  "#ffc9c9",
  "#ffa8a8",
  "#ff8787",
  "#ff6b6b",
  "#fa5252",
  "#f03e3e",
  "#e03131",
  "#c92a2a",
];

const pink: MantineColorsTuple = [
  "#F0BBDD",
  "#ED9BCF",
  "#EC7CC3",
  "#ED5DB8",
  "#F13EAF",
  "#F71FA7",
  "#FF00A1",
  "#E00890",
  "#C50E82",
  "#AD1374",
];

export const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  headings: { fontFamily: "Inter, sans-serif" },

  colors: {
    brand: darkMarineBlue,
    marine: darkMarineBlue,
    sea: brightSeaGreen,
    orange: warmOrange,
    lightblue: lightBlue,
    grey: grey,
    pink: pink,
    green: successGreen,
    yellow: warningYellow,
    red: errorRed,
  },

  primaryColor: "marine",
  primaryShade: 5,
  radius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  components: {
    Container: {
      styles: {
        root: {
          backgroundColor: "transparent",
           maxWidth: "none",
        },
      },
    },
    // Checkboxes are sea green everywhere; primaryColor (marine) is too dark to read as "ticked".
    Checkbox: {
      defaultProps: {
        color: "sea",
      },
    },
    // House style for every tooltip. Width and wrapping stay local, so short
    // labels are not forced into a wide box; long copy passes multiline w={260}.
    Tooltip: {
      defaultProps: {
        withArrow: true,
        openDelay: 150,
        position: "top-start",
      },
    },
  },
});
