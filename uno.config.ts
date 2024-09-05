import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from "unocss"
import { presetScrollbar } from "unocss-preset-scrollbar"

export default defineConfig({
  mergeSelectors: false,
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
    }),
    presetScrollbar(),
  ],
  rules: [],
  shortcuts: {
    "color-base": "color-neutral-800 dark:color-neutral-300",
    "bg-base": "bg-white dark:bg-[#1d1c1c]",
    "border-base": "border-gray-500/30",

    "bg-tooltip": "bg-white:75 dark:bg-neutral-900:75 backdrop-blur-8",
    "bg-glass": "bg-white:75 dark:bg-neutral-900:75 backdrop-blur-5",
    "bg-code": "bg-gray5:5",
    "bg-hover": "bg-primary-400:5",

    "color-active": "color-primary-600 dark:color-primary-400",
    "border-active": "border-primary-600/25 dark:border-primary-400/25",
    "bg-active": "bg-primary-400:10",

    "btn-action": "border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-hover",
    "btn-action-sm": "btn-action text-sm",
    "btn-action-active": "color-active border-active! bg-active op100!",
    "scrollbar-base": "scrollbar scrollbar-track-color-transparent scrollbar-thumb-color-gray-500/30 scrollbar-rounded",
  },
  theme: {
    colors: {
      neutral: {
        50: "#FCFCFD",
        100: "#F9FAFB",
        200: "#F2F4F7",
        300: "#E4E7EC",
        400: "#D0D5DD",
        500: "#98A2B3",
        600: "#667085",
        700: "#475467",
        800: "#344054",
        900: "#1D2939",
        950: "#101828",
      },

      primary: {
        DEFAULT: "#34B49B",
        50: "#EFFAF8",
        100: "#DBF5F0",
        200: "#B8EAE0",
        300: "#88DDCC",
        400: "#51CDB4",
        500: "#34B49B",
        600: "#2FA28B",
        700: "#298E7A",
        800: "#227766",
        900: "#185347",
        950: "#123F36",
      },

      warning: {
        50: "#FFFCF5",
        100: "#FFFAEB",
        200: "#FEF0C7",
        300: "#FEDF89",
        400: "#FEC84B",
        500: "#FDB022",
        600: "#F79009",
        700: "#DC6803",
        800: "#B54708",
        900: "#93370D",
        950: "#7A2E0E",
      },

      success: {
        50: "#F6FEF9",
        100: "#ECFDF3",
        200: "#D1FADF",
        300: "#A6F4C5",
        400: "#6CE9A6",
        500: "#32D583",
        600: "#12B76A",
        700: "#039855",
        800: "#027A48",
        900: "#05603A",
        950: "#054F31",
      },

      rose: {
        50: "#FFF5F6",
        100: "#FFF1F3",
        200: "#FFE4E8",
        300: "#FECDD6",
        400: "#FEA3B4",
        500: "#FD6F8E",
        600: "#F63D68",
        700: "#E31B54",
        800: "#C01048",
        900: "#A11043",
        950: "#89123E",
      },
    },
  },
})
