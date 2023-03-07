import { extendTheme, ThemeOverride } from "@chakra-ui/react";

const themeOverride: ThemeOverride = {
  components: {
    Link: {
      baseStyle: {
        color: "blue.500",
      },
    },
  },
};

const theme = extendTheme(themeOverride);

export default theme;
