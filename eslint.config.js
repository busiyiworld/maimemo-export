import ourongxing from "@ourongxing/eslint-config"

export default ourongxing(
  {
    type: "app",
    react: true,
    stylistic: {
      curly: "off",
    },
    ignores: ["node_modules/**"],
    overrides: {
      react: {
        "react-hooks/exhaustive-deps": "off",
      },
    },
  },
)
