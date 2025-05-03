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
<<<<<<< HEAD
        primary: "#4ecdc4",
        secondary: "#38b6ff",
        accent: "#a6e7e2",
        info: "#8cd6ff",
        success: "#3aa39b",
        warning: "#FFC107",
        error: "#FF5252",
=======
        primary: "#007BFF",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
>>>>>>> 4a14e94125fc9e2240d9e3bf2e4b43530e72f46b
      },
    },
  },
});
