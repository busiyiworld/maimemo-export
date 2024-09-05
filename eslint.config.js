import ourongxing from "@ourongxing/eslint-config"

export default ourongxing(
  {
    type: "app",
    react: false,
    stylistic: {
      curly: "off",
    },
    ignores: ["node_modules/**"],
    overrides: { },
  },
)
