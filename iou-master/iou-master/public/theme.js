// Disable the button ripple effect
const VBtn = Vue.component('VBtn');
VBtn.options.props.ripple.default = false

const theme = {
    options: {
        customProperties: true
    },
    themes: {
        // https://htmlcolorcodes.com/colors/off-white/
        light: {
            primary: "#FFC300",
            secondary: "#581845",
            accent: { base: "#900C3F", lighten1: "#C70039" },
            error: "#FF5733",

            off: { base: "#FAF9F6", darken1: "#f4ede4", lighten1: "#ffffff" },
            purple: "#581845",
            blue: "#097eff",
            yellow: "#FFC300",
            red: "#d7283b",
            green: "#18582b"
        },
        dark: {
            primary: "#FFC300",
            secondary: "#C70039",
            accent: { base: "#900C3F", lighten1: "#C70039" },
            error: "#FF5733",

            off: { base: "#212224", lighten1: "#262629", lighten2: "#323236" },
            purple: "#C70039",
            blue: "#097eff",
            yellow: "#FFC300",
            red: "#d7283b",
            green: "#18582b"
        }
    }
};