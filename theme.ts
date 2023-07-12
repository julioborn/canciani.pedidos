import { extendTheme, theme } from "@chakra-ui/react";

export default extendTheme({
    colors: {
        primary: theme.colors["red"]
    },
    styles: {
        global: {
            body: {
                backgroundColor: "primary.500"
            }
        }
    }
})