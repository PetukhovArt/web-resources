import { createTheme } from "@mui/material";
import { ruRU } from "@mui/x-date-pickers";

declare module "@mui/material/styles" {
   interface Palette {
      neutral: Palette["primary"];
   }

   // allow configuration using `createTheme`
   interface PaletteOptions {
      neutral?: PaletteOptions["primary"];
   }
}

declare module "@mui/material/Button" {
   interface ButtonPropsColorOverrides {
      neutral: true;
   }
}

declare module "@mui/material/Alert" {
   interface AlertPropsColorOverrides {
      neutral: true;
   }
}

export const theme = createTheme(
   {
      palette: {
         mode: "dark",
         background: {
            default: "#121212",
            paper: "#121212",
         },
         primary: {
            light: "#757ce8",
            main: "#3A8CF0",
            dark: "#002884",
            contrastText: "#fff",
         },
         neutral: {
            main: "#2f2f2f",
            contrastText: "#fff",
         },
      },
      typography: {
         fontFamily: ["Roboto Regular", "sans-serif"].join(", "),
         fontSize: 16,
      },
      components: {
         MuiDrawer: {
            styleOverrides: {
               paper: {
                  backgroundColor: "#2F2F2F",
                  border: "none",
               },
            },
         },
         MuiListItemButton: {
            styleOverrides: {
               root: {
                  color: "#9F9F9F",
                  "&.Mui-selected": {
                     backgroundColor: "rgba(58, 140, 240, 0.12)",
                     fontWeight: 600,
                     color: "#3A8CF0",
                     ".MuiListItemIcon-root": {
                        color: "#3A8CF0",
                     },
                  },
               },
            },
         },
         MuiButton: {
            styleOverrides: {
               root: {
                  textTransform: "none",
               },
            },
         },
         MuiTextField: {
            styleOverrides: {
               root: {
                  textTransform: "none",
               },
            },
         },
         MuiTab: {
            styleOverrides: {
               root: {
                  textTransform: "none",
               },
            },
         },
         MuiOutlinedInput: {
            styleOverrides: {
               input: {
                  "&:-webkit-autofill": {
                     WebkitBoxShadow: "0 0 0 100px #121212 inset",
                     WebkitTextFillColor: "#fff",
                     borderRadius: "unset",
                  },
               },
               root: {
                  fontSize: "14px",
               },
            },
         },
         MuiFormControlLabel: {
            styleOverrides: {
               root: {
                  padding: "0",
               },
            },
         },
      },
   },
   ruRU,
);
