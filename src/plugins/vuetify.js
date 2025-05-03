import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#4ecdc4",
        secondary: "#38b6ff",
        accent: "#a6e7e2",
        info: "#8cd6ff",
        success: "#3aa39b",
        warning: "#FFC107",
        error: "#FF5252",
      },
    },
  },
});
