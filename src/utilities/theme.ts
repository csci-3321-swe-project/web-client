import { extendTheme, ThemeOverride } from "@chakra-ui/react";

const themeOverride: ThemeOverride = {
  components: {
    Text: {
      variants: {
        secondary: {
          fontSize: "sm",
          color: "blackAlpha.600",
        },
      },
    },
    Link: {
      baseStyle: {
        color: "blue.500",
      },
    },
  },
};

const theme = extendTheme(themeOverride);

export default theme;
